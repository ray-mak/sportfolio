import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const mmaResultsAdapter = createEntityAdapter({})
const initialState = mmaResultsAdapter.getInitialState()

export const mmaResultsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMMAResults: builder.query({
            query: () => '/api/eventresults',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedEvents = responseData.map(event => {
                    event.id = event._id
                    return event
                });
                return mmaResultsAdapter.setAll(initialState, loadedEvents)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'MMAResults', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'MMAResults', id }))
                    ]
                } else return [{ type: 'MMAResults', id: 'LIST' }]
            }
        }),
        addNewMMAResult: builder.mutation({
            query: initialUserData => ({
                url: '/api/eventresults',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'MMAResults', id: "LIST" }
            ]
        }),
        updateMMAResult: builder.mutation({
            query: initialUserData => ({
                url: '/api/eventresults',
                method: "PATCH",
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MMAResults", id: arg.id }
            ]
        }),
        deleteMMAResult: builder.mutation({
            query: ({ id }) => ({
                url: "/api/eventresults",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MMAResults", id: arg.id }
            ]
        })
    })
})

export const {
    useGetMMAResultsQuery,
    useAddNewMMAResultMutation,
    useUpdateMMAResultMutation,
    useDeleteMMAResultMutation
} = mmaResultsApiSlice

export const selectMMAResultsResult = mmaResultsApiSlice.endpoints.getMMAResults.select()

const selectMMAResultsData = createSelector(
    selectMMAResultsResult,
    mmaResults => mmaResults.data
)

export const {
    selectAll: selectAllMMAResults,
    selectById: selectMMAResultById,
    selectIds: selectMMAResultIds
} = mmaResultsAdapter.getSelectors(state => selectMMAResultsData(state) ?? initialState)

