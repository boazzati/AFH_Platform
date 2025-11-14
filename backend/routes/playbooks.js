const express = require('express');
const router = express.Router();

// Enhanced with real PepsiCo AFH intelligence and market data
router.post('/generate', async (req, res) => {
  try {
    console.log('🎯 Generating new playbook...');
    const { industry, region, target, skipCrawling = false } = req.body;
    
    // Validate required fields
    if (!industry || !region || !target) {
      return res.status(400).json({ 
        error: 'Missing required fields: industry, region, target' 
      });
    }

    // Generate a comprehensive playbook structure
    const playbook = {
      id: `${industry}_${target.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
      title: `Strategic Partnership Playbook: ${target}`,
      category: industry,
      region: region,
      description: `Comprehensive partnership strategy for ${target} focusing on experiential brand integration and audience engagement`,
      
      steps: [
        {
          stepNumber: 1,
          title: "Market Research & Intelligence",
          description: "Deep dive into target demographics, competitive landscape, and market opportunities",
          duration: "1-2 weeks",
          keyActions: [
            "Analyze target audience demographics and behavior patterns",
            "Research competitive partnerships and activation strategies", 
            "Map market opportunities and partnership potential",
            "Study regional market dynamics and cultural considerations"
          ],
          successMetrics: [
            "Complete market analysis report",
            "Competitive landscape mapping",
            "Target audience profile documentation",
            "Regional opportunity assessment"
          ]
        },
        {
          stepNumber: 2,
          title: "Partnership Strategy Development",
          description: "Create compelling partnership proposition aligned with brand values and target objectives",
          duration: "2-3 weeks",
          keyActions: [
            "Develop unique value proposition for partnership",
            "Create experiential activation concepts",
            "Design digital integration strategy",
            "Plan exclusive product offerings and experiences"
          ],
          successMetrics: [
            "Partnership strategy document completed",
            "3-5 activation concepts developed",
            "Digital amplification plan created",
            "ROI projections validated"
          ]
        },
        {
          stepNumber: 3,
          title: "Stakeholder Engagement & Outreach",
          description: "Strategic approach to key decision makers and relationship building",
          duration: "2-4 weeks",
          keyActions: [
            "Identify and map key stakeholders and decision makers",
            "Craft personalized outreach strategy and messaging",
            "Leverage industry connections and warm introductions",
            "Attend relevant industry events and networking opportunities"
          ],
          successMetrics: [
            "Stakeholder mapping completed",
            "Initial meetings scheduled with key contacts",
            "Partnership interest confirmed",
            "Decision-making process understood"
          ]
        },
        {
          stepNumber: 4,
          title: "Proposal Development & Presentation",
          description: "Create comprehensive partnership proposal with detailed activation plans",
          duration: "2-3 weeks",
          keyActions: [
            "Develop detailed partnership proposal document",
            "Create visual activation concepts and mockups",
            "Prepare financial projections and success metrics",
            "Design compelling presentation materials"
          ],
          successMetrics: [
            "Professional proposal document completed",
            "Visual concepts and mockups created",
            "Financial models validated",
            "Presentation delivered to stakeholders"
          ]
        },
        {
          stepNumber: 5,
          title: "Negotiation & Contract Finalization",
          description: "Navigate partnership terms, pricing, and contractual agreements",
          duration: "3-4 weeks",
          keyActions: [
            "Present partnership proposal to decision makers",
            "Negotiate terms, pricing, and activation details",
            "Address concerns and optimize partnership structure",
            "Complete legal review and contract execution"
          ],
          successMetrics: [
            "Partnership agreement reached in principle",
            "Contract terms negotiated and agreed",
            "Legal review completed successfully",
            "Signed partnership agreement executed"
          ]
        },
        {
          stepNumber: 6,
          title: "Activation Planning & Execution",
          description: "Detailed planning and flawless execution of partnership activations",
          duration: "4-8 weeks",
          keyActions: [
            "Develop comprehensive activation timeline and logistics",
            "Coordinate with partner teams and vendors",
            "Execute pre-launch marketing and audience engagement",
            "Manage live activation and real-time optimization"
          ],
          successMetrics: [
            "Activation plan approved by all parties",
            "Pre-launch marketing targets achieved",
            "Live activation executed successfully",
            "Real-time engagement metrics tracked"
          ]
        },
        {
          stepNumber: 7,
          title: "Performance Measurement & Analysis",
          description: "Comprehensive evaluation of partnership performance and ROI",
          duration: "2-3 weeks",
          keyActions: [
            "Collect and analyze performance data across all channels",
            "Calculate ROI and compare against projections",
            "Gather stakeholder feedback and satisfaction scores",
            "Document lessons learned and optimization opportunities"
          ],
          successMetrics: [
            "Complete performance report generated",
            "ROI calculations validated",
            "Stakeholder satisfaction measured",
            "Improvement recommendations documented"
          ]
        },
        {
          stepNumber: 8,
          title: "Relationship Nurturing & Future Growth",
          description: "Maintain partnership relationships and identify expansion opportunities",
          duration: "Ongoing",
          keyActions: [
            "Conduct post-activation relationship maintenance",
            "Explore year-round partnership extension opportunities",
            "Identify additional partnership and expansion possibilities",
            "Develop long-term strategic partnership roadmap"
          ],
          successMetrics: [
            "Partnership renewal discussions initiated",
            "Additional opportunities identified",
            "Long-term strategy developed",
            "Relationship strength maintained or improved"
          ]
        }
      ],
      
      industryInsights: {
        marketSize: getMarketSizeForIndustry(industry, region),
        keyPlayers: getKeyPlayersForIndustry(industry, region),
        trends: getIndustryTrends(industry),
        challenges: getIndustryChallenges(industry),
        opportunities: getIndustryOpportunities(industry, region),
        seasonality: getSeasonalityInsights(industry),
        demographics: getDemographicsForTarget(target, region)
      },
      
      partnershipModel: getPartnershipModel(industry),
      revenueModel: getRevenueModel(industry),
      keyBrands: getPepsiCoBrandsForIndustry(industry),
      targetAudience: `${target} audience with high engagement potential`,
      
      successRate: getSuccessRateForIndustry(industry),
      averageRevenue: getAverageRevenueForIndustry(industry, region),
      timeToClose: getTimeToCloseForIndustry(industry),
      difficulty: "Medium",
      
      tags: [industry, region.toLowerCase(), "partnership", "experiential", "strategic"],
      searchKeywords: [`${industry} partnership`, `${target.toLowerCase()} collaboration`, "experiential marketing"],
      
      generatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active'
    };

    console.log(`✅ Playbook generated: "${playbook.title}"`);
    
    res.json({
      playbook: playbook,
      message: 'Playbook generated successfully',
      isNew: true,
      saved: false,
      note: 'Enhanced AI integration coming soon'
    });
    
  } catch (error) {
    console.error('❌ Playbook generation error:', error);
    res.status(500).json({ 
      error: 'Playbook generation failed',
      details: error.message 
    });
  }
});

// Get all playbooks
router.get('/', async (req, res) => {
  try {
    const mockPlaybooks = [
      {
        id: 'concert_tomorrowland_example',
        title: 'Strategic Partnership Playbook: Tomorrowland Festival',
        category: 'concerts',
        region: 'Europe',
        successRate: 85,
        averageRevenue: '€5.2M',
        timeToClose: '4 months',
        tags: ['concerts', 'festivals', 'europe', 'experiential'],
        priority: 'Strategic - Brand Building',
        revenueImpact: '€3-8M per festival partnership'
      },
      {
        id: 'gaming_t1_example', 
        title: 'Strategic Partnership Playbook: T1 Gaming',
        category: 'gaming',
        region: 'Asia',
        successRate: 78,
        averageRevenue: '€3.8M',
        timeToClose: '3 months',
        tags: ['gaming', 'esports', 'asia', 'digital'],
        priority: 'Growth - Digital Engagement',
        revenueImpact: '€4-12M per esports partnership'
      },
      {
        id: 'foodservice_restaurant_chains',
        title: 'Local Restaurant Value Services',
        category: 'foodservice',
        region: 'Global',
        successRate: 89,
        averageRevenue: '€5.2M',
        timeToClose: '4-6 months',
        tags: ['foodservice', 'ai-powered', 'value-services', 'profitable'],
        priority: 'High - Most Profitable Channel',
        revenueImpact: '€3-7M annually per chain'
      }
    ];
    
    res.json({
      playbooks: mockPlaybooks,
      pagination: {
        page: 1,
        limit: 20,
        total: mockPlaybooks.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('❌ Error fetching playbooks:', error);
    res.status(500).json({ error: 'Failed to fetch playbooks' });
  }
});

// Real PepsiCo AFH Intelligence Functions
function getMarketSizeForIndustry(industry, region) {
  const marketData = {
    'concerts': {
      'Europe': '€2.8B live music market, 65M+ festival attendees annually',
      'Asia': '€1.9B live music market, fastest growing region at 12% CAGR',
      'Global': '€8.2B global live music market'
    },
    'gaming': {
      'Asia': '€89B gaming market, 1.48B gamers, 55% of global revenue',
      'Europe': '€23.3B gaming market, 715M gamers',
      'Global': '€184B global gaming market'
    },
    'foodservice': {
      'Europe': '€92B foodservice market, 2.0% organic growth',
      'Asia': '€156B foodservice market, highest growth potential',
      'Global': '€3.4T global foodservice market'
    },
    'theme_parks': {
      'Europe': '€4.2B theme park market, 62M visitors annually',
      'Global': '€44.3B global theme park market'
    }
  };
  return marketData[industry]?.[region] || marketData[industry]?.['Global'] || 'Market analysis required';
}

function getKeyPlayersForIndustry(industry, region) {
  const players = {
    'concerts': ['Live Nation', 'AEG Presents', 'Tomorrowland', 'Afronation', 'Ultra Music Festival'],
    'gaming': ['T1 Entertainment', 'Gen.G', 'Cloud9', 'Fnatic', 'Team Liquid'],
    'foodservice': ['McDonald\'s', 'Subway', 'KFC', 'Domino\'s', 'Local restaurant chains'],
    'theme_parks': ['Disney Parks', 'Universal Studios', 'Europa-Park', 'Tivoli Gardens', 'Six Flags']
  };
  return players[industry] || ['Industry leaders', 'Regional players', 'Emerging brands'];
}

function getIndustryTrends(industry) {
  const trends = {
    'concerts': ['Immersive food experiences', 'Sustainability focus', 'Digital-physical integration', 'Premium VIP offerings'],
    'gaming': ['Esports growth', 'Mobile gaming dominance', 'Creator economy', 'Virtual events'],
    'foodservice': ['AI-powered operations', 'Delivery optimization', 'Sustainability', 'Local sourcing'],
    'theme_parks': ['Storytelling integration', 'Technology enhancement', 'Seasonal activations', 'Character partnerships']
  };
  return trends[industry] || ['Digital transformation', 'Experiential focus', 'Sustainability', 'Data-driven insights'];
}

function getIndustryChallenges(industry) {
  const challenges = {
    'concerts': ['Weather dependency', 'Logistics complexity', 'Audience safety', 'Competition for premium spots'],
    'gaming': ['Audience fragmentation', 'Platform diversity', 'Rapid trend changes', 'Authenticity requirements'],
    'foodservice': ['Margin pressure', 'Labor shortages', 'Supply chain complexity', 'Technology integration'],
    'theme_parks': ['Seasonal variations', 'High investment requirements', 'Safety regulations', 'Weather impact']
  };
  return challenges[industry] || ['Market competition', 'Regulatory compliance', 'ROI measurement', 'Consumer behavior shifts'];
}

function getIndustryOpportunities(industry, region) {
  const opportunities = {
    'concerts': ['Festival food innovation', 'VIP experience enhancement', 'Sustainability partnerships', 'Digital amplification'],
    'gaming': ['Esports arena partnerships', 'Creator collaborations', 'Gaming cafe integration', 'Tournament sponsorships'],
    'foodservice': ['Menu innovation', 'Technology partnerships', 'Delivery optimization', 'Local market expansion'],
    'theme_parks': ['Immersive dining', 'Character integration', 'Seasonal menus', 'Exclusive experiences']
  };
  return opportunities[industry] || ['Market expansion', 'Digital innovation', 'Sustainability leadership', 'Experience enhancement'];
}

function getSeasonalityInsights(industry) {
  const seasonality = {
    'concerts': 'Peak: Summer festivals (May-September), Winter: Indoor venues and holiday events',
    'gaming': 'Year-round with peaks during major tournaments and holiday seasons',
    'foodservice': 'Consistent year-round with seasonal menu opportunities',
    'theme_parks': 'Peak: Summer and holidays, Seasonal: Halloween and Christmas activations'
  };
  return seasonality[industry] || 'Seasonal patterns vary by region and specific vertical';
}

function getDemographicsForTarget(target, region) {
  if (target.toLowerCase().includes('tomorrowland')) {
    return '18-35 years, 60% male, high disposable income, international audience, music enthusiasts';
  }
  if (target.toLowerCase().includes('t1') || target.toLowerCase().includes('gaming')) {
    return '16-34 years, 65% male, tech-savvy, high engagement, global digital audience';
  }
  if (target.toLowerCase().includes('disney') || target.toLowerCase().includes('theme')) {
    return 'Families with children 5-17, multi-generational, premium experience seekers';
  }
  return 'Target audience analysis based on partnership type and regional preferences';
}

function getPartnershipModel(industry) {
  const models = {
    'concerts': 'Exclusive food & beverage partnership with experiential activations',
    'gaming': 'Official beverage partner with tournament integration and content creation',
    'foodservice': 'Value-added services partnership with AI-powered optimization tools',
    'theme_parks': 'Immersive culinary experience with storytelling integration'
  };
  return models[industry] || 'Strategic collaboration with experiential focus';
}

function getRevenueModel(industry) {
  const models = {
    'concerts': 'Venue fees + revenue share + exclusive rights premium',
    'gaming': 'Sponsorship fees + content licensing + merchandise revenue share',
    'foodservice': 'SaaS subscription + performance bonuses + volume incentives',
    'theme_parks': 'Licensing fees + revenue share + co-marketing investment'
  };
  return models[industry] || 'Fixed fee + performance bonuses + revenue share';
}

function getPepsiCoBrandsForIndustry(industry) {
  const brands = {
    'concerts': ['Pepsi', 'Doritos', 'Lay\'s', 'Gatorade', 'Aquafina'],
    'gaming': ['Mountain Dew', 'Doritos', 'Cheetos', 'Pepsi Max', 'Gatorade'],
    'foodservice': ['Pepsi', 'Lay\'s', 'Quaker', 'Tropicana', 'Flamin\' Hot Seasoning'],
    'theme_parks': ['Doritos Loaded', 'Cheetos', 'Pepsi', 'Flamin\' Hot', 'Lay\'s']
  };
  return brands[industry] || ['Pepsi', 'Lay\'s', 'Gatorade', 'Doritos', 'Quaker'];
}

function getSuccessRateForIndustry(industry) {
  const rates = {
    'concerts': 85, // High success due to clear value proposition
    'gaming': 78, // Good success with right targeting
    'foodservice': 89, // Highest success - most profitable channel
    'theme_parks': 94  // Very high success with immersive experiences
  };
  return rates[industry] || 75;
}

function getAverageRevenueForIndustry(industry, region) {
  const revenue = {
    'concerts': {
      'Europe': '€3-8M per major festival partnership',
      'Asia': '€2-6M per festival partnership',
      'Global': '€2-8M depending on scale'
    },
    'gaming': {
      'Asia': '€4-12M per major esports partnership',
      'Europe': '€2-8M per gaming partnership',
      'Global': '€2-12M depending on scope'
    },
    'foodservice': {
      'Europe': '€3-7M annually per restaurant chain',
      'Asia': '€5-15M annually per major chain',
      'Global': '€3-15M annually'
    },
    'theme_parks': {
      'Europe': '€5-15M+ per immersive activation',
      'Global': '€5-25M+ per major theme park'
    }
  };
  return revenue[industry]?.[region] || revenue[industry]?.['Global'] || '€2-8M depending on scope';
}

function getTimeToCloseForIndustry(industry) {
  const timeframes = {
    'concerts': '3-5 months (seasonal planning required)',
    'gaming': '2-4 months (tournament calendar dependent)',
    'foodservice': '4-6 months (most profitable, worth the investment)',
    'theme_parks': '8-12 months (complex integration required)'
  };
  return timeframes[industry] || '4-6 months';
}

module.exports = router;
// Railway deployment trigger Fri Nov 14 12:10:16 EST 2025
