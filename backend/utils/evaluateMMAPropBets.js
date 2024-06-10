async function evaluateMMAPropBets(propBets, eventResults) {
    try {
        const evaluatedPropBets = []
        for (const bet of propBets) {
            const event = eventResults.find(object => object.eventName === bet.event)
            if (!event) continue

            const matchup = event.matchups.find(object => object.matchup === bet.matchup)

            let betResult
            const timeElapsed = timeStringToSeconds(matchup.matchResults.timeElapsed)
            if (bet.propType === "timeProp") {
                switch (bet.timeProp) {
                    case "Over 0.5 rounds":
                        betResult = timeElapsed >= timeStringToSeconds("2:30") ? "win" : "loss"
                        break
                    case "Under 0.5 rounds":
                        betResult = timeElapsed <= timeStringToSeconds("2:30") ? "win" : "loss"
                        break
                    case "Over 1.5 rounds":
                        betResult = timeElapsed >= timeStringToSeconds("7:30") ? "win" : "loss"
                        break
                    case "Under 1.5 rounds":
                        betResult = timeElapsed <= timeStringToSeconds("7:30") ? "win" : "loss"
                        break
                    case "Over 2.5 rounds":
                        betResult = timeElapsed >= timeStringToSeconds("12:30") ? "win" : "loss"
                        break
                    case "Under 2.5 rounds":
                        betResult = timeElapsed <= timeStringToSeconds("12:30") ? "win" : "loss"
                        break
                    case "Over 3.5 rounds":
                        betResult = timeElapsed >= timeStringToSeconds("17:30") ? "win" : "loss"
                        break
                    case "Under 3.5 rounds":
                        betResult = timeElapsed <= timeStringToSeconds("17:30") ? "win" : "loss"
                        break
                    case "Over 4.5 rounds":
                        betResult = timeElapsed >= timeStringToSeconds("22:30") ? "win" : "loss"
                        break
                    case "Under 4.5 rounds":
                        betResult = timeElapsed <= timeStringToSeconds("22:30") ? "win" : "loss"
                        break
                    case "Fight goes to decision":
                        betResult = (matchup.matchResults.methodOfVictory === "decision" || matchup.matchResults.methodOfVictory === "split decision") ? "win" : "loss"
                        break
                    case "Fight doesn't go to decision":
                        betResult = (matchup.matchResults.methodOfVictory === "decision" || matchup.matchResults.methodOfVictory === "split decision") ? "loss" : "win"
                        break
                        break
                    case "Fight starts round 2":
                        betResult = timeElapsed > timeStringToSeconds("5:00") ? "win" : "loss"
                        break
                    case "Fight doesn't start round 2":
                        betResult = timeElapsed <= timeStringToSeconds("5:00") ? "win" : "loss"
                        break
                    case "Fight starts round 3":
                        betResult = timeElapsed > timeStringToSeconds("10:00") ? "win" : "loss"
                        break
                    case "Fight doesn't start round 3":
                        betResult = timeElapsed <= timeStringToSeconds("10:00") ? "win" : "loss"
                        break
                    case "Fight starts round 4":
                        betResult = timeElapsed > timeStringToSeconds("15:00") ? "win" : "loss"
                        break
                    case "Fight doesn't start round 4":
                        betResult = timeElapsed <= timeStringToSeconds("15:00") ? "win" : "loss"
                        break
                    case "Fight starts round 5":
                        betResult = timeElapsed > timeStringToSeconds("20:00") ? "win" : "loss"
                        break
                    case "Fight doesn't start round 5":
                        betResult = timeElapsed <= timeStringToSeconds("20:00") ? "win" : "loss"
                        break
                    case "Fight ends in round 1/2":
                        betResult = timeElapsed <= timeStringToSeconds("10:00") ? "win" : "loss"
                        break
                    case "Fight ends in round 3/Dec":
                        betResult = (matchup.matchResults.methodOfVictory === "decision" ||
                            matchup.matchResults.methodOfVictory === "split decision" ||
                            (timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("15:00"))) ?
                            "win" :
                            "loss"
                        break
                    case "Fight ends in round 3/4":
                        betResult = (timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("20:00")) ? "win" : "loss"
                        break
                    case "Fight ends in round 5/Dec":
                        betResult = (matchup.matchResults.methodOfVictory === "decision" ||
                            matchup.matchResults.methodOfVictory === "split decision" ||
                            (timeElapsed > timeStringToSeconds("20:00") && timeElapsed <= timeStringToSeconds("25:00"))) ?
                            "win" :
                            "loss"
                        break
                    case "Fight ends in R2":
                        betResult = (timeElapsed > timeStringToSeconds("5:00") && timeElapsed <= timeStringToSeconds("10:00")) ? "win" : "loss"
                        break
                    case "Fight ends in R3":
                        betResult = (timeElapsed > timeStringToSeconds("10:00") && timeElapsed < timeStringToSeconds("15:00")) ? "win" : "loss"
                        break
                    case "Fight ends in R4":
                        betResult = (timeElapsed > timeStringToSeconds("15:00") && timeElapsed <= timeStringToSeconds("20:00")) ? "win" : "loss"
                        break
                    case "Fight ends in R5":
                        betResult = (timeElapsed > timeStringToSeconds("20:00") && timeElapsed < timeStringToSeconds("25:00")) ? "win" : "loss"
                        break
                    case "Fight ends by (T)KO":
                        betResult = matchup.matchResults.methodOfVictory === "ko" ? "win" : "loss"
                        break
                    case "Fight doesn't end by (T)KO":
                        betResult = matchup.matchResults.methodOfVictory === "ko" ? "loss" : "win"
                        break
                    case "Fight ends by sub":
                        betResult = matchup.matchResults.methodOfVictory === "submission" ? "win" : "loss"
                        break
                    case "Fight doesn't end by sub":
                        betResult = matchup.matchResults.methodOfVictory === "submission" ? "loss" : "win"
                        break
                    case "Someone wins by unanimous decision":
                        betResult = matchup.matchResults.methodOfVictory === "decision" ? "win" : "loss"
                        break
                    case "Someone wins by split / majority decision":
                        betResult = matchup.matchResults.methodOfVictory === "split decision" ? "win" : "loss"
                        break
                    case "Fight ends by T(KO) or Decision":
                        betResult = (matchup.matchResults.methodOfVictory === "ko" || matchup.matchResults.methodOfVictory === "decision" || matchup.matchResults.methodOfVictory === "split decision") ? "win" : "loss"
                        break
                    case "Fight ends by Sub or Decision":
                        betResult = (matchup.matchResults.methodOfVictory === "submission" || matchup.matchResults.methodOfVictory === "decision" || matchup.matchResults.methodOfVictory === "split decision") ? "win" : "loss"
                        break
                    default:
                        betResult = "invalid prop bet"
                        break
                }

            }
        }
    } catch (error) {
        console.error("Error evaluating prop bets: ", error)
        throw error
    }
}

function timeStringToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number)
    return (minutes * 60) + seconds
}
module.exports = { evaluateMMAPropBets }