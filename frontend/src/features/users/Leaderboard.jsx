import { useState } from "react"
import { useSelector } from "react-redux"
import { selectUserById, useGetUsersQuery } from "./usersApiSlice"
import MMALeaderboardUser from "./MMALeaderboardUser"

//this is a users list, but this will be used for the leaderboard, which will have the users username and profits and additional stats
const Leaderboard = () => {
    //create state to store our sort values.
    const [sort, setSort] = useState({ key: "totalProfit", direction: "desc" })

    function handleSort(header) {
        setSort({
            key: header,
            direction:  //check if header clicked is the same as key, if so flip direction
                header === sort.key
                    ? sort.direction === "asc"
                        ? "desc"
                        : "asc"
                    : "desc"
        })
    }

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        //enities is an object within data, this is done to convert it to an array.
        const entities = Object.values(data.entities)

        //userStats will be an array of objects that contains the users name and betting stats.
        const userStats = []
        entities.forEach(object => {
            const betHistory = object.betHistory
            let picks = 0
            let profit = 0
            let unitsBet = 0
            let roi

            for (const event of betHistory) {
                const eventResults = event.eventResults
                for (const matchup of eventResults) {
                    picks++
                    profit = profit += Number(matchup.profit)
                    unitsBet = unitsBet += matchup.betAmount
                }
            }

            roi = ((profit / unitsBet) * 100)
            if (!isNaN(roi)) {
                userStats.push({ "displayName": object.displayName, "roi": roi.toFixed(0), "totalProfit": profit.toFixed(2), "unitsBet": unitsBet, "totalPicks": picks })
            }
        })

        function sortUsers(array) {
            if (sort.direction === "asc") {
                return array.sort((a, b) => (a[sort.key] - b[sort.key]))
            } else {
                return array.sort((a, b) => (b[sort.key] - a[sort.key]))
            }
        }

        const tableContent = sortUsers(userStats).map((user, index) => (
            <tr className="bg-lightGray" key={index}>
                <td data-rank className="px-4 py-2">{index + 1}</td>
                <td data-username className="px-4 py-2">{user.displayName}</td>
                <td data-roi className="px-4 py-2">{user.roi}%</td>
                <td data-units-profit className="px-4 py-2">{user.totalProfit}</td>
                <td data-units-bet className="px-4 py-2">{user.unitsBet}</td>
                <td data-picks className="px-4 py-2">{user.totalPicks}</td>
            </tr>
        ))

        content = (
            <div className="flex justify-center">
                <div className="border-2 w-full max-w-7xl bg-white overflow-x-auto m:p-4 sm:w-4/5 xl:w-3/5 2xl:w-1/2">
                    <h1 className="text-center text-2xl font-semibold p-2">MMA Handicappers Leaderboard</h1>
                    <table className="w-full mt-4">
                        <thead className="sticky">
                            <tr className="bg-slate-700">
                                <th scope="col" className="px-4 py-2 text-left text-white">Rank</th>
                                <th scope="col" className="px-4 py-2 text-left text-white">User</th>
                                <th scope="col" className="px-4 py-2 text-left text-white cursor-pointer" onClick={() => handleSort("roi")}>ROI</th>
                                <th scope="col" className="px-4 py-2 text-left text-white cursor-pointer" onClick={() => handleSort("unitsProfit")}>Units Profit</th>
                                <th scope="col" className="px-4 py-2 text-left text-white cursor-pointer" onClick={() => handleSort("unitsBet")}>Units Bet</th>
                                <th scope="col" className="px-4 py-2 text-left text-white cursor-pointer" onClick={() => handleSort("totalPicks")}>Total Picks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return content

}

export default Leaderboard