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
        password: "",
        database: "happymovie",
        connectionLimit: 10
    });
   
    
    module.exports = pool;


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