import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		suggestedUsers: [],
		userProfile: null,
		selectedUser: null,
		getConversation: []
	},
	reducers: {
		//actions
		setAuthUser: (state, action) => {
			state.user = action.payload
		},
		setSuggestedUsers: (state, action) => {
			state.suggestedUsers = action.payload
		},
		setUserProfile: (state, action) => {
			state.userProfile = action.payload
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload
		},
		setGetConversation: (state, action) => {
			state.getConversation = action.payload
		},
	}
})
export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setGetConversation } = authSlice.actions
export default authSlice.reducer