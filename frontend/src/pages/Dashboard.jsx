import axios from 'axios';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Sidebar from './Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [pieData, setPieData] = useState({});  
  const [barData, setBarData] = useState({});  

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/admin/dashboard');
        setUserCount(response.data.totalUsers);
        setPostCount(response.data.totalPosts);
        setOnlineUsers(response.data.onlineUsers);

        // Dữ liệu cho biểu đồ tròn
        setPieData({
          labels: ['Người dùng', 'Bài viết', 'Người dùng online'],
          datasets: [{
            data: [response.data.totalUsers, response.data.totalPosts, response.data.onlineUsers],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'],
          }]
        });
        setBarData({
          labels: ['Người dùng', 'Bài viết', 'Người dùng online'],
          datasets: [{
            label: 'Số lượng',
            data: [response.data.totalUsers, response.data.totalPosts, response.data.onlineUsers],
            backgroundColor: '#4CAF50', 
          }]
        });
        
      } catch (error) {
        setError(`Có lỗi xảy ra: ${error.message}`);
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-xl mb-4">Biểu đồ tròn</h3>
              <Pie data={pieData} />
              
            </div>

            <div className="mb-6">
              <h3 className="text-xl mb-4">Biểu đồ cột</h3>
              <Bar data={barData} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-blue-500 text-white rounded shadow-lg">
                <h3 className="text-xl">Số lượng người dùng</h3>
                <p className="text-3xl">{userCount}</p>
              </div>
              <div className="p-4 bg-green-500 text-white rounded shadow-lg">
                <h3 className="text-xl">Số lượng bài viết</h3>
                <p className="text-3xl">{postCount}</p>
              </div>
              <div className="p-4 bg-yellow-500 text-white rounded shadow-lg">
                <h3 className="text-xl">Số người dùng online</h3>
                <p className="text-3xl">{onlineUsers}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
