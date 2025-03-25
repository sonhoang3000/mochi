import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
	name: "realTimeNotification",
	initialState: {
		likeNotification: [],
		commentNotification: [],
	},
	reducers: {
		setLikeNotification: (state, action) => {
            state.likeNotification = action.payload
        },
        setCommentNotification: (state, action) => {
            state.commentNotification = action.payload
        }
	}
})
export const { setLikeNotification, setCommentNotification } = rtnSlice.actions
export default rtnSlice.reducer