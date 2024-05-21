import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[a-zA-Z0-9]{6,20}$/
const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{6,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DISPLAY_REGEX = /^[a-zA-Z0-9]{3,16}$/

const NewUserForm = () => {
    //addNewUser function can be called when we need it, not called automatically
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    //form data and validation
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        displayName: "",
        email: "",
        role: "User"
    })
    const [isValid, setIsValid] = useState({
        username: false,
        password: false,
        confirmPassword: false,
        displayName: false,
        email: false
    })
    const [formErrors, setFormErrors] = useState({
        username: false,
        password: false,
        confirmPassword: false,
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
        setIsValid(prevState => ({
            ...prevState,
            username: USER_REGEX.test(formData.username)
        }))
    }, [formData.username])

    useEffect(() => {
        setIsValid(prevState => ({
            ...prevState,
            password: PASSWORD_REGEX.test(formData.password)
        }))
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

    //navigate added as depency because we get warning
    useEffect(() => {
        if (isSuccess) {
            setFormData({
                username: "",
                password: "",
                confirmPassword: "",
                displayName: "",
                email: "",
                role: "User"
            })
            navigate("/dash")
        }
    }, [isSuccess, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        isValid.username ? setFormErrors(prevState => ({ ...prevState, username: false })) : setFormErrors(prevState => ({ ...prevState, username: true }))
        isValid.password ? setFormErrors(prevState => ({ ...prevState, password: false })) : setFormErrors(prevState => ({ ...prevState, password: true }))
        isValid.confirmPassword ? setFormErrors(prevState => ({ ...prevState, confirmPassword: false })) : setFormErrors(prevState => ({ ...prevState, confirmPassword: true }))
        isValid.displayName ? setFormErrors(prevState => ({ ...prevState, displayName: false })) : setFormErrors(prevState => ({ ...prevState, displayName: true }))
        isValid.email ? setFormErrors(prevState => ({ ...prevState, email: false })) : setFormErrors(prevState => ({ ...prevState, email: true }))

        const canSave = Object.values(isValid).every(Boolean) && !isLoading

        if (canSave) {
            const { confirmPassword, ...newUserData } = formData
            console.log("Success!")
            // await addNewUser(newUserData)
        } else {
            console.log("Incomplete!")
        }
    }
    console.log(isValid)

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 p-8 bg-white rounded-lg shadow-xl text-sm sm:text-base">
                <h1 className="text-2xl font-semibold sm:text-3xl">Create New Account</h1>
                <label htmlFor="username" className="flex flex-col gap-1 mb-2">
                    <p className="w-full flex flex-col sm:flex-row">
                        Username
                    </p>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={formData.username}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                    />
                    <div>
                        {formErrors.username && <span className="absolute text-brightRed">Must be between 6-20 characters</span>}
                    </div>
                </label>
                <label htmlFor="displayName" className="flex flex-col gap-1 mb-2">
                    <p>Display Name</p>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        onChange={handleChange}
                        value={formData.displayName}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                    />
                    <div>
                        {formErrors.displayName && <span className="absolute text-brightRed">Must be between 3-16 characters</span>}
                    </div>
                </label>
                <label htmlFor="password" className="flex flex-col gap-1 mb-2">
                    <p >Password</p>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={formData.password}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                    />
                    <div>
                        {formErrors.password && <span className="absolute text-brightRed">Must be at least 6 characters</span>}
                    </div>
                </label>
                <label htmlFor="confirmPassword" className="flex flex-col gap-1 mb-2">
                    <p>Confirm Password</p>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                    />
                    <div>
                        {formErrors.confirmPassword && <span className="absolute text-brightRed">Passwords need to match</span>}
                    </div>
                </label>
                <label htmlFor="email" className="flex flex-col gap-1 mb-2">
                    <p>Email</p>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={formData.email}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                    />
                    <div>
                        {formErrors.email && <span className="absolute text-brightRed">Invalid email</span>}
                    </div>
                </label>
                <button className="w-full bg-brightRed text-white p-3 text-base rounded-lg mt-2">Register</button>
            </form>
        </div>
    )
}

export default NewUserForm