import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="bg-gray-50 py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
          Ready to safeguard your community?
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join farmers and wildlife volunteers in crowdsourcing electric fence fault reporting. Help us prevent encroachments before they happen.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/report" 
            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Report a Fault
          </Link>
          <Link 
            to="/dashboard" 
            className="inline-flex justify-center items-center px-8 py-4 border border-gray-300 text-lg font-semibold rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
