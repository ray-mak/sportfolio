import useEventsWithNoResults from "../events/useEventsWithNoResults"
import AddMMAPickForm from "./AddMMAPickForm"
import { useGetMMAEventsQuery } from "../events/mmaEventsApiSlice"
import AddPropForm from "./AddPropForm"
import AddMMAParlayForm from "./AddMMAParlayForm"
import { useState } from "react"

const AddMMAPick = () => {
    // const { eventsWithNoResults, isLoading, isError, errorMessage } = useEventsWithNoResults()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMMAEventsQuery()

    const [selectedForm, setSelectedForm] = useState({
        moneylineForm: true,
        propForm: false,
        parlayForm: false
    })

    const selectMoneyline = () => {
        setSelectedForm({
            moneylineForm: true,
            propForm: false,
            parlayForm: false
        })
    }

    const selectProp = () => {
        setSelectedForm({
            moneylineForm: false,
            propForm: true,
            parlayForm: false
        })
    }

    const selectParlay = () => {
        setSelectedForm({
            moneylineForm: false,
            propForm: false,
            parlayForm: true
        })
    }
    let content
    if (isLoading) content = <p>Loading...</p>
    if (isError) content = <p>{errorMessage}</p>

    // if (!isLoading && !isError)
    if (isSuccess) {
        const entities = Object.values(data.entities)
        content = (
            <div>
                <div className="flex justify-center">
                    <div className="w-full flex justify-center rounded-lg my-10 sm:w-5/6 lg:w-3/5 2xl:w-1/2">
                        <button type="button" className={`px-4 py-2 rounded-l-lg ${selectedForm.moneylineForm ? "bg-zinc-200" : "bg-zinc-400"}`} onClick={selectMoneyline}>Moneyline</button>
                        <button type="button" className={`px-4 py-2 ${selectedForm.propForm ? "bg-zinc-200" : "bg-zinc-400"}`} onClick={selectProp}>Prop</button>
                        <button type="button" className={`px-4 py-2 rounded-r-lg ${selectedForm.parlayForm ? "bg-zinc-200" : "bg-zinc-400"}`} onClick={selectParlay}>Parlay</button>
                    </div>
                </div>
                {selectedForm.moneylineForm && <AddMMAPickForm events={entities} />}
                {selectedForm.propForm && <AddPropForm events={entities} />}
                {selectedForm.parlayForm && <AddMMAParlayForm events={entities} />}

            </div>
        )
    }
    return content
}

export default AddMMAPick