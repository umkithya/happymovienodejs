const res = require("express/lib/response");
const {create,getUserByID,getUsers,deleteUserByID,updateUser,getUserByUserName} = require("./user.service");
const {genSaltSync,hashSync,compareSync}=require("bcrypt");

const {sign}=require("jsonwebtoken");
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
    login:(req,res)=>{
        const body=req.body;

        getUserByUserName(body.username,(err,results)=>{
            if(err){
                console.log(err);
               return ;
            }
            if(!results){
                return res.json({
                    success:0,
                    message: 'Invalid email or password'
                });
            }
            
            const result=compareSync(body.password,results.password);
            if(result){
                result.password=undefined;
                const jsontoken=sign({result:results},"qwe1234");
                return res.json({
                    success:1,
                    message: 'login successfully',
                    token:jsontoken,
                });
            }else{
                return res.json({
                    success:0,
                    data: 'Invalid email or password',
                });
            }
            
        });
    },
    
}