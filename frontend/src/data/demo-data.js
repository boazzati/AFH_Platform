// Partnership Accelerator - EMEAA Demo Data
// White-label experiential partnership platform for Europe, Middle East, Asia, Africa

// Generic brand portfolio (white-label ready)
export const brandPortfolio = {
  beverages: ['Premium Cola', 'Sports Hydration', 'Energy Plus', 'Natural Water'],
  snacks: ['Classic Chips', 'Protein Bars', 'Nuts & Seeds', 'Fruit Crisps'],
  breakfast: ['Breakfast Oats', 'Granola Mix', 'Morning Bars', 'Cereal Plus'],
  wellness: ['Wellness Shots', 'Vitamin Water', 'Recovery Drink', 'Immunity Plus']
};

// EMEAA Experiential Partnership Channels
export const experientialChannels = [
  {
    id: 'theme_parks',
    name: 'Theme Parks & Entertainment',
    icon: '🎢',
    performance: 96,
    growth: '+15.8%',
    description: 'Europa-Park & Disneyland Paris partnerships',
    revenue: '€7.2M',
    locations: 12,
    confidence: 95,
    region: 'Europe',
    currency: 'EUR'
  },
  {
    id: 'music_festivals',
    name: 'Concerts & Music Festivals',
    icon: '🎵',
    performance: 91,
    growth: '+22.4%',
    description: 'Afronation & Nyege Nyege festival activations',
    revenue: 'R 45M',
    locations: 200,
    confidence: 89,
    region: 'Africa',
    currency: 'ZAR'
  },
  {
    id: 'gaming_esports',
    name: 'Gaming & Esports',
    icon: '🎮',
    performance: 88,
    growth: '+45.6%',
    description: 'T1 & Gen.G gaming fuel positioning',
    revenue: '¥890M',
    locations: 50,
    confidence: 91,
    region: 'Asia',
    currency: 'JPY'
  },
  {
    id: 'middle_east_entertainment',
    name: 'Middle East Entertainment',
    icon: '🏰',
    performance: 93,
    growth: '+18.2%',
    description: 'Dubai Parks & Resorts integration',
    revenue: 'AED 28M',
    locations: 8,
    confidence: 93,
    region: 'Middle East',
    currency: 'AED'
  }
];

// Partnership Accelerator Success Metrics
export const successMetrics = {
  experiencesDelivered: {
    current: 6200000, // 6.2M
    growth: 31.2,
    description: 'Monthly consumer experiences across all partnership channels',
    trend: 'up',
    currency: null
  },
  activePartnerships: {
    current: 1247,
    growth: 18.9,
    description: 'Active experiential partnerships across EMEAA',
    trend: 'up'
  },
  portfolioRevenue: {
    current: 42800000, // €42.8M
    growth: 24.7,
    description: 'Total partnership portfolio revenue',
    trend: 'up',
    currency: 'EUR'
  },
  growthOpportunities: {
    current: 32,
    growth: 12,
    description: 'New experiential partnership opportunities identified',
    trend: 'up'
  }
};

// EMEAA Growth Opportunities
export const growthOpportunities = [
  {
    id: 1,
    title: 'European Theme Park Alliance',
    description: 'Comprehensive partnership across Europa-Park, Disneyland Paris, and PortAventura',
    potential: '€7.2M',
    confidence: 95,
    timeline: '3-6 months',
    region: 'Europe',
    channel: 'Theme Parks',
    status: 'negotiation'
  },
  {
    id: 2,
    title: 'African Music Festival Network',
    description: 'Pan-African music festival partnerships including Afronation and Nyege Nyege',
    potential: 'R 45M',
    confidence: 89,
    timeline: '2-4 months',
    region: 'Africa',
    channel: 'Music Festivals',
    status: 'proposal'
  },
  {
    id: 3,
    title: 'Asian Gaming & Esports Expansion',
    description: 'Strategic partnerships with T1, Gen.G, and major gaming venues across Korea, Japan, China',
    potential: '¥890M',
    confidence: 91,
    timeline: '4-8 months',
    region: 'Asia',
    channel: 'Gaming & Esports',
    status: 'discovery'
  },
  {
    id: 4,
    title: 'Middle East Entertainment Hubs',
    description: 'Dubai Parks & Resorts, IMG Worlds of Adventure comprehensive integration',
    potential: 'AED 28M',
    confidence: 93,
    timeline: '2-5 months',
    region: 'Middle East',
    channel: 'Entertainment',
    status: 'negotiation'
  }
];

// Recent Partnership Wins (EMEAA Focus)
export const recentActivities = [
  {
    id: 1,
    title: 'Europa-Park Partnership Secured',
    description: 'Exclusive beverage partnership for Germany\'s largest theme park',
    value: '€2.1M',
    timestamp: '2 hours ago',
    type: 'partnership',
    region: 'Europe',
    impact: 'High'
  },
  {
    id: 2,
    title: 'T1 Gaming Fuel Sponsorship',
    description: 'Official energy drink partner for T1 esports team across Asia',
    value: '¥180M',
    timestamp: '5 hours ago',
    type: 'sponsorship',
    region: 'Asia',
    impact: 'High'
  },
  {
    id: 3,
    title: 'Afronation Festival Activation',
    description: 'Exclusive beverage partner for Africa\'s biggest music festival',
    value: 'R 8.5M',
    timestamp: '1 day ago',
    type: 'activation',
    region: 'Africa',
    impact: 'Medium'
  }
];

export default {
  brandPortfolio,
  experientialChannels,
  successMetrics,
  growthOpportunities,
  recentActivities
};
