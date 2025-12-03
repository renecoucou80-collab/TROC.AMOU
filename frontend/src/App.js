import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import DonatePage from './pages/DonatePage';
import SalePage from './pages/SalePage';
import ListingsPage from './pages/ListingsPage';
import TipsPage from './pages/TipsPage';
import AdminLogin from './pages/AdminLogin';
import ElectricitePage from './pages/ElectricitePage';
import MaisonPage from './pages/MaisonPage';
import AutrePage from './pages/AutrePage';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/sell" element={<SalePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;