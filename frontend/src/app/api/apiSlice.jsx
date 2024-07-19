import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://sportfolio-api.onrender.com/',
    //include credentials so that we will always send the cookie that contains the refresh token
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

//query wrapper. Args is like the arguments we pass into fetchBaseQuery (url, credentials, etc), api object is different, exraOptions is not used, but we still pass it in.
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    //the result we get from the first request above. We use the access token as defined above.
    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        //data will contain the access token
        if (refreshResult?.data) {

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. "
            }
            return refreshResult
        }
    }

    return result
}

//This is used for making API requests in Redux applications. endpoints is empty because we will provide extended slices that will attach to this
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["mmaMLBet", "User", "MMAEvent"],
    endpoints: builder => ({})
})