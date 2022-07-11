
const router = require("express").Router();
const {addWishlist,removeWishlist,popularMovies,isExisting,signUpUser,getUserByID,getUsers,updateUser,deleteUserByID, login,getOtp,verifyOTP} = require("./user.controller");
const { checkToken } = require("../../auth/token_validation");
var userid =require("./user.controller");

// router.post("/",checkToken,createUser);
router.get("/",checkToken,getUsers);
router.get("/:id",checkToken,getUserByID);
router.put("/:id",checkToken,updateUser);
router.delete("/:id",checkToken,deleteUserByID);
router.post("/login",login);
router.post("/getotp",getOtp);
router.post("/verify",verifyOTP);
router.post("/signup",signUpUser);
router.post("/existing",isExisting);
// router.post("/popular-movies",checkToken,popularMovies);
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