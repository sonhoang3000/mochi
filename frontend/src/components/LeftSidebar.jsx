import { setAuthUser, setGetConversation, setSelectedUser, setSuggestedUsers, setUserProfile } from '@/redux/authSlice'
import { setMessages, setOnlineUsers } from '@/redux/chatSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { setActionNotification } from '@/redux/rtnSlice'
import { setSocket } from '@/redux/socketSlice'
import { markAsRead } from "@/services/notificationService"
import { logoutUser } from '@/services/userService'
<<<<<<< HEAD
import { AlignJustify, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, ShieldAlert, TrendingUp } from 'lucide-react'
=======
import { AlignJustify, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
<<<<<<< HEAD
	const navigate = useNavigate()
=======
	const nagivate = useNavigate()
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
	const { user } = useSelector(store => store.auth)
	const { actionNotification } = useSelector(store => store.realTimeNotification)
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)
	const [openNotification, setOpenNotification] = useState(false)
<<<<<<< HEAD
	const [showMore, setShowMore] = useState(false) // Toggle menu More

=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
	const logoutHandler = async () => {
		try {
			const res = await logoutUser()
			if (res.success) {
<<<<<<< HEAD
				// Reset Redux State
=======
				//user
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
				dispatch(setAuthUser(null))
				dispatch(setSuggestedUsers([]))
				dispatch(setUserProfile(null))
				dispatch(setSelectedUser(null))
				dispatch(setGetConversation([]))
<<<<<<< HEAD
				dispatch(setSelectedPost(null))
				dispatch(setPosts([]))
				dispatch(setOnlineUsers([]))
				dispatch(setMessages([]))
				dispatch(setActionNotification([]))
				dispatch(setSocket(null))

				navigate("/login")
=======

				//post
				dispatch(setSelectedPost(null))
				dispatch(setPosts([]))

				//chat
				dispatch(setOnlineUsers([]))
				dispatch(setMessages([]))

				//RealTimeNotification
				dispatch(setActionNotification([]))

				//socket
				dispatch(setSocket(null))

				nagivate("/login")
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
<<<<<<< HEAD
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
=======
			nagivate(`/profile/${user?._id}`)
		} else if (textType === "Home") {
			nagivate(`/`)
		} else if (textType === "Messages") {
			nagivate(`/chat`)
		} else if (textType === "Search") {
			nagivate(`/search`)
		} else if (textType === "Explore") {
			nagivate(`/explore`)
		} else if (textType === "AI Assistant") {
			nagivate(`/ai-assistant`)
		} else if (textType === "Notifications") {
			setOpenNotification(true)
		} else if (textType === "Fake News") {
			// Handle Fake News click
			nagivate(`/fake-news`)
		}
	}		
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea

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
<<<<<<< HEAD
		{ icon: <AlignJustify />, text: "More" }, // More button
	]

	const moreItems = [
		{ icon: <FaRobot className="text-lg text-pink-500" />, text: "AI Assistant" },
		{ icon: <ShieldAlert className="text-blue-500" />, text: "FakeNewsChecker" },
		{ icon: <LogOut className="text-red-500" />, text: "Logout" },
	];
	
=======
		{ icon: <FaRobot className="text-lg text-pink-500" />, text: "AI Assistant" },
		{ icon: <LogOut />, text: "Logout" },
		{ icon: <AlignJustify />, text: "More" },
		{ icon: <FaRobot className="text-lg text-yellow-500" />, text: "Fake News" } // Added "Fake News" item
	]
	if (location.pathname.startsWith("/admin")) {
		return null
	}
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea

	const handleMarkAllAsRead = async () => {
		try {
			await Promise.all(actionNotification.map(notification => markAsRead(notification._id)));
<<<<<<< HEAD

=======
	
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
			const updatedNotifications = actionNotification.map(notification => ({
				...notification,
				isRead: true
			}));
<<<<<<< HEAD

=======
	
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
			dispatch(setActionNotification(updatedNotifications));
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	return (
<<<<<<< HEAD
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
=======
		<div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
			<div className='flex flex-col'>
				<h1 className='my-2 pl-3 font-bold text-xl'><img className='h-28 items-center text-center cursor-pointer' src="../../src/assets/mochi.png" alt="Mochi" onClick={() => (window.location.href = "/")} /></h1>
				<div>
					{
						sidebarItems.map((item, index) => {
							return (
								<div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
									{item.icon}
									<span>{item.text}</span>
									{
										item.text === 'Notifications' && actionNotification.length > 0 && (
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
										)
									}
								</div>
							)
						})
					}
				</div>
			</div>

			<CreatePost
				open={open} setOpen={setOpen}
			/>

			<Notification
				open={openNotification} setOpen={setOpenNotification}
			/>

>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
		</div>
	)
}

export default LeftSidebar
