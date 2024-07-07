import { useGetMMAResultsQuery } from "./mmaResultsApiSlice"
import { useGetMMAEventsQuery } from "./mmaEventsApiSlice"
import { useMemo } from "react"

const useEventsWithNoResults = () => {
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

    const eventsWithNoResults = useMemo(() => {
        if (resultsIsSuccess && eventsIsSuccess) {
            const resultsEntities = Object.values(resultsData.entities)
            const eventsEntities = Object.values(eventsData.entities)
            const resultsEventNames = resultsEntities.map(result => result.eventName)
            return eventsEntities.filter(event => !resultsEventNames.includes(event.eventName))
        }
        return []
    }, [resultsData, eventsData, resultsIsSuccess, eventsIsSuccess])

    const isLoading = resultsIsLoading || eventsIsLoading
    const isSuccess = resultsIsSuccess && eventsIsSuccess
    const isError = resultsIsError || eventsIsError
    const errorMessage = (eventsError?.data?.message || '') + (resultsError?.data?.message || '')
    return {
        eventsWithNoResults,
        isSuccess,
        isLoading,
        isError,
        errorMessage
    }
}

export default useEventsWithNoResults