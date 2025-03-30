import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
	name: "realTimeNotification",
	initialState: {
		actionNotification: [],
	},
	reducers: {
		setActionNotification: (state, action) => {
            state.actionNotification = action.payload
        },
		addNewNotification: (state, action) => {
            state.actionNotification = [action.payload, ...state.actionNotification]
        }
	}
})
export const { setActionNotification, addNewNotification } = rtnSlice.actions
export default rtnSlice.reducer