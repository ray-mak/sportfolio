//this function is used to format upcoming bets. 

function formatUpcomingBets(bets, props, upcomingParlays, eventResults) {
    const eventGroup = []

    bets.forEach(bet => {
        const { event, __v, username, ...betData } = bet
        const foundEvent = eventResults.find(item => item.eventName === event)
        if (!foundEvent || foundEvent.matchups.length === 0) {
            if (!eventGroup.some(item => item.event === event)) {
                eventGroup.push({ event: bet.event, bets: [], props: [], parlays: [] })
            }

            const eventIndex = eventGroup.findIndex(item => item.event === event)
            eventGroup[eventIndex].bets.push(betData)
        }
    })

    props.forEach(prop => {
        const { event, betType, __v, username, ...betData } = prop
        const foundEvent = eventResults.find(item => item.eventName === event)
        if (!foundEvent || foundEvent.matchups.length === 0) {
            if (!eventGroup.some(item => item.event === event)) {
                eventGroup.push({ event: event, bets: [], props: [], parlays: [] })
            }
            const eventIndex = eventGroup.findIndex(item => item.event === event)
            eventGroup[eventIndex].props.push(betData)
        }
    })

    upcomingParlays.forEach(parlay => {
        const parlayLeg = parlay.parlayInfo
        let addedToGroup = false
        parlayLeg.forEach(leg => {
            if (!addedToGroup) {
                const eventIndex = eventGroup.findIndex(item => item.event === leg.event)
                if (eventIndex >= 0) {
                    eventGroup[eventIndex].parlays.push(parlay)
                    addedToGroup = true
                } else {
                    eventGroup.push({ event: leg.event, bets: [], props: [], parlays: parlay })
                    addedToGroup = true
                }
            }
        })
    })

    return eventGroup
}

module.exports = { formatUpcomingBets }