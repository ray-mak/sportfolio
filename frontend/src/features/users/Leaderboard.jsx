import { useGetUsersQuery } from "./usersApiSlice"

//this is a users list, but this will be used for the leaderboard, which will have the users username and profits and additional stats
const Leaderboard = () => {
    //we rename data to users
    // const {
    //     data: users,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error
    // } = useGetUsersQuery()

    // let content

    // if (isLoading) content = <p>Loading...</p>

    // if (isError) {
    //     content = <p className="errmsg">{error?.data?.message}</p>
    // }

    // if (isSuccess) {
    //     //ids is an array of user ids
    //     const { ids } = users

    //     const tableContent = ids?.length
    //         ? ids.map(userId => <UserRow key={userId} userId={userId} />)
    //         : null

    //     content = (
    //         <div>
    //             <p>MMA Handicappers Leaderboard</p>
    //             <table className="table table--users">
    //                 <thead className="table__thead">
    //                     <tr>
    //                         <th scope="col" className="table__th user__username">Username</th>
    //                         <th scope="col" className="table__th user__roles">Roles</th>
    //                         <th scope="col" className="table__th user__edit">Edit</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>

    //                 </tbody>
    //             </table>
    //         </div>
    //     )
    // }

    return (
        <div className="flex justify-center">
            <div className="border-2 w-full max-w-7xl bg-white overflow-x-auto m:p-4 sm:w-4/5 xl:w-3/5 2xl:w-1/2">
                <h1 className="text-center text-2xl font-semibold p-2">MMA Handicappers Leaderboard</h1>
                <table className="w-full mt-4">
                    <thead className="sticky">
                        <tr className="bg-slate-700">
                            <th scope="col" className="px-4 py-2 text-left text-white">Rank</th>
                            <th scope="col" className="px-4 py-2 text-left text-white">User</th>
                            <th scope="col" className="px-4 py-2 text-left text-white">ROI</th>
                            <th scope="col" className="px-4 py-2 text-left text-white">Units Profit</th>
                            <th scope="col" className="px-4 py-2 text-left text-white">Units Bet</th>
                            <th scope="col" className="px-4 py-2 text-left text-white">Picks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-lightGray">
                            <td className="px-4 py-2">1</td>
                            <td className="px-4 py-2">RayMak</td>
                            <td className="px-4 py-2">14.28%</td>
                            <td className="px-4 py-2">632</td>
                            <td className="px-4 py-2">4426</td>
                            <td className="px-4 py-2">2125</td>
                        </tr>
                        <tr className="bg-almostWhite">
                            <td className="px-4 py-2">1</td>
                            <td className="px-4 py-2">RayMak</td>
                            <td className="px-4 py-2">14.28%</td>
                            <td className="px-4 py-2">632</td>
                            <td className="px-4 py-2">4426</td>
                            <td className="px-4 py-2">2125</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default Leaderboard