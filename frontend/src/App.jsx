import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Import components
import PepsiCoDashboard from './pages/PepsiCoDashboard';
import Dashboard from './pages/Dashboard';
import GrowthOpportunities from './pages/GrowthOpportunities';
import PartnershipEngine from './pages/PartnershipEngine';
import SuccessTracking from './pages/SuccessTracking';

// Legacy pages for backward compatibility
import MarketMapping from './pages/MarketMapping';
import PlaybookGenerator from './pages/PlaybookGenerator';
import ExecutionEngine from './pages/ExecutionEngine';
import DataIntegration from './pages/DataIntegration';
import ExpertNetwork from './pages/ExpertNetwork';
import AgenticAI from './pages/AgenticAI';
import Benchmarking from './pages/Benchmarking';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import OutreachAutomation from './pages/OutreachAutomation';
import IntelligentMatching from './pages/IntelligentMatching';

// Navigation and onboarding components
import PepsiCoNavigation from './components/PepsiCoNavigation';
import OnboardingTour from './components/OnboardingTour';

// PepsiCo Theme
import { pepsicoBrandTheme } from './theme/pepsico-theme';



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
      <PepsiCoNavigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          {/* New PepsiCo Simplified Routes */}
          <Route path="/" element={<PepsiCoDashboard />} />
          <Route path="/growth-opportunities" element={<GrowthOpportunities />} />
          <Route path="/partnership-engine" element={<PartnershipEngine />} />
          <Route path="/success-tracking" element={<SuccessTracking />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/market-mapping" element={<GrowthOpportunities />} />
          <Route path="/predictive-analytics" element={<GrowthOpportunities />} />
          <Route path="/intelligent-matching" element={<GrowthOpportunities />} />
          <Route path="/playbook-generator" element={<PartnershipEngine />} />
          <Route path="/execution-engine" element={<PartnershipEngine />} />
          <Route path="/outreach-automation" element={<PartnershipEngine />} />
          <Route path="/agentic-ai" element={<PartnershipEngine />} />
          <Route path="/expert-network" element={<SuccessTracking />} />
          <Route path="/benchmarking" element={<SuccessTracking />} />
          <Route path="/data-integration" element={<SuccessTracking />} />
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
    <ThemeProvider theme={pepsicoBrandTheme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
