import axios from 'axios';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = (search = "") => {
    axios.get('http://localhost:8000/admin/posts', { params: { search } })
      .then(response => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch(error => console.error('Error fetching posts:', error));
  };

  const handleSearch = () => {
    fetchPosts(searchTerm);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Admin Posts</h2>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
            placeholder="Tìm kiếm bài viết..."
          />
          <button
            onClick={handleSearch}
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            Tìm kiếm
          </button>
        </div>

        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Caption</th>
              <th className="p-2">Image</th>
              <th className="p-2">Author</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id} className="border-t">
                <td className="p-2">{post._id}</td>
                <td className="p-2">{post.caption}</td>
                <td className="p-2">
                  <img src={post.image} alt={post.title} width={100} height={100} />
                </td>
                <td className="p-2">
                  {post.author ? post.author.username : 'No Author'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPosts;