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
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sequelize = new SequelizeStore(
    "database",
    "username",
    "password", {
        "dialect": "sqlite",
        "storage": "./session.sqlite"
});

var mySessionStore = new SequelizeStore({
    db: sequelize
});

mySessionStore.Sync();

app.use(session({
    secret: 'secret',
    store: mySessionStore,
    resave: false,
    proxy: true
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