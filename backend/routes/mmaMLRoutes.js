const express = require('express')
const router = express.Router()
const mmaMLBetsController = require('../controllers/mmaMLBetsController')
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
// router.use(verifyJWT)

router.route('/')
    .get(mmaMLBetsController.getMmaMLBets)
    .post(mmaMLBetsController.createMmaMLBet)
    .patch(mmaMLBetsController.updateMmaMLBet)
    .delete(mmaMLBetsController.deleteMmaMLBet)

module.exports = router