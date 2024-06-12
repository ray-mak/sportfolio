import { useState } from "react"


const useFormError = (initialState) => {
    const [formError, setFormError] = useState(initialState)
    return [formError, setFormError]
}

export default useFormError