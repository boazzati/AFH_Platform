import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://afhapp-1f9346a8427b.herokuapp.com/api'  // Correct Heroku backend
  : 'http://localhost:3001/api';  // Fixed port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Services
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  generateEmail: (data) => api.post('/ai/generate-email', data),
  analyzeTrends: (data) => api.post('/ai/analyze-trends', data),
  generatePlaybook: (data) => api.post('/ai/generate-playbook', data),
};

// Market Signals API (Updated to match your backend)
export const marketSignalsAPI = {
  getAll: () => api.get('/market-signals'),
  create: (data) => api.post('/market-signals', data),
};

// Playbook API
export const playbookAPI = {
  getAll: () => api.get('/playbooks'),
  create: (data) => api.post('/playbooks', data),
};

// Projects API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
};

// Expert API
export const expertAPI = {
  getAll: () => api.get('/experts'),
  create: (data) => api.post('/experts', data),
};

// Partnership Analysis API
export const partnershipAPI = {
  analyze: (data) => api.post('/analyze-partnership', data),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
