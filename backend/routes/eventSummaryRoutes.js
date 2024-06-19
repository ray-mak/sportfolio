const express = require('express')
const router = express.Router()
const eventSummaryController = require("../controllers/eventSummaryController")

router.route('/')
    .get(eventSummaryController.getAllEvents)
    .post(eventSummaryController.getSingleEvent)

module.exports = router