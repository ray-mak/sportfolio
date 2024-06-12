import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const Dropdown = ({ label, error, value, onClick, isOpen, items, handleItemClick, setContainerRef }) => {
    const containerRef = useRef(null)

    useEffect(() => {
        setContainerRef(label, containerRef.current)
    }, [label, setContainerRef])

    return (
        <div ref={containerRef}>
            <div className="flex">
                <p>{label}</p>
                {error && <span className='ml-auto text-red-400 font-medium'>Required</span>}
            </div>
            <div className='relative'>
                <button type='button' className={`w-full flex items-center justify-between bg-white px-4 py-2 rounded-lg mt-1 hover:cursor-pointer ${error ? "border-2 border-red-400" : ""}`} aria-label={`Select ${label}`} onClick={onClick}>
                    <span>{value}</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>
                {isOpen && <div className='w-full mt-2 rounded-lg bg-white max-h-60 overflow-y-auto p-2 dropdown absolute'>
                    <ul>
                        {items.map((item, index) => (
                            <li className='flex items-center p-2 rounded-md hover:bg-blue-400 hover:text-white hover:cursor-pointer' onClick={(e) => handleItemClick(e, item)} key={index}>{item}</li>
                        ))}
                    </ul>
                </div>}
            </div>
        </div>
    )
}

export default Dropdown