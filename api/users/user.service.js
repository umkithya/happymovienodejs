const pool=require("../../config/database");




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
};