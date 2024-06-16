const { evalSingleProp } = require("../utils/evalSingleProp")

async function evaluateMMAParlays(parlayBets, eventResults) {
    try {
        const upcomingParlays = []
        const evaluatedParlays = []
        for (const bet of parlayBets) {
            const evaluatedParlayLeg = []
            const parlayLegs = bet.parlayInfo
            for (const leg of parlayLegs) {
                const event = eventResults.find(object => object.eventName === leg.event)

                let updatedLeg = { ...leg }
                if (!event) {
                    updatedLeg.result = "noResult"
                    evaluatedParlayLeg.push(updatedLeg)
                    continue
                }

                const matchup = event.matchups.find(object => object.matchup === leg.matchup)

                if (leg.parlayBetType === "moneyline") {
                    let betResult
                    if (matchup.matchResults.methodOfVictory === "draw") {
                        betResult = "draw"
                    } else if (matchup.matchResults.winner === leg.pick) {
                        betResult = "win"
                    } else {
                        betResult = "loss"
                    }

                    updatedLeg.result = betResult
                    evaluatedParlayLeg.push(updatedLeg)
                } else if (leg.parlayBetType === "prop") {
                    updatedLeg.result = evalSingleProp(leg, matchup)
                    evaluatedParlayLeg.push(updatedLeg)
                }

            }
            let totalOdds = 1
            for (leg of evaluatedParlayLeg) {
                if (leg.result === "loss") {
                    totalOdds = 0
                    break
                } else if (leg.result === "win") {
                    totalOdds = totalOdds * leg.odds
                }
            }

            const profit = bet.betAmount * totalOdds - bet.betAmount
            const roi = profit / bet.betAmount * 100

            const evaluatedParlay = {
                ...bet,
                profit: profit.toFixed(2),
                roi: roi.toFixed(0),
                parlayInfo: evaluatedParlayLeg
            }
            const hasNoResult = evaluatedParlayLeg.some(leg => leg.result === "noResult")

            hasNoResult ? upcomingParlays.push(evaluatedParlay) : evaluatedParlays.push(evaluatedParlay)
        }
        return { upcomingParlays, evaluatedParlays }
    } catch (error) {
        console.error("Error evaluating parlays: ", error)
        throw error
    }
}

module.exports = { evaluateMMAParlays }