const express = require('express')
const router = express.Router()
const userMLStatsController = require('../controllers/userMLStatsController')

router.route('/')
    .get(userMLStatsController.getUserMLStats)


module.exports = router