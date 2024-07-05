import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const fightersAdapter = createEntityAdapter({})
const initialState = fightersAdapter.getInitialState()

export const fightersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFighters: builder.query({
            query: () => '/api/fighters',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedFighters = responseData.map(fighter => {
                    fighter.id = fighter._id
                    return fighter
                });
                return fightersAdapter.setAll(initialState, loadedFighters)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Fighter', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Fighter', id }))
                    ]
                } else return [{ type: 'Fighter', id: 'LIST' }]
            }
        }),
        addNewFighter: builder.mutation({
            query: initialFighterData => ({
                url: '/api/fighters',
                method: 'POST',
                body: {
                    ...initialFighterData
                }
            }),
            invalidatesTags: [
                { type: 'Fighter', id: "LIST" }
            ]
        }),
        updateFighter: builder.mutation({
            query: initialFighterData => ({
                url: '/api/fighters',
                method: "PATCH",
                body: {
                    ...initialFighterData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Fighter", id: arg.id }
            ]
        }),
        deleteFighter: builder.mutation({
            query: ({ id }) => ({
                url: "/api/fighters",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Fighter", id: arg.id }
            ]
        })
    })
})

export const {
    useGetFightersQuery,
    useAddNewFighterMutation,
    useUpdateFighterMutation,
    useDeleteFighterMutation
} = fightersApiSlice