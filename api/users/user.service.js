
var pool = require("../../config/database");
const otpGenerator = require('otp-generator')
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const format = require('html-format');
const { Console } = require("console");
const { off } = require("process");


const html = `\
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Happy Movie OTP Verifications</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for subscibe Happy Movie. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
`;



const key="otp-secret-key";
async function getCategory(movieID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT tbcategory.categoryName FROM `tbmoviecategory` INNER JOIN tbcategory ON tbcategory.categoryID=tbmoviecategory.categoryID WHERE tbmoviecategory.movieID="+movieID+"",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
}
async function getServer(movieID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM `tbserver` WHERE movieID="+movieID+"",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
}
async function filterWishListByMovieID(userID,movieID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM tbuser JOIN tbwishlist w ON tbuser.userID = w.userID JOIN tbmovies t ON w.movieID = t.movieID WHERE tbuser.userID= "+userID+" AND w.movieID="+movieID+";",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
} 
async function isExistingWishList(userID,movieID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM tbwishlist WHERE movieID="+movieID+" AND userID="+userID+";",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
} 

module.exports={
    exsting:(data,callBack)=>{
        pool.query("SELECT `username` FROM `tbuser` WHERE username=?",[
            data.username,
        ],
        (error,result ,fields)=>{
            if(error){
               return callBack(error);
            }
            return callBack(null,result);
        }
        );
    }, 
 signUp:(data,callBack)=>{
     pool.query('INSERT INTO tbuser(username, password) VALUES (?,?)',[
         data.username,
         data.password,
     ],
     (error,result)=>{
         
         if(error){
            return callBack(error);
         }
         return callBack(null,result);
     }
     );
 }, 
 getUsers: callBack=>{
     pool.query(
         'SELECT userID,username, password FROM tbuser',
         [],
        (error,result ,fields)=>{
            if(error){
               return callBack(error);
            }
            return callBack(null,result);
        }
     );
 },
 getUserByID:(userid,callBack) =>{
    pool.query(
        'SELECT userID, username, password FROM tbuser WHERE userID=?',
        [userid],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
updateUser:(userID,data,callBack) =>{
    pool.query(
        'UPDATE tbuser SET username=?,password=? WHERE userID=?',
        [data.username,data.password,userID],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
deleteUserByID:(userID,callBack) =>{
    pool.query(
        'DELETE FROM `tbuser` WHERE userID=?',
        [userID],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
getUserByUserName:(username,callBack) =>{
    pool.query(
        'SELECT * FROM tbuser WHERE username=?',
        [username],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
getSlideShow:(callBack) =>{
    pool.query(
        'SELECT `slideshowID`, `imageSlideUrl` FROM `tbslideshow`',
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result);
       }
    );
},

createOtp: async(_params,callBack)=>{
    console.log(_params.username);
    pool.query(
        "SELECT `username` FROM `tbuser` WHERE username=?",[_params.username],(err, result)=> { 
            
            console.log(result.length);
            if(err){
                console.log('Errorrrrrrrrrrr');
                return callBack(error);
             }
           else if (result.length !=0) {
            return callBack(null,'isExisting');
          } else {
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false ,digits:true,lowerCaseAlphabets:false});
    console.log('Your OTP is',otp);


    const ttl= 5*60*1000;
    const expires=Date.now()+ttl;
    const data= `${_params.username}.${otp}.${expires}`;
    const hash= crypto.createHmac('sha256',key).update(data).digest('hex');
    const fullHash=`${hash}.${expires}`;
    console.log(fullHash);

    console.log(_params.username);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ahpolojoykhrealzin@gmail.com',
      pass: 't z q a l r e o h g b h n l x s',
    },
    
  });

  const options={
      from:"ahpolojoykhrealzin@gmail.com",
      to: ""+_params.username,
      subject: "Happy Movie App Account Verification OTP",
      html: html+otp+'\
     </h2><p style="font-size:0.9em;">Regards,<br />Your Brand</p><hr style="border:none;border-top:1px solid #eee" /><div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"><p>Your Brand Inc</p>'
      +'<p>1600 Amphitheatre Parkway</p>'
      +'<p>California</p></div></div></div>'
  }

  // send mail with defined transport object
  transporter.sendMail(options,function (err,info){
      if(err){
        console.log(err);
        return;
      }
      console.log("send:",info.response);
  })

//   console.log(info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return callBack(null,fullHash);
    } 
} )
},
verifyOtp: async (params,callBack)=> {
    let [hashValue,expires]=params.hash.split('.');
    let now=Date.now();
    if(now> parseInt(expires)) {
        return callBack("OTP Expired");

    }
    let data=`${params.username}.${params.otp}.${expires}`;
    let newCalculateHash=crypto.createHmac('sha256',key).update(data).digest('hex');
    if(newCalculateHash==hashValue){
     return callBack(null,"Verify Success");
    }
    return callBack("Invalid OTP");
 },
 getPopularMovies:(param,callBack) =>{
    
    pool.query(
        "SELECT tbmovies.movieID,movieTitle,tbmoviedetails.quality,categoryID,categoryID2,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.m3u8Url,tbmoviedetails.thumbnailUrl,tbmoviedetails.enUrlSRT,tbmoviedetails.khUrlSRT,tbmoviedetails.releaseDate FROM (tbmovies INNER JOIN tbmoviedetails ON tbmovies.movieID = tbmoviedetails.movieID) WHERE tbmoviedetails.rate >= "+param.rate+" AND YEAR(tbmoviedetails.releaseDate) BETWEEN ? AND ? AND EXISTS (SELECT tbseason.movieID FROM tbseason WHERE tbseason.movieID<>tbmovies.movieID) ORDER BY movieID;",
        [param.start,param.end],
       (error,result)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result);
       }
    );
},
async removeWishlistByMovieID(uid,param,callBack){
    console.log('param.movieID=========='+param.movieID);
    console.log('uid========'+uid);
    return pool.query("DELETE FROM `tbwishlist` WHERE movieID=? AND userID=?;",[param.movieID,uid],(error,result)=>{
        if(error){
            return callBack(error);
         }
         else if(result.affectedRows == 0){
            console.log('result.affectedRows========'+result.affectedRows);
            return callBack(null,true);
         }else{
            console.log('result.affectedRows========'+result.affectedRows);

            return callBack(null,result[0]);

         }
    });
   
},

