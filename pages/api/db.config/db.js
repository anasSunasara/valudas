import mysql from "mysql2";


const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"valudas",

})
const db = pool.promise();
console.log(db)

export default db;


