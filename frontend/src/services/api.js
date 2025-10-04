import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afhapp.herokuapp.com/api'  // Your Heroku backend
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Services - ADD THIS SECTION
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  generateEmail: (data) => api.post('/ai/generate-email', data),
  analyzeTrends: (data) => api.post('/ai/analyze-trends', data),
  generatePlaybook: (data) => api.post('/ai/generate-playbook', data),
};

// Market Mapping API
export const marketMappingAPI = {
  getAll: () => api.get('/market-mapping'),
  create: (data) => api.post('/market-mapping', data),
};

// Playbook API
export const playbookAPI = {
  getAll: () => api.get('/playbooks'),
  create: (data) => api.post('/playbooks', data),
};

// Execution API
export const executionAPI = {
  getAll: () => api.get('/executions'),
  create: (data) => api.post('/executions', data),
};

// Expert API
export const expertAPI = {
  getAll: () => api.get('/experts'),
  create: (data) => api.post('/experts', data),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
