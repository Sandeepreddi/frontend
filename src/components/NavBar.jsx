import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCreateOutline, IoListOutline, IoLogOutOutline, IoHomeOutline } from 'react-icons/io5';

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('blogUser');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-700 p-6 shadow-xl flex flex-col">
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-white mb-8">Menu</h2>
        
        <nav className="mb-4">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all text-white"
              >
                <IoHomeOutline className="text-xl" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/createblog" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all text-white"
              >
                <IoCreateOutline className="text-xl" />
                <span>Create Blog</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/myblogs" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all text-white"
              >
                <IoListOutline className="text-xl" />
                <span>My Blogs</span>
              </Link>
            </li>
          </ul>
          
        </nav>
        <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/30 transition-all text-white"
        >
          <IoLogOutOutline className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
      </div>

      
    </div>
  );
}

export default NavBar;
