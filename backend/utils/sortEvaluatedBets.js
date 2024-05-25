//this function is used to sort evaluated bets. It extracts the "event" and "date" from each object (result) and groups all results with the same event and date.

function sortEvaluatedBets(evaluatedBets) {
    const eventGroup = []

    //loop through each object in evaluatedBets
    evaluatedBets.forEach(bet => {
        //destructure the values from each bet.
        const { event, date, __v, ...betResult } = bet

        //if the event does not exist, we create it and push it to eventGroup
        if (!eventGroup.some(item => item.event === event)) {
            eventGroup.push({ event: event, date: date, eventResults: [] })
        }

        //Find the event. If it exists, we push the bet results to the eventResults.
        const eventIndex = eventGroup.findIndex(item => item.event === event)
        eventGroup[eventIndex].eventResults.push(betResult)
    })

    //sort the event group based on date, with the older events at the bottom
    const sortedBets = eventGroup.sort((a, b) => new Date(b.date) - new Date(a.date))
    return sortedBets
}

module.exports = { sortEvaluatedBets }

