import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Jalur 1: Halaman Blog Utama untuk Pengunjung */}
        <Route path="/" element={<Home />} />
        
        {/* Jalur 2: Dashboard Backend Admin untuk Kelola CRUD */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;