const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');

// Import services
const DataIngestionService = require('./services/dataIngestionService');
const DataProcessingService = require('./services/dataProcessingService');
const AutomationService = require('./services/automationService');
const PredictiveAnalyticsService = require('./services/predictiveAnalyticsService');
const TrendForecastingService = require('./services/trendForecastingService');
const RiskRevenueAnalysisService = require('./services/riskRevenueAnalysisService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const dataIngestionService = new DataIngestionService();
const dataProcessingService = new DataProcessingService();
const automationService = new AutomationService();
const predictiveAnalyticsService = new PredictiveAnalyticsService();
const trendForecastingService = new TrendForecastingService();
const riskRevenueAnalysisService = new RiskRevenueAnalysisService();

console.log('🚀 Starting AFH Platform server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://afhapp.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    console.log(`🌐 CORS request from origin: ${origin}`);
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('✅ Express loaded');
console.log('✅ Express app created');

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('✅ Middleware configured');

// MongoDB connection
let mongoConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      mongoConnected = true;
    })
    .catch((error) => {
      console.log('⚠️ MongoDB connection failed:', error.message);
      console.log('📝 Server will continue without MongoDB');
    });
} else {
  console.log('⚠️ No MongoDB URI provided, running without database');
}

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoConnected ? 'connected' : 'disconnected',
      ai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      crawler: process.env.CRAWL4AI_API_URL ? 'configured' : 'not configured',
      automation: automationService.isRunning() ? 'running' : 'stopped'
    },
    cors: {
      allowedOrigins: ['https://afhapp.netlify.app', 'http://localhost:3000', 'http://localhost:5173']
    }
  };
  
  console.log('🏥 Health check requested');
  res.json(health);
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    console.log('🤖 AI Chat request received');
    const { message, agentType = 'market-analyst', context = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const { OpenAI } = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Agent-specific system prompts
    const systemPrompts = {
      'market-analyst': 'You are an expert AFH (Away From Home) market analyst. Provide insights on market trends, opportunities, and competitive landscape in the food service industry.',
      'outreach-generator': 'You are an expert at generating personalized outreach emails for AFH market opportunities. Create compelling, professional communications.',
      'competitive-intel': 'You are a competitive intelligence specialist for the AFH market. Analyze competitive positioning and strategic recommendations.',
      'strategy-advisor': 'You are a strategic advisor for AFH market expansion. Provide high-level strategic guidance and recommendations.'
    };

    const systemPrompt = systemPrompts[agentType] || systemPrompts['market-analyst'];

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content;
    console.log('✅ AI response generated');

    res.json({
      response: aiResponse,
      agentType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process AI request',
      details: error.message 
    });
  }
});

// Market Signals endpoints
app.get('/api/market-signals', async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.json([]);
    }

    const signals = await mongoose.connection.db
      .collection('market-signals')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    res.json(signals);
  } catch (error) {
    console.error('Error fetching market signals:', error);
    res.status(500).json({ error: 'Failed to fetch market signals' });
  }
});

app.post('/api/market-signals', async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const signalData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongoose.connection.db
      .collection('market-signals')
      .insertOne(signalData);

    res.status(201).json({ 
      message: 'Market signal created successfully',
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating market signal:', error);
    res.status(500).json({ error: 'Failed to create market signal' });
  }
});

// Automation endpoints
app.get('/api/automation/status', async (req, res) => {
  try {
    const status = await automationService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting automation status:', error);
    res.status(500).json({ error: 'Failed to get automation status' });
  }
});

app.get('/api/automation/metrics', async (req, res) => {
  try {
    const metrics = await automationService.getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error getting automation metrics:', error);
    res.status(500).json({ error: 'Failed to get automation metrics' });
  }
});

app.get('/api/automation/alerts', async (req, res) => {
  try {
    const alerts = await automationService.getAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting automation alerts:', error);
    res.status(500).json({ error: 'Failed to get automation alerts' });
  }
});

