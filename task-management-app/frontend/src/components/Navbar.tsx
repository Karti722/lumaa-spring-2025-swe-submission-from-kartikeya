import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-blue-700">SurveyApp</Link>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Hello, <b>{user.username}</b></span>
            <Link to={`/${user.username}-survey-submissions`} className="text-blue-600 hover:underline">My Submissions</Link>
            <button onClick={logout} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
          </>
        ) : (
          <>
            <span className="text-gray-500">Guest</span>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
