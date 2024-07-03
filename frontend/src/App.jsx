import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import BetsList from "./features/bets/BetsList"
import Leaderboard from "./features/users/Leaderboard"
import AddMMAPick from "./features/bets/AddMMAPick"
import MMAEventsList from "./features/events/MMAEventsList"
import EditMMAEvent from "./features/events/EditMMAEvent"
import NewMMAEvent from "./features/events/NewMMAEventForm"
import EditUser from "./features/users/EditProfile"
import NewUserForm from "./features/users/NewUserForm"
import UserProfile from "./features/users/UserProfile"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"
import NewMMAResult from "./features/events/NewMMAResult"
import MMAResultsList from "./features/events/MMAResultsList"
import EditMMAResult from "./features/events/EditMMAResult"
import EditProfile from "./features/users/EditProfile"
import ViewMMAEvents from "./features/events/ViewMMAEvents"
import EventSummary from "./features/events/EventSummary"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout roles={[...Object.values(ROLES)]} />} > {/* This is the parent route of everything */}
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<NewUserForm />} />
        <Route path=":id" element={<UserProfile />} />

        <Route path="leaderboard" element={<Leaderboard />} />

        <Route path="mmaevents" >
          <Route index element={<ViewMMAEvents />} />
          <Route path=":id" element={<EventSummary />} />
        </Route>

        <Route path="editmmaevent">
          <Route index element={<MMAEventsList />} />
          <Route path=":id" element={<EditMMAEvent />} />
          <Route path="newmmaevent" element={<NewMMAEvent />} />
        </Route>

        <Route path="mmaresults">
          <Route index element={<MMAResultsList />} />
          <Route path=":id" element={<EditMMAResult />} />
          <Route path="newmmaresult" element={<NewMMAResult />} />
        </Route>

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<Welcome />} />

              <Route path="addpick">
                <Route index element={<AddMMAPick />} />
              </Route>

              <Route path="editprofile" element={<EditProfile />} />

            </Route>    {/* End Dash */}
          </Route>
        </Route>
        {/* end protected routes */}

      </Route>
    </Routes>
  )
}

export default App
