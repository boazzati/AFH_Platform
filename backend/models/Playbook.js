const mongoose = require('mongoose');

// Playbook Schema for Partnership Accelerator
const playbookSchema = new mongoose.Schema({
  // Basic Information
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['concerts', 'theme_parks', 'gaming', 'workplace', 'fashion', 'cinema']
  },
  region: {
    type: String,
    required: true,
    enum: ['Europe', 'Middle East', 'Asia', 'Africa', 'EMEAA']
  },
  description: {
    type: String,
    required: true
  },
  
  // Core Playbook Content
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    keyActions: [{
      type: String
    }],
    successMetrics: [{
      type: String
    }],
    resources: [{
      type: String
    }],
    tips: [{
      type: String
    }]
  }],
  
  // Industry-Specific Insights
  industryInsights: {
    marketSize: String,
    keyPlayers: [String],
    trends: [String],
    challenges: [String],
    opportunities: [String],
    seasonality: String,
    demographics: String
  },
  
  // Partnership Specifics
  partnershipModel: {
    type: String,
    enum: ['sponsorship', 'exclusive_partnership', 'co_marketing', 'revenue_share', 'licensing']
  },
  revenueModel: String,
  keyBrands: [String],
  targetAudience: String,
  
  // Performance Data
  successRate: {
    type: Number,
    min: 0,
    max: 100
  },
  averageRevenue: String,
  timeToClose: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert']
  },
  
  // Generated Content Metadata
  generatedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSourceUrls: [String],
  crawledData: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Usage Analytics
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  successfulImplementations: {
    type: Number,
    default: 0
  },
  
  // Tags and Search
  tags: [String],
  searchKeywords: [String],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for better performance
playbookSchema.index({ category: 1, region: 1 });
playbookSchema.index({ tags: 1 });
playbookSchema.index({ successRate: -1 });
playbookSchema.index({ generatedAt: -1 });

// Methods
playbookSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

playbookSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

playbookSchema.methods.recordSuccess = function() {
  this.successfulImplementations += 1;
  return this.save();
};

// Static methods
playbookSchema.statics.findByCategory = function(category, region = null) {
  const query = { category, status: 'active' };
  if (region) query.region = region;
  return this.find(query).sort({ successRate: -1 });
};

playbookSchema.statics.getTopPerforming = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ successRate: -1, views: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Playbook', playbookSchema);
