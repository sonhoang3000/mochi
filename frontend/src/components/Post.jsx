import { setPosts, setSelectedPost } from "@/redux/postSlice"
import { addComment, bookmarkPost, deletePost, likeOrDislike } from "@/services/postService"
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import PropTypes from 'prop-types'
import { useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import CommentDialog from "./CommentDialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
const Post = ({ post }) => {
	const [text, setText] = useState("")
	const [open, setOpen] = useState(false)
	const { user } = useSelector(store => store.auth)
	const { posts } = useSelector(store => store.post)
	const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
	const [postLike, setPostLike] = useState(post.likes.length);
	const [comment, setComment] = useState(post.comments)
	const dispatch = useDispatch()

	const changeEventHandler = (e) => {
		const inputText = e.target.value
		if (inputText.trim()) {
			setText(inputText)
		} else {
			setText("")
		}
	}

	const likeOrDislikeHandler = async () => {
		try {
			const action = liked ? "dislike" : 'like'
			const res = await likeOrDislike(post?._id, action)
			//console.log(res)
			if (res.success) {
				const updatedLiked = liked ? postLike - 1 : postLike + 1
				setPostLike(updatedLiked)
				setLiked(!liked)

				// updated post liked 
				const updatedPostData = posts.map(p =>
					p._id === post?._id ? {
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

	const commentHandler = async () => {
		try {
			const res = await addComment(post._id, { text })
			if (res.success) {
				const updatedCommentData = [...comment, res.comment];
				setComment(updatedCommentData);
				const updatedPostData = posts.map(p =>
					p._id === post._id ? { ...p, comments: updatedCommentData } : p
				);
				dispatch(setPosts(updatedPostData));
				toast.success(res.message);
				setText("");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const deletePostHandler = async () => {
		try {
			const res = await deletePost(post?._id)
			if (res.success) {
				const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
				dispatch(setPosts(updatedPostData))
				toast.success(res.message)
			}
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		}
	}

	const bookmarkHandler = async () => {
		try {
			const res = await bookmarkPost(post?._id)
			if (res.success) {
				toast.success(res.message)
			}
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div className="my-8 w-full max-w-sm mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={post.author?.profilePicture} alt="post_image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="flex items-center gap-3">
						<h1>{post.author?.username}</h1>
						{user?._id === post.author?._id && <Badge variant="secondary" >Author</Badge>}

					</div>
				</div>
				<Dialog >
					<DialogTrigger asChild>
						<MoreHorizontal className="cursor-pointer" />
					</DialogTrigger>
					<DialogContent className="flex flex-col items-center text-sm text-center">
						{
							post?.author?._id !== user?._id && <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold" >Unfollow</Button>
						}

						<Button variant="ghost" className="cursor-pointer w-fit" >Add to favorites</Button>
						{
							user && user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit" >Delete</Button>
						}
					</DialogContent>
				</Dialog>
			</div>
			<img
				className="rounded-sm my-2 w-full aspect-square object-cover"
				src={post.image}
				alt="post_img"
			/>

			<div className="flex items-center justify-between my-2">
				<div className="flex items-center gap-3">
					{
						liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className="cursor-pointer text-red-600" /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className="cursor-pointer hover:text-gray-600" />
					}
					<MessageCircle onClick={() => {
						dispatch(setSelectedPost(post));
						setOpen(true);
					}} className="cursor-pointer hover:text-gray-600" />
					<Send className="cursor-pointer hover:text-gray-600" />
				</div>
				<Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
			</div>
			<span className="font-medium block mb-2">{postLike} likes</span>
			<p>
				<span className="font-medium mr-2">{post.author?.username}</span>
				{post.caption}
			</p>
			{
				comment.length > 0 && (
					<span onClick={() => {
						dispatch(setSelectedPost(post));
						setOpen(true);
					}} className="cursor-pointer text-sm text-gray-400" > View all {comment.length} comments</span>
				)
			}

			<CommentDialog open={open} setOpen={setOpen} />
			<div className="flex items-center justify-between">
				<input
					type="text"
					placeholder="Add a comment"
					className="outline-none text-sm w-full"
					value={text}
					onChange={changeEventHandler}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							commentHandler();
						}
					}}
				/>
				{
					text && <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>
				}

			</div>
		</div>
	)
}

// Định nghĩa PropTypes
Post.propTypes = {
	post: PropTypes.shape({
		author: PropTypes.shape({
			profilePicture: PropTypes.string,
			username: PropTypes.string,
			_id: PropTypes.string,
		}),
		caption: PropTypes.string,
		image: PropTypes.string,
		_id: PropTypes.string,
		likes: PropTypes.array,
		comments: PropTypes.array,
	}).isRequired,
};

export default Post
