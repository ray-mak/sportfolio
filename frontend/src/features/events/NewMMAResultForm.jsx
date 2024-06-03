import { useState, useEffect } from "react"
import { useAddNewMMAResultMutation } from "./mmaResultsApiSlice"
import { useNavigate } from "react-router-dom"
import ScorecardCalculator from "../../components/ScorecardCalculator"

const NewMMAResultForm = ({ events }) => {
    const [addNewMMAResult, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMMAResultMutation()

    const navigate = useNavigate()

    const [eventToLog, setEventToLog] = useState(events[0].eventName)
    const [eventData, setEventData] = useState(events[0])
    const [matchupResults, setMatchupResults] = useState(eventData.matchups.map(object => ({
        matchup: object.matchup.trim(),
        matchResults: {
            winner: "",
            methodOfVictory: "",
            timeElapsed: "",
            score: ""
        }
    })))

    const changeEvent = (e) => {
        const { value } = e.target
        setEventToLog(value)
    }

    useEffect(() => {
        const event = events.find(object => object.eventName === eventToLog)
        setEventData(event)
    }, [eventToLog])

    useEffect(() => {
        setMatchupResults(eventData.matchups.map(object => ({
            matchup: object.matchup.trim(),
            matchResults: {
                winner: "",
                methodOfVictory: "",
                timeElapsed: "",
                score: ""
            }
        })))
    }, [eventData])

    const handleChange = (index, e) => {
        const { name, value } = e.target
        const newMatchupResults = [...matchupResults]
        newMatchupResults[index].matchResults[name] = value
        setMatchupResults(newMatchupResults)
    }

    useEffect(() => {
        if (isSuccess) {
            navigate("/editmmaevent")
        }
    }, [isSuccess, navigate])

    useEffect(() => {
        if (isError) {
            console.log(error)
        }
    }, [isError])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataToSubmit = {
            eventName: eventData.eventName,
            eventDate: eventData.eventDate,
            matchups: matchupResults
        }
        // console.log(dataToSubmit)
        // await addNewMMAResult(dataToSubmit)
    }

    console.log(eventToLog, eventData, matchupResults)

    const eventOptions = events.map(object => (<option key={object._id} value={object.eventName}>{object.eventName}</option>))

    const resultsInputs = eventData.matchups.map((object, index) => {
        const fighterA = object.matchup.split(" vs ")[0]
        const fighterB = object.matchup.split(" vs ")[1]
        return (
            <div key={index} className="border-2 border-slate-400 p-4 rounded-lg mt-4">
                <p className="font-semibold">{object.matchup}</p>
                <div className="grid grid-cols-4 gap-4">
                    <label htmlFor={`winner-${index}`} className="flex flex-col">
                        Winner
                        <select id={`winner-${index}`} value={matchupResults[index].winner} name="winner" onChange={(e) => handleChange(index, e)} className="p-1 border-2 border-slate-300 rounded-lg">
                            <option value="">Select</option>
                            <option value={fighterA}>{fighterA}</option>
                            <option value={fighterB}>{fighterB}</option>
                        </select>
                    </label>
                    <label htmlFor={`methodOfVictory-${index}`} className="flex flex-col">
                        Method of Victory
                        <select id={`methodOfVictory-${index}`} value={matchupResults[index].methodOfVictory} name="methodOfVictory" onChange={(e) => handleChange(index, e)} className="p-1 border-2 border-slate-300 rounded-lg">
                            <option value="">Select</option>
                            <option value="ko">KO</option>
                            <option value="submission">Submission</option>
                            <option value="decision">Decision</option>
                            <option value="split decision">Split Decision</option>
                            <option value="draw">Draw</option>
                        </select>
                    </label>
                    <label htmlFor={`timeElapsed-${index}`} value={matchupResults[index].timeElapsed} className="flex flex-col">
                        Time Elapsed
                        <input id={`timeElapsed-${index}`} onChange={(e) => handleChange(index, e)} name="timeElapsed" type="text" className="p-1 border-2 border-slate-300 rounded-lg" />
                    </label>
                    <label htmlFor={`score-${index}`} value={matchupResults[index].score} className="flex flex-col">
                        Score
                        <input id={`score-${index}`} onChange={(e) => handleChange(index, e)} name="score" type="text" className="p-1 border-2 border-slate-300 rounded-lg" />
                    </label>
                </div>
            </div>
        )
    })

    return (
        <div className="flex justify-center">
            <div className="mt-10">
                <h1 className="text-center text-2xl font-semibold mb-4">Submit MMA Results</h1>
                <label htmlFor="eventSelect">Select an Event</label>
                <select id="eventSelect" name="eventSelect" value={eventToLog} onChange={changeEvent} className="p-1 border-2 border-slate-300 rounded-lg ml-6">
                    {eventOptions}
                </select>
                <form onSubmit={handleSubmit}>
                    {resultsInputs}
                    <button className="py-2 w-full bg-green-600 text-white rounded-lg my-6">Submit Event</button>
                </form>
            </div>
            {/* <div className="fixed right-20 top-80">
                <ScorecardCalculator />
            </div> */}
        </div >
    )
}

export default NewMMAResultForm