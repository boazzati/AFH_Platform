import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  Groups,
  Star,
  Phone,
  Email,
  LinkedIn,
  Business,
  Restaurant,
  Store,
  School
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { pepsicoBrandColors } from '../theme/pepsico-theme';

// PepsiCo Success Tracking - Analytics + Benchmarking + Expert Network
const SuccessTracking = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Success Metrics Data
  const smilesDeliveredData = [
    { month: 'Jan', smiles: 2400000, revenue: 12.4 },
    { month: 'Feb', smiles: 2800000, revenue: 14.2 },
    { month: 'Mar', smiles: 3200000, revenue: 16.8 },
    { month: 'Apr', smiles: 3600000, revenue: 18.9 },
    { month: 'May', smiles: 4100000, revenue: 21.3 },
    { month: 'Jun', smiles: 4500000, revenue: 23.7 }
  ];

  const channelPerformanceData = [
    { channel: 'Theme Parks', value: 35, color: pepsicoBrandColors.secondary.orange },
    { channel: 'Concerts', value: 28, color: pepsicoBrandColors.primary.blue },
    { channel: 'Gaming', value: 20, color: pepsicoBrandColors.secondary.green },
    { channel: 'Cinema', value: 12, color: pepsicoBrandColors.primary.red },
    { channel: 'Petrol Retail', value: 5, color: pepsicoBrandColors.primary.navy }
  ];

  const brandPerformanceData = [
    { brand: 'Gatorade', growth: 24, partnerships: 156 },
    { brand: 'Lay\'s', growth: 18, partnerships: 203 },
    { brand: 'Pepsi', growth: 15, partnerships: 189 },
    { brand: 'Quaker', growth: 32, partnerships: 87 },
    { brand: 'Doritos', growth: 21, partnerships: 134 }
  ];

  // Key Performance Indicators
  const kpis = [
    {
      title: 'Total Smiles Delivered',
      value: '4.5M',
      change: '+23.7%',
      trend: 'up',
      description: 'Monthly consumer interactions across AFH channels'
    },
    {
      title: 'Active Partnerships',
      value: '769',
      change: '+15.2%',
      trend: 'up',
      description: 'Live partnerships generating revenue'
    },
    {
      title: 'Portfolio Growth',
      value: '$23.7M',
      change: '+18.9%',
      trend: 'up',
      description: 'Monthly AFH revenue across all channels'
    },
    {
      title: 'Category Leadership',
      value: '67%',
      change: '+5.3%',
      trend: 'up',
      description: 'Market share in key AFH categories'
    }
  ];

  // Expert Network
  const categoryExperts = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'C-Store Category Director',
      company: 'Metro Convenience Group',
      expertise: 'Convenience Store Operations',
      rating: 4.9,
      partnerships: 23,
      avatar: '/api/placeholder/40/40',
      specialties: ['Premium Placement', 'Consumer Analytics', 'Promotional Strategy'],
      recentSuccess: 'Secured 15% shelf space increase for Gatorade across 200+ locations'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Foodservice Innovation Lead',
      company: 'Campus Dining Solutions',
      expertise: 'University Partnerships',
      rating: 4.8,
      partnerships: 18,
      avatar: '/api/placeholder/40/40',
      specialties: ['Menu Integration', 'Student Engagement', 'Sustainability'],
      recentSuccess: 'Launched Quaker breakfast program across 12 major universities'
    },
    {
      id: 3,
      name: 'Jennifer Park',
      title: 'Corporate Wellness Strategist',
      company: 'Workplace Solutions Inc.',
      expertise: 'Corporate Partnerships',
      rating: 4.9,
      partnerships: 31,
      avatar: '/api/placeholder/40/40',
      specialties: ['Employee Wellness', 'Vending Innovation', 'ROI Analysis'],
      recentSuccess: 'Implemented wellness vending in 50+ tech companies'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Fast-Casual Development Manager',
      company: 'Restaurant Growth Partners',
      expertise: 'Restaurant Partnerships',
      rating: 4.7,
      partnerships: 27,
      avatar: '/api/placeholder/40/40',
      specialties: ['Menu Innovation', 'Brand Integration', 'Digital Ordering'],
      recentSuccess: 'Exclusive Pepsi partnership with 3 major fast-casual chains'
    }
  ];

  // Competitive Benchmarking
  const competitiveBenchmarks = [
    {
      metric: 'C-Store Market Share',
      pepsico: 34,
      competitor1: 28,
      competitor2: 22,
      category: 'Beverages'
    },
    {
      metric: 'University Partnerships',
      pepsico: 67,
      competitor1: 45,
      competitor2: 38,
      category: 'Education'
    },
    {
      metric: 'Workplace Penetration',
      pepsico: 23,
      competitor1: 31,
      competitor2: 19,
      category: 'Corporate'
    },
    {
      metric: 'Innovation Score',
      pepsico: 89,
      competitor1: 76,
      competitor2: 71,
      category: 'Overall'
    }
  ];

  const KPICard = ({ kpi }) => (
    <Card sx={{ height: '100%', textAlign: 'center' }}>
      <CardContent sx={{ p: 3 }}>
        <EmojiEvents sx={{ 
          fontSize: 40,
          color: pepsicoBrandColors.secondary.orange,
          mb: 1
        }} />
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          color: pepsicoBrandColors.primary.navy,
          mb: 0.5
        }}>
          {kpi.value}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {kpi.title}
        </Typography>
        <Chip 
          label={kpi.change}
          size="small"
          sx={{ 
            bgcolor: `${pepsicoBrandColors.secondary.green}20`,
            color: pepsicoBrandColors.secondary.green,
            fontWeight: 600,
            mb: 1
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {kpi.description}
        </Typography>
      </CardContent>
    </Card>
  );

  const ExpertCard = ({ expert }) => (
    <Card sx={{ 
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0, 51, 102, 0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar 
            src={expert.avatar}
            sx={{ 
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: pepsicoBrandColors.primary.navy
            }}
          >
            {expert.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {expert.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {expert.title}
            </Typography>
            <Typography variant="body2" fontWeight={500} color="primary">
              {expert.company}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Star sx={{ fontSize: 16, color: pepsicoBrandColors.secondary.orange, mr: 0.5 }} />
              <Typography variant="body2" fontWeight={600}>
                {expert.rating}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {expert.partnerships} partnerships
            </Typography>
          </Box>
        </Box>

        <Chip 
          label={expert.expertise}
          size="small"
          sx={{ 
            bgcolor: `${pepsicoBrandColors.secondary.green}20`,
            color: pepsicoBrandColors.secondary.green,
            fontWeight: 500,
            mb: 2
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Specialties:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {expert.specialties.map((specialty, index) => (
              <Chip 
                key={index}
                label={specialty}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>

        <Paper sx={{ p: 2, bgcolor: pepsicoBrandColors.neutral.lightGray, mb: 2 }}>
          <Typography variant="caption" fontWeight={500} color="text.secondary">
            Recent Success:
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {expert.recentSuccess}
          </Typography>
        </Paper>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Button size="small" startIcon={<Phone />} fullWidth variant="outlined">
              Call
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button size="small" startIcon={<Email />} fullWidth variant="outlined">
              Email
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button size="small" startIcon={<LinkedIn />} fullWidth variant="outlined">
              Connect
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const BenchmarkCard = ({ benchmark }) => (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          {benchmark.metric}
        </Typography>
        <Chip 
          label={benchmark.category}
          size="small"
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">PepsiCo</Typography>
            <Typography variant="body2" fontWeight={600}>{benchmark.pepsico}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={benchmark.pepsico} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              bgcolor: `${pepsicoBrandColors.primary.navy}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: pepsicoBrandColors.primary.navy,
                borderRadius: 4,
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Competitor A</Typography>
            <Typography variant="body2">{benchmark.competitor1}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={benchmark.competitor1} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: `${pepsicoBrandColors.neutral.mediumGray}`,
              '& .MuiLinearProgress-bar': {
                bgcolor: pepsicoBrandColors.neutral.darkGray,
                borderRadius: 3,
              }
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Competitor B</Typography>
            <Typography variant="body2">{benchmark.competitor2}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={benchmark.competitor2} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: `${pepsicoBrandColors.neutral.mediumGray}`,
              '& .MuiLinearProgress-bar': {
                bgcolor: pepsicoBrandColors.neutral.darkGray,
                borderRadius: 3,
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: pepsicoBrandColors.primary.navy,
          mb: 1
        }}>
          Deliver Smiles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track partnership success, benchmark performance, and leverage expert insights
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              color: `${pepsicoBrandColors.primary.navy} !important`,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: pepsicoBrandColors.primary.navy,
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="Success Metrics" />
          <Tab label="Category Experts" />
          <Tab label="Competitive Edge" />
        </Tabs>
      </Box>

      {/* Success Metrics Tab */}
      {selectedTab === 0 && (
        <Box>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {kpis.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <KPICard kpi={kpi} />
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Smiles Delivered Over Time
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={smilesDeliveredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="smiles" 
                        stroke={pepsicoBrandColors.primary.navy}
                        fill={`${pepsicoBrandColors.primary.navy}20`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Channel Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={channelPerformanceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ channel, value }) => `${channel}: ${value}%`}
                        labelLine={false}
                      >
                        {channelPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Brand Performance Growth
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={brandPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="brand" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="growth" fill={pepsicoBrandColors.secondary.orange} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Category Experts Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {categoryExperts.map((expert) => (
            <Grid item xs={12} md={6} key={expert.id}>
              <ExpertCard expert={expert} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Competitive Edge Tab */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {competitiveBenchmarks.map((benchmark, index) => (
            <Grid item xs={12} md={6} key={index}>
              <BenchmarkCard benchmark={benchmark} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SuccessTracking;
