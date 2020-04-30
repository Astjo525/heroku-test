
const { login,
        getUserIdByUsername, 
        listStandardHouses } = require ('../services/user.service');

const { listPersonalHouses } = require ('../services/house.service');


//----------USER-HANDLER----------//

module.exports = {

    //POST login
    loginUser: async (req, res) => {
        
        let result = await login(req.body.username, req.body.password);
        
        if(!result){
            return res.status(400).json({
                success: 0,
                data: "Wrong username or password!" 
            });
        } else {
            let user_id = await getUserIdByUsername(req.body.username);
            req.session.user_id = user_id;

            return res.status(200).json({
                success: 1,
                user: req.session.user_id
            });
        }
    },
    
    getStandardHouses: async (req,res) => {

        let houses = await listStandardHouses();

        return res.status(200).json({
            success: 1,
            data: houses
        }); 
    },

    getPersonalHouses: async (req,res) => {
        
        //If Id is passed from URL
        let houses = await listPersonalHouses(req.session.user_id);

        if(!houses){
            return res.status(400).json({
                success: 0,
                data: "No house of that id in db!" 
            });
        }

        return res.status(200).json({
            success: 1,
            data: houses
        }); 
    },

    logoutUser: (req, res) => {

        if(req.session.user_id){
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
