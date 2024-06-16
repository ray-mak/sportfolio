async function calcPropParlayStats(evaluatedPropBets, evaluatedParlays) {
    try {
        let totalPropPicks = 0
        let totalCorrectProps = 0
        let totalPropProfit = 0
        let totalPropBetAmount = 0
        for (const bet of evaluatedPropBets) {
            totalPropPicks++
            if (bet.result === "win") totalCorrectProps++
            totalPropProfit += Number(bet.profit)
            totalPropBetAmount += bet.betAmount
        }
        const propROI = totalPropProfit / totalPropBetAmount * 100
        const propPercentCorrect = totalCorrectProps / totalPropPicks * 100

        let totalParlays = 0
        let totalCorrectParlays = 0
        let totalParlayProfit = 0
        let totalParlayBetAmount = 0
        for (const bet of evaluatedParlays) {
            totalParlays++
            if (Number(bet.profit) >= 0) totalCorrectParlays++
            totalParlayProfit += Number(bet.profit)
            totalParlayBetAmount += bet.betAmount
        }
        const parlayROI = totalParlayProfit / totalParlayBetAmount * 100
        const parlayPercentCorrect = totalCorrectParlays / totalParlays * 100

        const propStats = {
            totalPropPicks,
            totalCorrectProps,
            totalPropProfit,
            totalPropBetAmount,
            propROI: propROI.toFixed(0),
            propPercentCorrect: propPercentCorrect.toFixed(0)
        }

        const parlayStats = {
            totalParlays,
            totalCorrectParlays,
            totalParlayProfit,
            totalParlayBetAmount,
            parlayROI: parlayROI.toFixed(0),
            parlayPercentCorrect: parlayPercentCorrect.toFixed(0)
        }

        return { propStats, parlayStats }
    } catch (error) {
        console.error("Error calculating prop and parlay stats: ", error)
        throw error
    }
}

module.exports = { calcPropParlayStats }