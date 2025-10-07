const express = require('express');
const cors = require('cors');

const app = express();

// ===== CORS CONFIGURATION =====
const allowedOrigins = [
  'https://afhapp.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 Request from origin:', origin);
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ No origin - allowing request');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ===== ROUTES =====
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint hit');
  res.json({
    message: '🚀 AFH Platform API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    cors: 'Configured',
    version: '1.0.1'
  });
});

app.get('/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cors: 'configured'
  });
});

// AI Chat endpoint - simplified for testing
app.post('/api/ai/chat', (req, res) => {
  console.log('🤖 AI Chat endpoint hit from origin:', req.headers.origin);
  console.log('📝 Request body:', req.body);
  
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'Prompt is required'
    });
  }
  
  // Return a simple response for now
  res.json({
    success: true,
    response: `Echo: ${prompt} (CORS is working!)`,
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❓ 404 for:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('💥 Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`✅ CORS configured for: ${allowedOrigins.join(', ')}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
