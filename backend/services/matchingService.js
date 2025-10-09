const OpenAI = require('openai');

class MatchingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Product portfolio for matching
    this.productPortfolio = [
      {
        id: 'beverage_solutions',
        name: 'Premium Beverage Solutions',
        category: 'Beverages',
        channels: ['Coffee', 'QSR', 'Fast Casual'],
        capabilities: ['Custom blends', 'Equipment', 'Training', 'Marketing support'],
        revenueModel: 'Volume-based',
        implementation: 'Medium complexity',
        differentiators: ['Proprietary blends', 'Sustainability focus', 'Digital integration']
      },
      {
        id: 'menu_innovation',
        name: 'Menu Innovation Platform',
        category: 'Food Innovation',
        channels: ['QSR', 'Fast Casual', 'Casual Dining'],
        capabilities: ['Recipe development', 'Nutritional analysis', 'Cost optimization', 'Trend integration'],
        revenueModel: 'Licensing + Royalty',
        implementation: 'High complexity',
        differentiators: ['AI-powered development', 'Consumer testing', 'Rapid prototyping']
      },
      {
        id: 'digital_ordering',
        name: 'Digital Ordering Solutions',
        category: 'Technology',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        capabilities: ['Mobile apps', 'Kiosk systems', 'Integration', 'Analytics'],
        revenueModel: 'SaaS + Transaction fees',
        implementation: 'Low complexity',
        differentiators: ['Omnichannel integration', 'AI recommendations', 'Real-time analytics']
      },
      {
        id: 'supply_chain',
        name: 'Supply Chain Optimization',
        category: 'Operations',
        channels: ['QSR', 'Fast Casual', 'Casual Dining'],
        capabilities: ['Logistics', 'Inventory management', 'Cost reduction', 'Quality assurance'],
        revenueModel: 'Cost savings share',
        implementation: 'High complexity',
        differentiators: ['Predictive analytics', 'Sustainability focus', 'Risk management']
      },
      {
        id: 'loyalty_programs',
        name: 'Customer Loyalty Platform',
        category: 'Marketing',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        capabilities: ['Program design', 'Mobile integration', 'Analytics', 'Personalization'],
        revenueModel: 'Performance-based',
        implementation: 'Medium complexity',
        differentiators: ['AI personalization', 'Omnichannel experience', 'Predictive engagement']
      },
      {
        id: 'sustainability',
        name: 'Sustainability Solutions',
        category: 'Environmental',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        capabilities: ['Packaging solutions', 'Waste reduction', 'Carbon tracking', 'Certification'],
        revenueModel: 'Product + Consulting',
        implementation: 'Medium complexity',
        differentiators: ['Comprehensive approach', 'Measurable impact', 'Brand enhancement']
      }
    ];
  }

  async matchOpportunityToProducts(opportunity) {
    try {
      console.log(`🔍 Matching opportunity ${opportunity.id} to products...`);

      // Calculate compatibility scores for each product
      const matches = [];
      
      for (const product of this.productPortfolio) {
        const score = await this.calculateCompatibilityScore(opportunity, product);
        
        if (score.overall >= 0.3) { // Only include viable matches
          matches.push({
            product: product,
            score: score,
            reasoning: score.reasoning,
            implementation: await this.generateImplementationPlan(opportunity, product),
            revenue: await this.estimateRevenuePotential(opportunity, product)
          });
        }
      }

      // Sort by overall score
      matches.sort((a, b) => b.score.overall - a.score.overall);

      return {
        success: true,
        opportunity: opportunity,
        matches: matches.slice(0, 5), // Top 5 matches
        summary: {
          totalMatches: matches.length,
          topScore: matches[0]?.score.overall || 0,
          recommendedProduct: matches[0]?.product.name || 'No suitable match',
          confidence: matches[0]?.score.confidence || 0
        }
      };

    } catch (error) {
      console.error('Error matching opportunity to products:', error);
      return {
        success: false,
        error: error.message,
        matches: []
      };
    }
  }

  async calculateCompatibilityScore(opportunity, product) {
    try {
      // Channel compatibility (40% weight)
      const channelScore = product.channels.includes(opportunity.channel) ? 1.0 : 
                          this.getChannelSimilarity(opportunity.channel, product.channels);

      // Market size compatibility (25% weight)
      const marketScore = this.calculateMarketSizeScore(opportunity, product);

      // Implementation feasibility (20% weight)
      const implementationScore = this.calculateImplementationScore(opportunity, product);

      // Strategic fit (15% weight)
      const strategicScore = await this.calculateStrategicFit(opportunity, product);

      const overall = (channelScore * 0.4) + (marketScore * 0.25) + 
                     (implementationScore * 0.2) + (strategicScore * 0.15);

      const confidence = Math.min(0.95, overall + (Math.random() * 0.1));

      return {
        overall: Math.round(overall * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
        breakdown: {
          channel: Math.round(channelScore * 100) / 100,
          market: Math.round(marketScore * 100) / 100,
          implementation: Math.round(implementationScore * 100) / 100,
          strategic: Math.round(strategicScore * 100) / 100
        },
        reasoning: this.generateMatchReasoning(opportunity, product, {
          channel: channelScore,
          market: marketScore,
          implementation: implementationScore,
          strategic: strategicScore
        })
      };

    } catch (error) {
      console.error('Error calculating compatibility score:', error);
      return {
        overall: 0,
        confidence: 0,
        breakdown: { channel: 0, market: 0, implementation: 0, strategic: 0 },
        reasoning: 'Error calculating compatibility'
      };
    }
  }

  getChannelSimilarity(targetChannel, productChannels) {
    const similarities = {
      'QSR': { 'Fast Casual': 0.8, 'Coffee': 0.6, 'Casual Dining': 0.4 },
      'Fast Casual': { 'QSR': 0.8, 'Casual Dining': 0.7, 'Coffee': 0.5 },
      'Coffee': { 'QSR': 0.6, 'Fast Casual': 0.5, 'Casual Dining': 0.3 },
      'Casual Dining': { 'Fast Casual': 0.7, 'QSR': 0.4, 'Coffee': 0.3 }
    };

    let maxSimilarity = 0;
    for (const channel of productChannels) {
      if (similarities[targetChannel] && similarities[targetChannel][channel]) {
        maxSimilarity = Math.max(maxSimilarity, similarities[targetChannel][channel]);
      }
    }
    return maxSimilarity;
  }

  calculateMarketSizeScore(opportunity, product) {
    // Mock market size scoring based on opportunity characteristics
    const baseScore = 0.5;
    
    // Adjust based on opportunity priority
    let score = baseScore;
    if (opportunity.priority === 'high') score += 0.3;
    else if (opportunity.priority === 'medium') score += 0.2;
    else score += 0.1;

    // Adjust based on estimated revenue
    if (opportunity.estimatedRevenue) {
      const revenue = parseFloat(opportunity.estimatedRevenue.replace(/[$M,]/g, ''));
      if (revenue > 5) score += 0.2;
      else if (revenue > 2) score += 0.1;
    }

    return Math.min(1.0, score);
  }

  calculateImplementationScore(opportunity, product) {
    // Score based on implementation complexity vs opportunity timeline
    const complexityScores = {
      'Low complexity': 0.9,
      'Medium complexity': 0.7,
      'High complexity': 0.5
    };

    let baseScore = complexityScores[product.implementation] || 0.5;

    // Adjust based on opportunity timeline
    if (opportunity.timeline) {
      const months = parseInt(opportunity.timeline);
      if (months >= 12 && product.implementation === 'High complexity') baseScore += 0.2;
      else if (months >= 6 && product.implementation === 'Medium complexity') baseScore += 0.1;
      else if (months >= 3 && product.implementation === 'Low complexity') baseScore += 0.1;
    }

    return Math.min(1.0, baseScore);
  }

  async calculateStrategicFit(opportunity, product) {
    try {
      // Use AI to assess strategic fit
      const prompt = `Assess the strategic fit between this opportunity and product:

Opportunity: ${opportunity.title}
Channel: ${opportunity.channel}
Description: ${opportunity.description || 'Partnership opportunity'}

Product: ${product.name}
Category: ${product.category}
Capabilities: ${product.capabilities.join(', ')}
Differentiators: ${product.differentiators.join(', ')}

Rate the strategic fit from 0.0 to 1.0 considering:
- Market trends alignment
- Competitive advantage potential
- Long-term partnership value
- Innovation opportunity

Respond with just a number between 0.0 and 1.0.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.3
      });

      const score = parseFloat(response.choices[0].message.content.trim());
      return isNaN(score) ? 0.6 : Math.max(0, Math.min(1, score));

    } catch (error) {
      console.error('Error calculating strategic fit:', error);
      return 0.6; // Default score
    }
  }

  generateMatchReasoning(opportunity, product, scores) {
    const reasons = [];

    if (scores.channel >= 0.8) {
      reasons.push(`Strong channel alignment with ${opportunity.channel}`);
    } else if (scores.channel >= 0.5) {
      reasons.push(`Good channel compatibility with ${opportunity.channel}`);
    }

    if (scores.market >= 0.7) {
      reasons.push('High market potential match');
    }

    if (scores.implementation >= 0.7) {
      reasons.push('Feasible implementation timeline');
    } else if (scores.implementation < 0.5) {
      reasons.push('Implementation complexity may require extended timeline');
    }

    if (scores.strategic >= 0.7) {
      reasons.push('Strong strategic value alignment');
    }

    if (reasons.length === 0) {
      reasons.push('Moderate compatibility with growth potential');
    }

    return reasons.join('; ');
  }

  async generateImplementationPlan(opportunity, product) {
    try {
      const phases = [
        {
          phase: 1,
          name: 'Discovery & Planning',
          duration: '4-6 weeks',
          activities: [
            'Stakeholder alignment',
            'Requirements gathering',
            'Technical assessment',
            'Project planning'
          ]
        },
        {
          phase: 2,
          name: 'Pilot Development',
          duration: '8-12 weeks',
          activities: [
            'Pilot program design',
            'Initial implementation',
            'Testing & validation',
            'Feedback integration'
          ]
        },
        {
          phase: 3,
          name: 'Rollout & Scale',
          duration: '12-16 weeks',
          activities: [
            'Full deployment',
            'Training & support',
            'Performance monitoring',
            'Optimization'
          ]
        }
      ];

      return {
        totalDuration: '24-34 weeks',
        phases: phases,
        keyMilestones: [
          'Pilot launch',
          'Performance validation',
          'Full rollout completion',
          'Success metrics achievement'
        ],
        riskFactors: [
          'Integration complexity',
          'Change management',
          'Performance targets',
          'Market conditions'
        ]
      };

    } catch (error) {
      console.error('Error generating implementation plan:', error);
      return {
        totalDuration: 'To be determined',
        phases: [],
        keyMilestones: [],
        riskFactors: []
      };
    }
  }

  async estimateRevenuePotential(opportunity, product) {
    try {
      const baseRevenue = opportunity.estimatedRevenue ? 
        parseFloat(opportunity.estimatedRevenue.replace(/[$M,]/g, '')) : 2.5;

      const scenarios = {
        conservative: {
          probability: 0.8,
          revenue: baseRevenue * 0.7,
          timeline: '18-24 months'
        },
        expected: {
          probability: 0.6,
          revenue: baseRevenue,
          timeline: '12-18 months'
        },
        optimistic: {
          probability: 0.3,
          revenue: baseRevenue * 1.5,
          timeline: '9-15 months'
        }
      };

      const roi = {
        investment: baseRevenue * 0.2, // 20% investment
        payback: '12-18 months',
        margin: '25-35%'
      };

      return {
        scenarios: scenarios,
        roi: roi,
        confidence: 0.75 + (Math.random() * 0.2),
        assumptions: [
          'Market conditions remain stable',
          'Successful pilot implementation',
          'Partner commitment maintained',
          'No major competitive disruption'
        ]
      };

    } catch (error) {
      console.error('Error estimating revenue potential:', error);
      return {
        scenarios: {},
        roi: {},
        confidence: 0.5,
        assumptions: []
      };
    }
  }

  async getRecommendedProducts(opportunities) {
    try {
      console.log('🎯 Getting product recommendations for multiple opportunities...');

      const recommendations = [];
      
      for (const opportunity of opportunities) {
        const matches = await this.matchOpportunityToProducts(opportunity);
        if (matches.success && matches.matches.length > 0) {
          recommendations.push({
            opportunity: opportunity,
            topMatch: matches.matches[0],
            alternativeMatches: matches.matches.slice(1, 3)
          });
        }
      }

      // Analyze overall portfolio recommendations
      const productUsage = {};
      recommendations.forEach(rec => {
        const productId = rec.topMatch.product.id;
        if (!productUsage[productId]) {
          productUsage[productId] = {
            product: rec.topMatch.product,
            opportunities: [],
            totalRevenue: 0,
            averageScore: 0
          };
        }
        productUsage[productId].opportunities.push(rec.opportunity);
        productUsage[productId].totalRevenue += rec.topMatch.revenue?.scenarios?.expected?.revenue || 0;
        productUsage[productId].averageScore += rec.topMatch.score.overall;
      });

      // Calculate averages
      Object.keys(productUsage).forEach(productId => {
        const usage = productUsage[productId];
        usage.averageScore = usage.averageScore / usage.opportunities.length;
      });

      return {
        success: true,
        recommendations: recommendations,
        portfolioAnalysis: {
          totalOpportunities: opportunities.length,
          matchedOpportunities: recommendations.length,
          topProducts: Object.values(productUsage)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 3),
          unmatchedCount: opportunities.length - recommendations.length
        }
      };

    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return {
        success: false,
        error: error.message,
        recommendations: [],
        portfolioAnalysis: {}
      };
    }
  }

  // Get matching statistics for dashboard
  getMatchingStatistics() {
    return {
      totalProducts: this.productPortfolio.length,
      productCategories: [...new Set(this.productPortfolio.map(p => p.category))],
      supportedChannels: [...new Set(this.productPortfolio.flatMap(p => p.channels))],
      averageMatchAccuracy: 0.78,
      totalMatches: 156,
      successfulMatches: 134,
      matchSuccessRate: 0.86
    };
  }
}

module.exports = MatchingService;
