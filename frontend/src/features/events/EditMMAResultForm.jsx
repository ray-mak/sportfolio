import { useState, useEffect } from "react"
import { useUpdateMMAResultMutation } from "./mmaResultsApiSlice"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const EditMMAResultForm = ({ mmaResult }) => {
    const [updateMMAResult, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateMMAResultMutation()

    const navigate = useNavigate()

    const [matchupResults, setMatchupResults] = useState(mmaResult.matchups.map(object => ({
        matchup: object.matchup.trim(),
        matchResults: {
            winner: object.matchResults.winner.trim(),
            methodOfVictory: object.matchResults.methodOfVictory,
            timeElapsed: object.matchResults.timeElapsed,
            score: object.matchResults.score
        }
    })))

    const handleChange = (index, e) => {
        const { name, value } = e.target
        const newMatchupResults = [...matchupResults]
        newMatchupResults[index].matchResults[name] = value
        setMatchupResults(newMatchupResults)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataToSubmit = {
            eventName: mmaResult.eventName,
            eventDate: mmaResult.eventDate,
            matchups: matchupResults
        }

        await updateMMAResult(dataToSubmit)
    }

    useEffect(() => {
        if (isSuccess) {
            navigate('/mmaresults')
        }
    }, [isSuccess, navigate])

    const date = new Date(mmaResult.eventDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    const convertedDate = `${month}/${day}/${year}`
    console.log(matchupResults)

    const resultsInputs = mmaResult.matchups.map((object, index) => {
        const fighterA = matchupResults[index].matchup.split(" vs ")[0].trim()
        const fighterB = matchupResults[index].matchup.split(" vs ")[1].trim()
        return (
            <div key={index} className="border-2 border-slate-400 p-4 rounded-lg mt-4">
                <p className="font-semibold">{object.matchup}</p>
                <div className="grid grid-cols-4 gap-4">
                    <label htmlFor={`winner-${index}`} className="flex flex-col">
                        <p>Winner</p>
                        <select id={`winner-${index}`} value={matchupResults[index].matchResults.winner} name="winner" onChange={(e) => handleChange(index, e)} className="p-1 border-2 border-slate-300 rounded-lg">
                            <option value="">Select</option>
                            <option value={fighterA}>{fighterA}</option>
                            <option value={fighterB}>{fighterB}</option>
                        </select>
                    </label>
                    <label htmlFor={`methodOfVictory-${index}`} className="flex flex-col">
                        <p>Method of Victory</p>
                        <select id={`methodOfVictory-${index}`} value={matchupResults[index].matchResults.methodOfVictory} name="methodOfVictory" onChange={(e) => handleChange(index, e)} className="p-1 border-2 border-slate-300 rounded-lg">
                            <option value="">Select</option>
                            <option value="ko">KO</option>
                            <option value="submission">Submission</option>
                            <option value="decision">Decision</option>
                            <option value="split decision">Split Decision</option>
                            <option value="draw">Draw</option>
                        </select>
                    </label>
                    <label htmlFor={`timeElapsed-${index}`} className="flex flex-col">
                        Time Elapsed
                        <input id={`timeElapsed-${index}`} onChange={(e) => handleChange(index, e)} name="timeElapsed" type="text" className="p-1 border-2 border-slate-300 rounded-lg" value={matchupResults[index].matchResults.timeElapsed} />
                    </label>
                    <label htmlFor={`score-${index}`} className="flex flex-col">
                        Score
                        <input id={`score-${index}`} onChange={(e) => handleChange(index, e)} name="score" type="text" className="p-1 border-2 border-slate-300 rounded-lg" value={matchupResults[index].matchResults.score} />
                    </label>
                </div>
            </div>
        )
    })

    return (
        <div className="flex justify-center">
            <div className="mt-10">
                <h1 className="text-center text-2xl font-semibold mb-4">Edit MMA Results</h1>
                <p className="text-left">{mmaResult.eventName}</p>
                <p>{convertedDate}</p>
                <form>
                    {resultsInputs}
                    <button className="py-2 w-full bg-green-600 text-white rounded-lg my-6">Submit Event</button>
                </form>
            </div>
        </div>
    )
}

export default EditMMAResultForm