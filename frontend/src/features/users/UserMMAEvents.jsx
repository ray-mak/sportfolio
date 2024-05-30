//This displays a users upcoming and past MMA events that they have picks/bets on
import { useGetUserResultsQuery } from "./userMMAEventsApiSlice"

const UserMMAEvents = () => {
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserResultsQuery({ id: "66328e6dd2d69e0a8f67a2c2" })

    console.log(data)

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const betHistory = data.betHistory.map(object => {
            const betResults = object.eventResults.map(bet => {
                return (
                    <tr key={bet._id}>
                        <td>{bet.matchup}</td>
                        <td>{bet.pick}</td>
                        <td>{bet.result}</td>
                        <td>{bet.betAmount.toFixed(2)}</td>
                        <td>{bet.profit}</td>
                        <td>{bet.roi}%</td>
                    </tr>
                )
            })
            return (
                <div key={object.event}>
                    <p>{object.event}</p>
                    <tbody>
                        {betResults}
                    </tbody>
                </div>
            )
        })
        content = (
            <div>
                <p>{data.displayName}'s MMA Bet History</p>
                {betHistory}
            </div>
        )
    }

    return content
}

export default UserMMAEvents