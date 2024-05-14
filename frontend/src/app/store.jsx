import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"

//store is the single source of truth (this is where the state lives). Actions are objects that show the intention to change state. Reducers are specified to define how state changes in response to actions
//getDefaultMiddleware allows us to use default middleware like thunk
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})