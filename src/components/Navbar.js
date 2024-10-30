import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 flex justify-between items-center">
      <div className="flex-1"></div>
      <h1 className="text-white text-5xl font-bold flex-1 text-center">TSKMNG</h1>
      <button className="text-white flex-1 text-right">☰</button>
    </nav>
  );
};

export default Navbar;