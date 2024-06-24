import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const LineChartMMA = ({ data }) => {
    const labels = ["N/A"]
    const mlData = [0]
    let mlTotals = 0

    data.betHistory.toReversed().forEach(object => {
        labels.push(object.event)
        object.eventResults.forEach(matchup => {
            let mlProfit = Number(matchup.profit)
            mlTotals += mlProfit
        })
        mlData.push(mlTotals.toFixed(2))

    })

    const options = {}

    const chartData = {
        labels,
        datasets: [
            {
                label: "Moneyline Bets",
                data: mlData
            }
        ]
    }

    console.log(labels, mlData)
    return (
        <Line options={options} data={chartData} />
    )
}

export default LineChartMMA