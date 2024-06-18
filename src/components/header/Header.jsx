import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="flex justify-center items-center py-2 px-4 bg-gray-800 mt-2 overflow-hidden">
      <Link to="/" className="flex items-center">
        <img src="/film-icon.png" alt="Film Icon" className="w-12 h-auto mr-4 hover:opacity-80 transition-opacity duration-300" />
        <h1 className="text-white text-xl md:text-2xl font-bold">Moduna Göre Film</h1>
      </Link>
    </div>
  );
};

export default Header;
