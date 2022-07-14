
const router = require("express").Router();
const {languageMovies,languageItems,categoryItems,categoryMovies,addWishlist,removeWishlist,popularMovies,isExisting,signUpUser,getUsers,updateUser,deleteUserByID, login,getOtp,verifyOTP,getSlideShow} = require("./user.controller");
const { checkToken } = require("../../auth/token_validation");
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
router.get("/slide-show",getSlideShow);
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
  


module.exports=router;