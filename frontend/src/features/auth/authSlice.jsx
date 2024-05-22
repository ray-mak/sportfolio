import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null }, //token is null because we will be getting a token back from our api
    reducers: {
        //after we get some data back from the api, we are going to have a payload, and that contains the accessToken
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            //we set the state to the accessToken
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

//this gets exported because we have to add it to the store
export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token