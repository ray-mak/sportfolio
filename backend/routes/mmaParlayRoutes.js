const express = require('express')
const router = express.Router()
const mmaParlayController = require("../controllers/mmaParlayController")
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
router.use(verifyJWT)

router.route("/")
    .get(mmaParlayController.getMMAParlays)
    .post(mmaParlayController.createMMAParlay)
    .patch(mmaParlayController.updateMMAParlay)
    .delete(mmaParlayController.deleteMMAParlay)

module.exports = router