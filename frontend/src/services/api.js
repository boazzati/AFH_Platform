import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afhplatform-production.up.railway.app'  // New Railway backend
  : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AgenticAI.jsx - AI Services
export const agenticAIApi = {
  chat: (data) => api.post('/api/ai/chat', data), // Make sure it has /api/
  generateEmail: (data) => api.post('/api/ai/generate-email', data),
  analyzeTrends: (data) => api.post('/api/ai/analyze-trends', data),
  generatePlaybook: (data) => api.post('/api/ai/generate-playbook', data),
};

// Benchmarking.jsx - Analysis and Comparison
export const benchmarkingApi = {
  analyzePartnership: (data) => api.post('/analyze-partnership', data),
  getMarketSignals: () => api.get('/market-signals'),
  getPlaybooks: () => api.get('/playbooks'),
};

// Dashboard.jsx - Overview Data
export const dashboardApi = {
  getOverview: () => Promise.all([
    api.get('/market-signals'),
    api.get('/playbooks'),
    api.get('/projects'),
    api.get('/experts')
  ]),
  getHealth: () => api.get('/health'),
};

// DataIntegration.jsx - Market Data
export const dataIntegrationApi = {
  getMarketSignals: () => api.get('/market-signals'),
  createMarketSignal: (data) => api.post('/market-signals', data),
  // Add other data sources as needed
};

// ExecutionEngine.jsx - Projects
export const executionEngineApi = {
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
};

// ExpertNetwork.jsx - Experts
export const expertNetworkApi = {
  getExperts: () => api.get('/experts'),
  createExpert: (data) => api.post('/experts', data),
};

// MarketMapping.jsx - Market Analysis
export const marketMappingApi = {
  getMarketSignals: () => api.get('/market-signals'),
  createMarketSignal: (data) => api.post('/market-signals', data),
  analyzeTrends: (data) => api.post('/ai/analyze-trends', data),
};

// PlaybookGenerator.jsx - Playbooks
export const playbookGeneratorApi = {
  getPlaybooks: () => api.get('/playbooks'),
  createPlaybook: (data) => api.post('/playbooks', data),
  generatePlaybook: (data) => api.post('/ai/generate-playbook', data),
};

// Generic API functions for components that need direct access
export const marketSignalsAPI = {
  getAll: () => api.get('/market-signals'),
  create: (data) => api.post('/market-signals', data),
};

export const playbookAPI = {
  getAll: () => api.get('/playbooks'),
  create: (data) => api.post('/playbooks', data),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
};

export const expertAPI = {
  getAll: () => api.get('/experts'),
  create: (data) => api.post('/experts', data),
};

export const partnershipAPI = {
  analyze: (data) => api.post('/analyze-partnership', data),
};

export const healthCheck = () => api.get('/health');

export default api;
