import { Link } from "react-router-dom"
import { useState } from "react"


const DashHeader = () => {
    const [hamburgerMenu, setHamburgerMenu] = useState(false)

    function toggleHamburger() {
        setHamburgerMenu(prevState => !prevState)
    }

    return (
        <div className="w-full bg-white flex justify-center">
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
                    <Link to="/dash">Home</Link>
                    <a>Free Tips</a>
                    <a>Leaderboard</a>
                    <a>Add Picks</a>
                    <a>Settings</a>
                    <button className="border-2 px-4 py-2 rounded-lg self-center">Logout</button>
                </div>
            </div>

        </div>
    )
}

export default DashHeader