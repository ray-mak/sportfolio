import useEventsWithNoResults from "./useEventsWithNoResults"
import NewMMAResultForm from "./NewMMAResultForm"

const NewMMAResult = () => {
    const { eventsWithNoResults, isLoading, isError, errorMessage } = useEventsWithNoResults()

    let content
    if (isLoading) content = <p>Loading...</p>
    if (isError) content = <p>{errorMessage}</p>
    console.log(eventsWithNoResults)

    if (!isLoading && !isError) {
        content = (
            <div>
                <NewMMAResultForm events={eventsWithNoResults} />
            </div>
        )
    } else {
        content = <p>All events have been logged</p>
    }

    return content
}

export default NewMMAResult