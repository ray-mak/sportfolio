import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useGetUserResultsQuery } from "../users/userMMAEventsApiSlice"
import useAuth from "../../hooks/useAuth"
import UserMMAEvents from "../users/UserMMAEvents"
import UserUpcomingEvents from "../users/UserUpcomingEvents"
import UserStatsSummary from "../users/UserStatsSummary"

const Welcome = () => {
    const { id } = useAuth()
    const navigate = useNavigate()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserResultsQuery({ id })
    console.log(id)

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        content = (
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-col gap-6 justify-center md:p-8 border-2 border-gray rounded-lg lg:w-5/6 2xl:w-3/5">
                    <UserStatsSummary data={data} />
                    <div>
                        <p className="text-xl text-center">You do not have any upcoming picks</p>
                        <button onClick={() => navigate("/dash/addpick")} type="button" className="w-full bg-brightRed text-white h-10 font-medium rounded-md">Add pick</button>
                    </div>
                    <UserUpcomingEvents data={data} />
                    <UserMMAEvents data={data} />
                </div>

            </div>
        )
    }

    return content
}

export default Welcome