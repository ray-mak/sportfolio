//This displays a users upcoming and past MMA events that they have picks/bets on
import { useGetUserResultsQuery } from "./userMMAEventsApiSlice"

const UserMMAEvents = ({ data }) => {
    console.log(data)

    const betHistory = data.betHistory.map(object => {
        const betResults = object.eventResults.map(bet => {
            let textColor
            if (bet.result === "win") {
                textColor = "text-green-700"
            } else if (bet.result === "loss") {
                textColor = "text-red-600"
            } else {
                textColor = "text-gray-500"
            }
            return (
                <tr key={bet._id} className="text-sm">
                    <td data-cell="matchup" className="md:px-4">{bet.matchup}</td>
                    <td data-cell="pick">{bet.pick}</td>
                    <td data-cell="result" className={`capitalize ${textColor}`}>{bet.result}</td>
                    <td data-cell="odds">{bet.odds.toFixed(2)}</td>
                    <td data-cell="units bet">{bet.betAmount.toFixed(2)}</td>
                    <td data-cell="units profit">{bet.profit}</td>
                    <td data-cell="ROI">{bet.roi}%</td>
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

        const propResults = object.propResults.map(bet => {
            let textColor
            if (bet.result === "win") {
                textColor = "text-green-700"
            } else if (bet.result === "loss") {
                textColor = "text-red-600"
            } else {
                textColor = "text-gray-500"
            }
            const isFighterProp = bet.propType === "fighterProp" ? true : false
            return (
                <tr key={bet._id} className="text-sm">
                    <td data-cell="matchup" className="md:px-4">{bet.matchup}</td>
                    <td data-cell="pick">{isFighterProp ? `${bet.pickFighter} ${bet.fighterProp}` : bet.timeProp}</td>
                    <td data-cell="result" className={`capitalize ${textColor}`}>{bet.result}</td>
                    <td data-cell="odds">{bet.odds.toFixed(2)}</td>
                    <td data-cell="units bet">{bet.betAmount.toFixed(2)}</td>
                    <td data-cell="units profit">{bet.profit}</td>
                    <td data-cell="ROI">{bet.roi}%</td>
                </tr>
            )
        })
        let totalPropBetAmount = 0
        let totalPropBetProfit = 0
        object.propResults.forEach(bet => totalPropBetAmount += bet.betAmount)
        object.propResults.forEach(bet => totalPropBetProfit += Number(bet.profit))
        const totalPropROI = totalPropBetProfit / totalPropBetAmount * 100

        let totalParlayBetAmount = 0
        let totalParlayProfitAmount = 0
        const parlayResults = object.parlayResults.map(bet => {
            totalParlayBetAmount += bet.betAmount
            totalParlayProfitAmount += Number(bet.profit)
            const totalOdds = bet.parlayInfo.reduce((accumulator, parlayLeg) => accumulator * parlayLeg.odds, 1)
            const parlay = bet.parlayInfo.map(leg => {
                let pick
                if (leg.parlayBetType === "moneyline") {
                    pick = `${leg.pick} to win`
                } else if (leg.parlayBetType === "prop" && leg.propType === "timeProp") {
                    pick = leg.timeProp
                } else if (leg.parlayBetType === "prop" && leg.propType === "fighterProp") {
                    pick = `${leg.pickFighter} ${leg.fighterProp}`
                }
                let textColor
                if (leg.result === "win") {
                    textColor = "text-green-700"
                } else if (leg.result === "loss") {
                    textColor = "text-red-600"
                } else {
                    textColor = "text-gray-500"
                }
                return (
                    <tr key={leg._id} className="text-sm">
                        <td data-cell="matchup" className="md:px-4">{leg.matchup}</td>
                        <td data-cell="pick">{pick}</td>
                        <td data-cell="result" className={`capitalize ${textColor}`}>{leg.result}</td>
                        <td data-cell="odds">{leg.odds.toFixed(2)}</td>
                        <td colSpan="3" className="hidden-td"></td>
                    </tr>
                )
            })

            return (
                <tbody key={bet._id} className="parlay-result-tr">
                    {parlay}
                    <tr className="text-sm">
                        <td colSpan="3"></td>
                        <td data-cell="parlay odds">{totalOdds.toFixed(2)}</td>
                        <td data-cell="Units Bet">{bet.betAmount.toFixed(2)}</td>
                        <td data-cell="Units profit">{bet.profit}</td>
                        <td data-cell="ROI">{bet.roi}%</td>
                    </tr>
                </tbody>
            )
        })
        const totalParlayROI = totalParlayProfitAmount / totalParlayBetAmount * 100
        const eventBetAmount = Number(totalBetAmount.toFixed(2)) + Number(totalPropBetAmount.toFixed(2)) + Number(totalParlayBetAmount.toFixed(2))
        const eventProfit = totalParlayProfitAmount + totalPropBetProfit + totalProfit
        const eventROI = eventProfit / eventBetAmount * 100

        return (
            <table key={object.event} className="w-full mb-6 border-2 border-zinc-400">
                <caption className="text-left text-xl font-medium px-4 py-2">{object.event}</caption>
                <thead>
                    <tr className="bg-slate-200 text-sm">
                        <th scope="col" className="text-left px-4">Matchup</th>
                        <th scope="col" className="text-left">Pick</th>
                        <th scope="col" className="text-left pr-2">Result</th>
                        <th scope="col" className="text-left pr-2">Odds</th>
                        <th scope="col" className="text-left pr-2">Units Bet</th>
                        <th scope="col" className="text-left pr-2">Units Profit</th>
                        <th scope="col" className="text-left pr-2">ROI</th>
                    </tr>
                </thead>
                {betResults?.length > 0 && <tbody>
                    <tr>
                        <td colSpan="7" className="font-medium py-1 px-2 underline hide-attr">Moneyline Results</td>
                    </tr>
                    {betResults}
                    <tr className={` bg-indigo-200 text-sm result-tr`}>
                        <td data-cell="event total" className="text-left py-1 px-4" colSpan="4">Moneyline Totals</td>
                        <td data-cell="total units bet" className="text-left">{totalBetAmount}</td>
                        <td data-cell="total units profit" className={`text-left ${textColor}`}>{totalProfit.toFixed(2)}</td>
                        <td data-cell="total ROI" className={`text-left ${textColor}`}>{totalROI.toFixed(0)}%</td>
                    </tr>
                </tbody>}
                {propResults?.length > 0 && <tbody>
                    <tr>
                        <td colSpan="7" className="font-medium py-1 px-2 underline hide-attr">Prop Results</td>
                    </tr>
                    {propResults}
                    <tr className={`text-sm result-tr bg-indigo-200`}>
                        <td data-cell="prop total" className="text-left py-1 px-4" colSpan="4">Prop Totals</td>
                        <td data-cell="prop units bet" className="text-left">{totalPropBetAmount.toFixed(2)}</td>
                        <td data-cell="prop units profit" className={`text-left ${totalPropBetProfit >= 0 ? " text-green-700" : "text-red-600"}`}>{totalPropBetProfit.toFixed(2)}</td>
                        <td data-cell="prop ROI" className={`text-left ${totalPropBetProfit >= 0 ? " text-green-700" : "text-red-600"}`}>{totalPropROI.toFixed(0)}%</td>
                    </tr>
                </tbody>}
                {parlayResults?.length > 0 && <>
                    <tbody>
                        <tr>
                            <td colSpan="7" className="font-medium py-1 px-2 underline hide-attr">Parlay Results</td>
                        </tr>
                    </tbody>
                    {parlayResults}
                    <tbody>
                        <tr className="text-sm result-tr bg-indigo-200">
                            <td data-cell="parlay total" className="text-left py-1 px-4" colSpan="4">Parlay Totals</td>
                            <td data-cell="parlay units bet" className="text-left">{totalParlayBetAmount.toFixed(2)}</td>
                            <td data-cell="parlay units profit" className={`text-left ${totalParlayProfitAmount >= 0 ? " text-green-700" : "text-red-600"}`}>{totalParlayProfitAmount.toFixed(2)}</td>
                            <td data-cell="parlay ROI" className={`text-left ${totalParlayProfitAmount >= 0 ? " text-green-700" : "text-red-600"}`}>{totalParlayROI.toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </>}
                <tbody>
                    <tr className={`${eventProfit >= 0 ? "bg-lime-200" : "bg-red-200"}`}>
                        <td colSpan="4" className="py-2 font-medium hide-attr">Event Total</td>
                        <td data-cell="total units bet" className="text-left text-sm">{eventBetAmount}</td>
                        <td data-cell="total event profit" className="text-left text-sm">{eventProfit.toFixed(2)}</td>
                        <td data-cell="event ROI" className="text-left text-sm pb-2">{eventROI.toFixed(0)}%</td>
                    </tr>
                </tbody>
            </table>
        )
    })
    const content = (
        <div className="w-full bg-white">
            <h3 className="bg-slate-600 text-white p-2 text-lg font-medium tracking-wide">{data.displayName}'s MMA Bet History</h3>
            <div className="p-4">
                {betHistory}
            </div>
        </div>
    )


    return content
}

export default UserMMAEvents