import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const mmaPropAdapter = createEntityAdapter({})
const initialState = mmaPropAdapter.getInitialState()

export const mmaPropApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMMAPropBets: builder.query({
            query: () => '/api/mmapropbets',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedMMAPropBets = responseData.map(bet => {
                    bet.id = bet._id
                    return bet
                });
                return mmaPropAdapter.setAll(initialState, loadedMMAPropBets)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'mmaPropBet', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'mmaPropBet', id }))
                    ]
                } else return [{ type: 'mmaPropBet', id: 'LIST' }]
            }
        }),
        addNewMMAPropBet: builder.mutation({
            query: initialData => ({
                url: "/api/mmapropbets",
                method: "POST",
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: [
                { type: "mmaPropBet", id: "LIST" }
            ]
        }),
        updateMMAPropBet: builder.mutation({
            query: initialData => ({
                url: "/api/mmapropbets",
                method: "PATCH",
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "mmaPropBet", id: "LIST" }
            ]
        })
    })
})

export const {
    useAddNewMMAPropBetMutation,
    useGetMMAPropBetsQuery,
    useUpdateMMAPropBetMutation
} = mmaPropApiSlice