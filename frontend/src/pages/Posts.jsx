import axios from 'axios';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Trash2Icon } from 'lucide-react'
import { deletePostService } from '@/services/adminService';

const AdminPosts = () => {
	const [posts, setPosts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = (search = "") => {
		setLoading(true);
		axios.get('http://localhost:8000/admin/posts', { params: { search } })
			.then(response => {
				setPosts(response.data);
				setError("");
			})
			.catch(error => {
				console.error('Error fetching posts:', error);
				setError("Có lỗi xảy ra khi tải bài viết.");
			})
			.finally(() => setLoading(false));
	};

	const handleSearch = () => {
		fetchPosts(searchTerm);
	};

	const handleDeletePost = async (id) => {
		const res = await deletePostService(id)
		if (res.success) {
			setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
		}
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />

			<div className="p-6 w-full">
				<h2 className="text-2xl font-bold mb-4 text-gray-800">Quản lý Bài Viết</h2>

				<div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 shadow-md rounded-lg mb-6">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
						placeholder="Tìm kiếm bài viết..."
					/>
					<button
						onClick={handleSearch}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
					>
						Tìm kiếm
					</button>
				</div>

				{error && <div className="text-red-500 mb-4">{error}</div>}

				<div className="overflow-x-auto bg-white shadow-lg rounded-xl">
					<table className="w-full text-left border-collapse">
						{/* Tiêu đề */}
						<thead>
							<tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
								<th className="p-4 border-b-2 border-blue-300 font-semibold text-center">ID</th>
								<th className="p-4 border-b-2 border-blue-300 font-semibold">Caption</th>
								<th className="p-4 border-b-2 border-blue-300 font-semibold text-center">Hình ảnh</th>
								<th className="p-4 border-b-2 border-blue-300 font-semibold text-center">Tác giả</th>
								<th className="p-4 border-b-2 border-blue-300 font-semibold text-center">Hành động</th>
							</tr>
						</thead>

						{/* Nội dung */}
						<tbody>
							{loading ? (
								<tr>
									<td colSpan="5" className="text-center p-6 text-gray-500 italic">Đang tải...</td>
								</tr>
							) : posts.length > 0 ? (
								posts.map(post => (
									<tr
										key={post._id}
										className="border-t hover:bg-gray-50 transition duration-300"
									>
										<td className="p-4 border text-center text-gray-700">{post._id}</td>
										<td className="p-4 border text-gray-800">{post.caption}</td>
										<td className="p-4 border flex justify-center">
											<img
												src={post.src}
												alt={post.caption}
												className="w-24 h-24 object-cover rounded-lg shadow-md"
											/>
										</td>
										<td className="p-4 border text-center text-gray-700">
											{post.author ? post.author.username : <span className="italic text-gray-400">Không có tác giả</span>}
										</td>
										<td className="p-4 border text-center">
											<span
												onClick={() => handleDeletePost(post._id)}
												className="cursor-pointer text-red-500 hover:text-red-700 transition duration-200"
											>
												<Trash2Icon className="w-6 h-6" />
											</span>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="text-center p-6 text-gray-500 italic">Không có dữ liệu</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>


			</div>
		</div>
	);
};

export default AdminPosts;