import { useSelector } from "react-redux"
import Post from "./Post"

const Posts = () => {
	const { posts } = useSelector(store => store.post)
	console.log(posts);
	return (
		<div>
			{
				posts.map((post) => <Post key={post._id} post={post} />)
			}
		</div>
	)
}

export default Posts
