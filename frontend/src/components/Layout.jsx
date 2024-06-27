import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"

//renders children of the Outlet component. This is our parent component. Upside of having a Layout component is if we decide to add a banner or footer across the application that we can show across public and private pages, we can do it here.
const Layout = () => {
  return (
    <>
      <DashHeader />
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default Layout

//exported ap App.jsx