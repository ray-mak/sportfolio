import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

//This is used for making API requests in Redux applications. endpoints is empty because we will provide extended slices that will attach to this
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500/' }),
    tagTypes: ["MMAMLBet", "User"],
    endpoints: builder => ({})
})