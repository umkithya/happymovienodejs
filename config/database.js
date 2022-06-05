const {createPool} =require("mysql");
const pool = createPool({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b26e6d391a74a0",
    password: "94496ae7",
    database: "heroku_99e3cab4ce08f19",
    connectionLimit: 10
});
module.exports=pool;