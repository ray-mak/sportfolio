import { useGetUserResultsQuery } from "./userMMAEventsApiSlice"
import { useState } from "react"
import React from "react"

const UserUpcomingEvents = () => {
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserResultsQuery({ id: "66328e6dd2d69e0a8f67a2c2" })

    const [expandedNote, setExpandedNote] = useState(null)

    const toggleNote = (id) => {
        setExpandedNote(expandedNote === id ? null : id)
    }

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const upcomingBets = data.upcomingBets.map(object => {
            const bet = object.bets.map(item => {
                const isExpanded = expandedNote === item._id
                return (
                    <tbody key={item._id} className="w-full">
                        <tr>
                            <td className="px-4">{item.matchup}</td>
                            <td>{item.pick}</td>
                            <td>{item.odds}</td>
                            <td>{item.betAmount}</td>
                            <td onClick={() => toggleNote(item._id)} className="cursor-pointer">{item.notes ? "Notes" : ""}</td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="w-full">
                                <div className={`notes-tr ${isExpanded ? "expanded" : ""}`}>
                                    <div>
                                        {item.notes}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                )
            })

            return (
                <table key={object.event} className="w-full mt-8">
                    <caption className="text-left text-xl font-medium px-4 py-2">{object.event}</caption>
                    <thead>
                        <tr>
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

        content = (
            <div>
                <h3 className="bg-slate-600 text-white p-2 text-lg font-medium tracking-wide">{data.displayName}'s Upcoming MMA Bets</h3>
                {upcomingBets}
            </div>
        )
    }

    return content
}

export default UserUpcomingEvents