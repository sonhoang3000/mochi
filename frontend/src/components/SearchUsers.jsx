import { useState, useEffect } from "react";
import { searchUser } from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SearchUsers = () => {

	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [nextLastId, setNextLastId] = useState(null);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (searchTerm) {
			fetchUsers(true);
		} else {
			setUsers([]);
			setNextLastId(null);
			setHasMore(false);
		}
	}, [searchTerm]);

	const fetchUsers = async (isNewSearch = false) => {
		if (loading) return;
		setLoading(true);

		try {
			const res = await searchUser(searchTerm, isNewSearch ? null : nextLastId);

			const { users: newUsers, nextLastId: newLastId, hasMore } = res;

			// Sử dụng Map để loại bỏ user trùng dựa trên _id
			setUsers((prevUsers) => {
				const mergedUsers = isNewSearch ? newUsers : [...prevUsers, ...newUsers];
				const uniqueUsers = Array.from(new Map(mergedUsers.map(user => [user._id, user])).values());
				return uniqueUsers;
			});
			setNextLastId(newLastId);
			setHasMore(hasMore);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	}

	// Xử lý sự kiện cuộn xuống cuối danh sách
	const handleScroll = () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore) {
			fetchUsers(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore]);

	return (
		<div className="max-w-lg mx-auto p-4">
			{/* Ô tìm kiếm */}
			<input
				type="text"
				placeholder="Tìm kiếm..."
				className="w-full p-2 border rounded-lg"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{/* Danh sách user */}
			<ul className="mt-4">
				{users.map((user) => {
					const { _id, username, profilePicture, bio } = user;
					return (
						<li key={_id}>
							<Link to={`/profile/${_id}`}  >
								<div className="flex items-center p-2 border-b">
									<Avatar className="w-12 h-12 rounded-full mr-3 object-cover" >
										<AvatarImage src={profilePicture} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-semibold">{username}</p>
										{bio && <p className="text-sm text-gray-500">{bio}</p>}
									</div>
								</div>

							</Link>
						</li>
					);
				})}
			</ul>

			{/* Loading state */}
			{loading && <p className="text-center mt-4">Đang tải...</p>}
		</div>
	)
}

export default SearchUsers
