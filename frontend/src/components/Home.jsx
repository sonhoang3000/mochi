import useGetAllNotifications from "@/hooks/useGetAllNotifications"
import useGetAllPost from "@/hooks/useGetAllPost"
import useGetConversation from "@/hooks/useGetConversation"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"
import { Outlet } from "react-router-dom"
import Feed from "./Feed"
import RightSidebar from "./RightSidebar"
const Home = () => {
	useGetAllPost()
	useGetSuggestedUsers()
	useGetConversation()
	useGetAllNotifications()
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
