// Railway-optimized server
console.log('🚀 Starting AFH Platform server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

const express = require('express');
console.log('✅ Express loaded');

const app = express();
console.log('✅ Express app created');

// CORS middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} from ${req.headers.origin || 'no-origin'}`);
  
  res.header('Access-Control-Allow-Origin', 'https://afhapp.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
console.log('✅ Middleware configured');

// Routes
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint accessed');
  res.json({
    message: 'AFH Platform API is running on Railway!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    node: process.version,
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/ai/chat', (req, res) => {
  console.log('🤖 AI Chat endpoint accessed');
  console.log('Request body:', req.body);
  
  const { prompt } = req.body;
  
  if (!prompt) {
    console.log('❌ No prompt provided');
    return res.status(400).json({
      success: false,
      message: 'Prompt is required'
    });
  }
  
  console.log('✅ Sending response');
  res.json({
    success: true,
    response: `Echo: ${prompt} (Railway CORS working!)`,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❓ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('💥 Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Server startup - Railway provides PORT via environment variable
const PORT = process.env.PORT || 3000;
console.log(`🔧 Attempting to start server on port ${PORT}`);
console.log(`🌍 PORT environment variable: ${process.env.PORT || 'not set'}`);

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎉 Server successfully started on port ${PORT}`);
    console.log(`🌐 Server accessible at http://0.0.0.0:${PORT}`);
    console.log('✅ Ready to accept connections');
  });

  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

} catch (error) {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
}

console.log('📝 Server setup complete');

module.exports = app;
