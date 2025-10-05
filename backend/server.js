const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb+srv://boazzati_db_user:yG2V1BCjEoYFzErP@cluster0.enxvd6p.mongodb.net/afh-platform?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('📊 MongoDB: Connected successfully');
})
.catch((error) => {
  console.error('📊 MongoDB: Connection failed:', error.message);
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📊 MongoDB: Connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('📊 MongoDB: Connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📊 MongoDB: Disconnected');
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple OpenAI service functions
const OpenAIService = {
  async generateMarketInsights(prompt, context) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: context || "You are a market analyst specializing in AFH channel trends and opportunities."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate market insights');
    }
  },

  async generateOutreachEmail(account, channel, context) {
    try {
      const prompt = `Create a professional outreach email for ${account} in the ${channel} channel. Context: ${context}`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a commercial outreach expert creating compelling partnership proposals for AFH channels."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate outreach email');
    }
  },

  async analyzeMarketTrends(data, channel) {
    try {
      const prompt = `Analyze the following market data for ${channel} channel: ${JSON.stringify(data)}. Provide key insights and trends.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a market intelligence analyst specializing in beverage and CPG markets."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to analyze market trends');
    }
  },

  async generatePlaybookStrategy(channels, accountType, objectives) {
    try {
      const prompt = `Create a playbook strategy for ${accountType} targeting ${channels.join(', ')} with objectives: ${objectives}`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a channel strategy expert creating playbooks for AFH market expansion."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate playbook strategy');
    }
  }
};

// MongoDB Schemas
const MarketSignalSchema = new mongoose.Schema({
  type: String,
  severity: String,
  location: String,
  description: String,
  potentialValue: String,
  confidence: Number,
  timestamp: Date,
  source: String,
  category: String
});

const PlaybookSchema = new mongoose.Schema({
  title: String,
  channel: String,
  version: String,
  successRate: Number,
  lastUpdated: Date,
  description: String,
  sections: [String],
  aiGenerated: Boolean,
  performanceData: Object
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  status: String,
  progress: Number,
  channel: String,
  owner: String,
  timeline: String,
  risks: [String],
  nextSteps: [String],
  lastUpdate: Date,
  performanceMetrics: Object
});

const ExpertSchema = new mongoose.Schema({
  name: String,
  specialization: [String],
  experience: Number,
  rating: Number,
  availability: String,
  hourlyRate: Number,
  previousProjects: [String]
});

const MarketSignal = mongoose.model('MarketSignal', MarketSignalSchema);
const Playbook = mongoose.model('Playbook', PlaybookSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Expert = mongoose.model('Expert', ExpertSchema);

// ===== ROOT AND HEALTH ROUTES =====
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AFH Platform API is running successfully!',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/market-signals',
      '/api/playbooks',
      '/api/projects',
      '/api/experts',
      '/api/analyze-partnership',
      '/api/ai/chat',
      '/api/ai/generate-email',
      '/api/ai/analyze-trends',
      '/api/ai/generate-playbook',
      '/api/crawl/website',
      '/api/crawl/menu-data',
      '/health'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ===== API ROUTES =====

// Market Signals
app.get('/api/market-signals', async (req, res) => {
  try {
    const signals = await MarketSignal.find().sort({ timestamp: -1 });
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/market-signals', async (req, res) => {
  try {
    const signal = new MarketSignal(req.body);
    await signal.save();
    res.status(201).json(signal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI Routes
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context, agentType } = req.body;
    
    let systemContext = '';
    switch (agentType) {
      case 'market-analyst':
        systemContext = 'You are a market analyst specializing in AFH channel trends and opportunities.';
        break;
      case 'outreach-generator':
        systemContext = 'You are a commercial outreach expert creating compelling partnership proposals.';
        break;
      case 'competitive-intel':
        systemContext = 'You are a competitive intelligence analyst for beverage markets.';
        break;
      default:
        systemContext = 'You are an AFH channel strategist for CPG companies.';
    }

    const response = await OpenAIService.generateMarketInsights(prompt, systemContext + ' ' + context);
    
    res.json({
      success: true,
      response,
      agent: agentType
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
      error: error.message
    });
  }
});

app.post('/api/ai/generate-email', async (req, res) => {
  try {
    const { account, channel, context } = req.body;
    
    const email = await OpenAIService.generateOutreachEmail(account, channel, context);
    
    res.json({
      success: true,
      email
    });
  } catch (error) {
    console.error('Email Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate outreach email'
    });
  }
});

app.post('/api/ai/analyze-trends', async (req, res) => {
  try {
    const { data, channel } = req.body;
    
    const analysis = await OpenAIService.analyzeMarketTrends(data, channel);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Trend Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze market trends'
    });
  }
});

app.post('/api/ai/generate-playbook', async (req, res) => {
  try {
    const { channels, accountType, objectives } = req.body;
    
    const strategy = await OpenAIService.generatePlaybookStrategy(channels, accountType, objectives);
    
    res.json({
      success: true,
      strategy
    });
  } catch (error) {
    console.error('Playbook Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate playbook strategy'
    });
  }
});

// Playbooks
app.get('/api/playbooks', async (req, res) => {
  try {
    const playbooks = await Playbook.find().sort({ lastUpdated: -1 });
    res.json(playbooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/playbooks', async (req, res) => {
  try {
    const playbook = new Playbook(req.body);
    await playbook.save();
    res.status(201).json(playbook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ lastUpdate: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Experts
app.get('/api/experts', async (req, res) => {
  try {
    const experts = await Expert.find();
    res.json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Analysis Endpoint
app.post('/api/analyze-partnership', async (req, res) => {
  try {
    const { brand_a, brand_b, partnership_type, target_audience, budget_range } = req.body;
    
    // Simulate AI analysis - replace with actual AI service
    const analysis = {
      brand_alignment_score: Math.floor(Math.random() * 30) + 70,
      audience_overlap_percentage: Math.floor(Math.random() * 40) + 60,
      roi_projection: Math.floor(Math.random() * 100) + 150,
      risk_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      key_risks: ['Market saturation', 'Brand mismatch', 'Regulatory challenges'],
      recommendations: [
        `Focus on ${target_audience} segment`,
        'Consider co-branded marketing campaign',
        'Pilot program recommended before full rollout'
      ],
      market_insights: [
        'Growing demand in target segment',
        'Competitive landscape analysis complete',
        'Supply chain optimization opportunities identified'
      ]
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== WEB CRAWLER ROUTES =====
const CRAWL4AI_API_URL = process.env.CRAWL4AI_API_URL || 'https://crawl4ai-production-5e82.up.railway.app';
const CRAWL4AI_API_KEY = process.env.CRAWL4AI_API_KEY;
// Web Crawler Routes
// Web Crawler Routes
app.post('/api/crawl/website', async (req, res) => {
  try {
    const { url, extractRules } = req.body;
    
    const response = await axios.post(`${CRAWL4AI_API_URL}/v1/crawl`, {
      url,
      options: {
        extract_rules: extractRules,
        wait_for: 2000,
        timeout: 30000
      }
    }, {
      headers: {
        'x-api-key': CRAWL4AI_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Crawling error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to crawl website',
      error: error.response?.data?.detail || error.message
    });
  }
});

app.post('/api/crawl/menu-data', async (req, res) => {
  try {
    const { restaurantUrl } = req.body;
    
    const response = await axios.post(`${CRAWL4AI_API_URL}/v1/crawl`, {
      url: restaurantUrl,
      options: {
        extract_rules: {
          menuItems: {
            selector: '.menu-item, .dish, [class*="menu"]',
            type: 'multiple',
            attributes: {
              name: '.item-name, .dish-name',
              price: '.price, .cost',
              description: '.description, .ingredients',
              category: '.category, .menu-category'
            }
          },
          restaurantInfo: {
            selector: '.restaurant-info, [class*="info"]',
            type: 'single',
            attributes: {
              name: 'h1, .restaurant-name',
              address: '.address, [class*="address"]',
              phone: '.phone, [class*="phone"]'
            }
          }
        },
        wait_for: 2000,
        timeout: 30000
      }
    }, {
      headers: {
        'x-api-key': CRAWL4AI_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      restaurantData: response.data
    });
  } catch (error) {
    console.error('Menu crawling error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to crawl menu data',
      error: error.response?.data?.detail || error.message
    });
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Missing API Key'}`);
  console.log(`🕷️  Crawler: Available (External Service)`);
});
