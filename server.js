//Script to connect to the server

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();

//Setting which port to connect to
const port = process.env.PORT || 3000;

//Making sure the files are available
app.use('/images', express.static('images'));
app.use('/models', express.static('models'));

// Parse requests of type json
app.use(bodyParser.json());

//Parse requets of type: form-urlenconded
app.use(bodyParser.urlencoded({extended:true}));

//Simple GET request to print something on main page
app.get('/', (req, res) => {
    res.json(`Hello!`);
});

require("./app/routes/houseRoutes.js")(app);

//MERGED DB
require("dotenv").config();
const session = require('express-session');
const pageRouter = require('./routes/pages');
const TWO_HOURS = 1000*60*60*2;

//Express Session Middleware
app.use(session({
    name: "sid", //process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: "abc123", //process.env.SESS_SECRET,

    cookie: {
        maxAge: TWO_HOURS, 
        samSite: true, 
        secure: process.env.NODE_ENV === 'production' 
        //TODO: secure: enable https - enable TLS connection to server 
	}
}));

require("./routes/pages.js")(app);

app.use(express.json());

//routes
app.use('/', pageRouter);

//SLUT MERGED DB

app.listen(port, () => {
    console.log("Connected to port " + port);
});
