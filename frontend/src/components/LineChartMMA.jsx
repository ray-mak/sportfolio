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
    Legend,
    plugins,
    scales
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
    const propData = [0]
    const parlayData = [0]
    let mlTotals = 0
    let propTotals = 0
    let parlayTotals = 0

    data.betHistory.toReversed().forEach(object => {
        labels.push(object.event)
        object.eventResults.forEach(matchup => {
            let mlProfit = Number(matchup.profit)
            mlTotals += mlProfit
        })
        mlData.push(mlTotals.toFixed(2))

        object.propResults.forEach(matchup => {
            let propProfit = Number(matchup.profit)
            propTotals += propProfit
        })
        propData.push(propTotals.toFixed(2))

        object.parlayResults.forEach(matchup => {
            let parlayProfit = Number(matchup.profit)
            parlayTotals += parlayProfit
        })
        parlayData.push(parlayTotals)

    })

    const totalData = []
    for (let i = 0; i < mlData.length; i++) {
        const totalProfit = Number(mlData[i]) + Number(propData[i]) + Number(parlayData[i])
        totalData.push(totalProfit)
    }


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Units Profit Per Event Over Time",
                font: {
                    size: 18,
                    weight: 600
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Events",
                    font: {
                        size: 14,
                        weight: 600
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Units Profit",
                    font: {
                        size: 14,
                        weight: 600
                    }
                }
            }
        }
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: "Moneyline Bets",
                data: mlData,
                borderColor: "#227EB6",
                backgroundColor: "#227EB6"
            },
            {
                label: "Prop Bets",
                data: propData,
                borderColor: "#C437E0",
                backgroundColor: "#C437E0"
            },
            {
                label: "Parlays",
                data: parlayData,
                borderColor: "#F3DF36",
                backgroundColor: "#F3DF36"
            },
            {
                label: "Total Profit",
                data: totalData,
                borderColor: "#189C00",
                backgroundColor: "#189C00"
            }
        ]
    }

    console.log(totalData)
    return (
        <Line options={options} data={chartData} height={200} />
    )
}

export default LineChartMMA