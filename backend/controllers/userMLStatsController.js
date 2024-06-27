const mmaMLBet = require("../models/MMAMLBet")
const mmaPropBet = require("../models/MMAPropBet")
const mmaParlay = require("../models/MMAParlay")
const User = require("../models/User")
const EventResult = require('../models/EventResult')
const asyncHandler = require('express-async-handler')
const { evaluateMMAMLBets } = require('../utils/evaluateMMAMLBets')
const { sortEvaluatedBets } = require('../utils/sortEvaluatedBets')
const { formatUpcomingBets } = require('../utils/formatUpcomingBets')

const getUserMLStats = asyncHandler(async (req, res) => {
    //wait until db queries are complete before moving on
    const users = await User.find({}, 'username displayName _id').lean()
    const mmaBets = await mmaMLBet.find().lean()
    const eventResults = await EventResult.find().lean()

    const usersWithResults = []

    for (const user of users) {
        const userBets = mmaBets.filter(bet => bet.user.toString() === user._id.toString())
        const userProps = mmaPropBet.filter(bet => bet.user.toString() === user._id.toString())
        const userParlays = mmaParlay.filter(bet => bet.user.toString() === user._id.toString())
        const evaluatedBets = await evaluateMMAMLBets(userBets, eventResults)
        const sortedBets = await sortEvaluatedBets(evaluatedBets, [], [])
        const upcomingBets = await formatUpcomingBets(userBets, [], [], eventResults)

        usersWithResults.push({
            ...user,
            upcomingBets,
            betHistory: sortedBets
        })
    }

    res.json(usersWithResults)
})

module.exports = { getUserMLStats }