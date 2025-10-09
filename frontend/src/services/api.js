import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afhplatform-production.up.railway.app'
  : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API services (lowercase - original)
export const agenticAIApi = {
  chat: (data) => api.post('/api/ai/chat', data),
  generateEmail: (data) => api.post('/api/ai/generate-email', data),
  analyzeTrends: (data) => api.post('/api/ai/analyze-trends', data),
  generatePlaybook: (data) => api.post('/api/ai/generate-playbook', data),
};

export const benchmarkingApi = {
  analyzePartnership: (data) => api.post('/api/analyze-partnership', data),
  getMarketSignals: () => api.get('/api/market-signals'),
  getPlaybooks: () => api.get('/api/playbooks'),
};

export const dataIntegrationApi = {
  getMarketSignals: () => api.get('/api/market-signals'),
  createMarketSignal: (data) => api.post('/api/market-signals', data),
};

export const executionEngineApi = {
  getProjects: () => api.get('/api/projects'),
  createProject: (data) => api.post('/api/projects', data),
  updateProject: (id, data) => api.put(`/api/projects/${id}`, data),
};

export const expertNetworkApi = {
  getExperts: () => api.get('/api/experts'),
  createExpert: (data) => api.post('/api/experts', data),
};

export const marketMappingApi = {
  getMarketSignals: () => api.get('/api/market-signals'),
  createMarketSignal: (data) => api.post('/api/market-signals', data),
  analyzeTrends: (data) => api.post('/api/ai/analyze-trends', data),
};

export const playbookGeneratorApi = {
  getPlaybooks: () => api.get('/api/playbooks'),
  createPlaybook: (data) => api.post('/api/playbooks', data),
  generatePlaybook: (data) => api.post('/api/ai/generate-playbook', data),
};

export const crawlingAPI = {
  crawlWebsite: (data) => api.post('/api/crawl/website', data),
  crawlMenuData: (data) => api.post('/api/crawl/menu-data', data),
};

// ADD THE MISSING DASHBOARD API
export const dashboardApi = {
  getOverview: () => api.get('/api/dashboard/overview'),
  getMetrics: () => api.get('/api/dashboard/metrics'),
  getRecentActivity: () => api.get('/api/dashboard/recent-activity'),
};

// AUTOMATION API
export const automationApi = {
  getStatus: async () => {
    try {
      const response = await api.get('/api/automation/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching automation status:', error);
      // Return mock data for now
      return {
        isRunning: true,
        activeTasks: ['urgent', 'regular', 'health'],
        metrics: {
          totalRuns: 45,
          successfulRuns: 42,
          failedRuns: 3,
          lastRunTime: new Date().toISOString(),
          averageProcessingTime: 15000,
          opportunitiesProcessed: 127
        }
      };
    }
  },

  getMetrics: async () => {
    try {
      const response = await api.get('/api/automation/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching automation metrics:', error);
      // Return mock data for now
      return {
        totalRuns: 45,
        successfulRuns: 42,
        failedRuns: 3,
        lastRunTime: new Date().toISOString(),
        lastSuccessTime: new Date().toISOString(),
        averageProcessingTime: 15000,
        opportunitiesProcessed: 127
      };
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/api/automation/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching automation alerts:', error);
      // Return mock data for now
      return [
        {
          type: 'high_priority_opportunities',
          message: '3 high-priority opportunities detected',
          timestamp: new Date().toISOString()
        },
        {
          type: 'collection_success',
          message: 'Successfully collected 15 new market signals',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
  },

  start: () => api.post('/api/automation/start'),
  stop: () => api.post('/api/automation/stop'),
  triggerCollection: (mode = 'manual') => api.post('/api/automation/trigger', { mode })
};

// ALIASES (uppercase - for component compatibility)
export const benchmarkingAPI = benchmarkingApi;
export const dataIntegrationAPI = dataIntegrationApi;
export const executionEngineAPI = executionEngineApi;
export const expertNetworkAPI = expertNetworkApi;
export const marketMappingAPI = marketMappingApi;
export const playbookGeneratorAPI = playbookGeneratorApi;
export const dashboardAPI = dashboardApi; // Add this alias

// Note: agenticAIApi is already exported above and doesn't need an alias
// Note: crawlingAPI is already uppercase

// PREDICTIVE ANALYTICS API
export const predictiveAnalyticsApi = {
  getScoringStatistics: () => api.get('/api/analytics/scoring-statistics'),
  getTrendForecast: () => api.get('/api/analytics/trend-forecast'),
  runComprehensiveAnalysis: (opportunityId) => api.post(`/api/analytics/comprehensive-analysis/${opportunityId}`),
  scoreOpportunity: (opportunityId) => api.post(`/api/analytics/score-opportunity/${opportunityId}`),
  getRiskAssessment: (opportunityId) => api.post(`/api/analytics/risk-assessment/${opportunityId}`),
  getRevenuePrediction: (opportunityId) => api.post(`/api/analytics/revenue-prediction/${opportunityId}`)
};

// INTELLIGENT MATCHING API
export const intelligentMatchingApi = {
  getOverview: () => api.get('/api/matching/overview'),
  matchProducts: (opportunity) => api.post('/api/matching/products', { opportunity }),
  runComprehensiveMatching: (opportunityId) => api.post('/api/matching/comprehensive', { opportunityId }),
  getExpertOverview: () => api.get('/api/experts/overview'),
  recommendExperts: (opportunity, requirements) => api.post('/api/experts/recommend', { opportunity, requirements }),
  getExpertsBySpecialization: (specialization) => api.get(`/api/experts/specialization/${specialization}`),
  getPlaybookOverview: () => api.get('/api/playbooks/overview'),
  recommendPlaybooks: (opportunity, context) => api.post('/api/playbooks/recommend', { opportunity, context }),
  generateNextBestActions: (opportunity, context) => api.post('/api/playbooks/actions', { opportunity, context })
};

// OUTREACH AUTOMATION API
export const outreachApi = {
  generateEmail: (data) => api.post('/api/outreach/generate-email', data),
  createSequence: (data) => api.post('/api/outreach/create-sequence', data),
  controlSequence: (sequenceId, action) => api.post(`/api/outreach/sequence/${sequenceId}/${action}`),
  getSequence: (sequenceId) => api.get(`/api/outreach/sequence/${sequenceId}`),
  getAllSequences: () => api.get('/api/outreach/sequences'),
  generateProposal: (data) => api.post('/api/outreach/generate-proposal', data),
  scheduleMeeting: (data) => api.post('/api/outreach/schedule-meeting', data),
  getAnalytics: () => api.get('/api/outreach/analytics')
};

export default api;
