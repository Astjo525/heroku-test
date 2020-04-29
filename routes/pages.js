const express = require('express');
const router = express.Router();
const { authAdmin,
        authUser } = require('../middleware/auth');
const { loginWeb,
        registerUser,
        getUsers,
        getUserById,
        updateUser,
        deleteUser,
        getAdminIdByUsername,
        getAdminNameById } = require('../api/user');
const { getImageId,
        insertImage,
        createHouse,
        getHouseById,
        deleteHouse, 
        updateHouse,
        getPersonalHouses } = require('../api/houses');
const { loginApp,
        getUserIdByUsername, 
        getStandardHouses } = require ('../api/app');



/*****************************************************
* USER:  Requests that handles the user              *
* Create, Update, Delete, Get users                  *
******************************************************/
//POST login
router.post('/login/web', async (req, res) => {
    
    let result = await loginWeb(req.body.username, req.body.password);
    if(!result){
        return res.status(400).json({
            success: 0,
            data: "Wrong username or password!" 
        });
    } 
    else {
        let id = await getAdminIdByUsername(req.body.username);
        req.session.admin_id = id; //Ändrade till id för den inloggade istället för user

        return res.status(200).json({
            success: 1,
            admin_id: req.session.admin_id
        });
    }
}); 

//KOM IHÅG: username här är det som skickas till frontend ::
router.get('/home', authAdmin, async (req, res) => {

    //Detta är ifall admin-användarnamnet behövs i frontend
    let user = await getAdminNameById(req.session.admin_id);

    return res.status(200).json({
        success: 1,
        username: user
    }); 
});

//POST register
router.post('/register', authAdmin, async (req,  res) => {

    let userInput = {
        username: req.body.username.trim(),
        password: req.body.password.trim()
    };

    let result = await registerUser(userInput, req.session.admin_id);

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
});

//GET users or userbyId
router.get("/edit", authAdmin , async (req, res) => {
    
    //if no id passed in url:
    if(req.query.id == null){
        
        let result = await getUsers(req.session.admin_id);

        if(!result){
            return res.status(400).json({
                success: 0,
                data: "There are no users in db!" 
            });
        }
        return res.status(200).json({
            success: 1,
            data: result
        });
    }

    //if Id passed in url:
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
        data: user
    });
})

//PATCH edit   TODO:: Duplicerad kod om user inte exists
router.patch('/edit', authAdmin, async (req, res) => { 

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

    let result = await updateUser(updatedInfo, req.session.admin_id);

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
}); 

//DELETE edit     
//TODO:: 1. Nu kan man delete vem som (OBS inte admins)
//       2. Duplicerad kod för att kolla om user exists.....
router.delete('/edit', authAdmin, async (req, res) => { 

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

    let result = await deleteUser(query, req.session.admin_id);

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
}); 

//Logout admin
router.get('/logout/web', (req, res) => {

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
}); 

/*************************************************************
* HOUSES:  Requests that handles the houses on the web-page  *
* Create, Update, Delete, Get personal houses                *
**************************************************************/
//Get request (list of personal houses for certain user)
router.get('/houses/user', authAdmin, async (req,res) => {
    
    //If NO Id passed from URL
    if(!req.query.id) {
        return res.status(400).json({
            success: 0,
            data: "Please select user to add house to!" 
        });
    }

     //If Id is passed from URL
     const query = req.query.id;
     let houses = await getPersonalHouses(query);

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
});

router.post('/houses/user', authAdmin, async (req, res) => {
    
    //If NO Id passed from URL
    if(!req.query.id) {
        return res.status(400).json({
            success: 0,
            data: "Please select user to add house to!" 
        });
    }

    //If Id is passed from URL
    const query = req.query.id;
    let house = await getUserById(query, req.session.admin_id);

    //If no image i passed, set it to the default
    //Else insert the image
    let image_id;
    if(req.body.house_image == null) 
    {
        image_id = 1
    }
    else {
        let imageInserted = await insertImage(req.body.house_image);
        image_id = await getImageId(req.body.house_image); 
        console.log("ERE:m ", image_id);

        if(!imageInserted) {
            return res.status(400).json({
                success: 0,
                data: "Image already exists!"
            })       
        }
    }
    
    let userInput = {
        house_name: req.body.house_name,
        image_id: image_id,
        house_model: req.body.house_model
    }

    console.log("IMAGE_ID: ", userInput.image_id);

    let result = await createHouse(userInput, query);

    if(!result){
        return res.status(400).json({
            success: 0,
            data: "House already exists!" 
        });
    } 
    else {
        return res.status(200).json({
             success: 1,
             data: "Successfully created a house!"
        });
    }
});
    
router.delete('/houses/user', authAdmin, async(req, res) => {
    //If NO Id passed from URL
    if(!req.query.id) {
        return res.status(400).json({
            success: 0,
            data: "Please select house to delete!" 
        });
    }

     //If Id is passed from URL
     const query = req.query.id;
     let house = await getHouseById(query);

     if(!house){
        return res.status(400).json({
            success: 0,
            data: "No house of that id in db!" 
        });
    } 

    let result = await deleteHouse(query);

    if(!result){
        return res.status(400).json({
            success: 0,
            data: "Failed to delete house!" 
        });
    } 
    return res.status(200).json({
        success: 1,
        data: result
    });
    
});


router.patch('/houses', authAdmin, async (req, res) => {
    if(req.body.password == ""){
        return res.status(400).json({
            success: 0,
            data: "You left field empty, please type in all required fields!" 
        });
    }

    if(!req.query.id) {
        return res.status(400).json({
            success: 0,
            data: "Please select house to update info!" 
        });
    }

    const queryid = req.query.id;
    let user = await getHouseById(queryid, req.session.admin_id);

    if(!user){
        return res.status(400).json({
            success: 0,
            data: "No house of that id in db!" 
        });
    } 

    let updatedInfo = {
        id: queryid,
        house_name: req.body.house_name
    };

    let result = await updateHouse(updatedInfo, req.session.admin_id);

    if(!result){
        return res.status(400).json({
            success: 0,
            data: "Failed to update house!" 
        });
    } 
    return res.status(200).json({
        success: 1,
        data: result
    });
});

/*************************************************************
* APP:  Requests that will be made in Unity                  *
* Get standard houses, login, get personal houses            *
**************************************************************/
//POST login
router.post('/login/app', async (req, res) => {
    
    let result = await loginApp(req.body.username, req.body.password);
    
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
}); 

//Get request (list of all standard houses (not relevant for web))
router.get('/houses/standard', async (req,res) => {

    let houses = await getStandardHouses();

    return res.status(200).json({
        success: 1,
        data: houses
    }); 
});

//Get request (list of personal houses for certain user)
router.get('/houses/personal', authUser, async (req,res) => {
    
     //If Id is passed from URL
     let houses = await getPersonalHouses(req.session.user_id);

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
});

router.get('/logout/app', (req, res) => {

    if(req.session.user_id){
        // destroy the session
        req.session.destroy(() => {
            //res.clearCookie(process.env.SESS_NAME)
            return res.status(200).json({
                success: 1,
                msg: "lyckades"
            });
        });
    }
}); 



module.exports = router;