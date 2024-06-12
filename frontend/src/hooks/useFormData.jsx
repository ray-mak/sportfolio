import { useState } from "react"

const useFormData = (initialState) => {
    const [formData, setFormData] = useState(initialState)

    function handleChange(e, name) {
        const { value, innerText, tagName } = e.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: tagName === "LI" ? innerText : value
            }
        })
    }
    return [formData, handleChange, setFormData]
}

export default useFormData