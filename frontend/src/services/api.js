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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// AgenticAI.jsx - AI Services
export const agenticAIApi = {
  chat: (data) => api.post('/api/ai/chat', data),
  generateEmail: (data) => api.post('/api/ai/generate-email', data),
  analyzeTrends: (data) => api.post('/api/ai/analyze-trends', data),
  generatePlaybook: (data) => api.post('/api/ai/generate-playbook', data),
};

// Benchmarking.jsx - Analysis and Comparison
export const benchmarkingApi = {
  analyzePartnership: (data) => api.post('/api/analyze-partnership', data),
  getMarketSignals: () => api.get('/api/market-signals'),
  getPlaybooks: () => api.get('/api/playbooks'),
};

// Dashboard.jsx - Overview Data
export const dashboardApi = {
  getOverview: () => Promise.all([
    api.get('/api/market-signals'),
    api.get('/api/playbooks'),
    api.get('/api/projects'),
    api.get('/api/experts')
  ]),
  getHealth: () => api.get('/api/health'),
};

// DataIntegration.jsx - Market Data
export const dataIntegrationApi = {
  getMarketSignals: () => api.get('/api/market-signals'),
  createMarketSignal: (data) => api.post('/api/market-signals', data),
};

// ExecutionEngine.jsx - Projects
export const executionEngineApi = {
  getProjects: () => api.get('/api/projects'),
  createProject: (data) => api.post('/api/projects', data),
  updateProject: (id, data) => api.put(`/api/projects/${id}`, data),
};

// ExpertNetwork.jsx - Experts
export const expertNetworkApi = {
  getExperts: () => api.get('/api/experts'),
  createExpert: (data) => api.post('/api/experts', data),
};

// MarketMapping.jsx - Market Analysis
export const marketMappingApi = {
  getMarketSignals: () => api.get('/api/market-signals'),
  createMarketSignal: (data) => api.post('/api/market-signals', data),
  analyzeTrends: (data) => api.post('/api/ai/analyze-trends', data),
};

// FIX: Add this alias for MarketMapping component compatibility
export const marketMappingAPI = marketMappingApi;

// PlaybookGenerator.jsx - Playbooks
export const playbookGeneratorApi = {
  getPlaybooks: () => api.get('/api/playbooks'),
  createPlaybook: (data) => api.post('/api/playbooks', data),
  generatePlaybook: (data) => api.post('/api/ai/generate-playbook', data),
};

// Crawling APIs
export const crawlingAPI = {
  crawlWebsite: (data) => api.post('/api/crawl/website', data),
  crawlMenuData: (data) => api.post('/api/crawl/menu-data', data),
};

// Generic API functions for components that need direct access
export const marketSignalsAPI = {
  getAll: () => api.get('/api/market-signals'),
  create: (data) => api.post('/api/market-signals', data),
};

export const playbookAPI = {
  getAll: () => api.get('/api/playbooks'),
  create: (data) => api.post('/api/playbooks', data),
};

export const projectAPI = {
  getAll: () => api.get('/api/projects'),
  create: (data) => api.post('/api/projects', data),
};

export const expertAPI = {
  getAll: () => api.get('/api/experts'),
  create: (data) => api.post('/api/experts', data),
};

export const partnershipAPI = {
  analyze: (data) => api.post('/api/analyze-partnership', data),
};

export const healthCheck = () => api.get('/api/health');

export default api;
