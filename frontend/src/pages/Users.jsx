import axios from 'axios';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/admin/users?search=${search}&status=${status}`);
      console.log("API Response:", response.data);
      setUsers(response.data.users);
    } catch (error) {
      setError(`Có lỗi xảy ra: ${error.message}`);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, status]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, hoặc ID..."
            className="p-2 border border-gray-300 rounded mr-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Tìm kiếm
          </button>
        </div>

        <div className="mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Tất cả</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-2">Đang tải...</td>
              </tr>
            ) : (
              Array.isArray(users) && users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id} className="border-t">
                    <td className="p-2">{user._id}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.isOnline ? 'Online' : 'Offline'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-2">Không có dữ liệu</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;