const OutreachService = require('./outreachService');

class ProposalService {
  constructor() {
    this.outreachService = new OutreachService();
    this.proposalTemplates = this.initializeTemplates();
    this.meetingSlots = new Map();
    this.scheduledMeetings = new Map();
  }

  // Initialize proposal templates
  initializeTemplates() {
    return {
      partnership: {
        name: 'Strategic Partnership Proposal',
        sections: [
          'Executive Summary',
          'Market Opportunity',
          'Partnership Framework',
          'Value Proposition',
          'Financial Projections',
          'Implementation Roadmap',
          'Risk Assessment',
          'Success Metrics',
          'Next Steps'
        ]
      },
      product_launch: {
        name: 'Product Launch Partnership',
        sections: [
          'Executive Summary',
          'Product Overview',
          'Market Analysis',
          'Launch Strategy',
          'Revenue Model',
          'Marketing Support',
          'Timeline & Milestones',
          'Investment Requirements',
          'Success Metrics'
        ]
      },
      menu_innovation: {
        name: 'Menu Innovation Proposal',
        sections: [
          'Executive Summary',
          'Consumer Insights',
          'Innovation Concept',
          'Competitive Advantage',
          'Implementation Plan',
          'Financial Impact',
          'Marketing Strategy',
          'Risk Mitigation',
          'Pilot Program'
        ]
      },
      supply_agreement: {
        name: 'Supply Agreement Proposal',
        sections: [
          'Executive Summary',
          'Supply Requirements',
          'Product Specifications',
          'Pricing Structure',
          'Quality Assurance',
          'Logistics & Distribution',
          'Contract Terms',
          'Performance Metrics',
          'Implementation Timeline'
        ]
      }
    };
  }

