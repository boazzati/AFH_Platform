const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { OpenAI } = require('openai');
const axios = require('axios');

// Import automation services
const DataIngestionService = require('./services/dataIngestionService');
const DataProcessingService = require('./services/dataProcessingService');
const AutomationService = require('./services/automationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize automation services
let automationService;
let dataIngestionService;
let dataProcessingService;

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
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
      
      // Initialize automation services after DB connection
      await initializeAutomationServices();
    } else {
      console.log('⚠️ MongoDB URI not provided, running without database');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

// Initialize automation services
const initializeAutomationServices = async () => {
  try {
    console.log('🚀 Initializing automation services...');
    
    dataIngestionService = new DataIngestionService();
    dataProcessingService = new DataProcessingService();
    automationService = new AutomationService();
    
    // Start automation service
    await automationService.start();
    
    console.log('✅ Automation services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize automation services:', error);
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      crawl4ai: process.env.CRAWL4AI_API_URL ? 'configured' : 'not configured',
      automation: automationService ? (automationService.isRunning ? 'running' : 'stopped') : 'not initialized'
    },
    cors: {
      allowedOrigins: ['https://afhapp.netlify.app', 'http://localhost:3000'],
      status: 'enabled'
    }
  };
  
  res.json(health);
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    console.log('🤖 AI Chat request received');
    const { message, agentType = 'market-analyst', conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get platform context for AI
    const platformContext = await getPlatformContext();

    const systemPrompts = {
      'market-analyst': `You are a senior market analyst specializing in AFH (Away-From-Home) channels. You help CPG companies identify and analyze market opportunities in restaurants, workplaces, leisure venues, education, and healthcare sectors. 

Current platform data: ${JSON.stringify(platformContext)}

Provide data-driven insights, market trends analysis, and strategic recommendations.`,
      
      'outreach-generator': `You are an expert sales outreach specialist for AFH channel partnerships. You create compelling, personalized outreach emails and proposals for CPG companies targeting restaurant chains, workplace cafeterias, and other AFH venues.

Current platform data: ${JSON.stringify(platformContext)}

Generate professional, results-driven outreach content.`,
      
      'competitive-intel': `You are a competitive intelligence analyst focused on AFH market dynamics. You analyze competitor activities, market positioning, and strategic opportunities in the away-from-home food and beverage sector.

Current platform data: ${JSON.stringify(platformContext)}

Provide competitive analysis and strategic positioning recommendations.`,
      
      'strategy-advisor': `You are a strategic advisor for AFH channel expansion. You help CPG companies develop comprehensive strategies for entering and scaling in away-from-home markets.

Current platform data: ${JSON.stringify(platformContext)}

Provide strategic guidance and actionable recommendations.`
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompts[agentType] || systemPrompts['market-analyst']
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content;
    
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

// Get platform context for AI
async function getPlatformContext() {
  try {
    const context = {
      totalOpportunities: 0,
      recentSignals: [],
      activeChannels: [],
      automationStatus: 'unknown'
    };

    if (mongoose.connection.readyState === 1) {
      // Get recent market signals
      const signals = await mongoose.connection.db
        .collection('market-signals')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      
      context.totalOpportunities = signals.length;
      context.recentSignals = signals.map(s => ({
        title: s.title,
        channel: s.channel,
        priority: s.priority,
        confidence: s.confidence
      }));
      
      // Get unique channels
      context.activeChannels = [...new Set(signals.map(s => s.channel))];
    }

    if (automationService) {
      const status = automationService.getStatus();
      context.automationStatus = status.isRunning ? 'active' : 'inactive';
    }

    return context;
  } catch (error) {
    console.error('Error getting platform context:', error);
    return { error: 'Unable to fetch platform context' };
  }
}

// Market Signals endpoints
app.get('/api/market-signals', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ data: [] });
    }

    const signals = await mongoose.connection.db
      .collection('market-signals')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ data: signals });
  } catch (error) {
    console.error('Error fetching market signals:', error);
    res.status(500).json({ error: 'Failed to fetch market signals' });
  }
});

app.post('/api/market-signals', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
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
    
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating market signal:', error);
    res.status(500).json({ error: 'Failed to create market signal' });
  }
});

// Automation endpoints
app.get('/api/automation/status', (req, res) => {
  try {
    if (!automationService) {
      return res.json({ 
        isRunning: false, 
        error: 'Automation service not initialized' 
      });
    }
    
    const status = automationService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting automation status:', error);
    res.status(500).json({ error: 'Failed to get automation status' });
  }
});

app.get('/api/automation/metrics', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        lastRunTime: null,
        averageProcessingTime: 0,
        opportunitiesProcessed: 0
      });
    }

    const metrics = await mongoose.connection.db
      .collection('automation-metrics')
      .findOne({ _id: 'current' });
    
    res.json(metrics || {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      lastRunTime: null,
      averageProcessingTime: 0,
      opportunitiesProcessed: 0
    });
  } catch (error) {
    console.error('Error getting automation metrics:', error);
    res.status(500).json({ error: 'Failed to get automation metrics' });
  }
});

