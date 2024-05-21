import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

//This contains methods like addOne, addAll, updateOne
const usersAdapter = createEntityAdapter({})

//initializes the state for users using the adapter
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    //this is used to specify how to fetch users from the server
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/api/usermlstats',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            //We transform the data since MongoDB uses _id, then we set all users in the adapter's state
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            //provides tags that are associated with result. Helps with caching and invalidation.
            providesTags: (result, error, arg) => {
                //this handles results withhout ids (usually some sort of error has occurred)
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({  //mutuation since we are changing data
            query: initialUserData => ({
                url: '/api/users',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [  //forces cache to update, user list will be invalidated.
                { type: 'User', id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/api/users',
                method: "PATCH",
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: "/api/users",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id }
            ]
        })
    }),
})

export const {
    useGetUsersQuery,  //used in Leaderboard
    useAddNewUserMutation,  //used in NewUserForm
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice


// returns the query result object (allows us to access the result of getUsers)
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector. Memoization ensures that the selector only recalculates its results when its input changes. This will be used in the next part
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring (rename selectAll to selectAllUsers)
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)