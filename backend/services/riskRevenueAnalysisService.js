const { OpenAI } = require('openai');
const mongoose = require('mongoose');

class RiskRevenueAnalysisService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Risk factors and their weights
    this.riskFactors = {
      market: {
        weight: 0.25,
        factors: {
          'market-saturation': { impact: 'high', probability: 0.3 },
          'economic-downturn': { impact: 'high', probability: 0.2 },
          'consumer-preference-shift': { impact: 'medium', probability: 0.4 },
          'seasonal-volatility': { impact: 'medium', probability: 0.6 }
        }
      },
      competitive: {
        weight: 0.20,
        factors: {
          'new-entrants': { impact: 'medium', probability: 0.5 },
          'price-competition': { impact: 'high', probability: 0.4 },
          'product-substitution': { impact: 'medium', probability: 0.3 },
          'market-consolidation': { impact: 'high', probability: 0.2 }
        }
      },
      operational: {
        weight: 0.25,
        factors: {
          'supply-chain-disruption': { impact: 'high', probability: 0.3 },
          'quality-issues': { impact: 'high', probability: 0.1 },
          'capacity-constraints': { impact: 'medium', probability: 0.4 },
          'technology-failure': { impact: 'medium', probability: 0.2 }
        }
      },
      regulatory: {
        weight: 0.15,
        factors: {
          'regulation-changes': { impact: 'high', probability: 0.3 },
          'compliance-costs': { impact: 'medium', probability: 0.5 },
          'food-safety-requirements': { impact: 'high', probability: 0.2 },
          'labeling-requirements': { impact: 'low', probability: 0.4 }
        }
      },
      financial: {
        weight: 0.15,
        factors: {
          'payment-delays': { impact: 'medium', probability: 0.3 },
          'currency-fluctuation': { impact: 'medium', probability: 0.4 },
          'credit-risk': { impact: 'high', probability: 0.1 },
          'cost-inflation': { impact: 'medium', probability: 0.6 }
        }
      }
    };

    // Revenue models by channel
    this.revenueModels = {
      'quick-service': {
        baseMultiplier: 1.2,
        volumeFactors: { low: 0.8, medium: 1.0, high: 1.5 },
        seasonality: { q1: 0.9, q2: 1.1, q3: 0.95, q4: 1.15 },
        avgDealSize: 150000,
        timeToRevenue: 60, // days
        rampUpPeriod: 180 // days
      },
      'fast-casual': {
        baseMultiplier: 1.0,
        volumeFactors: { low: 0.7, medium: 1.0, high: 1.4 },
        seasonality: { q1: 0.85, q2: 1.15, q3: 1.0, q4: 1.1 },
        avgDealSize: 120000,
        timeToRevenue: 90,
        rampUpPeriod: 240
      },
      'workplace': {
        baseMultiplier: 0.9,
        volumeFactors: { low: 0.9, medium: 1.0, high: 1.3 },
        seasonality: { q1: 1.1, q2: 0.9, q3: 1.2, q4: 0.8 },
        avgDealSize: 100000,
        timeToRevenue: 45,
        rampUpPeriod: 120
      },
      'education': {
        baseMultiplier: 0.8,
        volumeFactors: { low: 0.8, medium: 1.0, high: 1.2 },
        seasonality: { q1: 1.2, q2: 0.7, q3: 1.3, q4: 0.8 },
        avgDealSize: 80000,
        timeToRevenue: 120,
        rampUpPeriod: 180
      },
      'healthcare': {
        baseMultiplier: 0.85,
        volumeFactors: { low: 0.9, medium: 1.0, high: 1.1 },
        seasonality: { q1: 1.0, q2: 1.0, q3: 1.0, q4: 1.0 },
        avgDealSize: 90000,
        timeToRevenue: 150,
        rampUpPeriod: 270
      },
      'leisure': {
        baseMultiplier: 1.1,
        volumeFactors: { low: 0.6, medium: 1.0, high: 1.8 },
        seasonality: { q1: 0.8, q2: 1.3, q3: 1.2, q4: 0.9 },
        avgDealSize: 180000,
        timeToRevenue: 180,
        rampUpPeriod: 360
      }
    };

    // Success probability factors
    this.successFactors = {
      'channel-experience': { weight: 0.3, impact: 'high' },
      'product-fit': { weight: 0.25, impact: 'high' },
      'timing': { weight: 0.2, impact: 'medium' },
      'competitive-position': { weight: 0.15, impact: 'medium' },
      'execution-capability': { weight: 0.1, impact: 'medium' }
    };
  }

  /**
   * Perform comprehensive risk assessment
   */
  async performRiskAssessment(opportunity) {
    try {
      console.log(`⚠️ Performing risk assessment for: ${opportunity.title}`);

      // Get AI-powered risk analysis
      const aiRiskAnalysis = await this.getAIRiskAnalysis(opportunity);

      // Calculate risk scores by category
      const riskScores = await this.calculateRiskScores(opportunity, aiRiskAnalysis);

      // Identify top risks
      const topRisks = this.identifyTopRisks(riskScores, aiRiskAnalysis);

      // Calculate overall risk score
      const overallRiskScore = this.calculateOverallRiskScore(riskScores);

      // Generate mitigation strategies
      const mitigationStrategies = await this.generateMitigationStrategies(topRisks, opportunity);

      // Calculate risk-adjusted metrics
      const riskAdjustments = this.calculateRiskAdjustments(overallRiskScore);

      const assessment = {
        overallRiskScore,
        riskLevel: this.determineRiskLevel(overallRiskScore),
        riskScores,
        topRisks,
        mitigationStrategies,
        riskAdjustments,
        aiRiskAnalysis,
        assessmentDate: new Date().toISOString(),
        confidence: this.calculateRiskConfidence(riskScores, aiRiskAnalysis)
      };

      console.log(`✅ Risk assessment completed: ${assessment.riskLevel} risk (${overallRiskScore}/100)`);
      return assessment;

    } catch (error) {
      console.error('❌ Error performing risk assessment:', error);
      return {
        overallRiskScore: 50,
        riskLevel: 'medium',
        error: error.message,
        confidence: 30
      };
    }
  }

  /**
   * Predict revenue potential with multiple scenarios
   */
  async predictRevenuePotential(opportunity, riskAssessment = null) {
    try {
      console.log(`💰 Predicting revenue potential for: ${opportunity.title}`);

      // Get base revenue model
      const revenueModel = this.getRevenueModel(opportunity.channel);

      // Calculate base revenue estimate
      const baseRevenue = this.calculateBaseRevenue(opportunity, revenueModel);

      // Generate scenario-based predictions
      const scenarios = this.generateRevenueScenarios(baseRevenue, opportunity, revenueModel);

      // Apply risk adjustments if available
      if (riskAssessment) {
        this.applyRiskAdjustments(scenarios, riskAssessment);
      }

      // Calculate time-based projections
      const timeProjections = this.calculateTimeProjections(scenarios, revenueModel);

      // Get AI-powered revenue insights
      const aiRevenueInsights = await this.getAIRevenueInsights(opportunity, scenarios);

      // Calculate ROI estimates
      const roiEstimates = this.calculateROIEstimates(scenarios, opportunity);

      const prediction = {
        baseRevenue,
        scenarios,
        timeProjections,
        roiEstimates,
        aiRevenueInsights,
        assumptions: this.getRevenueAssumptions(opportunity, revenueModel),
        confidence: this.calculateRevenueConfidence(opportunity, scenarios),
        predictionDate: new Date().toISOString()
      };

      console.log(`✅ Revenue prediction completed: $${scenarios.expected.total.toLocaleString()} expected`);
      return prediction;

    } catch (error) {
      console.error('❌ Error predicting revenue potential:', error);
      return {
        baseRevenue: 0,
        scenarios: { conservative: { total: 0 }, expected: { total: 0 }, optimistic: { total: 0 } },
        error: error.message,
        confidence: 30
      };
    }
  }

  /**
   * Get AI-powered risk analysis
   */
  async getAIRiskAnalysis(opportunity) {
    try {
      const prompt = `
        Analyze the risks for this AFH market opportunity:
        
        Title: ${opportunity.title}
        Channel: ${opportunity.channel}
        Description: ${opportunity.description || 'No description'}
        Company: ${opportunity.company || 'Unknown'}
        Priority: ${opportunity.priority || 'medium'}
        
        Identify and assess:
        1. Market risks (competition, saturation, demand changes)
        2. Operational risks (execution, supply chain, quality)
        3. Financial risks (payment, costs, profitability)
        4. Regulatory risks (compliance, changes, requirements)
        5. Strategic risks (fit, timing, resources)
        
        For each risk, provide: description, probability (0-1), impact (low/medium/high)
        Format as JSON with risk categories as keys.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a risk analyst specializing in AFH market opportunities. Provide structured risk analysis in JSON format.'
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
        // Fallback structure
        return {
          market: [{ description: 'Market competition risk', probability: 0.4, impact: 'medium' }],
          operational: [{ description: 'Execution complexity', probability: 0.3, impact: 'medium' }],
          financial: [{ description: 'Revenue uncertainty', probability: 0.5, impact: 'medium' }],
          regulatory: [{ description: 'Compliance requirements', probability: 0.2, impact: 'low' }],
          strategic: [{ description: 'Strategic alignment', probability: 0.3, impact: 'medium' }]
        };
      }
    } catch (error) {
      console.error('Error getting AI risk analysis:', error);
      return {};
    }
  }

  /**
   * Calculate risk scores by category
   */
  async calculateRiskScores(opportunity, aiRiskAnalysis) {
    const scores = {};

    Object.entries(this.riskFactors).forEach(([category, categoryData]) => {
      let categoryScore = 0;
      let factorCount = 0;

      // Calculate base risk from predefined factors
      Object.entries(categoryData.factors).forEach(([factor, factorData]) => {
        const riskScore = factorData.probability * this.getImpactMultiplier(factorData.impact);
        categoryScore += riskScore;
        factorCount++;
      });

      // Incorporate AI analysis if available
      if (aiRiskAnalysis[category] && Array.isArray(aiRiskAnalysis[category])) {
        aiRiskAnalysis[category].forEach(risk => {
          const aiRiskScore = risk.probability * this.getImpactMultiplier(risk.impact);
          categoryScore += aiRiskScore;
          factorCount++;
        });
      }

      // Normalize to 0-100 scale
      scores[category] = factorCount > 0 ? Math.min(100, (categoryScore / factorCount) * 100) : 50;
    });

    return scores;
  }

  /**
   * Get impact multiplier for risk impact level
   */
  getImpactMultiplier(impact) {
    const multipliers = { low: 0.3, medium: 0.6, high: 1.0 };
    return multipliers[impact] || 0.6;
  }

  /**
   * Identify top risks across all categories
   */
  identifyTopRisks(riskScores, aiRiskAnalysis) {
    const allRisks = [];

    // Add category-level risks
    Object.entries(riskScores).forEach(([category, score]) => {
      allRisks.push({
        category,
        type: 'category',
        description: `${category} risks`,
        score,
        impact: score > 70 ? 'high' : score > 40 ? 'medium' : 'low'
      });
    });

    // Add specific AI-identified risks
    Object.entries(aiRiskAnalysis).forEach(([category, risks]) => {
      if (Array.isArray(risks)) {
        risks.forEach(risk => {
          const riskScore = risk.probability * this.getImpactMultiplier(risk.impact) * 100;
          allRisks.push({
            category,
            type: 'specific',
            description: risk.description,
            score: riskScore,
            impact: risk.impact,
            probability: risk.probability
          });
        });
      }
    });

    // Return top 5 risks sorted by score
    return allRisks
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Calculate overall risk score
   */
  calculateOverallRiskScore(riskScores) {
    let weightedScore = 0;

    Object.entries(riskScores).forEach(([category, score]) => {
      const weight = this.riskFactors[category]?.weight || 0.2;
      weightedScore += score * weight;
    });

    return Math.round(weightedScore);
  }

  /**
   * Determine risk level from score
   */
  determineRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Generate mitigation strategies
   */
  async generateMitigationStrategies(topRisks, opportunity) {
    const strategies = [];

    topRisks.forEach(risk => {
      const strategy = this.getMitigationStrategy(risk, opportunity);
      if (strategy) {
        strategies.push(strategy);
      }
    });

    return strategies.slice(0, 5);
  }

  /**
   * Get mitigation strategy for a specific risk
   */
  getMitigationStrategy(risk, opportunity) {
    const strategyTemplates = {
      market: {
        'high': 'Conduct thorough market research and develop differentiation strategy',
        'medium': 'Monitor market conditions and prepare contingency plans',
        'low': 'Regular market monitoring and competitive analysis'
      },
      competitive: {
        'high': 'Develop unique value proposition and build competitive moats',
        'medium': 'Strengthen competitive positioning and partnerships',
        'low': 'Monitor competitive landscape and maintain agility'
      },
      operational: {
        'high': 'Implement robust operational processes and backup systems',
        'medium': 'Develop operational excellence and quality controls',
        'low': 'Regular operational reviews and process improvements'
      },
      regulatory: {
        'high': 'Engage regulatory experts and ensure full compliance',
        'medium': 'Monitor regulatory changes and maintain compliance',
        'low': 'Regular compliance reviews and updates'
      },
      financial: {
        'high': 'Implement financial controls and diversify revenue streams',
        'medium': 'Monitor financial metrics and maintain reserves',
        'low': 'Regular financial reviews and planning'
      }
    };

    const template = strategyTemplates[risk.category]?.[risk.impact];
    if (!template) return null;

    return {
      riskCategory: risk.category,
      riskDescription: risk.description,
      strategy: template,
      priority: risk.impact,
      timeframe: risk.impact === 'high' ? 'immediate' : risk.impact === 'medium' ? 'short-term' : 'medium-term',
      resources: this.getRequiredResources(risk.category, risk.impact)
    };
  }

  /**
   * Get required resources for mitigation
   */
  getRequiredResources(category, impact) {
    const resourceMap = {
      market: { high: ['market research', 'competitive analysis'], medium: ['monitoring tools'], low: ['basic analysis'] },
      competitive: { high: ['strategy consulting', 'R&D investment'], medium: ['competitive intelligence'], low: ['market monitoring'] },
      operational: { high: ['process consulting', 'system upgrades'], medium: ['quality systems'], low: ['process reviews'] },
      regulatory: { high: ['legal counsel', 'compliance systems'], medium: ['regulatory monitoring'], low: ['compliance reviews'] },
      financial: { high: ['financial controls', 'risk management'], medium: ['financial monitoring'], low: ['regular reviews'] }
    };

    return resourceMap[category]?.[impact] || ['general resources'];
  }

  /**
   * Calculate risk adjustments
   */
  calculateRiskAdjustments(overallRiskScore) {
    const riskMultiplier = 1 - (overallRiskScore / 200); // Higher risk = lower multiplier
    
    return {
      revenueAdjustment: Math.max(0.5, riskMultiplier),
      timelineAdjustment: 1 + (overallRiskScore / 100), // Higher risk = longer timeline
      investmentAdjustment: 1 + (overallRiskScore / 150), // Higher risk = more investment needed
      successProbability: Math.max(0.1, 1 - (overallRiskScore / 100))
    };
  }

  /**
   * Get revenue model for channel
   */
  getRevenueModel(channel) {
    return this.revenueModels[channel] || this.revenueModels['quick-service'];
  }

  /**
   * Calculate base revenue estimate
   */
  calculateBaseRevenue(opportunity, revenueModel) {
    let baseRevenue = revenueModel.avgDealSize;

    // Adjust based on opportunity characteristics
    const opportunityText = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();

    // Size adjustments
    if (opportunityText.includes('enterprise') || opportunityText.includes('large')) {
      baseRevenue *= 2.0;
    } else if (opportunityText.includes('regional') || opportunityText.includes('multi')) {
      baseRevenue *= 1.5;
    } else if (opportunityText.includes('local') || opportunityText.includes('small')) {
      baseRevenue *= 0.7;
    }

    // Priority adjustments
    if (opportunity.priority === 'high') {
      baseRevenue *= 1.3;
    } else if (opportunity.priority === 'low') {
      baseRevenue *= 0.8;
    }

    return Math.round(baseRevenue);
  }

  /**
   * Generate revenue scenarios
   */
  generateRevenueScenarios(baseRevenue, opportunity, revenueModel) {
    const scenarios = {
      conservative: {
        total: Math.round(baseRevenue * 0.7),
        probability: 0.8,
        assumptions: ['Lower market penetration', 'Slower adoption', 'Conservative pricing']
      },
      expected: {
        total: baseRevenue,
        probability: 0.6,
        assumptions: ['Normal market conditions', 'Expected adoption rate', 'Standard pricing']
      },
      optimistic: {
        total: Math.round(baseRevenue * 1.5),
        probability: 0.3,
        assumptions: ['Strong market response', 'Rapid adoption', 'Premium pricing']
      }
    };

    // Apply seasonal adjustments
    const currentQuarter = `q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
    const seasonalMultiplier = revenueModel.seasonality[currentQuarter] || 1.0;

    Object.keys(scenarios).forEach(scenario => {
      scenarios[scenario].total = Math.round(scenarios[scenario].total * seasonalMultiplier);
    });

    return scenarios;
  }

  /**
   * Apply risk adjustments to scenarios
   */
  applyRiskAdjustments(scenarios, riskAssessment) {
    const adjustment = riskAssessment.riskAdjustments.revenueAdjustment;

    Object.keys(scenarios).forEach(scenario => {
      scenarios[scenario].total = Math.round(scenarios[scenario].total * adjustment);
      scenarios[scenario].riskAdjusted = true;
    });
  }

  /**
   * Calculate time-based projections
   */
  calculateTimeProjections(scenarios, revenueModel) {
    const projections = {};

    Object.entries(scenarios).forEach(([scenarioName, scenario]) => {
      const monthlyRevenue = scenario.total / 12;
      const rampUpMonths = Math.ceil(revenueModel.rampUpPeriod / 30);
      
      projections[scenarioName] = {
        month3: Math.round(monthlyRevenue * 0.3 * 3),
        month6: Math.round(monthlyRevenue * 0.6 * 6),
        month12: scenario.total,
        month24: Math.round(scenario.total * 1.8), // Growth in year 2
        timeToBreakeven: Math.ceil(revenueModel.timeToRevenue / 30),
        rampUpPeriod: rampUpMonths
      };
    });

    return projections;
  }

  /**
   * Get AI-powered revenue insights
   */
  async getAIRevenueInsights(opportunity, scenarios) {
    try {
      const prompt = `
        Analyze revenue potential for this AFH opportunity:
        
        Opportunity: ${opportunity.title}
        Channel: ${opportunity.channel}
        Conservative: $${scenarios.conservative.total.toLocaleString()}
        Expected: $${scenarios.expected.total.toLocaleString()}
        Optimistic: $${scenarios.optimistic.total.toLocaleString()}
        
        Provide insights on:
        1. Revenue drivers and accelerators
        2. Potential revenue risks and constraints
        3. Optimization opportunities
        4. Market timing considerations
        5. Scaling potential
        
        Format as JSON with keys: drivers, risks, optimization, timing, scaling
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a revenue analyst specializing in AFH market opportunities. Provide actionable insights in JSON format.'
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
        return {
          drivers: ['Market demand', 'Product fit', 'Execution quality'],
          risks: ['Competition', 'Market changes', 'Execution challenges'],
          optimization: ['Pricing strategy', 'Market penetration', 'Operational efficiency'],
          timing: ['Market readiness assessment needed'],
          scaling: ['Potential for expansion after initial success']
        };
      }
    } catch (error) {
      console.error('Error getting AI revenue insights:', error);
      return {};
    }
  }

  /**
   * Calculate ROI estimates
   */
  calculateROIEstimates(scenarios, opportunity) {
    // Estimate investment required (simplified model)
    const baseInvestment = this.estimateInvestmentRequired(opportunity);

    const roiEstimates = {};

    Object.entries(scenarios).forEach(([scenarioName, scenario]) => {
      const revenue = scenario.total;
      const investment = baseInvestment;
      const grossMargin = 0.3; // Assume 30% gross margin
      const grossProfit = revenue * grossMargin;
      const roi = investment > 0 ? ((grossProfit - investment) / investment) * 100 : 0;

      roiEstimates[scenarioName] = {
        revenue,
        investment,
        grossProfit: Math.round(grossProfit),
        roi: Math.round(roi),
        paybackPeriod: investment > 0 ? Math.ceil((investment / (grossProfit / 12))) : 0 // months
      };
    });

    return roiEstimates;
  }

  /**
   * Estimate investment required
   */
  estimateInvestmentRequired(opportunity) {
    const channel = opportunity.channel || 'quick-service';
    const revenueModel = this.getRevenueModel(channel);
    
    // Base investment as percentage of expected revenue
    let investmentRatio = 0.25; // 25% of expected revenue

    // Adjust based on channel complexity
    const complexityAdjustments = {
      'healthcare': 1.5,
      'education': 1.3,
      'workplace': 1.1,
      'leisure': 1.2,
      'quick-service': 1.0,
      'fast-casual': 1.1
    };

    investmentRatio *= (complexityAdjustments[channel] || 1.0);

    return Math.round(revenueModel.avgDealSize * investmentRatio);
  }

  /**
   * Get revenue assumptions
   */
  getRevenueAssumptions(opportunity, revenueModel) {
    return {
      channel: opportunity.channel,
      avgDealSize: revenueModel.avgDealSize,
      timeToRevenue: revenueModel.timeToRevenue,
      rampUpPeriod: revenueModel.rampUpPeriod,
      seasonalityApplied: true,
      grossMarginAssumption: '30%',
      marketPenetrationRate: 'Variable by scenario',
      competitiveResponse: 'Moderate',
      economicConditions: 'Stable'
    };
  }

  /**
   * Calculate risk confidence
   */
  calculateRiskConfidence(riskScores, aiRiskAnalysis) {
    let confidence = 60; // Base confidence

    // Increase confidence if we have AI analysis
    if (Object.keys(aiRiskAnalysis).length > 0) {
      confidence += 20;
    }

    // Adjust based on risk score consistency
    const scores = Object.values(riskScores);
    const variance = this.calculateVariance(scores);
    if (variance < 200) confidence += 10;

    return Math.round(Math.max(40, Math.min(90, confidence)));
  }

  /**
   * Calculate revenue confidence
   */
  calculateRevenueConfidence(opportunity, scenarios) {
    let confidence = 50; // Base confidence

    // Increase confidence based on data availability
    if (opportunity.description && opportunity.description.length > 50) {
      confidence += 15;
    }

    if (opportunity.company && opportunity.company !== 'Unknown') {
      confidence += 10;
    }

    // Adjust based on scenario spread
    const scenarioValues = Object.values(scenarios).map(s => s.total);
    const maxSpread = Math.max(...scenarioValues) / Math.min(...scenarioValues);
    if (maxSpread < 2.5) confidence += 15; // Lower spread = higher confidence

    return Math.round(Math.max(30, Math.min(85, confidence)));
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
   * Get comprehensive analysis combining risk and revenue
   */
  async getComprehensiveAnalysis(opportunity) {
    try {
      console.log(`📊 Performing comprehensive analysis for: ${opportunity.title}`);

      // Perform risk assessment
      const riskAssessment = await this.performRiskAssessment(opportunity);

      // Predict revenue with risk adjustments
      const revenuePrediction = await this.predictRevenuePotential(opportunity, riskAssessment);

      // Calculate overall opportunity score
      const opportunityScore = this.calculateOpportunityScore(riskAssessment, revenuePrediction);

      // Generate strategic recommendations
      const strategicRecommendations = await this.generateStrategicRecommendations(
        opportunity, riskAssessment, revenuePrediction, opportunityScore
      );

      return {
        opportunityScore,
        riskAssessment,
        revenuePrediction,
        strategicRecommendations,
        analysisDate: new Date().toISOString(),
        overallConfidence: Math.round((riskAssessment.confidence + revenuePrediction.confidence) / 2)
      };

    } catch (error) {
      console.error('❌ Error in comprehensive analysis:', error);
      return {
        error: error.message,
        analysisDate: new Date().toISOString(),
        overallConfidence: 0
      };
    }
  }

  /**
   * Calculate overall opportunity score
   */
  calculateOpportunityScore(riskAssessment, revenuePrediction) {
    const revenueScore = Math.min(100, (revenuePrediction.scenarios.expected.total / 500000) * 100);
    const riskScore = 100 - riskAssessment.overallRiskScore; // Invert risk score
    
    // Weighted combination
    const overallScore = (revenueScore * 0.6) + (riskScore * 0.4);
    
    return {
      overall: Math.round(overallScore),
      revenue: Math.round(revenueScore),
      risk: Math.round(riskScore),
      recommendation: overallScore >= 70 ? 'pursue' : overallScore >= 50 ? 'evaluate' : 'pass'
    };
  }

  /**
   * Generate strategic recommendations
   */
  async generateStrategicRecommendations(opportunity, riskAssessment, revenuePrediction, opportunityScore) {
    const recommendations = [];

    // Score-based recommendations
    if (opportunityScore.overall >= 70) {
      recommendations.push({
        type: 'pursue',
        priority: 'high',
        action: 'Prioritize this opportunity for immediate development',
        rationale: `High opportunity score (${opportunityScore.overall}/100) with strong revenue potential`,
        timeline: 'immediate'
      });
    } else if (opportunityScore.overall >= 50) {
      recommendations.push({
        type: 'evaluate',
        priority: 'medium',
        action: 'Conduct deeper evaluation and pilot program',
        rationale: `Moderate opportunity score (${opportunityScore.overall}/100) requires validation`,
        timeline: 'short-term'
      });
    } else {
      recommendations.push({
        type: 'pass',
        priority: 'low',
        action: 'Consider passing or significant restructuring',
        rationale: `Low opportunity score (${opportunityScore.overall}/100) indicates poor fit`,
        timeline: 'reconsider'
      });
    }

    // Risk-based recommendations
    if (riskAssessment.riskLevel === 'high') {
      recommendations.push({
        type: 'risk-mitigation',
        priority: 'high',
        action: 'Implement comprehensive risk mitigation before proceeding',
        rationale: 'High risk level requires proactive management',
        timeline: 'immediate'
      });
    }

    // Revenue-based recommendations
    const expectedRevenue = revenuePrediction.scenarios.expected.total;
    if (expectedRevenue < 100000) {
      recommendations.push({
        type: 'revenue-enhancement',
        priority: 'medium',
        action: 'Explore revenue enhancement opportunities',
        rationale: 'Revenue potential below typical threshold',
        timeline: 'short-term'
      });
    }

    return recommendations.slice(0, 5);
  }
}

module.exports = RiskRevenueAnalysisService;