async addWishlistByID(uid,param,callBack){
    console.log('param.movieID=========='+param.movieID);
    console.log('uid========'+uid);
    const result=await isExistingWishList(uid,param.movieID);
    if(result.length ==0){
        return pool.query("INSERT INTO `tbwishlist` (`movieID`, `userID`) VALUES ('?', '?');",[param.movieID,uid],(error,results)=>{
            if(error){
                return callBack(error);
             }
             
    
                return callBack(null,results[0]);
    
           
        });
    }else{
        //this movies is already contain wishlist
        return callBack(null,true);
    }
    
   
},
getLanguageItem: callBack=>{
    pool.query('SELECT * FROM `tblanguage` ORDER BY tblanguage.languageID;',[],(error,result)=>{
       if(error){
           return callBack(error);
        }
        return callBack(null,result);
   });
},
getCategoryItem: callBack=>{
     pool.query('SELECT * FROM `tbcategory` ORDER BY tbcategory.categoryName;',[],(error,result)=>{
        if(error){
            return callBack(error);
         }
         return callBack(null,result);
    });
},
async getFavoriteMovies(uid,page,callBack){
    if(page!=0){
        const limit = 2;
        var pages = page;
        var offset = (pages - 1) * limit
        console.log("pages========"+pages)
    return pool.query('SELECT tbmovies.movieID,tbmovies.movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.thumbnailUrl,tbmoviedetails.releaseDate,tbmoviedetails.overview,tbwishlist.wishlistID FROM (((tbmovies INNER JOIN tbmoviedetails ON tbmoviedetails.movieID=tbmovies.movieID) INNER JOIN tbwishlist ON tbwishlist.movieID=tbmovies.movieID) INNER JOIN tbuser ON tbuser.userID=tbwishlist.userID) WHERE tbuser.userID=? ORDER BY tbwishlist.wishlistID limit ? OFFSET ?;',[uid,limit,offset],(err,result)=>{
        if(error){
            return callBack(error);
         }
         return callBack(null,result);
    });}else{
        console.log('TRUEEEEEEEEEEEEEEEEEE')
        return pool.query('SELECT tbmovies.movieID,tbmovies.movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.thumbnailUrl,tbmoviedetails.releaseDate,tbmoviedetails.overview,tbwishlist.wishlistID FROM (((tbmovies INNER JOIN tbmoviedetails ON tbmoviedetails.movieID=tbmovies.movieID) INNER JOIN tbwishlist ON tbwishlist.movieID=tbmovies.movieID) INNER JOIN tbuser ON tbuser.userID=tbwishlist.userID) WHERE tbuser.userID=? ORDER BY tbwishlist.wishlistID',[uid],(error,result)=>{
            if(error){
                return callBack(error);
             }
        console.log("result length========"+result.length)

             return callBack(null,result);
        });
    }
},
async getMovieByCategory(page,param,callBack){
    if(page!=0){
        const limit = 2;
        var pages = page;
        var offset = (pages - 1) * limit
        console.log("pages========"+pages)
    return pool.query('SELECT tbmovies.movieID,movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.thumbnailUrl,tbmoviedetails.releaseDate,tbmoviedetails.overview FROM ((tbmovies INNER JOIN tbmoviedetails ON tbmoviedetails.movieID=tbmovies.movieID) INNER JOIN tbmoviecategory ON tbmoviecategory.movieID=tbmovies.movieID) WHERE tbmoviecategory.categoryID=? ORDER BY tbmovies.movieID limit ? OFFSET ?;',[param.categoryID,limit,offset],(err,result)=>{
        if(error){
            return callBack(error);
         }
         return callBack(null,result);
    });}else{
        console.log('TRUEEEEEEEEEEEEEEEEEE')
        return pool.query('SELECT tbmovies.movieID,movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.thumbnailUrl,tbmoviedetails.releaseDate,tbmoviedetails.overview FROM ((tbmovies INNER JOIN tbmoviedetails ON tbmoviedetails.movieID=tbmovies.movieID) INNER JOIN tbmoviecategory ON tbmoviecategory.movieID=tbmovies.movieID) WHERE tbmoviecategory.categoryID=? ORDER BY tbmovies.movieID',[param.categoryID],(error,result)=>{
            if(error){
                return callBack(error);
             }
        console.log("result length========"+result.length)

             return callBack(null,result);
        });
    }
},
async getMovieByLanguage(page,param,callBack){
    if(page!=0){
        const limit = 2;
        var pages = page;
        var offset = (pages - 1) * limit
        console.log("pages========"+pages)
    return pool.query('SELECT tbmovies.movieID,movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.thumbnailUrl,tbmoviedetails.releaseDate,tbmoviedetails.overview FROM ((tbmovies INNER JOIN tbmoviedetails ON tbmoviedetails.movieID=tbmovies.movieID) INNER JOIN tbmovielanguage ON tbmovielanguage.movieID=tbmovies.movieID) WHERE tbmovielanguage.languageID=? ORDER BY tbmovies.movieID limit ? OFFSET ?;',[param.languageID,limit,offset],(err,result)=>{
        if(error){
            return callBack(error);
         }
         return callBack(null,result);
    });}else{
        console.log('TRUEEEEEEEEEEEEEEEEEE')
        return pool.query('SELECT tbmovies.movieID,movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.thumbnailUrl,tbmoviedetails.releaseDate,tbmoviedetails.overview FROM ((tbmovies INNER JOIN tbmoviedetails ON tbmoviedetails.movieID=tbmovies.movieID) INNER JOIN tbmovielanguage ON tbmovielanguage.movieID=tbmovies.movieID) WHERE tbmovielanguage.languageID=? ORDER BY tbmovies.movieID;',[param.languageID],(error,result)=>{
            if(error){
                return callBack(error);
             }
        console.log("result length========"+result.length)

             return callBack(null,result);
        });
    }
},

