import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const MapSection = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = () => {
      const stored = localStorage.getItem('fence_reports');
      if (stored) {
        setReports(JSON.parse(stored));
      }
    };

    loadReports();
    // Listen for storage events (if changed in another tab) or custom events
    window.addEventListener('storage', loadReports);
    return () => window.removeEventListener('storage', loadReports);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Live Map</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Recent Fault Reports
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            View the latest crowdsourced reports of electric fence faults and elephant breaches across Sri Lanka.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-[600px] w-full relative z-0">
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
              <Marker key={report.id} position={[report.lat, report.lng]}>
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-gray-900 mb-1 border-b pb-1">Fence ID: {report.fenceId}</h3>
                    <p className="text-sm my-1"><span className="font-semibold">District:</span> {report.district}</p>
                    <p className="text-sm my-1"><span className="font-semibold">Damage:</span> {report.damageType}</p>
                    <p className="text-sm my-1 flex items-center">
                      <span className="font-semibold mr-2">Urgency:</span> 
                      <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                        report.urgency === 'Critical' ? 'bg-rose-500' :
                        report.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        {report.urgency}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Reported: {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
