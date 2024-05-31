import { useAddNewMMAResultMutation, useGetMMAResultsQuery } from "./mmaResultsApiSlice"
import { useGetMMAEventsQuery } from "./mmaEventsApiSlice"
import { useNavigate } from "react-router-dom"
import NewMMAResultForm from "./NewMMAResultForm"


const NewMMAResult = () => {
    const {
        data: resultsData,
        isLoading: resultsIsLoading,
        isSuccess: resultsIsSuccess,
        isError: resultsIsError,
        error: resultsError
    } = useGetMMAResultsQuery()

    const {
        data: eventsData,
        isLoading: eventsIsLoading,
        isSuccess: eventsIsSuccess,
        isError: eventsIsError,
        error: eventsError
    } = useGetMMAEventsQuery()

    const navigate = useNavigate()

    let content
    if (resultsIsLoading || eventsIsLoading) content = <p>Loading...</p>
    if (resultsIsError || eventsIsError) content = <p>{eventsError?.data?.message}{resultsError?.data?.message}</p>

    if (resultsIsSuccess && eventsIsSuccess) {
        const resultsEntities = Object.values(resultsData.entities)
        const eventsEntities = Object.values(eventsData.entities)
        const resultsEventNames = resultsEntities.map(result => result.eventName)
        const eventsWithNoResults = eventsEntities.filter(event => !resultsEventNames.includes(event.eventName))

        content = (
            <div>
                <NewMMAResultForm events={eventsWithNoResults} />
            </div>
        )
    }

    return content
}

export default NewMMAResult