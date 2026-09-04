import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

// Fix for default marker icon in leaflet with webpack/vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

// Approximate coordinates for major Sri Lankan districts
const districtCoordinates = {
  'Anuradhapura': [8.3114, 80.4037],
  'Polonnaruwa': [7.9403, 81.0188],
  'Ampara': [7.2912, 81.6724],
  'Kurunegala': [7.4818, 80.3609],
  'Hambantota': [6.1248, 81.1185],
  'Monaragala': [6.8728, 81.3507],
  'Trincomalee': [8.5874, 81.2152]
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
        if (!controller.signal.aborted) {
          setReports(response.data);
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

  // District centers are approximate, not measured incident coordinates.
  const getCoordinates = district => districtCoordinates[district] || [7.8731, 80.7718];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        {/* Header inside the container */}
        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white">Live Incident Map: Sri Lanka</h2>
          <p className="mt-2 text-sm text-gray-300 font-sans">
            Active reports by approximate district location. Updated every 30 seconds.
          </p>
        </div>

        {error && <p role="alert" className="mb-4 text-amber-200">{error}</p>}
        {!loading && !error && reports.length === 0 && <p className="mb-4 text-gray-200">No active faults reported.</p>}
        {/* Map Container */}
        <div className="rounded-xl overflow-hidden shadow-inner border border-white/10 h-[500px] sm:h-[600px] w-full relative z-0">
          {loading ? (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-emerald-400 font-medium">Loading Active Faults...</p>
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
                <Marker key={report._id} position={getCoordinates(report.district)}>
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[180px]">
                      <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1 text-sm">
                        Fence ID: {report.fenceId || 'N/A'}
                      </h3>
                      <p className="text-xs my-1 text-gray-700">
                        <span className="font-semibold text-gray-900">District:</span> {report.district}
                      </p>
                      <p className="text-xs my-1 text-gray-700">
                        <span className="font-semibold text-gray-900">Damage:</span> {report.damageType}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide ${
                          report.urgency === 'Critical' ? 'bg-rose-500' :
                          report.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                          {report.urgency}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${
                          report.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          report.status === 'In-Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
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
