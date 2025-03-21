import { useSelector, useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { followOrUnfollow } from "@/services/userService"
import { toast } from "sonner"
import { setAuthUser } from "@/redux/authSlice";

const SuggestedUsers = () => {
	const dispatch = useDispatch();
	const { suggestedUsers, user } = useSelector(store => store.auth)
	const followingArray = Array.isArray(user?.following) ? user?.following : [];

	const { type } = useParams();
	const isExplorePage = type === "user";

	const handleFollowUnfollow = async (userSuggestedId) => {
		if (!user) return;
		try {
			const res = await followOrUnfollow(userSuggestedId, user._id)
			if (res.success) {
				const isFollowing = followingArray.includes(userSuggestedId);

				dispatch(setAuthUser({
					...user,
					following: isFollowing
						? user.following.filter((id) => id !== userSuggestedId)
						: [...user.following, userSuggestedId],
				}));

				toast.success(res.message);
			}
		} catch (error) {
			console.error("Error following/unfollowing user:", error);
		}
	};

	return (
		<div className='my-10'>
			{!isExplorePage ? (
				<>
					<div className='flex items-center justify-between text-sm'>
						<h1 className='font-semibold text-gray-600 mr-1'>Suggested for you</h1>
						<span className='font-medium cursor-pointer'>
							<Link to={"/suggested/user"}>See All</Link>
						</span>
					</div>
					{suggestedUsers.map((userSuggested) => (
						<div key={userSuggested?._id} className="flex items-center justify-between my-4">
							<div className="flex items-center gap-2">
								<Link to={`/profile/${userSuggested?._id}`}>
									<Avatar>
										<AvatarImage src={userSuggested?.profilePicture} alt="post_image" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</Link>
								<div>
									<h1 className="font-semibold text-sm">
										<Link to={`/profile/${userSuggested?._id}`}>{userSuggested?.username}</Link>
									</h1>
									<span className="text-gray-600 text-sm">{userSuggested?.bio || 'Bio here'}</span>
								</div>
							</div>
							<span
								className={
									followingArray.includes(userSuggested?._id)
										? "text-[#f72b2b] text-sm font-bold cursor-pointer hover:text-[#3495d6]"
										: "text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#3495d6]"
								}
								onClick={() => handleFollowUnfollow(userSuggested?._id)}
							>
								{followingArray.includes(userSuggested?._id) ? 'Unfollow' : 'Follow'}
							</span>
						</div>
					))}
				</>
			) : (
				// Thêm code hiển thị khác nếu đang ở trang Explore
				<div className="flex flex-col items-center justify-center text-gray-500 ">
					<p className="mb-4 text-black">Suggested for you </p>
					{suggestedUsers.map((userSuggested) => (
						<div key={userSuggested?._id} className="flex items-center justify-between w-full max-w-md my-4 ">
							<div className="flex items-center gap-2">
								<Link to={`/profile/${userSuggested?._id}`}>
									<Avatar>
										<AvatarImage src={userSuggested?.profilePicture} alt="post_image" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</Link>
								<div>
									<h1 className="font-semibold text-sm">
										<Link to={`/profile/${userSuggested?._id}`}>{userSuggested?.username}</Link>
									</h1>
									<span className="text-gray-600 text-sm">{userSuggested?.bio || 'Bio here'}</span>
								</div>
							</div>
							<span
								className={
									followingArray.includes(userSuggested?._id)
										? "text-[#f72b2b] text-sm font-bold cursor-pointer hover:text-[#3495d6]"
										: "text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#3495d6]"
								}
								onClick={() => handleFollowUnfollow(userSuggested?._id)}
							>
								{followingArray.includes(userSuggested?._id) ? 'Unfollow' : 'Follow'}
							</span>
						</div>
					))}
				</div>

			)}
		</div>
	);

}

export default SuggestedUsers
