// PepsiCo AFH Platform Demo Data
// Realistic data for PepsiCo Away-From-Home business demonstrations

export const pepsicoBrands = {
  beverages: [
    { name: 'Pepsi', category: 'Cola', healthScore: 3 },
    { name: 'Pepsi Zero Sugar', category: 'Cola', healthScore: 4 },
    { name: 'Mountain Dew', category: 'Citrus', healthScore: 2 },
    { name: 'Gatorade', category: 'Sports Drink', healthScore: 4 },
    { name: 'Gatorade Zero', category: 'Sports Drink', healthScore: 5 },
    { name: 'Aquafina', category: 'Water', healthScore: 5 },
    { name: 'Tropicana', category: 'Juice', healthScore: 4 },
    { name: 'Lipton', category: 'Tea', healthScore: 4 },
    { name: 'Starbucks Ready-to-Drink', category: 'Coffee', healthScore: 3 }
  ],
  snacks: [
    { name: 'Lay\'s Classic', category: 'Potato Chips', healthScore: 2 },
    { name: 'Lay\'s Baked', category: 'Potato Chips', healthScore: 3 },
    { name: 'Doritos', category: 'Tortilla Chips', healthScore: 2 },
    { name: 'Cheetos', category: 'Cheese Snacks', healthScore: 2 },
    { name: 'Tostitos', category: 'Tortilla Chips', healthScore: 3 },
    { name: 'Ruffles', category: 'Potato Chips', healthScore: 2 },
    { name: 'SunChips', category: 'Multigrain', healthScore: 4 },
    { name: 'PopCorners', category: 'Popped Corn', healthScore: 4 },
    { name: 'Smartfood', category: 'Popcorn', healthScore: 3 }
  ],
  nutrition: [
    { name: 'Quaker Oats', category: 'Breakfast', healthScore: 5 },
    { name: 'Quaker Granola Bars', category: 'Bars', healthScore: 4 },
    { name: 'Bare Snacks', category: 'Fruit Chips', healthScore: 5 },
    { name: 'Health Warrior', category: 'Protein Bars', healthScore: 5 },
    { name: 'Simply', category: 'Natural Snacks', healthScore: 4 }
  ]
};

export const afhChannels = {
  convenience: {
    name: 'Convenience Stores',
    description: 'High-traffic c-stores and gas stations',
    marketSize: '$45.2B',
    growth: '+12.4%',
    keyPlayers: ['7-Eleven', 'Circle K', 'Wawa', 'Sheetz', 'Casey\'s'],
    opportunities: [
      'Premium placement programs',
      'Exclusive flavor launches',
      'Digital loyalty integration',
      'Healthy option expansion'
    ]
  },
  foodservice: {
    name: 'Foodservice',
    description: 'Restaurants, fast-casual, and QSR chains',
    marketSize: '$78.9B',
    growth: '+8.7%',
    keyPlayers: ['McDonald\'s', 'Subway', 'Starbucks', 'Chipotle', 'Taco Bell'],
    opportunities: [
      'Menu integration partnerships',
      'Co-branded promotions',
      'Limited-time offerings',
      'Beverage fountain programs'
    ]
  },
  education: {
    name: 'Education',
    description: 'K-12 schools, universities, and campus dining',
    marketSize: '$23.1B',
    growth: '+15.3%',
    keyPlayers: ['Aramark', 'Sodexo', 'Compass Group', 'Chartwells'],
    opportunities: [
      'Wellness program integration',
      'Student engagement campaigns',
      'Sustainability initiatives',
      'Grab-and-go solutions'
    ]
  },
  workplace: {
    name: 'Workplace',
    description: 'Corporate offices, micro-markets, and vending',
    marketSize: '$18.7B',
    growth: '+22.1%',
    keyPlayers: ['Canteen', 'Aramark', 'Compass Group', 'Sodexo'],
    opportunities: [
      'Employee wellness programs',
      'Smart vending solutions',
      'Productivity-focused nutrition',
      'Flexible payment systems'
    ]
  },
  healthcare: {
    name: 'Healthcare',
    description: 'Hospitals, clinics, and medical facilities',
    marketSize: '$12.4B',
    growth: '+18.9%',
    keyPlayers: ['Morrison Healthcare', 'Aramark Healthcare', 'Sodexo Healthcare'],
    opportunities: [
      'Nutritional compliance programs',
      'Staff wellness initiatives',
      'Patient satisfaction improvements',
      'Healthy vending options'
    ]
  }
};

