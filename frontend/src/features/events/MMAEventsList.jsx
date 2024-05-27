import { useGetMMAEventsQuery } from "./mmaEventsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"

const MMAEventsList = () => {
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMMAEventsQuery()

    const navigate = useNavigate()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const entities = Object.values(data.entities)
        const sortedEntities = entities.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))
        console.log(entities)

        const tableContent = sortedEntities.map(event => {
            const date = new Date(event.eventDate)
            const month = date.getMonth() + 1
            const day = date.getDate()
            const year = date.getFullYear()
            const convertedDate = `${month}-${day}-${year}`
            return (
                <tr key={event.eventName}>
                    <td className="px-4 py-2">{event.eventName}</td>
                    <td className="px-4 py-2">{convertedDate}</td>
                    <td className="px-4 py-2">
                        <button onClick={() => navigate(`/editmmaevent/${event._id}`)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                            Edit
                        </button>
                    </td>
                </tr>
            )
        })

        content = (
            <div className="flex justify-center">
                <div className="flex flex-col gap-6 border-2 mt-16">
                    <button onClick={() => navigate("/editmmaevent/newmmaevent")} type="button" className="px-4 py-2 bg-slate-300 border-2 border-lightGray rounded-lg justify-self-center">Add New Event</button>
                    <h1 className="font-semibold text-xl text-center">MMA Events List</h1>
                    <table>
                        <thead>
                            <tr className="bg-orange-300">
                                <th scope="col" className="px-4 py-2">Event Name</th>
                                <th scope="col" className="px-4 py-2">Event Date</th>
                                <th className="px-4 py-2">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="mma-event-table">
                            {tableContent}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return content
}

export default MMAEventsList