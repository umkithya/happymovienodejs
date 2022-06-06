const pool=require("../../config/database");
const otpGenerator= require("otp-generator");
const crypto = require=("crypto");
const key="otp-secret-key";



module.exports={
 create:(data,callBack)=>{
     pool.query('INSERT INTO tbuser(username, password) VALUES (?,?)',[
         data.username,
         data.password,
     ],
     (error,result ,fields)=>{
         if(error){
            return callBack(error);
         }
         return callBack(null,result);
     }
     );
 }, 
 getUsers: callBack=>{
     pool.query(
         'SELECT userID,username, password FROM tbuser',
         [],
        (error,result ,fields)=>{
            if(error){
               return callBack(error);
            }
            return callBack(null,result);
        }
     );
 },
 getUserByID:(userid,callBack) =>{
    pool.query(
        'SELECT userID, username, password FROM tbuser WHERE userID=?',
        [userid],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
updateUser:(userID,data,callBack) =>{
    pool.query(
        'UPDATE tbuser SET username=?,password=? WHERE userID=?',
        [data.username,data.password,userID],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
deleteUserByID:(userID,callBack) =>{
    pool.query(
        'DELETE FROM `tbuser` WHERE userID=?',
        [userID],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
getUserByUserName:(username,callBack) =>{
    pool.query(
        'SELECT * FROM tbuser WHERE username=?',
        [username],
       (error,result ,fields)=>{
           if(error){
              return callBack(error);
           }
           return callBack(null,result[0]);
       }
    );
},
createOtp:(params,callBack)=>{
    const otp=otpGenerator.generate(4,{
        alphabets:false,
        upperCase: false,
        specialChars: false
    });

    const ttl=2*60*1000;
    const expires=Date.now()+ttl;
    const data= '${params.phone}.${otp}.${expires}';
    const hash= crypto.createHmac("sha256",key).update(data).digest("hex");
    const fullHash='${hash}.${expires}';
    console.log('Your OTP is ${otp}');
    return callBack(null,fullHash);
},
verifyOTP:(params,callBack)=>{
    let [hashValue,expires]=params.hash.split('.');
    let now=Date.now();
    if(now> parseInt(expires)) return callBack("OTP Expired");
    let data='${params.phone}.${params.otp}.${expires}';
    let newCalculateHash=crypto
    .createHmac('sha256',key)
    .update(data)
    .digest("hex");
    if(newCalculateHash==hashValue){
     return callBack(null,"Verify Success");
    }return callBack("Invalid OTP");
 
 }
        
};


