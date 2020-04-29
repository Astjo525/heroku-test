const db = require("../db");
const { hashSync, compareSync } = require("bcrypt");

let getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query({ 
            sql: 'SELECT username FROM `users` WHERE username = ?',
            values: [username],
        }, (error, result) => {
            if(error){
                reject(error);
            }
            console.log(result);
            resolve(result);
        })
    });
} 

module.exports = {
    //Kallas i: post('login/web')
    loginWeb : (username, password) => {
        return new Promise( async (resolve, reject) => {
            db.query({ 
                sql: 'SELECT password FROM `administrators` WHERE `username` = ?',
                values: [username]
            }, (error, result) => {
                if(error){
                    reject(error);
                }
                if(result.length == 0){
                    resolve(false);
                    return;
                } 

                if(password == result[0].password || compareSync(password, result[0].password)) {
                    resolve(result);
                }

               resolve(false);
            })
        });
    },

    //Kallas i: post('login/web')
    getAdminIdByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.query({ 
                sql: 'SELECT admin_id FROM `administrators` WHERE username = ?',
                values: [username],
            }, (error, result) => {
                if(error){
                    reject(error);
                }
                console.log("RESULT: ", result[0].admin_id);
                resolve(result[0].admin_id);
            })
        });
    }, 

    //Kallas i: get('/home')
    getAdminNameById : (admin_id) => {
        return new Promise ((resolve, reject) => {
            db.query({
                sql: 'SELECT username FROM `administrators` WHERE admin_id = ?',
                values: [admin_id],
            }, (error, user) => {
                if(error) {
                    reject(error);
                }
                resolve(user[0].username); 
               }
            )
        });
    },

    //Kallas i: post('/register')
    registerUser : (body, admin_id) => {
        console.log(body)

        let regpwd = body.password;
        let hash = hashSync(regpwd, 10); 

        console.log("USERNAME: ", body.username);

        return new Promise( async (resolve, reject) => {
                if((await getUserByUsername(body.username)).length != 0){
                    resolve(false);
                    return;
                }
                db.query({
                    sql: 'INSERT INTO `users`(username, password, admin_id) VALUES (?, ?, ?)',
                    values: [body.username, hash, admin_id]
                }, (error, result) => {
                    if(error){
                        reject(error);
                    }
                    resolve(result);
                });
        })
    },

    //Kallas i: get('/edit')
    getUsers : (admin_id) => {
        return new Promise ((resolve, reject) => {
            db.query({
                sql: 'SELECT user_id, username FROM `users` WHERE admin_id = ?',
                values: [admin_id],
            }, (error, results) => {
                if(error) {
                    reject(error);
                }
                resolve(results);
               }
            )
        });
    },

    //Kallas i: get('/edit'), patch('/edit'), delete('/edit'), post('/houses/user')
    getUserById : (id, admin_id) => {
        return new Promise ((resolve, reject) => {
            db.query({
                sql: 'SELECT user_id, username FROM `users` WHERE user_id = ? AND admin_id = ?',
                values: [id, admin_id],
            }, (error, user) => {
                if(error) {
                    reject(error);
                }
                resolve(user[0]); 
               }
            )
        });
    },

    //Kallas i: patch('/edit')
    updateUser : (query, admin_id) => {
       let newpass = query.password;
       let newhash = hashSync(newpass, 10); 

        return new Promise((resolve, reject) => {
            db.query({
                sql: 'UPDATE `users` SET password=? WHERE user_id = ? AND admin_id = ?',
                values: [newhash, query.id, admin_id]
            }, (error, result) => {
                if(error) {
                    reject(error);
                }
                resolve(result);
               });
        })   
    },
    
    //Kallas i: delete('/edit')
    deleteUser : (query, admin_id) => {

         return new Promise((resolve, reject) => {
             db.query({
                 sql: 'DELETE FROM `users` WHERE user_id = ? AND admin_id = ?',
                 values: [query, admin_id]
             }, (error, result) => {
                 if(error) {
                     reject(error);
                 }
                 resolve(result);
                });
         })   
     },

}

