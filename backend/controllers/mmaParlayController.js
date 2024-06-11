const mmaParlay = require("../models/MMAParlay")
const User = require("../models/User")
const asyncHandler = require('express-async-handler')

//@desc Get all MMA Parlays with user
//@route GET /api/mmaparlays
//@access Private
const getMMAParlays = asyncHandler(async (req, res) => {
    const parlays = await mmaParlay.find().lean()
    if (!parlays?.length) {
        return res.status(400).json({ message: 'No parlays found' })
    }

    const parlaysWithUser = Promise.all(parlays.map(async (bet) => {
        const user = User.findById(bet.user).lean().exec()
        return { ...bet, username: user.username }
    }))
    res.json(parlaysWithUser)
})

//@desc Create new MMA parlay
//@route POST /api/mmaparlays
//@access Private
const createMMAParlay = asyncHandler(async (req, res) => {
    const { user, betType, event, matchup, parlayInfo } = req.body

    if (!user || !betType || !event || !matchup || !parlayInfo?.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const parlay = await mmaParlay.create({ user, betType, event, matchup, parlayInfo })

    if (result) {
        return res.status(201).json({ message: 'Parlay created' })
    } else {
        return res.status(400).json({ message: 'Invalid parlay data received' })
    }
})

//@desc Update a parlay
//@route PATCH /api/mmaparlays
//@access Private
const updateMMAParlay = asyncHandler(async (req, res) => {
    const { id, parlayInfo } = req.body

    if (!id || !parlayInfo?.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const parlay = await mmaParlay.findById(id).exec()
    if (!parlay) {
        return res.status(400).json({ message: 'Parlay not found' })
    }

    parlay.parlayInfo = parlayInfo
    const updatedParlay = await parlay.save()

    res.json({ message: `Parlay info for parlayID ${updatedParlay._id} updated` })
})

//@desc Delete a parlay
//@route DELETE /api/mmaparlays
//@access Private
const deleteMMAParlay = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Parlay ID required' })
    }

    const parlay = await mmaParlay.findById(id).exec()
    if (!parlay) {
        return res.status(400).json({ message: 'Parlay not found' })
    }

    await parlay.deleteOne()
    res.json({ message: `Parlay with id ${parlay._id} deleted` })
})

module.exports = { getMMAParlays, createMMAParlay, updateMMAParlay, deleteMMAParlay }