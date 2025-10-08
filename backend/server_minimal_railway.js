const express = require('express');
const app = express();

// Basic CORS for your Netlify app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://afhapp.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server running', status: 'OK' });
});

app.post('/api/ai/chat', (req, res) => {
  const { prompt } = req.body;
  res.json({
    success: true,
    response: `Echo: ${prompt || 'No prompt'}`
  });
});

// Start server - Railway handles the port
app.listen(process.env.PORT, () => {
  console.log('Server started on Railway');
});
