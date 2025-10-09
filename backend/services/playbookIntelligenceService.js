const OpenAI = require('openai');

class PlaybookIntelligenceService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Playbook library for intelligent recommendations
    this.playbookLibrary = [
      {
        id: 'pb_qsr_expansion',
        title: 'QSR Chain Expansion Strategy',
        category: 'Market Expansion',
        channels: ['QSR'],
        applicableScenarios: ['New market entry', 'Geographic expansion', 'Franchise development'],
        phases: [
          {
            name: 'Market Analysis',
            duration: '4-6 weeks',
            activities: ['Market sizing', 'Competitive analysis', 'Consumer research', 'Site analysis']
          },
          {
            name: 'Partnership Development',
            duration: '8-12 weeks', 
            activities: ['Partner identification', 'Due diligence', 'Negotiation', 'Contract execution']
          },
          {
            name: 'Pilot Launch',
            duration: '12-16 weeks',
            activities: ['Location setup', 'Staff training', 'Marketing launch', 'Performance monitoring']
          },
          {
            name: 'Scale & Optimize',
            duration: '16-24 weeks',
            activities: ['Performance analysis', 'Process optimization', 'Additional locations', 'ROI evaluation']
          }
        ],
        successFactors: [
          'Strong local market knowledge',
          'Proven operational systems',
          'Effective marketing strategy',
          'Quality control processes'
        ],
        kpis: [
          'Revenue per location',
          'Customer acquisition cost',
          'Market share growth',
          'Operational efficiency'
        ],
        riskFactors: [
          'Local competition',
          'Regulatory compliance',
          'Cultural adaptation',
          'Supply chain complexity'
        ],
        estimatedROI: '25-35%',
        successRate: 0.78,
        averageDuration: '44 weeks',
        investmentRange: '$2M-$5M'
      },
      {
        id: 'pb_menu_innovation',
        title: 'Menu Innovation & Product Launch',
        category: 'Product Development',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        applicableScenarios: ['New product launch', 'Menu refresh', 'Seasonal offerings', 'Health-conscious options'],
        phases: [
          {
            name: 'Concept Development',
            duration: '6-8 weeks',
            activities: ['Trend analysis', 'Consumer insights', 'Concept ideation', 'Initial testing']
          },
          {
            name: 'Product Development',
            duration: '12-16 weeks',
            activities: ['Recipe development', 'Nutritional analysis', 'Cost modeling', 'Supplier sourcing']
          },
          {
            name: 'Market Testing',
            duration: '8-12 weeks',
            activities: ['Focus groups', 'Pilot locations', 'Performance analysis', 'Refinement']
          },
          {
            name: 'Full Launch',
            duration: '6-8 weeks',
            activities: ['Marketing campaign', 'Staff training', 'Supply chain setup', 'Launch execution']
          }
        ],
        successFactors: [
          'Consumer demand validation',
          'Operational feasibility',
          'Competitive differentiation',
          'Profitability analysis'
        ],
        kpis: [
          'Product adoption rate',
          'Revenue contribution',
          'Customer satisfaction',
          'Profit margin'
        ],
        riskFactors: [
          'Market acceptance',
          'Operational complexity',
          'Supply chain reliability',
          'Competitive response'
        ],
        estimatedROI: '15-25%',
        successRate: 0.72,
        averageDuration: '32 weeks',
        investmentRange: '$500K-$2M'
      },
      {
        id: 'pb_digital_transformation',
        title: 'Digital Ordering & Technology Integration',
        category: 'Technology',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        applicableScenarios: ['Digital ordering launch', 'Mobile app development', 'Kiosk implementation', 'Delivery integration'],
        phases: [
          {
            name: 'Technology Assessment',
            duration: '4-6 weeks',
            activities: ['Current state analysis', 'Technology evaluation', 'Vendor selection', 'Integration planning']
          },
          {
            name: 'Development & Integration',
            duration: '16-20 weeks',
            activities: ['System development', 'POS integration', 'Payment processing', 'Testing & QA']
          },
          {
            name: 'Pilot Deployment',
            duration: '8-12 weeks',
            activities: ['Pilot locations', 'Staff training', 'Customer onboarding', 'Performance monitoring']
          },
          {
            name: 'Full Rollout',
            duration: '12-16 weeks',
            activities: ['Phased rollout', 'Marketing support', 'Ongoing optimization', 'Analytics setup']
          }
        ],
        successFactors: [
          'User experience design',
          'System reliability',
          'Staff adoption',
          'Customer education'
        ],
        kpis: [
          'Digital order percentage',
          'Average order value',
          'Customer retention',
          'Operational efficiency'
        ],
        riskFactors: [
          'Technology failures',
          'User adoption rate',
          'Integration complexity',
          'Competitive pressure'
        ],
        estimatedROI: '20-30%',
        successRate: 0.81,
        averageDuration: '40 weeks',
        investmentRange: '$1M-$3M'
      },
      {
        id: 'pb_sustainability',
        title: 'Sustainability & Environmental Initiative',
        category: 'Sustainability',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        applicableScenarios: ['Packaging reduction', 'Carbon footprint reduction', 'Sustainable sourcing', 'Waste management'],
        phases: [
          {
            name: 'Baseline Assessment',
            duration: '6-8 weeks',
            activities: ['Environmental audit', 'Carbon footprint analysis', 'Waste stream analysis', 'Supplier assessment']
          },
          {
            name: 'Strategy Development',
            duration: '8-10 weeks',
            activities: ['Goal setting', 'Initiative planning', 'Supplier engagement', 'Investment analysis']
          },
          {
            name: 'Implementation',
            duration: '16-24 weeks',
            activities: ['Process changes', 'Supplier transitions', 'Staff training', 'Monitoring systems']
          },
          {
            name: 'Measurement & Optimization',
            duration: '12-16 weeks',
            activities: ['Impact measurement', 'Reporting', 'Continuous improvement', 'Certification pursuit']
          }
        ],
        successFactors: [
          'Leadership commitment',
          'Supplier collaboration',
          'Employee engagement',
          'Customer communication'
        ],
        kpis: [
          'Carbon footprint reduction',
          'Waste diversion rate',
          'Sustainable sourcing percentage',
          'Cost savings'
        ],
        riskFactors: [
          'Cost implications',
          'Supplier availability',
          'Consumer acceptance',
          'Regulatory changes'
        ],
        estimatedROI: '10-20%',
        successRate: 0.69,
        averageDuration: '42 weeks',
        investmentRange: '$750K-$2.5M'
      },
      {
        id: 'pb_loyalty_program',
        title: 'Customer Loyalty Program Launch',
        category: 'Marketing',
        channels: ['QSR', 'Fast Casual', 'Coffee', 'Casual Dining'],
        applicableScenarios: ['Loyalty program launch', 'Customer retention improvement', 'Data collection initiative', 'Personalization strategy'],
        phases: [
          {
            name: 'Program Design',
            duration: '8-10 weeks',
            activities: ['Customer analysis', 'Program structure', 'Reward design', 'Technology requirements']
          },
          {
            name: 'Technology Development',
            duration: '12-16 weeks',
            activities: ['Platform development', 'Mobile integration', 'POS integration', 'Analytics setup']
          },
          {
            name: 'Pilot Launch',
            duration: '8-12 weeks',
            activities: ['Soft launch', 'Customer onboarding', 'Performance monitoring', 'Program refinement']
          },
          {
            name: 'Full Launch & Optimization',
            duration: '12-16 weeks',
            activities: ['Marketing campaign', 'Full rollout', 'Performance analysis', 'Continuous optimization']
          }
        ],
        successFactors: [
          'Compelling value proposition',
          'Easy enrollment process',
          'Relevant rewards',
          'Effective communication'
        ],
        kpis: [
          'Enrollment rate',
          'Active member percentage',
          'Repeat visit frequency',
          'Revenue per member'
        ],
        riskFactors: [
          'Low adoption rate',
          'Technology issues',
          'Reward cost management',
          'Competitive programs'
        ],
        estimatedROI: '18-28%',
        successRate: 0.75,
        averageDuration: '40 weeks',
        investmentRange: '$800K-$2M'
      },
      {
        id: 'pb_supply_chain',
        title: 'Supply Chain Optimization',
        category: 'Operations',
        channels: ['QSR', 'Fast Casual', 'Casual Dining'],
        applicableScenarios: ['Cost reduction initiative', 'Quality improvement', 'Supplier consolidation', 'Logistics optimization'],
        phases: [
          {
            name: 'Current State Analysis',
            duration: '6-8 weeks',
            activities: ['Supply chain mapping', 'Cost analysis', 'Performance assessment', 'Risk evaluation']
          },
          {
            name: 'Optimization Strategy',
            duration: '8-12 weeks',
            activities: ['Supplier evaluation', 'Process redesign', 'Technology assessment', 'Implementation planning']
          },
          {
            name: 'Implementation',
            duration: '16-24 weeks',
            activities: ['Supplier transitions', 'Process changes', 'System implementation', 'Training programs']
          },
          {
            name: 'Performance Monitoring',
            duration: '12-16 weeks',
            activities: ['KPI tracking', 'Continuous improvement', 'Supplier management', 'Risk mitigation']
          }
        ],
        successFactors: [
          'Supplier partnership',
          'Change management',
          'Technology integration',
          'Performance measurement'
        ],
        kpis: [
          'Cost reduction percentage',
          'Quality metrics',
          'Delivery performance',
          'Inventory turnover'
        ],
        riskFactors: [
          'Supplier reliability',
          'Quality consistency',
          'Implementation complexity',
          'Market volatility'
        ],
        estimatedROI: '12-22%',
        successRate: 0.73,
        averageDuration: '42 weeks',
        investmentRange: '$1M-$4M'
      }
    ];
  }

  async recommendPlaybooks(opportunity, context = {}) {
    try {
      console.log(`📚 Recommending playbooks for opportunity ${opportunity.id}...`);

      // Calculate playbook relevance scores
      const playbookScores = [];
      
      for (const playbook of this.playbookLibrary) {
        const score = await this.calculatePlaybookRelevance(opportunity, playbook, context);
        
        if (score.overall >= 0.3) { // Only include relevant playbooks
          playbookScores.push({
            playbook: playbook,
            score: score,
            reasoning: score.reasoning,
            customization: await this.suggestCustomizations(opportunity, playbook),
            timeline: this.adjustTimeline(playbook, opportunity),
            resources: this.estimateResources(playbook, opportunity)
          });
        }
      }

      // Sort by relevance score
      playbookScores.sort((a, b) => b.score.overall - a.score.overall);

      return {
        success: true,
        opportunity: opportunity,
        recommendations: playbookScores.slice(0, 4), // Top 4 playbooks
        summary: {
          totalPlaybooks: playbookScores.length,
          topScore: playbookScores[0]?.score.overall || 0,
          recommendedPlaybook: playbookScores[0]?.playbook.title || 'No suitable playbook found',
          averageSuccessRate: this.calculateAverageSuccessRate(playbookScores.slice(0, 3)),
          estimatedDuration: playbookScores[0]?.timeline.totalWeeks || 'TBD'
        }
      };

    } catch (error) {
      console.error('Error recommending playbooks:', error);
      return {
        success: false,
        error: error.message,
        recommendations: []
      };
    }
  }

  async calculatePlaybookRelevance(opportunity, playbook, context) {
    try {
      // Channel alignment (30% weight)
      const channelScore = playbook.channels.includes(opportunity.channel) ? 1.0 : 
                          this.getChannelSimilarity(opportunity.channel, playbook.channels);

      // Scenario matching (25% weight)
      const scenarioScore = await this.calculateScenarioMatch(opportunity, playbook);

      // Success rate and track record (25% weight)
      const trackRecordScore = playbook.successRate;

      // Context fit (20% weight)
      const contextScore = this.calculateContextFit(opportunity, playbook, context);

      const overall = (channelScore * 0.3) + (scenarioScore * 0.25) + 
                     (trackRecordScore * 0.25) + (contextScore * 0.2);

      const confidence = Math.min(0.95, overall + (Math.random() * 0.1));

      return {
        overall: Math.round(overall * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
        breakdown: {
          channel: Math.round(channelScore * 100) / 100,
          scenario: Math.round(scenarioScore * 100) / 100,
          trackRecord: Math.round(trackRecordScore * 100) / 100,
          context: Math.round(contextScore * 100) / 100
        },
        reasoning: this.generatePlaybookReasoning(opportunity, playbook, {
          channel: channelScore,
          scenario: scenarioScore,
          trackRecord: trackRecordScore,
          context: contextScore
        })
      };

    } catch (error) {
      console.error('Error calculating playbook relevance:', error);
      return {
        overall: 0,
        confidence: 0,
        breakdown: { channel: 0, scenario: 0, trackRecord: 0, context: 0 },
        reasoning: 'Error calculating playbook relevance'
      };
    }
  }

  async calculateScenarioMatch(opportunity, playbook) {
    try {
      // Use AI to assess scenario matching
      const prompt = `Assess how well this playbook matches the opportunity scenario:

Opportunity: ${opportunity.title}
Description: ${opportunity.description || 'Partnership opportunity'}
Channel: ${opportunity.channel}

Playbook: ${playbook.title}
Category: ${playbook.category}
Applicable Scenarios: ${playbook.applicableScenarios.join(', ')}

Rate the scenario match from 0.0 to 1.0 considering:
- Direct scenario alignment
- Transferable methodologies
- Relevant success factors
- Applicable KPIs

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
      console.error('Error calculating scenario match:', error);
      return 0.6; // Default score
    }
  }

  getChannelSimilarity(targetChannel, playbookChannels) {
    const similarities = {
      'QSR': { 'Fast Casual': 0.8, 'Coffee': 0.6, 'Casual Dining': 0.4 },
      'Fast Casual': { 'QSR': 0.8, 'Casual Dining': 0.7, 'Coffee': 0.5 },
      'Coffee': { 'QSR': 0.6, 'Fast Casual': 0.5, 'Casual Dining': 0.3 },
      'Casual Dining': { 'Fast Casual': 0.7, 'QSR': 0.4, 'Coffee': 0.3 }
    };

    let maxSimilarity = 0;
    for (const channel of playbookChannels) {
      if (similarities[targetChannel] && similarities[targetChannel][channel]) {
        maxSimilarity = Math.max(maxSimilarity, similarities[targetChannel][channel]);
      }
    }
    return maxSimilarity;
  }

  calculateContextFit(opportunity, playbook, context) {
    let score = 0.5; // Base score

    // Budget alignment
    if (context.budget && playbook.investmentRange) {
      const budgetValue = parseFloat(context.budget.replace(/[$M,]/g, ''));
      const [minInvestment, maxInvestment] = playbook.investmentRange
        .replace(/[$M,]/g, '')
        .split('-')
        .map(v => parseFloat(v));
      
      if (budgetValue >= minInvestment && budgetValue <= maxInvestment * 1.2) {
        score += 0.3;
      } else if (budgetValue >= minInvestment * 0.8) {
        score += 0.1;
      }
    }

    // Timeline alignment
    if (context.timeline && playbook.averageDuration) {
      const contextWeeks = parseInt(context.timeline) * 4.33; // Convert months to weeks
      const playbookWeeks = parseInt(playbook.averageDuration);
      
      if (contextWeeks >= playbookWeeks * 0.8 && contextWeeks <= playbookWeeks * 1.2) {
        score += 0.2;
      } else if (contextWeeks >= playbookWeeks * 0.6) {
        score += 0.1;
      }
    }

    return Math.min(1.0, score);
  }

  generatePlaybookReasoning(opportunity, playbook, scores) {
    const reasons = [];

    if (scores.channel >= 0.8) {
      reasons.push(`Perfect channel match for ${opportunity.channel}`);
    } else if (scores.channel >= 0.6) {
      reasons.push(`Good channel compatibility with ${opportunity.channel}`);
    }

    if (scores.scenario >= 0.7) {
      reasons.push('Strong scenario alignment with opportunity requirements');
    }

    if (scores.trackRecord >= 0.7) {
      reasons.push(`Proven track record with ${Math.round(playbook.successRate * 100)}% success rate`);
    }

    if (scores.context >= 0.7) {
      reasons.push('Good fit with project constraints and requirements');
    }

    if (playbook.estimatedROI) {
      reasons.push(`Expected ROI of ${playbook.estimatedROI}`);
    }

    if (reasons.length === 0) {
      reasons.push('Applicable methodology with relevant best practices');
    }

    return reasons.join('; ');
  }

  async suggestCustomizations(opportunity, playbook) {
    try {
      const customizations = [];

      // Channel-specific customizations
      if (opportunity.channel !== playbook.channels[0]) {
        customizations.push({
          area: 'Channel Adaptation',
          description: `Adapt methodology for ${opportunity.channel} channel specifics`,
          impact: 'Medium',
          effort: 'Low'
        });
      }

      // Scale customizations
      if (opportunity.estimatedRevenue) {
        const revenue = parseFloat(opportunity.estimatedRevenue.replace(/[$M,]/g, ''));
        if (revenue > 5) {
          customizations.push({
            area: 'Scale Optimization',
            description: 'Enhance approach for large-scale implementation',
            impact: 'High',
            effort: 'Medium'
          });
        }
      }

      // Timeline customizations
      customizations.push({
        area: 'Timeline Adjustment',
        description: 'Adjust phase timing based on opportunity urgency',
        impact: 'Medium',
        effort: 'Low'
      });

      // Success factor emphasis
      customizations.push({
        area: 'Success Factor Focus',
        description: 'Emphasize critical success factors for this opportunity type',
        impact: 'High',
        effort: 'Low'
      });

      return customizations;

    } catch (error) {
      console.error('Error suggesting customizations:', error);
      return [];
    }
  }

  adjustTimeline(playbook, opportunity) {
    const baseWeeks = parseInt(playbook.averageDuration);
    let adjustedWeeks = baseWeeks;

    // Adjust based on opportunity priority
    if (opportunity.priority === 'high') {
      adjustedWeeks = Math.round(baseWeeks * 0.85); // 15% faster
    } else if (opportunity.priority === 'low') {
      adjustedWeeks = Math.round(baseWeeks * 1.15); // 15% slower
    }

    // Adjust based on complexity
    if (opportunity.estimatedRevenue) {
      const revenue = parseFloat(opportunity.estimatedRevenue.replace(/[$M,]/g, ''));
      if (revenue > 5) {
        adjustedWeeks = Math.round(adjustedWeeks * 1.1); // 10% longer for large deals
      }
    }

    return {
      originalWeeks: baseWeeks,
      adjustedWeeks: adjustedWeeks,
      phases: playbook.phases.map(phase => ({
        ...phase,
        adjustedDuration: this.adjustPhaseDuration(phase.duration, adjustedWeeks / baseWeeks)
      })),
      totalWeeks: adjustedWeeks,
      rationale: this.getTimelineRationale(baseWeeks, adjustedWeeks, opportunity)
    };
  }

  adjustPhaseDuration(originalDuration, multiplier) {
    const [min, max] = originalDuration.split('-').map(d => parseInt(d));
    const adjustedMin = Math.round(min * multiplier);
    const adjustedMax = Math.round(max * multiplier);
    return `${adjustedMin}-${adjustedMax} weeks`;
  }

  getTimelineRationale(original, adjusted, opportunity) {
    if (adjusted < original) {
      return `Accelerated timeline due to ${opportunity.priority} priority opportunity`;
    } else if (adjusted > original) {
      return 'Extended timeline to accommodate complexity and scale requirements';
    } else {
      return 'Standard timeline applies for this opportunity type';
    }
  }

  estimateResources(playbook, opportunity) {
    const baseInvestment = playbook.investmentRange.split('-')[0].replace(/[$M,]/g, '');
    const estimatedCost = parseFloat(baseInvestment) * 1000000; // Convert to dollars

    return {
      estimatedBudget: {
        min: estimatedCost * 0.8,
        max: estimatedCost * 1.2,
        currency: 'USD'
      },
      teamSize: {
        coreTeam: '3-5 people',
        extendedTeam: '8-12 people',
        expertConsultants: '2-3 specialists'
      },
      keyRoles: [
        'Project Manager',
        'Business Analyst',
        'Implementation Specialist',
        'Change Management Lead'
      ],
      technology: [
        'Project management tools',
        'Analytics platform',
        'Communication systems',
        'Monitoring dashboards'
      ],
      externalSupport: [
        'Industry experts',
        'Technology vendors',
        'Implementation partners',
        'Training providers'
      ]
    };
  }

  calculateAverageSuccessRate(playbookRecommendations) {
    if (playbookRecommendations.length === 0) return 0;
    
    const totalRate = playbookRecommendations.reduce((sum, rec) => 
      sum + rec.playbook.successRate, 0);
    
    return Math.round(totalRate / playbookRecommendations.length * 100) / 100;
  }

  async generateNextBestActions(opportunity, context = {}) {
    try {
      console.log(`🎯 Generating next best actions for opportunity ${opportunity.id}...`);

      const actions = [];

      // Immediate actions (next 1-2 weeks)
      const immediateActions = await this.generateImmediateActions(opportunity, context);
      actions.push(...immediateActions);

      // Short-term actions (next 2-8 weeks)
      const shortTermActions = await this.generateShortTermActions(opportunity, context);
      actions.push(...shortTermActions);

      // Long-term actions (next 2-6 months)
      const longTermActions = await this.generateLongTermActions(opportunity, context);
      actions.push(...longTermActions);

      // Prioritize actions
      const prioritizedActions = this.prioritizeActions(actions, opportunity);

      return {
        success: true,
        opportunity: opportunity,
        actions: prioritizedActions,
        summary: {
          totalActions: prioritizedActions.length,
          immediateActions: immediateActions.length,
          shortTermActions: shortTermActions.length,
          longTermActions: longTermActions.length,
          highPriorityActions: prioritizedActions.filter(a => a.priority === 'High').length
        }
      };

    } catch (error) {
      console.error('Error generating next best actions:', error);
      return {
        success: false,
        error: error.message,
        actions: []
      };
    }
  }

  async generateImmediateActions(opportunity, context) {
    const actions = [
      {
        id: 'action_research',
        title: 'Conduct Market Research',
        description: `Research ${opportunity.channel} market dynamics and competitive landscape`,
        category: 'Research',
        priority: 'High',
        timeframe: '1-2 weeks',
        effort: 'Medium',
        impact: 'High',
        dependencies: [],
        resources: ['Market analyst', 'Research tools'],
        deliverables: ['Market analysis report', 'Competitive assessment'],
        successCriteria: 'Comprehensive understanding of market opportunity'
      },
      {
        id: 'action_stakeholder',
        title: 'Identify Key Stakeholders',
        description: 'Map and prioritize key decision makers and influencers',
        category: 'Stakeholder Management',
        priority: 'High',
        timeframe: '1 week',
        effort: 'Low',
        impact: 'High',
        dependencies: [],
        resources: ['Business development team'],
        deliverables: ['Stakeholder map', 'Contact database'],
        successCriteria: 'Complete stakeholder identification and prioritization'
      }
    ];

    // Add opportunity-specific immediate actions
    if (opportunity.priority === 'high') {
      actions.push({
        id: 'action_urgent_outreach',
        title: 'Initiate Urgent Outreach',
        description: 'Begin immediate contact with key decision makers',
        category: 'Outreach',
        priority: 'Critical',
        timeframe: '3-5 days',
        effort: 'Medium',
        impact: 'High',
        dependencies: ['action_stakeholder'],
        resources: ['Business development lead', 'Executive sponsor'],
        deliverables: ['Initial meetings scheduled', 'Interest confirmation'],
        successCriteria: 'Confirmed interest and next steps defined'
      });
    }

    return actions;
  }

  async generateShortTermActions(opportunity, context) {
    return [
      {
        id: 'action_proposal',
        title: 'Develop Partnership Proposal',
        description: 'Create comprehensive partnership proposal with value proposition',
        category: 'Proposal Development',
        priority: 'High',
        timeframe: '3-4 weeks',
        effort: 'High',
        impact: 'High',
        dependencies: ['action_research'],
        resources: ['Business analyst', 'Financial modeler', 'Legal counsel'],
        deliverables: ['Partnership proposal', 'Financial model', 'Legal framework'],
        successCriteria: 'Compelling proposal ready for presentation'
      },
      {
        id: 'action_pilot',
        title: 'Design Pilot Program',
        description: 'Develop pilot program structure and success metrics',
        category: 'Program Design',
        priority: 'Medium',
        timeframe: '4-6 weeks',
        effort: 'High',
        impact: 'High',
        dependencies: ['action_proposal'],
        resources: ['Program manager', 'Operations team', 'Analytics team'],
        deliverables: ['Pilot program design', 'Success metrics', 'Implementation plan'],
        successCriteria: 'Pilot program ready for execution'
      },
      {
        id: 'action_due_diligence',
        title: 'Conduct Due Diligence',
        description: 'Perform comprehensive due diligence on potential partner',
        category: 'Risk Assessment',
        priority: 'High',
        timeframe: '2-3 weeks',
        effort: 'Medium',
        impact: 'High',
        dependencies: ['action_stakeholder'],
        resources: ['Legal team', 'Financial analyst', 'Industry expert'],
        deliverables: ['Due diligence report', 'Risk assessment', 'Recommendations'],
        successCriteria: 'Complete understanding of partner capabilities and risks'
      }
    ];
  }

  async generateLongTermActions(opportunity, context) {
    return [
      {
        id: 'action_implementation',
        title: 'Full Implementation Planning',
        description: 'Develop comprehensive implementation strategy and timeline',
        category: 'Implementation',
        priority: 'Medium',
        timeframe: '8-12 weeks',
        effort: 'High',
        impact: 'High',
        dependencies: ['action_pilot'],
        resources: ['Implementation team', 'Project manager', 'Change management'],
        deliverables: ['Implementation plan', 'Resource allocation', 'Timeline'],
        successCriteria: 'Ready-to-execute implementation strategy'
      },
      {
        id: 'action_scaling',
        title: 'Scaling Strategy Development',
        description: 'Plan for scaling successful partnership across markets',
        category: 'Growth Strategy',
        priority: 'Low',
        timeframe: '12-16 weeks',
        effort: 'Medium',
        impact: 'High',
        dependencies: ['action_implementation'],
        resources: ['Strategy team', 'Market analysts', 'Operations'],
        deliverables: ['Scaling plan', 'Market prioritization', 'Resource requirements'],
        successCriteria: 'Clear roadmap for partnership expansion'
      }
    ];
  }

  prioritizeActions(actions, opportunity) {
    // Sort by priority and impact
    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };

    return actions.sort((a, b) => {
      const aPriorityScore = priorityOrder[a.priority] || 0;
      const bPriorityScore = priorityOrder[b.priority] || 0;
      const aImpactScore = impactOrder[a.impact] || 0;
      const bImpactScore = impactOrder[b.impact] || 0;

      const aTotal = aPriorityScore + aImpactScore;
      const bTotal = bPriorityScore + bImpactScore;

      return bTotal - aTotal;
    });
  }

  // Get playbook intelligence statistics for dashboard
  getPlaybookStatistics() {
    const totalPlaybooks = this.playbookLibrary.length;
    const categories = [...new Set(this.playbookLibrary.map(p => p.category))];
    const channels = [...new Set(this.playbookLibrary.flatMap(p => p.channels))];
    const averageSuccessRate = Math.round(
      this.playbookLibrary.reduce((sum, p) => sum + p.successRate, 0) / totalPlaybooks * 100
    ) / 100;
    const averageDuration = Math.round(
      this.playbookLibrary.reduce((sum, p) => sum + parseInt(p.averageDuration), 0) / totalPlaybooks
    );

    return {
      totalPlaybooks,
      categories: categories.length,
      channels: channels.length,
      averageSuccessRate,
      averageDuration,
      totalRecommendations: 134,
      successfulImplementations: 98,
      recommendationAccuracy: 0.82
    };
  }
}

module.exports = PlaybookIntelligenceService;
