const mmaMLBet = require("../models/MMAMLBet")
const User = require("../models/User")
const asyncHandler = require('express-async-handler')

const getMmaMLBets = asyncHandler(async (req, res) => {
    const mmaBets = await mmaMLBet.find().lean()
    if (!mmaBets?.length) { //optionally chained length, otherwise will return empty array
        return res.status(400).json({ message: 'No bets found' })
    }

    const mmaBetsWithUser = await Promise.all(mmaBets.map(async (bet) => { //takes array of promises as input, and returns a single promise that resolves when all promises in array are resolved.
        const user = await User.findById(bet.user).lean().exec() //bet.user refers to the _id of the user associated with bet
        return { ...bet, username: user.username }
    }))

    res.json(mmaBetsWithUser)
})

const createMmaMLBet = asyncHandler(async (req, res) => {
    const { user, betType, event, matchup, pick, odds, betAmount, notes } = req.body

    if (!user || !betType || !event || !matchup || !pick || !odds || !betAmount) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const mlBet = await mmaMLBet.create({ user, betType, event, matchup, pick, odds, betAmount, notes })
    if (mlBet) {
        return res.status(201).json({ message: 'Moneyline bet created' })
    } else {
        return res.status(400).json({ message: 'Invalid bet data received' })
    }
})

const updateMmaMLBet = asyncHandler(async (req, res) => {
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

const deleteMmaMLBet = asyncHandler(async (req, res) => {
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

module.exports = { getMmaMLBets, createMmaMLBet, updateMmaMLBet, deleteMmaMLBet }