const mmaMLBet = require("../models/MMAMLBet")
const User = require("../models/User")
const EventResult = require('../models/EventResult')
const asyncHandler = require('express-async-handler')

const getUserMLStats = asyncHandler(async (req, res) => {
    //wait until db queries are complete before moving on
    const users = await User.find({}, 'username displayName _id').lean()
    const mmaBets = await mmaMLBet.find().lean()
    const eventResults = await EventResult.find().lean()

    const usersWithBets = []

    for (const user of users) {
        const userBets = mmaBets.filter(bet => bet.user.toString() === user._id.toString())
        usersWithBets.push({
            ...user,
            bets: userBets
        })
    }

    res.json(usersWithBets)
})

async function evaluateBets(bets, eventResults) {

}

module.exports = { getUserMLStats }