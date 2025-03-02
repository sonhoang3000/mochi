import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="sidebar w-1/5 bg-gray-800 text-white p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul>
        <li className={`p-2 ${selectedTab === 'dashboard' ? 'bg-gray-700' : ''}`}>
          <Link to="/admin/dashboard" onClick={() => setSelectedTab('dashboard')}>Dashboard</Link>
        </li>
        <li className={`p-2 ${selectedTab === 'users' ? 'bg-gray-700' : ''}`}>
          <Link to="/admin/users" onClick={() => setSelectedTab('users')}>Users</Link>
        </li>
        <li className={`p-2 ${selectedTab === 'posts' ? 'bg-gray-700' : ''}`}>
          <Link to="/admin/posts" onClick={() => setSelectedTab('posts')}>Posts</Link>
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