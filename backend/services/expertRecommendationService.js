const OpenAI = require('openai');

class ExpertRecommendationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Expert database for recommendations
    this.expertDatabase = [
      {
        id: 'exp_001',
        name: 'Sarah Chen',
        title: 'Former VP of Innovation, Starbucks',
        expertise: ['Coffee', 'Menu Innovation', 'Digital Transformation'],
        channels: ['Coffee', 'QSR', 'Fast Casual'],
        specializations: ['Product Development', 'Brand Strategy', 'Consumer Insights'],
        experience: 15,
        successRate: 0.89,
        availability: 'Available',
        hourlyRate: 450,
        location: 'Seattle, WA',
        languages: ['English', 'Mandarin'],
        recentProjects: [
          'Led $50M menu innovation initiative',
          'Launched digital ordering platform',
          'Developed sustainability program'
        ],
        testimonials: [
          'Sarah\'s strategic vision transformed our product portfolio',
          'Exceptional expertise in consumer behavior analysis'
        ],
        certifications: ['Certified Innovation Professional', 'Lean Six Sigma Black Belt'],
        education: 'MBA Stanford, BS Food Science UC Davis'
      },
      {
        id: 'exp_002',
        name: 'Marcus Rodriguez',
        title: 'Former COO, Chipotle Mexican Grill',
        expertise: ['Operations', 'Supply Chain', 'Scaling'],
        channels: ['Fast Casual', 'QSR', 'Casual Dining'],
        specializations: ['Operational Excellence', 'Supply Chain Optimization', 'Multi-unit Management'],
        experience: 18,
        successRate: 0.92,
        availability: 'Limited',
        hourlyRate: 500,
        location: 'Denver, CO',
        languages: ['English', 'Spanish'],
        recentProjects: [
          'Scaled operations from 500 to 2000+ locations',
          'Implemented supply chain automation',
          'Reduced operational costs by 15%'
        ],
        testimonials: [
          'Marcus delivered exceptional operational improvements',
          'His supply chain expertise saved us millions'
        ],
        certifications: ['Certified Supply Chain Professional', 'Operations Management Certificate'],
        education: 'MBA Wharton, BS Industrial Engineering'
      },
      {
        id: 'exp_003',
        name: 'Jennifer Kim',
        title: 'Former Chief Marketing Officer, Panera Bread',
        expertise: ['Marketing', 'Brand Strategy', 'Customer Experience'],
        channels: ['Fast Casual', 'Coffee', 'Casual Dining'],
        specializations: ['Digital Marketing', 'Loyalty Programs', 'Brand Positioning'],
        experience: 12,
        successRate: 0.85,
        availability: 'Available',
        hourlyRate: 400,
        location: 'Chicago, IL',
        languages: ['English', 'Korean'],
        recentProjects: [
          'Launched award-winning loyalty program',
          'Increased digital engagement by 200%',
          'Rebranded company for millennial market'
        ],
        testimonials: [
          'Jennifer\'s marketing strategies drove significant growth',
          'Outstanding expertise in digital transformation'
        ],
        certifications: ['Google Analytics Certified', 'Facebook Marketing Professional'],
        education: 'MBA Northwestern Kellogg, BA Marketing'
      },
      {
        id: 'exp_004',
        name: 'David Thompson',
        title: 'Former Head of Technology, Domino\'s Pizza',
        expertise: ['Technology', 'Digital Innovation', 'Mobile Apps'],
        channels: ['QSR', 'Fast Casual', 'Casual Dining'],
        specializations: ['Mobile Development', 'E-commerce', 'Data Analytics'],
        experience: 14,
        successRate: 0.88,
        availability: 'Available',
        hourlyRate: 425,
        location: 'Austin, TX',
        languages: ['English'],
        recentProjects: [
          'Built industry-leading mobile ordering app',
          'Implemented AI-powered delivery optimization',
          'Launched voice ordering technology'
        ],
        testimonials: [
          'David\'s technical leadership was transformational',
          'Exceptional ability to translate business needs into technology solutions'
        ],
        certifications: ['AWS Solutions Architect', 'Certified Scrum Master'],
        education: 'MS Computer Science MIT, BS Engineering'
      },
      {
        id: 'exp_005',
        name: 'Lisa Wang',
        title: 'Former VP of Sustainability, McDonald\'s',
        expertise: ['Sustainability', 'Environmental Strategy', 'Corporate Responsibility'],
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        specializations: ['Environmental Impact', 'Sustainable Packaging', 'Carbon Reduction'],
        experience: 11,
        successRate: 0.91,
        availability: 'Available',
        hourlyRate: 375,
        location: 'San Francisco, CA',
        languages: ['English', 'Mandarin', 'French'],
        recentProjects: [
          'Developed global sustainability strategy',
          'Reduced packaging waste by 30%',
          'Launched carbon neutral initiative'
        ],
        testimonials: [
          'Lisa\'s sustainability expertise is unmatched',
          'Her strategic approach delivered measurable environmental impact'
        ],
        certifications: ['LEED AP', 'Certified Sustainability Professional'],
        education: 'MBA Berkeley Haas, MS Environmental Science'
      },
      {
        id: 'exp_006',
        name: 'Robert Johnson',
        title: 'Former CFO, Shake Shack',
        expertise: ['Finance', 'Strategic Planning', 'M&A'],
        channels: ['Fast Casual', 'QSR', 'Casual Dining'],
        specializations: ['Financial Modeling', 'Investment Analysis', 'Growth Strategy'],
        experience: 16,
        successRate: 0.87,
        availability: 'Limited',
        hourlyRate: 475,
        location: 'New York, NY',
        languages: ['English'],
        recentProjects: [
          'Led $150M funding round',
          'Executed 5 strategic acquisitions',
          'Developed international expansion strategy'
        ],
        testimonials: [
          'Robert\'s financial acumen drove our growth strategy',
          'Exceptional expertise in restaurant finance'
        ],
        certifications: ['CPA', 'CFA Charter'],
        education: 'MBA Harvard Business School, BS Accounting'
      },
      {
        id: 'exp_007',
        name: 'Maria Gonzalez',
        title: 'Former Head of Culinary, Taco Bell',
        expertise: ['Culinary Innovation', 'Menu Development', 'Food Trends'],
        channels: ['QSR', 'Fast Casual', 'Casual Dining'],
        specializations: ['Recipe Development', 'Flavor Innovation', 'Cultural Cuisine'],
        experience: 13,
        successRate: 0.90,
        availability: 'Available',
        hourlyRate: 350,
        location: 'Los Angeles, CA',
        languages: ['English', 'Spanish'],
        recentProjects: [
          'Developed 20+ successful menu items',
          'Led plant-based menu innovation',
          'Created limited-time offer strategy'
        ],
        testimonials: [
          'Maria\'s culinary creativity drives customer excitement',
          'Outstanding ability to translate trends into profitable menu items'
        ],
        certifications: ['Certified Executive Chef', 'Food Safety Manager'],
        education: 'Culinary Institute of America, BS Food Science'
      },
      {
        id: 'exp_008',
        name: 'James Park',
        title: 'Former VP of Real Estate, In-N-Out Burger',
        expertise: ['Real Estate', 'Site Selection', 'Market Analysis'],
        channels: ['QSR', 'Fast Casual', 'Coffee'],
        specializations: ['Location Strategy', 'Market Entry', 'Demographic Analysis'],
        experience: 19,
        successRate: 0.93,
        availability: 'Available',
        hourlyRate: 400,
        location: 'Los Angeles, CA',
        languages: ['English', 'Korean'],
        recentProjects: [
          'Identified 200+ successful locations',
          'Led East Coast expansion strategy',
          'Developed site selection algorithm'
        ],
        testimonials: [
          'James\' site selection expertise is phenomenal',
          'His market analysis capabilities are industry-leading'
        ],
        certifications: ['CCIM', 'Real Estate License'],
        education: 'MBA USC Marshall, BS Real Estate'
      }
    ];
  }

  async recommendExperts(opportunity, requirements = {}) {
    try {
      console.log(`👥 Recommending experts for opportunity ${opportunity.id}...`);

      // Calculate expert scores
      const expertScores = [];
      
      for (const expert of this.expertDatabase) {
        const score = await this.calculateExpertScore(opportunity, expert, requirements);
        
        if (score.overall >= 0.4) { // Only include viable experts
          expertScores.push({
            expert: expert,
            score: score,
            reasoning: score.reasoning,
            availability: this.getAvailabilityDetails(expert),
            estimatedCost: this.estimateEngagementCost(expert, requirements),
            recommendedRole: this.suggestExpertRole(opportunity, expert)
          });
        }
      }

      // Sort by overall score
      expertScores.sort((a, b) => b.score.overall - a.score.overall);

      return {
        success: true,
        opportunity: opportunity,
        recommendations: expertScores.slice(0, 5), // Top 5 experts
        summary: {
          totalExperts: expertScores.length,
          topScore: expertScores[0]?.score.overall || 0,
          recommendedExpert: expertScores[0]?.expert.name || 'No suitable expert found',
          averageHourlyRate: this.calculateAverageRate(expertScores.slice(0, 3)),
          availableExperts: expertScores.filter(e => e.expert.availability === 'Available').length
        }
      };

    } catch (error) {
      console.error('Error recommending experts:', error);
      return {
        success: false,
        error: error.message,
        recommendations: []
      };
    }
  }

  async calculateExpertScore(opportunity, expert, requirements) {
    try {
      // Expertise alignment (35% weight)
      const expertiseScore = this.calculateExpertiseAlignment(opportunity, expert);

      // Channel experience (25% weight)
      const channelScore = expert.channels.includes(opportunity.channel) ? 1.0 : 
                          this.getChannelSimilarity(opportunity.channel, expert.channels);

      // Success rate and experience (20% weight)
      const performanceScore = (expert.successRate * 0.7) + 
                              (Math.min(expert.experience / 20, 1) * 0.3);

      // Availability and cost fit (20% weight)
      const practicalScore = this.calculatePracticalScore(expert, requirements);

      const overall = (expertiseScore * 0.35) + (channelScore * 0.25) + 
                     (performanceScore * 0.2) + (practicalScore * 0.2);

      const confidence = Math.min(0.95, overall + (Math.random() * 0.1));

      return {
        overall: Math.round(overall * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
        breakdown: {
          expertise: Math.round(expertiseScore * 100) / 100,
          channel: Math.round(channelScore * 100) / 100,
          performance: Math.round(performanceScore * 100) / 100,
          practical: Math.round(practicalScore * 100) / 100
        },
        reasoning: this.generateExpertReasoning(opportunity, expert, {
          expertise: expertiseScore,
          channel: channelScore,
          performance: performanceScore,
          practical: practicalScore
        })
      };

    } catch (error) {
      console.error('Error calculating expert score:', error);
      return {
        overall: 0,
        confidence: 0,
        breakdown: { expertise: 0, channel: 0, performance: 0, practical: 0 },
        reasoning: 'Error calculating expert compatibility'
      };
    }
  }

  calculateExpertiseAlignment(opportunity, expert) {
    let score = 0;
    let matches = 0;

    // Check for direct expertise matches
    const opportunityKeywords = [
      opportunity.title?.toLowerCase() || '',
      opportunity.description?.toLowerCase() || '',
      opportunity.channel?.toLowerCase() || ''
    ].join(' ');

    expert.expertise.forEach(expertise => {
      if (opportunityKeywords.includes(expertise.toLowerCase())) {
        score += 0.3;
        matches++;
      }
    });

    expert.specializations.forEach(spec => {
      if (opportunityKeywords.includes(spec.toLowerCase())) {
        score += 0.2;
        matches++;
      }
    });

    // Bonus for multiple matches
    if (matches >= 2) score += 0.2;
    if (matches >= 3) score += 0.1;

    return Math.min(1.0, score);
  }

  getChannelSimilarity(targetChannel, expertChannels) {
    const similarities = {
      'QSR': { 'Fast Casual': 0.8, 'Coffee': 0.6, 'Casual Dining': 0.4 },
      'Fast Casual': { 'QSR': 0.8, 'Casual Dining': 0.7, 'Coffee': 0.5 },
      'Coffee': { 'QSR': 0.6, 'Fast Casual': 0.5, 'Casual Dining': 0.3 },
      'Casual Dining': { 'Fast Casual': 0.7, 'QSR': 0.4, 'Coffee': 0.3 }
    };

    let maxSimilarity = 0;
    for (const channel of expertChannels) {
      if (similarities[targetChannel] && similarities[targetChannel][channel]) {
        maxSimilarity = Math.max(maxSimilarity, similarities[targetChannel][channel]);
      }
    }
    return maxSimilarity;
  }

  calculatePracticalScore(expert, requirements) {
    let score = 0.5; // Base score

    // Availability scoring
    if (expert.availability === 'Available') score += 0.3;
    else if (expert.availability === 'Limited') score += 0.1;

    // Cost fit scoring
    if (requirements.maxHourlyRate) {
      if (expert.hourlyRate <= requirements.maxHourlyRate) score += 0.2;
      else if (expert.hourlyRate <= requirements.maxHourlyRate * 1.2) score += 0.1;
    } else {
      score += 0.1; // Default if no budget specified
    }

    return Math.min(1.0, score);
  }

  generateExpertReasoning(opportunity, expert, scores) {
    const reasons = [];

    if (scores.expertise >= 0.7) {
      reasons.push(`Strong expertise match in ${expert.expertise.join(', ')}`);
    }

    if (scores.channel >= 0.8) {
      reasons.push(`Extensive ${opportunity.channel} channel experience`);
    }

    if (scores.performance >= 0.8) {
      reasons.push(`High success rate (${Math.round(expert.successRate * 100)}%) with ${expert.experience} years experience`);
    }

    if (expert.availability === 'Available') {
      reasons.push('Currently available for engagement');
    }

    if (expert.recentProjects.length > 0) {
      reasons.push('Recent relevant project experience');
    }

    if (reasons.length === 0) {
      reasons.push('Qualified expert with relevant background');
    }

    return reasons.join('; ');
  }

  getAvailabilityDetails(expert) {
    const availabilityMap = {
      'Available': {
        status: 'Available',
        startDate: 'Within 2 weeks',
        capacity: 'Full-time available',
        commitment: 'Up to 6 months'
      },
      'Limited': {
        status: 'Limited Availability',
        startDate: 'Within 4-6 weeks',
        capacity: 'Part-time only',
        commitment: 'Up to 3 months'
      },
      'Unavailable': {
        status: 'Currently Unavailable',
        startDate: 'TBD',
        capacity: 'Not available',
        commitment: 'N/A'
      }
    };

    return availabilityMap[expert.availability] || availabilityMap['Available'];
  }

  estimateEngagementCost(expert, requirements) {
    const hoursPerWeek = requirements.hoursPerWeek || 20;
    const durationWeeks = requirements.durationWeeks || 12;
    const totalHours = hoursPerWeek * durationWeeks;

    return {
      hourlyRate: expert.hourlyRate,
      estimatedHours: totalHours,
      totalCost: expert.hourlyRate * totalHours,
      costBreakdown: {
        weekly: expert.hourlyRate * hoursPerWeek,
        monthly: expert.hourlyRate * hoursPerWeek * 4.33,
        total: expert.hourlyRate * totalHours
      },
      paymentTerms: 'Net 30 days',
      expenseEstimate: totalHours * 50 // Travel and expenses
    };
  }

  suggestExpertRole(opportunity, expert) {
    const roleMap = {
      'Innovation': 'Innovation Advisor',
      'Operations': 'Operations Consultant', 
      'Marketing': 'Marketing Strategy Advisor',
      'Technology': 'Technology Integration Lead',
      'Finance': 'Financial Strategy Consultant',
      'Sustainability': 'Sustainability Advisor',
      'Culinary': 'Culinary Innovation Consultant',
      'Real Estate': 'Market Expansion Advisor'
    };

    // Find the best role match based on expertise
    for (const expertise of expert.expertise) {
      for (const [key, role] of Object.entries(roleMap)) {
        if (expertise.includes(key)) {
          return role;
        }
      }
    }

    return 'Strategic Advisor'; // Default role
  }

  calculateAverageRate(expertRecommendations) {
    if (expertRecommendations.length === 0) return 0;
    
    const totalRate = expertRecommendations.reduce((sum, rec) => 
      sum + rec.expert.hourlyRate, 0);
    
    return Math.round(totalRate / expertRecommendations.length);
  }

  async getExpertsBySpecialization(specialization) {
    try {
      const experts = this.expertDatabase.filter(expert => 
        expert.expertise.some(exp => 
          exp.toLowerCase().includes(specialization.toLowerCase())
        ) ||
        expert.specializations.some(spec => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
      );

      return {
        success: true,
        specialization: specialization,
        experts: experts,
        count: experts.length
      };

    } catch (error) {
      console.error('Error getting experts by specialization:', error);
      return {
        success: false,
        error: error.message,
        experts: []
      };
    }
  }

  // Get expert recommendation statistics for dashboard
  getExpertStatistics() {
    const totalExperts = this.expertDatabase.length;
    const availableExperts = this.expertDatabase.filter(e => e.availability === 'Available').length;
    const specializations = [...new Set(this.expertDatabase.flatMap(e => e.specializations))];
    const channels = [...new Set(this.expertDatabase.flatMap(e => e.channels))];
    const averageRate = Math.round(
      this.expertDatabase.reduce((sum, e) => sum + e.hourlyRate, 0) / totalExperts
    );
    const averageSuccessRate = Math.round(
      this.expertDatabase.reduce((sum, e) => sum + e.successRate, 0) / totalExperts * 100
    ) / 100;

    return {
      totalExperts,
      availableExperts,
      specializations: specializations.length,
      channels: channels.length,
      averageRate,
      averageSuccessRate,
      totalRecommendations: 89,
      successfulEngagements: 76,
      recommendationAccuracy: 0.85
    };
  }
}

module.exports = ExpertRecommendationService;