export const competitorData = {
  'Coca-Cola': {
    marketShare: 28.4,
    strengths: ['Brand recognition', 'Distribution network', 'Marketing spend'],
    weaknesses: ['Limited healthy options', 'Slower innovation'],
    recentMoves: ['Zero Sugar expansion', 'Costa Coffee acquisition']
  },
  'Mondelez': {
    marketShare: 15.7,
    strengths: ['Snack portfolio', 'Global reach', 'Innovation pipeline'],
    weaknesses: ['Limited beverage presence', 'Health perception'],
    recentMoves: ['Wellness-focused acquisitions', 'Sustainable packaging']
  },
  'General Mills': {
    marketShare: 12.3,
    strengths: ['Breakfast category', 'Health positioning', 'Brand trust'],
    weaknesses: ['Limited AFH presence', 'Slower growth'],
    recentMoves: ['Protein bar expansion', 'Plant-based initiatives']
  }
};

export const marketTrends = [
  {
    trend: 'Health & Wellness Focus',
    impact: 'High',
    timeline: 'Ongoing',
    description: 'Consumers increasingly seeking better-for-you options in AFH settings',
    pepsico_response: 'Expanding Quaker, Bare, and zero-sugar portfolios'
  },
  {
    trend: 'Digital Integration',
    impact: 'High',
    timeline: '2-3 years',
    description: 'Mobile ordering, contactless payments, and loyalty programs becoming standard',
    pepsico_response: 'Investing in digital vending and app-based ordering'
  },
  {
    trend: 'Sustainability Demands',
    impact: 'Medium',
    timeline: '3-5 years',
    description: 'Packaging sustainability and carbon footprint reduction priorities',
    pepsico_response: 'pep+ sustainability agenda and packaging innovations'
  },
  {
    trend: 'Convenience Premium',
    impact: 'Medium',
    timeline: 'Ongoing',
    description: 'Consumers willing to pay premium for convenience and quality',
    pepsico_response: 'Premium placement strategies and exclusive partnerships'
  },
  {
    trend: 'Workplace Evolution',
    impact: 'High',
    timeline: '1-2 years',
    description: 'Hybrid work models changing office food and beverage needs',
    pepsico_response: 'Flexible vending solutions and grab-and-go formats'
  }
];

export const partnershipOpportunities = [
  {
    id: 1,
    partner: 'Metro Convenience Group',
    type: 'C-Store Chain',
    locations: 245,
    region: 'Northeast',
    potential: '$2.4M',
    confidence: 92,
    timeline: '3-6 months',
    status: 'Negotiation',
    keyContact: 'Sarah Chen, Category Director',
    brands: ['Gatorade', 'Lay\'s Baked', 'Pepsi Zero'],
    strategy: 'Premium placement with health-focused positioning'
  },
  {
    id: 2,
    partner: 'Campus Dining Solutions',
    type: 'University Foodservice',
    locations: 18,
    region: 'West Coast',
    potential: '$1.8M',
    confidence: 87,
    timeline: '6-12 months',
    status: 'Proposal',
    keyContact: 'Marcus Rodriguez, Innovation Lead',
    brands: ['Quaker', 'Bare Snacks', 'Tropicana'],
    strategy: 'Wellness program integration with sustainability focus'
  },
  {
    id: 3,
    partner: 'TechCorp Workplace Solutions',
    type: 'Corporate Vending',
    locations: 67,
    region: 'Silicon Valley',
    potential: '$3.1M',
    confidence: 89,
    timeline: '2-4 months',
    status: 'Pilot',
    keyContact: 'Jennifer Park, Wellness Strategist',
    brands: ['Gatorade Zero', 'PopCorners', 'Aquafina'],
    strategy: 'Employee wellness with smart vending technology'
  },
  {
    id: 4,
    partner: 'Fast-Casual Restaurant Group',
    type: 'Restaurant Chain',
    locations: 156,
    region: 'National',
    potential: '$4.2M',
    confidence: 94,
    timeline: '1-3 months',
    status: 'Contract Review',
    keyContact: 'David Kim, Development Manager',
    brands: ['Mountain Dew', 'Doritos', 'Cheetos'],
    strategy: 'Exclusive beverage partnership with co-branded promotions'
  }
];

export const successMetrics = {
  smilesDelivered: {
    current: 4500000,
    target: 5000000,
    growth: 23.7,
    description: 'Monthly consumer interactions across AFH channels'
  },
  activePartnerships: {
    current: 769,
    target: 850,
    growth: 15.2,
    description: 'Live partnerships generating revenue'
  },
  portfolioRevenue: {
    current: 23.7, // millions
    target: 28.0,
    growth: 18.9,
    description: 'Monthly AFH revenue across all channels'
  },
  marketShare: {
    current: 67,
    target: 70,
    growth: 5.3,
    description: 'Market share in key AFH categories'
  }
};

