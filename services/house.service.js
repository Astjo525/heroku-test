const { db } = require("../db");
const { hashSync, compareSync } = require("bcrypt");

let checkValidHouseName = (house_name) => {
    return new Promise((resolve, reject) => {
        db.query({ 
            sql: 'SELECT house_name FROM `personal_houses` WHERE house_name = ?',
            values: [house_name],
        }, (error, result) => {
            if(error){
                reject(error);
            }
            console.log("RES: ", result);
            resolve(result);
        })
    });
} 

let getImageId = (house_image) => {
    return new Promise((resolve, reject) => {
        db.query({ 
            sql: 'SELECT image_id FROM `personal_houses_images` WHERE house_image = ?',
            values: [house_image],
        }, (error, result) => {
            if(error){
                reject(error);
            }
            resolve(result);
        })
    });
}

module.exports = {

    listPersonalHouses : (user_id) => {

        return new Promise(async (resolve, reject) => {
            db.query({
                sql: 
                    'SELECT house_name, ' +
                            'house_image, ' +
                            'house_model ' +
                    'FROM personal_houses ' +
                        'INNER JOIN personal_houses_images USING (image_id) ' +
                    'ORDER BY house_name',
                values: [user_id],
            }, (error, results) => {
                if(error) {
                    reject(error);
                }
                resolve(results);
            })
       });
    },

    insertImage : (house_image) => {
        return new Promise(async (resolve, reject) => {
            if((await getImageId(house_image)).length != 0) {
                resolve(false);
            }
            db.query({ 
                sql: 'INSERT INTO `personal_houses_images`(house_image) VALUES (?)',
                values: [house_image],
            }, (error, result) => {
                if(error) {
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    getImageId: (house_image) => {
        return new Promise((resolve, reject) => {
            db.query({ 
                sql: 'SELECT image_id FROM `personal_houses_images` WHERE house_image = ?',
                values: [house_image],
            }, (error, result) => {
                if(error){
                    reject(error);
                }
                resolve(result[0].image_id);
            })
        });
    },

    upload : (body, admin_id) => {
        return new Promise( async (resolve, reject) => {
            if((await checkValidHouseName(body.house_name)).length != 0) {
                resolve(false);
            }
            db.query({
                sql: 'INSERT INTO `personal_houses`(house_name, image_id, house_model, user_id) VALUES (?, ?, ?, ?)',
                values: [body.house_name, body.image_id, body.house_model, admin_id],
            }, (error, result) => {
                if(error){
                    reject(error);
                }
                resolve(result);
            });
    })
    },

    getHouseById : (house_id, user_id) => {
        return new Promise ((resolve, reject) => {
            db.query({
                sql: 'SELECT house_id, house_name FROM `personal_houses` WHERE house_id = ?',
                values: [house_id],
            }, (error, house) => {
                if(error) {
                    reject(error);
                }
                resolve(house[0]); 
               }
            )
        });
    },

    update : (query, admin_id) => {
 
        return new Promise((resolve, reject) => {
            db.query({
                sql: 'UPDATE `personal_houses` SET house_name=? WHERE house_id = ?',
                values: [query.house_name, query.id]
            }, (error, result) => {
                if(error) {
                    reject(error);
                }
                resolve(result);
               });
        })   
    },

    removeHouse : (query) => {

        return new Promise((resolve, reject) => {
            db.query({
                sql: 'DELETE FROM `personal_houses` WHERE house_id = ?',
                values: [query]
            }, (error, result) => {
                if(error) {
                    reject(error);
                }
                resolve(result);
               });
        })   
    },
}