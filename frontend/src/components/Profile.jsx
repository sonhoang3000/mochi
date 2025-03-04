import useGetUserProfile from "@/hooks/useGetUserProfile"
import { Avatar, AvatarFallback, AvatarImage, } from "./ui/avatar"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { AtSign, Heart, MessageCircle } from "lucide-react"
import { useState } from "react"
import { createConversationService, followOrUnfollow } from "@/services/userService"
import { toast } from "sonner"
import { setUserProfile, setAuthUser } from '@/redux/authSlice'
import { setGetConversation } from '@/redux/authSlice'

const Profile = () => {
	const params = useParams()
	const dispatch = useDispatch()
	const nagivate = useNavigate()
	const userId = params.id
	useGetUserProfile(userId)
	const [activeTab, setActiveTab] = useState("posts")

	const { userProfile, user, getConversation } = useSelector(store => store.auth)

	const isLoggedInUserProfile = user?._id === userProfile?._id

	const handleTabChange = (tab) => {
		setActiveTab(tab)
	}

	const handleConversation = async (targetId) => {
		try {
			const res = await createConversationService(targetId)
			if (res.success) {
				const updatedConversations = getConversation.map(conv => {
					if (conv._id === targetId) {
						return { ...conv, updatedAt: new Date().toISOString() }; // Giả lập update
					}
					return conv;
				});

				// Sort danh sách theo `updatedAt`
				updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

				dispatch(setGetConversation(updatedConversations));

				nagivate("/chat"); // Điều hướng sau khi Redux đã cập nhật
			}
		} catch (error) {
			console.error('Lỗi khi tạo cuộc trò chuyện:', error.response ? error.response.data : error.message)
		}
	}

	const handleFollowUnfollow = async () => {
		if (!user || !userProfile) return;
		try {
			const res = await followOrUnfollow(userProfile._id, user._id)
			if (res.success) {
				const followingArray = Array.isArray(user?.following) ? user?.following : [];
				const isFollowingPeople = followingArray.includes(userProfile._id);

				const followerArray = Array.isArray(userProfile.followers) ? userProfile.followers : [];
				const followerCurrent = followerArray.includes(user._id);

				dispatch(setAuthUser({
					...user,
					following: isFollowingPeople
						? user.following.filter(id => id !== userProfile._id) // Unfollow
						: [...user.following, userProfile._id] // Follow
				}));

				dispatch(setUserProfile({
					...userProfile,
					followers: followerCurrent
						? userProfile.followers.filter(id => id !== user._id) // Unfollow
						: [...userProfile.followers, user._id] // Follow
				}));
				toast.success(res.message)
			}
		} catch (error) {
			console.error("Error following/unfollowing user:", error);
		}
	};

	const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

	return (
		<div className="flex max-w-5xl justify-center mx-auto pl-10">
			<div className="flex flex-col gap-20 p-8">
				<div className="grid grid-cols-2">
					<section className="flex items-center justify-center">
						<Avatar className="h-32 w-32">
							<AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</section>
					<section>
						<div className="flex flex-col gap-5" >
							<div className="flex items-center gap-2">
								<span>{userProfile?.username}</span>
								{
									isLoggedInUserProfile ? (
										<>
											<Link to="/account/edit" ><Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button></Link>
											<Button variant="secondary" className="hover:bg-gray-200 h-8">View archive</Button>
										</>
									) : (
										<div>
											{user?.following.includes(userProfile._id) ? (
												<>
													<Button variant="secondary" onClick={handleFollowUnfollow} className="h-8">Unfollow</Button>
												</>
											) : (
												<Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8" onClick={handleFollowUnfollow}>	Follow</Button>
											)}
											<Button
												onClick={() => handleConversation(userProfile._id)}
												variant="secondary"
												className="h-8"
											>Message</Button>
										</div>
									)
								}
							</div>
							<div className="flex items-center gap-4" >
								<p><span className="font-semibold">{userProfile?.posts?.length} </span>posts</p>
								<p><span className="font-semibold">{userProfile?.followers?.length} </span>followers</p>
								<p><span className="font-semibold">{userProfile?.following?.length} </span>following</p>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold" >{userProfile?.bio || 'bio here...'}</span>
								<Badge className="w-fit" variant="secondary"> <AtSign /> <span className="pl-1" >{userProfile?.username}</span></Badge>
							</div>
						</div>
					</section>
				</div>
				<div className="border-t border-t-gray-200" >
					<div className="flex items-center justify-center gap-10 text-sm ">
						<span className={`py-3 cursor-pointer ${activeTab === 'posts' ? "font-bold" : " "} `} onClick={() => handleTabChange('posts')} >
							POSTS
						</span>
						<span className={`py-3 cursor-pointer ${activeTab === 'saved' ? "font-bold" : " "}  `} onClick={() => handleTabChange('saved')}>
							SAVED
						</span>
						<span className="py-3 cursor-pointer">REELS</span>
						<span className="py-3 cursor-pointer">TAGS</span>
					</div>
					<div className="grid grid-cols-3 gap-1" >
						{
							displayedPost?.map((post) => {
								return (
									<div key={post?._id} className="relative group cursor-pointer">

										{post?.typeContent === "image" ? (
											<img
												className="rounded-sm my-2 w-full aspect-square object-cover"
												src={post?.src}
												alt="post_img"
											// onDoubleClick={likeOrDislikeHandler}
											/>
										) : post?.typeContent === "video" ? (
											<video
												className="rounded-sm my-2 w-full aspect-square object-cover"
												controls
											// onDoubleClick={likeOrDislikeHandler}
											>
												<source src={post?.src} type="video/mp4" />
												Your browser does not support the video tag.
											</video>
										) : null}
										<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<div className="flex items-center text-white space-x-4'">
												<button className='flex items-center gap-2 hover:text-gray-300'>
													<Heart />
													<span>{post?.likes?.length}</span>
												</button>
												<button className='flex items-center gap-2 hover:text-gray-300'>
													<MessageCircle />
													<span>{post?.comments?.length}</span>
												</button>
											</div>
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
