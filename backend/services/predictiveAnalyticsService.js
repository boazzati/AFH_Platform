const { OpenAI } = require('openai');
const mongoose = require('mongoose');

class PredictiveAnalyticsService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Scoring weights for different factors
    this.scoringWeights = {
      channelRelevance: 0.25,
      marketTiming: 0.20,
      competitivePosition: 0.15,
      revenueSize: 0.20,
      executionComplexity: 0.10,
      strategicFit: 0.10
    };

    // Historical success patterns (would be learned from real data)
    this.successPatterns = {
      channels: {
        'quick-service': { successRate: 0.75, avgRevenue: 250000, timeToClose: 90 },
        'fast-casual': { successRate: 0.68, avgRevenue: 180000, timeToClose: 120 },
        'workplace': { successRate: 0.82, avgRevenue: 150000, timeToClose: 60 },
        'education': { successRate: 0.71, avgRevenue: 120000, timeToClose: 150 },
        'healthcare': { successRate: 0.65, avgRevenue: 100000, timeToClose: 180 },
        'leisure': { successRate: 0.58, avgRevenue: 200000, timeToClose: 200 }
      },
      timing: {
        'q1': 0.72,
        'q2': 0.85,
        'q3': 0.68,
        'q4': 0.91
      },
      companySize: {
        'enterprise': { successRate: 0.85, avgDealSize: 500000 },
        'large': { successRate: 0.75, avgDealSize: 250000 },
        'medium': { successRate: 0.65, avgDealSize: 100000 },
        'small': { successRate: 0.55, avgDealSize: 50000 }
      }
    };

    // Market trend indicators
    this.trendIndicators = {
      'health-conscious': { growth: 0.15, impact: 'high' },
      'sustainability': { growth: 0.22, impact: 'high' },
      'convenience': { growth: 0.18, impact: 'medium' },
      'premium': { growth: 0.12, impact: 'medium' },
      'plant-based': { growth: 0.35, impact: 'high' },
      'local-sourcing': { growth: 0.20, impact: 'medium' }
    };
  }

  /**
   * Score an opportunity using ML-powered analysis
   */
  async scoreOpportunity(opportunity) {
    try {
      console.log(`🎯 Scoring opportunity: ${opportunity.title}`);
      
      // Get AI-powered analysis
      const aiAnalysis = await this.getAIAnalysis(opportunity);
      
      // Calculate component scores
      const scores = {
        channelRelevance: this.calculateChannelRelevance(opportunity),
        marketTiming: this.calculateMarketTiming(opportunity),
        competitivePosition: await this.calculateCompetitivePosition(opportunity),
        revenueSize: this.calculateRevenueSize(opportunity),
        executionComplexity: this.calculateExecutionComplexity(opportunity),
        strategicFit: this.calculateStrategicFit(opportunity)
      };

      // Calculate weighted overall score
      const overallScore = Object.entries(scores).reduce((total, [key, score]) => {
        return total + (score * this.scoringWeights[key]);
      }, 0);

      // Determine priority based on score
      const priority = this.determinePriority(overallScore);
      
      // Calculate success probability
      const successProbability = this.calculateSuccessProbability(opportunity, scores);
      
      // Estimate revenue potential
      const revenueEstimate = this.estimateRevenuePotential(opportunity);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(opportunity, scores, aiAnalysis);

      const result = {
        overallScore: Math.round(overallScore),
        priority,
        successProbability: Math.round(successProbability * 100),
        revenueEstimate,
        componentScores: scores,
        aiAnalysis,
        recommendations,
        scoringTimestamp: new Date().toISOString(),
        confidence: this.calculateConfidence(scores, aiAnalysis)
      };

      console.log(`✅ Opportunity scored: ${result.overallScore}/100 (${priority})`);
      return result;

    } catch (error) {
      console.error('❌ Error scoring opportunity:', error);
      return {
        overallScore: 50,
        priority: 'medium',
        successProbability: 50,
        revenueEstimate: { min: 0, max: 0, expected: 0 },
        error: error.message,
        confidence: 30
      };
    }
  }

  /**
   * Get AI-powered analysis of the opportunity
   */
  async getAIAnalysis(opportunity) {
    try {
      const prompt = `
        Analyze this AFH market opportunity and provide insights:
        
        Title: ${opportunity.title}
        Channel: ${opportunity.channel}
        Description: ${opportunity.description || 'No description provided'}
        Company: ${opportunity.company || 'Unknown'}
        Location: ${opportunity.location || 'Unknown'}
        
        Provide analysis on:
        1. Market potential and timing
        2. Competitive landscape
        3. Key success factors
        4. Potential risks and challenges
        5. Strategic recommendations
        
        Format as JSON with keys: marketPotential, competitive, successFactors, risks, recommendations
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AFH market analyst. Provide concise, actionable insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      try {
        return JSON.parse(response.choices[0].message.content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          marketPotential: response.choices[0].message.content.substring(0, 200),
          competitive: 'Analysis available in full response',
          successFactors: ['Market timing', 'Product fit', 'Execution capability'],
          risks: ['Competition', 'Market changes', 'Execution challenges'],
          recommendations: ['Conduct market research', 'Develop pilot program', 'Build partnerships']
        };
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      return {
        marketPotential: 'AI analysis unavailable',
        competitive: 'Unable to assess',
        successFactors: ['Unknown'],
        risks: ['Analysis error'],
        recommendations: ['Manual review required']
      };
    }
  }

  /**
   * Calculate channel relevance score
   */
  calculateChannelRelevance(opportunity) {
    const channel = opportunity.channel?.toLowerCase() || 'unknown';
    const channelData = this.successPatterns.channels[channel];
    
    if (!channelData) return 50; // Default for unknown channels
    
    // Base score from historical success rate
    let score = channelData.successRate * 100;
    
    // Adjust based on market trends
    const trends = this.identifyRelevantTrends(opportunity);
    const trendBoost = trends.reduce((boost, trend) => {
      const trendData = this.trendIndicators[trend];
      return boost + (trendData ? trendData.growth * 10 : 0);
    }, 0);
    
    return Math.min(100, score + trendBoost);
  }

  /**
   * Calculate market timing score
   */
  calculateMarketTiming(opportunity) {
    const currentQuarter = `q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
    const quarterMultiplier = this.successPatterns.timing[currentQuarter] || 0.7;
    
    // Base timing score
    let score = quarterMultiplier * 100;
    
    // Adjust for urgency indicators
    const urgencyKeywords = ['urgent', 'immediate', 'asap', 'quick', 'fast'];
    const hasUrgency = urgencyKeywords.some(keyword => 
      (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase().includes(keyword)
    );
    
    if (hasUrgency) score += 10;
    
    // Adjust for seasonal factors
    const month = new Date().getMonth();
    if (month >= 8 && month <= 10) score += 15; // Q4 boost for food service
    if (month >= 0 && month <= 2) score -= 10; // Q1 typically slower
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate competitive position score
   */
  async calculateCompetitivePosition(opportunity) {
    // This would ideally use real competitive intelligence data
    // For now, use heuristics based on opportunity characteristics
    
    let score = 70; // Default competitive position
    
    // Adjust based on company size indicators
    const sizeIndicators = {
      'enterprise': ['fortune', 'global', 'international', 'nationwide'],
      'large': ['regional', 'multi-state', 'chain'],
      'medium': ['local', 'community', 'family'],
      'small': ['independent', 'single', 'startup']
    };
    
    const opportunityText = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    for (const [size, keywords] of Object.entries(sizeIndicators)) {
      if (keywords.some(keyword => opportunityText.includes(keyword))) {
        const sizeData = this.successPatterns.companySize[size];
        if (sizeData) {
          score = sizeData.successRate * 100;
          break;
        }
      }
    }
    
    return score;
  }

  /**
   * Calculate revenue size score
   */
  calculateRevenueSize(opportunity) {
    const revenueEstimate = this.estimateRevenuePotential(opportunity);
    const expectedRevenue = revenueEstimate.expected;
    
    // Score based on revenue potential
    if (expectedRevenue >= 500000) return 100;
    if (expectedRevenue >= 250000) return 85;
    if (expectedRevenue >= 100000) return 70;
    if (expectedRevenue >= 50000) return 55;
    return 40;
  }

  /**
   * Calculate execution complexity score (lower complexity = higher score)
   */
  calculateExecutionComplexity(opportunity) {
    let complexityScore = 80; // Start with low complexity assumption
    
    const complexityIndicators = [
      'regulatory', 'compliance', 'certification', 'approval',
      'custom', 'specialized', 'unique', 'complex',
      'integration', 'system', 'technology', 'platform'
    ];
    
    const opportunityText = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    const complexityCount = complexityIndicators.filter(indicator => 
      opportunityText.includes(indicator)
    ).length;
    
    // Reduce score based on complexity indicators
    complexityScore -= (complexityCount * 10);
    
    return Math.max(20, complexityScore);
  }

  /**
   * Calculate strategic fit score
   */
  calculateStrategicFit(opportunity) {
    // This would ideally be based on company's strategic priorities
    // For now, use general AFH strategic indicators
    
    const strategicKeywords = {
      'high': ['growth', 'expansion', 'scale', 'strategic', 'partnership'],
      'medium': ['opportunity', 'potential', 'market', 'channel'],
      'low': ['test', 'pilot', 'trial', 'experiment']
    };
    
    const opportunityText = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    for (const [level, keywords] of Object.entries(strategicKeywords)) {
      if (keywords.some(keyword => opportunityText.includes(keyword))) {
        switch (level) {
          case 'high': return 90;
          case 'medium': return 70;
          case 'low': return 50;
        }
      }
    }
    
    return 60; // Default strategic fit
  }

  /**
   * Determine priority based on overall score
   */
  determinePriority(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  /**
   * Calculate success probability
   */
  calculateSuccessProbability(opportunity, scores) {
    // Weighted combination of component scores
    const weights = {
      channelRelevance: 0.3,
      marketTiming: 0.25,
      competitivePosition: 0.2,
      revenueSize: 0.15,
      strategicFit: 0.1
    };
    
    const probability = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + ((scores[key] / 100) * weight);
    }, 0);
    
    return Math.max(0.1, Math.min(0.95, probability));
  }

  /**
   * Estimate revenue potential
   */
  estimateRevenuePotential(opportunity) {
    const channel = opportunity.channel?.toLowerCase() || 'unknown';
    const channelData = this.successPatterns.channels[channel];
    
    let baseRevenue = channelData ? channelData.avgRevenue : 100000;
    
    // Adjust based on company size indicators
    const opportunityText = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    if (opportunityText.includes('enterprise') || opportunityText.includes('fortune')) {
      baseRevenue *= 2.5;
    } else if (opportunityText.includes('regional') || opportunityText.includes('chain')) {
      baseRevenue *= 1.5;
    } else if (opportunityText.includes('local') || opportunityText.includes('independent')) {
      baseRevenue *= 0.7;
    }
    
    // Add variance for min/max estimates
    return {
      min: Math.round(baseRevenue * 0.6),
      max: Math.round(baseRevenue * 1.8),
      expected: Math.round(baseRevenue)
    };
  }

  /**
   * Generate AI-powered recommendations
   */
  async generateRecommendations(opportunity, scores, aiAnalysis) {
    const recommendations = [];
    
    // Score-based recommendations
    if (scores.channelRelevance < 60) {
      recommendations.push({
        type: 'channel',
        priority: 'high',
        action: 'Validate channel fit and market demand',
        rationale: 'Low channel relevance score indicates potential misalignment'
      });
    }
    
    if (scores.marketTiming < 50) {
      recommendations.push({
        type: 'timing',
        priority: 'medium',
        action: 'Consider timing optimization or seasonal adjustments',
        rationale: 'Market timing score suggests suboptimal entry timing'
      });
    }
    
    if (scores.competitivePosition < 70) {
      recommendations.push({
        type: 'competitive',
        priority: 'high',
        action: 'Conduct competitive analysis and differentiation strategy',
        rationale: 'Competitive position needs strengthening'
      });
    }
    
    if (scores.revenueSize < 60) {
      recommendations.push({
        type: 'revenue',
        priority: 'medium',
        action: 'Explore revenue enhancement opportunities',
        rationale: 'Revenue potential appears limited'
      });
    }
    
    // AI analysis-based recommendations
    if (aiAnalysis.recommendations && Array.isArray(aiAnalysis.recommendations)) {
      aiAnalysis.recommendations.forEach((rec, index) => {
        recommendations.push({
          type: 'ai-insight',
          priority: index === 0 ? 'high' : 'medium',
          action: rec,
          rationale: 'AI-generated strategic recommendation'
        });
      });
    }
    
    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Calculate confidence in the scoring
   */
  calculateConfidence(scores, aiAnalysis) {
    // Base confidence on data availability and score consistency
    let confidence = 70;
    
    // Reduce confidence if scores are highly variable
    const scoreValues = Object.values(scores);
    const scoreVariance = this.calculateVariance(scoreValues);
    if (scoreVariance > 400) confidence -= 20;
    
    // Increase confidence if AI analysis is available
    if (aiAnalysis && aiAnalysis.marketPotential !== 'AI analysis unavailable') {
      confidence += 15;
    }
    
    // Adjust based on data completeness
    const dataCompleteness = scoreValues.filter(score => score > 0).length / scoreValues.length;
    confidence *= dataCompleteness;
    
    return Math.round(Math.max(30, Math.min(95, confidence)));
  }

  /**
   * Identify relevant market trends
   */
  identifyRelevantTrends(opportunity) {
    const opportunityText = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    const trends = [];
    
    Object.keys(this.trendIndicators).forEach(trend => {
      const trendKeywords = {
        'health-conscious': ['healthy', 'nutrition', 'wellness', 'organic'],
        'sustainability': ['sustainable', 'eco', 'green', 'environment'],
        'convenience': ['convenient', 'quick', 'easy', 'fast'],
        'premium': ['premium', 'luxury', 'high-end', 'gourmet'],
        'plant-based': ['plant', 'vegan', 'vegetarian', 'alternative'],
        'local-sourcing': ['local', 'farm', 'fresh', 'regional']
      };
      
      const keywords = trendKeywords[trend] || [];
      if (keywords.some(keyword => opportunityText.includes(keyword))) {
        trends.push(trend);
      }
    });
    
    return trends;
  }

  /**
   * Calculate variance of an array of numbers
   */
  calculateVariance(numbers) {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  /**
   * Batch score multiple opportunities
   */
  async batchScoreOpportunities(opportunities) {
    console.log(`🎯 Batch scoring ${opportunities.length} opportunities...`);
    
    const results = [];
    for (const opportunity of opportunities) {
      try {
        const score = await this.scoreOpportunity(opportunity);
        results.push({
          opportunityId: opportunity._id || opportunity.id,
          ...score
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error scoring opportunity ${opportunity.title}:`, error);
        results.push({
          opportunityId: opportunity._id || opportunity.id,
          error: error.message,
          overallScore: 50,
          priority: 'medium'
        });
      }
    }
    
    console.log(`✅ Batch scoring completed: ${results.length} opportunities processed`);
    return results;
  }

  /**
   * Get scoring statistics
   */
  async getScoringStatistics() {
    try {
      if (mongoose.connection.readyState !== 1) {
        return { error: 'Database not available' };
      }

      const signals = await mongoose.connection.db
        .collection('market-signals')
        .find({ 'scoring.overallScore': { $exists: true } })
        .toArray();

      if (signals.length === 0) {
        return {
          totalScored: 0,
          averageScore: 0,
          priorityDistribution: { high: 0, medium: 0, low: 0 },
          topPerformingChannels: []
        };
      }

      const scores = signals.map(s => s.scoring.overallScore);
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      const priorityDistribution = signals.reduce((dist, signal) => {
        const priority = signal.scoring.priority || 'medium';
        dist[priority] = (dist[priority] || 0) + 1;
        return dist;
      }, { high: 0, medium: 0, low: 0 });

      const channelScores = signals.reduce((channels, signal) => {
        const channel = signal.channel;
        if (!channels[channel]) {
          channels[channel] = { scores: [], count: 0 };
        }
        channels[channel].scores.push(signal.scoring.overallScore);
        channels[channel].count++;
        return channels;
      }, {});

      const topPerformingChannels = Object.entries(channelScores)
        .map(([channel, data]) => ({
          channel,
          averageScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
          count: data.count
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5);

      return {
        totalScored: signals.length,
        averageScore: Math.round(averageScore),
        priorityDistribution,
        topPerformingChannels
      };

    } catch (error) {
      console.error('Error getting scoring statistics:', error);
      return { error: error.message };
    }
  }
}

module.exports = PredictiveAnalyticsService;
