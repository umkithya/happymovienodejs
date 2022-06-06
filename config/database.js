const {createPool} =require("mysql");
const pool = createPool({
    host: "sql.freedb.tech",
    user: "freedb_freedbumkithya",
    password: "@&53nUZ2%hZMZZj",
    database: "freedb_happymovie",
    connectionLimit: 10
});
module.exports=pool;