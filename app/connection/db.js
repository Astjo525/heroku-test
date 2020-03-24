//Script connecting the database to the server

const mysql = require("mysql"); 

//Creating a connection to the databaser
//createPool
const connection = mysql.createPool({
    host: "eu-cdbr-west-02.cleardb.net",
    user: "bf6652f839f5d9",
    password: "4eead042",
    database: "heroku_af4f9f69f37b397"
});

//Opening the connection the MySQL
/*connection.connect(error => {
    if(error) {
        console.log("An error occurred when connecting to the database.")
        throw error;
    }
    console.log("Successfully connected to the database");
});*/

module.exports = connection;