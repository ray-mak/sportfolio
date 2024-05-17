const mmaMLBet = require("../models/MMAMLBet")
const User = require("../models/User")
const EventResult = require('../models/EventResult')
const asyncHandler = require('express-async-handler')

const getUserMLStats = asyncHandler(async (req, res) => {
    //wait until db queries are complete before moving on
    const users = await User.find({}, 'username displayName _id').lean()
    const mmaBets = await mmaMLBet.find().lean()
    const eventResults = await EventResult.find().lean()

    const usersWithResults = []

    for (const user of users) {
        const userBets = mmaBets.filter(bet => bet.user.toString() === user._id.toString())
        const evaluatedBets = await evaluateBets(userBets, eventResults)
        usersWithResults.push({
            ...user,
            bets: evaluatedBets
        })
    }

    res.json(usersWithResults)
})

//this function is used to evaluate MMA moneyline(straight) bets
async function evaluateBets(bets, eventResults) {
    try {
        const evaluatedBets = []
        for (const bet of bets) {
            const event = eventResults.find(object => object.eventName === bet.event)

            if (!event) {
                evaluatedBets.push({ ...bet })
                continue
            }

            const matchup = event.matchups.find(object => object.matchup === bet.matchup)

            let betResult
            if (matchup.matchResults.winner === "Draw") {
                betResult = "Draw"
            } else if (matchup.matchResults.winner === bet.pick) {
                betResult = "Win"
            } else {
                betResult = "Loss"
            }

            let profit
            let roi
            if (betResult === "Draw") {
                profit = 0
                roi = 0
            } else if (betResult === "Win") {
                profit = bet.odds * bet.betAmount - bet.betAmount
                roi = (profit / bet.betAmount) * 100
            } else {
                profit = -bet.betAmount
                roi = -100
            }
            evaluatedBets.push({
                ...bet,
                result: betResult,
                profit: profit.toFixed(2),
                roi: roi.toFixed(0),
                date: event.eventDate
            })
        }
        return evaluatedBets
    } catch (error) {
        console.error("Error evaluating bets, ", error)
        throw error
    }
}

module.exports = { getUserMLStats }