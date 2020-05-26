require("dotenv").config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const pageRouter = require('./routes/routes');
const { sessionStore } = require('./db.js');

//Setting which port to connect to
const port = process.env.PORT || 3000;

//Express Session Middleware
app.use(session({
    key: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());

let cors = function(req, res, next) {
    let accessPorts = [
        'http://localhost:3000',
        //'https://kandidat-frontend-gh0dkoimn.now.sh/',
        'https://kandidat-test.herokuapp.com/'
    ]

    let origin = req.headers.origin;
    if (accessPorts.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    let origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Allow-Headers','Origin, Content-type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS');
    next()
}
app.use(cors);

//routes
app.use('/', pageRouter);

app.listen(port, () => {
    console.log("Connected to port " + port);
});