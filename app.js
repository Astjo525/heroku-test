require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const pageRouter = require('./routes/pages');
const TWO_HOURS = 1000*60*60*2;

//Setting which port to connect to
const port = process.env.PORT || 3000;

//LÄGGER TILL SEQUELIZESTORE TILL SESSIONS
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: "eu-cdbr-west-02.cleardb.net",
    port: port,
    user: "bf6652f839f5d9",
    password: "4eead042",
    database: "heroku_af4f9f69f37b397"
}

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_name',
    secret: 'session_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))

// //Express Session Middleware
// app.use(session({
//     name: "sid", //process.env.SESS_NAME,
//     resave: false,
//     saveUninitialized: false,
//     secret: "abc123", //process.env.SESS_SECRET,

//     cookie: {
//         maxAge: TWO_HOURS, 
//         samSite: true, 
//         secure: process.env.NODE_ENV === 'production' 
//         //TODO: secure: enable https - enable TLS connection to server 
// 	}
// }));

app.use(express.json());

//routes
app.use('/', pageRouter);

app.listen(port, () => {
    console.log("Connected to port " + port);
});