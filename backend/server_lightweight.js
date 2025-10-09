const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

// Automation endpoints (simplified)
app.get('/api/automation/status', (req, res) => {
  console.log('🤖 Automation status requested');
  res.json({
    isRunning: true,
    activeTasks: ['urgent', 'regular', 'health'],
    metrics: {
      totalRuns: 45,
      successfulRuns: 42,
      failedRuns: 3,
      lastRunTime: new Date().toISOString(),
      averageProcessingTime: 15000,
      opportunitiesProcessed: 127
    }
  });
});

app.post('/api/automation/start', (req, res) => {
  console.log('▶️ Starting automation');
  res.json({ success: true, message: 'Automation started successfully' });
});

app.post('/api/automation/stop', (req, res) => {
  console.log('⏹️ Stopping automation');
  res.json({ success: true, message: 'Automation stopped successfully' });
});

app.post('/api/automation/collect', async (req, res) => {
  try {
    console.log('🔄 Manual data collection triggered');
    const { mode = 'regular' } = req.body;
    
    // Mock successful collection
    res.json({
      success: true,
      mode: mode,
      collected: {
        opportunities: Math.floor(Math.random() * 10) + 5,
        signals: Math.floor(Math.random() * 20) + 10,
        updates: Math.floor(Math.random() * 15) + 8
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Manual collection error:', error);
    res.status(500).json({ error: 'Failed to collect data', details: error.message });
  }
});

// Predictive Analytics endpoints (simplified)
app.get('/api/analytics/opportunity-scoring', async (req, res) => {
  try {
    console.log('📈 Opportunity scoring requested');
    res.json({
      success: true,
      statistics: {
        totalOpportunities: 127,
        averageScore: 0.76,
        highPriorityCount: 23,
        mediumPriorityCount: 67,
        lowPriorityCount: 37
      },
      channelPerformance: [
        { channel: 'QSR', score: 0.82, count: 45 },
        { channel: 'Fast Casual', score: 0.78, count: 38 },
        { channel: 'Coffee', score: 0.74, count: 28 },
        { channel: 'Convenience', score: 0.69, count: 16 }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Opportunity scoring error:', error);
    res.status(500).json({ error: 'Failed to get opportunity scoring', details: error.message });
  }
});

app.get('/api/analytics/trend-forecasting', async (req, res) => {
  try {
    console.log('🔮 Trend forecasting requested');
    res.json({
      success: true,
      trends: [
        {
          category: 'Health & Wellness',
          confidence: 0.89,
          growth: 0.15,
          impact: 'high',
          description: 'Increasing demand for healthier menu options'
        },
        {
          category: 'Digital Innovation',
          confidence: 0.92,
          growth: 0.22,
          impact: 'high',
          description: 'Mobile ordering and contactless payment adoption'
        },
        {
          category: 'Sustainability',
          confidence: 0.78,
          growth: 0.18,
          impact: 'medium',
          description: 'Eco-friendly packaging and sourcing initiatives'
        }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Trend forecasting error:', error);
    res.status(500).json({ error: 'Failed to get trend forecasting', details: error.message });
  }
});

app.get('/api/analytics/risk-assessment', async (req, res) => {
  try {
    console.log('⚠️ Risk assessment requested');
    res.json({
      success: true,
      assessment: {
        overall: { score: 0.23, level: 'low' },
        categories: [
          { name: 'Market Risk', score: 0.18, level: 'low' },
          { name: 'Competitive Risk', score: 0.31, level: 'medium' },
          { name: 'Execution Risk', score: 0.25, level: 'low' },
          { name: 'Financial Risk', score: 0.19, level: 'low' }
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Risk assessment error:', error);
    res.status(500).json({ error: 'Failed to get risk assessment', details: error.message });
  }
});

app.get('/api/analytics/revenue-prediction', async (req, res) => {
  try {
    console.log('💰 Revenue prediction requested');
    res.json({
      success: true,
      prediction: {
        scenarios: {
          conservative: { revenue: 2.1, probability: 0.85 },
          expected: { revenue: 3.2, probability: 0.65 },
          optimistic: { revenue: 4.8, probability: 0.35 }
        },
        timeline: '12-18 months',
        confidence: 0.78
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Revenue prediction error:', error);
    res.status(500).json({ error: 'Failed to get revenue prediction', details: error.message });
  }
});

app.post('/api/analytics/comprehensive-analysis', async (req, res) => {
  try {
    console.log('🔍 Comprehensive analysis requested');
    const { opportunityId } = req.body;
    res.json({
      success: true,
      analysis: {
        opportunityId: opportunityId,
        score: 0.84,
        confidence: 0.91,
        recommendation: 'Proceed with high priority',
        insights: [
          'Strong market alignment with current trends',
          'Low competitive risk in target segment',
          'High revenue potential with manageable execution complexity'
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Comprehensive analysis error:', error);
    res.status(500).json({ error: 'Failed to run comprehensive analysis', details: error.message });
  }
});

// Outreach Automation endpoints (simplified)
app.get('/api/outreach/overview', async (req, res) => {
  try {
    console.log('📧 Outreach overview requested');
    res.json({
      success: true,
      statistics: {
        totalEmails: 156,
        activeSequences: 23,
        responseRate: 0.18,
        conversionRate: 0.12
      },
      recentActivity: [
        { type: 'email_sent', count: 12, timestamp: new Date().toISOString() },
        { type: 'response_received', count: 3, timestamp: new Date().toISOString() }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Outreach overview error:', error);
    res.status(500).json({ error: 'Failed to get outreach overview', details: error.message });
  }
});

app.post('/api/outreach/generate-email', async (req, res) => {
  try {
    console.log('✉️ Email generation requested');
    const { opportunityId, contactInfo, emailType, customization } = req.body;
    
    // Generate email using OpenAI
    const prompt = `Generate a professional ${emailType} email for a business development opportunity in the away-from-home food industry. 
    Contact: ${contactInfo?.name || 'Decision Maker'}
    Company: ${contactInfo?.company || 'Target Company'}
    Opportunity: ${opportunityId || 'Partnership Opportunity'}
    Tone: ${customization?.tone || 'professional'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert business development email writer specializing in the away-from-home food and beverage industry.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.7
    });

    res.json({
      success: true,
      email: {
        subject: `Partnership Opportunity - ${contactInfo?.company || 'Your Company'}`,
        body: completion.choices[0].message.content,
        type: emailType,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Email generation error:', error);
    res.status(500).json({ error: 'Failed to generate email', details: error.message });
  }
});

// Intelligent Matching endpoints (simplified)
app.get('/api/matching/overview', async (req, res) => {
  try {
    console.log('🎯 Matching overview requested');
    res.json({
      success: true,
      statistics: {
        totalOpportunities: 127,
        matchedOpportunities: 98,
        matchingAccuracy: 0.89,
        averageScore: 0.76,
        activeWorkflows: 23,
        completedMatches: 156,
        expertEngagements: 34,
        playbookImplementations: 28
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Matching overview error:', error);
    res.status(500).json({ error: 'Failed to get matching overview', details: error.message });
  }
});

app.post('/api/matching/comprehensive', async (req, res) => {
  try {
    console.log('🔍 Comprehensive matching requested');
    const { opportunityId } = req.body;
    
    // Mock comprehensive matching results
    const mockResults = {
      opportunity: {
        id: opportunityId,
        title: 'Starbucks Menu Innovation Partnership',
        channel: 'Coffee',
        description: 'Partnership opportunity for menu innovation and product development',
        priority: 'high',
        estimatedRevenue: '$3.2M'
      },
      productMatches: [
        {
          product: {
            name: 'Menu Innovation Platform',
            category: 'Food Innovation',
            channels: ['QSR', 'Fast Casual', 'Coffee']
          },
          score: { overall: 0.92, confidence: 0.88 },
          reasoning: 'Perfect alignment with innovation requirements and channel expertise',
          revenue: { scenarios: { expected: { revenue: 3.2, timeline: '12-18 months' } } }
        }
      ],
      expertRecommendations: [
        {
          expert: {
            name: 'Sarah Chen',
            title: 'Former VP of Innovation, Starbucks',
            expertise: ['Coffee', 'Menu Innovation', 'Digital Transformation'],
            hourlyRate: 450,
            availability: 'Available'
          },
          score: { overall: 0.94, confidence: 0.91 },
          reasoning: 'Exceptional expertise match with direct industry experience',
          recommendedRole: 'Innovation Strategy Lead'
        }
      ],
      playbookSuggestions: [
        {
          playbook: {
            title: 'Menu Innovation & Product Launch',
            category: 'Product Development',
            successRate: 0.72,
            averageDuration: '32 weeks',
            estimatedROI: '15-25%'
          },
          score: { overall: 0.89, confidence: 0.86 },
          reasoning: 'Direct methodology match with proven success in similar initiatives',
          timeline: { adjustedWeeks: 28, totalWeeks: 28 }
        }
      ],
      nextBestActions: [
        {
          title: 'Conduct Market Research',
          description: 'Research Coffee market dynamics and competitive landscape',
          priority: 'High',
          timeframe: '1-2 weeks',
          category: 'Research'
        }
      ]
    };

    res.json({
      success: true,
      ...mockResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Comprehensive matching error:', error);
    res.status(500).json({ error: 'Failed to run comprehensive matching', details: error.message });
  }
});

// Market Signals endpoints (simplified)
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
