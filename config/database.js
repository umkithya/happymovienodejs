const {createPool} =require("mysql");
const pool = createPool({
    host: "remotemysql.com",
    user: "uJFVT3fNHG",
    password: "RDgKFaqoPg",
    database: "uJFVT3fNHG",
    connectionLimit: 10
});
module.exports=pool;