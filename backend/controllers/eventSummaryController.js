const EventResult = require('../models/EventResult')
const MMAEvent = require('../models/MMAEvent')
const User = require('../models/User')
const MMAMLBet = require('../models/MMAMLBet')
const mmaPropBet = require("../models/MMAPropBet")
const mmaParlay = require("../models/MMAParlay")
const Fighter = require("../models/Fighter")
const asyncHandler = require('express-async-handler')

//@desc Get all MMA Events and Results
//@route GET /api/eventsummary
//@access Private

const getAllEvents = asyncHandler(async (req, res) => {
    const mmaEvents = await MMAEvent.find().lean()
    const eventResults = await EventResult.find().lean()

    const eventResultNames = eventResults.map(result => result.eventName)

    const upcomingEvents = mmaEvents.filter(event => !eventResultNames.includes(event.eventName))
    const pastEvents = mmaEvents.filter(event => eventResultNames.includes(event.eventName))
    const sortedUpcomgingEvents = upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    const sortedPastEvents = pastEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))

    res.json({ upcomingEvents: sortedUpcomgingEvents, pastEvents: sortedPastEvents })
})

//@desc Get individual MMA Events summary
//@route POST /api/eventsummary
//@access Private
const getSingleEvent = asyncHandler(async (req, res) => {
    const { id } = req.body

    const foundEvent = await MMAEvent.findById(id).lean().exec()
    const eventName = foundEvent.eventName
    const eventResult = await EventResult.find({ eventName }).lean()
    const eventData = eventResult.length > 0 ? eventResult : await MMAEvent.find({ eventName }).lean()

    let eventWithBets = eventData[0]

    for (const matchup of eventWithBets.matchups) {
        matchup.mlBets = []
        matchup.propBets = []
        matchup.parlays = []

        const fighterA = matchup.matchup.split(" vs ")[0]
        const fighterB = matchup.matchup.split(" vs ")[1]
        const foundFighterA = await Fighter.find({ name: fighterA }).lean()
        const foundFighterB = await Fighter.find({ name: fighterB }).lean()
        if (foundFighterA?.length > 0) {
            const fighterAImg = foundFighterA[0].image
            matchup.fighterAImg = fighterAImg
        } else {
            matchup.fighterAImg = ""
        }

        if (foundFighterB?.length > 0) {
            const fighterBImg = foundFighterB[0].image
            matchup.fighterBImg = fighterBImg
        } else {
            matchup.fighterBImg = ""
        }
    }

    const eventMLBets = await MMAMLBet.find({ event: eventName }).lean()
    const eventPropBets = await mmaPropBet.find({ event: eventName }).lean()
    const eventParlays = await mmaParlay.find({ parlayInfo: { $elemMatch: { event: eventName } } }).lean()

    const mlBetsWithUser = await Promise.all(eventMLBets.map(async (bet) => {
        const user = await User.findById(bet.user).lean().exec()
        return { ...bet, displayName: user.displayName }
    }))

    const propsWithUser = await Promise.all(eventPropBets.map(async (bet) => {
        const user = await User.findById(bet.user).lean().exec()
        return { ...bet, displayName: user.displayName }
    }))

    const parlaysWithUser = await Promise.all(eventParlays.map(async (bet) => {
        const user = await User.findById(bet.user).lean().exec()
        return { ...bet, displayName: user.displayName }
    }))

    for (const mlBet of mlBetsWithUser) {
        const matchup = eventWithBets.matchups.find(item => item.matchup === mlBet.matchup)
        matchup.mlBets.push(mlBet)
    }

    for (const propBet of propsWithUser) {
        const matchup = eventWithBets.matchups.find(item => item.matchup === propBet.matchup)
        matchup.propBets.push(propBet)
    }

    for (const parlay of parlaysWithUser) {
        for (const parlayLeg of parlay.parlayInfo) {
            const matchups = eventWithBets.matchups.filter(item => item.matchup === parlayLeg.matchup)
            for (const matchup of matchups) {
                matchup.parlays.push(parlay)
            }
        }
    }

    res.json(eventWithBets)
})


module.exports = { getAllEvents, getSingleEvent }