app.post('/api/automation/start', async (req, res) => {
  try {
    const result = await automationService.start();
    res.json(result);
  } catch (error) {
    console.error('Error starting automation:', error);
    res.status(500).json({ error: 'Failed to start automation' });
  }
});

app.post('/api/automation/stop', async (req, res) => {
  try {
    const result = await automationService.stop();
    res.json(result);
  } catch (error) {
    console.error('Error stopping automation:', error);
    res.status(500).json({ error: 'Failed to stop automation' });
  }
});

app.post('/api/automation/trigger', async (req, res) => {
  try {
    const { mode = 'manual' } = req.body;
    const result = await automationService.triggerCollection(mode);
    res.json(result);
  } catch (error) {
    console.error('Error triggering automation:', error);
    res.status(500).json({ error: 'Failed to trigger automation' });
  }
});

// PREDICTIVE ANALYTICS ENDPOINTS

// Opportunity Scoring
app.get('/api/analytics/scoring-statistics', async (req, res) => {
  try {
    const statistics = await predictiveAnalyticsService.getScoringStatistics();
    res.json(statistics);
  } catch (error) {
    console.error('Error getting scoring statistics:', error);
    res.status(500).json({ error: 'Failed to get scoring statistics' });
  }
});

app.post('/api/analytics/score-opportunity/:id', async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const opportunity = await mongoose.connection.db
      .collection('market-signals')
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const scoring = await predictiveAnalyticsService.scoreOpportunity(opportunity);
    
    // Update the opportunity with scoring results
    await mongoose.connection.db
      .collection('market-signals')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { scoring, updatedAt: new Date() } }
      );

    res.json(scoring);
  } catch (error) {
    console.error('Error scoring opportunity:', error);
    res.status(500).json({ error: 'Failed to score opportunity' });
  }
});

// Trend Forecasting
app.get('/api/analytics/trend-forecast', async (req, res) => {
  try {
    const { timeHorizon = '12-months' } = req.query;
    const forecast = await trendForecastingService.generateTrendForecast(timeHorizon);
    res.json(forecast);
  } catch (error) {
    console.error('Error generating trend forecast:', error);
    res.status(500).json({ error: 'Failed to generate trend forecast' });
  }
});

app.get('/api/analytics/trend-summary', async (req, res) => {
  try {
    const summary = await trendForecastingService.getTrendForecastSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error getting trend summary:', error);
    res.status(500).json({ error: 'Failed to get trend summary' });
  }
});

// Risk Assessment
app.post('/api/analytics/risk-assessment/:id', async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const opportunity = await mongoose.connection.db
      .collection('market-signals')
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const riskAssessment = await riskRevenueAnalysisService.performRiskAssessment(opportunity);
    res.json(riskAssessment);
  } catch (error) {
    console.error('Error performing risk assessment:', error);
    res.status(500).json({ error: 'Failed to perform risk assessment' });
  }
});

// Revenue Prediction
app.post('/api/analytics/revenue-prediction/:id', async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const opportunity = await mongoose.connection.db
      .collection('market-signals')
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const revenuePrediction = await riskRevenueAnalysisService.predictRevenuePotential(opportunity);
    res.json(revenuePrediction);
  } catch (error) {
    console.error('Error predicting revenue:', error);
    res.status(500).json({ error: 'Failed to predict revenue' });
  }
});

