import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const userEventsResultAdapter = createEntityAdapter({})
const initialState = userEventsResultAdapter.getInitialState()

const userMMAEventsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserResults: builder.query({
            query: ({ id }) => ({
                url: "/api/userprofilestats",
                method: "POST",
                body: { id }
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'UserMMAEvents', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'UserMMAEvents', id }))
                    ]
                } else return [{ type: 'UserMMAEvents', id: 'LIST' }]
            }
        })
    })
})

export const { useGetUserResultsQuery } = userMMAEventsApiSlice