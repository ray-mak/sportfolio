const express = require('express')
const router = express.Router()
const mmaEventController = require('../controllers/mmaEventController')
const verifyJWT = require('../middleware/verifyJWT')

//apply verifyJWT middleware to all of the routes in this file
router.use(verifyJWT)

router.route('/')
    .get(mmaEventController.getMMAEvents)
    .post(mmaEventController.createMMAEvent)
    .patch(mmaEventController.updateMMAEvent)
    .delete(mmaEventController.deleteMMAEvent)

module.exports = router