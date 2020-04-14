//Specifies which REST API request will be allowed
module.exports = app => {
    var houseController = require('../controller/houseController.js');

    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: function(req, file, callback) {
            if(file.fieldname === 'houseImage') {
                callback(null, './images');
            }
            else if(file.fieldname === 'houseModel') {
                callback(null, './models');
            }
            else {
                callback({error: `Fieldname ${file.fieldname} not supported.`});
            }
        },
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    const fileFilter = (req, file, callback) => {
        if(file.fieldname === 'houseImage') {
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
                callback(null, true);
                return;
            } 
        }
        else if(file.fieldname === 'houseModel') {
            if(file.mimetype === 'application/octet-stream') {
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    };

    var upload = multer({storage: storage, fileFilter: fileFilter});
    
    //Post a new house to the "houses" table and upload files
    app.post('/houses', upload.fields([{name: 'houseImage'}, {name: 'houseModel'}]), houseController.create);  

    //Get a list of all houses in the "houses" table
    app.get('/houses', houseController.findAll);

    //Get a list of all houses in the standardHouses table
    app.get('/standardHouses', houseController.findAllStandard);

    //Get a house based on id
    app.get('/houses/:houseId', houseController.findById);    

    //Get image
    app.get('/houses/:houseId/houseImage', houseController.findImage);

    //Get model
    app.get('/houses/:houseId/houseModel', houseController.findModel);

    //Delete all houses
    app.delete('/houses', houseController.deleteAll);

    //Delete one house based on id
    app.delete('/houses/:houseId', houseController.deleteById);

    //Updating house
    //app.patch('/houses/:houseId', houseController.updateHouse);

};