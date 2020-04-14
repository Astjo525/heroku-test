var sql = require('../connection/db.js');

//Constructor houseModel
const House = function(newHouse) {
    this.houseName = newHouse.houseName,
    this.houseInfo = newHouse.houseInfo,
    this.houseImage = newHouse.houseImage,
    this.houseModel = newHouse.houseModel
}

//Adding a new house to the "houses" table
House.add = (newHouse, result) => {
    sql.query("INSERT INTO houses SET ?", newHouse, (err, res) => {
        if(err) {
            console.log(err);
            result(err, null);
            return;
        }
    result(null, { id: res.insertId, ...newHouse });
    });
};

//Retrieving all houses from the "houses" table
House.getAll = result => {
    sql.query("SELECT * FROM houses", (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
    result(null, res);
    });
};

//Retrieving all houses from the "houses" table
House.getAllStandard = result => {
    sql.query("SELECT house_id, collection_name, rooms, " +
    "floors, living_area, build_area, height, roof_angle, roof_type_name, " +
    "short_info, long_info, house_image, house_model " +
    "FROM standard_houses " +
    "INNER JOIN collections USING (collection_id) " +
    "INNER JOIN roof_types USING (roof_type_id)", (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
    result(null, res);
    });
};

//Retrieving a house by Id from the database
House.getById = (id, result) => {
    //Sql query to retrieve house with id
    sql.query(`SELECT * FROM houses WHERE houseId = ${id}`, (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
        //If there is no house with that id, error will be "NotFound"
        if(res.length == 0) {
            result("notFound", null);
            return;
        }
    result(null, res);
    });
};

//Retrieving an image from house id
House.getImage = (id, result) => {
    sql.query(`SELECT houseImage FROM houses WHERE houseId = ${id}`, (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
        //If there is no house with that id, error will be "NotFound"
        if(res.length == 0) {
            result("notFound", null);
            return;
        }
    result(null, res[0].houseImage);
    });
}

//Retrieving a model from house id
House.getModel = (id, result) => {
    sql.query(`SELECT houseModel FROM houses WHERE houseId = ${id}`, (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
        //If there is no house with that id, error will be "NotFound"
        if(res.length == 0) {
            result("notFound", null);
            return;
        }
    result(null, res[0].houseModel);
    });
}

//Function deleting all houses
House.removeAll = result => {
    sql.query("DELETE FROM houses", (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
    result(null, res);
    });
}

//Function deleting house with id
House.removeById = (id, result) => {
    sql.query(`DELETE FROM houses WHERE houseId = ${id}`, (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
        //Checking if there is a house with that id
        if(res.length === 0) {
            result(`notFound`, null);
            return;
        }
    result(null, res); 
    });
}

//Updating a house
/*
House.update = (id, values, result) => {
    sql.query("UPDATE houses SET houseName = ? WHERE id = ?", [values, id], (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
        if(res.length === 0) {
            result(`notFound`, null);
            return;
        }
    result(null, res);
    });
} */


module.exports = House;