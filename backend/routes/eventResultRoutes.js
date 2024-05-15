const express = require('express')
const router = express.Router()
const eventResultController = require('../controllers/eventResultController')

router.route('/')
    .get(eventResultController.getEventResults)
    .post(eventResultController.createEventResult)
    .patch(eventResultController.updateEventResult)
    .delete(eventResultController.deleteEventResult)

module.exports = router