require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const pageRouter = require('./routes/pages');
const TWO_HOURS = 1000*60*60*2;

//Setting which port to connect to
const port = process.env.PORT || 3000;

//Express Session Middleware
app.use(session({
    name: "sid", //process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: "abc123", //process.env.SESS_SECRET,

    cookie: {
        maxAge: TWO_HOURS, 
        samSite: true, 
        secure: process.env.NODE_ENV === 'production',
        secure: true
        //TODO: secure: enable https - enable TLS connection to server 
	}
}));

app.use(express.json());

//routes
app.use('/', pageRouter);

app.listen(port, () => {
    console.log("Connected to port " + port);
});