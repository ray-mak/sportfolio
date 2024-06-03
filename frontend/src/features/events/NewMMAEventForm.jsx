import { useState, useEffect } from "react"
import { useAddNewMMAEventMutation } from "./mmaEventsApiSlice"
import { useNavigate } from "react-router-dom"

const NewMMAEventForm = () => {
    const [addNewMMAEvent, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMMAEventMutation()

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        eventName: "",
        eventDate: "",
        eventTime: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const [matchups, setMatchups] = useState([{ fighterA: "", fighterB: "", division: "", weightClass: "" }])

    const matchupChange = (index, e) => {
        const { name, value } = e.target
        const newMatchups = [...matchups]
        newMatchups[index][name] = value
        setMatchups(newMatchups)
    }

    const addMatchup = () => {
        const lastMatchup = matchups[matchups.length - 1]
        if (lastMatchup.fighterA.trim() === "" || lastMatchup.fighterB.trim() === "") {
            alert("Please fill in both fighter names before adding new matchup")
            return
        }
        setMatchups([...matchups, { fighterA: "", fighterB: "", division: "", weightClass: "" }])
    }

    const deleteMatchup = (index) => {
        if (matchups.length <= 1) {
            alert("Must have at least one matchup")
            return
        }
        const newMatchups = matchups.filter((_, i) => i !== index)
        setMatchups(newMatchups)
    }

    useEffect(() => {
        if (isSuccess) {
            setFormData({
                eventName: "",
                eventDate: "",
                eventTime: "",
            })
            setMatchups([{ fighterA: "", fighterB: "", division: "", weightClass: "" }])
            // navigate("/dash")
        }
    }, [isSuccess, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const matchupsArray = []
        matchups.forEach(fight => {
            const matchupStr = `${fight.fighterA.trim()} vs ${fight.fighterB.trim()}`
            const matchupData = {
                matchup: matchupStr,
                division: fight.division,
                weightClass: fight.weightClass
            }
            matchupsArray.push(matchupData)
        })
        const timeDate = new Date(`${formData.eventDate}T${formData.eventTime}:00`)

        const dataToSubmit = {
            eventName: formData.eventName,
            eventDate: timeDate.toUTCString(),
            matchups: matchupsArray
        }
        console.log(dataToSubmit)

        const canSubmit = Object.values(formData).every(Boolean)

        if (canSubmit) {
            await addNewMMAEvent(dataToSubmit)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold mt-8">Create New MMA Event</h1>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6 p-4 bg-white shadow-xl text-sm md:p-8 md:rounded-lg md:text-md md:w-3/4 xl:w-1/2">
                <label htmlFor="eventName" className="flex flex-col gap-1 mb-2">
                    <p>Event Name</p>
                    <input
                        id="eventName"
                        name="eventName"
                        type="text"
                        onChange={handleChange}
                        value={formData.eventName}
                        className="py-2 px-2 rounded-lg border-lightGray border-2 md:px-4"
                    />
                </label>
                <div className="w-full flex gap-4">
                    <label htmlFor="eventDate" className="w-1/2 flex flex-col gap-1 mb-2 md:w-2/3">
                        <p>Event Date</p>
                        <input
                            id="eventDate"
                            name="eventDate"
                            type="date"
                            onChange={handleChange}
                            value={formData.eventDate}
                            className="py-2 px-2 rounded-lg border-lightGray border-2 md:px-4"
                        />
                    </label>
                    <label htmlFor="eventTime" className="w-1/2 flex flex-col gap-1 mb-2 md:w-1/3">
                        <p>Event Time</p>
                        <input
                            id="eventTime"
                            name="eventTime"
                            type="time"
                            onChange={handleChange}
                            value={formData.eventTime}
                            className="py-2 px-2 rounded-lg border-lightGray border-2"
                        />
                    </label>
                </div>
                <p>Matchups</p>
                <div className="p-4 flex flex-col gap-4 border-2 border-slate-500 rounded-lg">
                    {matchups.map((matchup, index) => (
                        <div key={index} className="w-full flex flex-col gap-4 justify-between md:flex-row md:items-end">
                            <label htmlFor={`fighterA-${index}`} className="w-full">
                                <p>Fighter A</p>
                                <input
                                    id={`fighterA-${index}`}
                                    name="fighterA"
                                    type="text"
                                    value={matchup.fighterA}
                                    onChange={(e) => matchupChange(index, e)}
                                    className="w-full py-1 px-2 rounded-lg border-lightGray border-2"
                                />
                            </label>
                            <p className="mb-3 text-center">vs</p>
                            <label htmlFor={`fighterB-${index}`} className="w-full">
                                <p>Fighter B</p>
                                <input
                                    id={`fighterB-${index}`}
                                    name="fighterB"
                                    type="text"
                                    value={matchup.fighterB}
                                    onChange={(e) => matchupChange(index, e)}
                                    className="w-full py-1 px-2 rounded-lg border-lightGray border-2"
                                />
                            </label>
                            <label htmlFor={`division-${index}`}>
                                <p>Division</p>
                                <select id={`division-${index}`} value={matchup.division} name="division" onChange={(e) => matchupChange(index, e)} className="py-1 px-2 border-lightGray border-2 rounded-lg">
                                    <option value=""></option>
                                    <option value="mens">Mens</option>
                                    <option value="womens">Womens</option>
                                </select>
                            </label>
                            <label htmlFor={`weightClass-${index}`}>
                                <p>Weight Class</p>
                                <select id={`weightClass-${index}`} value={matchup.weightClass} name="weightClass" onChange={(e) => matchupChange(index, e)} className="py-1 px-2 border-lightGray border-2 rounded-lg">
                                    <option value=""></option>
                                    <option value="strawweight">Strawweight</option>
                                    <option value="flyweight">Flyweight</option>
                                    <option value="bantamweight">Bantamweight</option>
                                    <option value="featherweight">Featherweight</option>
                                    <option value="lightweight">Lightweight</option>
                                    <option value="welterweight">Welterweight</option>
                                    <option value="middleweight">Middleweight</option>
                                    <option value="lightHeavyweight">Light heavyweight</option>
                                    <option value="heavyweight">Heavyweight</option>
                                </select>
                            </label>
                            <button type="button" onClick={() => deleteMatchup(index)} className="py-1 px-2 bg-red-500 rounded-lg text-white text-sm">
                                X
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addMatchup} className="w-full bg-slate-100 border-2 border-lightGray p-3 text-base rounded-lg mt-2">Add Matchup</button>
                </div>
                <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg">
                    Add Event
                </button>
            </form>
        </div>
    )
}

export default NewMMAEventForm