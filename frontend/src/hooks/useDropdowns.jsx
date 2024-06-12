import { useState, useEffect, useRef } from "react"

const useDropdowns = (initialState) => {
    const [dropdowns, setDropdowns] = useState(initialState)
    const containerRefs = useRef({})

    const toggleDropdown = (dropdown) => {
        setDropdowns(prevState => ({
            ...prevState,
            [dropdown]: !prevState[dropdown]
        }))
    }

    const closeDropdown = (dropdown) => {
        setDropdowns(prevState => ({
            ...prevState,
            [dropdown]: false
        }))
    }

    useEffect(() => {
        const handleClick = (e) => {
            const newDropdownState = { ...dropdowns }

            Object.keys(containerRefs.current).forEach(dropdown => {
                if (containerRefs.current[dropdown] && !containerRefs.current[dropdown].contains(e.target)) {
                    newDropdownState[dropdown] = false
                }
            })

            setDropdowns(newDropdownState)
        }
        document.addEventListener("click", handleClick)
        return () => {
            removeEventListener("click", handleClick)
        }
    }, [dropdowns])

    const setContainerRef = (dropdown, element) => {
        containerRefs.current[dropdown] = element
    }
    return [dropdowns, toggleDropdown, closeDropdown, setContainerRef]
}

export default useDropdowns