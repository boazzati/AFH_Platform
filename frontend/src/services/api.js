import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afhplatform-production.up.railway.app'
  : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Added timeout
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
  analyzePartnership: (data) => api.post('/api/analyze-partnership', data), // Added /api
  getMarketSignals: () => api.get('/api/market-signals'), // Added /api
  getPlaybooks: () => api.get('/api/playbooks'), // Added /api
};

// Dashboard.jsx - Overview Data
export const dashboardApi = {
  getOverview: () => Promise.all([
    api.get('/api/market-signals'), // Added /api
    api.get('/api/playbooks'), // Added /api
    api.get('/api/projects'), // Added /api
    api.get('/api/experts') // Added /api
  ]),
  getHealth: () => api.get('/api/health'), // Added /api
};

// DataIntegration.jsx - Market Data
export const dataIntegrationApi = {
  getMarketSignals: () => api.get('/api/market-signals'), // Added /api
  createMarketSignal: (data) => api.post('/api/market-signals', data), // Added /api
};

// ExecutionEngine.jsx - Projects
export const executionEngineApi = {
  getProjects: () => api.get('/api/projects'), // Added /api
  createProject: (data) => api.post('/api/projects', data), // Added /api
  updateProject: (id, data) => api.put(`/api/projects/${id}`, data), // Added /api
};

// ExpertNetwork.jsx - Experts
export const expertNetworkApi = {
  getExperts: () => api.get('/api/experts'), // Added /api
  createExpert: (data) => api.post('/api/experts', data), // Added /api
};

// MarketMapping.jsx - Market Analysis
export const marketMappingApi = {
  getMarketSignals: () => api.get('/api/market-signals'), // Added /api
  createMarketSignal: (data) => api.post('/api/market-signals', data), // Added /api
  analyzeTrends: (data) => api.post('/api/ai/analyze-trends', data), // Added /api
};

// PlaybookGenerator.jsx - Playbooks
export const playbookGeneratorApi = {
  getPlaybooks: () => api.get('/api/playbooks'), // Added /api
  createPlaybook: (data) => api.post('/api/playbooks', data), // Added /api
  generatePlaybook: (data) => api.post('/api/ai/generate-playbook', data), // Added /api
};

// Crawling APIs - ADDED THIS NEW SECTION
export const crawlingAPI = {
  crawlWebsite: (data) => api.post('/api/crawl/website', data),
  crawlMenuData: (data) => api.post('/api/crawl/menu-data', data),
};

// Generic API functions for components that need direct access
export const marketSignalsAPI = {
  getAll: () => api.get('/api/market-signals'), // Added /api
  create: (data) => api.post('/api/market-signals', data), // Added /api
};

export const playbookAPI = {
  getAll: () => api.get('/api/playbooks'), // Added /api
  create: (data) => api.post('/api/playbooks', data), // Added /api
};

export const projectAPI = {
  getAll: () => api.get('/api/projects'), // Added /api
  create: (data) => api.post('/api/projects', data), // Added /api
};

export const expertAPI = {
  getAll: () => api.get('/api/experts'), // Added /api
  create: (data) => api.post('/api/experts', data), // Added /api
};

export const partnershipAPI = {
  analyze: (data) => api.post('/api/analyze-partnership', data), // Added /api
};

export const healthCheck = () => api.get('/api/health'); // Added /api

export default api;
