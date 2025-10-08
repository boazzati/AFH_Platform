const { OpenAI } = require('openai');
const mongoose = require('mongoose');

class TrendForecastingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Market trend categories and their indicators
    this.trendCategories = {
      'consumer-behavior': {
        indicators: ['health-conscious', 'convenience', 'sustainability', 'premium', 'value'],
        weight: 0.3
      },
      'technology': {
        indicators: ['automation', 'digital-ordering', 'ai-personalization', 'contactless', 'delivery-tech'],
        weight: 0.25
      },
      'regulatory': {
        indicators: ['food-safety', 'labeling', 'nutrition', 'environmental', 'labor'],
        weight: 0.15
      },
      'economic': {
        indicators: ['inflation', 'labor-costs', 'supply-chain', 'consumer-spending', 'interest-rates'],
        weight: 0.20
      },
      'competitive': {
        indicators: ['market-consolidation', 'new-entrants', 'partnerships', 'innovation', 'pricing'],
        weight: 0.10
      }
    };

    // Historical trend data (would be populated from real market data)
    this.historicalTrends = {
      'health-conscious': {
        growth: [0.12, 0.15, 0.18, 0.22, 0.25], // Last 5 quarters
        momentum: 'accelerating',
        impact: 'high',
        channels: ['workplace', 'education', 'healthcare']
      },
      'sustainability': {
        growth: [0.08, 0.12, 0.16, 0.20, 0.24],
        momentum: 'accelerating',
        impact: 'high',
        channels: ['workplace', 'education']
      },
      'convenience': {
        growth: [0.15, 0.18, 0.20, 0.19, 0.21],
        momentum: 'steady',
        impact: 'medium',
        channels: ['quick-service', 'workplace']
      },
      'premium': {
        growth: [0.05, 0.08, 0.10, 0.12, 0.14],
        momentum: 'steady',
        impact: 'medium',
        channels: ['leisure', 'workplace']
      },
      'plant-based': {
        growth: [0.20, 0.28, 0.35, 0.42, 0.38],
        momentum: 'slowing',
        impact: 'high',
        channels: ['education', 'healthcare', 'workplace']
      }
    };

    // Seasonal patterns
    this.seasonalPatterns = {
      'q1': { multiplier: 0.85, focus: ['health', 'wellness', 'new-year-resolutions'] },
      'q2': { multiplier: 1.1, focus: ['outdoor', 'fresh', 'seasonal'] },
      'q3': { multiplier: 0.95, focus: ['back-to-school', 'convenience'] },
      'q4': { multiplier: 1.15, focus: ['premium', 'indulgence', 'holiday'] }
    };

    // External data sources (would integrate with real APIs)
    this.dataSources = {
      'google-trends': { weight: 0.3, reliability: 0.8 },
      'social-media': { weight: 0.25, reliability: 0.7 },
      'industry-reports': { weight: 0.35, reliability: 0.9 },
      'news-sentiment': { weight: 0.1, reliability: 0.6 }
    };
  }

  /**
   * Generate comprehensive trend forecast
   */
  async generateTrendForecast(timeHorizon = '12-months') {
    try {
      console.log(`📈 Generating trend forecast for ${timeHorizon}...`);

      // Get current market signals for trend analysis
      const marketSignals = await this.getRecentMarketSignals();
      
      // Analyze current trends
      const currentTrends = await this.analyzeCurrentTrends(marketSignals);
      
      // Generate AI-powered predictions
      const aiPredictions = await this.getAIPredictions(currentTrends, timeHorizon);
      
      // Calculate trend momentum
      const trendMomentum = this.calculateTrendMomentum(currentTrends);
      
      // Identify emerging opportunities
      const emergingOpportunities = await this.identifyEmergingOpportunities(currentTrends, aiPredictions);
      
      // Generate channel-specific forecasts
      const channelForecasts = this.generateChannelForecasts(currentTrends, timeHorizon);
      
      // Calculate confidence scores
      const confidence = this.calculateForecastConfidence(currentTrends, marketSignals.length);

      const forecast = {
        timeHorizon,
        generatedAt: new Date().toISOString(),
        currentTrends,
        aiPredictions,
        trendMomentum,
        emergingOpportunities,
        channelForecasts,
        confidence,
        keyInsights: await this.generateKeyInsights(currentTrends, aiPredictions),
        recommendations: await this.generateTrendRecommendations(currentTrends, emergingOpportunities)
      };

      console.log(`✅ Trend forecast generated with ${confidence}% confidence`);
      return forecast;

    } catch (error) {
      console.error('❌ Error generating trend forecast:', error);
      return {
        error: error.message,
        timeHorizon,
        generatedAt: new Date().toISOString(),
        confidence: 0
      };
    }
  }

  /**
   * Get recent market signals for trend analysis
   */
  async getRecentMarketSignals() {
    try {
      if (mongoose.connection.readyState !== 1) {
        return [];
      }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const signals = await mongoose.connection.db
        .collection('market-signals')
        .find({ 
          createdAt: { $gte: thirtyDaysAgo }
        })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      return signals;
    } catch (error) {
      console.error('Error fetching market signals:', error);
      return [];
    }
  }

  /**
   * Analyze current trends from market signals
   */
  async analyzeCurrentTrends(marketSignals) {
    const trends = {};

    // Initialize trend tracking
    Object.keys(this.historicalTrends).forEach(trend => {
      trends[trend] = {
        mentions: 0,
        sentiment: 0,
        channels: {},
        growth: this.historicalTrends[trend].growth,
        momentum: this.historicalTrends[trend].momentum,
        impact: this.historicalTrends[trend].impact
      };
    });

    // Analyze market signals for trend indicators
    marketSignals.forEach(signal => {
      const text = (signal.title + ' ' + (signal.description || '')).toLowerCase();
      const channel = signal.channel || 'unknown';

      Object.keys(trends).forEach(trend => {
        const trendKeywords = this.getTrendKeywords(trend);
        const mentions = trendKeywords.filter(keyword => text.includes(keyword)).length;
        
        if (mentions > 0) {
          trends[trend].mentions += mentions;
          trends[trend].channels[channel] = (trends[trend].channels[channel] || 0) + mentions;
          
          // Simple sentiment analysis based on priority
          const sentimentScore = signal.priority === 'high' ? 1 : signal.priority === 'medium' ? 0.5 : 0.2;
          trends[trend].sentiment += sentimentScore;
        }
      });
    });

    // Calculate trend strength and normalize
    Object.keys(trends).forEach(trend => {
      const trendData = trends[trend];
      trendData.strength = Math.min(100, (trendData.mentions / marketSignals.length) * 100);
      trendData.averageSentiment = trendData.mentions > 0 ? trendData.sentiment / trendData.mentions : 0;
      
      // Calculate current growth rate
      const recentGrowth = trendData.growth.slice(-2);
      trendData.currentGrowthRate = recentGrowth.length === 2 
        ? ((recentGrowth[1] - recentGrowth[0]) / recentGrowth[0]) * 100 
        : 0;
    });

    return trends;
  }

  /**
   * Get AI-powered predictions
   */
  async getAIPredictions(currentTrends, timeHorizon) {
    try {
      const trendSummary = Object.entries(currentTrends)
        .map(([trend, data]) => `${trend}: ${data.strength}% strength, ${data.currentGrowthRate.toFixed(1)}% growth`)
        .join(', ');

      const prompt = `
        Based on current AFH market trends, predict future developments for ${timeHorizon}:
        
        Current trends: ${trendSummary}
        
        Provide predictions for:
        1. Which trends will accelerate or decelerate
        2. New emerging trends to watch
        3. Channel-specific impacts
        4. Potential disruptions or shifts
        5. Investment opportunities
        
        Format as JSON with keys: accelerating, decelerating, emerging, channelImpacts, disruptions, opportunities
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a market trend analyst specializing in AFH food service predictions. Provide data-driven insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      });

      try {
        return JSON.parse(response.choices[0].message.content);
      } catch (parseError) {
        // Fallback structure if JSON parsing fails
        return {
          accelerating: ['health-conscious', 'sustainability'],
          decelerating: ['premium'],
          emerging: ['AI-personalization', 'local-sourcing'],
          channelImpacts: { workplace: 'high', education: 'medium' },
          disruptions: ['Technology adoption', 'Regulatory changes'],
          opportunities: ['Plant-based expansion', 'Sustainable packaging']
        };
      }
    } catch (error) {
      console.error('Error getting AI predictions:', error);
      return {
        accelerating: [],
        decelerating: [],
        emerging: [],
        channelImpacts: {},
        disruptions: [],
        opportunities: []
      };
    }
  }

  /**
   * Calculate trend momentum
   */
  calculateTrendMomentum(currentTrends) {
    const momentum = {};

    Object.entries(currentTrends).forEach(([trend, data]) => {
      const growthData = data.growth;
      
      if (growthData.length >= 3) {
        const recent = growthData.slice(-3);
        const acceleration = (recent[2] - recent[1]) - (recent[1] - recent[0]);
        
        let momentumScore = 0;
        if (acceleration > 0.02) momentumScore = 100; // Strong acceleration
        else if (acceleration > 0.01) momentumScore = 75; // Moderate acceleration
        else if (acceleration > -0.01) momentumScore = 50; // Stable
        else if (acceleration > -0.02) momentumScore = 25; // Moderate deceleration
        else momentumScore = 0; // Strong deceleration

        momentum[trend] = {
          score: momentumScore,
          acceleration: acceleration * 100,
          direction: acceleration > 0 ? 'accelerating' : acceleration < 0 ? 'decelerating' : 'stable',
          strength: data.strength
        };
      }
    });

    return momentum;
  }

  /**
   * Identify emerging opportunities
   */
  async identifyEmergingOpportunities(currentTrends, aiPredictions) {
    const opportunities = [];

    // Opportunities from accelerating trends
    Object.entries(currentTrends).forEach(([trend, data]) => {
      if (data.currentGrowthRate > 15 && data.strength > 20) {
        opportunities.push({
          type: 'trend-acceleration',
          trend,
          description: `${trend} showing strong growth (${data.currentGrowthRate.toFixed(1)}%)`,
          impact: data.impact,
          channels: Object.keys(data.channels).slice(0, 3),
          timeframe: 'short-term',
          confidence: Math.min(95, data.strength + data.currentGrowthRate)
        });
      }
    });

    // Opportunities from AI predictions
    if (aiPredictions.emerging && Array.isArray(aiPredictions.emerging)) {
      aiPredictions.emerging.forEach(emergingTrend => {
        opportunities.push({
          type: 'emerging-trend',
          trend: emergingTrend,
          description: `New emerging trend: ${emergingTrend}`,
          impact: 'medium',
          channels: ['workplace', 'quick-service'],
          timeframe: 'medium-term',
          confidence: 70
        });
      });
    }

    // Cross-trend opportunities
    const highGrowthTrends = Object.entries(currentTrends)
      .filter(([_, data]) => data.currentGrowthRate > 10)
      .map(([trend, _]) => trend);

    if (highGrowthTrends.length >= 2) {
      opportunities.push({
        type: 'convergence',
        trend: highGrowthTrends.slice(0, 2).join(' + '),
        description: `Convergence opportunity combining ${highGrowthTrends.slice(0, 2).join(' and ')}`,
        impact: 'high',
        channels: ['workplace', 'education'],
        timeframe: 'medium-term',
        confidence: 80
      });
    }

    // Sort by confidence and return top opportunities
    return opportunities
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);
  }

  /**
   * Generate channel-specific forecasts
   */
  generateChannelForecasts(currentTrends, timeHorizon) {
    const channels = ['quick-service', 'fast-casual', 'workplace', 'education', 'healthcare', 'leisure'];
    const forecasts = {};

    channels.forEach(channel => {
      const channelTrends = {};
      let overallGrowth = 0;
      let trendCount = 0;

      Object.entries(currentTrends).forEach(([trend, data]) => {
        if (data.channels[channel]) {
          channelTrends[trend] = {
            strength: (data.channels[channel] / data.mentions) * data.strength,
            growth: data.currentGrowthRate
          };
          overallGrowth += data.currentGrowthRate;
          trendCount++;
        }
      });

      const avgGrowth = trendCount > 0 ? overallGrowth / trendCount : 0;
      
      forecasts[channel] = {
        expectedGrowth: avgGrowth,
        keyTrends: Object.entries(channelTrends)
          .sort(([,a], [,b]) => b.strength - a.strength)
          .slice(0, 3)
          .map(([trend, data]) => ({ trend, strength: data.strength })),
        outlook: this.determineOutlook(avgGrowth),
        opportunities: this.getChannelOpportunities(channel, channelTrends)
      };
    });

    return forecasts;
  }

  /**
   * Determine outlook based on growth rate
   */
  determineOutlook(growthRate) {
    if (growthRate > 15) return 'very-positive';
    if (growthRate > 8) return 'positive';
    if (growthRate > 0) return 'stable';
    if (growthRate > -5) return 'cautious';
    return 'negative';
  }

  /**
   * Get channel-specific opportunities
   */
  getChannelOpportunities(channel, channelTrends) {
    const opportunities = [];
    
    const channelStrategies = {
      'quick-service': ['speed', 'convenience', 'value'],
      'fast-casual': ['quality', 'customization', 'health'],
      'workplace': ['convenience', 'health', 'sustainability'],
      'education': ['nutrition', 'value', 'sustainability'],
      'healthcare': ['health', 'nutrition', 'compliance'],
      'leisure': ['premium', 'experience', 'indulgence']
    };

    const strategies = channelStrategies[channel] || ['general'];
    
    strategies.forEach(strategy => {
      const relevantTrends = Object.entries(channelTrends)
        .filter(([trend, _]) => this.isTrendRelevantToStrategy(trend, strategy))
        .sort(([,a], [,b]) => b.strength - a.strength);

      if (relevantTrends.length > 0) {
        opportunities.push({
          strategy,
          trend: relevantTrends[0][0],
          strength: relevantTrends[0][1].strength,
          description: `Leverage ${relevantTrends[0][0]} for ${strategy} positioning`
        });
      }
    });

    return opportunities.slice(0, 3);
  }

  /**
   * Check if trend is relevant to strategy
   */
  isTrendRelevantToStrategy(trend, strategy) {
    const relevanceMap = {
      'speed': ['convenience', 'automation'],
      'convenience': ['convenience', 'technology'],
      'value': ['value', 'economic'],
      'quality': ['premium', 'health-conscious'],
      'customization': ['technology', 'premium'],
      'health': ['health-conscious', 'plant-based'],
      'sustainability': ['sustainability'],
      'nutrition': ['health-conscious', 'plant-based'],
      'compliance': ['regulatory'],
      'premium': ['premium'],
      'experience': ['premium', 'technology'],
      'indulgence': ['premium']
    };

    const relevantTrends = relevanceMap[strategy] || [];
    return relevantTrends.some(relevantTrend => trend.includes(relevantTrend));
  }

  /**
   * Calculate forecast confidence
   */
  calculateForecastConfidence(currentTrends, signalCount) {
    let confidence = 50; // Base confidence

    // Increase confidence based on data volume
    if (signalCount > 50) confidence += 20;
    else if (signalCount > 20) confidence += 10;

    // Increase confidence based on trend consistency
    const trendStrengths = Object.values(currentTrends).map(t => t.strength);
    const avgStrength = trendStrengths.reduce((sum, s) => sum + s, 0) / trendStrengths.length;
    confidence += Math.min(20, avgStrength / 5);

    // Adjust for trend momentum consistency
    const momentumScores = Object.values(currentTrends)
      .map(t => t.currentGrowthRate)
      .filter(rate => !isNaN(rate));
    
    if (momentumScores.length > 0) {
      const variance = this.calculateVariance(momentumScores);
      if (variance < 50) confidence += 10; // Low variance = higher confidence
    }

    return Math.round(Math.max(30, Math.min(95, confidence)));
  }

  /**
   * Generate key insights
   */
  async generateKeyInsights(currentTrends, aiPredictions) {
    const insights = [];

    // Top growing trends
    const topTrends = Object.entries(currentTrends)
      .sort(([,a], [,b]) => b.currentGrowthRate - a.currentGrowthRate)
      .slice(0, 3);

    topTrends.forEach(([trend, data]) => {
      insights.push({
        type: 'growth',
        title: `${trend} showing strong momentum`,
        description: `${data.currentGrowthRate.toFixed(1)}% growth with ${data.strength.toFixed(1)}% market presence`,
        impact: data.impact,
        actionable: true
      });
    });

    // AI-driven insights
    if (aiPredictions.disruptions && Array.isArray(aiPredictions.disruptions)) {
      aiPredictions.disruptions.slice(0, 2).forEach(disruption => {
        insights.push({
          type: 'disruption',
          title: `Potential disruption: ${disruption}`,
          description: `Market disruption predicted in this area`,
          impact: 'high',
          actionable: true
        });
      });
    }

    // Seasonal insights
    const currentQuarter = `q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
    const seasonalData = this.seasonalPatterns[currentQuarter];
    
    insights.push({
      type: 'seasonal',
      title: `${currentQuarter.toUpperCase()} seasonal focus`,
      description: `Current quarter emphasizes: ${seasonalData.focus.join(', ')}`,
      impact: 'medium',
      actionable: true
    });

    return insights.slice(0, 6);
  }

  /**
   * Generate trend-based recommendations
   */
  async generateTrendRecommendations(currentTrends, emergingOpportunities) {
    const recommendations = [];

    // High-growth trend recommendations
    Object.entries(currentTrends).forEach(([trend, data]) => {
      if (data.currentGrowthRate > 15 && data.strength > 30) {
        recommendations.push({
          type: 'capitalize',
          priority: 'high',
          trend,
          action: `Develop ${trend}-focused offerings`,
          rationale: `Strong growth (${data.currentGrowthRate.toFixed(1)}%) and market presence`,
          timeframe: 'immediate',
          channels: Object.keys(data.channels).slice(0, 2)
        });
      }
    });

    // Emerging opportunity recommendations
    emergingOpportunities.slice(0, 3).forEach(opportunity => {
      recommendations.push({
        type: 'explore',
        priority: opportunity.confidence > 80 ? 'high' : 'medium',
        trend: opportunity.trend,
        action: `Investigate ${opportunity.type} opportunity`,
        rationale: opportunity.description,
        timeframe: opportunity.timeframe,
        channels: opportunity.channels
      });
    });

    // Defensive recommendations for declining trends
    Object.entries(currentTrends).forEach(([trend, data]) => {
      if (data.currentGrowthRate < -5 && data.strength > 20) {
        recommendations.push({
          type: 'adapt',
          priority: 'medium',
          trend,
          action: `Adapt strategy for declining ${trend} trend`,
          rationale: `Negative growth (${data.currentGrowthRate.toFixed(1)}%) but still significant presence`,
          timeframe: 'short-term',
          channels: Object.keys(data.channels).slice(0, 2)
        });
      }
    });

    return recommendations
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 8);
  }

  /**
   * Get trend keywords for analysis
   */
  getTrendKeywords(trend) {
    const keywordMap = {
      'health-conscious': ['healthy', 'nutrition', 'wellness', 'organic', 'natural', 'clean'],
      'sustainability': ['sustainable', 'eco', 'green', 'environment', 'carbon', 'renewable'],
      'convenience': ['convenient', 'quick', 'easy', 'fast', 'grab-and-go', 'ready'],
      'premium': ['premium', 'luxury', 'high-end', 'gourmet', 'artisan', 'craft'],
      'plant-based': ['plant', 'vegan', 'vegetarian', 'alternative', 'meat-free', 'dairy-free'],
      'automation': ['automated', 'robot', 'ai', 'digital', 'tech', 'smart'],
      'local-sourcing': ['local', 'farm', 'fresh', 'regional', 'community', 'nearby']
    };

    return keywordMap[trend] || [trend];
  }

  /**
   * Calculate variance helper function
   */
  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  /**
   * Get trend forecast summary
   */
  async getTrendForecastSummary() {
    try {
      const forecast = await this.generateTrendForecast('6-months');
      
      return {
        topTrends: Object.entries(forecast.currentTrends || {})
          .sort(([,a], [,b]) => b.currentGrowthRate - a.currentGrowthRate)
          .slice(0, 5)
          .map(([trend, data]) => ({
            trend,
            growth: data.currentGrowthRate,
            strength: data.strength
          })),
        emergingCount: (forecast.emergingOpportunities || []).length,
        confidence: forecast.confidence,
        lastUpdated: forecast.generatedAt
      };
    } catch (error) {
      console.error('Error getting trend forecast summary:', error);
      return {
        topTrends: [],
        emergingCount: 0,
        confidence: 0,
        lastUpdated: new Date().toISOString(),
        error: error.message
      };
    }
  }
}

module.exports = TrendForecastingService;
