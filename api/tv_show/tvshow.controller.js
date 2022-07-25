const res = require("express/lib/response");

// var userid=0;
// const jwt=require("jsonwebtoken");
const {getFavoriteTvshow,getTvshowBySearch,getAlltvshow,getTvShowItems,getTrendingtvshow,getTvShowDetail,getTvShowItemDetail} = require("./tvshow.service");
module.exports={
    tvshowDetail:async(req,res)=>{
        var body=req.body;
        await getTvShowDetail(body.tvshowID,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            if(results.length !=0){
                            itemdata= await getTvShowItemDetail(results)
                            
                                res.status(200).send({
                                    success: 1,
                                    result: itemdata
    
                                });
                           
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    result: []
                                    
    
                                });
                            }
                          } catch (error) {
                            throw error;
                          }
                    }
        });
    },
    allTvShow:async(uid,req,res)=>{
        console.log('userid'+uid);
        // const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        await getAlltvshow(page,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            itemdata= await getTvShowItems(uid,results)
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
    fetchFavoriteTvshow:async(uid,req,res)=>{
        console.log('userid'+uid);
        // const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        await getFavoriteTvshow(page,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            if(results.length !=0){
                            itemdata= await getTvShowItems(uid,results)
                            
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
    trendingTvShow:async(uid,req,res)=>{
        console.log('userid'+uid);
        // const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        await getTrendingtvshow(page,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            itemdata= await getTvShowItems(uid,results)
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
    searchTvshow:async(uid,req,res)=>{
        console.log('userid'+uid);
        const body=req.body;
        await getTvshowBySearch(body.searchName,async(err,results)=>{
            if(err){
                        console.log(err);
                        return ;
                    }else{
                        
                        try {
                            if(results.length !=0){
                            itemdata= await getTvShowItems(uid,results)
                           
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
