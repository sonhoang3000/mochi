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
<<<<<<< HEAD
		addActionNotification: (state, action) => {
            state.actionNotification = [...state.actionNotification, action.payload];
        }
	}
})
export const { setActionNotification, addActionNotification } = rtnSlice.actions
=======
		addNewNotification: (state, action) => {
            state.actionNotification = [action.payload, ...state.actionNotification]
        }
	}
})
export const { setActionNotification, addNewNotification } = rtnSlice.actions
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
export default rtnSlice.reducer