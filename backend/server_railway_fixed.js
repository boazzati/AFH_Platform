// Railway-compliant server
console.log('🚀 Starting AFH Platform server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

const express = require('express');
console.log('✅ Express loaded');

const app = express();
console.log('✅ Express app created');

// CORS configuration using environment variable
const corsOptions = {
  origin: process.env.CLIENT_URL || "https://afhapp.netlify.app", // Frontend URL from environment
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept'],
  optionsSuccessStatus: 200
};

console.log('🌐 CORS origin set to:', corsOptions.origin);

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`📡 ${req.method} ${req.path} from origin: ${origin || 'no-origin'}`);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
console.log('✅ Middleware configured');

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: corsOptions.origin
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint accessed');
  res.json({
    message: 'AFH Platform API is running on Railway!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    node: process.version,
    env: process.env.NODE_ENV || 'development',
    cors: corsOptions.origin
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', (req, res) => {
  console.log('🤖 AI Chat endpoint accessed');
  console.log('Request origin:', req.headers.origin);
  console.log('Request body:', req.body);
  
  const { prompt } = req.body;
  
  if (!prompt) {
    console.log('❌ No prompt provided');
    return res.status(400).json({
      success: false,
      message: 'Prompt is required'
    });
  }
  
  console.log('✅ Sending AI response');
  res.json({
    success: true,
    response: `AI Response: ${prompt} (CORS working on Railway!)`,
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
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

// Railway server startup - let Railway assign the port automatically
const PORT = process.env.PORT;
console.log(`🔧 Railway PORT environment variable: ${PORT || 'not set'}`);

if (!PORT) {
  console.log('⚠️  No PORT environment variable - Railway should set this automatically');
}

try {
  const server = app.listen(PORT, () => {
    console.log(`🎉 Server successfully started on Railway-assigned port: ${PORT}`);
    console.log('✅ Ready to accept connections');
    console.log('🌐 CORS configured for:', corsOptions.origin);
  });

  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    }
    process.exit(1);
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

console.log('📝 Server setup complete - waiting for Railway PORT assignment');

module.exports = app;
