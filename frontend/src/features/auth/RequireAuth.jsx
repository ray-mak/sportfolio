import { Outlet, Navigate, useLocation } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

//This component is a wrapper, which is why it returns an Outlet. Otherwise, it sends the user to the login page
const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { role } = useAuth()

    return (
        allowedRoles.includes(role)
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default RequireAuth