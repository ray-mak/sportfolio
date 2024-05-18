import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUserById } from "./usersApiSlice"

const MMALeaderboardUser = ({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId))
    const navigate = useNavigate()

    if (user) {
        const results = user.bets
        let picks = 0
        let profit = 0
        let unitsBet = 0
        let roi

        for (const result of results) {
            picks++
            profit = profit += Number(result.profit)
            unitsBet = unitsBet += result.betAmount
        }

        roi = ((profit / unitsBet) * 100)

        return (
            <tr className="bg-lightGray">
                <td data-rank className="px-4 py-2">1</td>
                <td data-username className="px-4 py-2">{user.displayName}</td>
                <td data-roi className="px-4 py-2">{roi.toFixed(0)}%</td>
                <td data-units-profit className="px-4 py-2">{profit.toFixed(2)}</td>
                <td data-units-bet className="px-4 py-2">{unitsBet}</td>
                <td data-picks className="px-4 py-2">{picks}</td>
            </tr>
        )
    } else return null

}

export default MMALeaderboardUser