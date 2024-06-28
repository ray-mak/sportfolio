const mmaMLBet = require("../models/MMAMLBet")
const mmaPropBet = require("../models/MMAPropBet")
const mmaParlay = require("../models/MMAParlay")
const User = require("../models/User")
const EventResult = require('../models/EventResult')
const asyncHandler = require('express-async-handler')
const { evaluateMMAMLBets } = require('../utils/evaluateMMAMLBets')
const { sortEvaluatedBets } = require('../utils/sortEvaluatedBets')
const { formatUpcomingBets } = require('../utils/formatUpcomingBets')
const { evaluateMMAPropBets } = require("../utils/evaluateMMAPropBets")
const { evaluateMMAParlays } = require("../utils/evaluateMMAParlays")

const getUserMLStats = asyncHandler(async (req, res) => {
    //wait until db queries are complete before moving on
    const users = await User.find({}, 'username displayName _id').lean()
    const mmaBets = await mmaMLBet.find().lean()
    const mmaPropBets = await mmaPropBet.find().lean()
    const mmaParlays = await mmaParlay.find().lean()
    const eventResults = await EventResult.find().lean()

    const usersWithResults = []

    for (const user of users) {
        const userBets = mmaBets.filter(bet => bet.user.toString() === user._id.toString())
        const userProps = mmaPropBets.filter(bet => bet.user.toString() === user._id.toString())
        const userParlays = mmaParlays.filter(bet => bet.user.toString() === user._id.toString())
        const evaluatedBets = await evaluateMMAMLBets(userBets, eventResults)
        const evaluatedPropBets = await evaluateMMAPropBets(userProps, eventResults)
        const { evaluatedParlays } = await evaluateMMAParlays(userParlays, eventResults)

        let totalPicks = 0
        let totalProfit = 0
        let unitsBet = 0

        for (const bet of evaluatedBets) {
            totalPicks++
            totalProfit += Number(bet.profit)
            unitsBet += bet.betAmount
        }

        for (const bet of evaluatedPropBets) {
            totalPicks++
            totalProfit += Number(bet.profit)
            unitsBet += bet.betAmount
        }

        for (const bet of evaluatedParlays) {
            totalPicks++
            totalProfit += Number(bet.profit)
            unitsBet += bet.betAmount
        }

        let roi = ((totalProfit / unitsBet) * 100).toFixed(0)
        if (isNaN(roi)) roi = 0

        usersWithResults.push({
            ...user,
            totalPicks,
            totalProfit: totalProfit.toFixed(2),
            unitsBet,
            roi
            // upcomingBets,
            // betHistory: sortedBets
        })
    }

    res.json(usersWithResults)
})

module.exports = { getUserMLStats }