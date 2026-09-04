import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, AlertCircle, Clock, CheckCircle, FileText, RefreshCw } from 'lucide-react';
import axios from 'axios';
import StatusUpdateButton from '../components/StatusUpdateButton';

const STATUS_OPTIONS = ['All', 'Pending', 'In-Progress', 'Repaired'];

const Dashboard = () => {
  // State
  const [faults, setFaults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  
  // API States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Districts derived from data (fallback for empty state)
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(faults.map(f => f.district))].filter(Boolean).sort();
    return ['All', 'Anuradhapura', 'Polonnaruwa', 'Ampara', 'Kurunegala', 'Hambantota', 'Monaragala', 'Trincomalee', ...uniqueDistricts.filter(d => !['Anuradhapura', 'Polonnaruwa', 'Ampara', 'Kurunegala', 'Hambantota', 'Monaragala', 'Trincomalee'].includes(d))];
  }, [faults]);

  // Fetch Data from Backend
  const fetchFaults = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5001/api/faults';
      const params = new URLSearchParams();
      
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (districtFilter !== 'All') params.append('district', districtFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setFaults(response.data);
    } catch (err) {
      console.error("Error fetching faults:", err);
      setError("Failed to load fault reports. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the fetch when searchTerm changes
    const timer = setTimeout(() => {
      fetchFaults();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, districtFilter, searchTerm]);

  const handleStatusUpdate = (updatedFault) => {
    setFaults(prev => prev.map(f => f._id === updatedFault._id ? updatedFault : f));
  };

  // Styling Helpers
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'Low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      default: return 'bg-white/10 text-gray-300 border-white/20';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDistrictFilter('All');
  };

  return (
    <div 
      className="min-h-screen relative py-28 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2069&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif tracking-wide text-white">Officer Dashboard</h1>
            <p className="mt-2 text-sm font-sans font-light text-gray-300">
              Monitor and review reported electric-fence faults across districts.
            </p>
          </div>
          <button 
            onClick={() => fetchFaults()} 
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-black/60 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl rounded-2xl">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-white/10 rounded-xl p-3 border border-white/10">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">Total Reports</dt>
                  <dd className="text-2xl font-semibold text-white">{faults.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-black/60 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl rounded-2xl">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-rose-500/20 border border-rose-500/30 rounded-xl p-3">
                <AlertCircle className="h-6 w-6 text-rose-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">Critical Issues</dt>
                  <dd className="text-2xl font-semibold text-white">
                    {faults.filter(f => f.urgency === 'Critical').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-black/60 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl rounded-2xl">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">In Progress</dt>
                  <dd className="text-2xl font-semibold text-white">
                    {faults.filter(f => f.status === 'In-Progress').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-black/60 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl rounded-2xl">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">Repaired</dt>
                  <dd className="text-2xl font-semibold text-white">
                    {faults.filter(f => f.status === 'Repaired').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl mb-8 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search */}
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all sm:text-sm"
                placeholder="Search ID or Landmark..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown Filters */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center w-full sm:w-auto">
                <Filter className="h-5 w-5 text-white/50 mr-2" />
                <select
                  className="block w-full pl-3 pr-10 py-2.5 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent sm:text-sm rounded-lg appearance-none [&>option]:bg-gray-800 [&>option]:text-white transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option disabled value="">Filter by Status</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status === 'In-Progress' ? 'In Progress' : status}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <select
                  className="block w-full pl-3 pr-10 py-2.5 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent sm:text-sm rounded-lg appearance-none [&>option]:bg-gray-800 [&>option]:text-white transition-all"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                >
                  <option disabled value="">Filter by District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-300 hover:text-white w-full sm:w-auto text-center font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/50 backdrop-blur-md rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-rose-400 mr-3" />
              <p className="text-sm text-rose-100">{error}</p>
            </div>
            <button 
              onClick={() => fetchFaults()}
              className="text-sm text-rose-200 hover:text-white font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className="text-center py-20 bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-300 font-medium">Loading reports...</p>
          </div>
        ) : (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden rounded-2xl">
            {faults.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 px-4">
                <Search className="mx-auto h-12 w-12 text-white/40" />
                <h3 className="mt-4 text-lg font-medium text-white">No fault reports found</h3>
                <p className="mt-1 text-sm text-gray-400">
                  There are currently no reports matching your filters.
                </p>
                {(searchTerm || statusFilter !== 'All' || districtFilter !== 'All') && (
                  <button
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-white/20 shadow-sm text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              /* Data Table */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fence ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">District</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Damage Type</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Urgency</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Reported</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {faults.map((fault) => (
                      <tr key={fault._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{fault.fenceId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fault.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fault.damageType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fault.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border backdrop-blur-sm ${getUrgencyColor(fault.urgency)}`}>
                            {fault.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Use Dewmi's StatusUpdateButton for changing status */}
                          <StatusUpdateButton 
                            faultId={fault._id} 
                            currentStatus={fault.status} 
                            onUpdated={handleStatusUpdate} 
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(fault.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
