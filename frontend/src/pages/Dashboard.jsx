import axios from 'axios';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useSelector } from "react-redux";
import Sidebar from './Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const { onlineUsers } = useSelector(store => store.chat)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pieData, setPieData] = useState({});
  const [barData, setBarData] = useState({});

  const { suggestedUsers } = useSelector(store => store.auth)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/admin/dashboard');
        setUserCount(response.data.totalUsers);
        setPostCount(response.data.totalPosts);

        const onlineCount = suggestedUsers.filter(user => onlineUsers.includes(user._id)).length
        setOnlineCount(onlineCount)

        setPieData({
          labels: ['Users', 'Posts', 'Online Users'],
          datasets: [{
            data: [response.data.totalUsers, response.data.totalPosts, onlineCount],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'], // xanh dương, hồng, vàng
            hoverBackgroundColor: ['#1E88E5', '#F06292', '#FFD54F'], // xanh dương đậm, hồng đậm, vàng nhạt
          }]
        });

        setBarData({
          labels: ['Users', 'Posts', 'Online Users'],
          datasets: [{
            label: 'Count',
            data: [response.data.totalUsers, response.data.totalPosts, onlineCount],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'], // đồng nhất với Pie Chart
          }]
        });


      } catch (error) {
        setError(`An error occurred: ${error.message}`);
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-6 w-full">

        {error && <div className="text-red-500 mb-4 text-lg">{error}</div>}

        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Pie Chart</h3>
              <Pie data={pieData} />
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Bar Chart</h3>
              <Bar data={barData} />
            </div>

            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-500 text-white rounded-lg shadow-md text-center">
                <h3 className="text-xl font-medium">Total Users</h3>
                <p className="text-4xl font-bold mt-2">{userCount}</p>
              </div>
              <div className="p-6 bg-pink-500 text-white rounded-lg shadow-md text-center">
                <h3 className="text-xl font-medium">Total Posts</h3>
                <p className="text-4xl font-bold mt-2">{postCount}</p>
              </div>
              <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-md text-center">
                <h3 className="text-xl font-medium">Online Users</h3>
                <p className="text-4xl font-bold mt-2">{onlineCount}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
