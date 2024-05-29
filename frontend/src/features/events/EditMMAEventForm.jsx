import { useUpdateMMAEventMutation } from "./mmaEventsApiSlice"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const EditMMAEventForm = ({ event }) => {
    const navigate = useNavigate()

    const [updateMMAEvent, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateMMAEventMutation()

    const formattedMatchups = event.matchups.map(item => {
        const fighterA = item.matchup.split(" vs ")[0]
        const fighterB = item.matchup.split(" vs ")[1]
        return { fighterA, fighterB, division: item.division, weightClass: item.weightClass }
    })

    const [matchups, setMatchups] = useState(formattedMatchups)
    const date = new Date(event.eventDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    const convertedDate = `${month}/${day}/${year}`

    const matchupChange = (index, e) => {
        const { name, value } = e.target
        const newMatchups = [...matchups]
        newMatchups[index][name] = value
        setMatchups(newMatchups)
    }

    const [matchupToDelete, setMatchupToDelete] = useState()

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
        setMatchupToDelete({ ...matchups[index], index })
    }

    const confirmDeleteMatchup = (index) => {
        const newMatchups = matchups.filter((_, i) => i !== index)
        setMatchups(newMatchups)
        setMatchupToDelete()
    }

    const cancelDeleteMatchup = () => {
        setMatchupToDelete()
    }

    useEffect(() => {
        if (matchupToDelete) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => { document.body.style.overflow = "unset" }
    }, [matchupToDelete])

    useEffect(() => {
        if (isSuccess) {
            navigate('/editmmaevent')
        }
    }, [isSuccess, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const matchupsArray = []
        matchups.forEach(fight => {
            const matchupStr = `${fight.fighterA} vs ${fight.fighterB}`
            const matchupData = {
                matchup: matchupStr,
                division: fight.division,
                weightClass: fight.weightClass
            }
            matchupsArray.push(matchupData)
        })
        const dataToSubmit = {
            eventName: event.eventName,
            matchups: matchupsArray
        }
        await updateMMAEvent(dataToSubmit)
    }

    return (
        <div className="flex flex-col items-center">
            {isError && <p className="text-brightRed font-semibold">{error?.data?.message}</p>}
            <h1 className="text-2xl font-semibold mt-8">Edit MMA Event</h1>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6 p-4 bg-white shadow-xl text-sm md:p-8 md:rounded-lg md:text-base md:w-3/4 xl:w-1/2">
                <div className="flex justify-between font-medium">
                    {event.eventName}
                    <button type="button" onClick={() => navigate('/editmmaevent')} className="bg-slate-400 px-8 py-2 rounded-lg text-white">Back</button>
                </div>
                <p>{convertedDate}</p>
                <p className="text-center font-semibold">Matchups</p>
                <div className="p-4 flex flex-col gap-4 border-2 border-slate-500 rounded-lg">
                    {matchups.map((matchup, index) => (
                        <div key={index} className="w-full flex flex-col gap-4 justify-between md:flex-row md:items-end">
                            <p className="text-sm mb-2 w-3">{index + 1}</p>
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
                    Update Event
                </button>
            </form>
            {matchupToDelete && <div className="fixed top-0 left-0 w-full h-full bg-black opacity-25"></div>}
            {matchupToDelete && <div className="fixed flex justify-center z-10">
                <div className="w-1/2 p-6 bg-white mt-20 rounded-lg">
                    <p className="text-black">Are you sure you want to delete <span className="font-semibold">{`"${matchupToDelete.fighterA} vs ${matchupToDelete.fighterB}"`}?</span> This will delete all associated bets with this matchup. Please make sure this matchup is 100% cancelled before confirming.</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={cancelDeleteMatchup} className="border-2 px-4 py-1 rounded-lg border-zinc-400">Cancel</button>
                        <button type="button" onClick={() => confirmDeleteMatchup(matchupToDelete.index)} className="bg-red-500 px-4 py-1 rounded-lg text-white">Delete</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default EditMMAEventForm