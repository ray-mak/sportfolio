import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from "jwt-decode"


const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, role, id } = decoded.UserInfo //UserInfo is defined in authController

        isAdmin = role.includes("Admin")
        if (isAdmin) status = "Admin"

        return { username, role, status, isAdmin }
    }

    return { username: "", role: "", isAdmin, status }
}

export default useAuth