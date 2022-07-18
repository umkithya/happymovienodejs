
var pool = require("../../config/database");

async function filterWishListByTvShowID(userID,tvshowID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM tbuser JOIN tbtvshowwishlist w ON tbuser.userID = w.userID JOIN tbtvshow t ON w.tvshowID = t.tvshowID WHERE tbuser.userID="+userID+" AND w.tvshowID="+tvshowID+";",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
} 
async function getSeason(tvshowID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT `seasonID`, `seasonName` FROM `tbseason` WHERE tvshowID="+tvshowID+"",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
}
async function getEpidsode(seasonID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT `episodeID`, `episodeName` FROM `tbepisode` WHERE seasonID="+seasonID+"",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
}
async function getServer(movieID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM `tbepisodeserver` WHERE episodeID="+movieID+"",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
}
async function getCategory(tvshowID){
    return new Promise(function(resolve, reject) {
        pool.query("SELECT tbcategory.categoryID,tbcategory.categoryName FROM tbtvshowcategory INNER JOIN tbcategory ON tbcategory.categoryID=tbtvshowcategory.categoryID WHERE tbtvshowcategory.tvshowID="+tvshowID+"",(error,result)=>{
            if(error){
               return ;
            }
            return resolve(result);
        });
        
      });
    
}

module.exports={
    async getTvShowDetail(tvshowID,callBack){
        
            return pool.query("SELECT `tvshowID`, `tvshowTitle` FROM `tbtvshow` WHERE tvshowID=?",[tvshowID],(error,result)=>{
                if(error){
                   return callBack(error);
                }
                return callBack(null,result);
            });
        
    },
    
    async getTvShowItemDetail(gettvshow){
        // let category = [];
        var gettvshow_tagdataset = [];
        if(gettvshow.length > 0){
            for (var i = 0; i < gettvshow.length; i++) {
                var row = gettvshow[i];
                var gettvshowmap = {};
                console.log(''+row['tvshowID']);
                gettvshowmap.tvshowID = row['tvshowID'];
                gettvshowmap.tvshowTitle = row['tvshowTitle'];
               
                var tvshowID=row['tvshowID'];
                try{
                    const result= await getSeason(tvshowID);
                    console.log("result"+result.length)
                    let list=[];
                    for (const element of result) {
                        var season = {};
                        season.seasonID=element['seasonID'];
                        season.seasonName=element['seasonName'];
                       var seasonID=element['seasonID'];
                       
                        const result= await getEpidsode(seasonID);
                        var episodelist=[];
                        for (const element of result) {
                            var episode = {};
                            episode.episodeID=element['episodeID'];
                            episode.episodeName=element['episodeName'];
                            var episodeID=element['episodeID'];
                            const result= await getServer(episodeID);
                            var serverList=[];

                            for (const element of result) {
                                var server = {};
                                server.serverUrl=element['serverUrl'];
                                server.enUrlSRT=element['enUrlSRT'];
                                server.khUrlSRT=element['khUrlSRT'];
                                serverList.push(server)
                            }
                            episode.serverList=serverList;
                            episodelist.push(episode)
                        }
                        season.episodeList=episodelist;
                        list.push(season)
                    }
                    
                    gettvshowmap.seasonList=list;
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
    async getAlltvshow(page,callBack){
        if(page!=0){
            const limit = 10;
            var pages = page;
            var offset = (pages - 1) * limit
            console.log("pages========"+pages)
            return pool.query("SELECT tbtvshow.tvshowID,tbtvshowdetail.tvshowDetailsID,tbtvshow.tvshowTitle,tbtvshowdetail.quality,tbtvshowdetail.rate,tbtvshowdetail.imageUrl,tbtvshowdetail.thumbnailUrl,tbtvshowdetail.releaseDate,tbtvshowdetail.overview FROM (tbtvshow INNER JOIN tbtvshowdetail ON tbtvshow.tvshowID = tbtvshowdetail.tvshowID) ORDER BY tvshowID limit ? OFFSET ?;",[limit,offset],(error,result)=>{
                if(error){
                   return callBack(error);
                }
                return callBack(null,result);
            });
        }else{
            return pool.query("SELECT tbtvshow.tvshowID,tbtvshowdetail.tvshowDetailsID,tbtvshow.tvshowTitle,tbtvshowdetail.quality,tbtvshowdetail.rate,tbtvshowdetail.imageUrl,tbtvshowdetail.thumbnailUrl,tbtvshowdetail.releaseDate,tbtvshowdetail.overview FROM (tbtvshow INNER JOIN tbtvshowdetail ON tbtvshow.tvshowID = tbtvshowdetail.tvshowID) ORDER BY tvshowID;",(error,result)=>{
                if(error){
                   return callBack(error);
                }
                return callBack(null,result);
            });
        }  
    },
    async getTrendingtvshow(page,callBack){
        if(page!=0){
            const limit = 10;
            var pages = page;
            var offset = (pages - 1) * limit
            console.log("pages========"+pages)
            return pool.query("SELECT tbtvshow.tvshowID,tbtvshowdetail.tvshowDetailsID,tbtvshow.tvshowTitle,tbtvshowdetail.quality,tbtvshowdetail.rate,tbtvshowdetail.imageUrl,tbtvshowdetail.thumbnailUrl,tbtvshowdetail.releaseDate,tbtvshowdetail.overview FROM (tbtvshow INNER JOIN tbtvshowdetail ON tbtvshow.tvshowID = tbtvshowdetail.tvshowID) WHERE tbtvshow.isTrending = 1 ORDER BY tvshowID limit ? OFFSET ?;",[limit,offset],(error,result)=>{
                if(error){
                   return callBack(error);
                }
                return callBack(null,result);
            });
        }else{
            return pool.query("SELECT tbtvshow.tvshowID,tbtvshowdetail.tvshowDetailsID,tbtvshow.tvshowTitle,tbtvshowdetail.quality,tbtvshowdetail.rate,tbtvshowdetail.imageUrl,tbtvshowdetail.thumbnailUrl,tbtvshowdetail.releaseDate,tbtvshowdetail.overview FROM (tbtvshow INNER JOIN tbtvshowdetail ON tbtvshow.tvshowID = tbtvshowdetail.tvshowID) WHERE tbtvshow.isTrending = 1 ORDER BY tvshowID;",(error,result)=>{
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
                var gettvshowmap = {};
                console.log(''+row['tvshowID']);
                gettvshowmap.tvshowID = row['tvshowID'];
                gettvshowmap.tvshowTitle = row['tvshowTitle'];
                gettvshowmap.quality = row['quality'];
                gettvshowmap.rate = row['rate'];
                gettvshowmap.imageUrl = row['imageUrl'];
                gettvshowmap.thumbnailUrl = row['thumbnailUrl'];
                gettvshowmap.releaseDate = row['releaseDate'];
                gettvshowmap.overview = row['overview'];
                var tvshowID=row['tvshowID'];
           
                try{
                    const result=await getCategory(tvshowID);
                    console.log("result"+result.length)
                    let list=[];
                    result.forEach(element => {
                        var category={}
                        category.categoryID=element['categoryID'];
                        category.categoryName=element['categoryName']
                        list.push(category)
                        
                    });
                   
                    gettvshowmap.categorys=list;
                    gettvshowmap.recommendID=list[Math.floor(Math.random()*list.length)]['categoryID'];;
                }catch(e){
                    console.log("eeeee"+e)
                }
            
            
            try{
                const result=await filterWishListByTvShowID(uid,tvshowID);
                console.log("filterWishList"+result.length)
                if(result.length >0){
                    gettvshowmap.wish_list=true;
                    console.log("filterWishList True")
                }else{
                    gettvshowmap.wish_list=false;
                    console.log("filterWishList false")
                }
                
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


