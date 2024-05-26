const MMAEvent = require('../models/MMAEvent')
const MMAMLBet = require('../models/MMAMLBet')
const asyncHandler = require('express-async-handler')

//@desc Get all MMA Events
//@route GET /api/mmaevents
//@access Private
const getMMAEvents = asyncHandler(async (req, res) => {
    const mmaEvents = await MMAEvent.find().lean()
    if (!mmaEvents?.length) {
        return res.status(400).json({ message: "No events found" })
    }

    res.json(mmaEvents)
})

//@desc Create new event 
//@route POST /api/mmaevents
//@access Private
const createMMAEvent = asyncHandler(async (req, res) => {
    const { eventName, eventDate, matchups } = req.body

    if (!eventName || !eventDate || !matchups?.length) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const duplicateEvent = await MMAEvent.findOne({ eventName }).lean().exec()
    if (duplicateEvent) {
        return res.status(409).json({ message: 'Duplicate event' })
    }

    const newMMAEvent = await MMAEvent.create({ eventName, eventDate, matchups })
    if (newMMAEvent) {
        return res.status(201).json({ message: 'Event logged' })
    } else {
        return res.status(400).json({ message: 'Invalid bet data received' })
    }
})

//@desc Update an event
//@route PATCH /api/mmaevents
//@access Private
const updateMMAEvent = asyncHandler(async (req, res) => {
    const { eventName, matchups } = req.body

    if (!eventName || !matchups?.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const event = await MMAEvent.findOne({ eventName }).exec()
    if (!event) {
        return res.status(400).json({ message: 'Event not found' })
    }

    //check to see if any matchups got removed. Delete associated mmaMLBets
    const removedMatchups = event.matchups.filter(matchup => !matchups.includes(matchup))
    if (removedMatchups > 0) {
        await MMAMLBet.deleteMany({
            event: eventName,
            matchup: { $in: removedMatchups }
        })
    }

    event.matchups = matchups
    const updatedEvent = await event.save()
    res.json({ message: `Event ${updatedEvent.eventName} with id ${updatedEvent._id} updated` })
})

//@desc Delete an event
//@route DELETE /api/mmaevents
//@access Private
const deleteMMAEvent = asyncHandler(async (req, res) => {
    const { eventName } = req.body

    if (!eventName) {
        return res.status(400).json({ message: 'Event Name required' })
    }

    const event = await MMAEvent.findOne({ eventName }).exec()
    await event.deleteOne()
    res.json({ message: `Event ${event.eventName} with id ${event._id} deleted` })
})

module.exports = { getMMAEvents, createMMAEvent, updateMMAEvent, deleteMMAEvent }