import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import PublicHeader from "./PublicHeader"
import useAuth from "../hooks/useAuth"

//renders children of the Outlet component. This is our parent component. Upside of having a Layout component is if we decide to add a banner or footer across the application that we can show across public and private pages, we can do it here.
const Layout = ({ roles }) => {
  const { role } = useAuth()

  return (
    <>
      {roles.includes(role) ? <DashHeader /> : <PublicHeader />}
      <div className="pt-20 md:pt-0">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