app.get('/api/automation/alerts', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const alerts = await mongoose.connection.db
      .collection('automation-alerts')
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    res.json(alerts);
  } catch (error) {
    console.error('Error getting automation alerts:', error);
    res.status(500).json({ error: 'Failed to get automation alerts' });
  }
});

app.post('/api/automation/start', async (req, res) => {
  try {
    if (!automationService) {
      return res.status(503).json({ error: 'Automation service not available' });
    }
    
    await automationService.start();
    res.json({ success: true, message: 'Automation started' });
  } catch (error) {
    console.error('Error starting automation:', error);
    res.status(500).json({ error: 'Failed to start automation' });
  }
});

app.post('/api/automation/stop', async (req, res) => {
  try {
    if (!automationService) {
      return res.status(503).json({ error: 'Automation service not available' });
    }
    
    await automationService.stop();
    res.json({ success: true, message: 'Automation stopped' });
  } catch (error) {
    console.error('Error stopping automation:', error);
    res.status(500).json({ error: 'Failed to stop automation' });
  }
});

app.post('/api/automation/trigger', async (req, res) => {
  try {
    if (!automationService) {
      return res.status(503).json({ error: 'Automation service not available' });
    }
    
    const { mode = 'manual' } = req.body;
    const result = await automationService.triggerCollection(mode);
    
    res.json({ 
      success: true, 
      message: 'Data collection triggered',
      result 
    });
  } catch (error) {
    console.error('Error triggering automation:', error);
    res.status(500).json({ error: 'Failed to trigger automation' });
  }
});

// AI Email Generation
app.post('/api/ai/generate-email', async (req, res) => {
  try {
    const { context } = req.body;
    
    const prompt = `Generate a professional outreach email for AFH channel partnership based on this context: ${JSON.stringify(context)}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing compelling B2B outreach emails for food service partnerships.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    res.json({
      email: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

// AI Trend Analysis
app.post('/api/ai/analyze-trends', async (req, res) => {
  try {
    const { data } = req.body;
    
    const prompt = `Analyze these AFH market trends and provide insights: ${JSON.stringify(data)}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a market analyst specializing in away-from-home food and beverage trends.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    res.json({
      analysis: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing trends:', error);
    res.status(500).json({ error: 'Failed to analyze trends' });
  }
});

// AI Playbook Generation
app.post('/api/ai/generate-playbook', async (req, res) => {
  try {
    const { context } = req.body;
    
    const prompt = `Create a comprehensive AFH channel playbook based on: ${JSON.stringify(context)}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a strategic consultant creating actionable playbooks for AFH channel expansion.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    res.json({
      playbook: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating playbook:', error);
    res.status(500).json({ error: 'Failed to generate playbook' });
  }
});

// Web Crawling endpoints
app.post('/api/crawl/website', async (req, res) => {
  try {
    const { url, options = {} } = req.body;
    
    if (!dataIngestionService) {
      return res.status(503).json({ error: 'Data ingestion service not available' });
    }
    
    const result = await dataIngestionService.scrapeWebsite(url, options);
    res.json({ data: result });
  } catch (error) {
    console.error('Error crawling website:', error);
    res.status(500).json({ error: 'Failed to crawl website' });
  }
});

app.post('/api/crawl/menu-data', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!dataIngestionService) {
      return res.status(503).json({ error: 'Data ingestion service not available' });
    }
    
    const result = await dataIngestionService.scrapeWebsite(url, {
      extractionRules: {
        menu: {
          selector: '.menu-item, .food-item, .product',
          fields: {
            name: '.name, .title, h3',
            price: '.price, .cost',
            description: '.description, .details'
          }
        }
      }
    });
    
    res.json({ data: result });
  } catch (error) {
    console.error('Error crawling menu data:', error);
    res.status(500).json({ error: 'Failed to crawl menu data' });
  }
});

// Generic endpoints for other modules
const createGenericEndpoints = (collection) => {
  app.get(`/api/${collection}`, async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.json({ data: [] });
      }
      
      const items = await mongoose.connection.db
        .collection(collection)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      res.json({ data: items });
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      res.status(500).json({ error: `Failed to fetch ${collection}` });
    }
  });

  app.post(`/api/${collection}`, async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not available' });
      }

      const itemData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await mongoose.connection.db
        .collection(collection)
        .insertOne(itemData);
      
      res.json({ success: true, id: result.insertedId });
    } catch (error) {
      console.error(`Error creating ${collection} item:`, error);
      res.status(500).json({ error: `Failed to create ${collection} item` });
    }
  });
};

// Create endpoints for other collections
['playbooks', 'projects', 'experts'].forEach(createGenericEndpoints);

// Partnership Analysis
app.post('/api/analyze-partnership', async (req, res) => {
  try {
    const { data } = req.body;
    
    const prompt = `Analyze this potential AFH partnership opportunity: ${JSON.stringify(data)}. Provide recommendations, risks, and success factors.`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a partnership analyst specializing in AFH channel opportunities.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    res.json({
      analysis: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing partnership:', error);
    res.status(500).json({ error: 'Failed to analyze partnership' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  if (automationService) {
    await automationService.stop();
  }
  
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 AFH Platform server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🤖 AI Chat: http://localhost:${PORT}/api/ai/chat`);
      console.log(`⚙️ Automation: http://localhost:${PORT}/api/automation/status`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
