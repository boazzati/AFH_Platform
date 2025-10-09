import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Import components
import Dashboard from './pages/Dashboard';
import MarketMapping from './pages/MarketMapping';
import PlaybookGenerator from './pages/PlaybookGenerator';
import ExecutionEngine from './pages/ExecutionEngine';
import DataIntegration from './pages/DataIntegration';
import ExpertNetwork from './pages/ExpertNetwork';
import AgenticAI from './pages/AgenticAI';
import Benchmarking from './pages/Benchmarking';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import OutreachAutomation from './pages/OutreachAutomation';

// Navigation and onboarding components
import Navigation from './components/Navigation';
import OnboardingTour from './components/OnboardingTour';

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
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

function AppContent() {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('afhPlatformOnboardingCompleted');
    const hasSkippedOnboarding = localStorage.getItem('afhPlatformOnboardingSkipped');
    
    // Show onboarding for new users
    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      // Delay to allow page to load
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
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
          <Route path="/predictive-analytics" element={<PredictiveAnalytics />} />
          <Route path="/outreach-automation" element={<OutreachAutomation />} />
        </Routes>
      </Box>
      
      {/* Onboarding Tour */}
      <OnboardingTour
        open={showOnboarding}
        onClose={handleCloseOnboarding}
        currentPage={location.pathname}
      />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
