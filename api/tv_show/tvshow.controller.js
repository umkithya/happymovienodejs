const res = require("express/lib/response");

// var userid=0;
// const jwt=require("jsonwebtoken");
const {getFavoriteTvshow,getTvshowBySearch,getAlltvshow,getTvShowItems,getTrendingtvshow,getTvShowDetail,getTvShowItemDetail} = require("./tvshow.service");
const {countAlltvshow,countFavoriteTvshow,countTrendingtvshow} = require("./tvshow.service");
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
        var totalPage=0;
        await countAlltvshow(async(err,results)=>{
            if(err){
                console.log(err);
                
                return ;
            }
            console.log(results[0].count);
            totalPage=Math.ceil((results[0].count/10));
        });

        console.log("(totalPage)"+totalPage);
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
                                    total_page:totalPage,
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
    fetchFavoriteTvshow:async(uid,req,res)=>{
        console.log('userid'+uid);
        // const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        
        console.log("(page)"+page);
        var totalPage=0;
        await countFavoriteTvshow(uid,async(err,results)=>{
            if(err){
                console.log(err);
                
                return ;
            }
            console.log(results[0].count);
            totalPage=Math.ceil((results[0].count/10));
        });

        console.log("(totalPage)"+totalPage);
        await getFavoriteTvshow(uid,page,async(err,results)=>{
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
                                    total_page:totalPage,
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
    trendingTvShow:async(uid,req,res)=>{
        console.log('userid'+uid);
        // const body=req.body;
         page=req.query.page;
        if(page==undefined){
            page=0;
        }
        console.log("(page)"+page);
        var totalPage=0;
        await countTrendingtvshow(async(err,results)=>{
            if(err){
                console.log(err);
                
                return ;
            }
            console.log(results[0].count);
            totalPage=Math.ceil((results[0].count/10));
        });

        console.log("(totalPage)"+totalPage);
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
                                    total_page:totalPage,
                                    item_count: itemdata.length,
                                    result: itemdata
    
                                            });
                            }else{
                                res.status(200).send({
                                    success: 1,
                                    page_number: req.query.page,
                                    total_page:0,
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
