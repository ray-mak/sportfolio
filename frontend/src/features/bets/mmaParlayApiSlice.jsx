import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const mmaParlayAdapter = createEntityAdapter({})
const initialState = mmaParlayAdapter.getInitialState()

const mmaParlayApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMMAParlays: builder.query({
            query: () => '/api/mmaparlays',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedMMAParlays = responseData.map(bet => {
                    bet.id = bet._id
                    return bet
                });
                return mmaParlayAdapter.setAll(initialState, loadedMMAParlays)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'mmaParlay', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'mmaParlay', id }))
                    ]
                } else return [{ type: 'mmaParlay', id: 'LIST' }]
            }
        }),
        addNewMMAParlay: builder.mutation({
            query: initialData => ({
                url: "/api/mmaparlays",
                method: "POST",
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: [
                { type: "mmaParlay", id: "LIST" }
            ]
        }),
        updateMMAParlay: builder.mutation({
            query: initialData => ({
                url: "/api/mmaparlays",
                method: "PATCH",
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "mmaParlay", id: "LIST" }
            ]
        })
    })
})

export const {
    useGetMMAParlaysQuery,
    useAddNewMMAParlayMutation,
    useUpdateMMAParlayMutation
} = mmaParlayApiSlice