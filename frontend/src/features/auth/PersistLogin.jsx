//remain logged in even after refreshing application.

import { Outlet, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"


const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }
            if (!token && persist) verifyRefreshToken()
        }
        return () => effectRan.current = true
        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <div className="flex justify-center mt-12">
                <div className="flex flex-col gap-4 p-8 rounded-lg shadow-xl">
                    <p className="text-center text-xl font-semibold">
                        {error.data?.message}
                    </p>
                    <p>You must be logged in to view this page</p>
                    <div className="flex flex-col">
                        <Link to="/login" className="w-full text-white rounded-lg bg-brightRed p-2 text-center">
                            Login
                        </Link>
                        <p className="text-sm mt-1 text-center">
                            Don't have an account?
                            <Link to="/register" className="underline text-blue-600 ml-1">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}

export default PersistLogin