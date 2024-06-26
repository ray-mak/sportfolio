import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(Tooltip, Legend, ArcElement)

const PieChartMMA = ({ data }) => {
    let moneyline = 0
    let props = 0
    let parlays = 0

    data.betHistory.forEach(object => {
        moneyline += object.eventResults.length
        props += object.propResults.length
        parlays += object.parlayResults.length
    })

    const pieData = {
        labels: ["Moneyline Bets", "Props", "Parlays"],
        datasets: [
            {
                label: "Bets By Type",
                data: [moneyline, props, parlays],
                backgroundColor: ["#227EB6", "#C437E0", "#F3DF36"]
            }
        ]
    }

    const options = {

    }

    return (
        <Pie options={options} data={pieData} height={100} />
    )
}

export default PieChartMMA