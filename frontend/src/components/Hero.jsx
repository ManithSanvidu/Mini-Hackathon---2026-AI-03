import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gray-50 pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              Protecting Communities
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
              Track & Monitor with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">FenceGuard LK</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Report electric fence faults instantly. Empowering farmers and wildlife volunteers to safeguard communities and protect wild Asian elephants in Sri Lanka.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/report" 
                className="inline-flex justify-center items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Report a Fault
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/dashboard"
                className="inline-flex justify-center items-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <PlayCircle className="h-5 w-5 text-gray-500" />
                Live Dashboard
              </Link>
            </div>
          </div>

          {/* Right Side: Unsplash Image */}
          <div className="relative lg:ml-auto w-full max-w-lg lg:max-w-none mx-auto">
            <div className="h-72 sm:h-80 md:h-96 lg:h-[500px] w-full relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 border border-gray-100 group">
              
              {/* Unsplash Image */}
              <img 
                src="https://plus.unsplash.com/premium_photo-1687773505806-468b916d0962?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Wild Elephant in Sri Lanka" 
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <p className="font-semibold text-lg">Real-time Monitoring</p>
                  <p className="text-sm text-gray-200">Safeguarding wildlife and locals</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
