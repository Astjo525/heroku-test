
const { getPersonalHouses,
        insertImage,
        getImageId,
        upload,
        getHouseById,
        update,
        removeHouse } = require('../services/house.service');


//----------HOUSE-HANDLER----------//

module.exports = {

    getHouses: async (req,res) => {
        
        //If there is no id passed in URL:
        if(!req.query.id) {
            return res.status(400).json({
                success: 0,
                data: "Please select user to add house to!" 
            });
        }

        //If id is passed in URL:
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
    },

    
    uploadHouse: async (req, res) => {
        
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

        let result = await upload(userInput, query);

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
    },

        
    updateHouse: async (req, res) => {

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

        let result = await update(updatedInfo, req.session.admin_id);

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
    },
        
    deleteHouse: async(req, res) => {

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

        let result = await removeHouse(query);

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
        
    }
}





    

