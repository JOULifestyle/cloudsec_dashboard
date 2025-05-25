import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CWPPResults from "./pages/CWPPResults";
import Landing from './components/Landing';
//import SteampipePage from "./pages/SteampipePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cwpp-results" element={<CWPPResults />} />
      </Routes>
    </Router>
  )
}
