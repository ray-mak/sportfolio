//This is the public facing page (landing page)
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"


const Public = () => {
    return (
        <main className="flex flex-col justify-center items-center">
            <section className="flex flex-col-reverse md:flex-row xl:w-4/5 2xl:w-2/3 mt-4 gap-2 md:gap-8">
                <div className="flex flex-col w-full p-8 2xl:w-1/2 justify-center gap-6 xl:gap-8">
                    <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">The Ultimate Sports Betting Tracking App</h1>
                    <p className="text-lg xl:text-xl font-medium">Track your betting history, analyze your performance, and refine your strategy. Tail winning bettors with third party verified picks!</p>
                    <div className="flex flex-row gap-8 justify-center md:justify-start">
                        <Link to="/mmaevents" className="flex px-4 py-2 items-center border-2 rounded-lg">Free Picks</Link>
                        <Link to="/login" className="flex px-4 py-2 items-center bg-brightRed text-white rounded-lg">Start Tracking</Link>
                    </div>
                </div>
                <div className="w-full 2xl:w-1/2 p-8 m-auto">
                    <img className="w-full rounded-xl object-cover" src="/hero_img.png" />
                </div>
            </section>
            <section className="w-full flex flex-col justify-center items-center gap-2 p-4 bg-slate-500 text-white md:flex-row md:gap-10">
                <div className="flex gap-1 items-center">
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#FFD43B", }} />
                    <p>Track moneyline picks, props, and parlays</p>
                </div>
                <div className="flex gap-1 items-center">
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#FFD43B", }} />
                    <p>View detailed stats on bet types</p>
                </div>
                <div className="flex gap-1 items-center">
                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#FFD43B", }} />
                    <p>Follow other users and tail their bets</p>
                </div>
            </section>
            <section className="w-full flex items-center justify-center bg-slate-800 md:justify-between">
                <div className="hidden md:block">
                    <img src="/icon3.png" />
                </div>
                <div className="flex flex-col gap-4 w-2/3 p-6 md:w-1/2 xl:w-1/4">
                    <p className="text-white text-2xl font-semibold">Sign Up Now</p>
                    <p className="text-white">Access advanced stats, top EV bets, and follow top sports bettors for free!</p>
                    <Link to="/register" className="w-40 flex px-4 py-2 items-center justify-center border-2 border-white text-white rounded-lg hover:bg-white hover:text-slate-800">Sign Up</Link>
                </div>
                <div className="hidden md:block">
                    <img src="/icon4.png" />
                </div>
            </section>
        </main>
    )
}

export default Public