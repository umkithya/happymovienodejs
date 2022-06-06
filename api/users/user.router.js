
const router = require("express").Router();
const {createUser,getUserByID,getUsers,updateUser,deleteUserByID, login,otpSignUp,verifyOTP} = require("./user.controller");
const { checkToken } = require("../../auth/token_validation");

router.post("/",checkToken,createUser);
router.get("/",checkToken,getUsers);
router.get("/:id",checkToken,getUserByID);
router.put("/:id",checkToken,updateUser);
router.delete("/:id",checkToken,deleteUserByID);
router.post("/login",login);
router.post("/getotp",otpSignUp);
router.post("/verify",verifyOTP);


module.exports=router;