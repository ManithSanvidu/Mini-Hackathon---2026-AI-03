import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">FenceGuard LK</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering communities and wildlife volunteers to crowdsource electric fence fault reporting, reducing elephant encroachments in Sri Lanka.
            </p>
            <div className="flex space-x-4">
              <span className="text-emerald-400 font-bold">DWC Emergency Hotline: 1992</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/report" className="text-sm text-gray-400 hover:text-white transition-colors">Report a Fault</Link></li>
              <li><Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full"
              />
              <button 
                type="button" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center md:text-left md:flex md:justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FenceGuard LK. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex justify-center space-x-6 text-sm text-gray-400">
            <span>Designed for Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
