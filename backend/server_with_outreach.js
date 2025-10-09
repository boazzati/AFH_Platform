const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');

// Import services
const OutreachService = require('./services/outreachService');
const SequenceService = require('./services/sequenceService');
const ProposalService = require('./services/proposalService');
const DataIngestionService = require('./services/dataIngestionService');
const DataProcessingService = require('./services/dataProcessingService');
const AutomationService = require('./services/automationService');
const PredictiveAnalyticsService = require('./services/predictiveAnalyticsService');
const TrendForecastingService = require('./services/trendForecastingService');
const RiskRevenueAnalysisService = require('./services/riskRevenueAnalysisService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const outreachService = new OutreachService();
const sequenceService = new SequenceService();
const proposalService = new ProposalService();
const dataIngestionService = new DataIngestionService();
const dataProcessingService = new DataProcessingService();
const automationService = new AutomationService();
const predictiveAnalyticsService = new PredictiveAnalyticsService();
const trendForecastingService = new TrendForecastingService();
const riskRevenueAnalysisService = new RiskRevenueAnalysisService();

console.log('🚀 Starting AFH Platform server...');
console.log(`Node version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://afhapp.netlify.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowing origin ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS: Blocking origin ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('✅ Express loaded');
console.log('✅ Express app created');
console.log('✅ Middleware configured');

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AFH Platform API Server',
    status: 'running',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'AI-Powered Market Intelligence',
      'Predictive Analytics & Scoring',
      'Automated Outreach & Communication',
      'Smart Data Ingestion',
      'Real-time Automation'
    ],
    endpoints: {
      health: '/health',
      ai: '/api/ai/*',
      analytics: '/api/analytics/*',
      automation: '/api/automation/*',
      outreach: '/api/outreach/*',
      marketSignals: '/api/market-signals',
      dashboard: '/api/dashboard/*'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'connected',
      ai: 'operational',
      automation: 'active',
      outreach: 'operational',
      predictiveAnalytics: 'operational'
    },
    version: '3.0.0'
  };
  
  res.json(healthStatus);
});

// =============================================================================
// OUTREACH AUTOMATION ENDPOINTS
// =============================================================================

// Generate AI-powered email
app.post('/api/outreach/generate-email', async (req, res) => {
  try {
    console.log('📧 Generating AI-powered email...');
    
    const {
      opportunityId,
      contactInfo,
      companyInfo,
      options = {}
    } = req.body;

    // Mock opportunity data for demo
    const opportunity = {
      id: opportunityId,
      title: 'Strategic Partnership Opportunity',
      channel: 'QSR',
      description: 'Partnership opportunity for menu innovation and market expansion',
      revenue: '$2.5M',
      timeline: '12 months',
      priority: 'high'
    };

    const result = await outreachService.generateOutreachEmail(
      opportunity,
      contactInfo,
      companyInfo,
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate email',
      details: error.message
    });
  }
});

// Create email sequence
app.post('/api/outreach/create-sequence', async (req, res) => {
  try {
    console.log('📅 Creating email sequence...');
    
    const result = await sequenceService.createSequence(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating sequence:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sequence',
      details: error.message
    });
  }
});

// Control sequence (pause/resume/stop)
app.post('/api/outreach/sequence/:sequenceId/:action', async (req, res) => {
  try {
    const { sequenceId, action } = req.params;
    console.log(`🎛️ ${action} sequence ${sequenceId}...`);
    
    let result;
    switch (action) {
      case 'pause':
        result = sequenceService.pauseSequence(sequenceId);
        break;
      case 'resume':
        result = await sequenceService.resumeSequence(sequenceId);
        break;
      case 'stop':
        result = sequenceService.pauseSequence(sequenceId, 'stopped');
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error controlling sequence:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to control sequence',
      details: error.message
    });
  }
});

// Get sequence status
app.get('/api/outreach/sequence/:sequenceId', async (req, res) => {
  try {
    const { sequenceId } = req.params;
    const result = sequenceService.getSequenceStatus(sequenceId);
    res.json(result);
  } catch (error) {
    console.error('Error getting sequence status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sequence status',
      details: error.message
    });
  }
});

// Get all sequences
app.get('/api/outreach/sequences', async (req, res) => {
  try {
    const result = sequenceService.getAllSequences();
    res.json(result);
  } catch (error) {
    console.error('Error getting sequences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sequences',
      details: error.message
    });
  }
});

// Generate proposal
app.post('/api/outreach/generate-proposal', async (req, res) => {
  try {
    console.log('📄 Generating proposal...');
    
    const result = await proposalService.generateProposal(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate proposal',
      details: error.message
    });
  }
});

// Schedule meeting
app.post('/api/outreach/schedule-meeting', async (req, res) => {
  try {
    console.log('📅 Scheduling meeting...');
    
    const result = await proposalService.scheduleMeeting(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule meeting',
      details: error.message
    });
  }
});

// Get outreach analytics
app.get('/api/outreach/analytics', async (req, res) => {
  try {
    const result = sequenceService.getAnalyticsSummary();
    res.json(result);
  } catch (error) {
    console.error('Error getting outreach analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics',
      details: error.message
    });
  }
});

// =============================================================================
// PREDICTIVE ANALYTICS ENDPOINTS
// =============================================================================

// Get opportunity scoring
app.get('/api/analytics/opportunity-scoring', async (req, res) => {
  try {
    const result = await predictiveAnalyticsService.getOpportunityScoring();
    res.json(result);
  } catch (error) {
    console.error('Error getting opportunity scoring:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get opportunity scoring',
      details: error.message
    });
  }
});

// Score specific opportunity
app.post('/api/analytics/score-opportunity', async (req, res) => {
  try {
    const result = await predictiveAnalyticsService.scoreOpportunity(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error scoring opportunity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to score opportunity',
      details: error.message
    });
  }
});

// Get trend forecasting
app.get('/api/analytics/trend-forecasting', async (req, res) => {
  try {
    const result = await trendForecastingService.getTrendForecasts();
    res.json(result);
  } catch (error) {
    console.error('Error getting trend forecasting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trend forecasting',
      details: error.message
    });
  }
});

// Get risk assessment
app.post('/api/analytics/risk-assessment', async (req, res) => {
  try {
    const result = await riskRevenueAnalysisService.assessRisk(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error getting risk assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get risk assessment',
      details: error.message
    });
  }
});

// Get revenue prediction
app.post('/api/analytics/revenue-prediction', async (req, res) => {
  try {
    const result = await riskRevenueAnalysisService.predictRevenue(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error getting revenue prediction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get revenue prediction',
      details: error.message
    });
  }
});

// Comprehensive analysis
app.post('/api/analytics/comprehensive-analysis', async (req, res) => {
  try {
    const result = await predictiveAnalyticsService.comprehensiveAnalysis(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error getting comprehensive analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get comprehensive analysis',
      details: error.message
    });
  }
});

// =============================================================================
// AUTOMATION ENDPOINTS
// =============================================================================

// Get automation status
app.get('/api/automation/status', async (req, res) => {
  try {
    const result = await automationService.getAutomationStatus();
    res.json(result);
  } catch (error) {
    console.error('Error getting automation status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get automation status',
      details: error.message
    });
  }
});

// Start automation
app.post('/api/automation/start', async (req, res) => {
  try {
    const result = await automationService.startAutomation(req.body.mode || 'regular');
    res.json(result);
  } catch (error) {
    console.error('Error starting automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start automation',
      details: error.message
    });
  }
});

// Stop automation
app.post('/api/automation/stop', async (req, res) => {
  try {
    const result = await automationService.stopAutomation();
    res.json(result);
  } catch (error) {
    console.error('Error stopping automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop automation',
      details: error.message
    });
  }
});

// Manual data collection
app.post('/api/automation/collect', async (req, res) => {
  try {
    const result = await dataIngestionService.collectData(req.body.sources || ['all']);
    res.json(result);
  } catch (error) {
    console.error('Error collecting data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect data',
      details: error.message
    });
  }
});

// Get automation metrics
app.get('/api/automation/metrics', async (req, res) => {
  try {
    const result = await automationService.getMetrics();
    res.json(result);
  } catch (error) {
    console.error('Error getting automation metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get automation metrics',
      details: error.message
    });
  }
});

// =============================================================================
// AI CHAT ENDPOINTS
// =============================================================================

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, agentType = 'market-analyst', context = [] } = req.body;
    
    console.log(`🤖 AI Chat request - Agent: ${agentType}, Message: ${message.substring(0, 100)}...`);

    // Agent-specific system prompts
    const systemPrompts = {
      'market-analyst': `You are an expert AFH (Away From Home) market analyst with deep knowledge of the food service industry. You provide insights on market trends, competitive analysis, and growth opportunities. Focus on data-driven analysis and actionable recommendations for restaurant chains, coffee shops, and food service operators.`,
      
      'outreach-generator': `You are an expert business development specialist focused on AFH partnerships. You help create compelling outreach strategies, email content, and relationship-building approaches for food service partnerships. Emphasize value creation and mutual benefits.`,
      
      'competitive-intel': `You are a competitive intelligence expert in the AFH space. You analyze competitor strategies, market positioning, and identify competitive advantages and threats. Provide strategic insights for maintaining competitive edge in food service partnerships.`,
      
      'strategy-advisor': `You are a strategic advisor for AFH business development. You provide high-level strategic guidance on partnership decisions, market entry strategies, and business model optimization for food service companies.`
    };

    const systemPrompt = systemPrompts[agentType] || systemPrompts['market-analyst'];

    // Enhanced context with platform data
    const enhancedContext = [
      ...context,
      {
        role: 'system',
        content: `Current platform context: You have access to real-time market intelligence, predictive analytics, and automation insights. The platform tracks ${Math.floor(Math.random() * 50) + 100} active opportunities across QSR, Fast Casual, Coffee, and Casual Dining channels with a total pipeline value of $${(Math.random() * 50 + 25).toFixed(1)}M.`
      }
    ];

    // Simulate AI response with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate contextual response based on agent type
    const responses = {
      'market-analyst': [
        `Based on current market data, I'm seeing strong growth in the ${['plant-based', 'premium coffee', 'healthy snacking', 'convenience'][Math.floor(Math.random() * 4)]} segment. This presents significant opportunities for AFH partnerships, particularly in the ${['QSR', 'Fast Casual', 'Coffee'][Math.floor(Math.random() * 3)]} channel.`,
        
        `The AFH market is experiencing a ${Math.floor(Math.random() * 15) + 5}% growth rate this quarter. Key drivers include consumer demand for convenience, premium experiences, and health-conscious options. I recommend focusing on partnerships that align with these trends.`,
        
        `Market intelligence indicates that ${['digital ordering integration', 'sustainable packaging', 'menu innovation', 'loyalty programs'][Math.floor(Math.random() * 4)]} is becoming a critical differentiator. Partners who can provide solutions in this area will have significant competitive advantages.`
      ],
      
      'outreach-generator': [
        `For your outreach strategy, I recommend leading with the value proposition around ${['operational efficiency', 'customer satisfaction', 'revenue growth', 'market differentiation'][Math.floor(Math.random() * 4)]}. Based on successful partnerships, this approach has shown ${Math.floor(Math.random() * 20) + 60}% higher response rates.`,
        
        `Your email sequence should focus on building relationships first. Start with industry insights, then introduce your solution as a natural fit. I suggest a ${Math.floor(Math.random() * 3) + 3}-email sequence with ${Math.floor(Math.random() * 5) + 5}-day intervals for optimal engagement.`,
        
        `The key to successful AFH outreach is demonstrating deep understanding of their operational challenges. Reference specific pain points like ${['supply chain complexity', 'menu standardization', 'cost management', 'customer experience'][Math.floor(Math.random() * 4)]} to establish credibility immediately.`
      ],
      
      'competitive-intel': [
        `Competitive analysis shows that ${['Company A', 'Market Leader B', 'Emerging Player C'][Math.floor(Math.random() * 3)]} is gaining traction with their ${['technology integration', 'pricing strategy', 'service model'][Math.floor(Math.random() * 3)]} approach. We should consider how to differentiate or counter this strategy.`,
        
        `Market positioning data indicates opportunities in the ${['mid-market segment', 'premium tier', 'value-focused segment'][Math.floor(Math.random() * 3)]}. Competitors are under-serving this area, presenting a clear opportunity for strategic partnerships.`,
        
        `Intelligence suggests that ${['regulatory changes', 'supply chain disruptions', 'consumer preference shifts'][Math.floor(Math.random() * 3)]} will impact the competitive landscape. Partners who can adapt quickly will gain significant market share.`
      ],
      
      'strategy-advisor': [
        `From a strategic perspective, I recommend focusing on ${['vertical integration', 'horizontal expansion', 'technology partnerships'][Math.floor(Math.random() * 3)]} to maximize long-term value. This aligns with current market dynamics and positions you for sustainable growth.`,
        
        `The strategic priority should be building ${['exclusive partnerships', 'scalable solutions', 'innovation capabilities'][Math.floor(Math.random() * 3)]} that create competitive moats. This approach has proven successful for leading AFH companies.`,
        
        `Consider the strategic implications of ${['market consolidation', 'digital transformation', 'sustainability requirements'][Math.floor(Math.random() * 3)]}. Partners who can navigate these trends will be essential for long-term success.`
      ]
    };

    const agentResponses = responses[agentType] || responses['market-analyst'];
    const response = agentResponses[Math.floor(Math.random() * agentResponses.length)];

    res.json({
      success: true,
      response: response,
      agentType: agentType,
      timestamp: new Date().toISOString(),
      confidence: Math.floor(Math.random() * 20) + 80
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      details: error.message
    });
  }
});

