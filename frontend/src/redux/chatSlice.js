import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
      name: "chat",
      initialState: {
            onlineUsers: [],
            messages: []
      },
      reducers: {
            //actions
            setOnlineUsers: (state, action) => {
                  state.onlineUsers = action.payload
            },
            setMessages: (state, action) => {
                  state.messages = action.payload
<<<<<<< HEAD
            }
      }
})
export const { setOnlineUsers, setMessages } = chatSlice.actions
=======
            },
            addNewMessage: (state, action) => {
                  const messageExists = state.messages.some(msg => msg._id === action.payload._id);
                  if (!messageExists) {
                        state.messages.push(action.payload);
                  }
            }
      }
})
export const { setOnlineUsers, setMessages, addNewMessage } = chatSlice.actions
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
export default chatSlice.reducer