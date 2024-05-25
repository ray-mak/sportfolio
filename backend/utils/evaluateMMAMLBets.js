//this function is used to evaluate MMA moneyline(straight) bets. It will return the inputted bet information, as well as the betResult, profit, ROI and date of that bet
async function evaluateMMAMLBets(bets, eventResults) {
    try {
        const evaluatedBets = []
        for (const bet of bets) {
            //find the corresponding event for the bet
            const event = eventResults.find(object => object.eventName === bet.event)
            //check to see if event exists. Will not exist if event has not happened (or not logged yet)
            if (!event) {
                evaluatedBets.push({ ...bet })
                continue
            }
            //find the corresponding matchup in event for the bet
            const matchup = event.matchups.find(object => object.matchup === bet.matchup)
            //set the result of each bet
            let betResult
            if (matchup.matchResults.winner === "Draw") {
                betResult = "Draw"
            } else if (matchup.matchResults.winner === bet.pick) {
                betResult = "Win"
            } else {
                betResult = "Loss"
            }
            //set the profit and roi of each bet
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

module.exports = { evaluateMMAMLBets }