import useFormData from "../../hooks/useFormData"
import useFormError from "../../hooks/useFormError"
import useDropdowns from "../../hooks/useDropdowns"
import Dropdown from "../../components/Dropdown"

const Example = ({ events }) => {
    const initialFormData = {
        event: "Select Event",
        matchup: "Select Matchup",
        propType: "timeProp",
        pick: "Pick Fighter",
        timeProp: "Select Prop",
        fighterProp: "Select Prop",
        odds: "",
        betAmount: "",
        notes: ""
    }

    const inititalFormError = {
        event: false,
        matchup: false,
        pick: false,
        pickFighter: false,
        odds: false,
        betAmount: false,
    }

    const initialDropdowns = {
        eventDropdown: false,
        matchupDropdown: false,
        pickDropdown: false,
        timePropDropdown: false,
        fighterPropDropdown: false
    }

    const [formData, handleChange, setFormData] = useFormData(initialFormData)
    const [formError, setFormError] = useFormError(inititalFormError)
    const [dropdowns, toggleDropdown, setContainerRef] = useDropdowns(initialDropdowns)


    return (
        <div className='flex flex-col items-center justify-center text-sm mt-20 sm:text-base'>
            <form className='flex flex-col w-full gap-6 border-2 p-4 sm:w-5/6 lg:w-3/5 2xl:w-1/2'>
                <Dropdown
                    label="Event"
                    error={formError.event}
                    value={formData.event}
                    onClick={() => toggleDropdown("eventDropdown")}
                    isOpen={dropdowns.eventDropdown}
                    items={events.map(event => event.eventName)}
                    handleItemClick={(e, item) => handleChange(e, "event")}
                    setContainerRef={setContainerRef}
                />
            </form>
        </div>
    )
}

export default Example