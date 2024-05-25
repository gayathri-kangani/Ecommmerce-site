import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 m-3 rounded-xl shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">Heaven's Place</Link>
        </div>
        <div>
          <Link to="/" className="text-gray-300 hover:text-white mx-4">Home</Link>
          <Link to="/products" className="text-gray-300 hover:text-white mx-4">Products</Link>
          <Link to="/admin" className="text-gray-300 hover:text-white mx-4">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
