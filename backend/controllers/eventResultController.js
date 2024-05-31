const EventResult = require('../models/EventResult')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

//@desc Get all event results
//@route GET /api/eventresults
//@access Private
const getEventResults = asyncHandler(async (req, res) => {
    const eventResults = await EventResult.find().lean()
    if (!eventResults?.length) {
        return res.status(400).json({ message: "No event results found" })
    }

    res.json(eventResults)
})

//@desc Create new event result
//@route POST /api/eventresults
//@access Private
const createEventResult = asyncHandler(async (req, res) => {
    const { eventName, eventDate, matchups } = req.body

    if (!eventName || !eventDate || !matchups?.length) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const duplicateEvent = await EventResult.findOne({ eventName }).lean().exec()
    if (duplicateEvent) {
        return res.status(409).json({ message: 'Duplicate event' })
    }

    for (const match of matchups) {
        if (!match.matchup || !match.matchResults) {
            return res.status(400).json({ message: "Each matchup must contain matchup name and match results" })
        }

        const result = match.matchResults
        if (!result.winner || !result.methodOfVictory || !result.timeElapsed) {
            return res.status(400).json({ message: "Match results must have a winner, method of victory, and time elapsed" })
        }
        if (result.methodOfVictory == "decision" && !result.score) {
            return res.status(400).json({ message: "Decision victories must have a score" })
        }
        if (result.score && result.methodOfVictory !== "decision" && result.methodOfVictory !== "Split Decision") {
            return res.status(400).json({ message: "Score not necessary for non-decision victories" })
        }

    }

    const eventResult = await EventResult.create({ eventName, eventDate, matchups })
    if (eventResult) {
        return res.status(201).json({ message: 'Event result logged' })
    } else {
        return res.status(400).json({ message: 'Invalid bet data received' })
    }
})

//@desc Update an event
//@route PATCH /api/eventresults
//@access Private
const updateEventResult = asyncHandler(async (req, res) => {
    const { id, matchups } = req.body

    if (!id || !matchups?.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    for (const match of matchups) {
        if (!match.matchup || !match.matchResults) {
            return res.status(400).json({ message: "Each matchup must contain matchup name and match results" })
        }

        const result = match.matchResults
        if (!result.winner || !result.methodOfVictory || !result.timeElapsed) {
            return res.status(400).json({ message: "Match results must have a winner, method of victory, and time elapsed" })
        }
        if (result.methodOfVictory === "Decision" && !result.score) {
            return res.status(400).json({ message: "Decision victories must have a score" })
        }
        if (result.score && result.methodOfVictory !== "Decision" && result.methodOfVictory !== "Split Decision") {
            return res.status(400).json({ message: "Score not necessary for non-decision victories" })
        }

    }

    const event = await EventResult.findById(id).exec()
    if (!event) {
        return res.status(400).json({ message: 'Event not found' })
    }

    event.matchups = matchups
    const updatedEvent = await event.save()
    res.json({ message: `Event ${updatedEvent.eventName} with id ${updatedEvent._id} updated` })
})

//@desc Delete an event
//@route DELETE /api/eventresults
//@access Private
const deleteEventResult = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Event ID required' })
    }

    const event = await EventResult.findById(id).exec()
    if (!event) {
        return res.status(400).json({ message: 'Event not found' })
    }

    await event.deleteOne()
    res.json({ message: `Event ${event.eventName} with id ${event._id} deleted` })
})

module.exports = { getEventResults, createEventResult, updateEventResult, deleteEventResult }
