//Script to connect to the server

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Setting which port to connect to
const port = 3000;

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

app.listen(port, () => {
    console.log("Connected to port " + port);
});
