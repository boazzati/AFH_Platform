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

export default api;
