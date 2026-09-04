import { Link } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 group-hover:bg-emerald-500/30 transition">
                <ShieldAlert size={24} />
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-wide">EleGuard LK</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition font-medium text-sm">
              Home
            </Link>
            <Link to="/report" className="text-white/80 hover:text-white transition font-medium text-sm">
              Report a Fault
            </Link>
            <Link to="/dashboard" className="text-white/80 hover:text-white transition font-medium text-sm">
              Officer Dashboard
            </Link>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition backdrop-blur-sm shadow-lg">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-2 bg-black/60 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex flex-col">
            <Link to="/" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/report" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Report a Fault
            </Link>
            <Link to="/dashboard" className="text-white/90 hover:bg-white/10 px-6 py-4 border-b border-white/5 font-medium transition" onClick={() => setIsOpen(false)}>
              Officer Dashboard
            </Link>
            <Link to="/login" className="text-emerald-400 hover:bg-white/10 px-6 py-4 font-semibold transition" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
