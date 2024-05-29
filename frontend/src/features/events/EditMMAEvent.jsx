import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectMMAEventById } from "./mmaEventsApiSlice"
import { selectAllMMAEvents } from "./mmaEventsApiSlice"
import { useGetMMAEventsQuery } from "./mmaEventsApiSlice"
import EditMMAEventForm from "./EditMMAEventForm"


const EditMMAEvent = () => {
    const { id } = useParams()

    const {
        data,
        isLoading: isLoadingGetEvents,
        isSuccess: isSuccessGetEvents,
        isError: isErrorGetEvents,
        error
    } = useGetMMAEventsQuery()


    let content

    if (isLoadingGetEvents) content = <p>Loading...</p>

    if (isErrorGetEvents) {
        content = <p>{error?.data?.message}</p>
    }

    if (isSuccessGetEvents) {
        const entities = Object.values(data.entities)
        const foundEvent = entities.find(object => object._id === id)

        content = foundEvent ? <EditMMAEventForm event={foundEvent} /> : <p>Loading...</p>
    }
    return content
}

export default EditMMAEvent