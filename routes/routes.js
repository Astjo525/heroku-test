const express = require('express');
const router = express.Router();

const { authAdmin,
        authUser } = require('../middleware/auth');

const { loginAdmin,
        getAdmin,
        registerUser,
        getUsers,
        updateUser,
        deleteUser,
        logoutAdmin } = require('../handlers/admin.handler');

const { getHouses,
        uploadHouse,
        deleteHouse,
        updateHouse } = require('../handlers/house.handler');

const { loginUser,
        getStandardHouses,
        getPersonalHouses,
        logoutUser } = require('../handlers/user.handler');


//----------ADMIN----------//
router.post('/login/admin', loginAdmin);
router.get('/home', authAdmin, getAdmin);
router.post('/register', authAdmin, registerUser);
router.get('/edit', authAdmin, getUsers);
router.patch('/edit', authAdmin, updateUser);
router.delete('/edit', authAdmin, deleteUser);
router.get('/logout/admin', logoutAdmin);

//----------HOUSES----------//
router.get('/houses', authAdmin, getHouses);
router.post('/houses', authAdmin, uploadHouse); 
router.delete('/houses', authAdmin, deleteHouse);
router.patch('/houses', authAdmin, updateHouse);

//----------USERS----------//
router.post('/login/user', loginUser);
router.get('/houses/standard', getStandardHouses)
router.get('/houses/personal', authUser, getPersonalHouses);
router.get('/logout/user', logoutUser); 


module.exports = router;