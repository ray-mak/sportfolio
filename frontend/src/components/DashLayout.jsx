//Part of the dash when user has logged in
import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"

const DashLayout = () => {
    return (
        <>
            {/* Dash Header will be above every protected part of our site */}
            <DashHeader />
            <div>
                {/* Wrap outlet in div to provide different styles to our protected area */}
                <Outlet />
            </div>
        </>
    )
}

export default DashLayout