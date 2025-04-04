import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client'
import AIAssistant from './components/AskAI'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Explore from './components/Explore'
<<<<<<< HEAD
import FakeNewsChecker from './components/FakeNewsChecker.'
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import ProtectedRoutes from './components/ProtectedRoutes'
import SearchUsers from './components/SearchUsers'
import Signup from './components/Signup'
<<<<<<< HEAD
import Story from './components/Story'
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
import SuggestedUsers from './components/SuggestedUsers'
import AdminDashboard from './pages/Dashboard'
import AdminPosts from './pages/Posts'
import AdminUsers from './pages/Users'
import Admin from './pages/admin'
import { setOnlineUsers } from './redux/chatSlice'
<<<<<<< HEAD
import { addActionNotification } from './redux/rtnSlice'
=======
import { addNewNotification } from './redux/rtnSlice'
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
import { setSocket } from './redux/socketSlice'

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
<<<<<<< HEAD
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
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
<<<<<<< HEAD
			  },
			  {
				path: "/fakenew",
				element: <ProtectedRoutes><FakeNewsChecker /></ProtectedRoutes>
			  },
			  {
				path: "/story",
				element: <ProtectedRoutes><Story/></ProtectedRoutes>
			  }
			  
=======
			}
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea

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
<<<<<<< HEAD
=======
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
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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

<<<<<<< HEAD
			// listen all the events
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
			socketio.on('getOnlineUsers', (onlineUsers) => {
				dispatch(setOnlineUsers(onlineUsers))
			})

			socketio.on('notification', (notification) => {
<<<<<<< HEAD
				dispatch(addActionNotification(notification))
=======
				dispatch(addNewNotification(notification))
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
