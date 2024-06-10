const mmaMLBet = require("../models/MMAMLBet")
const User = require("../models/User")
const mmaPropBet = require("../models/MMAMLBetResult")
const EventResult = require('../models/EventResult')
const asyncHandler = require('express-async-handler')
const { evaluateMMAMLBets } = require('../utils/evaluateMMAMLBets')
const { sortEvaluatedBets } = require('../utils/sortEvaluatedBets')
const { formatUpcomingBets } = require('../utils/formatUpcomingBets')
const { calculateMLStats } = require('../utils/calculateMLStats')
const { evaluateMMAPropBets } = require("../utils/evaluateMMAPropBets")

const getUserProfileStats = asyncHandler(async (req, res) => {
    const { id } = req.body

    //Find user by id. Find all bets associated with user. 
    const user = await User.findById(id)
    const userBets = await mmaMLBet.find({ user: id }).lean()
    const userPropBets = await mmaPropBet.find({ user: id }).lean()
    //Get event results. Create an object for each events result for each user, push to past events array
    const eventResults = await EventResult.find().lean()
    const evaluatedBets = await evaluateMMAMLBets(userBets, eventResults)

    //Format and sort the evaluated bets
    const sortedBets = await sortEvaluatedBets(evaluatedBets)
    //Create an array, upcoming events, for bets that have not been evaluated.
    const upcomingBets = await formatUpcomingBets(userBets, eventResults)
    const mlStats = await calculateMLStats(sortedBets)

    const allUserBets = {
        username: user.username,
        displayName: user.displayName,
        mlStats,
        upcomingBets,
        betHistory: sortedBets
    }


    res.json(allUserBets)
    //don't forget to reactivate auth for users and mmamlbets
})

module.exports = { getUserProfileStats }

//I need a function to sort MMA events. Extract the event and date from each object