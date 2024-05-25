//this function is used to format upcoming bets. 

function formatUpcomingBets(bets, eventResults) {
    const eventGroup = []

    bets.forEach(bet => {
        const { event, ...betData } = bet
        const foundEvent = eventResults.find(item => item.eventName === event)
        if (!foundEvent || foundEvent.matchups.length === 0) {
            if (!eventGroup.some(item => item.event === event)) {
                eventGroup.push({ event: bet.event, bets: [] })
            }

            const eventIndex = eventGroup.findIndex(item => item.event === event)
            eventGroup[eventIndex].bets.push(betData)
        }
    })

    return eventGroup
}

module.exports = { formatUpcomingBets }