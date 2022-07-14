const {createPool} = require("mysql");
// // const pool = createPool({
// //     host: "remotemysql.com",
// //     user: "uJFVT3fNHG",
// //     password: "RDgKFaqoPg",
// //     database: "uJFVT3fNHG",
// //     connectionLimit: 10
// // });
const pool = createPool({
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "happymovie",
        connectionLimit: 10,
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    });
   
    
module.exports = pool;

pool.getConnection((err,connection)=> {
    if(err)
    throw err;
    console.log('Database connected successfully');
    connection.release();
  });
// const mysql = require("mysql");

// const connection = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "",
//     database: "happymovie",
//     debug: false,
// multipleStatements: true
// });
// connection.connect();
// module.export = connection;