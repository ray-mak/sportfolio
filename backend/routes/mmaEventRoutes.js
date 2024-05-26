const express = require('express')
const router = express.Router()
const mmaEventController = require('../controllers/mmaEventController')

router.route('/')
    .get(mmaEventController.getMMAEvents)
    .post(mmaEventController.createMMAEvent)
    .patch(mmaEventController.updateMMAEvent)
    .delete(mmaEventController.deleteMMAEvent)

module.exports = router