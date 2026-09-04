import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';

import ReportForm from './components/ReportForm';

import Dashboard from './pages/Dashboard';

// Placeholder component for pages that are not implemented yet
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        <p className="text-gray-600">
          This page is under construction.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route
              path="/report"
              element={<ReportForm />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/login"
              element={<PlaceholderPage title="Login" />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
