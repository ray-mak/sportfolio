import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import BetsList from "./features/bets/BetsList"
import UsersList from "./features/users/UsersList"
import AddPick from "./features/bets/AddPick"


function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}> {/* This is the parent route of everything */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          {/* This is currently in the protected area, but does not have to be. Just going along with tutorial */}
          <Route path="addpick">
            <Route index element={<AddPick />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>

        </Route>    {/* End Dash */}

      </Route>
    </Routes>
  )
}

export default App