import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const PublicHeader = () => {
    const [hamburgerMenu, setHamburgerMenu] = useState(false)

    function toggleHamburger() {
        setHamburgerMenu(prevState => !prevState)
    }

    function closeHamburgerMenu() {
        setHamburgerMenu(false)
    }

    return (
        <div className="w-full bg-white flex justify-center border-b-2 border-b-neutral-100 navbar">
            <div className="w-full flex p-4 xl:w-4/5">
                <Link to="/">
                    <img className="w-60 lg:w-80" src="/logo.png" alt="logo" />
                </Link>
                <div onClick={toggleHamburger} className={`hamburger ${hamburgerMenu ? "opened" : ""}`}>
                    <span className="bar bg-darkGray"></span>
                    <span className="bar bg-darkGray"></span>
                    <span className="bar bg-darkGray"></span>
                </div>
                <div className={`dimmer ${hamburgerMenu ? "opened" : ""}`}></div>
                <div className={`nav-menu flex items-center ml-auto gap-4 font-semibold md:font-normal lg:gap-6 lg:text-base ${hamburgerMenu ? "opened" : ""}`}>
                    <Link to="/" onClick={closeHamburgerMenu}>Home</Link>
                    <Link to="/mmaevents" onClick={closeHamburgerMenu}>Free Tips</Link>
                    <Link to="/leaderboard" onClick={closeHamburgerMenu}>Leaderboard</Link>
                    <Link to="/login" onClick={closeHamburgerMenu} className="border-2 px-4 py-2 rounded-lg self-center">Login</Link>
                    <Link to="/register" onClick={closeHamburgerMenu} className="border-2 border-slate-500 bg-slate-500 text-white px-4 py-2 rounded-lg self-center">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default PublicHeader