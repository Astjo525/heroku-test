
module.exports = {
    
    authAdmin : (req, res, next) => {
        let adminSession = req.session.admin_id; //Ändrat till admin_id istället för user
        console.log("hello: ", adminSession);
        if (!adminSession) {
            return res.status(400).json({
                success: 0,
                data: "Please login first!" 
            });
        } else {
            next();
        } 
    },

    authUser : (req, res, next) => {
        let userSession = req.session.user_id; //Ändrat till admin_id istället för user
        console.log("hello: ", userSession);
        if (!userSession) {
            return res.status(400).json({
                success: 0,
                data: "Please login first!" 
            });
        } else {
            next();
        } 
    },
}
