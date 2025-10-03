import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketMapping from './pages/MarketMapping';
import PlaybookGenerator from './pages/PlaybookGenerator';
import ExecutionEngine from './pages/ExecutionEngine';
import DataIntegration from './pages/DataIntegration';
import ExpertNetwork from './pages/ExpertNetwork';
import AgenticAI from './pages/AgenticAI';
import Benchmarking from './pages/Benchmarking';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/market-mapping" element={<MarketMapping />} />
              <Route path="/playbook-generator" element={<PlaybookGenerator />} />
              <Route path="/execution-engine" element={<ExecutionEngine />} />
              <Route path="/data-integration" element={<DataIntegration />} />
              <Route path="/expert-network" element={<ExpertNetwork />} />
              <Route path="/agentic-ai" element={<AgenticAI />} />
              <Route path="/benchmarking" element={<Benchmarking />} />
            </Routes>
          </div>
        </main>
        
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
