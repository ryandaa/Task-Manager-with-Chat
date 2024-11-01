import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const menuRef = useRef();

  // Check if the current path is a task detail page, the homepage, or the sign-in page
  const isTaskDetailPage = location.pathname.startsWith('/task/') && location.pathname !== '/task';
  const isHomePage = location.pathname === '/';
  const isSignInPage = location.pathname === '/login';

  const handleBack = () => {
    window.location.href = '/task';
  };

  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-400 p-4 flex items-center justify-between">
      <div className="flex items-center">
        {isTaskDetailPage && (
          <button onClick={handleBack} className="mr-4 bg-gray-300 text-black px-3 py-2 rounded">
            Back
          </button>
        )}
      </div>
      <h1 className="text-white text-5xl font-bold flex-grow text-center">TSKMNG</h1>
      {!isTaskDetailPage && !isHomePage && !isSignInPage && (
        <div className="relative" ref={menuRef}>
          <button onClick={toggleMenu} className="text-white text-3xl focus:outline-none">
            ☰
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;