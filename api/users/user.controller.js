const res = require("express/lib/response");
const {resetPassword,getOtpForgotPass,getSlideShow,getFavoriteMovies,getMovieByLanguage,getLanguageItem,getCategoryItem,getMovieByCategory,addWishlistByID,removeWishlistByMovieID,getitems,getPopular,getPopularMovies,exsting,signUp,getUserByID,getUsers,deleteUserByID,updateUser,getUserByUserName,createOtp,verifyOtp} = require("./user.service");
const {countTopRate,getTrending,getTopRate,getMoviesBySearch}= require("./user.service");
const {genSaltSync,hashSync,compareSync}=require("bcrypt");

var userid=0;
const jwt=require("jsonwebtoken");
const {userService} = require("./user.service");
module.exports={
    
    getUserByID:(req,res)=>{
        const id=req.params.id;
        getUserByID(id,(err,results)=>{
            if(err){
                console.log(err);
                return ;
            }
            if(!results){
                return res.json({
                    success:0,
                    message: "Record not Found",
                });
            }
            return res.json({
                    success:1,
                    data: results

            });
        });
    },
    getUsers:(req,res)=>{
       getUsers((err,results)=>{
           if(err){
               console.log(err);
               return ;
           }
           return res.json({
               success:1,
               data: results,
           });
       });
    },
    fetchSlideShow:(req,res)=>{
        getSlideShow((err,results)=>{
           if(err){
               console.log(err);
               return ;
           }
           return res.json({
               success:1,
               data: results,
           });
       });
    },
    updateUser:(req,res)=>{
        const id=req.params.id;

        const body=req.body;
        const salt=genSaltSync(10);
        body.password=hashSync(body.password,salt);
        updateUser(id,body,(err,results)=>{
            if(err){
                console.log(err);
               return ;
            }
            return res.json({
                success:1,
                message: 'update successfully'
            });
        });
    },
    deleteUserByID:(req,res)=>{
        const id=req.params.id;
        deleteUserByID(id,(err,results)=>{
            if(err){
                console.log(err);
               return ;
            }
            return res.json({
                success:1,
                message: 'delete successfully'
            });
        });
    },
    removeWishlist:(uid,req,res)=>{
        var id=0;
        var isMovie=true;
        console.log(req.body.movieID)
        if(req.body.movieID!=undefined){
            id=req.body.movieID;
            isMovie=true;
        }
        if(req.body.tvshowID!=undefined){
            id=req.body.tvshowID;
            isMovie=false;
        }
        removeWishlistByMovieID(uid,id,isMovie,(err,results)=>{
            if(err){
                console.log(err);
               return ;
            }
            console.log("results"+results)
            if(results == true){
                res.status(404).json({
                success:0,
                message: isMovie ? 'this movie are not contains a wishlist':'this show are not contains a wishlist'
            });
            }else{
                return res.json({
                    success:1,
                    message: 'wish list has been removed'
                });
            }
            
        });
    },
    addWishlist:(uid,req,res)=>{
        var id=0;
        var isMovie=true;
        console.log(req.body.movieID)
        if(req.body.movieID!=undefined){
            id=req.body.movieID;
            isMovie=true;
        }
        if(req.body.tvshowID!=undefined){
            id=req.body.tvshowID;
            isMovie=false;
        }
       

        addWishlistByID(uid,id,isMovie,(err,results)=>{
            if(err){
                console.log(err);
               return ;
            }
            if(results==true){
                return res.status(409).json({
                    success:0,
                    message: isMovie ? 'this movie is already contain a wishlist':'this show is already contain a wishlist'
                }); 
            }
                return res.json({
                    success:1,
                    message: 'added wishlist successful'
                });
            
            
        });
    },
    getSlideShow:(req,res)=>{
        getSlideShow(req.body,(results)=>{
                return res.json({
                    message: results
                });
            
            
        });
    },
    login:(req,res)=>{
        const body=req.body;

        getUserByUserName(body.username,(err,results)=>{
            if(err){
                console.log(err);
               return ;
            }
            if(!results){
                return res.status(401).json({
                    success: 0,
                    message: 'Invalid email or password'
            });
            }
            
            const isCorrect=compareSync(body.password,results.password);
            if(isCorrect){
                results.password=undefined;
                // const jsontoken= jwt({result: results},"qwe1234");
                console.log('result.username'+results.username);
                console.log('result.userId'+results.userID);
                const jsontoken = jwt.sign({
                    username: results.username,
                    userId: results.userID 
                  },
                  'SECRETKEY', {
                    expiresIn: '7d'
                  }
                );
                return res.json({
                    success:1,
                    message: 'login successfully',
                    token: jsontoken,
                });
                
            }else{
                return res.status(401).json({
                    success: 0,
                    message: 'Invalid email or password'
            });
            }
            
        });
    },
    signUpUser:(req,res)=>{
        const body=req.body;
        const salt=genSaltSync(10);
        body.password=hashSync(body.password,salt);
        signUp(body,async (err,results)=>{
            if(err){
                console.log(err);
                return res.status(404).json({
                        success: 0,
                        message: err,
                });
            }
            await getUserByUserName(body.username,(err,results)=>{
                if(!results){
                    return res.status(401).json({
                        success: 0,
                        message: 'Invalid username'
                });
                }
                    const jsontoken = jwt.sign({
                        username: results.username,
                        userId: results.userID 
                      },
                      'SECRETKEY', {
                        expiresIn: '7d'
                      }
                    );
                    return res.json({
                        success:1,
                        message: 'your account has been created successful',
                        token: jsontoken,
                    }); 
                
            })
                        
        });
    },
    createNewPassword:(req,res)=>{
        

        const body=req.body;
        const salt=genSaltSync(10);
        body.password=hashSync(body.password,salt);
        resetPassword(body,async(err,results)=>{
            if(err){
                console.log(err);
                return res.status(404).json({
                        success: 0,
                        message: err,
                });
            }
            await getUserByUserName(body.username,(err,results)=>{
                if(err){
                console.log(err);
                return res.status(404).json({
                        success: 0,
                        message: err,
                });
            }
                if(!results){
                    return res.status(401).json({
                        success: 0,
                        message: 'Invalid username'
                });
                }
                    const jsontoken = jwt.sign({
                        username: results.username,
                        userId: results.userID 
                      },
                      'SECRETKEY', {
                        expiresIn: '7d'
                      }
                    );
                    return res.json({
                        success:1,
                        message: 'your password has been reset successfully',
                        token: jsontoken,
                    }); 
                
            })
        });
    },
    sendOtpForgotPass:(req,res,next)=>{
        getOtpForgotPass(req.body,(err,results)=>{
            if(err){
                return res.status(401).send({
                    message: err,
                 });
            }
            console.log("results.length"+results.length)
            if(err){
                console.log("error"+err);
                return ;
            }
            else if(results.toLowerCase() == 'isnotexisting'){
                return res.status(401).send({
                  msg: 'This username is not found!',
                });
              } else{
                return res.status(200).send({
                    message: "The OTP has been sent to your email",
                    data: results
                   });
              }
            
        });
    },
    getOtp:(req,res,next)=>{
        createOtp(req.body,(err,results)=>{
            if(err){
                return res.status(401).send({
                    message: err,
                 });
            }
            console.log("results.length"+results.length)
            if(err){
                console.log("error"+err);
                return ;
            }
            else if(results.toLowerCase() == 'isexisting'){
                return res.status(409).send({
                  msg: 'This username is already in use!',
                });
              } else{
                return res.status(200).send({
                    message: "The OTP has been sent to your email",
                    data: results
                   });
              }
            
        });
    },
    verifyOTP:(req,res,next)=>{
        verifyOtp(req.body,(err,results)=>{
            if(err){
                console.log("error",err);
                return res.status(401).send({
                    message: err,
                 });
            }
            

            return res.status(200).send({
             message: "Success",
             hash: results
            });
        });
    },
    isExisting:(req,res)=>{
        const body=req.body;
        exsting(body,(err,results)=>{
            if(err){
                console.log(err);
                return ;
            }
            if(results.length ==0){
                return res.status(200).send({
                    message: "username are not existing",
                   });
            }
            return res.status(404).send({
                message: "username has already been created, please try another",
               });
               
        });
    },
    searchMovies:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
        await getMoviesBySearch(body.searchName,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            if(results.length !=0){
                            itemdata= await getitems(uid,results)
                            
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
          
          
    },
    popularMovies:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        await getPopular(page,body,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            itemdata= await getitems(uid,results)
                            if(results.length !=0){
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
          
          
    },
    languageItems:(req,res)=>{
        getLanguageItem((err,results)=>{
            if(err){
                console.log(err);
                return res.json({
                    success:0,
                    err: err,
                });
            }
            return res.json({
                success:1,
                data: results,
            });
        });
    },
    categoryItems:(req,res)=>{
        getCategoryItem((err,results)=>{
            if(err){
                console.log(err);
                return res.json({
                    success:0,
                    err: err,
                });
            }
            return res.json({
                success:1,
                data: results,
            });
        });
    },
    getTopRateMovie:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        var totalPage=0;
        await countTopRate(async(err,results)=>{
            if(err){
                console.log(err);
                
                return ;
            }
            console.log(results[0].count);
            totalPage=Math.ceil((results[0].count/10));
        });

        console.log("(totalPage)"+totalPage);
        
        await getTopRate(page,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            itemdata= await getitems(uid,results)
                            if(results.length !=0){
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    total_page: totalPage,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    total_page: 0,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
    },
    getTrendingMovie:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        await getTrending(page,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            if(results.length !=0){
                            itemdata= await getitems(uid,results)
                            
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
    },
    favoriteMovies:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        await getFavoriteMovies(uid,page,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            itemdata= await getitems(uid,results)
                            if(results.length !=0){
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
    },
    categoryMovies:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log('categoryMovies page='+page);
        if(body.categoryID==undefined){
            res.status(404).send({
                success: 0,
                message: 'Your categoryID is undefined'

                        });
                        return ;
                        
        }
        await getMovieByCategory(page,body,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            
                            itemdata= await getitems(uid,results)
                            if(results.length !=0){
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: results.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
    },
        languageMovies:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        if(body.languageID==undefined){
            res.status(404).send({
                success: 0,
                message: 'Your languageID is undefined'

                        });
                        return ;
                        
        }
        await getMovieByLanguage(page,body,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            itemdata= await getitems(uid,results)
                            if(results.length !=0){
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    item_count: 0,
                                    result: []
    
                                            });
                            }
                           
                          } catch (error) {
                            throw error;
                          }
                    }
        });
    },
   
    

    
    
}
