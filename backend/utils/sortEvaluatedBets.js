//this function is used to sort evaluated bets. It extracts the "event" and "date" from each object (result) and groups all results with the same event and date.

function sortEvaluatedBets(evaluatedMLBets, evaluatedPropBets, evaluatedParlays) {
    const eventGroup = []

    //loop through each object in evaluatedBets
    evaluatedMLBets.forEach(bet => {
        //destructure the values from each bet.
        const { event, date, __v, ...betResult } = bet

        //if the event does not exist, we create it and push it to eventGroup (eventResults is for ML bets only)
        if (!eventGroup.some(item => item.event === event)) {
            eventGroup.push({ event: event, date: date, eventResults: [], propResults: [], parlayResults: [] })
        }

        //Find the event. If it exists, we push the bet results to the eventResults.
        const eventIndex = eventGroup.findIndex(item => item.event === event)
        eventGroup[eventIndex].eventResults.push(betResult)
    })

    evaluatedPropBets.forEach(bet => {
        const { event, date, ...betResult } = bet

        //propResults is for props ONLY
        if (!eventGroup.some(item => item.event === event)) {
            eventGroup.push({ event: event, date: date, eventResults: [], propResults: [], parlayResults: [] })
        }

        const eventIndex = eventGroup.findIndex(item => item.event === event)
        eventGroup[eventIndex].propResults.push(betResult)
    })

    //need to add date to evaluatedParlays
    evaluatedParlays.forEach(parlay => {
        const parlayLegs = parlay.parlayInfo
        let addedToGroup = false
        parlayLegs.forEach(leg => {
            if (!addedToGroup) {
                const eventIndex = eventGroup.findIndex(item => item.event === leg.event)
                if (eventIndex >= 0) {
                    eventGroup[eventIndex].parlayResults.push(parlay)
                    addedToGroup = true
                } else {
                    eventGroup.push({ event: leg.event, eventResults: [], propResults: [], parlayResults: parlay })
                    addedToGroup = true
                }
            }
        })

    })

    //sort the event group based on date, with the older events at the bottom
    const sortedBets = eventGroup.sort((a, b) => new Date(b.date) - new Date(a.date))
    return sortedBets
}

module.exports = { sortEvaluatedBets }

