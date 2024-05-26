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

    //input fields: Event Name, Event Date/Time, matchups. 
    //for matchups container, it will have 2 inputs per matchup (1 for each fighter), User can choose to add additional matchups, which will create new rows of inputs. 
    return (
        <div>NewMMAEventForm</div>
    )
}

export default NewMMAEventForm