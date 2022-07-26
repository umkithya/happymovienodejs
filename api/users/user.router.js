
const router = require("express").Router();
const {getTopRateMovie,getTrendingMovie,searchMovies,createNewPassword,sendOtpForgotPass,fetchSlideShow,favoriteMovies,languageMovies,languageItems,categoryItems,categoryMovies,addWishlist,removeWishlist,popularMovies,isExisting,signUpUser,getUsers,updateUser,deleteUserByID, login,getOtp,verifyOTP} = require("./user.controller");
const {checkToken } = require("../../auth/token_validation");
const {fetchFavoriteTvshow,searchTvshow,allTvShow,trendingTvShow,tvshowDetail}= require("../tv_show/tvshow.controller");
var userid =require("./user.controller");

// router.post("/",checkToken,createUser);
router.get("/",checkToken,getUsers);
router.put("/:id",checkToken,updateUser);
router.delete("/:id",checkToken,deleteUserByID);
router.post("/login",login);
router.post("/getotp",getOtp);
router.post("/verify",verifyOTP);
router.post("/signup",signUpUser);
router.post("/existing",isExisting);
router.get("/languages",languageItems);
router.get("/categorys",categoryItems);
router.get("/slide-show",fetchSlideShow);
router.post("/forgot-otp",sendOtpForgotPass);
router.post("/forgot-pass",createNewPassword);
// router.post("/popular-movies",checkToken,popularMovies);
router.post("/language-movies",checkToken, async(req, res, next) => {
    
    await languageMovies(req.decoded['userId'],req, res);
    
});
router.post("/category-movies",checkToken, async(req, res, next) => {
    
    await categoryMovies(req.decoded['userId'],req, res);
    
});
router.post("/popular-movies",checkToken, async(req, res, next) => {
    
  await popularMovies(req.decoded['userId'],req, res);
  
});
  router.post("/removie-wishlist",checkToken, async(req, res, next) => {
    
    await removeWishlist(req.decoded['userId'],req, res);
    
  });
  router.post("/add-wishlist",checkToken, async(req, res, next) => {
    
    await addWishlist(req.decoded['userId'],req, res);
    
  });
  router.get("/favourite-movies",checkToken, async(req, res, next) => {
    
    await favoriteMovies(req.decoded['userId'],req, res);
    
  });
  router.post("/search-movies",checkToken, async(req, res, next) => {
    
    await searchMovies(req.decoded['userId'],req, res);
    
  });
  router.get("/trending-movies",checkToken, async(req, res, next) => {
    
    await getTrendingMovie(req.decoded['userId'],req, res);
    
  });
  router.get("/top-rate",checkToken, async(req, res, next) => {
    
    await getTopRateMovie(req.decoded['userId'],req, res);
    
  });
 //TV show Block 
 router.get("/tvshows",checkToken, async(req, res, next) => {
    
  await allTvShow(req.decoded['userId'],req, res);
  
});

 router.get("/favourite-tvshows",checkToken, async(req, res, next) => {
    
  await fetchFavoriteTvshow(req.decoded['userId'],req, res);
  
});
 router.get("/trending-tvshows",checkToken, async(req, res, next) => {
    
  await trendingTvShow(req.decoded['userId'],req, res);
  
});
router.post("/search-tvshows",checkToken, async(req, res, next) => {
    
  await searchTvshow(req.decoded['userId'],req, res);
  
});
router.post("/tvshow-detail",checkToken,tvshowDetail);
//admin

module.exports=router;