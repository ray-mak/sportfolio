import useEventsWithNoResults from "../events/useEventsWithNoResults"
import AddMMAPickForm from "./AddMMAPickForm"
import { useGetMMAEventsQuery } from "../events/mmaEventsApiSlice"
import AddPropForm from "./AddPropForm"
import AddMMAParlayForm from "./AddMMAParlayForm"

const AddMMAPick = () => {
    // const { eventsWithNoResults, isLoading, isError, errorMessage } = useEventsWithNoResults()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMMAEventsQuery()

    let content
    if (isLoading) content = <p>Loading...</p>
    if (isError) content = <p>{errorMessage}</p>

    // if (!isLoading && !isError)
    if (isSuccess) {
        const entities = Object.values(data.entities)
        content = (
            <div>
                <AddMMAPickForm events={entities} />
                {/* <AddPropForm events={entities} /> */}
                <AddMMAParlayForm events={entities} />
            </div>
        )
    }
    return content
}

export default AddMMAPick