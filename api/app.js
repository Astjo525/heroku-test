const db = require("../db");
const { hashSync, compareSync } = require("bcrypt");

module.exports = {
    //Kallas i: post('login/app')
    loginApp : (username, password) => {
        return new Promise( async (resolve, reject) => {
            db.query({ 
                sql: 'SELECT password FROM `users` WHERE `username` = ?',
                values: [username]
            }, (error, result) => {
                if(error){
                    reject(error);
                }
                if(result.length == 0){
                    resolve(false);
                    return;
                }
                if(compareSync(password, result[0].password)|| password == result[0].password) 
                {
                    resolve(result);
                }
               resolve(false);
            })
        });
    },

    //Kallas i: post('login/app')
    getUserIdByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.query({ 
                sql: 'SELECT user_id FROM `users` WHERE username = ?',
                values: [username],
            }, (error, result) => {
                if(error){
                    reject(error);
                }
                console.log("RESULT: ", result[0].user_id);
                resolve(result[0].user_id);
            })
        });
    },

    //Kallas i: get('/houses/standard')
    getStandardHouses : () => {
        return new Promise(async (resolve, reject) => {
            db.query({
                sql: 
                    'SELECT house_id, ' +
                            'collection_name, ' +
                            'house_name, ' +
                            'rooms, ' +
                            'floors, ' +
                            'living_area, ' +
                            'build_area, ' +
                            'height, ' +
                            'roof_angle, ' +
                            'roof_type_name, ' +
                            'short_info, ' +
                            'long_info, ' + 
                            'house_image, ' +
                            'house_model ' +
                    'FROM standard_houses ' +
                        'INNER JOIN collections USING (collection_id) ' +
                        'INNER JOIN roof_types USING (roof_type_id) ' +
                    'ORDER BY house_name',
                values: []
            }, (error, results) => {
                if(error) {
                    reject(error);
                }
                resolve(results);
            });
       })
    },
}