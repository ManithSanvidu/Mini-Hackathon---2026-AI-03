import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

// 1. Fix the Vite / Leaflet Default Marker Icon Bug using Leaflet CDN URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 2. District-to-Coordinate Mapping Dictionary
const districtCoordinates = {
  'Anuradhapura': [8.3114, 80.4037],
  'Polonnaruwa': [7.9403, 81.0188],
  'Ampara': [7.2912, 81.6724],
  'Kurunegala': [7.4863, 80.3623],
  'Hambantota': [6.1429, 81.1212],
  'Monaragala': [6.8728, 81.3507],
  'Trincomalee': [8.5874, 81.2152],
  'Matale': [7.4675, 80.6234],
  'Puttalam': [8.0408, 79.8394]
};

const MapSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let timer;
    const fetchReports = async () => {
      try {
        const response = await api.get('/api/faults/map', { signal: controller.signal });
        if (!Array.isArray(response.data)) throw new Error('Invalid map response');
        if (!controller.signal.aborted) {
          setReports(response.data.filter(report => report && typeof report._id === 'string' && typeof report.status === 'string' && report.status.toLowerCase() !== 'repaired'));
          setError(null);
        }
      } catch {
        if (!controller.signal.aborted) setError('Unable to refresh reports. Map data may be unavailable or out of date.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          timer = setTimeout(fetchReports, 30000);
        }
      }
    };
    fetchReports();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  // Stable offsets distinguish reports without moving markers on each refresh.
  // Positions represent approximate district locations, not measured GPS points.
  const getCoordinates = (district, id) => {
    const base = districtCoordinates[district] || [7.8731, 80.7718];
    let hash = 0;
    for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return [base[0] + ((hash % 101) / 100 - 0.5) * 0.04,
      base[1] + ((Math.floor(hash / 101) % 101) / 100 - 0.5) * 0.04];
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        {/* Header inside the container */}
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white">Live Incident Map: Sri Lanka</h2>
          <p className="mt-2 text-sm text-gray-300 font-sans max-w-2xl">
            Active reports by approximate district location. Click markers for details. Map auto-refreshes every 30 seconds.
          </p>
        </div>

        {error && <p role="alert" className="mb-4 text-amber-200">{error}</p>}
        {!loading && !error && reports.length === 0 && <p className="mb-4 text-gray-200">No active faults reported.</p>}
        {/* Map Container */}
        <div className="rounded-xl overflow-hidden shadow-inner border border-white/10 h-[500px] sm:h-[600px] w-full relative z-0">
          {loading && reports.length === 0 ? (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-emerald-400 font-medium tracking-wide">Loading Active Faults...</p>
            </div>
          ) : (
            <MapContainer 
              center={[7.8731, 80.7718]} 
              zoom={7} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {reports.map((report) => (
                <Marker key={report._id} position={getCoordinates(report.district, report._id)}>
                  {/* 4. Marker Popups & UI Styling (dark-mode friendly) */}
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[200px] bg-gray-900 text-white rounded-lg -m-3 shadow-2xl border border-white/10">
                      <h3 className="font-bold text-gray-100 mb-2 border-b border-gray-700 pb-2 text-sm">
                        Fence ID: {report.fenceId || 'N/A'}
                      </h3>
                      <p className="text-xs my-1.5 text-gray-300">
                        <span className="font-semibold text-emerald-400 mr-1">District:</span> {report.district}
                      </p>
                      <p className="text-xs my-1.5 text-gray-300">
                        <span className="font-semibold text-emerald-400 mr-1">Damage:</span> {report.damageType}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider ${
                          report.urgency === 'Critical' ? 'bg-rose-600' :
                          report.urgency === 'Medium' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                          {report.urgency}
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          report.status?.toLowerCase() === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
