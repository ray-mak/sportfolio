import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import BetsList from "./features/bets/BetsList"
import Leaderboard from "./features/users/Leaderboard"
import AddPick from "./features/bets/AddPick"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import UserProfile from "./features/users/UserProfile"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}> {/* This is the parent route of everything */}
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<NewUserForm />} />
        <Route path=":id" element={<UserProfile />} />
        <Route path="leaderboard">
          <Route index element={<Leaderboard />} />
        </Route>

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<Welcome />} />

              <Route path="addpick">
                <Route index element={<AddPick />} />
              </Route>

            </Route>    {/* End Dash */}
          </Route>
        </Route>
        {/* end protected routes */}

      </Route>
    </Routes>
  )
}

export default App
