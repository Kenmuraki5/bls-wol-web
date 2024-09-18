import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 py-3 pl-3 fixed w-[100%] z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a className="flex items-center text-white" href="#">
          <span className="flex justify-center items-center bg-blue-500 rounded-full p-2 mr-2">
            <i className="bi bi-power text-xl"></i>
          </span>
          <span className="font-bold text-lg">Wake-on-LAN BLS</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
