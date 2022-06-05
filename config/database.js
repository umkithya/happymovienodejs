const {createPool} =require("mysql");
const pool = createPool({
    port: 3306,
    host: "36.37.185.92",
    user: "umkit_happymovie",
    password: "Kithya123@",
    database: process.env.MYSQL_DB,
    connectionLimit: 10
});
module.exports=pool;