/*************************************************************
* Script connecting the database to the server          *
**************************************************************/
require("dotenv").config();
const mysql = require("mysql"); 
const MySQLStore = require('express-mysql-session');

//Creating a connection to the database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,    
    password: process.env.DB_PASS,    
    database: process.env.MYSQL_DB

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