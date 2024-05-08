import { Outlet } from "react-router-dom"

//renders children of the Outlet component. This is our parent component. Upside of having a Layout component is if we decide to add a banner or footer across the application that we can show across public and private pages, we can do it here.
const Layout = () => {
  return <Outlet />
}

export default Layout

//exported ap App.jsx