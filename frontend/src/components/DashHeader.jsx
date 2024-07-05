import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"
import { logOut } from "../features/auth/authSlice"


const DashHeader = () => {
    const navigate = useNavigate()
    const { role } = useAuth()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        console.log("isSuccess changed")
        if (isSuccess) {
            navigate('/login')
        }
    }, [isSuccess, navigate])

    // if (isLoading) return <p>Logging out...</p>
    // if (isError) return <p>Error {error.data?.message}</p>

    const logout = () => {
        sendLogout()
        navigate('/login')
    }

    const [hamburgerMenu, setHamburgerMenu] = useState(false)

    function toggleHamburger() {
        setHamburgerMenu(prevState => !prevState)
    }

    function closeHamburgerMenu() {
        setHamburgerMenu(false)
    }

    return (
        <div className="w-full bg-white flex justify-center navbar">
            <div className="w-full flex p-4 xl:w-4/5">
                <Link to="/dash">
                    <img className="w-60 lg:w-80" src="/logo.png" alt="logo" />
                </Link>
                <div onClick={toggleHamburger} className={`hamburger ${hamburgerMenu ? "opened" : ""}`}>
                    <span className="bar bg-darkGray"></span>
                    <span className="bar bg-darkGray"></span>
                    <span className="bar bg-darkGray"></span>
                </div>
                <div className={`dimmer ${hamburgerMenu ? "opened" : ""}`}></div>
                {/* Navigation links container */}
                <div className={`nav-menu flex items-center ml-auto gap-4 font-semibold md:font-normal lg:gap-6 lg:text-base ${hamburgerMenu ? "opened" : ""}`}>
                    <Link to="/dash" onClick={closeHamburgerMenu}>Home</Link>
                    {role === "Admin" && <Link to="/editmmaevent" onClick={closeHamburgerMenu}>Add Event</Link>}
                    {role === "Admin" && < Link to="/mmaresults" onAbort={closeHamburgerMenu}>Event Results</Link>}
                    <Link to="/mmaevents" onClick={closeHamburgerMenu}>Free Tips</Link>
                    <Link to="/leaderboard" onClick={closeHamburgerMenu}>Leaderboard</Link>
                    <Link to="/dash/addpick" onClick={closeHamburgerMenu}>Add Picks</Link>
                    <Link to="/dash/editprofile" onClick={closeHamburgerMenu}>Settings</Link>
                    <button onClick={logout} className="border-2 px-4 py-2 rounded-lg self-center">Logout</button>
                </div>
            </div>

        </div >
    )
}

export default DashHeader