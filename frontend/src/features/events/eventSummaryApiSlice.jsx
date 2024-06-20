import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const eventSummaryAdapter = createEntityAdapter({})
const initialState = eventSummaryAdapter.getInitialState()

export const eventSummaryApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllEvents: builder.query({
            query: () => '/api/eventsummary',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'eventSummary', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'eventSummary', id }))
                    ]
                } else return [{ type: 'eventSummary', id: 'LIST' }]
            }
        }),
        getSingleEvent: builder.mutation({
            query: initialUserData => ({
                url: '/api/eventsummary',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'eventSummary', id: "LIST" }
            ]
        })
    })
})

export const {
    useGetAllEventsQuery,
    useGetSingleEventMutation
} = eventSummaryApiSlice
