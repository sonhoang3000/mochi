import { setAuthUser, setGetConversation, setSelectedUser, setSuggestedUsers, setUserProfile } from '@/redux/authSlice'
import { setMessages, setOnlineUsers } from '@/redux/chatSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { setActionNotification } from '@/redux/rtnSlice'
import { setSocket } from '@/redux/socketSlice'
import { markAsRead } from "@/services/notificationService"
import { logoutUser } from '@/services/userService'
import { AlignJustify, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, ShieldAlert, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { FaRobot } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import Notification from './Notification'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const LeftSidebar = () => {
	const navigate = useNavigate()
	const { user } = useSelector(store => store.auth)
	const { actionNotification } = useSelector(store => store.realTimeNotification)
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)
	const [openNotification, setOpenNotification] = useState(false)
	const [showMore, setShowMore] = useState(false) // Toggle menu More

	const logoutHandler = async () => {
		try {
			const res = await logoutUser()
			if (res.success) {
				// Reset Redux State
				dispatch(setAuthUser(null))
				dispatch(setSuggestedUsers([]))
				dispatch(setUserProfile(null))
				dispatch(setSelectedUser(null))
				dispatch(setGetConversation([]))
				dispatch(setSelectedPost(null))
				dispatch(setPosts([]))
				dispatch(setOnlineUsers([]))
				dispatch(setMessages([]))
				dispatch(setActionNotification([]))
				dispatch(setSocket(null))

				navigate("/login")
				toast.success(res.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	const sidebarHandler = (textType) => {
		if (textType === "Logout") {
			logoutHandler();
		} else if (textType === "Create") {
			setOpen(true)
		} else if (textType === "Profile") {
			navigate(`/profile/${user?._id}`)
		} else if (textType === "Home") {
			navigate(`/`)
		} else if (textType === "Messages") {
			navigate(`/chat`)
		} else if (textType === "Search") {
			navigate(`/search`)
		} else if (textType === "Explore") {
			navigate(`/explore`)
		} else if (textType === "AI Assistant") {
			navigate(`/ai-assistant`)
		} else if (textType === "FakeNewsChecker") {
			navigate(`/fakenew`)
		} else if (textType === "More") {
			setShowMore(!showMore) // Toggle trạng thái More
		} else if (textType === "Notifications") {
			setOpenNotification(true)
		}
	}

	const sidebarItems = [
		{ icon: <Home />, text: "Home" },
		{ icon: <Search />, text: "Search" },
		{ icon: <TrendingUp />, text: "Explore" },
		{ icon: <MessageCircle />, text: "Messages" },
		{ icon: <Heart />, text: "Notifications" },
		{ icon: <PlusSquare />, text: "Create" },
		{
			icon: (
				<Avatar className="w-6 h-6">
					<AvatarImage src={user?.profilePicture} alt="Avatar" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			),
			text: "Profile"
		},
		{ icon: <AlignJustify />, text: "More" }, // More button
	]

	const moreItems = [
		{ icon: <FaRobot className="text-lg text-pink-500" />, text: "AI Assistant" },
		{ icon: <ShieldAlert className="text-blue-500" />, text: "FakeNewsChecker" },
		{ icon: <LogOut className="text-red-500" />, text: "Logout" },
	];
	

	const handleMarkAllAsRead = async () => {
		try {
			await Promise.all(actionNotification.map(notification => markAsRead(notification._id)));
			const updatedNotifications = actionNotification.map(notification => ({
				...notification,
				isRead: true
			}));
			dispatch(setActionNotification(updatedNotifications));
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	return (
			<div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
				<div className='flex flex-col'>
					<h1 className='my-2 pl-3 font-bold text-xl'>
						<img className='h-28 cursor-pointer' src="../../src/assets/mochi.png" alt="Mochi" onClick={() => navigate("/")} />
					</h1>

				<div>
					{sidebarItems.map((item, index) => (
						<div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-4 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
							{item.icon}
							<span>{item.text}</span>

							{item.text === 'Notifications' && actionNotification.length > 0 && (
								<Popover>
									<PopoverTrigger asChild>
										<Button 
											className="rounded-full h-5 w-5 absolute bg-red-600 hover:bg-red-600 bottom-6 left-6"
											size='icon'
											onClick={handleMarkAllAsRead}
										>
											{actionNotification.filter(notification => !notification.isRead).length}
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div>
											{actionNotification
												.filter(notification => !notification.isRead)
												.map(notification => (
													<div key={notification._id} className='flex items-center gap-2 my-2'>
														<Avatar>
															<AvatarImage src={notification.senderId.profilePicture} />
															<AvatarFallback>CN</AvatarFallback>
														</Avatar>
														<p className='text-sm'>
															<span className='text-gray-600'>{notification.message}</span>
														</p>
													</div>
												))}
										</div>
									</PopoverContent>
								</Popover>
							)}
						</div>
					))}

					{showMore && moreItems.map((item, index) => (
						<div key={index} onClick={() => sidebarHandler(item.text)} className='flex items-center gap-4 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
							{item.icon}
							<span>{item.text}</span>
						</div>
					))}
				</div>
			</div>

			<CreatePost open={open} setOpen={setOpen} />
			<Notification open={openNotification} setOpen={setOpenNotification} />
		</div>
	)
}

export default LeftSidebar
