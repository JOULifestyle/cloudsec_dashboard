import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CSPMScanPage from './pages/CspmScanPage';
import CWPPScanPage from './pages/CWPPScanPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import PolicyViolationsPage from './pages/PolicyViolationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/scan/cspm" element={<ProtectedRoute><CSPMScanPage /></ProtectedRoute>} />
            <Route path="/scan/cwpp" element={<ProtectedRoute><CWPPScanPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><ScanHistoryPage /></ProtectedRoute>} />
            <Route path="/policy-violations" element={<ProtectedRoute><PolicyViolationsPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
