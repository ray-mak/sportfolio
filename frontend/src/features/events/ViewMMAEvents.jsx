import { useGetAllEventsQuery } from "./eventSummaryApiSlice"
import { useNavigate } from "react-router-dom"

const ViewMMAEvents = () => {
    const { data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllEventsQuery()

    const navigate = useNavigate()

    console.log(data)

    let content

    if (isLoading) content = <p>Loading...</p>
    if (isError) content = <p>{error?.data?.message}</p>

    if (isSuccess) {
        const upcomingEvents = data.upcomingEvents.map(object => {
            return (
                <tr key={object._id}>
                    <td className="hide-attr">{formatDate(object.eventDate)}</td>
                    <td onClick={() => navigate(`/mmaevents/${object._id}`)} className="underline font-medium cursor-pointer hide-attr">{object.eventName}</td>
                </tr>
            )
        })

        const pastEvents = data.pastEvents.map(object => {
            return (
                <tr key={object._id}>
                    <td className="hide-attr">{formatDate(object.eventDate)}</td>
                    <td onClick={() => navigate(`/mmaevents/${object._id}`)} className="underline font-medium cursor-pointer hide-attr">{object.eventName}</td>
                </tr>
            )
        })

        content = (
            <div className="flex flex-col items-center">
                <div className="w-full bg-neutral-200 p-6 mt-4 md:w-1/2">
                    <table className="w-full mb-8 events-table">
                        <caption className="text-lg font-semibold">Upcoming Events</caption>
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
                    <table className="w-full events-table">
                        <caption className="text-lg font-semibold">Past Events</caption>
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