async getPopular(page,param,callBack){
    if(page!=0){
        const limit = 2;
        var pages = page;
        var offset = (pages - 1) * limit
        console.log("pages========"+pages)
        return pool.query("SELECT tbmovies.movieID,tbmoviedetails.movieDetailsID,movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.m3u8Url,tbmoviedetails.thumbnailUrl,tbmoviedetails.enUrlSRT,tbmoviedetails.khUrlSRT,tbmoviedetails.releaseDate,tbmoviedetails.overview FROM (tbmovies INNER JOIN tbmoviedetails ON tbmovies.movieID = tbmoviedetails.movieID) WHERE tbmoviedetails.rate >= ? AND YEAR(tbmoviedetails.releaseDate) BETWEEN ? AND ? ORDER BY movieID limit ? OFFSET ?;",[param.rate,param.start,param.end,limit,offset],(error,result)=>{
            if(error){
               return callBack(error);
            }
            return callBack(null,result);
        });
    }else{
        return pool.query("SELECT tbmovies.movieID,tbmoviedetails.movieDetailsID,movieTitle,tbmoviedetails.quality,tbmoviedetails.rate,tbmoviedetails.imageUrl,tbmoviedetails.m3u8Url,tbmoviedetails.thumbnailUrl,tbmoviedetails.enUrlSRT,tbmoviedetails.khUrlSRT,tbmoviedetails.releaseDate,tbmoviedetails.overview FROM (tbmovies INNER JOIN tbmoviedetails ON tbmovies.movieID = tbmoviedetails.movieID) WHERE tbmoviedetails.rate >= ? AND YEAR(tbmoviedetails.releaseDate) BETWEEN ? AND ? ORDER BY movieID;",[param.rate,param.start,param.end,],(error,result)=>{
            if(error){
               return callBack(error);
            }
            return callBack(null,result);
        });
    }  
},




