import { useGetSingleEventMutation } from "./eventSummaryApiSlice"
import { useParams } from "react-router-dom"
import { useEffect } from "react"

const EventSummary = () => {
    const { id } = useParams()
    const [getSingleEvent, {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useGetSingleEventMutation()

    useEffect(() => {
        if (id) {
            getSingleEvent({ id })
        }
    }, [id, getSingleEvent])

    console.log(data)
    return (
        <div>EventSummary</div>
    )
}

export default EventSummary