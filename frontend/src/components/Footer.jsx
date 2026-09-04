const Footer = () => {
  return (
    <footer className="bg-black/90 text-gray-400 py-8 border-t border-white/10 text-center text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} EleGuard LK. All rights reserved.
        </p>
        <p className="font-medium text-gray-300">
          Department of Wildlife Conservation Emergency Hotline:{' '}
          <span className="text-emerald-400 font-bold ml-1">1992</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
