import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Import components
import Dashboard from './pages/Dashboard';
import MarketMapping from './pages/MarketMapping';
import PlaybookGenerator from './pages/PlaybookGenerator';
import ExecutionEngine from './pages/ExecutionEngine';
import DataIntegration from './pages/DataIntegration';
import ExpertNetwork from './pages/ExpertNetwork';
import AgenticAI from './pages/AgenticAI';
import Benchmarking from './pages/Benchmarking';

// Navigation component
import Navigation from './components/Navigation';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
