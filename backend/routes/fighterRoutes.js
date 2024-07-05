const express = require('express')
const router = express.Router()
const fightersController = require("../controllers/fightersController")
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
// router.use(verifyJWT)

router.route('/')
    .get(fightersController.getAllFighters)
    .post(fightersController.createNewFighter)
    .patch(fightersController.updateFighter)
    .delete(fightersController.deleteFighter)

module.exports = router