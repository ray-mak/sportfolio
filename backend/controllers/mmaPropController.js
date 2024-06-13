const mmaPropBet = require("../models/MMAPropBet")
const User = require("../models/User")
const asyncHandler = require('express-async-handler')

//@desc Get all MMA Prop Bets with user
//@route GET /api/mmapropbets
//@access Private
const getMMAPropBets = asyncHandler(async (req, res) => {
    const propBets = await mmaPropBet.find().lean()
    if (!propBets?.length) {
        return res.status(400).json({ message: 'No prop bets found' })
    }

    const propsWithUser = await Promise.all(propBets.map(async (bet) => {
        const user = await User.findById(bet.user).lean().exec()
        return { ...bet, username: user.username }
    }))
    res.json(propsWithUser)
})

//@desc Create new MMA prop bet
//@route POST /api/mmapropbets
//@access Private
const createMMAPropBet = asyncHandler(async (req, res) => {
    const { user, betType, event, matchup, propType, timeProp, pickFighter, fighterProp, odds, betAmount, notes } = req.body

    if (!user || !betType || !event || !matchup || !propType || !odds || !betAmount) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!timeProp && !fighterProp) {
        return res.status(400).json({ message: 'Must have time prop or fighter prop' })
    }

    const propBet = await mmaPropBet.create({ user, betType, event, matchup, propType, timeProp, pickFighter, fighterProp, odds, betAmount, notes })
    if (propBet) {
        return res.status(201).json({ message: 'Prop bet created' })
    } else {
        return res.status(400).json({ message: 'Invalid bet data received' })
    }
})

//@desc Update a prop bet
//@route PATCH /api/mmapropbets
//@access Private
const updateMMAPropBet = asyncHandler(async (req, res) => {
    const { id, notes } = req.body

    if (!id || !notes) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const bet = await mmaMLBet.findById(id).exec()
    if (!bet) {
        return res.status(400).json({ message: 'Bet not found' })
    }

    bet.notes = notes
    const updatedBet = await bet.save()

    res.json({ message: `Notes for betID ${updatedBet._id} updated` })
})

//@desc Delete a prop bet
//@route DELETE /api/mmapropbets
//@access Private
const deleteMMAPropBet = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Bet ID required' })
    }

    const bet = await mmaMLBet.findById(id).exec()
    if (!bet) {
        return res.status(400).json({ message: 'Bet not found' })
    }

    bet.notes = ""
    const updatedBet = await bet.save()

    res.json({ message: `Notes for betID ${updatedBet._id} deleted` })
})

module.exports = { getMMAPropBets, createMMAPropBet, updateMMAPropBet, deleteMMAPropBet }