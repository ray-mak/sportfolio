import { useParams } from "react-router-dom"
import { useGetUserResultsQuery } from "./userMMAEventsApiSlice"
import ClipLoader from "react-spinners/ClipLoader"
import UserStatsSummary from "./UserStatsSummary"
import LineChartMMA from "../../components/LineChartMMA"
import UserUpcomingEvents from "./UserUpcomingEvents"
import UserMMAEvents from "./UserMMAEvents"

const UserProfile = () => {
    const { id } = useParams()
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserResultsQuery({ id })

    let content

    if (isLoading) content = (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col gap-4 items-center rounded-lg shadow-xl -mt-40 p-6">
                <ClipLoader
                    color="rgb(14 116 144)"
                    size={100}
                />
                <p>Loading</p>
            </div>
        </div>
    )

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        content = (
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-col gap-6 justify-center md:p-8 border-2 border-slate-500 bg-slate-100 lg:w-5/6 2xl:w-3/5">
                    <h1 className="text-lg font-semibold mt-6 ml-4 md:mt-0 md:ml-0">{data.displayName}'s Profile</h1>
                    <UserStatsSummary data={data} />
                    <div className="w-full flex border-2 border-slate-300 bg-white" style={{ height: '360px' }}>
                        <LineChartMMA data={data} />
                    </div>
                    <UserUpcomingEvents data={data} />
                    <UserMMAEvents data={data} />
                </div>

            </div>
        )
    }

    return content
}

export default UserProfile