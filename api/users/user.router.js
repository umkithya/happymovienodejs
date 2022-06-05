

const {createUser,getUserByID,getUsers,updateUser,deleteUserByID, login} = require("./user.controller");
const router = require("express").Router();
router.post("/",createUser);
router.get("/",getUsers);
router.get("/:id",getUserByID);
router.put("/:id",updateUser);
router.delete("/:id",deleteUserByID);
router.delete("/login",login);


module.exports=router;