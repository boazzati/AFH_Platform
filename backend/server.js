const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

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
      crawler: process.env.CRAWL4AI_API_URL ? 'configured' : 'not configured'
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

// PREDICTIVE ANALYTICS ENDPOINTS (Mock implementations for now)

// Opportunity Scoring
app.get('/api/analytics/scoring-statistics', async (req, res) => {
  try {
    const mockStatistics = {
      totalOpportunities: 45,
      averageScore: 72,
      highPriorityCount: 12,
      mediumPriorityCount: 23,
      lowPriorityCount: 10,
      channelDistribution: [
        { channel: 'QSR', count: 18, avgScore: 75 },
        { channel: 'Fast Casual', count: 12, avgScore: 78 },
        { channel: 'Casual Dining', count: 8, avgScore: 68 },
        { channel: 'Coffee Shops', count: 7, avgScore: 82 }
      ],
      recentScores: [
        { date: '2024-10-01', avgScore: 71 },
        { date: '2024-10-02', avgScore: 73 },
        { date: '2024-10-03', avgScore: 75 },
        { date: '2024-10-04', avgScore: 72 },
        { date: '2024-10-05', avgScore: 74 }
      ]
    };
    
    res.json(mockStatistics);
  } catch (error) {
    console.error('Error getting scoring statistics:', error);
    res.status(500).json({ error: 'Failed to get scoring statistics' });
  }
});

app.post('/api/analytics/score-opportunity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mockScoring = {
      opportunityId: id,
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      successProbability: Math.floor(Math.random() * 30) + 70, // 70-100%
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      factors: {
        channelRelevance: Math.floor(Math.random() * 20) + 80,
        marketTiming: Math.floor(Math.random() * 30) + 70,
        competitivePosition: Math.floor(Math.random() * 25) + 75,
        revenueSize: Math.floor(Math.random() * 35) + 65,
        executionComplexity: Math.floor(Math.random() * 40) + 60,
        strategicFit: Math.floor(Math.random() * 15) + 85
      },
      recommendations: [
        'Focus on channel-specific value proposition',
        'Accelerate timeline to capture market timing',
        'Develop competitive differentiation strategy'
      ]
    };

    res.json(mockScoring);
  } catch (error) {
    console.error('Error scoring opportunity:', error);
    res.status(500).json({ error: 'Failed to score opportunity' });
  }
});

// Trend Forecasting
app.get('/api/analytics/trend-forecast', async (req, res) => {
  try {
    const mockForecast = {
      timeHorizon: '12-months',
      overallConfidence: 85,
      trends: [
        {
          category: 'Consumer Behavior',
          trend: 'Health-conscious dining',
          confidence: 92,
          impact: 'high',
          timeline: 'Q1 2025',
          description: 'Increasing demand for healthier menu options'
        },
        {
          category: 'Technology',
          trend: 'AI-powered ordering',
          confidence: 78,
          impact: 'medium',
          timeline: 'Q2 2025',
          description: 'Adoption of AI chatbots for order taking'
        },
        {
          category: 'Economic',
          trend: 'Premium positioning',
          confidence: 85,
          impact: 'high',
          timeline: 'Q1 2025',
          description: 'Shift towards premium product positioning'
        }
      ],
      emergingOpportunities: [
        {
          title: 'Plant-based protein expansion',
          confidence: 88,
          potentialRevenue: '$2.5M',
          timeline: '6 months'
        },
        {
          title: 'Ghost kitchen partnerships',
          confidence: 75,
          potentialRevenue: '$1.8M',
          timeline: '9 months'
        }
      ],
      channelForecasts: [
        { channel: 'QSR', growth: 15, confidence: 90 },
        { channel: 'Fast Casual', growth: 22, confidence: 85 },
        { channel: 'Coffee Shops', growth: 18, confidence: 88 }
      ]
    };

    res.json(mockForecast);
  } catch (error) {
    console.error('Error generating trend forecast:', error);
    res.status(500).json({ error: 'Failed to generate trend forecast' });
  }
});

// Risk Assessment
app.post('/api/analytics/risk-assessment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mockRiskAssessment = {
      opportunityId: id,
      overallRiskScore: Math.floor(Math.random() * 30) + 20, // 20-50 (lower is better)
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      riskCategories: {
        market: { score: Math.floor(Math.random() * 20) + 15, impact: 'medium' },
        operational: { score: Math.floor(Math.random() * 25) + 20, impact: 'high' },
        financial: { score: Math.floor(Math.random() * 15) + 10, impact: 'low' },
        regulatory: { score: Math.floor(Math.random() * 30) + 25, impact: 'medium' },
        strategic: { score: Math.floor(Math.random() * 20) + 15, impact: 'high' }
      },
      topRisks: [
        'Market saturation in target segment',
        'Operational complexity of implementation',
        'Regulatory changes affecting product category'
      ],
      mitigationStrategies: [
        'Develop differentiated value proposition',
        'Phase implementation approach',
        'Monitor regulatory landscape closely'
      ]
    };

    res.json(mockRiskAssessment);
  } catch (error) {
    console.error('Error performing risk assessment:', error);
    res.status(500).json({ error: 'Failed to perform risk assessment' });
  }
});