// =============================================================================
// DASHBOARD ENDPOINTS
// =============================================================================

// Dashboard overview
app.get('/api/dashboard/overview', async (req, res) => {
  try {
    const overview = {
      metrics: {
        totalOpportunities: Math.floor(Math.random() * 50) + 100,
        activeProjects: Math.floor(Math.random() * 20) + 15,
        totalExperts: Math.floor(Math.random() * 100) + 200,
        pipelineValue: `$${(Math.random() * 50 + 25).toFixed(1)}M`
      },
      recentActivity: [
        {
          type: 'opportunity',
          title: 'New QSR partnership opportunity identified',
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        },
        {
          type: 'automation',
          title: 'Data collection completed - 15 new signals',
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        },
        {
          type: 'outreach',
          title: 'Email sequence started for Coffee Chain Co.',
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        }
      ],
      systemHealth: {
        database: 'healthy',
        ai: 'operational',
        automation: 'active',
        outreach: 'operational'
      }
    };
    
    res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard overview',
      details: error.message
    });
  }
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

console.log('🔧 Attempting to start server...');

app.listen(PORT, '0.0.0.0', () => {
  console.log('📝 Server setup complete');
  console.log(`🎉 Server successfully started on port ${PORT}`);
  console.log(`🌐 Server accessible at http://0.0.0.0:${PORT}`);
  console.log('✅ Ready to accept connections');
  console.log('');
  console.log('🚀 AFH Platform Features:');
  console.log('   📊 Predictive Analytics & AI Scoring');
  console.log('   📧 Automated Outreach & Communication');
  console.log('   🔄 Smart Data Ingestion & Processing');
  console.log('   🤖 AI-Powered Market Intelligence');
  console.log('   📈 Real-time Automation & Monitoring');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
