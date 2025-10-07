const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS for your Netlify app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://afhapp.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'AFH Platform API is running', 
    status: 'OK',
    ai: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// AI Chat endpoint with OpenAI integration
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context, agentType } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }
    
    // Set system context based on agent type
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemContext + (context ? ' ' + context : '')
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    res.json({
      success: true,
      response,
      agent: agentType,
      timestamp: new Date().toISOString()
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

// Start server
app.listen(process.env.PORT, () => {
  console.log('AFH Platform server started with OpenAI integration');
});
