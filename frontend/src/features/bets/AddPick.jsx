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

    return (
        <form className='flex flex-col items-center'>
            <div className='flex flex-col w-5/6 gap-6 border-2 p-4'>
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
                                {/* <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer'>UFC 300</li>
                                <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer'>UFC Fight Night: Nicolau vs Perez</li> */}
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
                                {/* <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer'>UFC Fight Night: Nicolau vs Perez</li> */}
                            </ul>
                        </div>}
                    </div>
                </div>
                <div ref={pickContainer}>
                    <p>Pick</p>
                    <div className='relative'>
                        <div className='flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer' aria-label='Select matchup' onClick={togglePickDropdown}>
                            <span>{pickedFighter}</span>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                        {pickDropdown && <div className='w-full mt-2 rounded-lg bg-white  p-2 dropdown absolute'>
                            <ul className='options max-h-60 overflow-y-auto'>
                                {pickList}
                                {/* <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer'>UFC Fight Night: Nicolau vs Perez</li> */}
                            </ul>
                        </div>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AddPick