import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://your-app.netlify.app",
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AFH Platform Backend Running',
    timestamp: new Date().toISOString()
  });
});

// Your existing proxy endpoint
app.post('/api/proxy', async (req, res) => {
  try {
    const { brand_a, brand_b, partnership_type, target_audience, budget_range } = req.body;
    
    // Your analysis logic here
    const analysisResult = {
      brand_alignment_score: Math.floor(Math.random() * 30) + 70,
      audience_overlap_percentage: Math.floor(Math.random() * 40) + 60,
      roi_projection: Math.floor(Math.random() * 100) + 150,
      risk_level: "Medium",
      key_risks: ["Market volatility", "Competitive pressure"],
      recommendations: [
        `Focus on co-branded campaigns for ${target_audience}`,
        `Develop exclusive offerings for ${partnership_type} partnership`
      ],
      service_used: "demo"
    };
    
    res.json(analysisResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AFH Backend running on port ${PORT}`);
});
