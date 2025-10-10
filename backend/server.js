const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const mongoose = require('mongoose');

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
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('🌐 CORS request from origin:', origin || 'same-origin');
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked:', origin);
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

// MongoDB connection (optional - will work without it)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️ MongoDB connection failed:', err.message));
}

// Root route
app.get('/', (req, res) => {
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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      database: process.env.MONGODB_URI ? 'connected' : 'not configured',
      ai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      crawler: process.env.CRAWL4AI_API_URL ? 'configured' : 'not configured'
    }
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    console.log('🤖 AI chat request received');
    const { message, agentType = 'general', context = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompts = {
      'market-analyst': 'You are a market analyst specializing in the away-from-home food and beverage industry. Provide insights on market trends, opportunities, and competitive analysis.',
      'outreach-generator': 'You are an outreach specialist who creates compelling, personalized messages for business development in the food and beverage industry.',
      'competitive-intel': 'You are a competitive intelligence expert who analyzes market positioning, competitor strategies, and industry dynamics.',
      'general': 'You are an AI assistant helping with away-from-home food and beverage business development.'
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompts[agentType] || systemPrompts.general },
        ...context,
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    res.json({
      response: completion.choices[0].message.content,
      agentType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI chat error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      message: error.message 
    });
  }
});

// Market Signals endpoints
app.get('/api/market-signals', (req, res) => {
  console.log('📡 Market signals requested');
  
  const mockSignals = [
    {
      id: 1,
      title: 'Starbucks Expands Plant-Based Menu',
      description: 'New partnership opportunity for plant-based protein suppliers',
      channel: 'Coffee Shops',
      priority: 'high',
      confidence: 0.89,
      revenue_potential: 2800000,
      location: 'National',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      title: 'McDonald\'s Tests Breakfast Innovation',
      description: 'Limited-time breakfast items creating supplier opportunities',
      channel: 'QSR',
      priority: 'medium',
      confidence: 0.76,
      revenue_potential: 1500000,
      location: 'West Coast',
      timestamp: new Date().toISOString()
    }
  ];
  
  res.json(mockSignals);
});

app.post('/api/market-signals', async (req, res) => {
  try {
    const { title, description, channel, priority, location } = req.body;
    
    // In a real app, save to MongoDB
    const newSignal = {
      id: Date.now(),
      title,
      description,
      channel,
      priority,
      location,
      confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
      revenue_potential: Math.floor(Math.random() * 5000000) + 500000,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(newSignal);
  } catch (error) {
    console.error('Error creating market signal:', error);
    res.status(500).json({ error: 'Failed to create market signal' });
  }
});

// Projects endpoints
app.get('/api/projects', (req, res) => {
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
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, revenue_potential } = req.body;
    
    const newProject = {
      id: Date.now(),
      name,
      description,
      status: 'planning',
      progress: 0,
      revenue_potential: revenue_potential || 0,
      created_at: new Date().toISOString()
    };
    
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Experts endpoints
app.get('/api/experts', (req, res) => {
  const experts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: 'QSR Operations',
      experience: '15 years',
      success_rate: 0.92,
      availability: 'available',
      hourly_rate: 250
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialization: 'Menu Innovation',
      experience: '12 years',
      success_rate: 0.88,
      availability: 'busy',
      hourly_rate: 300
    }
  ];
  res.json(experts);
});

app.post('/api/experts', async (req, res) => {
  try {
    const { name, specialization, experience, hourly_rate } = req.body;
    
    const newExpert = {
      id: Date.now(),
      name,
      specialization,
      experience,
      hourly_rate: hourly_rate || 200,
      success_rate: Math.random() * 0.2 + 0.8, // Random between 0.8-1.0
      availability: 'available',
      created_at: new Date().toISOString()
    };
    
    res.status(201).json(newExpert);
  } catch (error) {
    console.error('Error creating expert:', error);
    res.status(500).json({ error: 'Failed to create expert' });
  }
});

// Playbooks endpoints
app.get('/api/playbooks', (req, res) => {
  const playbooks = [
    {
      id: 1,
      title: 'QSR Partnership Playbook',
      description: 'Comprehensive guide for establishing QSR partnerships',
      category: 'partnerships',
      success_rate: 0.85,
      avg_timeline: '6 months',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Menu Innovation Strategy',
      description: 'Framework for introducing new products to restaurant chains',
      category: 'innovation',
      success_rate: 0.78,
      avg_timeline: '9 months',
      created_at: new Date().toISOString()
    }
  ];
  res.json(playbooks);
});

