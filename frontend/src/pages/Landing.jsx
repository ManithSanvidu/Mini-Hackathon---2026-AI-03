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
        console.error('Error fetching stats', error);
        setStats({ activeFaults: 'Unavailable', fencesRepaired: 'Unavailable', monitoredFences: 'Unavailable' });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80"
            alt="Elephants in the wild"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Protecting Communities and Elephants
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8 text-gray-200">
            Over 60% of elephant encroachments in Sri Lanka happen due to unmaintained community electric fences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/report"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Report a Fence Fault
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg flex items-center justify-center"
            >
              View Live Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Live Metrics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Live System Metrics</h2>
            <p className="mt-4 text-lg text-gray-600">Real-time status of our community electric fences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Metric Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Active Faults Reported</h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {loading ? '...' : stats.activeFaults}
              </p>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Fences Repaired</h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {loading ? '...' : stats.fencesRepaired}
              </p>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Fences Reported</h3>
              <p className="text-4xl font-extrabold text-gray-900">
                {loading ? '...' : stats.monitoredFences}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80"
                alt="Elephant close up"
                className="rounded-xl shadow-2xl w-full"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Human-Elephant Conflict</h2>
              <p className="text-lg text-gray-700 mb-6">
                In Sri Lanka, the human-elephant conflict is a critical issue that affects both rural communities and wildlife populations. A major contributor to this problem is the failure of electric fences designed to keep elephants out of villages and agricultural lands.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                When these fences are not maintained properly, they become ineffective. Our platform empowers communities to report fence faults quickly, ensuring timely repairs and preventing dangerous encounters.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Community-driven reporting for immediate action</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Real-time monitoring of fence status</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Alerting authorities before encroachments occur</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
