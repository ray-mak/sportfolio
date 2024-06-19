const EventResult = require('../models/EventResult')
const MMAEvent = require('../models/MMAEvent')
const User = require('../models/User')
const MMAMLBet = require('../models/MMAMLBet')
const mmaPropBet = require("../models/MMAPropBet")
const mmaParlay = require("../models/MMAParlay")
const asyncHandler = require('express-async-handler')

//@desc Get all MMA Events and Results
//@route GET /api/eventsummary
//@access Private

const getAllEvents = asyncHandler(async (req, res) => {
    const mmaEvents = await MMAEvent.find().lean()
    const eventResults = await EventResult.find().lean()

    const eventResultNames = eventResults.map(result => result.eventName)

    const upcomingEvents = mmaEvents.filter(event => !eventResultNames.includes(event.eventName))
    const pastEvents = mmaEvents.filter(event => eventResultNames.includes(event.eventName))

    res.json({ upcomingEvents, pastEvents })
})

//@desc Get individual MMA Events summary
//@route POST /api/eventsummary
//@access Private
const getSingleEvent = asyncHandler(async (req, res) => {
    const { eventName } = req.body

    const eventResult = await EventResult.find({ eventName }).lean()
    const eventData = eventResult.length > 0 ? eventResult : await MMAEvent.find({ eventName }).lean()

    res.json(eventData)
})


module.exports = { getAllEvents, getSingleEvent }