// AI-powered playbook generation
app.post('/api/ai/generate-playbook', async (req, res) => {
  try {
    const { opportunity, requirements } = req.body;
    
    const prompt = `Generate a detailed business development playbook for this opportunity:
    
    Opportunity: ${opportunity}
    Requirements: ${requirements}
    
    Please provide a structured playbook with:
    1. Executive Summary
    2. Market Analysis
    3. Strategy & Approach
    4. Timeline & Milestones
    5. Risk Assessment
    6. Success Metrics`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a business development expert creating detailed playbooks for food and beverage industry partnerships.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const playbook = {
      id: Date.now(),
      title: `Playbook: ${opportunity}`,
      content: completion.choices[0].message.content,
      opportunity,
      requirements,
      created_at: new Date().toISOString()
    };

    res.json(playbook);
  } catch (error) {
    console.error('Error generating playbook:', error);
    res.status(500).json({ error: 'Failed to generate playbook' });
  }
});

// Outreach endpoints
app.post('/api/outreach/generate-email', async (req, res) => {
  try {
    console.log('✉️ Email generation requested');
    const { recipientName, companyName, opportunity, tone = 'professional' } = req.body;

    const prompt = `Generate a personalized outreach email with these details:
    
    Recipient: ${recipientName}
    Company: ${companyName}
    Opportunity: ${opportunity}
    Tone: ${tone}
    
    Create a compelling, professional email that introduces our food and beverage solutions and suggests a partnership discussion.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert business development professional writing personalized outreach emails for the food and beverage industry.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const email = {
      subject: `Partnership Opportunity - ${companyName}`,
      body: completion.choices[0].message.content,
      recipientName,
      companyName,
      opportunity,
      tone,
      created_at: new Date().toISOString()
    };

    res.json(email);
  } catch (error) {
    console.error('❌ Email generation error:', error);
    res.status(500).json({ 
      error: 'Email generation failed',
      message: error.message 
    });
  }
});

// Crawl4AI integration for menu data
app.post('/api/crawl/menu-data', async (req, res) => {
  try {
    const { url, restaurant_name } = req.body;
    
    // Mock Crawl4AI response for now
    const menuData = {
      restaurant: restaurant_name,
      url,
      menu_items: [
        {
          category: 'Breakfast',
          items: ['Egg McMuffin', 'Pancakes', 'Hash Browns'],
          price_range: '$3-8'
        },
        {
          category: 'Lunch/Dinner',
          items: ['Big Mac', 'Quarter Pounder', 'Chicken McNuggets'],
          price_range: '$5-12'
        }
      ],
      analysis: {
        total_items: 25,
        avg_price: 7.50,
        categories: 4,
        last_updated: new Date().toISOString()
      },
      crawled_at: new Date().toISOString()
    };
    
    res.json(menuData);
  } catch (error) {
    console.error('Error crawling menu data:', error);
    res.status(500).json({ error: 'Failed to crawl menu data' });
  }
});

// Dashboard overview
app.get('/api/dashboard/overview', (req, res) => {
  console.log('📊 Dashboard overview requested');
  
  const overview = {
    metrics: {
      total_opportunities: 127,
      active_projects: 8,
      total_experts: 45,
      success_rate: 0.78
    },
    recent_activity: [
      {
        type: 'opportunity',
        title: 'New Starbucks partnership identified',
        timestamp: new Date().toISOString()
      },
      {
        type: 'project',
        title: 'McDonald\'s project milestone reached',
        timestamp: new Date().toISOString()
      }
    ],
    revenue_pipeline: {
      total: 45000000,
      high_probability: 18000000,
      medium_probability: 15000000,
      low_probability: 12000000
    }
  };
  
  res.json(overview);
});

// Predictive Analytics endpoints
app.get('/api/analytics/opportunity-scoring', (req, res) => {
  const data = {
    totalOpportunities: 127,
    averageScore: 78,
    highPriorityCount: 23,
    channelDistribution: [
      { channel: 'QSR', count: 45, avgScore: 82 },
      { channel: 'Fast Casual', count: 32, avgScore: 85 },
      { channel: 'Casual Dining', count: 28, avgScore: 74 },
      { channel: 'Coffee Shops', count: 22, avgScore: 88 }
    ]
  };
  res.json(data);
});

app.get('/api/analytics/trend-forecasting', (req, res) => {
  const data = {
    overallConfidence: 89,
    marketGrowth: '+18%',
    trends: [
      {
        category: 'Consumer Behavior',
        trend: 'Health-conscious dining surge',
        confidence: 94,
        impact: 'high'
      },
      {
        category: 'Technology',
        trend: 'AI-powered personalization',
        confidence: 87,
        impact: 'high'
      }
    ]
  };
  res.json(data);
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
