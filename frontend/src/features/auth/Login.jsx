import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [errMsg, setErrMsg] = useState("")
    const [persist, setPersist] = usePersist()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading, isError, error }] = useLoginMutation()


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            //Will get accessToken back after we call the login mutation, await result, call unwrap since we're not using error state (isError) and instead are using a try catch block
            const { accessToken } = await login({ username: formData.username, password: formData.password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setFormData({ username: "", password: "" })
            navigate("/dash")
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
        }
    }

    const handleToggle = () => setPersist(prev => !prev)

    if (isLoading) return <p>Loading...</p>

    // if (isError) return (
    //     <p>{error?.data?.message}</p>
    // )

    if (isError) {
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 mt-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-semibold text-center">Log in</h1>
                <div className="w-full flex justify-center mb-2">
                    <p className="absolute text-brightRed">{error?.data?.message}</p>
                </div>
                <label htmlFor="username" className="flex flex-col gap-1 mb-2">
                    <p>Username</p>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                        required
                    />
                </label>
                <label htmlFor="username" className="flex flex-col gap-1 mb-2">
                    <p>Password</p>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                        required
                    />
                </label>
                <div className="text-sm text-center">
                    <button className="w-full bg-brightRed text-white p-3 text-base rounded-lg mt-2">Log In</button>
                    <p className="mt-2">Don't have an account?
                        <Link to="/register" className="underline text-blue-600 ml-1">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 mt-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-semibold text-center">Log in</h1>
                <div className="w-full flex justify-center mb-2">
                    <p className="absolute text-brightRed">{error?.data?.message}</p>
                </div>
                <label htmlFor="username" className="flex flex-col gap-1 mb-2">
                    <p>Username</p>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                        required
                    />
                </label>
                <label htmlFor="username" className="flex flex-col gap-1 mb-2">
                    <p>Password</p>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="py-2 px-4 rounded-lg border-lightGray border-2"
                        required
                    />
                </label>
                {/* <label htmlFor="persist">
                    <input type="checkbox" id="persist" onChange={handleToggle} checked={persist} />
                    Trust this device
                </label> */}

                <div className="text-sm text-center">
                    <button className="w-full bg-brightRed text-white p-3 text-base rounded-lg mt-2">Log In</button>
                    <p className="mt-2">Don't have an account?
                        <Link to="/register" className="underline text-blue-600 ml-1">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login