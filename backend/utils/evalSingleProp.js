function evalSingleProp(bet, matchup) {
    let betResult
    const timeElapsed = timeStringToSeconds(matchup.matchResults.timeElapsed)
    const pickedFighter = bet.pickFighter
    const winner = matchup.matchResults.winner
    const methodOfVictory = matchup.matchResults.methodOfVictory

    let winnerScore, loserScore
    const score = matchup.matchResults.score

    if (score) {
        const { winnerScore: winner, loserScore: loser } = splitScores(score)
        winnerScore = winner
        loserScore = loser
    }

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
                betResult = "invalid time prop"
                break
        }

    } else if (bet.propType === "fighterProp") {
        switch (bet.fighterProp) {
            case "wins by TKO/KO":
                betResult = (pickedFighter === winner && methodOfVictory === "ko") ? "win" : "loss"
                break
            case "wins by submission":
                betResult = (pickedFighter === winner && methodOfVictory === "submission") ? "win" : "loss"
                break
            case "wins by decision":
                betResult = (pickedFighter === winner && (methodOfVictory === "decision" || methodOfVictory === "split decision")) ? "win" : "loss"
                break
            case "wins inside distance":
                betResult = (pickedFighter === winner && (methodOfVictory === "ko" || methodOfVictory === "submission" || methodOfVictory === "dq")) ? "win" : "loss"
                break
            case "wins in round 1":
                betResult = (pickedFighter === winner && timeElapsed <= timeStringToSeconds("5:00")) ? "win" : "loss"
                break
            case "wins in round 2":
                betResult = (pickedFighter === winner && (timeElapsed > timeStringToSeconds("5:00") && timeElapsed <= timeStringToSeconds("10:00"))) ? "win" : "loss"
                break
            case "wins in round 3":
                betResult = (pickedFighter === winner && (timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("15:00"))) ? "win" : "loss"
                break
            case "wins in round 4":
                betResult = (pickedFighter === winner && (timeElapsed > timeStringToSeconds("15:00") && timeElapsed <= timeStringToSeconds("20:00"))) ? "win" : "loss"
                break
            case "wins in round 5":
                betResult = (pickedFighter === winner && (timeElapsed > timeStringToSeconds("20:00") && timeElapsed <= timeStringToSeconds("25:00"))) ? "win" : "loss"
                break
            case "wins by unanimous decision":
                betResult = (pickedFighter === winner && methodOfVictory === "decision") ? "win" : "loss"
                break
            case "wins by split / majority decision":
                betResult = (pickedFighter === winner && methodOfVictory === "split decision") ? "win" : "loss"
                break
            case "wins by KO/TKO or Sub":
                betResult = (pickedFighter === winner && (methodOfVictory === "ko" || methodOfVictory === "submission")) ? "win" : "loss"
                break
            case "wins by KO/TKO or Decision":
                betResult = (pickedFighter === winner && (methodOfVictory === "ko" || methodOfVictory === "decision" || methodOfVictory === "split decision")) ? "win" : "loss"
                break
            case "wins by Sub or Decision":
                betResult = (pickedFighter === winner && (methodOfVictory === "submission" || methodOfVictory === "decision" || methodOfVictory === "split decision")) ? "win" : "loss"
                break
            case "wins in round 1/2":
                betResult = (pickedFighter === winner && timeElapsed <= timeStringToSeconds("10:00")) ? "win" : "loss"
                break
            case "wins in round 2/3":
                betResult = (pickedFighter === winner && (timeElapsed > timeStringToSeconds("5:00") && timeElapsed <= timeStringToSeconds("15:00"))) ? "win" : "loss"
                break
            case "wins in round 3/Dec":
                betResult = (pickedFighter === winner && ((timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("15:00")) || methodOfVictory === "decision" || methodOfVictory === "split decision")) ? "win" : "loss"
                break
            case "wins in round 3/4":
                betResult = (pickedFighter === winner && (timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("20:00"))) ? "win" : "loss"
                break
            case "wins in round 5/Dec":
                betResult = (pickedFighter === winner && ((timeElapsed > timeStringToSeconds("20:00") && timeElapsed <= timeStringToSeconds("25:00")) || methodOfVictory === "decision" || methodOfVictory === "split decision")) ? "win" : "loss"
                break
            case "wins by (T)KO round 1":
                betResult = (pickedFighter === winner && timeElapsed <= timeStringToSeconds("5:00") && methodOfVictory === "ko") ? "win" : "loss"
                break
            case "wins by (T)KO round 2":
                betResult = (pickedFighter === winner && methodOfVictory === "ko" && (timeElapsed > timeStringToSeconds("5:00") && timeElapsed <= timeStringToSeconds("10:00"))) ? "win" : "loss"
                break
            case "wins by (T)KO round 3":
                betResult = (pickedFighter === winner && methodOfVictory === "ko" && (timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("15:00"))) ? "win" : "loss"
                break
            case "wins by (T)KO round 4":
                betResult = (pickedFighter === winner && methodOfVictory === "ko" && (timeElapsed > timeStringToSeconds("15:00") && timeElapsed <= timeStringToSeconds("20:00"))) ? "win" : "loss"
                break
            case "wins by (T)KO round 5":
                betResult = (pickedFighter === winner && methodOfVictory === "ko" && (timeElapsed > timeStringToSeconds("20:00") && timeElapsed <= timeStringToSeconds("25:00"))) ? "win" : "loss"
                break
            case "wins by sub round 1":
                betResult = (pickedFighter === winner && timeElapsed <= timeStringToSeconds("5:00") && methodOfVictory === "submission") ? "win" : "loss"
                break
            case "wins by sub round 2":
                betResult = (pickedFighter === winner && methodOfVictory === "submission" && (timeElapsed > timeStringToSeconds("5:00") && timeElapsed <= timeStringToSeconds("10:00"))) ? "win" : "loss"
                break
            case "wins by sub round 3":
                betResult = (pickedFighter === winner && methodOfVictory === "submission" && (timeElapsed > timeStringToSeconds("10:00") && timeElapsed <= timeStringToSeconds("15:00"))) ? "win" : "loss"
                break
            case "wins by sub round 4":
                betResult = (pickedFighter === winner && methodOfVictory === "submission" && (timeElapsed > timeStringToSeconds("15:00") && timeElapsed <= timeStringToSeconds("20:00"))) ? "win" : "loss"
                break
            case "wins by sub round 5":
                betResult = (pickedFighter === winner && methodOfVictory === "submission" && (timeElapsed > timeStringToSeconds("20:00") && timeElapsed <= timeStringToSeconds("25:00"))) ? "win" : "loss"
                break
            case "points handicap -2.5":
                betResult = (
                    pickedFighter === winner &&
                    (
                        (methodOfVictory === "submission" || methodOfVictory === "ko" || methodOfVictory === "dq") ||
                        winnerScore - loserScore > 2.5)
                ) ? "win" : "loss"
                break
            case "points handicap +2.5":
                betResult = (pickedFighter === winner || winnerScore - loserScore < 2.5) ? "win" : "loss"
                break
            case "points handicap -3.5":
                betResult = (
                    pickedFighter === winner &&
                    (
                        (methodOfVictory === "submission" || methodOfVictory === "ko" || methodOfVictory === "dq") ||
                        winnerScore - loserScore > 3.5)
                ) ? "win" : "loss"
                break
            case "points handicap +3.5":
                betResult = (pickedFighter === winner || winnerScore - loserScore < 3.5) ? "win" : "loss"
                break
            case "points handicap -4.5":
                betResult = (
                    pickedFighter === winner &&
                    (
                        (methodOfVictory === "submission" || methodOfVictory === "ko" || methodOfVictory === "dq") ||
                        winnerScore - loserScore > 4.5)
                ) ? "win" : "loss"
                break
            case "points handicap +4.5":
                betResult = (pickedFighter === winner || winnerScore - loserScore < 4.5) ? "win" : "loss"
                break
            case "points handicap -5.5":
                betResult = (
                    pickedFighter === winner &&
                    (
                        (methodOfVictory === "submission" || methodOfVictory === "ko" || methodOfVictory === "dq") ||
                        winnerScore - loserScore > 5.5)
                ) ? "win" : "loss"
                break
            case "points handicap +5.5":
                betResult = (pickedFighter === winner || winnerScore - loserScore < 5.5) ? "win" : "loss"
                break
            case "points handicap -8.5":
                betResult = (
                    pickedFighter === winner &&
                    (
                        (methodOfVictory === "submission" || methodOfVictory === "ko" || methodOfVictory === "dq") ||
                        winnerScore - loserScore > 8.5)
                ) ? "win" : "loss"
                break
            case "points handicap +8.5":
                betResult = (pickedFighter === winner || winnerScore - loserScore < 8.5) ? "win" : "loss"
                break
            case "(scorecards = no action)":
                if (score) {
                    betResult = "push"
                } else if (pickedFighter === winner) {
                    betResult = "win"
                } else {
                    betResult = "loss"
                }
                break
            case "wins in round 1,2,3":
                betResult = (pickedFighter === winner && timeElapsed < timeStringToSeconds("15:00") && (methodOfVictory === "ko" || methodOfVictory === "submission" || methodOfVictory === "dq")) ? "win" : "loss"
                break
            case "wins in round 4,5 or by Dec":
                betResult = (
                    pickedFighter === winner &&
                    (
                        (timeElapsed > timeStringToSeconds("15:00") && timeElapsed < timeStringToSeconds("25:00")) ||
                        (methodOfVictory === "decision" || methodOfVictory === "split decision"))
                ) ? "win" : "loss"
                break
            case "wins (Decision Only)":
                if (!score) {
                    betResult = "push"
                } else if (pickedFighter === winner) {
                    betResult = "win"
                } else {
                    betResult = "loss"
                }
            default:
                betResult = "invalid fighter prop"
                break
        }
    }

    return betResult
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

module.exports = { evalSingleProp }