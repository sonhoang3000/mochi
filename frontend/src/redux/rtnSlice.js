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
		addActionNotification: (state, action) => {
            state.actionNotification = [...state.actionNotification, action.payload];
        }
	}
})
export const { setActionNotification, addActionNotification } = rtnSlice.actions
export default rtnSlice.reducer