import { deleteUserService } from '@/services/adminService';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import Sidebar from './Sidebar';

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const { onlineUsers } = useSelector(store => store.chat)

	const handleSearch = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`http://localhost:8000/admin/users?search=${search}&status=${status}`);
			setUsers(response.data.users);
		} catch (error) {
			setError(`Có lỗi xảy ra: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		handleSearch();
	}, [search, status]);

	const handleDeleteUser = async (id) => {
		const res = await deleteUserService(id)
		if (res.success) {
			handleSearch();
		}
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />
			<div className="p-6 w-full">
				<h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>

				<div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 shadow-md rounded-lg mb-6">
					<input
						type="text"
						placeholder="Tìm kiếm theo tên, email, ID..."
						className="p-2 border border-gray-300 rounded w-full md:w-1/3 mb-2 md:mb-0"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="p-2 border border-gray-300 rounded w-full md:w-1/5 mb-2 md:mb-0"
					>
						<option value="">Tất cả</option>
						<option value="online">Online</option>
						<option value="offline">Offline</option>
					</select>
					<button
						onClick={handleSearch}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
					>
						Tìm kiếm
					</button>
				</div>

				{error && <div className="text-red-500 mb-4 text-lg">{error}</div>}

				<div className="overflow-x-auto bg-white shadow-lg rounded-lg">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-blue-500 text-white">
								<th className="p-3">ID</th>
								<th className="p-3">Name</th>
								<th className="p-3">Email</th>
								<th className="p-3">Trạng thái</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan="4" className="text-center p-4">Đang tải...</td>
								</tr>
							) : (
								Array.isArray(users) && users.length > 0 ? (
									users.map((user) => {
										const isOnline = onlineUsers.includes(user?._id)
										return (
											<tr key={user._id} className="border-t hover:bg-gray-100">
												<td className="p-3">{user._id}</td>
												<td className="p-3">{user.username}</td>
												<td className="p-3">{user.email}</td>
												<td className="p-3 flex items-center">
													<span className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
													{isOnline ? 'Online' : 'Offline'}
												</td>
												<td
													className="cursor-pointer text-red-500 hover:text-red-700 transition duration-200"
													onClick={() => handleDeleteUser(user?._id)}><Trash2Icon /></td>
												{/* <td className="p-3">{user.email}</td> */}
											</tr>
										)
									}
									)
								)
									: (
										<tr>
											<td colSpan="4" className="text-center p-4">Không có dữ liệu</td>
										</tr>
									)
							)
							}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default UserManagement;
