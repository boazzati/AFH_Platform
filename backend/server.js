const express = require('express');
const app = express();

// Basic CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://afhapp.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({
    message: 'Test server is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

app.post('/api/ai/chat', (req, res) => {
  console.log('AI Chat endpoint hit');
  res.json({
    success: true,
    response: 'Test response - CORS is working!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});
