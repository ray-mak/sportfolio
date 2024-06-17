import { useState } from "react"

const UserStatsSummary = ({ data }) => {
    console.log(data, data.mlStats.totalBetAmount)
    const totalCorrect = data.mlStats.totalCorrect + data.propStats.totalCorrectProps + data.parlayStats.totalCorrectParlays
    const totalPicks = data.mlStats.totalPicks + data.propStats.totalPropPicks + data.parlayStats.totalParlays
    const percentCorrect = totalCorrect / totalPicks * 100
    const betAmount = data.mlStats.totalBetAmount + data.propStats.totalPropBetAmount + data.parlayStats.totalParlayBetAmount
    const profitAmount = data.mlStats.totalProfit + data.propStats.totalPropProfit + data.parlayStats.totalParlayProfit
    const totalROI = profitAmount / betAmount * 100
    return (
        <div>
            <div className="flex flex-col items-center md:flex-row">
                <div>
                    <p className="text-xl font-semibold">{data.displayName}</p>
                    <div className="flex w-40 h-44 border-2">

                    </div>
                </div>
                <table className="w-full mt-6 md:mt-0 md:ml-6 stats-summary">
                    <caption className="text-lg font-semibold">MMA Betting Stats Summary</caption>
                    <thead>
                        <tr>
                            <th></th>
                            <th scope="col" className="text-left">Overall Stats</th>
                            <th scope="col" className="text-left">Moneyline Stats</th>
                            <th scope="col" className="text-left">Prop Stats</th>
                            <th scope="col" className="text-left">Parlay Stats</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Correct Picks</td>
                            <td data-cell="correct picks">{totalCorrect}</td>
                            <td data-cell="correct moneyline picks">{data.mlStats.totalCorrect}</td>
                            <td data-cell="correct prop picks">{data.propStats.totalCorrectProps}</td>
                            <td data-cell="correct parlays">{data.parlayStats.totalCorrectParlays}</td>
                        </tr>
                        <tr>
                            <td>Total Picks</td>
                            <td data-cell="total picks">{totalPicks}</td>
                            <td data-cell="total moneyline picks">{data.mlStats.totalPicks}</td>
                            <td data-cell="total prop picks">{data.propStats.totalPropPicks}</td>
                            <td data-cell="total parlays">{data.parlayStats.totalParlays}</td>
                        </tr>
                        <tr>
                            <td>Percent Correct</td>
                            <td data-cell="percent correct overall">{percentCorrect.toFixed(0)}%</td>
                            <td data-cell="moneyline percent correct">{data.mlStats.percentCorrect}%</td>
                            <td data-cell="props percent correct">{data.propStats.propPercentCorrect}%</td>
                            <td data-cell="parlays percent correct">{data.parlayStats.parlayPercentCorrect}%</td>
                        </tr>
                        <tr>
                            <td>Total Bet Amount</td>
                            <td data-cell="total units bet">{betAmount}</td>
                            <td data-cell="moneyline units bet">{data.mlStats.totalBetAmount}</td>
                            <td data-cell="props units bet">{data.propStats.totalPropBetAmount}</td>
                            <td data-cell="parlays units bet">{data.parlayStats.totalParlayBetAmount}</td>
                        </tr>
                        <tr>
                            <td>Total Profit Amount</td>
                            <td data-cell="total profit">{profitAmount}</td>
                            <td data-cell="moneyline profit">{data.mlStats.totalProfit}</td>
                            <td data-cell="props profit">{data.propStats.totalPropProfit}</td>
                            <td data-cell="parlays profit">{data.parlayStats.totalParlayProfit}</td>
                        </tr>
                        <tr>
                            <td>Total ROI</td>
                            <td data-cell="total ROI">{totalROI.toFixed(0)}%</td>
                            <td data-cell="moneyline ROI">{data.mlStats.totalROI}%</td>
                            <td data-cell="props ROI">{data.propStats.propROI}%</td>
                            <td data-cell="parlays ROI">{data.parlayStats.parlayROI}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserStatsSummary