import { Outlet } from "react-router-dom"
import Feed from "./Feed"
import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/hooks/useGetAllPost"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"
import useGetConversation from "@/hooks/useGetConversation"

const Home = () => {
	useGetAllPost()
	useGetSuggestedUsers()
	useGetConversation()
	return (
		<div className="flex">
			<div className="flex-grow">
				<Feed />
				<Outlet />
			</div>
			<RightSidebar />
		</div>
	)
}

export default Home