async getitems(uid,getpopular){
    // let category = [];
    var getpopular_tagdataset = [];
    if(getpopular.length > 0){
        for (var i = 0; i < getpopular.length; i++) {
            var row = getpopular[i];
            console.log("getpopular["+i+"]"+getpopular[i]['movieID']);
            var getpopulars = {};
            console.log(''+row['movieID']);
            getpopulars.movieID = row['movieID'];
            getpopulars.movieTitle = row['movieTitle'];
            getpopulars.quality = row['quality'];
            getpopulars.rate = row['rate'];
            getpopulars.imageUrl = row['imageUrl'];
            getpopulars.thumbnailUrl = row['thumbnailUrl'];
            getpopulars.releaseDate = row['releaseDate'];
            getpopulars.overview = row['overview'];
            var movieID=row['movieID'];
       
        
        try{
            const result=await getServer(movieID);
            console.log("result"+result.length)
            let list=[];
            
            result.forEach(element => {
                var getserver = {};
                getserver.serverUrl=element['serverUrl'];
                getserver.enUrlSRT=element['enUrlSRT'];
                getserver.khUrlSRT=element['khUrlSRT'];
                list.push(getserver)
            });
           
            getpopulars.serverList=list;
        }catch(e){
            console.log("eeeee"+e)
        }
        try{
            const result=await getCategory(movieID);
            console.log("result"+result.length)
            let list=[];
            result.forEach(element => {
                list.push(element['categoryName'])
            });
           
            getpopulars.categorys=list;
        }catch(e){
            console.log("eeeee"+e)
        }
        try{
            const result=await filterWishListByMovieID(uid,movieID);
            console.log("filterWishList"+result.length)
            if(result.length >0){
                getpopulars.wish_list=true;
                console.log("filterWishList True")
            }else{
                getpopulars.wish_list=false;
                console.log("filterWishList false")
            }
            // let list=[];
            // result.forEach(element => {
            //     list.push(element['categoryName'])
            // });
           
            // getpopulars.categorys=list;
        }catch(e){
            console.log("eeeee"+e)
        }
        
            getpopular_tagdataset.push(getpopulars);
        }
        
        return getpopular_tagdataset;
    }else{
        return null;
    }
   
},

};


