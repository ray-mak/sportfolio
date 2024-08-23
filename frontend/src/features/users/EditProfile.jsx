import { useUpdateUserMutation } from "./usersApiSlice"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DISPLAY_REGEX = /^[a-zA-Z0-9]{3,16}$/

const EditProfile = () => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const { id, username, email, displayName } = useAuth()

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        displayName: displayName,
        email: email,
        password: "",
        confirmPassword: ""
    })

    const [isValid, setIsValid] = useState({
        password: true,
        confirmPassword: true,
        displayName: true,
        email: true
    })

    const [formErrors, setFormErrors] = useState({
        password: false,
        confirmPassword: false,
        displayName: false,
        email: false
    })

    const [serverError, setServerError] = useState({
        displayName: false,
        email: false
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    useEffect(() => {
        if (formData.password === "") {
            setIsValid(prevState => ({
                ...prevState,
                password: true
            }))
        } else {
            setIsValid(prevState => ({
                ...prevState,
                password: PASSWORD_REGEX.test(formData.password)
            }))
        }
    }, [formData.password])

    useEffect(() => {
        setIsValid(prevState => ({
            ...prevState,
            confirmPassword: formData.password === formData.confirmPassword ? true : false
        }))
    }, [formData.password, formData.confirmPassword])

    useEffect(() => {
        setIsValid(prevState => ({
            ...prevState,
            displayName: DISPLAY_REGEX.test(formData.displayName)
        }))
    }, [formData.displayName])

    useEffect(() => {
        setIsValid(prevState => ({
            ...prevState,
            email: EMAIL_REGEX.test(formData.email)
        }))
    }, [formData.email])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError({ displayName: false, email: false })
        isValid.password ? setFormErrors(prevState => ({ ...prevState, password: false })) : setFormErrors(prevState => ({ ...prevState, password: true }))
        isValid.confirmPassword ? setFormErrors(prevState => ({ ...prevState, confirmPassword: false })) : setFormErrors(prevState => ({ ...prevState, confirmPassword: true }))
        isValid.displayName ? setFormErrors(prevState => ({ ...prevState, displayName: false })) : setFormErrors(prevState => ({ ...prevState, displayName: true }))
        isValid.email ? setFormErrors(prevState => ({ ...prevState, email: false })) : setFormErrors(prevState => ({ ...prevState, email: true }))

        const canSave = Object.values(isValid).every(Boolean)

        if (canSave) {
            if (formData.password === "") {
                const userData = {
                    id,
                    displayName: formData.displayName,
                    email: formData.email
                }
                await updateUser(userData)
            } else {
                const userData = {
                    id,
                    displayName: formData.displayName,
                    email: formData.email,
                    password: formData.password
                }
                await updateUser(userData)
            }
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setFormData({
                displayName: displayName,
                email: email,
                password: "",
                confirmPassword: ""
            })
            navigate("/dash")
        }
    }, [isSuccess, navigate])

    useEffect(() => {
        if (isError) {
            if (error.data.message === "Duplicate email") {
                setServerError(prevState => ({ ...prevState, email: true }))
            }
            if (error.data.message === "Duplicate display name") {
                setServerError(prevState => ({ ...prevState, displayName: true }))
            }
        }
    }, [isError, navigate])

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="w-full mt-10 flex flex-col gap-8 bg-zinc-200 border-2 border-zinc-500 p-8 rounded-lg sm:w-auto">
                <h1 className="font-semibold text-2xl">Edit Profile</h1>
                <div className="grid grid-cols-2 items-center">
                    <p>Username</p>
                    <p className="ml-2">{username}</p>
                </div>
                <label htmlFor="displayName" className="grid grid-cols-1 items-center sm:grid-cols-2">
                    <p>Display Name</p>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange}
                        className={`py-1 px-2 rounded-lg ${formErrors.displayName || serverError.displayName ? "border-red-400" : "border-zinc-500"} border-2`}
                    />
                    <div className="justify-self-end">
                        {formErrors.displayName && <p className="absolute text-sm mt-0.5 text-brightRed text-end">Must be between 3-16 characters</p>}
                        {serverError.displayName && <p className="absolute text-sm mt-0.5 text-brightRed text-end">This display name is already in use.</p>}
                    </div>
                </label>
                <label htmlFor="email" className="grid grid-cols-1 items-center sm:grid-cols-2">
                    <p>Email Address</p>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        className={`py-1 px-2 rounded-lg ${formErrors.email || serverError.email ? "border-red-400" : "border-zinc-500"} border-2 sm:w-72`}
                    />
                    <div className="justify-self-end">
                        {formErrors.email && <p className="absolute text-sm mt-0.5 text-brightRed text-end">Invalid email</p>}
                        {serverError.email && <p className="absolute text-sm mt-0.5 text-brightRed text-end">This email is already in use.</p>}
                    </div>
                </label>
                <label htmlFor="displayName" className="grid grid-cols-1 items-center sm:grid-cols-2">
                    <p>Change Password</p>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`py-1 px-2 rounded-lg ${formErrors.password ? "border-red-400" : "border-zinc-500"} border-2`}
                    />
                    <div className="justify-self-end">
                        {formErrors.password && <p className="absolute text-sm mt-0.5 text-brightRed text-end">Must be at least 6 characters</p>}
                    </div>
                </label>
                <label htmlFor="displayName" className="grid grid-cols-1 items-center sm:grid-cols-2">
                    <p>Confirm Change Password</p>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`py-1 px-2 rounded-lg ${formErrors.confirmPassword ? "border-red-400" : "border-zinc-500"} border-2`}
                    />
                    <div className="justify-self-end">
                        {formErrors.confirmPassword && <p className="absolute text-sm mt-0.5 text-brightRed text-end">Passwords need to match</p>}
                    </div>
                </label>
                <button className="w-40 bg-slate-500 text-white p-3 text-base rounded-lg mt-2">Submit</button>
            </form>
        </div>
    )
}

export default EditProfile