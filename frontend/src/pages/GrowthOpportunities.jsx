import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tab,
  Tabs,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  LocationOn,
  Restaurant,
  LocalCafe,
  Store,
  Business,
  Insights,
  AutoAwesome,
  Launch
} from '@mui/icons-material';
import { pepsicoBrandColors } from '../theme/pepsico-theme';

// PepsiCo AFH Growth Opportunities - Consolidated Market Intelligence
const GrowthOpportunities = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // PepsiCo-relevant market opportunities
  const growthOpportunities = [
    {
      id: 1,
      title: 'Premium C-Store Expansion',
      channel: 'Convenience Stores',
      location: 'Northeast Corridor',
      brands: ['Gatorade', 'Lay\'s', 'Pepsi'],
      potential: '$2.4M',
      confidence: 92,
      timeline: '3-6 months',
      icon: <Store />,
      description: 'High-traffic premium convenience stores showing 34% growth in better-for-you snacks',
      keyInsights: [
        'Health-conscious consumer shift',
        'Premium pricing acceptance',
        'Limited healthy options currently'
      ]
    },
    {
      id: 2,
      title: 'Campus Dining Innovation',
      channel: 'Education',
      location: 'Major Universities',
      brands: ['Quaker', 'Tropicana', 'Bare'],
      potential: '$1.8M',
      confidence: 87,
      timeline: '6-12 months',
      icon: <Business />,
      description: 'University dining halls seeking healthier breakfast and snack options',
      keyInsights: [
        'Gen Z health preferences',
        'Sustainability focus',
        'Grab-and-go demand'
      ]
    },
    {
      id: 3,
      title: 'Workplace Wellness Programs',
      channel: 'Corporate Offices',
      location: 'Tech Hubs',
      brands: ['Gatorade Zero', 'PopCorners', 'Aquafina'],
      potential: '$3.1M',
      confidence: 89,
      timeline: '2-4 months',
      icon: <Business />,
      description: 'Corporate wellness programs expanding to include healthier vending options',
      keyInsights: [
        'Employee wellness ROI',
        'Productivity correlation',
        'Premium willingness to pay'
      ]
    },
    {
      id: 4,
      title: 'Fast-Casual Restaurant Partnerships',
      channel: 'Foodservice',
      location: 'Urban Markets',
      brands: ['Mountain Dew', 'Doritos', 'Cheetos'],
      potential: '$4.2M',
      confidence: 94,
      timeline: '1-3 months',
      icon: <Restaurant />,
      description: 'Fast-casual chains looking for exclusive beverage and snack partnerships',
      keyInsights: [
        'Menu innovation demand',
        'Exclusive partnership value',
        'Cross-promotional opportunities'
      ]
    }
  ];

  const marketIntelligence = [
    {
      metric: 'AFH Market Growth',
      value: '+12.4%',
      trend: 'up',
      description: 'Year-over-year growth in away-from-home consumption'
    },
    {
      metric: 'Health-Conscious Shift',
      value: '+28%',
      trend: 'up',
      description: 'Increase in better-for-you product demand'
    },
    {
      metric: 'Digital Integration',
      value: '+45%',
      trend: 'up',
      description: 'Growth in app-based ordering and loyalty programs'
    },
    {
      metric: 'Sustainability Focus',
      value: '+67%',
      trend: 'up',
      description: 'Consumer preference for sustainable packaging'
    }
  ];

  const getChannelColor = (channel) => {
    const colors = {
      'Convenience Stores': pepsicoBrandColors.secondary.orange,
      'Education': pepsicoBrandColors.secondary.green,
      'Corporate Offices': pepsicoBrandColors.primary.blue,
      'Foodservice': pepsicoBrandColors.secondary.red,
    };
    return colors[channel] || pepsicoBrandColors.neutral.darkGray;
  };

  const OpportunityCard = ({ opportunity }) => (
    <Card sx={{ 
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(0, 51, 102, 0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: getChannelColor(opportunity.channel),
            mr: 2,
            width: 48,
            height: 48
          }}>
            {opportunity.icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {opportunity.title}
            </Typography>
            <Chip 
              label={opportunity.channel}
              size="small"
              sx={{ 
                bgcolor: `${getChannelColor(opportunity.channel)}20`,
                color: getChannelColor(opportunity.channel),
                fontWeight: 500
              }}
            />
          </Box>
          <Tooltip title="Launch Partnership Engine">
            <IconButton size="small" sx={{ color: pepsicoBrandColors.primary.navy }}>
              <Launch />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {opportunity.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Growth Potential
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary">
              {opportunity.potential}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={opportunity.confidence} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: `${pepsicoBrandColors.primary.navy}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: pepsicoBrandColors.primary.navy,
                borderRadius: 3,
              }
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            {opportunity.confidence}% confidence • {opportunity.timeline}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Key Brands:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {opportunity.brands.map((brand, index) => (
              <Chip 
                key={index}
                label={brand}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Key Insights:
          </Typography>
          {opportunity.keyInsights.map((insight, index) => (
            <Typography 
              key={index}
              variant="caption" 
              sx={{ 
                display: 'block',
                color: 'text.secondary',
                mb: 0.5,
                '&:before': {
                  content: '"•"',
                  color: pepsicoBrandColors.primary.navy,
                  fontWeight: 'bold',
                  mr: 1
                }
              }}
            >
              {insight}
            </Typography>
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AutoAwesome />}
          sx={{ 
            mt: 'auto',
            background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
          }}
        >
          Activate Partnership
        </Button>
      </CardContent>
    </Card>
  );

  const IntelligenceCard = ({ intel }) => (
    <Card sx={{ height: '100%', textAlign: 'center' }}>
      <CardContent sx={{ p: 3 }}>
        <TrendingUp sx={{ 
          fontSize: 40,
          color: pepsicoBrandColors.secondary.green,
          mb: 1
        }} />
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: pepsicoBrandColors.primary.navy,
          mb: 1
        }}>
          {intel.value}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {intel.metric}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {intel.description}
        </Typography>
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
          Discover Growth Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered market intelligence for PepsiCo's Away-From-Home expansion
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
          <Tab label="Growth Opportunities" />
          <Tab label="Market Intelligence" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {growthOpportunities.map((opportunity) => (
            <Grid item xs={12} md={6} key={opportunity.id}>
              <OpportunityCard opportunity={opportunity} />
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {marketIntelligence.map((intel, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <IntelligenceCard intel={intel} />
            </Grid>
          ))}
          
          {/* Additional Market Insights */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Market Trend Analysis
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <LocalCafe sx={{ fontSize: 48, color: pepsicoBrandColors.secondary.orange, mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>Coffee Shop Integration</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Premium beverage partnerships in specialty coffee chains
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Restaurant sx={{ fontSize: 48, color: pepsicoBrandColors.secondary.green, mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>Ghost Kitchen Growth</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivery-only restaurants creating new snack opportunities
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Insights sx={{ fontSize: 48, color: pepsicoBrandColors.primary.blue, mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>Data-Driven Decisions</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Real-time consumer behavior analytics driving placement
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default GrowthOpportunities;
