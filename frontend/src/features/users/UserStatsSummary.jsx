import { useState } from "react"
import PieChartMMA from "../../components/PieChartMMA"

const UserStatsSummary = ({ data }) => {
    const [showMLStats, setShowMLStats] = useState(false)
    const toggleMLStats = () => {
        setShowMLStats(prevState => !prevState)
    }

    const [showSummary, setShowSummary] = useState(true)
    const toggleSummary = () => {
        setShowSummary(prevState => !prevState)
    }

    const totalCorrect = data.mlStats.totalCorrect + data.propStats.totalCorrectProps + data.parlayStats.totalCorrectParlays
    const totalPicks = data.mlStats.totalPicks + data.propStats.totalPropPicks + data.parlayStats.totalParlays
    const percentCorrect = totalCorrect / totalPicks * 100
    const betAmount = data.mlStats.totalBetAmount + data.propStats.totalPropBetAmount + data.parlayStats.totalParlayBetAmount
    const profitAmount = data.mlStats.totalProfit + data.propStats.totalPropProfit + data.parlayStats.totalParlayProfit
    const totalROI = profitAmount / betAmount * 100
    return (
        <div>
            <div className="flex flex-col items-center text-sm md:flex-row gap-6">

                <div className="w-full border-2 border-slate-300">
                    <div className="flex border-2 border-slate-300 items-center py-1 px-2 text-lg text-left font-medium text-white bg-cyan-700  md:border-0">
                        <p>MMA Betting Stats Summary</p>
                        <button onClick={toggleSummary} aria-label="toggle summary stats" className="ml-auto text-sm font-normal cursor-pointer underline toggle-button">{showSummary ? "hide" : "show"}</button>
                    </div>
                    <div className={`summary-table ${showSummary ? "" : "table-hidden"} md:p-4 bg-white`}>
                        <table className="w-full md:mt-0 stats-summary">
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
                                    <td data-cell="correct parlays" className="pb-2 md:pb-0">{data.parlayStats.totalCorrectParlays}</td>
                                </tr>
                                <tr className="bg-neutral-200">
                                    <td>Total Picks</td>
                                    <td data-cell="total picks">{totalPicks}</td>
                                    <td data-cell="total moneyline picks">{data.mlStats.totalPicks}</td>
                                    <td data-cell="total prop picks">{data.propStats.totalPropPicks}</td>
                                    <td data-cell="total parlays" className="pb-2 md:pb-0">{data.parlayStats.totalParlays}</td>
                                </tr>
                                <tr>
                                    <td>Percent Correct</td>
                                    <td data-cell="percent correct overall">{percentCorrect.toFixed(0)}%</td>
                                    <td data-cell="moneyline percent correct">{data.mlStats.percentCorrect}%</td>
                                    <td data-cell="props percent correct">{data.propStats.propPercentCorrect}%</td>
                                    <td data-cell="parlays percent correct" className="pb-2 md:pb-0">{data.parlayStats.parlayPercentCorrect}%</td>
                                </tr>
                                <tr className="bg-neutral-200">
                                    <td>Total Bet Amount</td>
                                    <td data-cell="total units bet">{betAmount}</td>
                                    <td data-cell="moneyline units bet">{data.mlStats.totalBetAmount}</td>
                                    <td data-cell="props units bet">{data.propStats.totalPropBetAmount}</td>
                                    <td data-cell="parlays units bet" className="pb-2 md:pb-0">{data.parlayStats.totalParlayBetAmount}</td>
                                </tr>
                                <tr>
                                    <td>Total Profit Amount</td>
                                    <td data-cell="total profit">{profitAmount}</td>
                                    <td data-cell="moneyline profit">{data.mlStats.totalProfit}</td>
                                    <td data-cell="props profit">{data.propStats.totalPropProfit}</td>
                                    <td data-cell="parlays profit" className="pb-2 md:pb-0">{data.parlayStats.totalParlayProfit}</td>
                                </tr>
                                <tr className="bg-neutral-200">
                                    <td>Total ROI</td>
                                    <td data-cell="total ROI">{totalROI.toFixed(0)}%</td>
                                    <td data-cell="moneyline ROI">{data.mlStats.totalROI}%</td>
                                    <td data-cell="props ROI">{data.propStats.propROI}%</td>
                                    <td data-cell="parlays ROI" className="pb-2 md:pb-0">{data.parlayStats.parlayROI}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-2 bg-white border-2 border-slate-300" style={{ height: '226px' }}>
                    {/* <p className="text-xl font-semibold">{data.displayName}</p>
                    <div className="flex w-40 h-44 border-2">
                    </div> */}
                    <PieChartMMA data={data} />
                </div>
            </div>
            <div className="mt-4 border-2 border-slate-300">
                <div className="flex items-center px-2 py-1 text-lg text-left font-medium text-white bg-cyan-700">
                    <p>Moneyline Stats</p>
                    <button onClick={toggleMLStats} aria-label="toggle moneyline stats" className="ml-auto text-sm font-normal cursor-pointer underline toggle-button">{showMLStats ? "hide" : "show"}</button>
                </div>
                <div className={`md:p-4 bg-white ml-stats-table ${showMLStats ? "" : "table-hidden"}`}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col" className="text-left">Picks</th>
                                <th scope="col" className="text-left">Correct</th>
                                <th scope="col" className="text-left">% Correct</th>
                                <th scope="col" className="text-left">Units Bet</th>
                                <th scope="col" className="text-left">Units Profit</th>
                                <th scope="col" className="text-left">ROI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="text-left">Big Favorites</th>
                                <td data-cell="big favorite picks" className="mt-2">{data.mlStats.bigFavPick}</td>
                                <td data-cell="big favorite correct">{data.mlStats.bigFavWin}</td>
                                <td data-cell="big favorite percent correct">{data.mlStats.bigFavWinPercent}%</td>
                                <td data-cell="big favorite units bet">{data.mlStats.bigFavBetAmount}</td>
                                <td data-cell="big favorite units profit">{data.mlStats.bigFavProfit}</td>
                                <td data-cell="big favorite ROI">{data.mlStats.bigFavROI}%</td>
                            </tr>
                            <tr className="bg-neutral-200">
                                <th className="text-left">Slight Favorites</th>
                                <td data-cell="slight favorite picks" className="mt-2">{data.mlStats.slightFavPick}</td>
                                <td data-cell="slight favorite correct">{data.mlStats.slightFavWin}</td>
                                <td data-cell="slight favorite percent correct">{data.mlStats.slightFavWinPercent}%</td>
                                <td data-cell="slight favorite units bet">{data.mlStats.slightFavBetAmount}</td>
                                <td data-cell="slight favorite units profit">{data.mlStats.slightFavProfit}</td>
                                <td data-cell="slight favorite ROI">{data.mlStats.slightFavROI}%</td>
                            </tr>
                            <tr>
                                <th className="text-left">Slight Underdogs</th>
                                <td data-cell="slight underdog picks" className="mt-2">{data.mlStats.slightDogPick}</td>
                                <td data-cell="slight underdog correct">{data.mlStats.slightDogWin}</td>
                                <td data-cell="slight underdog percent correct">{data.mlStats.slightDogWinPercent}%</td>
                                <td data-cell="slight underdog units bet">{data.mlStats.slightDogBetAmount}</td>
                                <td data-cell="slight underdog units profit">{data.mlStats.slightDogProfit}</td>
                                <td data-cell="slight underdog ROI">{data.mlStats.slightDogROI}%</td>
                            </tr>
                            <tr className="bg-neutral-200">
                                <th className="text-left">Big Underdogs</th>
                                <td data-cell="big underdog picks" className="mt-2">{data.mlStats.bigDogPick}</td>
                                <td data-cell="big underdog correct">{data.mlStats.bigDogWin}</td>
                                <td data-cell="big underdog percent correct">{data.mlStats.bigDogWinPercent}%</td>
                                <td data-cell="big underdog units bet">{data.mlStats.bigDogBetAmount}</td>
                                <td data-cell="big underdog units profit">{data.mlStats.bigDogProfit}</td>
                                <td data-cell="big underdog ROI" className="mb-2">{data.mlStats.bigDogROI}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserStatsSummary