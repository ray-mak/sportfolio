import useEventsWithNoResults from "../events/useEventsWithNoResults"
import AddMMAPickForm from "./AddMMAPickForm"

const AddMMAPick = () => {
    const { eventsWithNoResults, isLoading, isError, errorMessage } = useEventsWithNoResults()

    let content
    if (isLoading) content = <p>Loading...</p>
    if (isError) content = <p>{errorMessage}</p>

    if (eventsWithNoResults) {
        content = (
            <div>
                <AddMMAPickForm events={eventsWithNoResults} />
            </div>
        )
    }
    return content
}

export default AddMMAPick