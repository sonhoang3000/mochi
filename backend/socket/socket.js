import { Server } from "socket.io"
import express from "express"
import http from "http"
import dotenv from "dotenv"

const app = express()

const server = http.createServer(app)

dotenv.config({})

const io = new Server(server, {
	cors: {
		origin: process.env.URL,
		methods: ['GET', 'POST']
	}
})

<<<<<<< HEAD
const userSocketMap = {}  


export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];


=======
const userSocketMap = {}
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
io.on('connection', (socket) => {
	const userId = socket.handshake.query.userId
	if (userId) {
		userSocketMap[userId] = socket.id
<<<<<<< HEAD
		// console.log("connection + UserId :", userId, " SocketId :", socket.id)
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap))

<<<<<<< HEAD
	socket.on('disconnect', () => {
		if (userId) {
			// console.log("disconnect + UserId :", userId, " SocketId :", socket.id)
=======
	socket.on('sendMessage', (message) => {
		io.emit('receiveMessage', message);
	});

	socket.on('disconnect', () => {
		if (userId) {
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
			delete userSocketMap[userId]
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap))
	})
})

export { app, server, io }