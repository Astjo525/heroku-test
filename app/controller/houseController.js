var House = require('../model/houseModel.js');

//Function to create a new house
exports.create = (req, res) =>{
    console.log(req.files);
    console.log(req.files.houseImage);
    //Making sure all fields are filled in
    if(!req.body) {
        err.status(400).send( {
            message: err.message || "Warning: Empty content."
        })
    }

    //Creating new house with the values filled in from req.body
    const newHouse = new House({
        houseName: req.body.houseName,
        houseInfo: req.body.houseInfo,
        houseImage: req.files.houseImage[0].path,        
        houseModel:  req.files.houseModel[0].path
    });

    //Calling the cretae function from houseModel, to put the house in the db
    House.add(newHouse, (err, data) => {
        if(err) res.status(500).send("There was an error when adding the house.");
        else res.send(data);
    });
}

//Function to get all the houses. Calls getAll, which does an SQL query, and handles error.
exports.findAll = (req, res) => {
    House.getAll((err, data) => {
        if(err) res.status(500).send("There was an error when retrieving the houses.");
        else res.send(data);
    });
};  

//Function to get all the houses. Calls getAll, which does an SQL query, and handles error.
exports.findAllStandard = (req, res) => {
    House.getAllStandard((err, data) => {
        if(err) res.status(500).send("There was an error when retrieving the houses.");
        else res.send(data);
    });
};  

//Function to get one house by Id. Checks for error and calls function that does an SQL query.
exports.findById = (req, res) => {
    //Call function that does SQL request
    House.getById(req.params.houseId, (err, data) => {
        if(err) {
            //If there is no such Id
            if(err === "notFound") res.status(404).send(`There is no house with Id ${req.params.houseId}`);
            //If there is an internal server error
            else res.status(500).send("There was an error when retrieving the house.");
        }
        else res.send(data);
    });
}

//Function to find model
exports.findImage = (req, res) => {
    House.getImage(req.params.houseId, (err, data) => {
        if(err) {
             //If there is no such Id
             if(err === "notFound") res.status(404).send(`There is no house with Id ${req.params.houseId}`);
             //If there is an internal server error
             else res.status(500).send("There was an error when retrieving the image.");
        }
        else res.redirect(data);
    }); 
}

//Function to find model
exports.findModel = (req, res) => {
    House.getModel(req.params.houseId, (err, data) => {
        if(err) {
            //If there is no such Id
            if(err === "notFound") res.status(404).send(`There is no house with Id ${req.params.houseId}`);
            //If there is an internal server error
            else res.status(500).send("There was an error when retrieving the model.");
        }
        else res.redirect(data);
    })
}

//Function to delete all houses
exports.deleteAll = (req, res) => {
    House.removeAll((err, data) => {
        if(err) res.status(500).send("There was an error when deleting the houses.");
        else res.send("Everything was deleted");
    });
}

exports.deleteById = (req, res) => {
    House.removeById(req.params.houseId, (err, data) => {
        if(err) {
            if(err === "notFound") res.status(404).send(`There is no house with id ${req.params.houseId}.`);
            else res.status(500).send("There was an error while deleting the house");
        } 
        else res.send(`House with id ${req.params.houseId} was deleted.`);
    });
}

/*
exports.updateHouse = (req, res) => {
    const updatedValues = req.params.houseName;
    House.update(req.params.houseId, updatedValues, (err, data) => {
        if(err) {
            if(err === "notFound") res.status(404).send(`There is no house with id ${req.params.houseId}.`);
            else res.status(500).send("There was an error while updating the house");
        }
        else res.send(`House with id ${req.params.houseId} was updated to:\n ${res}`);
    });
} */

