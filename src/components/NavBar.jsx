import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCreateOutline, IoListOutline, IoLogOutOutline, IoHomeOutline, IoClose, IoMenu } from 'react-icons/io5';

function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('blogUser');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg"
      >
        {isOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
      </button>

      {/* Navigation sidebar */}
      <div 
        className={`fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-700 p-6 shadow-xl flex flex-col
        transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex-shrink-0">
          <h2 className="text-xl font-bold text-white mb-8">Menu</h2>
          
          <nav className="mb-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <IoHomeOutline className="text-xl" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/createblog" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <IoCreateOutline className="text-xl" />
                  <span>Create Blog</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/myblogs" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <IoListOutline className="text-xl" />
                  <span>My Blogs</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/30 transition-all text-white"
            >
              <IoLogOutOutline className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default NavBar;