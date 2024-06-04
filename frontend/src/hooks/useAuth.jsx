import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from "jwt-decode"


const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, role, id, displayName, email } = decoded.UserInfo //UserInfo is defined in authController

        isAdmin = role.includes("Admin")
        if (isAdmin) status = "Admin"

        return { username, role, status, isAdmin, id, displayName, email }
    }

    return { username: "", role: "", isAdmin, status }
}

export default useAuth