import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import upcomingEvents from "../../../public/upcoming_events.json"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const AddPick = () => {
    //generate event names
    const eventNames = upcomingEvents.map(item => {
        return (
            <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={selectEvent} value={item.event} key={item.event}>{item.event}</li>
        )
    })

    //choose event from event dropdown
    const [selectedEvent, setSelectedEvent] = useState("Select Event")
    function selectEvent(e) {
        setSelectedEvent(e.target.innerText)
        setEventDropdown(false)
    }

    //generate matchups based on which event is selected.
    const selectedEventMatchups = upcomingEvents.find(item => item.event === selectedEvent)
    let matchupsList
    if (selectedEventMatchups) {
        matchupsList = selectedEventMatchups.matchups.map(matchup => {
            return (
                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={selectMatchup} key={matchup}>{matchup}</li>
            )
        })
    } else {
        matchupsList = <li className='flex items-center p-2 rounded-md '>Please select an event first</li>
    }

    //set selected matchup from select matchup dropdown
    const [selectedMatchup, setSelectedMatchup] = useState("Select Matchup")
    function selectMatchup(e) {
        setSelectedMatchup(e.target.innerText)
        setMatchupDropdown(false)
    }

    //generate pick options based on which matchup is selected
    let pickList
    if (selectedMatchup != "Select Matchup") {
        const fighters = selectedMatchup.split(" vs ")
        pickList = fighters.map(fighter => {
            return (
                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={pickFighter} key={fighter}>{fighter}</li>
            )
        })
    } else {
        pickList = <li className='flex items-center p-2 rounded-md'>Please select a matchup first</li>
    }

    //set the selected option for "Pick" dropdown
    const [pickedFighter, setPickedFighter] = useState("Pick Fighter")
    function pickFighter(e) {
        setPickedFighter(e.target.innerText)
        setPickDropdown(false)
    }

    //toggle dropdown menus
    const [eventDropdown, setEventDropdown] = useState(false)
    const [matchupDropdown, setMatchupDropdown] = useState(false)
    const [pickDropdown, setPickDropdown] = useState(false)
    function toggleSelectEvent() {
        setEventDropdown(prevState => !prevState)
    }
    function toggleMatchupDropdown() {
        setMatchupDropdown(prevState => !prevState)
    }
    function togglePickDropdown() {
        setPickDropdown(prevState => !prevState)
    }

    //close dropdown when clicking outside of dropdown
    const eventContainer = useRef(null)
    const matchupContainer = useRef(null)
    const pickContainer = useRef(null)
    useEffect(() => {
        const handleClick = (e) => {
            if (eventContainer.current && !eventContainer.current.contains(e.target)) {
                setEventDropdown(false)
            }
            if (matchupContainer.current && !matchupContainer.current.contains(e.target)) {
                setMatchupDropdown(false)
            }
            if (pickContainer.current && !pickContainer.current.contains(e.target)) {
                setPickDropdown(false)
            }
        }
        document.addEventListener("click", handleClick)

        return () => {
            removeEventListener("click", handleClick)
        }
    }, [])

    //set odds input and automatically update decimal/american/probability when one input changes
    const [americanOdds, setAmericanOdds] = useState("")
    const [decimalOdds, setDecimalOdds] = useState("")
    const [probability, setProbability] = useState("")

    function handleAmericanOddsChange(e) {
        let newAmericanOdds = e.target.value
        setAmericanOdds(newAmericanOdds)

        //convert American odds to decimal odds.
        if (newAmericanOdds.startsWith("-")) {
            //remove the "-"
            const number = parseFloat(newAmericanOdds.replace(/[^\d.]/g, ''))
            const newDecimalOdds = (100 / number) + 1
            const newProbability = 100 / (100 / number + 1)
            setDecimalOdds(newDecimalOdds.toFixed(2))
            setProbability(newProbability.toFixed(2))
        } else {
            const number = parseFloat(newAmericanOdds.replace(/[^\d.]/g, ''))
            const newDecimalOdds = (number / 100) + 1
            const newProbability = 100 / (number / 100 + 1)
            setDecimalOdds(newDecimalOdds.toFixed(2))
            setProbability(newProbability.toFixed(2))
        }

    }


    function handleDecimalOddsChange(e) {
        const newDecimalOdds = e.target.value
        setDecimalOdds(newDecimalOdds)
        if (newDecimalOdds >= 2) {
            const newAmericanOdds = (newDecimalOdds - 1) * 100
            const newProbability = (1 - (1 / newDecimalOdds)) * 100
            setAmericanOdds(newAmericanOdds.toFixed(0))
            setProbability(newProbability.toFixed(2))
        } else {
            const newAmericanOdds = -100 / (newDecimalOdds - 1)
            const newProbability = (1 / newDecimalOdds) * 100
            setAmericanOdds(newAmericanOdds.toFixed(0))
            setProbability(newProbability.toFixed(2))
        }
    }

    function handleProbabilityChange(e) {
        const newProbability = e.target.value
        setProbability(newProbability)

        if (newProbability >= 50) {
            const newAmericanOdds = -(newProbability / (100 - newProbability)) * 100
            const newDecimalOdds = 100 / newProbability
            setAmericanOdds(newAmericanOdds.toFixed(0))
            setDecimalOdds(newDecimalOdds.toFixed(2))
        } else {
            const newAmericanOdds = ((100 - newProbability) / newProbability) * 100
            const newDecimalOdds = (100 - newProbability) / newProbability + 1
            setAmericanOdds(newAmericanOdds.toFixed(0))
            setDecimalOdds(newDecimalOdds.toFixed(2))
        }
    }

    //handle and store bet amount
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
    }

    //calculate profit amount
    const [profitAmount, setProfitAmount] = useState(0)
    useEffect(() => {
        if (betAmount && decimalOdds) {
            const profit = betAmount * decimalOdds - betAmount
            setProfitAmount(profit.toFixed(2))
        } else {
            setProfitAmount(0)
        }
    }, [betAmount, decimalOdds])

    //handle and store notes
    const [notes, setNotes] = useState("")
    function handleNotesChange(e) {
        setNotes(e.target.value)
    }

    //handle submit
    function handleSubmit(e) {
        e.preventDefault()
    }

    console.log(americanOdds, decimalOdds, probability, betAmount)
    return (
        <div className='h-screen flex flex-col items-center justify-center text-sm sm:text-base'>
            <form onSubmit={handleSubmit} className='flex flex-col w-full gap-6 border-2 p-4 sm:w-5/6 lg:w-3/5 2xl:w-1/2'>
                <div ref={eventContainer}>
                    <p>Event</p>
                    <div className='relative'>
                        <div className='flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer' aria-label='Select event' onClick={toggleSelectEvent}>
                            <span>{selectedEvent}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                        {eventDropdown && <div className='w-full mt-2 rounded-lg bg-white max-h-60 overflow-y-auto p-2 dropdown absolute'>
                            <ul>
                                {eventNames}
                            </ul>
                        </div>}
                    </div>
                </div>
                <div ref={matchupContainer}>
                    <p>Matchup</p>
                    <div className='relative'>
                        <div className='flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer' aria-label='Select matchup' onClick={toggleMatchupDropdown}>
                            <span>{selectedMatchup}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                        {matchupDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {matchupsList}

                            </ul>
                        </div>}
                    </div>
                </div>
                <div ref={pickContainer} className='relative'>
                    <p>Pick</p>
                    <div className='flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer' aria-label='Select matchup' onClick={togglePickDropdown}>
                        <span>{pickedFighter}</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    {pickDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                        <ul className='options max-h-60 overflow-y-auto'>
                            {pickList}
                        </ul>
                    </div>}
                </div>
                <div>
                    <p>Odds</p>
                    <div className='w-full grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-10'>
                        <label htmlFor='americanOdds'>
                            American
                            <input
                                id='americanOdds'
                                type='number'
                                value={americanOdds}
                                onChange={handleAmericanOddsChange}
                                className='w-full px-4 py-2 rounded-lg'
                            />
                        </label>
                        <label htmlFor='decimalnOdds'>
                            Decimal
                            <input
                                id='decimalOdds'
                                type='number'
                                value={decimalOdds}
                                onChange={handleDecimalOddsChange}
                                className='w-full px-4 py-2 rounded-lg'
                            />
                        </label>
                        <label htmlFor='probability'>
                            Probability
                            <div className='flex items-center gap-2'>
                                <input
                                    id='probability'
                                    type='number'
                                    value={probability}
                                    onChange={handleProbabilityChange}
                                    className='w-full px-4 py-2 rounded-lg'
                                />
                                <p className='text-xl'>%</p>
                            </div>
                        </label>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-12'>
                    <label htmlFor='betAmount'>
                        <p>Bet [0-10] Units</p>
                        <input
                            id='betAmount'
                            type='number'
                            value={betAmount}
                            onChange={handleBetAmount}
                            className='w-full px-4 py-2 rounded-lg mt-1'
                            maxLength={4}
                            min={0}
                            max={10}
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
                        name='notes'
                        value={notes}
                        onChange={handleNotesChange}
                        className='w-full h-28 px-4 py-2 rounded-lg mt-1 resize-none'
                    />
                </label>
                <button className='w-32 py-2 text-white bg-brightRed rounded-md'>Submit</button>
            </form>

            <div className='absolute border-2'>
                <p>Confirm your pick</p>
            </div>
        </div>
    )
}

export default AddPick