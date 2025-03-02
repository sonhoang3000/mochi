import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import PostManagement from './Posts';
import Sidebar from './Sidebar';
import UserManagement from './Users';

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <div className="flex">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex-1 p-6">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="posts" element={<PostManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
