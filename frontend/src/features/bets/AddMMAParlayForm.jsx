import { useState, useEffect, useRef } from "react"
import { useAddNewMMAParlayMutation } from "./mmaParlayApiSlice"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import timeProps from "../../../public/timeProps.json"
import fighterProps from "../../../public/fighterProps.json"
import { convertAmericanOdds, convertDecimalOdds, convertProbability } from "../../hooks/oddsConverter"

const AddMMAParlayForm = ({ events }) => {
    const [addNewMMAParlay, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMMAParlayMutation()

    const { id } = useAuth()
    const navigate = useNavigate()

    //"pick" refers to the fighter picked for Moneyline pick, "pickFighter" refers to the fighter picked for Prop pick
    const [formData, setFormData] = useState({
        event: "Select Event",
        matchup: "Select Matchup",
        parlayBetType: "moneyline",
        pick: "Pick Fighter",
        propType: "timeProp",
        timeProp: "Select Prop",
        fighterProp: "Select Prop",
        pickFighter: "Pick Fighter",
        odds: "",
        betAmount: "",
        notes: ""
    })

    const [parlayData, setParlayData] = useState([])

    const [isValid, setIsValid] = useState({
        event: false,
        matchup: false,
        pick: false,
        pickFighter: true,
        pickTimeProp: true,
        fighterProp: true,
        odds: false,
        betAmount: false
    })

    const [formError, setFormError] = useState({
        event: false,
        matchup: false,
        pick: false,
        pickFighter: false,
        pickTimeProp: false,
        fighterProp: false,
        odds: false,
        betAmount: false,
    })

    const [dropdowns, setDropdowns] = useState({
        eventDropdown: false,
        matchupDropdown: false,
        pickDropdown: false,
        timePropDropdown: false,
        fighterPropDropdown: false,
        pickFighterDropdown: false
    })

    function handleChange(e, name) {
        const { value, innerText, tagName } = e.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: tagName === "LI" ? innerText : value
            }
        })

        setDropdowns(prevState => ({
            ...prevState,
            eventDropdown: false,
            matchupDropdown: false,
            pickDropdown: false,
            timePropDropdown: false,
            fighterPropDropdown: false,
            pickFighterDropdown: false
        }))
    }

    //logic to generate events, matchups, pick and parlay summary, and total odds
    const eventNames = events.map(item => {
        return (
            <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "event")} key={item.eventName}>{item.eventName}</li>
        )
    })

    const selectedEventMatchups = events.find(item => item.eventName === formData.event)
    let matchupsList
    if (selectedEventMatchups) {
        matchupsList = selectedEventMatchups.matchups.map(item => {
            return (
                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "matchup")} key={item.matchup}>{item.matchup}</li>
            )
        })
    } else {
        matchupsList = <li className='flex items-center p-2 rounded-md '>Please select an event first</li>
    }

    let pickList, propPickList
    if (formData.matchup != "Select Matchup") {
        const fighters = formData.matchup.split(" vs ")
        pickList = fighters.map(fighter => {
            return (
                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "pick")} key={fighter}>{fighter}</li>
            )
        })
        propPickList = fighters.map(fighter => {
            return (
                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "pickFighter")} key={fighter}>{fighter}</li>
            )
        })
    } else {
        pickList = <li className='flex items-center p-2 rounded-md'>Please select a matchup first</li>
        propPickList = <li className='flex items-center p-2 rounded-md'>Please select a matchup first</li>
    }

    const timePropOptions = timeProps.map(prop => (
        <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "timeProp")} key={prop}>{prop}</li>
    ))

    const fighterPropOptions = fighterProps.map(prop => (
        <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "fighterProp")} key={prop}>{prop}</li>
    ))

    const parlaySummary = parlayData.map((object, index) => {
        let pick
        if (object.parlayBetType === "moneyline") {
            pick = `${object.pick} to win`
        } else if (object.parlayBetType === "prop" && object.propType === "timeProp") {
            pick = object.timeProp
        } else if (object.parlayBetType === "prop" && object.propType === "fighterProp") {
            pick = `${object.pickFighter} ${object.fighterProp}`
        }

        return (
            <tr key={index}>
                <td data-cell="matchup" className="text-left">{object.matchup}</td>
                <td data-cell="pick" className="text-left">{pick}</td>
                <td data-cell="odds" className="text-left">{object.odds}</td>
                <td onClick={() => deleteParlayLeg(index)} data-cell="delete" className="cursor-pointer"><FontAwesomeIcon icon={faTrashCan} /></td>
            </tr>
        )
    })

    const deleteParlayLeg = (indexToDelete) => {
        setParlayData(prevData => prevData.filter((_, index) => index !== indexToDelete))
    }

    const parlayConfirmation = parlayData.map((object, index) => {
        let pick
        if (object.parlayBetType === "moneyline") {
            pick = `${object.pick} to win`
        } else if (object.parlayBetType === "prop" && object.propType === "timeProp") {
            pick = object.timeProp
        } else if (object.parlayBetType === "prop" && object.propType === "fighterProp") {
            pick = `${object.pickFighter} ${object.fighterProp}`
        }

        return (
            <tr key={index}>
                <td data-cell="matchup" className="text-left">{object.matchup}</td>
                <td data-cell="pick" className="md:pl-6 text-left">{pick}</td>
                <td data-cell="odds" className="md:pl-6 text-left">{object.odds}</td>
            </tr>
        )
    })

    const totalOdds = parlayData.length ? parlayData.reduce((accumulator, parlayLeg) => accumulator * parlayLeg.odds, 1) : 0


    const [isMoneyline, setIsMoneyline] = useState(true)

    useEffect(() => {
        if (formData.parlayBetType === "moneyline") {
            setFormData(prevData => ({
                ...prevData,
                timeProp: "Select Prop",
                fighterProp: "Select Prop",
                pickFighter: "Pick Fighter",
            }))
            setIsMoneyline(true)
        } else {
            setFormData(prevData => ({ ...prevData, pick: "Pick Fighter" }))
            setIsMoneyline(false)
        }
    }, [formData.parlayBetType])

    const [isFighterProp, setIsFighterProp] = useState(false)

    useEffect(() => {
        if (formData.propType === "timeProp") {
            setFormData(prevData => ({ ...prevData, pick: "Pick Fighter", pickFighter: "Pick Fighter", fighterProp: "Select Prop" }))
            setIsFighterProp(false)
        } else {
            setFormData(prevData => ({ ...prevData, timeProp: "Select Prop" }))
            setIsFighterProp(true)
        }

    }, [formData.propType])

    //logic for odds and odds converter
    const [oddsData, setOddsData] = useState({
        americanOdds: "",
        decimalOdds: "",
        probability: ""
    })

    const handleAmericanOddsChange = (e) => {
        const newAmericanOdds = e.target.value
        setOddsData(prevData => ({
            ...prevData,
            americanOdds: newAmericanOdds,
            ...convertAmericanOdds(newAmericanOdds)
        }))
    }

    const handleDecimalOddsChange = (e) => {
        let newDecimalOdds = e.target.value
        if (newDecimalOdds.length > 4) {
            newDecimalOdds = newDecimalOdds.slice(0, 4)
        }
        setOddsData(prevData => ({
            ...prevData,
            decimalOdds: newDecimalOdds,
            ...convertDecimalOdds(newDecimalOdds)
        }))
    }

    const handleProbabilityChange = (e) => {
        const newProbability = e.target.value
        setOddsData(prevData => ({
            ...prevData,
            probability: newProbability,
            ...convertProbability(newProbability)
        }))
    }

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            odds: Number(oddsData.decimalOdds).toFixed(2)
        }))
    }, [oddsData])

    //logic for betAmount and profit
    const [betAmount, setBetAmount] = useState("")
    function handleBetAmount(e) {
        let betInput = e.target.value
        if (betInput.length > 4) {
            betInput = betInput.slice(0, 4)
        }
        if (betInput < 0) {
            betInput = 0
        } else if (betInput > 10) {
            betInput = 10
        }
        setBetAmount(betInput)
        setFormData(prevState => ({ ...prevState, betAmount: betInput }))
    }

    const [profitAmount, setProfitAmount] = useState(0)
    useEffect(() => {
        if (betAmount && totalOdds != 0) {
            const profit = betAmount * totalOdds - betAmount
            setProfitAmount(profit.toFixed(2))
        } else {
            setProfitAmount(0)
        }
    }, [betAmount, totalOdds])

    //logic for checking if inputs are valid
    useEffect(() => {
        formData.event === "Select Event" ? setIsValid(prevState => ({ ...prevState, event: false })) : setIsValid(prevState => ({ ...prevState, event: true }))
    }, [formData.event])
    useEffect(() => {
        formData.matchup === "Select Matchup" ? setIsValid(prevState => ({ ...prevState, matchup: false })) : setIsValid(prevState => ({ ...prevState, matchup: true }))
    }, [formData.matchup])
    useEffect(() => {
        formData.betAmount === "" ? setIsValid(prevState => ({ ...prevState, betAmount: false })) : setIsValid(prevState => ({ ...prevState, betAmount: true }))
    }, [formData.betAmount])
    useEffect(() => {
        if (oddsData.americanOdds > -100 && oddsData.americanOdds < 100 || oddsData.decimalOdds < 1) {
            setIsValid(prevState => ({ ...prevState, odds: false }))
        } else {
            setIsValid(prevState => ({ ...prevState, odds: true }))
        }
    }, [formData.odds])
    useEffect(() => {
        (formData.parlayBetType === "moneyline" && formData.pick === "Pick Fighter") ? setIsValid(prevState => ({ ...prevState, pick: false })) : setIsValid(prevState => ({ ...prevState, pick: true }))
    }, [formData.pick, formData.parlayBetType])
    useEffect(() => {
        (formData.parlayBetType === "prop" && formData.propType === "timeProp" && formData.timeProp === "Select Prop") ? setIsValid(prevState => ({ ...prevState, pickTimeProp: false })) : setIsValid(prevState => ({ ...prevState, pickTimeProp: true }))
    }, [formData.parlayBetType, formData.propType, formData.timeProp])
    useEffect(() => {
        (formData.parlayBetType === "prop" && formData.propType === "fighterProp" && formData.pickFighter === "Pick Fighter") ? setIsValid(prevState => ({ ...prevState, pickFighter: false })) : setIsValid(prevState => ({ ...prevState, pickFighter: true }))
    }, [formData.parlayBetType, formData.propType, formData.pickFighter])
    useEffect(() => {
        (formData.parlayBetType === "prop" && formData.propType === "fighterProp" && formData.fighterProp === "Select Prop") ? setIsValid(prevState => ({ ...prevState, fighterProp: false })) : setIsValid(prevState => ({ ...prevState, fighterProp: true }))
    }, [formData.parlayBetType, formData.propType, formData.fighterProp])

    //logic to add parlay leg
    const addParlayLeg = () => {
        isValid.event ? setFormError(prevState => ({ ...prevState, event: false })) : setFormError(prevState => ({ ...prevState, event: true }))
        isValid.matchup ? setFormError(prevState => ({ ...prevState, matchup: false })) : setFormError(prevState => ({ ...prevState, matchup: true }))
        isValid.pick ? setFormError(prevState => ({ ...prevState, pick: false })) : setFormError(prevState => ({ ...prevState, pick: true }))
        isValid.pickFighter ? setFormError(prevState => ({ ...prevState, pickFighter: false })) : setFormError(prevState => ({ ...prevState, pickFighter: true }))
        isValid.fighterProp ? setFormError(prevState => ({ ...prevState, fighterProp: false })) : setFormError(prevState => ({ ...prevState, fighterProp: true }))
        isValid.pickTimeProp ? setFormError(prevState => ({ ...prevState, pickTimeProp: false })) : setFormError(prevState => ({ ...prevState, pickTimeProp: true }))
        isValid.odds ? setFormError(prevState => ({ ...prevState, odds: false })) : setFormError(prevState => ({ ...prevState, odds: true }))

        const { betAmount, ...isValidData } = isValid
        const canAdd = Object.values(isValidData).every(Boolean) && !isLoading
        if (canAdd) {
            const parlayLeg = {
                event: formData.event,
                matchup: formData.matchup,
                parlayBetType: formData.parlayBetType,
                pick: formData.pick,
                propType: formData.propType,
                pickFighter: formData.pickFighter,
                fighterProp: formData.fighterProp,
                timeProp: formData.timeProp,
                odds: formData.odds,
                notes: formData.notes
            }
            setParlayData(prevData => ([...prevData, parlayLeg]))
            setFormData(prevData => ({
                ...prevData,
                matchup: "Select Matchup",
                parlayBetType: "moneyline",
                pick: "Pick Fighter",
                propType: "timeProp",
                timeProp: "Select Prop",
                fighterProp: "Select Prop",
                pickFighter: "Pick Fighter",
                odds: "",
                notes: ""
            }))
            setOddsData({
                americanOdds: "",
                decimalOdds: "",
                probability: ""
            })
        }
    }

    //logic to show confirmation and submit parlay
    const [showConfirmation, setShowConfirmation] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        isValid.betAmount ? setFormError(prevState => ({ ...prevState, betAmount: false })) : setFormError(prevState => ({ ...prevState, betAmount: true }))
        if (!parlayData?.length) {
            alert("Parlay must have at least 1 leg")
        } else {
            if (isValid.betAmount) setShowConfirmation(true)
        }
    }

    const cancelConfirm = (e) => {
        setShowConfirmation(false)
    }

    useEffect(() => {
        if (isSuccess) {
            navigate("/dash")
        }
    }, [isSuccess, navigate])

    const submitData = async (e) => {
        e.preventDefault()
        const dataToSubmit = {
            user: id,
            betType: "parlay",
            betAmount: formData.betAmount,
            parlayInfo: parlayData
        }
        console.log(dataToSubmit)
        await addNewMMAParlay(dataToSubmit)
    }

    //logic for toggling dropdowns
    const eventContainer = useRef(null)
    const matchupContainer = useRef(null)
    const pickContainer = useRef(null)
    const timePropContainer = useRef(null)
    const fighterPropContainer = useRef(null)
    const pickFighterContainer = useRef(null)

    function toggleDropdown(dropdown) {
        setDropdowns(prevState => ({
            ...prevState,
            [dropdown]: !prevState[dropdown]
        }))
    }

    useEffect(() => {
        const handleClick = (e) => {
            if (eventContainer.current && !eventContainer.current.contains(e.target)) {
                setDropdowns(prevState => ({ ...prevState, eventDropdown: false }))
            }
            if (matchupContainer.current && !matchupContainer.current.contains(e.target)) {
                setDropdowns(prevState => ({ ...prevState, matchupDropdown: false }))
            }
            if (pickContainer.current && !pickContainer.current.contains(e.target)) {
                setDropdowns(prevState => ({ ...prevState, pickDropdown: false }))
            }
            if (timePropContainer.current && !timePropContainer.current.contains(e.target)) {
                setDropdowns(prevState => ({ ...prevState, timePropDropdown: false }))
            }
            if (fighterPropContainer.current && !fighterPropContainer.current.contains(e.target)) {
                setDropdowns(prevState => ({ ...prevState, fighterPropDropdown: false }))
            }
            if (pickFighterContainer.current && !pickFighterContainer.current.contains(e.target)) {
                setDropdowns(prevState => ({ ...prevState, pickFighterDropdown: false }))
            }
        }
        document.addEventListener("click", handleClick)

        return () => {
            removeEventListener("click", handleClick)
        }
    }, [])
    return (
        <div className='mb-20 flex flex-col items-center justify-center text-sm sm:text-base'>
            <form onSubmit={handleSubmit} className='flex flex-col w-full gap-6 border-2 border-slate-600 p-4 bg-slate-100 sm:w-5/6 lg:w-3/5 2xl:w-1/2'>
                <div ref={eventContainer}>
                    <div className="flex">
                        <p>Event</p>
                        {formError.event && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                    </div>
                    <div className='relative'>
                        <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.event ? "border-2 border-red-400" : ""}`} aria-label='Select event' onClick={() => toggleDropdown("eventDropdown")}>
                            <span>{formData.event}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {dropdowns.eventDropdown && <div className='w-full mt-2 rounded-lg bg-white max-h-60 overflow-y-auto p-2 dropdown absolute'>
                            <ul>
                                {eventNames}
                            </ul>
                        </div>}
                    </div>
                </div>
                <div ref={matchupContainer}>
                    <div className='flex'>
                        <p>Matchup</p>
                        {formError.matchup && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                    </div>
                    <div className='relative'>
                        <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.matchup ? "border-2 border-red-400" : ""}`} aria-label='Select matchup' onClick={() => toggleDropdown("matchupDropdown")}>
                            <span>{formData.matchup}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {dropdowns.matchupDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {matchupsList}

                            </ul>
                        </div>}
                    </div>
                </div>
                <fieldset className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <legend className="mb-1">Bet Type</legend>
                    <div className="flex gap-2">
                        <input
                            type="radio"
                            id="moneyline"
                            name="parlayBetType"
                            value="moneyline"
                            checked={formData.parlayBetType === "moneyline"}
                            onChange={(e) => handleChange(e, "parlayBetType")}
                        />
                        <label htmlFor="moneyline">Moneyline</label>
                        <input
                            type="radio"
                            id="prop"
                            name="parlayBetType"
                            value="prop"
                            checked={formData.parlayBetType === "prop"}
                            onChange={(e) => handleChange(e, "parlayBetType")}
                            className="ml-6"
                        />
                        <label htmlFor="prop">Prop</label>
                    </div>
                    <div ref={pickContainer} className={`relative w-full sm:w-1/2 sm:ml-auto ${isMoneyline ? "" : "opacity-50"}`}>
                        <div className='flex'>
                            <p>Pick Fighter - Moneyline</p>
                            {formError.pick && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                        </div>
                        <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.pick ? "border-2 border-red-400" : ""} `} aria-label='Select matchup' onClick={() => toggleDropdown("pickDropdown")} disabled={!isMoneyline}>
                            <span>{formData.pick}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {dropdowns.pickDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {pickList}
                            </ul>
                        </div>}
                    </div>
                </fieldset>
                <fieldset className={`flex flex-col gap-4 sm:flex-row sm:items-center ${!isMoneyline ? "" : "opacity-50"}`}>
                    <legend className="mb-1">Prop Type</legend>
                    <div className="flex gap-2">
                        <input
                            type="radio"
                            id="timeProp"
                            name="propType"
                            value="timeProp"
                            checked={formData.propType === "timeProp"}
                            onChange={(e) => handleChange(e, "propType")}
                            disabled={isMoneyline}
                        />
                        <label htmlFor="timeProp">Time Prop</label>
                        <input
                            type="radio"
                            id="fighterProp"
                            name="propType"
                            value="fighterProp"
                            checked={formData.propType === "fighterProp"}
                            onChange={(e) => handleChange(e, "propType")}
                            className="ml-6"
                            disabled={isMoneyline}
                        />
                        <label htmlFor="fighterProp">Fighter Prop</label>
                    </div>
                    <div ref={pickFighterContainer} className={`relative w-full sm:w-1/2 sm:ml-auto ${isFighterProp ? "" : "opacity-50"}`}>
                        <div className='flex'>
                            <p>Pick Fighter - Prop</p>
                            {formError.pickFighter && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                        </div>
                        <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.pickFighter ? "border-2 border-red-400" : ""} `} aria-label='Pick fighter for prop' onClick={() => toggleDropdown("pickFighterDropdown")} disabled={!isFighterProp || isMoneyline}>
                            <span>{formData.pickFighter}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {dropdowns.pickFighterDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {propPickList}
                            </ul>
                        </div>}
                    </div>
                </fieldset>
                {!isFighterProp && <div ref={timePropContainer} className={`${!isMoneyline ? "" : "opacity-50"}`}>
                    <div className='flex'>
                        <p>Pick Time Prop</p>
                        {formError.pickTimeProp && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                    </div>
                    <div className='relative'>
                        <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.pickTimeProp ? "border-2 border-red-400" : ""}`} aria-label='Select time prop' onClick={() => toggleDropdown("timePropDropdown")} disabled={isMoneyline}>
                            <span>{formData.timeProp}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {dropdowns.timePropDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {timePropOptions}
                            </ul>
                        </div>}
                    </div>
                </div>}
                {isFighterProp && <div ref={fighterPropContainer} className={`${!isMoneyline ? "" : "opacity-50"}`}>
                    <div className='flex'>
                        <p>Pick Fighter Prop</p>
                        {formError.fighterProp && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                    </div>
                    <div className='relative'>
                        <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.fighterProp ? "border-2 border-red-400" : ""}`} aria-label='Select prop' onClick={() => toggleDropdown("fighterPropDropdown")} disabled={isMoneyline}>
                            <span>{formData.fighterProp}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {dropdowns.fighterPropDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {fighterPropOptions}
                            </ul>
                        </div>}
                    </div>
                </div>}
                <div>
                    <div className='flex'>
                        <p>Odds</p>
                        {formError.odds && <span className='ml-auto text-red-400 font-medium'>Invalid Odds</span>}
                    </div>
                    <div className='w-full grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-10'>
                        <label htmlFor='americanOdds'>
                            American
                            <input
                                id='americanOdds'
                                type='number'
                                value={oddsData.americanOdds}
                                onChange={handleAmericanOddsChange}
                                className={`w-full px-4 py-2 rounded-lg ${formError.odds ? "border-2 border-red-400" : ""}`}
                            />
                        </label>
                        <label htmlFor='decimalnOdds'>
                            Decimal
                            <input
                                id='decimalOdds'
                                type='number'
                                value={oddsData.decimalOdds}
                                onChange={handleDecimalOddsChange}
                                className={`w-full px-4 py-2 rounded-lg ${formError.odds ? "border-2 border-red-400" : ""}`}
                            />
                        </label>
                        <label htmlFor='probability'>
                            Probability
                            <div className='flex items-center gap-2'>
                                <input
                                    id='probability'
                                    type='number'
                                    value={oddsData.probability}
                                    onChange={handleProbabilityChange}
                                    className={`w-full px-4 py-2 rounded-lg ${formError.odds ? "border-2 border-red-400" : ""}`}
                                />
                                <p className='text-xl'>%</p>
                            </div>
                        </label>
                    </div>
                </div>
                <label htmlFor='notes'>
                    <p>Notes (optional)</p>
                    <textarea
                        id='notes'
                        value={formData.notes}
                        onChange={(e) => handleChange(e, "notes")}
                        className='w-full h-28 px-4 py-2 rounded-lg mt-1 resize-none'
                    />
                </label>
                <button type="button" onClick={addParlayLeg} className='w-full py-2 text-white bg-slate-500 rounded-md ml-auto'>Add to Parlay</button>
                <table>
                    <thead>
                        <tr>
                            <th className="text-left">Matchup</th>
                            <th className="text-left">Pick</th>
                            <th className="text-left">Odds</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {parlaySummary}
                        <tr className="border-t parlay-total">
                            <td colSpan="2" className="font-medium">Total Odds</td>
                            <td className="font-medium" data-cell="total odds">{totalOdds.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div className='grid grid-cols-2 gap-12'>
                    <label htmlFor='betAmount'>
                        <p className='flex'>Bet [0-10] Units {formError.betAmount && <span className='ml-auto text-red-400 font-medium'>Required</span>}</p>
                        <input
                            id='betAmount'
                            type='number'
                            value={betAmount}
                            onChange={handleBetAmount}
                            className={`w-full px-4 py-2 rounded-lg mt-1 ${formError.betAmount ? "border-2 border-red-400" : ""}`}
                            maxLength={4}
                            min={0}
                            max={10}
                            step={0.01}
                        />
                    </label>
                    <div className='flex flex-col'>
                        <p>To Profit</p>
                        <p className='py-3'><span className='font-semibold'>{profitAmount}</span> units</p>
                    </div>
                </div>
                <button className='px-6 py-2 text-white bg-brightRed rounded-md ml-auto'>Submit Parlay</button>
            </form>
            {
                showConfirmation && <div className='absolute flex flex-col gap-4 p-6 border-2 z-20 bg-white -mt-16'>
                    <p className='text-2xl font-semibold'>Confirm your parlay</p>
                    <table>
                        <thead>
                            <tr>
                                <th className="text-left">Matchup</th>
                                <th className="text-left md:pl-6">Pick</th>
                                <th className="text-left md:pl-6">Odds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parlayConfirmation}
                            <tr className="border-t parlay-total">
                                <td colSpan="2" className="font-medium">Total Odds</td>
                                <td className="font-medium md:pl-6" data-cell="total odds">{totalOdds.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='flex'>
                        <p>Bet</p>
                        <p className='ml-auto font-semibold'>{betAmount}</p>
                    </div><div className='flex'>
                        <p>To Profit</p>
                        <p className='ml-auto font-semibold'>{profitAmount}</p>
                    </div>
                    <div className='flex gap-4 mt-4 ml-auto'>
                        <button onClick={cancelConfirm} className='py-2 px-4 text-brightRed font-semibold hover:opacity-70'>Cancel</button>
                        <button className='py-2 px-4 bg-brightRed text-white rounded-lg font-medium hover:opacity-70' onClick={submitData}>Confirm</button>
                    </div>
                </div>
            }
            {showConfirmation && <div className='fixed w-full h-full bg-black/50 top-0 z-10'></div>}
        </div>
    )
}

export default AddMMAParlayForm