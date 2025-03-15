import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import ProtectedRoutes from './components/ProtectedRoutes'
import Signup from './components/Signup'
import AdminDashboard from './pages/Dashboard'
import AdminPosts from './pages/Posts'
import AdminUsers from './pages/Users'
import Admin from './pages/admin'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import { setSocket } from './redux/socketSlice'
import SearchUsers from './components/SearchUsers'
import Explore from './components/Explore'
import SuggestedUsers from './components/SuggestedUsers'
import AIAssistant from './components/AskAI'

const browserRouter = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedRoutes> <MainLayout /></ProtectedRoutes>,
		children: [
			{
				path: "/",
				element: <ProtectedRoutes> <Home /></ProtectedRoutes>
			},
			{
				path: "/profile/:id",
				element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
			},
			{
				path: "/account/edit",
				element: <ProtectedRoutes> <EditProfile /></ProtectedRoutes>
			},
			{
				path: "/chat",
				element: <ProtectedRoutes> <ChatPage /></ProtectedRoutes>
			},
			{
				path: "/admin",
				element: <ProtectedRoutes> <Admin /></ProtectedRoutes>
			},
			{
				path: "/admin/dashboard",
				element: <ProtectedRoutes> <AdminDashboard /></ProtectedRoutes>
			},
			{
				path: "/admin/posts",
				element: <ProtectedRoutes> <AdminPosts /></ProtectedRoutes>
			},
			{
				path: "/admin/users",
				element: <ProtectedRoutes> <AdminUsers /></ProtectedRoutes>
			},
			{
				path: "/search",
				element: <ProtectedRoutes><SearchUsers /></ProtectedRoutes>
			},
			{
				path: "/explore",
				element: <ProtectedRoutes><Explore /></ProtectedRoutes>
			},
			{
				path: "/suggested/:type",
				element: <ProtectedRoutes><SuggestedUsers /></ProtectedRoutes>
			},
			{
				path: "/ai-assistant",
				element: <ProtectedRoutes><AIAssistant /></ProtectedRoutes>
			  }
			  

		]
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
])
function App() {
	const { user } = useSelector(store => store.auth)
	const { socket } = useSelector(store => store.socketio)
	const dispatch = useDispatch()

	useEffect(() => {
		if (user) {
			const socketio = io(import.meta.env.VITE_BACKEND_URL, {
				query: {
					userId: user?._id
				},
				transports: ['websocket']
			})
			dispatch(setSocket(socketio))

			// listen all the events
			socketio.on('getOnlineUsers', (onlineUsers) => {
				dispatch(setOnlineUsers(onlineUsers))
			})

			socketio.on('notification', (notification) => {
				dispatch(setLikeNotification(notification))
			})

			return () => {
				socketio.close()
				dispatch(setSocket(null))
			}
		} else {
			socket?.close()
			dispatch(setSocket(null))
		}
	}, [user, dispatch])
	return (
		<>
			<RouterProvider router={browserRouter} />
		</>
	)
}


export default App
