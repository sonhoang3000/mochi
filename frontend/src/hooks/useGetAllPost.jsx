import { setPosts } from '@/redux/postSlice'
import { getAllPost } from "@/services/postService"
import { useDispatch } from "react-redux"
import { useEffect } from "react"


const useGetAllPost = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const fetchAllPost = async () => {
			try {
				const res = await getAllPost()
				if (res.success) {
					dispatch(setPosts(res.posts))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllPost()
	}, [])
}
export default useGetAllPost