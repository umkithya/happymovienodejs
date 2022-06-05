require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");


app.use(express.json());
app.get("/",(req,res)=>{
    console.log("HELLO")
    res.send("HELLO WORLD+++++++++++")
})
app.use("/api/users",userRouter);
app.listen(process.env.PORT || 5000,()=>{
    
    console.log("Server is up and listening on:"+process.env.PORT)
    
    })
    
    

