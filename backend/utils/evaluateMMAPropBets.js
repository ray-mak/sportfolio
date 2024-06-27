const { evalSingleProp } = require("../utils/evalSingleProp")

async function evaluateMMAPropBets(propBets, eventResults) {
    try {
        const evaluatedPropBets = []
        for (const bet of propBets) {
            const event = eventResults.find(object => object.eventName === bet.event)
            if (!event) continue

            const matchup = event.matchups.find(object => object.matchup === bet.matchup)

            let betResult

            betResult = evalSingleProp(bet, matchup)

            let profit, roi
            if (betResult === "push") {
                profit = 0
                roi = 0
            } else if (betResult === "win") {
                profit = bet.odds * bet.betAmount - bet.betAmount
                roi = (profit / bet.betAmount) * 100
            } else {
                profit = -bet.betAmount
                roi = -100
            }

            const { betType, __v, ...betData } = bet
            evaluatedPropBets.push({
                ...betData,
                result: betResult,
                profit: profit.toFixed(2),
                roi: roi.toFixed(0),
                date: event.eventDate
            })
        }

        return evaluatedPropBets
    } catch (error) {
        console.error("Error evaluating prop bets: ", error)
        throw error
    }
}

function timeStringToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number)
    return (minutes * 60) + seconds
}

function splitScores(scoreString) {
    const winnerScore = parseInt(scoreString.split("-")[0])
    const loserScore = parseInt(scoreString.split("-")[1])
    return { winnerScore, loserScore }
}
module.exports = { evaluateMMAPropBets }