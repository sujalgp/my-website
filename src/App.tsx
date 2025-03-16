import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { FindMechanicPage } from './pages/FindMechanicPage';
import { SupportPage } from './pages/SupportPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { RegisterMechanicPage } from './pages/RegisterMechanicPage';
import { WhatsAppSupport } from './components/WhatsAppSupport';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-mechanic" element={<FindMechanicPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/register-mechanic" element={<RegisterMechanicPage />} />
        </Routes>
        <WhatsAppSupport />
      </div>
    </Router>
  );
}

export default App;