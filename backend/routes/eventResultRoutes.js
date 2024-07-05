const express = require('express')
const router = express.Router()
const eventResultController = require('../controllers/eventResultController')
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
router.use(verifyJWT)

router.route('/')
    .get(eventResultController.getEventResults)
    .post(eventResultController.createEventResult)
    .patch(eventResultController.updateEventResult)
    .delete(eventResultController.deleteEventResult)

module.exports = router