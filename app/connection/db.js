//Script connecting the database to the server

const mysql = require("mysql"); 

//Creating a connection to the databaser
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "anebyhusdb"
});

//Opening the connection the MySQL
connection.connect(error => {
    if(error) {
        console.log("An error occurred when connecting to the database.")
        throw error;
    }
    console.log("Successfully connected to the database");
});

module.exports = connection;