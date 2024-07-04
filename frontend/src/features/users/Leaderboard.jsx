import { useState } from "react"
import { Link } from "react-router-dom"
import { selectUserById, useGetUsersQuery } from "./usersApiSlice"


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

        function sortUsers(array) {
            if (sort.direction === "asc") {
                return array.sort((a, b) => (a[sort.key] - b[sort.key]))
            } else {
                return array.sort((a, b) => (b[sort.key] - a[sort.key]))
            }
        }

        const tableContent = sortUsers(entities).map((user, index) => (
            <tr className={index % 2 === 0 ? "bg-white" : "bg-neutral-200"} key={index}>
                <td data-cell="rank" className="md:px-4 md:py-2">{index + 1}</td>
                <td data-cell="username" className="md:px-4 md:py-2 font-medium text-blue-800">
                    <Link to={`/${user._id}`} className="hover:text-blue-500">
                        {user.displayName}
                    </Link>
                </td>
                <td data-cell="ROI" className="md:px-4 md:py-2">{user.roi}%</td>
                <td data-cell="units profit" className="md:px-4 md:py-2">{user.totalProfit}</td>
                <td data-cell="units bet" className="md:px-4 md:py-2">{user.unitsBet.toFixed(2)}</td>
                <td data-cell="total picks" className="md:px-4 md:py-2">{user.totalPicks}</td>
            </tr>
        ))

        content = (
            <div className="flex justify-center">
                <div className="border-2 border-slate-600 w-full max-w-7xl bg-slate-100 overflow-x-auto m:p-4 sm:w-4/5 xl:w-3/5 2xl:w-1/2">
                    <h1 className="text-center text-2xl font-semibold p-4">MMA Handicappers Leaderboard</h1>
                    <table className="w-full text-sm md:text-base">
                        <thead className="sticky">
                            <tr className="bg-slate-700">
                                <th scope="col" className="px-4 py-2 text-left text-white">Rank</th>
                                <th scope="col" className="px-4 py-2 text-left text-white">User</th>
                                <th scope="col" className="px-4 py-2 text-left text-white cursor-pointer" onClick={() => handleSort("roi")}>ROI</th>
                                <th scope="col" className="px-4 py-2 text-left text-white cursor-pointer" onClick={() => handleSort("totalProfit")}>Units Profit</th>
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