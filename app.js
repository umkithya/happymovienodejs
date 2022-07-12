var pool = require("./config/database");
require("dotenv").config();

const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
// const sqlite3 = require('sqlite3');
  
// Connecting Databas

app.use(express.json());
if(pool.state == 'connected'){
console.log('connect false')
  }else{
console.log('connect success')

  }
  
app.get("/",(req,res)=>{
    getServer()
    res.status(200).send({
        message: "Success",
        hash: results
       });
})
app.use("/api/users",userRouter);
app.listen(process.env.PORT || 5000,()=>{
    
    console.log("Server is up and listening on:"+process.env.PORT)
    
    })
    
    

