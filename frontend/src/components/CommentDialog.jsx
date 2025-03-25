import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { MoreHorizontal, Bookmark, MessageCircle,BookMarked, Send } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux"
import Comment from "./Comment"
import { addComment, likeOrDislike, bookmarkPost } from "@/services/postService"
import { setPosts } from "@/redux/postSlice"
import { toast } from "sonner"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { setAuthUser } from '@/redux/authSlice'

const CommentDialog = ({ open, setOpen }) => {
	const [text, setText] = useState("")
	const { selectedPost, posts } = useSelector(store => store.post);
	const [comment, setComment] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch()
	const { user } = useSelector(store => store.auth)
	const [liked, setLiked] = useState(selectedPost?.likes?.includes(user?._id) || false)
	const [postLike, setPostLike] = useState(selectedPost?.likes?.length || 0);
	const [isBookmarked, setIsBookmarked] = useState(user?.bookmarks?.includes(selectedPost?._id) || false);

	useEffect(() => {
		console.log('User bookmarks:', user?.bookmarks);
		console.log('Selected post ID:', selectedPost?._id);
		console.log('Is bookmarked:', user?.bookmarks?.includes(selectedPost?._id));
	
        if (selectedPost && user) {
            setIsBookmarked(user.bookmarks?.includes(selectedPost._id) || false);
            setLiked(selectedPost.likes?.includes(user?._id) || false);
            setPostLike(selectedPost.likes?.length || 0);
            setComment(selectedPost.comments || []);
        }
    }, [selectedPost, user?._id]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const changeEventHandler = (a) => {
		const inputText = a.target.value
		if (inputText.trim()) {
			setText(inputText)
		} else {
			setText("")
		}
	}

	const sendMessageHandler = async () => {
		if (isSubmitting) return; // Tránh gọi hàm nếu đã có yêu cầu đang xử lý
		setIsSubmitting(true);
		try {
			const res = await addComment(selectedPost._id, { text })
			if (res.success) {
				const updatedCommentData = [...comment, res.comment];
				setComment(updatedCommentData);
				const updatedPostData = posts?.map(p =>
					p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
				);
				dispatch(setPosts(updatedPostData));
				toast.success(res.message);
				setText("");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false); // Mở khóa sau khi hoàn tất
		}
	}

	const likeOrDislikeHandler = async () => {
		try {
			const action = liked ? "dislike" : 'like'
			const res = await likeOrDislike(selectedPost?._id, action)
			if (res.success) {
				// like hay dislike
				const updatedLiked = liked ? postLike - 1 : postLike + 1
				setPostLike(updatedLiked)
				setLiked(!liked)

				// updated post liked 
				const updatedPostData = posts.map(p =>
					p._id === selectedPost?._id ? {
						...p,
						likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
					} : p
				)
				dispatch(setPosts(updatedPostData))
				toast.success(res.message)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const bookmarkHandler = async () => {
		if (!selectedPost?._id) return;

		try {
			const res = await bookmarkPost(selectedPost?._id)
			if (res.success) {
				setIsBookmarked(!isBookmarked);
                const updatedUser = {
                    ...user,
                    bookmarks: isBookmarked 
                        ? user.bookmarks.filter(id => id !== selectedPost._id)
                        : [...(user.bookmarks || []), selectedPost._id]
                };
                dispatch(setAuthUser(updatedUser));
                toast.success(res.message)
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Có lỗi xảy ra khi bookmark bài viết")
			console.log(error)
		}
	}

	return (
		<Dialog open={open}>
			<DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
				<div className="flex flex-1">
					<div className="w-1/2">
						{selectedPost?.typeContent === "image" ? (
							<img
								className="rounded-sm my-2 w-full aspect-square object-contain"
								src={selectedPost?.src}
								alt="post_img"
								onDoubleClick={likeOrDislikeHandler}
							/>
						) : selectedPost?.typeContent === "video" ? (
							<video
								className="rounded-sm my-2 w-full aspect-square object-contain"
								controls
								onDoubleClick={likeOrDislikeHandler}
							>
								<source src={selectedPost?.src} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						) : null}
					</div>
					<div className="w-1/2 flex flex-col justify-between">
						<div className="flex items-center justify-between p-4">
							<div className="flex gap-3 items-center ">
								<Link to={`/profile/${selectedPost?.author?._id}`} >
									<Avatar>
										<AvatarImage src={selectedPost?.author?.profilePicture} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</Link>
								<div>
									<Link to={`/profile/${selectedPost?.author?._id}`} className="font-semibold text-xs" >{selectedPost?.author?.username}</Link>
								</div>
							</div>

							<Dialog>
								<DialogTrigger asChild>
									<MoreHorizontal className="cursor-pointer" />
								</DialogTrigger>
								<DialogContent className="flex flex-col items-center text-sm text-center">
									<div className="cursor-pointer w-full text-[#ED4956] font-bold">
										Unfollow
									</div>
									<div className="cursor-pointer w-full">
										Add to favorites
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<hr />
						<div className="flex-1 overflow-y-auto max-h-96 p-4">
							{
								comment?.map((comment) => <Comment key={comment._id} comment={comment} />)
							}
						</div>
						<div className="px-4 py-2">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-3">
									{liked ?
										<FaHeart onClick={likeOrDislikeHandler} size={'24'} className="cursor-pointer text-red-600" /> :
										<FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className="cursor-pointer hover:text-gray-600" />
									}
									<MessageCircle className="cursor-pointer hover:text-gray-600" />
									<Send className="cursor-pointer hover:text-gray-600" />
								</div>
								{isBookmarked ? 
									<BookMarked onClick={bookmarkHandler} className="cursor-pointer text-black" /> :
									<Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
								}
							</div>
							<span className="font-medium block">{postLike} likes</span>
						</div>
						<div className="p-4">
							<div className="flex items-center gap-2">
								<input type="text" value={text} onChange={changeEventHandler} placeholder="Add a comment ..." className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											sendMessageHandler();
										}
									}}
								/>
								<Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// Định nghĩa PropTypes
CommentDialog.propTypes = {
	open: PropTypes.bool.isRequired, // 'open' là boolean và bắt buộc
	setOpen: PropTypes.func.isRequired, // 'setOpen' là một hàm và bắt buộc
};

export default CommentDialog