// Revenue Prediction
app.post('/api/analytics/revenue-prediction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const baseRevenue = Math.floor(Math.random() * 2000000) + 500000; // $500K - $2.5M
    
    const mockRevenuePrediction = {
      opportunityId: id,
      scenarios: {
        conservative: {
          revenue: Math.floor(baseRevenue * 0.7),
          probability: 85,
          timeline: '18 months'
        },
        expected: {
          revenue: baseRevenue,
          probability: 65,
          timeline: '12 months'
        },
        optimistic: {
          revenue: Math.floor(baseRevenue * 1.5),
          probability: 35,
          timeline: '9 months'
        }
      },
      monthlyProjections: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        revenue: Math.floor(baseRevenue / 12 * (1 + i * 0.1))
      })),
      roiAnalysis: {
        investmentRequired: Math.floor(baseRevenue * 0.3),
        paybackPeriod: '14 months',
        roi: '240%'
      },
      confidence: Math.floor(Math.random() * 20) + 75 // 75-95%
    };

    res.json(mockRevenuePrediction);
  } catch (error) {
    console.error('Error predicting revenue:', error);
    res.status(500).json({ error: 'Failed to predict revenue' });
  }
});

// Comprehensive Analysis
app.post('/api/analytics/comprehensive-analysis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Running comprehensive analysis for opportunity: ${id}`);
    
    const overallScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const baseRevenue = Math.floor(Math.random() * 2000000) + 500000;
    
    const mockAnalysis = {
      opportunityId: id,
      overallScore,
      recommendation: overallScore >= 85 ? 'pursue' : overallScore >= 70 ? 'evaluate' : 'monitor',
      overallConfidence: Math.floor(Math.random() * 20) + 80,
      
      opportunityScore: {
        overall: overallScore,
        factors: {
          channelRelevance: Math.floor(Math.random() * 20) + 80,
          marketTiming: Math.floor(Math.random() * 30) + 70,
          competitivePosition: Math.floor(Math.random() * 25) + 75,
          revenueSize: Math.floor(Math.random() * 35) + 65,
          executionComplexity: Math.floor(Math.random() * 40) + 60,
          strategicFit: Math.floor(Math.random() * 15) + 85
        }
      },
      
      riskAssessment: {
        overallRiskScore: Math.floor(Math.random() * 30) + 20,
        riskLevel: 'medium',
        topRisks: [
          'Market saturation in target segment',
          'Operational complexity of implementation'
        ]
      },
      
      revenuePrediction: {
        expectedRevenue: baseRevenue,
        timeline: '12 months',
        confidence: Math.floor(Math.random() * 20) + 75
      },
      
      strategicInsights: [
        'Strong alignment with current market trends',
        'Moderate implementation complexity requires careful planning',
        'Revenue potential justifies investment requirements'
      ],
      
      nextSteps: [
        'Conduct detailed market research',
        'Develop implementation timeline',
        'Secure stakeholder buy-in'
      ]
    };

    res.json(mockAnalysis);
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
      automationStatus: 'inactive'
    };

    if (mongoConnected) {
      const [opportunities, projects, experts] = await Promise.all([
        mongoose.connection.db.collection('market-signals').countDocuments().catch(() => 0),
        mongoose.connection.db.collection('projects').countDocuments().catch(() => 0),
        mongoose.connection.db.collection('experts').countDocuments().catch(() => 0)
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

// Automation endpoints (mock for now)
app.get('/api/automation/status', (req, res) => {
  res.json({
    isRunning: true,
    activeTasks: ['health'],
    metrics: {
      totalRuns: 25,
      successfulRuns: 24,
      failedRuns: 1,
      lastRunTime: new Date().toISOString(),
      averageProcessingTime: 12000,
      opportunitiesProcessed: 67
    }
  });
});

app.get('/api/automation/metrics', (req, res) => {
  res.json({
    totalRuns: 25,
    successfulRuns: 24,
    failedRuns: 1,
    lastRunTime: new Date().toISOString(),
    lastSuccessTime: new Date().toISOString(),
    averageProcessingTime: 12000,
    opportunitiesProcessed: 67
  });
});

app.get('/api/automation/alerts', (req, res) => {
  res.json([
    {
      type: 'system_status',
      message: 'All systems operational',
      timestamp: new Date().toISOString()
    }
  ]);
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

// Root route
app.get('/', (req, res) => {
  console.log('🏠 Root route accessed');
  res.json({
    message: 'AFH Platform API Server',
    status: 'running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      ai: '/api/ai/*',
      analytics: '/api/analytics/*',
      automation: '/api/automation/*',
      marketSignals: '/api/market-signals',
      dashboard: '/api/dashboard/*'
    }
  });
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