// Comprehensive Analysis
app.post('/api/analytics/comprehensive-analysis/:id', async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const opportunity = await mongoose.connection.db
      .collection('market-signals')
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    console.log(`🔍 Running comprehensive analysis for: ${opportunity.title}`);
    
    const analysis = await riskRevenueAnalysisService.getComprehensiveAnalysis(opportunity);
    
    // Update the opportunity with analysis results
    await mongoose.connection.db
      .collection('market-signals')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { 
          $set: { 
            comprehensiveAnalysis: analysis,
            scoring: analysis.riskAssessment ? {
              overallScore: analysis.opportunityScore?.overall || 50,
              priority: analysis.opportunityScore?.recommendation || 'evaluate',
              successProbability: Math.round((analysis.riskAssessment.riskAdjustments?.successProbability || 0.5) * 100),
              confidence: analysis.overallConfidence || 50
            } : undefined,
            updatedAt: new Date() 
          } 
        }
      );

    res.json(analysis);
  } catch (error) {
    console.error('Error running comprehensive analysis:', error);
    res.status(500).json({ error: 'Failed to run comprehensive analysis' });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/overview', async (req, res) => {
  try {
    const overview = {
      totalOpportunities: 0,
      activeProjects: 0,
      totalExperts: 0,
      automationStatus: automationService.isRunning() ? 'active' : 'inactive'
    };

    if (mongoConnected) {
      const [opportunities, projects, experts] = await Promise.all([
        mongoose.connection.db.collection('market-signals').countDocuments(),
        mongoose.connection.db.collection('projects').countDocuments(),
        mongoose.connection.db.collection('experts').countDocuments()
      ]);

      overview.totalOpportunities = opportunities;
      overview.activeProjects = projects;
      overview.totalExperts = experts;
    }

    res.json(overview);
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    res.status(500).json({ error: 'Failed to get dashboard overview' });
  }
});

// Web Crawling endpoints
app.post('/api/crawl/website', async (req, res) => {
  try {
    const result = await dataIngestionService.crawlWebsite(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error crawling website:', error);
    res.status(500).json({ error: 'Failed to crawl website' });
  }
});

app.post('/api/crawl/menu-data', async (req, res) => {
  try {
    const result = await dataIngestionService.crawlMenuData(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error crawling menu data:', error);
    res.status(500).json({ error: 'Failed to crawl menu data' });
  }
});

// Other AI endpoints
app.post('/api/ai/generate-email', async (req, res) => {
  try {
    // Implementation for email generation
    res.json({ message: 'Email generation endpoint - implementation needed' });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

app.post('/api/ai/analyze-trends', async (req, res) => {
  try {
    // Implementation for trend analysis
    res.json({ message: 'Trend analysis endpoint - implementation needed' });
  } catch (error) {
    console.error('Error analyzing trends:', error);
    res.status(500).json({ error: 'Failed to analyze trends' });
  }
});

app.post('/api/ai/generate-playbook', async (req, res) => {
  try {
    // Implementation for playbook generation
    res.json({ message: 'Playbook generation endpoint - implementation needed' });
  } catch (error) {
    console.error('Error generating playbook:', error);
    res.status(500).json({ error: 'Failed to generate playbook' });
  }
});

// Placeholder endpoints for other collections
app.get('/api/playbooks', (req, res) => {
  res.json([]);
});

app.post('/api/playbooks', (req, res) => {
  res.status(201).json({ message: 'Playbook created successfully' });
});

app.get('/api/projects', (req, res) => {
  res.json([]);
});

app.post('/api/projects', (req, res) => {
  res.status(201).json({ message: 'Project created successfully' });
});

app.get('/api/experts', (req, res) => {
  res.json([]);
});

app.post('/api/experts', (req, res) => {
  res.status(201).json({ message: 'Expert created successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❓ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Start server
console.log('🔧 Attempting to start server on port', PORT);
console.log('📝 Server setup complete');

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 Server successfully started on port', PORT);
  console.log('🌐 Server accessible at http://0.0.0.0:' + PORT);
  console.log('✅ Ready to accept connections');
  
  // Start automation service
  automationService.start().catch(error => {
    console.error('⚠️ Failed to start automation service:', error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    if (mongoConnected) {
      mongoose.connection.close();
    }
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    if (mongoConnected) {
      mongoose.connection.close();
    }
    process.exit(0);
  });
});

module.exports = app;
