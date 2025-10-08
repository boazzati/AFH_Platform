const { OpenAI } = require('openai');
const mongoose = require('mongoose');

class DataProcessingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Processing configuration
    this.config = {
      batchSize: 10,
      maxRetries: 3,
      confidenceThreshold: 60,
      duplicateTimeWindow: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    };

    // Channel mapping and scoring weights
    this.channelWeights = {
      QSR: { expansion: 0.9, menu: 0.8, partnership: 0.7, trends: 0.6 },
      Workplace: { expansion: 0.7, menu: 0.9, partnership: 0.8, trends: 0.7 },
      Leisure: { expansion: 0.8, menu: 0.7, partnership: 0.9, trends: 0.6 },
      Education: { expansion: 0.6, menu: 0.8, partnership: 0.7, trends: 0.5 },
      Healthcare: { expansion: 0.5, menu: 0.9, partnership: 0.8, trends: 0.7 }
    };

    // Priority scoring matrix
    this.priorityMatrix = {
      high: { minConfidence: 80, minRelevance: 70, urgencyKeywords: ['urgent', 'immediate', 'asap', 'breaking'] },
      medium: { minConfidence: 60, minRelevance: 50, urgencyKeywords: ['soon', 'upcoming', 'planned'] },
      low: { minConfidence: 40, minRelevance: 30, urgencyKeywords: ['future', 'potential', 'considering'] }
    };
  }

  /**
   * Main data processing pipeline
   */
  async processIngestedData(rawOpportunities) {
    console.log(`🔄 Processing ${rawOpportunities.length} raw opportunities...`);
    
    try {
      // Step 1: Deduplicate opportunities
      const uniqueOpportunities = await this.deduplicateOpportunities(rawOpportunities);
      console.log(`✅ Deduplicated to ${uniqueOpportunities.length} unique opportunities`);

      // Step 2: Enhance with AI analysis
      const enhancedOpportunities = await this.enhanceWithAI(uniqueOpportunities);
      console.log(`✅ Enhanced ${enhancedOpportunities.length} opportunities with AI analysis`);

      // Step 3: Score and prioritize
      const scoredOpportunities = await this.scoreAndPrioritize(enhancedOpportunities);
      console.log(`✅ Scored and prioritized opportunities`);

      // Step 4: Enrich with additional data
      const enrichedOpportunities = await this.enrichWithAdditionalData(scoredOpportunities);
      console.log(`✅ Enriched opportunities with additional context`);

      // Step 5: Validate and clean
      const validatedOpportunities = await this.validateAndClean(enrichedOpportunities);
      console.log(`✅ Validated ${validatedOpportunities.length} final opportunities`);

      return validatedOpportunities;
    } catch (error) {
      console.error('❌ Error in data processing pipeline:', error);
      throw error;
    }
  }

  /**
   * Remove duplicate opportunities based on content similarity
   */
  async deduplicateOpportunities(opportunities) {
    const uniqueOpportunities = [];
    const seenHashes = new Set();

    for (const opportunity of opportunities) {
      // Create content hash for similarity detection
      const contentHash = this.createContentHash(opportunity);
      
      // Check for recent duplicates in database
      const isDuplicate = await this.checkForDuplicates(opportunity, contentHash);
      
      if (!isDuplicate && !seenHashes.has(contentHash)) {
        seenHashes.add(contentHash);
        uniqueOpportunities.push({
          ...opportunity,
          contentHash,
          deduplicationScore: this.calculateSimilarityScore(opportunity, uniqueOpportunities)
        });
      }
    }

    return uniqueOpportunities;
  }

  /**
   * Enhance opportunities with detailed AI analysis
   */
  async enhanceWithAI(opportunities) {
    const enhanced = [];
    
    // Process in batches to avoid rate limits
    for (let i = 0; i < opportunities.length; i += this.config.batchSize) {
      const batch = opportunities.slice(i, i + this.config.batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(opportunity => this.enhanceSingleOpportunity(opportunity))
      );

      // Collect successful results
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          enhanced.push(result.value);
        } else {
          console.error(`Failed to enhance opportunity ${i + index}:`, result.reason);
          // Add original opportunity with basic enhancement
          enhanced.push(this.basicEnhancement(batch[index]));
        }
      });

      // Rate limiting delay
      if (i + this.config.batchSize < opportunities.length) {
        await this.delay(1000);
      }
    }

    return enhanced;
  }

  /**
   * Enhance a single opportunity with AI analysis
   */
  async enhanceSingleOpportunity(opportunity) {
    const prompt = `
Analyze this AFH market opportunity in detail:

Title: ${opportunity.title}
Description: ${opportunity.description}
Source: ${opportunity.source}
Current Channel: ${opportunity.channel}
Current Priority: ${opportunity.priority}

Provide detailed analysis:
1. Market size estimation
2. Competition level assessment
3. Implementation timeline
4. Key stakeholders to target
5. Potential obstacles
6. Success probability
7. Revenue potential range
8. Strategic importance
9. Required resources
10. Next best actions

Also refine:
- Channel classification (be more specific if possible)
- Priority level based on urgency and impact
- Confidence score based on data quality
- Geographic scope
- Target customer segments

Respond in JSON format:
{
  "analysis": {
    "marketSize": "string",
    "competitionLevel": "low|medium|high",
    "timeline": "string",
    "keyStakeholders": ["array"],
    "obstacles": ["array"],
    "successProbability": number,
    "revenueRange": "string",
    "strategicImportance": "low|medium|high",
    "requiredResources": ["array"],
    "nextActions": ["array"]
  },
  "refinedClassification": {
    "channel": "string",
    "subChannel": "string",
    "priority": "high|medium|low",
    "confidence": number,
    "geographicScope": "string",
    "targetSegments": ["array"]
  },
  "insights": {
    "keyInsights": ["array"],
    "riskFactors": ["array"],
    "opportunities": ["array"]
  }
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior business analyst specializing in AFH (Away-From-Home) channel strategy for CPG companies. Provide detailed, actionable analysis based on market intelligence.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });

      const aiAnalysis = JSON.parse(response.choices[0].message.content);
      
      return {
        ...opportunity,
        aiAnalysis: aiAnalysis.analysis,
        refinedClassification: aiAnalysis.refinedClassification,
        insights: aiAnalysis.insights,
        enhancedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI enhancement error:', error.message);
      return this.basicEnhancement(opportunity);
    }
  }

  /**
   * Score and prioritize opportunities
   */
  async scoreAndPrioritize(opportunities) {
    return opportunities.map(opportunity => {
      // Calculate composite score
      const scores = this.calculateOpportunityScores(opportunity);
      
      // Determine final priority
      const finalPriority = this.determineFinalPriority(opportunity, scores);
      
      // Calculate urgency score
      const urgencyScore = this.calculateUrgencyScore(opportunity);
      
      return {
        ...opportunity,
        scores: {
          ...scores,
          composite: this.calculateCompositeScore(scores),
          urgency: urgencyScore
        },
        finalPriority,
        priorityReason: this.generatePriorityReason(opportunity, scores, finalPriority),
        scoredAt: new Date().toISOString()
      };
    }).sort((a, b) => b.scores.composite - a.scores.composite);
  }

  /**
   * Enrich opportunities with additional contextual data
   */
  async enrichWithAdditionalData(opportunities) {
    return Promise.all(opportunities.map(async (opportunity) => {
      try {
        // Add market context
        const marketContext = await this.getMarketContext(opportunity);
        
        // Add competitive intelligence
        const competitiveIntel = await this.getCompetitiveIntelligence(opportunity);
        
        // Add historical performance data
        const historicalData = await this.getHistoricalPerformance(opportunity);
        
        // Add expert recommendations
        const expertRecommendations = await this.getExpertRecommendations(opportunity);

        return {
          ...opportunity,
          enrichment: {
            marketContext,
            competitiveIntel,
            historicalData,
            expertRecommendations,
            enrichedAt: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('Enrichment error:', error.message);
        return opportunity;
      }
    }));
  }

  /**
   * Validate and clean final opportunities
   */
  async validateAndClean(opportunities) {
    return opportunities
      .filter(opportunity => this.validateOpportunity(opportunity))
      .map(opportunity => this.cleanOpportunityData(opportunity));
  }

  /**
   * Helper methods for data processing
   */
  createContentHash(opportunity) {
    const content = `${opportunity.title}${opportunity.description}${opportunity.source}`;
    return require('crypto').createHash('md5').update(content).digest('hex');
  }

  async checkForDuplicates(opportunity, contentHash) {
    // Check database for similar opportunities within time window
    try {
      const recentOpportunities = await mongoose.connection.db
        .collection('market-signals')
        .find({
          contentHash: contentHash,
          createdAt: {
            $gte: new Date(Date.now() - this.config.duplicateTimeWindow)
          }
        })
        .toArray();

      return recentOpportunities.length > 0;
    } catch (error) {
      console.error('Duplicate check error:', error);
      return false;
    }
  }

  calculateSimilarityScore(opportunity, existingOpportunities) {
    // Simple similarity calculation based on title and description
    const currentText = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    
    let maxSimilarity = 0;
    existingOpportunities.forEach(existing => {
      const existingText = `${existing.title} ${existing.description}`.toLowerCase();
      const similarity = this.calculateTextSimilarity(currentText, existingText);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });

    return maxSimilarity;
  }

  calculateTextSimilarity(text1, text2) {
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  basicEnhancement(opportunity) {
    return {
      ...opportunity,
      aiAnalysis: {
        marketSize: 'Unknown',
        competitionLevel: 'medium',
        timeline: 'To be determined',
        successProbability: 50
      },
      refinedClassification: {
        channel: opportunity.channel,
        priority: opportunity.priority,
        confidence: opportunity.confidence || 50
      },
      insights: {
        keyInsights: ['Requires further analysis'],
        riskFactors: ['Limited data available'],
        opportunities: ['Potential AFH opportunity identified']
      },
      enhancedAt: new Date().toISOString()
    };
  }

  calculateOpportunityScores(opportunity) {
    const confidence = opportunity.refinedClassification?.confidence || opportunity.confidence || 50;
    const relevance = this.calculateRelevanceScore(opportunity);
    const urgency = this.calculateUrgencyScore(opportunity);
    const marketPotential = this.calculateMarketPotentialScore(opportunity);
    const feasibility = this.calculateFeasibilityScore(opportunity);

    return {
      confidence,
      relevance,
      urgency,
      marketPotential,
      feasibility
    };
  }

  calculateRelevanceScore(opportunity) {
    const channel = opportunity.refinedClassification?.channel || opportunity.channel;
    const category = opportunity.category || 'general';
    const weights = this.channelWeights[channel] || this.channelWeights.QSR;
    
    return (weights[category] || 0.5) * 100;
  }

  calculateUrgencyScore(opportunity) {
    const text = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    const urgencyKeywords = Object.values(this.priorityMatrix).flatMap(p => p.urgencyKeywords);
    
    let urgencyScore = 0;
    urgencyKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        urgencyScore += 20;
      }
    });

    return Math.min(100, urgencyScore);
  }

  calculateMarketPotentialScore(opportunity) {
    // Based on AI analysis if available
    if (opportunity.aiAnalysis?.successProbability) {
      return opportunity.aiAnalysis.successProbability;
    }
    
    // Fallback calculation
    const channel = opportunity.refinedClassification?.channel || opportunity.channel;
    const channelMultipliers = {
      QSR: 0.9,
      Workplace: 0.8,
      Leisure: 0.7,
      Education: 0.6,
      Healthcare: 0.8
    };
    
    return (channelMultipliers[channel] || 0.5) * 100;
  }

  calculateFeasibilityScore(opportunity) {
    // Simple feasibility based on available data
    let feasibilityScore = 50; // Base score
    
    if (opportunity.location) feasibilityScore += 10;
    if (opportunity.source.includes('official')) feasibilityScore += 15;
    if (opportunity.confidence > 70) feasibilityScore += 15;
    if (opportunity.aiAnalysis?.competitionLevel === 'low') feasibilityScore += 10;
    
    return Math.min(100, feasibilityScore);
  }

  calculateCompositeScore(scores) {
    const weights = {
      confidence: 0.25,
      relevance: 0.25,
      urgency: 0.2,
      marketPotential: 0.2,
      feasibility: 0.1
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (scores[key] * weight);
    }, 0);
  }

  determineFinalPriority(opportunity, scores) {
    if (scores.composite >= 80 && scores.urgency >= 60) return 'high';
    if (scores.composite >= 60 && scores.urgency >= 40) return 'medium';
    return 'low';
  }

  generatePriorityReason(opportunity, scores, priority) {
    const reasons = [];
    
    if (scores.confidence >= 80) reasons.push('high confidence data');
    if (scores.urgency >= 60) reasons.push('time-sensitive opportunity');
    if (scores.marketPotential >= 70) reasons.push('strong market potential');
    if (scores.relevance >= 80) reasons.push('highly relevant to AFH strategy');
    
    return reasons.length > 0 ? reasons.join(', ') : 'standard prioritization criteria';
  }

  async getMarketContext(opportunity) {
    // Placeholder for market context enrichment
    return {
      marketTrends: ['Growing demand for convenience', 'Health-conscious consumers'],
      seasonality: 'Year-round opportunity',
      competitorActivity: 'Moderate competition expected'
    };
  }

  async getCompetitiveIntelligence(opportunity) {
    // Placeholder for competitive intelligence
    return {
      competitors: ['Major CPG brands', 'Local suppliers'],
      competitiveAdvantage: 'First-mover advantage possible',
      marketShare: 'Opportunity for 5-10% market share'
    };
  }

  async getHistoricalPerformance(opportunity) {
    // Placeholder for historical performance data
    return {
      similarOpportunities: 3,
      averageSuccessRate: 65,
      averageTimeToClose: '3-6 months'
    };
  }

  async getExpertRecommendations(opportunity) {
    // Placeholder for expert recommendations
    return {
      recommendedExperts: ['Channel Strategy Expert', 'Regional Sales Manager'],
      suggestedActions: ['Conduct market research', 'Reach out to decision makers'],
      timeline: 'Initiate contact within 2 weeks'
    };
  }

  validateOpportunity(opportunity) {
    // Basic validation rules
    return opportunity.title && 
           opportunity.description && 
           opportunity.scores?.composite >= 30 &&
           opportunity.refinedClassification?.confidence >= this.config.confidenceThreshold;
  }

  cleanOpportunityData(opportunity) {
    // Clean and format data for storage
    return {
      title: opportunity.title.trim(),
      description: opportunity.description.trim().substring(0, 1000),
      source: opportunity.source,
      channel: opportunity.refinedClassification?.channel || opportunity.channel,
      subChannel: opportunity.refinedClassification?.subChannel,
      priority: opportunity.finalPriority,
      confidence: opportunity.refinedClassification?.confidence || opportunity.confidence,
      location: opportunity.refinedClassification?.geographicScope || opportunity.location,
      scores: opportunity.scores,
      aiAnalysis: opportunity.aiAnalysis,
      insights: opportunity.insights,
      enrichment: opportunity.enrichment,
      tags: opportunity.tags || [],
      processedAt: new Date().toISOString(),
      contentHash: opportunity.contentHash
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = DataProcessingService;
