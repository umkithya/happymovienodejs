
var pool = require("../../config/database");


module.exports={
    async gettvshow(page,param,callBack){
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
    async getTvShowItems(uid,gettvshow){
        // let category = [];
        var gettvshow_tagdataset = [];
        if(gettvshow.length > 0){
            for (var i = 0; i < gettvshow.length; i++) {
                var row = gettvshow[i];
                console.log("getpopular["+i+"]"+gettvshow[i]['movieID']);
                var gettvshowmap = {};
                console.log(''+row['movieID']);
                gettvshowmap.movieID = row['movieID'];
                gettvshowmap.movieTitle = row['movieTitle'];
                gettvshowmap.quality = row['quality'];
                gettvshowmap.rate = row['rate'];
                gettvshowmap.imageUrl = row['imageUrl'];
                gettvshowmap.thumbnailUrl = row['thumbnailUrl'];
                gettvshowmap.releaseDate = row['releaseDate'];
                gettvshowmap.overview = row['overview'];
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
               
                gettvshowmap.serverList=list;
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
               
                gettvshowmap.categorys=list;
            }catch(e){
                console.log("eeeee"+e)
            }
            try{
                const result=await filterWishListByMovieID(uid,movieID);
                console.log("filterWishList"+result.length)
                if(result.length >0){
                    gettvshowmap.wish_list=true;
                    console.log("filterWishList True")
                }else{
                    gettvshowmap.wish_list=false;
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
            
            gettvshow_tagdataset.push(gettvshowmap);
            }
            
            return gettvshow_tagdataset;
        }else{
            return null;
        }
       
    },
}


