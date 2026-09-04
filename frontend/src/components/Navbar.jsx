<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report Fault', path: '/report' },
    { name: 'Dashboard', path: '/dashboard' },
  ];
=======
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };
>>>>>>> dewmi

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white ${scrolled ? 'shadow-md py-3' : 'shadow-sm py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">FenceGuard LK</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                    isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

<<<<<<< HEAD
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Login
            </Link>
=======
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition font-medium text-sm">
              Home
            </Link>

            {/* Report — visible to everyone; ProtectedRoute handles redirect if not logged in */}
            <Link to="/report" className="text-white/80 hover:text-white transition font-medium text-sm">
              Report a Fault
            </Link>

            {/* Officer Dashboard — only visible to Officers */}
            {user?.role === 'Officer' && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition font-medium text-sm"
              >
                <LayoutDashboard size={15} />
                Officer Dashboard
              </Link>
            )}

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Name + role badge */}
                <div className="flex items-center gap-2">
                  <span className="text-white/90 font-medium text-sm">{user.name}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      user.role === 'Officer'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  id="navbar-logout"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white transition font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
>>>>>>> dewmi
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
<<<<<<< HEAD
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 my-4 pt-4 px-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
                Login
              </Link>
            </div>
=======
        <div className="md:hidden mt-4 pb-2 bg-black/60 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex flex-col">
            <Link to="/" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/report" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Report a Fault
            </Link>

            {user?.role === 'Officer' && (
              <Link to="/dashboard" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
                Officer Dashboard
              </Link>
            )}

            {user ? (
              <>
                <div className="px-6 py-3 border-b border-white/5">
                  <span className="text-white/70 text-sm">{user.name} · </span>
                  <span className="text-emerald-400 text-sm font-semibold">{user.role}</span>
                </div>
                <button
                  id="mobile-logout"
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-white/10 px-6 py-4 font-semibold transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="text-emerald-400 hover:bg-white/10 px-6 py-4 font-semibold transition" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
>>>>>>> dewmi
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
