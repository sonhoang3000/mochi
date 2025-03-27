import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="sidebar w-1/5 bg-gray-900 text-white p-6 min-h-screen shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <ul className="space-y-3">
        <li className={`p-3 rounded-lg transition ${selectedTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
          <Link to="/admin/dashboard" onClick={() => setSelectedTab('dashboard')} className="block">Dashboard</Link>
        </li>
        <li className={`p-3 rounded-lg transition ${selectedTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
          <Link to="/admin/users" onClick={() => setSelectedTab('users')} className="block">Users</Link>
        </li>
        <li className={`p-3 rounded-lg transition ${selectedTab === 'posts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
          <Link to="/admin/posts" onClick={() => setSelectedTab('posts')} className="block">Posts</Link>
        </li>
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};

export default Sidebar;
