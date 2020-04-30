
const { login,
        getAdminIdByUsername,
        getAdminNameById,
        register,
        listUsers,
        getUserById,
        update,
        removeUser } = require('../services/admin.service');


//----------ADMIN-HANDLER----------//

module.exports = {

    loginAdmin: async (req, res) => {

        let result = await login(req.body.username, req.body.password);
        if(!result){
            return res.status(400).json({
                success: 0,
                data: "Wrong username or password!" 
            });
        } else {
            let id = await getAdminIdByUsername(req.body.username);
            req.session.admin_id = id; //Ändrade till id för den inloggade istället för user

            return res.status(200).json({
                success: 1,
                admin_id: req.session.admin_id
            });
        }
    },

    //KOM IHÅG: username skickas till frontend
    getAdmin: async (req, res) => {

        let user = await getAdminNameById(req.session.admin_id);
        return res.status(200).json({
            success: 1,
            username: user
        }); 
    },

    registerUser: async (req,  res) => {

        let userInput = {
            username: req.body.username.trim(),
            password: req.body.password.trim()
        };

        let result = await register(userInput, req.session.admin_id);

        if(!result){
            return res.status(400).json({
                success: 0,
                data: "User already exists!" 
            });
        } 
        else {
            return res.status(200).json({
                success: 1,
                data: "Successfully created a user!"
            });
        }
    },

    getUsers: async (req, res) => {

        //If there is no id passed in URL:
        if(req.query.id == null){
            
            let result = await listUsers(req.session.admin_id);

            if(!result){
                return res.status(400).json({
                    success: 0,
                    data: "There are no users in db!" 
                });
            }
            return res.status(200).json({
                success: 1,
                users: result
            });
        }

        //If id is passed in URL:
        const id = req.query.id;
        let user = await getUserById(id, req.session.admin_id);

        if(!user){
            return res.status(400).json({
                success: 0,
                data: "No user of that id in db!" 
            });
        } 
        return res.status(200).json({
            success: 1,
            userdata: user
        });
    },

    updateUser: async (req, res) => { 

        if(req.body.password == ""){
            return res.status(400).json({
                success: 0,
                data: "You left field empty, please type in all required fields!" 
            });
        }

        if(!req.query.id) {
            return res.status(400).json({
                success: 0,
                data: "Please select user to update info!" 
            });
        }

        const queryid = req.query.id;
        let user = await getUserById(queryid, req.session.admin_id);

        if(!user){
            return res.status(400).json({
                success: 0,
                data: "No user of that id in db!" 
            });
        } 

        let updatedInfo = {
            id: queryid,
            password: req.body.password
        };

        let result = await update(updatedInfo, req.session.admin_id);

        if(!result){
            return res.status(400).json({
                success: 0,
                data: "Failed to update user!" 
            });
        } 
        return res.status(200).json({
            success: 1,
            data: result
        });
    },

    deleteUser: async (req, res) => { 

        //If NO Id passed from URL
        if(!req.query.id) {
            return res.status(400).json({
                success: 0,
                data: "Please select user to delete!" 
            });
        }

        //If Id is passed from URL
        const query = req.query.id;
        let user = await getUserById(query, req.session.admin_id);

        if(!user){
            return res.status(400).json({
                success: 0,
                data: "No user of that id in db!" 
            });
        } 

        let result = await removeUser(query, req.session.admin_id);

        if(!result){
            return res.status(400).json({
                success: 0,
                data: "Failed to delete user!" 
            });
        } 
        return res.status(200).json({
            success: 1,
            data: result
        });
    }, 

    logoutAdmin: (req, res) => {

        if(req.session.admin_id){
            // destroy the session
            req.session.destroy(() => {
                res.clearCookie(process.env.SESS_NAME)

                return res.status(200).json({
                    success: 1,
                    msg: "lyckades"
                });
            });
        }
    }
}