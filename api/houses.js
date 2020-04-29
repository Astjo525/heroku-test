const db = require("../db");
const { hashSync, compareSync } = require("bcrypt");

let getHouseByHouseName = (house_name) => {
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

//Kallas i: post('/houses/user')
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
    //Kallas i: get('/houses/user'), get('houses/personal')
    getPersonalHouses : (user_id) => {
        return new Promise(async (resolve, reject) => {
            db.query({
                sql: 
                    'SELECT house_name, ' +
                            'image_link, ' +
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

    //Kallas i: post('/houses/user')
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

    //Kallas i: post('/houses/user')
    //Gör just nu att error ges om man sätter in två bilder av samma namn. Ska man istället asigna samma id till dubletten?
    insertImage : (house_image) => {
        return new Promise(async (resolve, reject) => {
            if((await getImageId(house_image)).length != 0) {
                resolve(false);
            }
            db.query({ 
                sql: 'INSERT INTO `personal_houses_images`(image_link) VALUES (?)',
                values: [image_link],
            }, (error, result) => {
                if(error) {
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    //Kallas i: post('/houses/user')
    createHouse : (body, admin_id) => {
        return new Promise( async (resolve, reject) => {
            if((await getHouseByHouseName(body.house_name)).length != 0) {
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

    //Kallas i: delete('/houses/user'), patch('/houses')
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

    //Kallas i: delete('/houses/user');
    deleteHouse : (query) => {

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

    //Kallas i: patch('/houses')    
    updateHouse : (query, admin_id) => {
 
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
}