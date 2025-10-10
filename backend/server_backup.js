const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

// Import all services
const DataIngestionService = require('./services/dataIngestionService');
const DataProcessingService = require('./services/dataProcessingService');
const AutomationService = require('./services/automationService');
const PredictiveAnalyticsService = require('./services/predictiveAnalyticsService');
const TrendForecastingService = require('./services/trendForecastingService');
const RiskRevenueAnalysisService = require('./services/riskRevenueAnalysisService');
const OutreachService = require('./services/outreachService');
const SequenceService = require('./services/sequenceService');
const ProposalService = require('./services/proposalService');
const MatchingService = require('./services/matchingService');
const ExpertRecommendationService = require('./services/expertRecommendationService');
const PlaybookIntelligenceService = require('./services/playbookIntelligenceService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize services
const dataIngestionService = new DataIngestionService();
const dataProcessingService = new DataProcessingService();
const automationService = new AutomationService();
const predictiveAnalyticsService = new PredictiveAnalyticsService();
const trendForecastingService = new TrendForecastingService();
const riskRevenueAnalysisService = new RiskRevenueAnalysisService();
const outreachService = new OutreachService();
const sequenceService = new SequenceService();
const proposalService = new ProposalService();
const matchingService = new MatchingService();
const expertRecommendationService = new ExpertRecommendationService();
const playbookIntelligenceService = new PlaybookIntelligenceService();

console.log('🚀 Starting AFH Platform server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://afhapp.netlify.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    console.log('🌐 CORS request from origin:', origin);
    
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

console.log('✅ Express loaded');
console.log('✅ Express app created');
console.log('✅ Middleware configured');

// Root route
app.get('/', (req, res) => {
  console.log('📍 Root route accessed');
  res.json({
    message: 'AFH Platform API Server',
    status: 'running',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      ai: '/api/ai/*',
      analytics: '/api/analytics/*',
      automation: '/api/automation/*',
      outreach: '/api/outreach/*',
      matching: '/api/matching/*',
      experts: '/api/experts/*',
      playbooks: '/api/playbooks/*',
      marketSignals: '/api/market-signals',
      dashboard: '/api/dashboard/*'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      ai: 'operational',
      automation: 'running',
      matching: 'active',
      experts: 'available',
      playbooks: 'loaded'
    },
    version: '3.0.0'
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    console.log('🤖 AI chat request received');
    const { message, agentType = 'general', context = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Agent-specific system prompts
    const systemPrompts = {
      'market-analyst': 'You are a market analyst specializing in the away-from-home food and beverage industry. Provide data-driven insights about market trends, opportunities, and competitive analysis.',
      'outreach-generator': 'You are an outreach specialist who creates compelling, personalized business development messages for the AFH industry. Focus on value propositions and partnership opportunities.',
      'competitive-intel': 'You are a competitive intelligence expert in the restaurant and foodservice industry. Analyze competitive landscapes, market positioning, and strategic opportunities.',
      'strategy-advisor': 'You are a strategic advisor for AFH partnerships. Provide strategic recommendations, risk assessments, and growth opportunities.',
      'general': 'You are an AI assistant for the AFH Platform, helping with market intelligence, partnership opportunities, and business development in the away-from-home food and beverage sector.'
    };

    const systemPrompt = systemPrompts[agentType] || systemPrompts['general'];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    console.log('✅ AI response generated');

    res.json({
      response: response,
      agentType: agentType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process AI request',
      details: error.message 
    });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/overview', (req, res) => {
  console.log('📊 Dashboard overview requested');
  res.json({
    marketSignals: 127,
    activeProjects: 23,
    expertNetwork: 45,
    automationStatus: 'active',
    recentActivity: [
      { type: 'signal', message: 'New QSR opportunity identified', timestamp: new Date().toISOString() },
      { type: 'project', message: 'Starbucks partnership progressing', timestamp: new Date().toISOString() },
      { type: 'expert', message: 'New expert added to network', timestamp: new Date().toISOString() }
    ]
  });
});

// Automation endpoints
app.get('/api/automation/status', (req, res) => {
  console.log('🤖 Automation status requested');
  const status = automationService.getAutomationStatus();
  res.json(status);
});

app.post('/api/automation/start', (req, res) => {
  console.log('▶️ Starting automation');
  const result = automationService.startAutomation();
  res.json(result);
});

app.post('/api/automation/stop', (req, res) => {
  console.log('⏹️ Stopping automation');
  const result = automationService.stopAutomation();
  res.json(result);
});

app.post('/api/automation/collect', async (req, res) => {
  try {
    console.log('🔄 Manual data collection triggered');
    const { mode = 'regular' } = req.body;
    const result = await dataIngestionService.collectMarketIntelligence(mode);
    res.json(result);
  } catch (error) {
    console.error('❌ Manual collection error:', error);
    res.status(500).json({ error: 'Failed to collect data', details: error.message });
  }
});

// Predictive Analytics endpoints
app.get('/api/analytics/opportunity-scoring', async (req, res) => {
  try {
    console.log('📈 Opportunity scoring requested');
    const result = await predictiveAnalyticsService.getOpportunityScoring();
    res.json(result);
  } catch (error) {
    console.error('❌ Opportunity scoring error:', error);
    res.status(500).json({ error: 'Failed to get opportunity scoring', details: error.message });
  }
});

app.get('/api/analytics/trend-forecasting', async (req, res) => {
  try {
    console.log('🔮 Trend forecasting requested');
    const result = await trendForecastingService.getForecastingAnalysis();
    res.json(result);
  } catch (error) {
    console.error('❌ Trend forecasting error:', error);
    res.status(500).json({ error: 'Failed to get trend forecasting', details: error.message });
  }
});

app.get('/api/analytics/risk-assessment', async (req, res) => {
  try {
    console.log('⚠️ Risk assessment requested');
    const result = await riskRevenueAnalysisService.getRiskAssessment();
    res.json(result);
  } catch (error) {
    console.error('❌ Risk assessment error:', error);
    res.status(500).json({ error: 'Failed to get risk assessment', details: error.message });
  }
});

app.get('/api/analytics/revenue-prediction', async (req, res) => {
  try {
    console.log('💰 Revenue prediction requested');
    const result = await riskRevenueAnalysisService.getRevenuePrediction();
    res.json(result);
  } catch (error) {
    console.error('❌ Revenue prediction error:', error);
    res.status(500).json({ error: 'Failed to get revenue prediction', details: error.message });
  }
});

app.post('/api/analytics/comprehensive-analysis', async (req, res) => {
  try {
    console.log('🔍 Comprehensive analysis requested');
    const { opportunityId } = req.body;
    const result = await predictiveAnalyticsService.runComprehensiveAnalysis(opportunityId);
    res.json(result);
  } catch (error) {
    console.error('❌ Comprehensive analysis error:', error);
    res.status(500).json({ error: 'Failed to run comprehensive analysis', details: error.message });
  }
});

// Outreach Automation endpoints
app.get('/api/outreach/overview', async (req, res) => {
  try {
    console.log('📧 Outreach overview requested');
    const result = await outreachService.getOutreachOverview();
    res.json(result);
  } catch (error) {
    console.error('❌ Outreach overview error:', error);
    res.status(500).json({ error: 'Failed to get outreach overview', details: error.message });
  }
});

app.post('/api/outreach/generate-email', async (req, res) => {
  try {
    console.log('✉️ Email generation requested');
    const { opportunityId, contactInfo, emailType, customization } = req.body;
    const result = await outreachService.generatePersonalizedEmail(opportunityId, contactInfo, emailType, customization);
    res.json(result);
  } catch (error) {
    console.error('❌ Email generation error:', error);
    res.status(500).json({ error: 'Failed to generate email', details: error.message });
  }
});

app.get('/api/outreach/sequences', async (req, res) => {
  try {
    console.log('📋 Sequences requested');
    const result = await sequenceService.getActiveSequences();
    res.json(result);
  } catch (error) {
    console.error('❌ Sequences error:', error);
    res.status(500).json({ error: 'Failed to get sequences', details: error.message });
  }
});

app.post('/api/outreach/sequences', async (req, res) => {
  try {
    console.log('➕ Creating new sequence');
    const { opportunityId, contactInfo, sequenceType, customization } = req.body;
    const result = await sequenceService.createSequence(opportunityId, contactInfo, sequenceType, customization);
    res.json(result);
  } catch (error) {
    console.error('❌ Create sequence error:', error);
    res.status(500).json({ error: 'Failed to create sequence', details: error.message });
  }
});

app.get('/api/outreach/proposals', async (req, res) => {
  try {
    console.log('📄 Proposals requested');
    const result = await proposalService.getProposals();
    res.json(result);
  } catch (error) {
    console.error('❌ Proposals error:', error);
    res.status(500).json({ error: 'Failed to get proposals', details: error.message });
  }
});

app.post('/api/outreach/proposals', async (req, res) => {
  try {
    console.log('📝 Generating proposal');
    const { opportunityId, requirements, customization } = req.body;
    const result = await proposalService.generateProposal(opportunityId, requirements, customization);
    res.json(result);
  } catch (error) {
    console.error('❌ Generate proposal error:', error);
    res.status(500).json({ error: 'Failed to generate proposal', details: error.message });
  }
});

// Intelligent Matching endpoints
app.get('/api/matching/overview', async (req, res) => {
  try {
    console.log('🎯 Matching overview requested');
    const stats = matchingService.getMatchingStatistics();
    res.json({
      success: true,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Matching overview error:', error);
    res.status(500).json({ error: 'Failed to get matching overview', details: error.message });
  }
});

app.post('/api/matching/products', async (req, res) => {
  try {
    console.log('🏭 Product matching requested');
    const { opportunity } = req.body;
    const result = await matchingService.matchOpportunityToProducts(opportunity);
    res.json(result);
  } catch (error) {
    console.error('❌ Product matching error:', error);
    res.status(500).json({ error: 'Failed to match products', details: error.message });
  }
});

app.post('/api/matching/comprehensive', async (req, res) => {
  try {
    console.log('🔍 Comprehensive matching requested');
    const { opportunityId } = req.body;
    
    // Mock opportunity for demonstration
    const mockOpportunity = {
      id: opportunityId,
      title: 'Starbucks Menu Innovation Partnership',
      channel: 'Coffee',
      description: 'Partnership opportunity for menu innovation and product development',
      priority: 'high',
      estimatedRevenue: '$3.2M'
    };

    // Run all matching services
    const [productMatches, expertRecommendations, playbookSuggestions, nextBestActions] = await Promise.all([
      matchingService.matchOpportunityToProducts(mockOpportunity),
      expertRecommendationService.recommendExperts(mockOpportunity),
      playbookIntelligenceService.recommendPlaybooks(mockOpportunity),
      playbookIntelligenceService.generateNextBestActions(mockOpportunity)
    ]);

    res.json({
      success: true,
      opportunity: mockOpportunity,
      productMatches: productMatches,
      expertRecommendations: expertRecommendations,
      playbookSuggestions: playbookSuggestions,
      nextBestActions: nextBestActions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Comprehensive matching error:', error);
    res.status(500).json({ error: 'Failed to run comprehensive matching', details: error.message });
  }
});

// Expert Recommendation endpoints
app.get('/api/experts/overview', async (req, res) => {
  try {
    console.log('👥 Expert overview requested');
    const stats = expertRecommendationService.getExpertStatistics();
    res.json({
      success: true,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Expert overview error:', error);
    res.status(500).json({ error: 'Failed to get expert overview', details: error.message });
  }
});

app.post('/api/experts/recommend', async (req, res) => {
  try {
    console.log('🎯 Expert recommendation requested');
    const { opportunity, requirements } = req.body;
    const result = await expertRecommendationService.recommendExperts(opportunity, requirements);
    res.json(result);
  } catch (error) {
    console.error('❌ Expert recommendation error:', error);
    res.status(500).json({ error: 'Failed to recommend experts', details: error.message });
  }
});

app.get('/api/experts/specialization/:specialization', async (req, res) => {
  try {
    console.log('🔍 Experts by specialization requested');
    const { specialization } = req.params;
    const result = await expertRecommendationService.getExpertsBySpecialization(specialization);
    res.json(result);
  } catch (error) {
    console.error('❌ Experts by specialization error:', error);
    res.status(500).json({ error: 'Failed to get experts by specialization', details: error.message });
  }
});

// Playbook Intelligence endpoints
app.get('/api/playbooks/overview', async (req, res) => {
  try {
    console.log('📚 Playbook overview requested');
    const stats = playbookIntelligenceService.getPlaybookStatistics();
    res.json({
      success: true,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Playbook overview error:', error);
    res.status(500).json({ error: 'Failed to get playbook overview', details: error.message });
  }
});

app.post('/api/playbooks/recommend', async (req, res) => {
  try {
    console.log('📖 Playbook recommendation requested');
    const { opportunity, context } = req.body;
    const result = await playbookIntelligenceService.recommendPlaybooks(opportunity, context);
    res.json(result);
  } catch (error) {
    console.error('❌ Playbook recommendation error:', error);
    res.status(500).json({ error: 'Failed to recommend playbooks', details: error.message });
  }
});

app.post('/api/playbooks/actions', async (req, res) => {
  try {
    console.log('🎯 Next best actions requested');
    const { opportunity, context } = req.body;
    const result = await playbookIntelligenceService.generateNextBestActions(opportunity, context);
    res.json(result);
  } catch (error) {
    console.error('❌ Next best actions error:', error);
    res.status(500).json({ error: 'Failed to generate next best actions', details: error.message });
  }
});

// Market Signals endpoints (simplified for demo)
app.get('/api/market-signals', (req, res) => {
  console.log('📡 Market signals requested');
  res.json([
    {
      id: 1,
      title: 'Starbucks Menu Innovation Opportunity',
      channel: 'Coffee',
      priority: 'high',
      confidence: 0.89,
      estimatedRevenue: '$3.2M',
      location: 'Seattle, WA',
      description: 'Partnership opportunity for seasonal menu innovation',
      timestamp: new Date().toISOString()
    }
  ]);
});

// Missing endpoints that frontend is calling
app.get('/api/playbooks', async (req, res) => {
  try {
    const playbooks = await playbookIntelligenceService.getPlaybooks();
    res.json(playbooks);
  } catch (error) {
    console.error('Error fetching playbooks:', error);
    res.status(500).json({ error: 'Failed to fetch playbooks' });
  }
});

app.get('/api/experts', async (req, res) => {
  try {
    const experts = await expertRecommendationService.getExperts();
    res.json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({ error: 'Failed to fetch experts' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    // Mock projects data for now
    const projects = [
      {
        id: 1,
        name: 'Starbucks Partnership Initiative',
        status: 'active',
        progress: 75,
        revenue_potential: 2500000,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'McDonald\'s Menu Innovation',
        status: 'planning',
        progress: 25,
        revenue_potential: 5000000,
        created_at: new Date().toISOString()
      }
    ];
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/ai/generate-playbook', async (req, res) => {
  try {
    const { opportunity, requirements } = req.body;
    const playbook = await playbookIntelligenceService.generatePlaybook(opportunity, requirements);
    res.json(playbook);
  } catch (error) {
    console.error('Error generating playbook:', error);
    res.status(500).json({ error: 'Failed to generate playbook' });
  }
});

app.post('/api/crawl/menu-data', async (req, res) => {
  try {
    const { url, restaurant_name } = req.body;
    const menuData = await dataIngestionService.crawlMenuData(url, restaurant_name);
    res.json(menuData);
  } catch (error) {
    console.error('Error crawling menu data:', error);
    res.status(500).json({ error: 'Failed to crawl menu data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❓ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start server
console.log('🔧 Attempting to start server on port', PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log('📝 Server setup complete');
  console.log(`🎉 Server successfully started on port ${PORT}`);
  console.log(`🌐 Server accessible at http://0.0.0.0:${PORT}`);
  console.log('✅ Ready to accept connections');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
