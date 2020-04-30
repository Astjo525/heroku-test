/*************************************************************
* Script connecting the database to the server          *
**************************************************************/

const mysql = require("mysql"); 
var MySQLStore = require('express-mysql-session');

//Creating a connection to the database
const db = mysql.createPool({
    host: "eu-cdbr-west-02.cleardb.net",
    user: "bf6652f839f5d9",      
    password: "4eead042",    
    database: "heroku_af4f9f69f37b397"

    // port: "3306",
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "merged_db"
});

var options = {
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    connectionLimit: 1,
    endConnectionOnClose: true,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}

var sessionStore = new MySQLStore(options, db);

module.exports = { db , sessionStore };