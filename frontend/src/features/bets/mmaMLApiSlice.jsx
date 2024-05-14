import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const mmaMLAdapter = createEntityAdapter({})

const initialState = mmaMLAdapter.getInitialState()

export const mmaMLApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMMAMLBets: builder.query({
            query: () => '/api/mmamlbets',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedMMAMLBets = responseData.map(bet => {
                    bet.id = bet._id
                    return bet
                });
                return mmaMLAdapter.setAll(initialState, loadedMMAMLBets)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'mmaMLBet', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'mmaMLBet', id }))
                    ]
                } else return [{ type: 'mmaMLBet', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetMMAMLBetsQuery,
} = mmaMLApiSlice

// returns the query result object
export const selectMMAMLBetsResult = mmaMLApiSlice.endpoints.getMMAMLBets.select()

// creates memoized selector
const selectMMAMLBetsData = createSelector(
    selectMMAMLBetsResult,
    betsResult => betsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllMMAMLBets,
    selectById: selectMMAMLBetById,
    selectIds: selectMMAMLBetIds
} = mmaMLAdapter.getSelectors(state => selectMMAMLBetsData(state) ?? initialState)
