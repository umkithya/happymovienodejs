const {createPool} = require("mysql");

const pool = createPool({
        host: "us-cdbr-east-06.cleardb.net",
        user: "bd6bf9cdcc6ea8",
        password: "75a29b38",
        database: "heroku_57cb13615807d7d",
        connectionLimit: 10
    });
// const pool = createPool({
//         host: "localhost",
//         user: "root",
//         password: "",
//         database: "happymovie",
//         connectionLimit: 10
//     });
   
    
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