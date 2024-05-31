import { useState } from "react"

const ScorecardCalculator = () => {
    const [scores, setScores] = useState({
        fighterA1: "",
        fighterB1: "",
        fighterA2: "",
        fighterB2: "",
        fighterA3: "",
        fighterB3: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setScores(prevScores => ({
            ...prevScores,
            [name]: value
        }))
    }

    const fighterAScore = Number(scores.fighterA1) + Number(scores.fighterA2) + Number(scores.fighterA3)
    const fighterBScore = Number(scores.fighterB1) + Number(scores.fighterB2) + Number(scores.fighterB3)
    const totalScore = `${fighterAScore}-${fighterBScore}`

    return (
        <div className="flex flex-col gap-2 bg-yellow-100 p-4 rounded-lg">
            <h1 className="text-lg font-semibold text-center">Scorecard Calculator</h1>
            <p>Input winners score on the left</p>
            <div className="flex gap-4">
                <div className="flex items-center">
                    <input name="fighterA1" type="number" className="w-10 text-center border-2 border-slate-300 rounded-lg p-1 m-1" onChange={handleChange} />
                    <p>-</p>
                    <input name="fighterB1" type="number" className="w-10 text-center border-2 border-slate-300 rounded-lg p-1 m-1" onChange={handleChange} />
                </div>
                <div className="flex items-center">
                    <input name="fighterA2" type="number" className="w-10 text-center border-2 border-slate-300 rounded-lg p-1 m-1" onChange={handleChange} />
                    <p>-</p>
                    <input name="fighterB2" type="number" className="w-10 text-center border-2 border-slate-300 rounded-lg p-1 m-1" onChange={handleChange} />
                </div>
                <div className="flex items-center">
                    <input name="fighterA3" type="number" className="w-10 text-center border-2 border-slate-300 rounded-lg p-1 m-1" onChange={handleChange} />
                    <p>-</p>
                    <input name="fighterB3" type="number" className="w-10 text-center border-2 border-slate-300 rounded-lg p-1 m-1" onChange={handleChange} />
                </div>
            </div>
            <p className="text-center font-semibold">Total Score</p>
            <p className="text-center">{totalScore}</p>
        </div>
    )
}

export default ScorecardCalculator