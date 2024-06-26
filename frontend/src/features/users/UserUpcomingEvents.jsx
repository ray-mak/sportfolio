import { useState } from "react"
import React from "react"

const UserUpcomingEvents = ({ data }) => {

    const [expandedNote, setExpandedNote] = useState(null)

    const toggleNote = (id) => {
        setExpandedNote(expandedNote === id ? null : id)
    }


    const upcomingBets = data.upcomingBets.map(object => {
        const bet = object.bets.map(item => {
            const isExpanded = expandedNote === item._id
            return (
                <tbody key={item._id} className="w-full">
                    <tr>
                        <td data-cell="matchup" className="px-4">{item.matchup}</td>
                        <td data-cell="pick">{item.pick}</td>
                        <td data-cell="odds">{item.odds}</td>
                        <td data-cell="units bet">{item.betAmount}</td>
                        {item.notes ? <td onClick={() => toggleNote(item._id)} data-cell="notes" className="cursor-pointer text-blue-700 underline">{item.notes ? "View" : ""}</td> : <td data-cell="notes"></td>}
                    </tr>
                    <tr className="events-tr">
                        <td colSpan="5" className="w-full">
                            <div className={`notes-tr ${isExpanded ? "expanded" : ""} bg-zinc-200`}>
                                <div>
                                    <div className="p-4">
                                        {item.notes}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            )
        })

        const propBet = object.props.map(item => {
            const isExpanded = expandedNote === item._id
            const isFighterProp = item.propType === "fighterProp" ? true : false
            return (
                <tbody key={item._id} className="w-full">
                    <tr>
                        <td data-cell="matchup" className="px-4">{item.matchup}</td>
                        <td data-cell="pick">{isFighterProp ? `${item.pickFighter} ${item.fighterProp}` : item.timeProp}</td>
                        <td data-cell="odds">{item.odds}</td>
                        <td data-cell="units bet">{item.betAmount}</td>
                        {item.notes ? <td onClick={() => toggleNote(item._id)} data-cell="notes" className="cursor-pointer text-blue-700 underline">{item.notes ? "View" : ""}</td> : <td data-cell="notes"></td>}
                    </tr>
                    <tr className="events-tr">
                        <td colSpan="5" className="w-full">
                            <div className={`notes-tr ${isExpanded ? "expanded" : ""} bg-zinc-200`}>
                                <div>
                                    <div className="p-4">
                                        {item.notes}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            )
        })

        const parlays = object.parlays.map(item => {
            const totalOdds = item.parlayInfo.reduce((accumulator, parlayLeg) => accumulator * parlayLeg.odds, 1)
            const parlayLeg = item.parlayInfo.map(leg => {
                const isExpanded = expandedNote === leg._id
                let pick
                if (leg.parlayBetType === "moneyline") {
                    pick = `${leg.pick} to win`
                } else if (leg.parlayBetType === "prop" && leg.propType === "timeProp") {
                    pick = leg.timeProp
                } else if (leg.parlayBetType === "prop" && leg.propType === "fighterProp") {
                    pick = `${leg.pickFighter} ${leg.fighterProp}`
                }

                return (
                    <React.Fragment key={leg._id}>
                        <tr>
                            <td data-cell="matchup" className="md:px-4">{leg.matchup}</td>
                            <td data-cell="pick">{pick}</td>
                            <td data-cell="odds">{leg.odds.toFixed(2)}</td>
                            <td className="hidden-td"></td>
                            {item.notes ? <td onClick={() => toggleNote(item._id)} data-cell="notes" className="cursor-pointer text-blue-700 underline">{item.notes ? "View" : ""}</td> : <td data-cell="notes"></td>}
                        </tr>
                        <tr className="events-tr">
                            <td colSpan="5" className="w-full">
                                <div className={`notes-tr ${isExpanded ? "expanded" : ""} bg-zinc-200`}>
                                    <div>
                                        <div className="p-4">
                                            {item.notes}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </React.Fragment>
                )
            })

            return (
                <tbody key={item._id} className="parlay-upcoming-tr">
                    {parlayLeg}
                    <tr>
                        <td colSpan="2" className="hidden-td"></td>
                        <td data-cell="parlay odds">{totalOdds.toFixed(2)}</td>
                        <td data-cell="Units Bet">{item.betAmount.toFixed(2)}</td>
                        <td className="hidden-td"></td>
                    </tr>
                </tbody>
            )
        })

        return (
            <table key={object.event} className="w-full border-2 border-zinc-400 text-sm">
                <caption className="text-left text-xl font-medium px-4 py-2">{object.event}</caption>
                <thead>
                    <tr className="bg-slate-200">
                        <th scope="col" className="text-left px-4">Matchup</th>
                        <th scope="col" className="text-left">Pick</th>
                        <th scope="col" className="text-left">Odds</th>
                        <th scope="col" className="text-left">Bet Amount</th>
                        <th scope="col" className="text-left">Notes</th>
                    </tr>
                </thead>
                {bet?.length > 0 && <>
                    <tbody>
                        <tr>
                            <td colSpan="5" className="font-medium text-base py-1 px-2 underline hide-attr">Moneyline Picks</td>
                        </tr>
                    </tbody>
                    {bet}
                </>}
                {propBet?.length > 0 && <>
                    <tbody>
                        <tr>
                            <td colSpan="5" className="font-medium text-base py-1 px-2 underline hide-attr">Prop Picks</td>
                        </tr>
                    </tbody>
                    {propBet}
                </>}
                {parlays?.length > 0 && <>
                    <tbody>
                        <tr>
                            <td colSpan="5" className="font-medium text-base py-1 px-2 underline hide-attr">Parlays</td>
                        </tr>
                    </tbody>
                    {parlays}
                </>}
            </table>
        )
    })

    const content = (
        <div className="w-full bg-white">
            <h3 className="bg-slate-600 text-white p-2 text-lg font-medium tracking-wide">{data.displayName}'s Upcoming MMA Bets</h3>
            <div className="p-6 flex flex-col gap-6">
                {upcomingBets}
            </div>
        </div>
    )


    return content
}

export default UserUpcomingEvents