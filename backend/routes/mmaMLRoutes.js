const express = require('express')
const router = express.Router()
const mmaMLBetsController = require('../controllers/mmaMLBetsController')

router.route('/')
    .get(mmaMLBetsController.getMmaMLBets)
    .post(mmaMLBetsController.createMmaMLBet)
    .patch(mmaMLBetsController.updateMmaMLBet)
    .delete(mmaMLBetsController.deleteMmaMLBet)

module.exports = router