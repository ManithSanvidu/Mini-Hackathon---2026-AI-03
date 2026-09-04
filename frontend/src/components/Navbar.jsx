import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif font-bold text-2xl text-white tracking-wider">EleGuard</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            <Link to="/" className="text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-white hover:text-white text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/report" className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-white text-sm font-medium transition-colors">
              Report
            </Link>
            <Link to="/dashboard" className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-white text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/login" className="bg-white hover:bg-gray-200 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-md">
              Login
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-green-50 border-green-500 text-green-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/report" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" onClick={() => setIsOpen(false)}>
              Report
            </Link>
            <Link to="/dashboard" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link to="/login" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
