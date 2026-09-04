import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

const Landing = () => {
  const [stats, setStats] = useState({
    activeFaults: 0,
    fencesRepaired: 0,
    monitoredFences: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Attempt to fetch from backend
        const response = await api.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats, using fallback data", error);
        // Fallback data in case backend is not running yet
        setStats({
          activeFaults: 14,
          fencesRepaired: 128,
          monitoredFences: 45
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div 
      className="flex flex-col min-h-screen relative bg-cover bg-center bg-no-repeat bg-fixed font-sans"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2069&auto=format&fit=crop')" }}
    >
      {/* Global Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-4xl w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white font-serif">
                Protecting Communities & Elephants
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200">
                Over 60% of elephant encroachments in Sri Lanka happen due to unmaintained community electric fences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/report" 
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-8 rounded-full text-lg transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center"
                >
                  Report a Fence Fault
                </Link>
                <Link 
                  to="/dashboard" 
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-bold py-3.5 px-8 rounded-full text-lg transition-all shadow-lg flex items-center justify-center"
                >
                  View Live Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Metrics Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-8 px-4 shadow-xl max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white tracking-wide">Live System Metrics</h2>
              <p className="mt-3 text-lg text-gray-300">Real-time status of our community electric fences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Metric Card 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 flex flex-col items-center text-center transform transition duration-500 hover:-translate-y-2">
                <div className="bg-rose-500/20 border border-rose-500/40 p-4 rounded-xl mb-5">
                  <AlertTriangle className="h-8 w-8 text-rose-400" />
                </div>
                <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Active Faults Reported</h3>
                <p className="text-5xl font-extrabold text-white tracking-tight">
                  {loading ? '...' : stats.activeFaults}
                </p>
              </div>

              {/* Metric Card 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 flex flex-col items-center text-center transform transition duration-500 hover:-translate-y-2">
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl mb-5">
                  <ShieldCheck className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Fences Repaired</h3>
                <p className="text-5xl font-extrabold text-white tracking-tight">
                  {loading ? '...' : stats.fencesRepaired}
                </p>
              </div>

              {/* Metric Card 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 flex flex-col items-center text-center transform transition duration-500 hover:-translate-y-2">
                <div className="bg-blue-500/20 border border-blue-500/40 p-4 rounded-xl mb-5">
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Monitored Fences</h3>
                <p className="text-5xl font-extrabold text-white tracking-tight">
                  {loading ? '...' : stats.monitoredFences}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 sm:p-12 shadow-2xl">
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1588665301826-6d5b0bf66c88?q=80&w=2070&auto=format&fit=crop" 
                  alt="Elephant close up" 
                  className="rounded-2xl shadow-2xl w-full border border-white/10"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">The Human-Elephant Conflict</h2>
                <div className="space-y-4 text-lg text-gray-300 mb-8 leading-relaxed">
                  <p>
                    In Sri Lanka, the human-elephant conflict is a critical issue that affects both rural communities and wildlife populations. A major contributor to this problem is the failure of electric fences designed to keep elephants out of villages and agricultural lands.
                  </p>
                  <p>
                    When these fences are not maintained properly, they become ineffective. Our platform empowers communities to report fence faults quickly, ensuring timely repairs and preventing dangerous encounters.
                  </p>
                </div>
                <ul className="space-y-5">
                  <li className="flex items-center bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex-shrink-0 bg-emerald-500/20 p-2 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="ml-4 text-base text-gray-200 font-medium">Community-driven reporting for immediate action</p>
                  </li>
                  <li className="flex items-center bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex-shrink-0 bg-emerald-500/20 p-2 rounded-lg">
                      <Activity className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="ml-4 text-base text-gray-200 font-medium">Real-time monitoring of fence status</p>
                  </li>
                  <li className="flex items-center bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex-shrink-0 bg-emerald-500/20 p-2 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="ml-4 text-base text-gray-200 font-medium">Alerting authorities before encroachments occur</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
