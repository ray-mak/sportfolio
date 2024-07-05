const express = require('express')
const router = express.Router()
const mmaPropController = require("../controllers/mmaPropController")
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
router.use(verifyJWT)

router.route("/")
    .get(mmaPropController.getMMAPropBets)
    .post(mmaPropController.createMMAPropBet)
    .patch(mmaPropController.updateMMAPropBet)
    .delete(mmaPropController.deleteMMAPropBet)

module.exports = router