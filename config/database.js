const {createPool} =require("mysql");
const pool = createPool({
    host: "sql101.epizy.com",
    user: "epiz_31891119",
    password: "a123456Kk",
    database: "epiz_31891119_happymovie",
    connectionLimit: 10
});
module.exports=pool;