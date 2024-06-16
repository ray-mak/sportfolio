async function calculateMLStats(evaluatedBets) {
    try {
        let bigFavPick = 0
        let slightFavPick = 0
        let slightDogPick = 0
        let bigDogPick = 0
        let bigFavBetAmount = 0
        let slightFavBetAmount = 0
        let slightDogBetAmount = 0
        let bigDogBetAmount = 0
        let bigFavProfit = 0
        let slightFavProfit = 0
        let slightDogProfit = 0
        let bigDogProfit = 0
        let bigFavWin = 0
        let slightFavWin = 0
        let slightDogWin = 0
        let bigDogWin = 0

        for (const event of evaluatedBets) {
            const eventResults = event.eventResults
            const matchups = []
            for (const result of eventResults) {
                if (!matchups.some(matchup => matchup === result.matchup)) {
                    if (result.odds <= 1.5) {
                        bigFavPick++
                        bigFavBetAmount += result.betAmount
                        bigFavProfit += Number(result.profit)
                        if (result.result === "win") {
                            bigFavWin++
                        }
                    } else if (result.odds > 1.5 && result.odds < 2) {
                        slightFavPick++
                        slightFavBetAmount += result.betAmount
                        slightFavProfit += Number(result.profit)
                        if (result.result === "win") {
                            slightFavWin++
                        }
                    } else if (result.odds >= 2 && result.odds < 3) {
                        slightDogPick++
                        slightDogBetAmount += result.betAmount
                        slightDogProfit += Number(result.profit)
                        if (result.result === "win") {
                            slightDogWin++
                        }
                    } else if (result.odds >= 3) {
                        bigDogPick++
                        bigDogBetAmount += result.betAmount
                        bigDogProfit += Number(result.profit)
                        if (result.result === "win") {
                            bigDogWin++
                        }
                    }
                    matchups.push(result.matchup)
                }
            }
        }
        const totalPicks = bigFavPick + slightFavPick + slightDogPick + bigDogPick
        const totalBetAmount = bigFavBetAmount + slightFavBetAmount + slightDogBetAmount + bigDogBetAmount
        const totalProfit = Number(bigFavProfit) + Number(slightFavProfit) + Number(slightDogProfit) + Number(bigDogProfit)
        const totalCorrect = bigFavWin + slightFavWin + slightDogWin + bigDogWin
        const percentCorrect = (totalCorrect / totalPicks * 100).toFixed(0)
        const totalROI = (totalProfit / totalBetAmount * 100).toFixed(0)
        const bigFavROI = (bigFavProfit / bigFavBetAmount * 100).toFixed(0)
        const bigFavWinPercent = (bigFavWin / bigFavPick * 100).toFixed(0)
        const slightFavROI = (slightFavProfit / slightFavBetAmount * 100).toFixed(0)
        const slightFavWinPercent = (slightFavWin / slightFavPick * 100).toFixed(0)
        const slightDogROI = (slightDogProfit / slightDogBetAmount * 100).toFixed(0)
        const slightDogWinPercent = (slightDogWin / slightDogPick * 100).toFixed(0)
        const bigDogROI = (bigDogProfit / bigDogBetAmount * 100).toFixed(0)
        const bigDogWinPercent = (bigDogWin / bigDogPick * 100).toFixed(0)

        return ({
            totalPicks,
            totalCorrect,
            percentCorrect,
            totalProfit,
            totalROI,
            bigFavPick,
            bigFavROI,
            bigFavWin,
            bigFavWinPercent,
            bigFavProfit,
            bigFavBetAmount,
            slightFavPick,
            slightFavBetAmount,
            slightFavProfit,
            slightFavWin,
            slightFavWinPercent,
            slightFavROI,
            slightDogPick,
            slightDogBetAmount,
            slightDogProfit,
            slightDogWin,
            slightDogWinPercent,
            slightDogROI,
            bigDogPick,
            bigDogBetAmount,
            bigDogProfit,
            bigDogWin,
            bigDogWinPercent,
            bigDogROI,
        })

    } catch (error) {
        console.error("Error calculating stats: ", error)
        throw error
    }
}

module.exports = { calculateMLStats }