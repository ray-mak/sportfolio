const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router

//Each user account will have the following information:
//username, email, password
//upcoming picks, past picks, stats