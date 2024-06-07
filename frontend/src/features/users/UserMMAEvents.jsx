//This displays a users upcoming and past MMA events that they have picks/bets on
import { useGetUserResultsQuery } from "./userMMAEventsApiSlice"

const UserMMAEvents = ({ data }) => {
    console.log(data)

    const betHistory = data.betHistory.map(object => {
        const betResults = object.eventResults.map(bet => {
            let textColor
            if (bet.result === "Win") {
                textColor = "text-green-700"
            } else if (bet.result === "Loss") {
                textColor = "text-red-600"
            } else {
                textColor = "text-gray-500"
            }
            return (
                <tr key={bet._id}>
                    <td className="px-4">{bet.matchup}</td>
                    <td>{bet.pick}</td>
                    <td className={textColor}>{bet.result}</td>
                    <td>{bet.betAmount.toFixed(2)}</td>
                    <td>{bet.profit}</td>
                    <td>{bet.roi}%</td>
                </tr>
            )
        })
        let totalBetAmount = 0
        let totalProfit = 0
        object.eventResults.forEach(bet => totalBetAmount += bet.betAmount)
        object.eventResults.forEach(bet => totalProfit += Number(bet.profit))
        const totalROI = totalProfit / totalBetAmount * 100
        let trBg
        let textColor
        totalProfit >= 0 ? trBg = "bg-lime-200" : trBg = "bg-red-200"
        totalProfit >= 0 ? textColor = "text-green-700" : textColor = "text-red-600"

        return (
            <table key={object.event} className="w-full mt-6 border-2 border-zinc-400">
                <caption className="text-left text-xl font-medium px-4 py-2">{object.event}</caption>
                <thead>
                    <tr className="bg-slate-200">
                        <th scope="col" className="text-left px-4">Matchup</th>
                        <th scope="col" className="text-left">Pick</th>
                        <th scope="col" className="text-left">Result</th>
                        <th scope="col" className="text-left">Units Bet</th>
                        <th scope="col" className="text-left">Units Profit</th>
                        <th scope="col" className="text-left">ROI</th>
                    </tr>
                </thead>
                <tbody>
                    {betResults}
                    <tr className={trBg}>
                        <th className="text-left py-1 px-4">Total</th>
                        <th></th>
                        <th></th>
                        <th className="text-left">{totalBetAmount}</th>
                        <th className={`text-left ${textColor}`}>{totalProfit.toFixed(2)}</th>
                        <th className={`text-left ${textColor}`}>{totalROI.toFixed(0)}%</th>
                    </tr>
                </tbody>
            </table>
        )
    })
    const content = (
        <div className="w-full p-6 ">
            <h3 className="bg-slate-600 text-white p-2 text-lg font-medium tracking-wide">{data.displayName}'s MMA Bet History</h3>
            {betHistory}
        </div>
    )


    return content
}

export default UserMMAEvents