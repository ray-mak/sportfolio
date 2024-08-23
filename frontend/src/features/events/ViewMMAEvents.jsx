import { useGetAllEventsQuery } from "./eventSummaryApiSlice"
import { Link } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"

const ViewMMAEvents = () => {
    const { data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllEventsQuery()

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

    if (isError) content = <p>{error?.data?.message}</p>

    if (isSuccess) {
        const upcomingEvents = data.upcomingEvents.map(object => {
            return (
                <tr key={object._id}>
                    <td className="hide-attr">{formatDate(object.eventDate)}</td>
                    <td className="underline font-medium hide-attr">
                        <Link to={`/mmaevents/${object._id}`}>{object.eventName}</Link>
                    </td>
                </tr>
            )
        })

        const pastEvents = data.pastEvents.map(object => {
            return (
                <tr key={object._id}>
                    <td className="hide-attr">{formatDate(object.eventDate)}</td>
                    <td className="underline font-medium hide-attr">
                        <Link to={`/mmaevents/${object._id}`}>{object.eventName}</Link>
                    </td>
                </tr>
            )
        })

        content = (
            <div className="flex flex-col items-center">
                <div className="w-full flex flex-col gap-6 bg-slate-100 border-2 border-slate-600 p-6 mt-4 md:w-1/2">
                    <h1 className="text-center font-semibold text-2xl">MMA Betting Tips By Event</h1>
                    <div className="border-2 border-slate-300">
                        <p className="py-1 px-2 text-lg font-medium text-white bg-cyan-700">Upcoming Events</p>
                        <div className="p-4 bg-white">
                            <table className="w-full events-table">
                                <thead>
                                    <tr>
                                        <th className="text-left">Date</th>
                                        <th className="text-left">Event</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingEvents}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="border-2 border-slate-300">
                        <p className="py-1 px-2 text-lg font-medium text-white bg-slate-700">Past Events</p>
                        <div className="p-4 bg-white">
                            <table className="w-full events-table">
                                <thead>
                                    <tr>
                                        <th className="text-left">Date</th>
                                        <th className="text-left">Event</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastEvents}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return content
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const day = date.getUTCDate()
    const month = date.toLocaleDateString('default', { month: "short" })
    const year = date.getUTCFullYear()

    return `${day} ${month} ${year}`
}

export default ViewMMAEvents