  // Generate comprehensive proposal
  async generateProposal(proposalData) {
    try {
      const {
        opportunityId,
        proposalType = 'partnership',
        customSections = [],
        companyInfo,
        contactInfo,
        financialParameters = {},
        customization = {}
      } = proposalData;

      console.log(`📄 Generating ${proposalType} proposal for opportunity ${opportunityId}`);

      // Get opportunity details (in real implementation, this would fetch from database)
      const opportunity = await this.getOpportunityDetails(opportunityId);
      
      // Generate AI-powered proposal content
      const proposalResult = await this.outreachService.generateProposal(
        opportunity,
        companyInfo,
        proposalType
      );

      if (!proposalResult.success) {
        throw new Error(`Failed to generate proposal: ${proposalResult.error}`);
      }

      // Enhance with financial modeling
      const financialModel = await this.generateFinancialModel(opportunity, financialParameters);
      
      // Create implementation timeline
      const timeline = this.generateImplementationTimeline(opportunity, proposalType);
      
      // Generate risk assessment
      const riskAssessment = this.generateRiskAssessment(opportunity, proposalType);

      const proposal = {
        id: this.generateProposalId(),
        opportunityId,
        proposalType,
        status: 'draft',
        createdAt: new Date().toISOString(),
        title: `${this.proposalTemplates[proposalType]?.name || 'Partnership Proposal'} - ${opportunity.title}`,
        
        // Core content
        sections: proposalResult.proposal.sections || [],
        
        // Enhanced components
        financialModel,
        timeline,
        riskAssessment,
        
        // Metadata
        companyInfo,
        contactInfo,
        customization,
        
        // Analytics
        analytics: {
          views: 0,
          downloads: 0,
          shares: 0,
          timeSpent: 0,
          lastViewed: null
        }
      };

      console.log(`✅ Generated proposal ${proposal.id}`);

      return {
        success: true,
        proposal
      };

    } catch (error) {
      console.error('Error generating proposal:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate financial model
  async generateFinancialModel(opportunity, parameters) {
    const {
      initialInvestment = 250000,
      monthlyOperatingCost = 15000,
      revenueGrowthRate = 0.15,
      marginImprovement = 0.05
    } = parameters;

    // Base revenue projection
    const baseRevenue = this.parseRevenueString(opportunity.revenue) || 1000000;
    
    const financialModel = {
      assumptions: {
        initialInvestment,
        monthlyOperatingCost,
        revenueGrowthRate,
        marginImprovement,
        projectDuration: 36 // months
      },
      
      projections: {
        monthly: [],
        yearly: [],
        summary: {}
      }
    };

    // Generate monthly projections for 3 years
    let cumulativeRevenue = 0;
    let cumulativeCosts = initialInvestment;
    
    for (let month = 1; month <= 36; month++) {
      const monthlyRevenue = baseRevenue * Math.pow(1 + revenueGrowthRate, month / 12) / 12;
      const monthlyMargin = 0.25 + (marginImprovement * month / 36);
      const monthlyProfit = monthlyRevenue * monthlyMargin - monthlyOperatingCost;
      
      cumulativeRevenue += monthlyRevenue;
      cumulativeCosts += monthlyOperatingCost;
      
      financialModel.projections.monthly.push({
        month,
        revenue: Math.round(monthlyRevenue),
        costs: monthlyOperatingCost,
        profit: Math.round(monthlyProfit),
        cumulativeRevenue: Math.round(cumulativeRevenue),
        cumulativeCosts: Math.round(cumulativeCosts),
        netPosition: Math.round(cumulativeRevenue - cumulativeCosts)
      });
    }

    // Generate yearly summaries
    for (let year = 1; year <= 3; year++) {
      const yearlyData = financialModel.projections.monthly.slice((year - 1) * 12, year * 12);
      const yearlyRevenue = yearlyData.reduce((sum, month) => sum + month.revenue, 0);
      const yearlyCosts = yearlyData.reduce((sum, month) => sum + month.costs, 0);
      const yearlyProfit = yearlyRevenue - yearlyCosts;
      
      financialModel.projections.yearly.push({
        year,
        revenue: Math.round(yearlyRevenue),
        costs: Math.round(yearlyCosts),
        profit: Math.round(yearlyProfit),
        margin: Math.round((yearlyProfit / yearlyRevenue) * 10000) / 100
      });
    }

    // Calculate summary metrics
    const totalRevenue = cumulativeRevenue;
    const totalCosts = cumulativeCosts;
    const netProfit = totalRevenue - totalCosts;
    const roi = ((netProfit / initialInvestment) * 100);
    
    // Find break-even month
    let breakEvenMonth = null;
    for (const monthData of financialModel.projections.monthly) {
      if (monthData.netPosition > 0) {
        breakEvenMonth = monthData.month;
        break;
      }
    }

    financialModel.projections.summary = {
      totalRevenue: Math.round(totalRevenue),
      totalCosts: Math.round(totalCosts),
      netProfit: Math.round(netProfit),
      roi: Math.round(roi * 100) / 100,
      breakEvenMonth,
      paybackPeriod: breakEvenMonth ? `${breakEvenMonth} months` : 'Beyond 36 months'
    };

    return financialModel;
  }

  // Generate implementation timeline
  generateImplementationTimeline(opportunity, proposalType) {
    const baseTimeline = {
      partnership: [
        { phase: 'Agreement & Legal', duration: 4, dependencies: [] },
        { phase: 'System Integration', duration: 6, dependencies: ['Agreement & Legal'] },
        { phase: 'Pilot Program', duration: 8, dependencies: ['System Integration'] },
        { phase: 'Full Rollout', duration: 12, dependencies: ['Pilot Program'] },
        { phase: 'Optimization', duration: 6, dependencies: ['Full Rollout'] }
      ],
      product_launch: [
        { phase: 'Product Development', duration: 8, dependencies: [] },
        { phase: 'Market Testing', duration: 4, dependencies: ['Product Development'] },
        { phase: 'Production Setup', duration: 6, dependencies: ['Market Testing'] },
        { phase: 'Launch Campaign', duration: 3, dependencies: ['Production Setup'] },
        { phase: 'Market Expansion', duration: 9, dependencies: ['Launch Campaign'] }
      ],
      menu_innovation: [
        { phase: 'Concept Development', duration: 3, dependencies: [] },
        { phase: 'Recipe Testing', duration: 4, dependencies: ['Concept Development'] },
        { phase: 'Supplier Qualification', duration: 3, dependencies: ['Recipe Testing'] },
        { phase: 'Menu Integration', duration: 2, dependencies: ['Supplier Qualification'] },
        { phase: 'Staff Training', duration: 2, dependencies: ['Menu Integration'] },
        { phase: 'Market Launch', duration: 1, dependencies: ['Staff Training'] }
      ]
    };

    const phases = baseTimeline[proposalType] || baseTimeline.partnership;
    
    // Calculate start and end dates
    let currentWeek = 0;
    const timeline = phases.map(phase => {
      const startWeek = currentWeek;
      const endWeek = currentWeek + phase.duration;
      currentWeek = endWeek;
      
      return {
        ...phase,
        startWeek,
        endWeek,
        startDate: this.addWeeksToDate(new Date(), startWeek),
        endDate: this.addWeeksToDate(new Date(), endWeek)
      };
    });

    return {
      totalDuration: currentWeek,
      phases: timeline,
      criticalPath: this.calculateCriticalPath(timeline),
      milestones: this.generateMilestones(timeline)
    };
  }

  // Generate risk assessment
  generateRiskAssessment(opportunity, proposalType) {
    const riskCategories = {
      market: [
        { risk: 'Market demand volatility', probability: 'Medium', impact: 'High', mitigation: 'Diversified product portfolio and flexible pricing' },
        { risk: 'Competitive response', probability: 'High', impact: 'Medium', mitigation: 'Strong differentiation and first-mover advantage' },
        { risk: 'Consumer preference shifts', probability: 'Medium', impact: 'Medium', mitigation: 'Continuous market research and agile product development' }
      ],
      operational: [
        { risk: 'Supply chain disruption', probability: 'Medium', impact: 'High', mitigation: 'Multiple supplier relationships and inventory buffers' },
        { risk: 'Quality control issues', probability: 'Low', impact: 'High', mitigation: 'Rigorous QA processes and regular audits' },
        { risk: 'Implementation delays', probability: 'Medium', impact: 'Medium', mitigation: 'Detailed project management and contingency planning' }
      ],
      financial: [
        { risk: 'Cost overruns', probability: 'Medium', impact: 'Medium', mitigation: 'Detailed budgeting and regular cost monitoring' },
        { risk: 'Revenue shortfall', probability: 'Medium', impact: 'High', mitigation: 'Conservative projections and multiple revenue streams' },
        { risk: 'Currency fluctuation', probability: 'Low', impact: 'Low', mitigation: 'Hedging strategies for international operations' }
      ],
      regulatory: [
        { risk: 'Regulatory changes', probability: 'Low', impact: 'Medium', mitigation: 'Active regulatory monitoring and compliance systems' },
        { risk: 'Food safety regulations', probability: 'Low', impact: 'High', mitigation: 'Exceeding regulatory standards and regular compliance audits' }
      ]
    };

    // Calculate overall risk score
    const allRisks = Object.values(riskCategories).flat();
    const riskScore = this.calculateRiskScore(allRisks);

    return {
      overallRiskLevel: riskScore.level,
      riskScore: riskScore.score,
      categories: riskCategories,
      keyRisks: allRisks.filter(risk => 
        (risk.probability === 'High' && risk.impact === 'Medium') ||
        (risk.probability === 'Medium' && risk.impact === 'High') ||
        (risk.probability === 'High' && risk.impact === 'High')
      ),
      mitigationPlan: {
        immediate: allRisks.filter(risk => risk.probability === 'High').map(risk => risk.mitigation),
        ongoing: allRisks.filter(risk => risk.impact === 'High').map(risk => risk.mitigation)
      }
    };
  }

  // Schedule meeting
  async scheduleMeeting(meetingData) {
    try {
      const {
        opportunityId,
        contactId,
        meetingType = 'discovery',
        duration = 60,
        preferredTimes = [],
        timezone = 'UTC',
        agenda = [],
        attendees = []
      } = meetingData;

      // Find optimal meeting time
      const optimalTime = await this.findOptimalMeetingTime(preferredTimes, duration, timezone);
      
      if (!optimalTime) {
        return {
          success: false,
          error: 'No suitable meeting time found',
          alternatives: await this.suggestAlternativeTimes(duration, timezone)
        };
      }

      const meeting = {
        id: this.generateMeetingId(),
        opportunityId,
        contactId,
        meetingType,
        status: 'scheduled',
        scheduledAt: optimalTime.start,
        duration,
        timezone,
        agenda: agenda.length > 0 ? agenda : this.generateDefaultAgenda(meetingType, duration),
        attendees,
        createdAt: new Date().toISOString(),
        
        // Meeting details
        details: {
          location: 'Video Conference', // Default to virtual
          dialIn: this.generateDialInInfo(),
          preparation: this.generatePreparationItems(meetingType),
          followUp: this.generateFollowUpItems(meetingType)
        },
        
        // Reminders
        reminders: [
          { type: 'email', timing: '24_hours_before' },
          { type: 'email', timing: '1_hour_before' },
          { type: 'calendar', timing: '15_minutes_before' }
        ]
      };

      // Store meeting
      this.scheduledMeetings.set(meeting.id, meeting);
      
      // Schedule reminders
      await this.scheduleReminders(meeting);

      console.log(`📅 Scheduled ${meetingType} meeting ${meeting.id} for ${optimalTime.start}`);

      return {
        success: true,
        meeting
      };

    } catch (error) {
      console.error('Error scheduling meeting:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Find optimal meeting time
  async findOptimalMeetingTime(preferredTimes, duration, timezone) {
    // In a real implementation, this would integrate with calendar APIs
    // For now, we'll simulate finding an optimal time
    
    if (preferredTimes.length === 0) {
      // Suggest next business day at 10 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      return {
        start: tomorrow.toISOString(),
        end: new Date(tomorrow.getTime() + duration * 60000).toISOString()
      };
    }

    // Use first preferred time for simulation
    const preferredTime = new Date(preferredTimes[0]);
    return {
      start: preferredTime.toISOString(),
      end: new Date(preferredTime.getTime() + duration * 60000).toISOString()
    };
  }

  // Suggest alternative meeting times
  async suggestAlternativeTimes(duration, timezone) {
    const alternatives = [];
    const baseDate = new Date();
    
    // Suggest next 5 business days at different times
    for (let day = 1; day <= 5; day++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Suggest morning and afternoon slots
      [10, 14, 16].forEach(hour => {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);
        
        alternatives.push({
          start: slotTime.toISOString(),
          end: new Date(slotTime.getTime() + duration * 60000).toISOString(),
          label: `${slotTime.toLocaleDateString()} at ${slotTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
        });
      });
    }

    return alternatives.slice(0, 6); // Return top 6 alternatives
  }

  // Generate default agenda based on meeting type
  generateDefaultAgenda(meetingType, duration) {
    const agendas = {
      discovery: [
        { item: 'Introductions and company overview', duration: 10 },
        { item: 'Current challenges and objectives discussion', duration: 20 },
        { item: 'Partnership opportunity exploration', duration: 20 },
        { item: 'Next steps and timeline', duration: 10 }
      ],
      proposal: [
        { item: 'Proposal presentation', duration: 30 },
        { item: 'Q&A and discussion', duration: 20 },
        { item: 'Financial review', duration: 15 },
        { item: 'Implementation planning', duration: 15 }
      ],
      negotiation: [
        { item: 'Terms review', duration: 25 },
        { item: 'Negotiation discussion', duration: 25 },
        { item: 'Agreement on key points', duration: 10 }
      ],
      kickoff: [
        { item: 'Project overview and objectives', duration: 15 },
        { item: 'Team introductions and roles', duration: 15 },
        { item: 'Timeline and milestones review', duration: 20 },
        { item: 'Communication protocols', duration: 10 }
      ]
    };

    return agendas[meetingType] || agendas.discovery;
  }

  // Helper methods
  parseRevenueString(revenueStr) {
    if (!revenueStr) return null;
    
    const cleanStr = revenueStr.replace(/[$,]/g, '');
    const multiplier = revenueStr.toLowerCase().includes('m') ? 1000000 : 
                     revenueStr.toLowerCase().includes('k') ? 1000 : 1;
    
    return parseFloat(cleanStr) * multiplier;
  }

  addWeeksToDate(date, weeks) {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result.toISOString().split('T')[0];
  }

  calculateCriticalPath(timeline) {
    // Simplified critical path calculation
    return timeline.filter(phase => phase.dependencies.length === 0 || 
      phase.dependencies.some(dep => timeline.find(p => p.phase === dep)?.endWeek === phase.startWeek));
  }

  generateMilestones(timeline) {
    return timeline.map(phase => ({
      name: `${phase.phase} Complete`,
      date: phase.endDate,
      description: `Completion of ${phase.phase} phase`
    }));
  }

  calculateRiskScore(risks) {
    const probabilityScores = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const impactScores = { 'Low': 1, 'Medium': 2, 'High': 3 };
    
    const totalScore = risks.reduce((sum, risk) => {
      return sum + (probabilityScores[risk.probability] * impactScores[risk.impact]);
    }, 0);
    
    const maxScore = risks.length * 9; // Max score per risk is 3 * 3 = 9
    const normalizedScore = (totalScore / maxScore) * 100;
    
    let level;
    if (normalizedScore < 30) level = 'Low';
    else if (normalizedScore < 60) level = 'Medium';
    else level = 'High';
    
    return { score: Math.round(normalizedScore), level };
  }

  generateDialInInfo() {
    return {
      videoLink: 'https://meet.company.com/room/generated-room-id',
      phoneNumber: '+1-555-123-4567',
      accessCode: Math.random().toString().substr(2, 6)
    };
  }

  generatePreparationItems(meetingType) {
    const items = {
      discovery: [
        'Review company background and recent news',
        'Prepare current challenges and objectives overview',
        'Gather relevant market data and insights'
      ],
      proposal: [
        'Review proposal document thoroughly',
        'Prepare financial questions and scenarios',
        'Identify key decision makers and stakeholders'
      ],
      negotiation: [
        'Define negotiation parameters and limits',
        'Prepare alternative proposals and concessions',
        'Review legal and compliance requirements'
      ]
    };
    
    return items[meetingType] || items.discovery;
  }

  generateFollowUpItems(meetingType) {
    return [
      'Send meeting summary and action items',
      'Schedule follow-up meeting if needed',
      'Provide additional requested information',
      'Update CRM with meeting outcomes'
    ];
  }

  async scheduleReminders(meeting) {
    // In a real implementation, this would integrate with email/calendar systems
    console.log(`⏰ Scheduled reminders for meeting ${meeting.id}`);
    return true;
  }

  generateProposalId() {
    return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateMeetingId() {
    return `meet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getOpportunityDetails(opportunityId) {
    // Mock opportunity data - in real implementation, this would fetch from database
    return {
      id: opportunityId,
      title: 'Strategic Partnership Opportunity',
      channel: 'QSR',
      description: 'Partnership opportunity for menu innovation and market expansion',
      revenue: '$2.5M',
      timeline: '12 months',
      priority: 'high'
    };
  }

  // Get proposal status
  getProposal(proposalId) {
    // In real implementation, this would fetch from database
    return {
      success: true,
      proposal: {
        id: proposalId,
        status: 'draft',
        // ... other proposal data
      }
    };
  }

  // Get meeting details
  getMeeting(meetingId) {
    const meeting = this.scheduledMeetings.get(meetingId);
    if (!meeting) {
      return { success: false, error: 'Meeting not found' };
    }
    
    return { success: true, meeting };
  }

  // Get all meetings
  getAllMeetings() {
    const meetings = Array.from(this.scheduledMeetings.values());
    return {
      success: true,
      meetings,
      summary: {
        total: meetings.length,
        upcoming: meetings.filter(m => new Date(m.scheduledAt) > new Date()).length,
        completed: meetings.filter(m => m.status === 'completed').length
      }
    };
  }
}

module.exports = ProposalService;
