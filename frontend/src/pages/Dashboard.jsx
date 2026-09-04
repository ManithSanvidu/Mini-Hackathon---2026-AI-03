import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, AlertCircle, Clock, CheckCircle, FileText, RefreshCw } from 'lucide-react';
import axios from 'axios';

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

  // Dynamic Districts derived from data
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(faults.map(f => f.district))].filter(Boolean).sort();
    return ['All', ...uniqueDistricts];
  }, [faults]);

  // Fetch Data from Backend
  const fetchFaults = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/faults';
      const params = new URLSearchParams();
      
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (districtFilter !== 'All') params.append('district', districtFilter);
      
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
    fetchFaults();
  }, [statusFilter, districtFilter]);

  // Client-side Search Logic
  const filteredFaults = useMemo(() => {
    if (!searchTerm) return faults;
    
    return faults.filter(fault => {
      const idString = fault.fenceId || fault._id || '';
      const districtString = fault.district || '';
      const damageString = fault.damageType || '';
      const phoneString = fault.phone || '';
      
      return idString.toLowerCase().includes(searchTerm.toLowerCase()) ||
             districtString.toLowerCase().includes(searchTerm.toLowerCase()) ||
             damageString.toLowerCase().includes(searchTerm.toLowerCase()) ||
             phoneString.includes(searchTerm);
    });
  }, [searchTerm, faults]);

  // Styling Helpers
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In-Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Repaired': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDistrictFilter('All');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor and review reported electric-fence faults.
            </p>
          </div>
          <button 
            onClick={() => fetchFaults()} 
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Reports</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{faults.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {faults.filter(f => f.status === 'Pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {faults.filter(f => f.status === 'In-Progress').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Repaired</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {faults.filter(f => f.status === 'Repaired').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-8 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search */}
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="Search ID, District, Type, Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown Filters */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center w-full sm:w-auto">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option disabled>Filter by Status</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status === 'In-Progress' ? 'In Progress' : status}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                >
                  <option disabled>Filter by District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 w-full sm:w-auto text-center font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => fetchFaults()}
                className="text-sm text-red-700 hover:text-red-900 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className="text-center py-20 bg-white shadow rounded-lg">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading reports...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {faults.length === 0 ? (
              /* Global Empty State */
              <div className="text-center py-16 px-4">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No fault reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no electric fence faults reported in the system.
                </p>
              </div>
            ) : filteredFaults.length === 0 ? (
              /* Filtered Empty State */
              <div className="text-center py-16 px-4">
                <Filter className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No matching reports</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No reports match your current search and filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Data Table / Grid */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fence ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Damage Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFaults.map((fault) => (
                      <tr key={fault._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fault.fenceId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.damageType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getUrgencyColor(fault.urgency)}`}>
                            {fault.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(fault.status)}`}>
                            {fault.status === 'In-Progress' ? 'In Progress' : fault.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
