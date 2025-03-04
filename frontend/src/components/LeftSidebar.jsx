import { setAuthUser } from '@/redux/authSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { logoutUser } from '@/services/userService'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const LeftSidebar = () => {
	const nagivate = useNavigate()
	const { user } = useSelector(store => store.auth)
	const { likeNotification } = useSelector(store => store.realTimeNotification)
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)

	const logoutHandler = async () => {
		try {
			const res = await logoutUser()
			if (res.success) {
				dispatch(setAuthUser(null))
				dispatch(setSelectedPost(null))
				dispatch(setPosts([]))
				nagivate("/login")
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
			nagivate(`/profile/${user?._id}`)
		} else if (textType === "Home") {
			nagivate(`/`)
		} else if (textType === "Messages") {
			nagivate(`/chat`)
		} else if (textType === "Search") {
			nagivate(`/search`)
		} else if (textType === "Explore") {
			nagivate(`/explore`)
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
		{ icon: <LogOut />, text: "Logout" },
		{ icon: <AlignJustify />, text: "More" },
	]
	if (location.pathname.startsWith("/admin")) {
		return null;
	}
	return (
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
										item.text === 'Notifications' && likeNotification.length > 0 && (
											<Popover>
												<PopoverTrigger asChild >
													<Button className="rounded-full h-5 w-5 absolute bg-red-600 hover:bg-red-600 bottom-6 left-6" size='icon'>{likeNotification.length}</Button>
												</PopoverTrigger>
												<PopoverContent>
													<div>
														{
															likeNotification.length === 0 ? (<p>No new notification</p>) : (
																likeNotification.map((notification) => {
																	return (
																		<div key={notification.userId} className='flex items-center gap-2 my-2' >
																			<Avatar>
																				<AvatarImage src={notification.userDetails?.profilePicture} />
																				<AvatarFallback>CN</AvatarFallback>
																			</Avatar>
																			<p className='text-sm'><span className='font-bold' >{notification.userDetails?.username} </span>liked your post</p>

																		</div>
																	)
																})
															)
														}
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

		</div>
	)
}

export default LeftSidebar
