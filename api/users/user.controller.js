const res = require("express/lib/response");
const {create,getUserByID,getUsers,deleteUserByID,updateUser} = require("./user.service");
const {genSaltSync,hashSync}=require("bcrypt");
module.exports={
    createUser:(req,res)=>{
        const body=req.body;
        const salt=genSaltSync(10);
        body.password=hashSync(body.password,salt);
        create(body,(err,results)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                        success:0,
                        message: "Database connection fail"
                });
            }
            return res.status(200).json({
success:1,
data: results
            });
        });
    },
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
    
}