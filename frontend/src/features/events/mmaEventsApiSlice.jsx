import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const mmaEventsAdapter = createEntityAdapter({})
const initialState = mmaEventsAdapter.getInitialState()

export const mmaEventsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMMAEvents: builder.query({
            query: () => '/api/mmaevents',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedEvents = responseData.map(event => {
                    event.id = event._id
                    return event
                });
                return mmaEventsAdapter.setAll(initialState, loadedEvents)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'MMAEvent', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'MMAEvent', id }))
                    ]
                } else return [{ type: 'MMAEvent', id: 'LIST' }]
            }
        }),
        addNewMMAEvent: builder.mutation({
            query: initialUserData => ({
                url: '/api/mmaevents',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'MMAEvent', id: "LIST" }
            ]
        }),
        updateMMAEvent: builder.mutation({
            query: initialUserData => ({
                url: '/api/mmaevents',
                method: "PATCH",
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MMAEvent", id: arg.id }
            ]
        }),
        deleteMMAEvent: builder.mutation({
            query: ({ id }) => ({
                url: "/api/mmaevents",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MMAEvent", id: arg.id }
            ]
        })
    })
})

export const {
    useGetMMAEventsQuery,
    useAddNewMMAEventMutation,
    useUpdateMMAEventMutation,
    useDeleteMMAEventMutation
} = mmaEventsApiSlice

export const selectMMAEventsResult = mmaEventsApiSlice.endpoints.getMMAEvents.select()

const selectMMAEventsData = createSelector(
    selectMMAEventsResult,
    mmaEventsResult => mmaEventsResult.data
)

export const {
    selectAll: selectAllMMAEvents,
    selectById: selectMMAEventById,
    selectIds: selectMMAEventIds
} = mmaEventsAdapter.getSelectors(state => selectMMAEventsData(state) ?? initialState)