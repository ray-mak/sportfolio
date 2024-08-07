import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { useAddNewMMAMLBetMutation } from './mmaMLApiSlice'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { convertAmericanOdds, convertDecimalOdds, convertProbability } from '../../hooks/oddsConverter'


const AddMMAPickForm = ({ events }) => {
    const [addNewMMAMLBet, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMMAMLBetMutation()

    const { id } = useAuth()
    const navigate = useNavigate()

    //variables to store form data, errors, input validation and dropdown status.
    const [formData, setFormData] = useState({
        event: "Select Event",
        matchup: "Select Matchup",
        pick: "Pick Fighter",
        odds: "",
        betAmount: "",
        notes: ""
    })

    const [dropdowns, setDropdowns] = useState({
        eventDropdown: false,
        matchupDropdown: false,
        pickDropdown: false
    })

    const [isValid, setIsValid] = useState({
        event: false,
        matchup: false,
        pick: false,
        odds: false,
        betAmount: false
    })

    const [formError, setFormError] = useState({
        event: false,
        matchup: false,
        pick: false,
        odds: false,
        betAmount: false
    })

    //updates form values
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
            pickDropdown: false
        }))
    }

    //generate event names from JSON
    const eventNames = events.map(item => {
        return (
            <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "event")} key={item.eventName}>{item.eventName}</li>
        )
    })

    //Generate matchups based on which event is selected, by matching the name of the event selected in the form with same event name in the JSON.
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

    //generate pick options based on which matchup is selected
    let pickList
    if (formData.matchup != "Select Matchup") {
        const fighters = formData.matchup.split(" vs ")
        pickList = fighters.map(fighter => {
            return (
                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleChange(e, "pick")} key={fighter}>{fighter}</li>
            )
        })
    } else {
        pickList = <li className='flex items-center p-2 rounded-md'>Please select a matchup first</li>
    }

    //reset dropdown options when parent dropdown selection changes. (reset matchup and pick if event changes, reset pick if matchup changes.)

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            matchup: "Select Matchup",
            pick: "Pick Fighter",
        }))
    }, [formData.event])

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            pick: "Pick Fighter",
        }))
    }, [formData.matchup])

    //toggle dropdowns and close dropdown when clicking outside of dropdown
    function toggleDropdown(dropdown) {
        setDropdowns(prevState => ({
            ...prevState,
            [dropdown]: !prevState[dropdown]
        }))
    }

    const eventContainer = useRef(null)
    const matchupContainer = useRef(null)
    const pickContainer = useRef(null)
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
        }
        document.addEventListener("click", handleClick)

        return () => {
            removeEventListener("click", handleClick)
        }
    }, [])

    //set odds input and automatically update decimal/american/probability when one input changes
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

    //handle and store bet amount, users are only allowed to bet between 0-10 units
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

    //calculate profit amount
    const [profitAmount, setProfitAmount] = useState(0)
    useEffect(() => {
        if (betAmount && oddsData.decimalOdds) {
            const profit = betAmount * oddsData.decimalOdds - betAmount
            setProfitAmount(profit.toFixed(2))
        } else {
            setProfitAmount(0)
        }
    }, [betAmount, oddsData.decimalOdds])

    useEffect(() => {
        formData.event === "Select Event" ? setIsValid(prevState => ({ ...prevState, event: false })) : setIsValid(prevState => ({ ...prevState, event: true }))
    }, [formData.event])
    useEffect(() => {
        formData.matchup === "Select Matchup" ? setIsValid(prevState => ({ ...prevState, matchup: false })) : setIsValid(prevState => ({ ...prevState, matchup: true }))
    }, [formData.matchup])
    useEffect(() => {
        formData.pick === "Pick Fighter" ? setIsValid(prevState => ({ ...prevState, pick: false })) : setIsValid(prevState => ({ ...prevState, pick: true }))
    }, [formData.pick])
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

    //show confirmation and submit form
    const [showConfirmation, setShowConfirmation] = useState(false)
    function handleSubmit(e) {
        e.preventDefault()
        isValid.event ? setFormError(prevState => ({ ...prevState, event: false })) : setFormError(prevState => ({ ...prevState, event: true }))
        isValid.matchup ? setFormError(prevState => ({ ...prevState, matchup: false })) : setFormError(prevState => ({ ...prevState, matchup: true }))
        isValid.pick ? setFormError(prevState => ({ ...prevState, pick: false })) : setFormError(prevState => ({ ...prevState, pick: true }))
        isValid.betAmount ? setFormError(prevState => ({ ...prevState, betAmount: false })) : setFormError(prevState => ({ ...prevState, betAmount: true }))
        isValid.odds ? setFormError(prevState => ({ ...prevState, odds: false })) : setFormError(prevState => ({ ...prevState, odds: true }))

        const canSave = Object.values(isValid).every(Boolean)


        if (canSave) setShowConfirmation(true)
    }

    function cancelConfirm() {
        setShowConfirmation(false)
    }

    useEffect(() => {
        if (isSuccess) {
            navigate("/dash")
        }
    }, [isSuccess, navigate])

    const submitData = async (e) => {
        e.preventDefault()
        await addNewMMAMLBet({
            user: id,
            betType: "moneyline",
            event: formData.event,
            matchup: formData.matchup,
            pick: formData.pick,
            odds: formData.odds,
            betAmount: formData.betAmount,
            notes: formData.notes
        })
    }

    return (
        <div className='flex flex-col items-center justify-center text-sm sm:text-base'>
            <form onSubmit={handleSubmit} className='flex flex-col w-full gap-6 border-2 border-slate-600 p-4 bg-slate-100 mb-8 sm:w-5/6 lg:w-3/5 2xl:w-1/2'>
                <div ref={eventContainer}>
                    <div className='flex'>
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
                <div ref={pickContainer} className='relative'>
                    <div className='flex'>
                        <p>Pick</p>
                        {formError.pick && <span className='ml-auto text-red-400 font-medium'>Required</span>}
                    </div>
                    <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${formError.pick ? "border-2 border-red-400" : ""}`} aria-label='Select matchup' onClick={() => toggleDropdown("pickDropdown")}>
                        <span>{formData.pick}</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {dropdowns.pickDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                        <ul className='options max-h-60 overflow-y-auto'>
                            {pickList}
                        </ul>
                    </div>}
                </div>
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
                <label htmlFor='notes'>
                    <p>Notes (optional)</p>
                    <textarea
                        id='notes'
                        value={formData.notes}
                        onChange={(e) => handleChange(e, "notes")}
                        className='w-full h-28 px-4 py-2 rounded-lg mt-1 resize-none'
                    />
                </label>
                <button className='w-32 py-2 text-white bg-brightRed rounded-md ml-auto'>Submit</button>
            </form >
            {/* Confirmation dialog and dark overlay */}
            {
                showConfirmation && <div className='absolute flex flex-col gap-4 p-6 border-2 z-20 bg-white -mt-16 sm:w-80'>
                    <p className='text-2xl font-semibold'>Confirm your pick</p>
                    <div className='flex'>
                        <p>Pick</p>
                        <p className='ml-auto font-semibold'>{formData.pick}</p>
                    </div>
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
        </div >
    )
}

export default AddMMAPickForm