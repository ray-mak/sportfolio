import { useGetUserResultsQuery } from "./userMMAEventsApiSlice"
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
                        {item.notes ? <td onClick={() => toggleNote(item._id)} data-cell="notes" className="cursor-pointer">{item.notes ? "View" : ""}</td> : <td data-cell="notes"></td>}
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

        return (
            <table key={object.event} className="w-full mt-8 border-2 border-zinc-400">
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
                {bet}
            </table>
        )
    })

    const content = (
        <div className="w-full p-6">
            <h3 className="bg-slate-600 text-white p-2 text-lg font-medium tracking-wide">{data.displayName}'s Upcoming MMA Bets</h3>
            {upcomingBets}
        </div>
    )


    return content
}

export default UserUpcomingEvents