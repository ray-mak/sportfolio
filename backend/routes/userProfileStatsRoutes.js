const express = require('express')
const router = express.Router()
const userProfileStatsController = require("../controllers/userProfileStatsController")

router.route('/')
    .get(userProfileStatsController.getUserProfileStats)

module.exports = router