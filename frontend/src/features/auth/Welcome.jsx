import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Welcome = () => {
    const navigate = useNavigate()

    return (
        <div className="w-full flex justify-center">
            <div className="w-4/5 flex flex-col gap-6 justify-center p-8 border-2 border-gray rounded-lg lg:w-3/5 2xl:w-1/2">
                <p className="text-xl text-center">You do not have any upcoming picks</p>
                <button onClick={() => navigate("/dash/addpick")} type="button" className="w-full bg-brightRed text-white h-10 font-medium rounded-md">Add pick</button>
            </div>
        </div>
    )
}

export default Welcome