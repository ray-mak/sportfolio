import { useState, useEffect } from "react"
import { useAddNewMMAResultMutation } from "./mmaResultsApiSlice"
import { useNavigate } from "react-router-dom"

const NewMMAResultForm = ({ events }) => {
    const [addNewMMAEvent, {
        isLoading: addEventIsLoading,
        isSuccess: addEventIsSuccess,
        isError: addEventIsError,
        error: addEventError
    }] = useAddNewMMAResultMutation()

    const navigate = useNavigate()

    const [eventToLog, setEventToLog] = useState(events[0].eventName)
    const [eventData, setEventData] = useState(events[0])
    const [matchupResults, setMatchupResults] = useState(eventData.matchups.map(() => ({
        winner: "",
        methodOfVictory: "",
        timeElapsed: "",
        score: ""
    })))

    const changeEvent = (e) => {
        const { value } = e.target
        setEventToLog(value)
    }

    useEffect(() => {
        const event = events.find(object => object.eventName === eventToLog)
        setEventData(event)
    }, [eventToLog])

    const handleChange = (index, e) => {
        const { name, value } = e.target
        const newMatchupResults = [...matchupResults]
        newMatchupResults[index][name] = value
        setMatchupResults(newMatchupResults)
    }

    const eventOptions = events.map(object => (<option key={object._id} value={object.eventName}>{object.eventName}</option>))

    const resultsInputs = eventData.matchups.map((object, index) => {
        const fighterA = object.matchup.split(" vs ")[0]
        const fighterB = object.matchup.split(" vs ")[1]
        return (
            <div key={index}>
                <p>{object.matchup}</p>
                <div>
                    <label htmlFor={`winner-${index}`}>
                        Winner
                        <select id={`winner-${index}`} value={matchupResults[index].winner} name="winner" onChange={(e) => handleChange(index, e)}>
                            <option value="">Select</option>
                            <option value={fighterA}>{fighterA}</option>
                            <option value={fighterB}>{fighterB}</option>
                        </select>
                    </label>
                    <label htmlFor={`methodOfVictory-${index}`}>
                        Method of Victory
                        <select id={`methodOfVictory-${index}`} value={matchupResults[index].methodOfVictory} name="methodOfVictory" onChange={(e) => handleChange(index, e)}>
                            <option value="">Select</option>
                            <option value="ko">KO</option>
                            <option value="submission">Submission</option>
                            <option value="decision">Decision</option>
                            <option value="split decision">Split Decision</option>
                            <option value="draw">Draw</option>
                        </select>
                    </label>
                    <label htmlFor={`timeElapsed-${index}`} value={matchupResults[index].timeElapsed}>
                        Time Elapsed
                        <input id={`timeElapsed-${index}`} onChange={(e) => handleChange(index, e)} name="timeElapsed" type="text" />
                    </label>
                    <label htmlFor={`score-${index}`} value={matchupResults[index].score}>
                        Score
                        <input id={`score-${index}`} onChange={(e) => handleChange(index, e)} name="score" type="text" />
                    </label>
                </div>
            </div>
        )
    })

    console.log(matchupResults)
    return (
        <div>
            <label htmlFor="eventSelect">Select an Event</label>
            <select id="eventSelect" name="eventSelect" value={eventToLog} onChange={changeEvent}>
                {eventOptions}
            </select>
            {resultsInputs}
        </div >
    )
}

export default NewMMAResultForm