export const categoryExperts = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'C-Store Category Director',
    company: 'Metro Convenience Group',
    expertise: 'Convenience Store Operations',
    rating: 4.9,
    partnerships: 23,
    specialties: ['Premium Placement', 'Consumer Analytics', 'Promotional Strategy'],
    recentSuccess: 'Secured 15% shelf space increase for Gatorade across 200+ locations',
    contact: {
      email: 'sarah.chen@metroconvenience.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/sarahchen-retail'
    }
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    title: 'Foodservice Innovation Lead',
    company: 'Campus Dining Solutions',
    expertise: 'University Partnerships',
    rating: 4.8,
    partnerships: 18,
    specialties: ['Menu Integration', 'Student Engagement', 'Sustainability'],
    recentSuccess: 'Launched Quaker breakfast program across 12 major universities',
    contact: {
      email: 'marcus.rodriguez@campusdining.com',
      phone: '+1 (555) 234-5678',
      linkedin: 'linkedin.com/in/marcusrodriguez-foodservice'
    }
  },
  {
    id: 3,
    name: 'Jennifer Park',
    title: 'Corporate Wellness Strategist',
    company: 'Workplace Solutions Inc.',
    expertise: 'Corporate Partnerships',
    rating: 4.9,
    partnerships: 31,
    specialties: ['Employee Wellness', 'Vending Innovation', 'ROI Analysis'],
    recentSuccess: 'Implemented wellness vending in 50+ tech companies',
    contact: {
      email: 'jennifer.park@workplacesolutions.com',
      phone: '+1 (555) 345-6789',
      linkedin: 'linkedin.com/in/jenniferpark-wellness'
    }
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Fast-Casual Development Manager',
    company: 'Restaurant Growth Partners',
    expertise: 'Restaurant Partnerships',
    rating: 4.7,
    partnerships: 27,
    specialties: ['Menu Innovation', 'Brand Integration', 'Digital Ordering'],
    recentSuccess: 'Exclusive Pepsi partnership with 3 major fast-casual chains',
    contact: {
      email: 'david.kim@restaurantgrowth.com',
      phone: '+1 (555) 456-7890',
      linkedin: 'linkedin.com/in/davidkim-restaurants'
    }
  }
];

export const recentActivities = [
  {
    id: 1,
    type: 'deal_closed',
    title: 'Metro Convenience Chain - Deal Closed',
    description: '$1.2M annual partnership secured for Gatorade and Lay\'s placement',
    timestamp: '2 hours ago',
    value: '$1.2M',
    impact: 'high'
  },
  {
    id: 2,
    type: 'meeting_scheduled',
    title: 'University of California - Meeting Scheduled',
    description: 'Campus dining partnership discussion set for next Tuesday',
    timestamp: '5 hours ago',
    value: '12 campuses',
    impact: 'medium'
  },
  {
    id: 3,
    type: 'proposal_sent',
    title: 'Tech Corp Wellness - Proposal Sent',
    description: 'Comprehensive wellness program proposal delivered to decision makers',
    timestamp: '1 day ago',
    value: '50 locations',
    impact: 'medium'
  },
  {
    id: 4,
    type: 'pilot_launched',
    title: 'Smart Vending Pilot - Launched',
    description: 'AI-powered vending machines deployed in 5 corporate locations',
    timestamp: '2 days ago',
    value: '5 pilots',
    impact: 'low'
  },
  {
    id: 5,
    type: 'contract_signed',
    title: 'Regional University Network - Contract Signed',
    description: 'Quaker breakfast program expansion across 8 campuses approved',
    timestamp: '3 days ago',
    value: '$850K',
    impact: 'high'
  }
];

export const aiInsights = [
  {
    type: 'opportunity',
    title: 'Premium C-Store Expansion Window',
    description: 'Market analysis shows 34% growth in better-for-you snacks at premium convenience stores. Recommend accelerating Lay\'s Baked and PopCorners placement.',
    confidence: 89,
    action: 'Schedule meetings with top 3 premium c-store chains',
    timeline: '2-4 weeks'
  },
  {
    type: 'trend',
    title: 'Workplace Wellness Surge',
    description: 'Corporate wellness spending up 45% post-pandemic. Gatorade Zero and healthy snack combinations showing strong ROI in pilot programs.',
    confidence: 92,
    action: 'Expand workplace wellness partnerships',
    timeline: '1-3 months'
  },
  {
    type: 'competitive',
    title: 'Competitor Gap in Education',
    description: 'Coca-Cola reducing university presence due to health concerns. Opportunity to position Quaker and Tropicana as wellness-focused alternatives.',
    confidence: 87,
    action: 'Target top 20 universities with health-focused proposals',
    timeline: '3-6 months'
  },
  {
    type: 'innovation',
    title: 'Digital Vending Acceleration',
    description: 'Contactless payment adoption at 78% in target markets. Smart vending with mobile integration showing 23% higher sales per machine.',
    confidence: 94,
    action: 'Prioritize digital vending partnerships',
    timeline: '1-2 months'
  }
];

export default {
  pepsicoBrands,
  afhChannels,
  competitorData,
  marketTrends,
  partnershipOpportunities,
  successMetrics,
  categoryExperts,
  recentActivities,
  aiInsights
};
