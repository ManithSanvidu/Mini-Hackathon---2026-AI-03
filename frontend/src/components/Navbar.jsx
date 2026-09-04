import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/60 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="font-serif font-bold text-2xl text-white tracking-tight">FenceGuard LK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className={`transition font-medium text-sm ${location.pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'}`}>
              Home
            </Link>

            <Link to="/report" className={`transition font-medium text-sm ${location.pathname === '/report' ? 'text-white' : 'text-white/70 hover:text-white'}`}>
              Report a Fault
            </Link>

            {user?.role === 'Officer' && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 transition font-medium text-sm ${location.pathname === '/dashboard' ? 'text-emerald-400' : 'text-white/70 hover:text-white'}`}
              >
                <LayoutDashboard size={15} />
                Officer Dashboard
              </Link>
            )}

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-white/90 font-medium text-sm">{user.name}</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
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
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/70 hover:text-white focus:outline-none p-2 rounded-md transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-2 bg-black/60 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-2xl mx-4">
          <div className="flex flex-col">
            <Link to="/" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/report" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Report a Fault
            </Link>

            {user?.role === 'Officer' && (
              <Link to="/dashboard" className="text-emerald-400 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
