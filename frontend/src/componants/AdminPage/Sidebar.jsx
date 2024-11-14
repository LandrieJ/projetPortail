import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCog, FaTools, FaNewspaper } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-60 h-screen bg-blue-500 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md">
              <FaHome className="mr-3" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md">
              <FaUser className="mr-3" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/tools" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md">
              <FaTools className="mr-3" />
              <span>Outils</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md">
              <FaCog className="mr-3" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
