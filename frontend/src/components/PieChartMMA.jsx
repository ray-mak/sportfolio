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
                backgroundColor: ["#2991FF", "#DF29FF", "#F3DF36"]
            }
        ]
    }

    const options = {

    }

    return (
        <div style={{ height: '200px' }}>
            <Pie options={options} data={pieData} height={100} />
        </div>
    )
}

export default PieChartMMA