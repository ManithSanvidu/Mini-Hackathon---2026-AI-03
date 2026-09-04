import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="bg-transparent py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-16 text-center border border-white/20 shadow-xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
            <span className="block text-emerald-400 mt-2">Join FenceGuard LK today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-300 max-w-2xl mx-auto">
            Whether you're a local farmer spotting a broken wire or a wildlife officer coordinating repairs, your input saves lives.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/report"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-emerald-500 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Report a Fault
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
