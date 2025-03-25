import { readFileAsDataURL } from "@/lib/utils"
import { setPosts } from "@/redux/postSlice"
import { addNewPost } from "@/services/postService"
import { Loader2 } from "lucide-react"
import PropTypes from 'prop-types'
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
const CreatePost = ({ open, setOpen }) => {
	const imageRef = useRef()
	const [file, setFile] = useState("")
	const [caption, setCaption] = useState("")
	const [filePreview, setFilePreview] = useState("")
	const [loading, setLoading] = useState(false)
	const { user } = useSelector(store => store.auth)
	const { posts } = useSelector(store => store.post)
	const dispatch = useDispatch()

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0]
		if (file) {
			setFile(file)
			const dataUrl = await readFileAsDataURL(file)
			setFilePreview(dataUrl)
		}
	}

	const createPostHandler = async () => {
		const formData = new FormData()
		formData.append("caption", caption)
		if (filePreview) formData.append("file", file)
		try {
			setLoading(true)
			const res = await addNewPost(formData)
			if (res.success) {
				dispatch(setPosts([res.post, ...posts])) //[1] => [1,2] => total elements
				toast.success(res.message)
				setOpen(false)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			setLoading(false)
			setCaption("")
			setFile("")
			setFilePreview("")
		}
	}

	return (
		<Dialog open={open}>
			<DialogContent onInteractOutside={() => setOpen(false)}>
				<DialogHeader className="text-center font-medium"  >Create New Post</DialogHeader>
				<div className="flex gap-3 items-center">
					<Avatar>
						<AvatarImage src={user?.profilePicture} alt="img" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="font-semibold text-xs">{user?.username}</h1>
						<span className="text-gray-600 text-xs">Bio here ...</span>
					</div>
				</div>
				<Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
				{
					filePreview && (
						<div className="w-full h-64 flex items-center justify-center">
							{file.type.startsWith("image/") ? (
								<img src={filePreview} alt="preview_img" className="object-cover h-full w-full rounded-md" />
							) : file.type.startsWith("video/") ? (
								<video controls className="object-cover h-full w-full rounded-md">
									<source src={filePreview} type={file.type} />
									Your browser does not support the video tag.
								</video>
							) : null}
						</div>
					)
				}
				<input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
				<Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]">Select from computer</Button>
				{
					filePreview && (
						loading ? (
							<Button>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button onClick={createPostHandler} className="w-full" type="submit">Post</Button>
						)
					)
				}
			</DialogContent>
		</Dialog>
	)
}

CreatePost.propTypes = {
	open: PropTypes.bool.isRequired, // 'open' là boolean và bắt buộc
	setOpen: PropTypes.func.isRequired, // 'setOpen' là một hàm và bắt buộc
};

export default CreatePost
