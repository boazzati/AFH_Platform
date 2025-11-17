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
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  LocationOn,
  Movie,
  MusicNote,
  Checkroom,
  Attractions,
  LocalGasStation,
  SportsEsports,
  Restaurant,
  Insights,
  AutoAwesome,
  Launch,
  Public,
  Timeline
} from '@mui/icons-material';
import { pepsicoBrandColors } from '../theme/pepsico-theme';

// PepsiCo AFH Growth Opportunities - EMEA & Asia Focus
const GrowthOpportunities = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('EMEA');

  // AFH Sub-channels based on PepsiCo strategy documents
  const afhSubChannels = [
    {
      id: 'cinema',
      title: 'Cinema & Entertainment',
      icon: <Movie />,
      color: pepsicoBrandColors.secondary.red,
      description: 'Movie theaters, entertainment complexes, and cinema chains',
      opportunities: {
        EMEA: {
          count: 47,
          potential: '€12.8M',
          confidence: 91,
          keyMarkets: ['UK', 'Germany', 'France', 'Netherlands'],
          topBrands: ['Pepsi Max', 'Lay\'s', 'Doritos'],
          insights: [
            'Premium experience demand in European cinemas',
            'Exclusive beverage partnerships with major chains',
            'Co-branded movie promotions opportunity'
          ]
        },
        Asia: {
          count: 73,
          potential: '€18.4M',
          confidence: 88,
          keyMarkets: ['Japan', 'South Korea', 'Singapore', 'Thailand'],
          topBrands: ['Pepsi', 'Lay\'s Max', 'Cheetos'],
          insights: [
            'Rapid cinema expansion in Southeast Asia',
            'Premium snacking culture growth',
            'Digital integration opportunities'
          ]
        }
      }
    },
    {
      id: 'concerts',
      title: 'Concerts & Festivals',
      icon: <MusicNote />,
      color: pepsicoBrandColors.secondary.orange,
      description: 'Music festivals, concert venues, and live entertainment',
      opportunities: {
        EMEA: {
          count: 34,
          potential: '€15.2M',
          confidence: 94,
          keyMarkets: ['Netherlands', 'Belgium', 'UK', 'Spain'],
          topBrands: ['Pepsi', 'Gatorade', 'Aquafina'],
          insights: [
            'Tomorrowland-style immersive experiences',
            'Sustainability focus in European festivals',
            'VIP hospitality partnership opportunities'
          ]
        },
        Asia: {
          count: 28,
          potential: '€9.7M',
          confidence: 85,
          keyMarkets: ['Japan', 'South Korea', 'Thailand', 'Philippines'],
          topBrands: ['Pepsi', 'Mountain Dew', 'Lay\'s'],
          insights: [
            'K-pop and J-pop festival partnerships',
            'Youth culture brand alignment',
            'Social media activation potential'
          ]
        }
      }
    },
    {
      id: 'fashion',
      title: 'Fashion & Retail',
      icon: <Checkroom />,
      color: pepsicoBrandColors.primary.blue,
      description: 'Fashion weeks, retail experiences, and lifestyle events',
      opportunities: {
        EMEA: {
          count: 22,
          potential: '€8.9M',
          confidence: 82,
          keyMarkets: ['Italy', 'France', 'UK', 'Germany'],
          topBrands: ['Pepsi Max', 'Lay\'s', 'Cheetos'],
          insights: [
            'Milan and Paris Fashion Week activations',
            'Luxury retail partnership potential',
            'Influencer collaboration opportunities'
          ]
        },
        Asia: {
          count: 31,
          potential: '€11.3M',
          confidence: 87,
          keyMarkets: ['Japan', 'South Korea', 'China', 'Singapore'],
          topBrands: ['Pepsi', 'Lay\'s', 'Doritos'],
          insights: [
            'Seoul Fashion Week growing influence',
            'Streetwear culture alignment',
            'Pop-up experience opportunities'
          ]
        }
      }
    },
    {
      id: 'theme_parks',
      title: 'Theme Parks & Attractions',
      icon: <Attractions />,
      color: pepsicoBrandColors.secondary.green,
      description: 'Theme parks, attractions, and family entertainment centers',
      opportunities: {
        EMEA: {
          count: 18,
          potential: '€21.5M',
          confidence: 96,
          keyMarkets: ['Germany', 'France', 'Netherlands', 'Denmark'],
          topBrands: ['Doritos', 'Cheetos', 'Pepsi'],
          insights: [
            'Europa-Park Doritos Loaded success model',
            'Immersive food experience demand',
            'Family-friendly brand activation'
          ]
        },
        Asia: {
          count: 25,
          potential: '€16.8M',
          confidence: 89,
          keyMarkets: ['Japan', 'Singapore', 'South Korea', 'China'],
          topBrands: ['Doritos', 'Lay\'s', 'Pepsi'],
          insights: [
            'Disney partnership expansion potential',
            'Universal Studios collaboration opportunities',
            'Cultural theming integration'
          ]
        }
      }
    },
    {
      id: 'petrol_retail',
      title: 'Petrol Retail & Convenience',
      icon: <LocalGasStation />,
      color: pepsicoBrandColors.primary.navy,
      description: 'Petrol stations, highway services, and travel convenience',
      opportunities: {
        EMEA: {
          count: 156,
          potential: '€24.7M',
          confidence: 93,
          keyMarkets: ['Germany', 'UK', 'France', 'Netherlands'],
          topBrands: ['Pepsi', 'Lay\'s', 'Gatorade'],
          insights: [
            'Highway travel recovery post-pandemic',
            'Premium fuel station experiences',
            'Electric vehicle charging integration'
          ]
        },
        Asia: {
          count: 89,
          potential: '€14.2M',
          confidence: 86,
          keyMarkets: ['Japan', 'South Korea', 'Thailand', 'Malaysia'],
          topBrands: ['Pepsi', 'Lay\'s', 'Aquafina'],
          insights: [
            'Convenience culture in Asian markets',
            'Digital payment integration',
            'Local flavor preferences'
          ]
        }
      }
    },
    {
      id: 'gaming_esports',
      title: 'Gaming & Esports',
      icon: <SportsEsports />,
      color: pepsicoBrandColors.secondary.red,
      description: 'Esports venues, gaming cafes, and competitive gaming events',
      opportunities: {
        EMEA: {
          count: 42,
          potential: '€13.6M',
          confidence: 90,
          keyMarkets: ['Germany', 'UK', 'France', 'Sweden'],
          topBrands: ['Mountain Dew', 'Doritos', 'Pepsi Max'],
          insights: [
            'T1 Esports partnership model expansion',
            'Gaming cafe culture growth',
            'Streaming platform integrations'
          ]
        },
        Asia: {
          count: 67,
          potential: '€19.8M',
          confidence: 92,
          keyMarkets: ['South Korea', 'Japan', 'China', 'Philippines'],
          topBrands: ['Mountain Dew', 'Doritos', 'Lay\'s'],
          insights: [
            'Esports capital of the world',
            'PC bang culture integration',
            'Mobile gaming tournament opportunities'
          ]
        }
      }
    }
  ];

  const regions = ['EMEA', 'Asia'];

  const getChannelData = (channel) => {
    return channel.opportunities[selectedRegion];
  };

  const getTotalOpportunities = () => {
    return afhSubChannels.reduce((total, channel) => {
      return total + getChannelData(channel).count;
    }, 0);
  };

  const getTotalPotential = () => {
    return afhSubChannels.reduce((total, channel) => {
      const potential = getChannelData(channel).potential;
      const value = parseFloat(potential.replace('€', '').replace('M', ''));
      return total + value;
    }, 0);
  };

  const handleExploreOpportunities = (channel) => {
    // Navigate to detailed opportunity analysis
    console.log(`Exploring opportunities for ${channel.title}`);
    // In a real app, this would navigate to a detailed view or open a modal
    alert(`Exploring ${channel.title} opportunities in ${selectedRegion}. This would open detailed analysis in a production app.`);
  };

  const ChannelCard = ({ channel }) => {
    const data = getChannelData(channel);
    
    return (
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        minHeight: '500px',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 51, 102, 0.15)',
        }
      }}>
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: `${channel.color}20`,
              color: channel.color,
              width: 48,
              height: 48,
              mr: 2
            }}>
              {channel.icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {channel.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {channel.description}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight={700} color={channel.color}>
                {data.count}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Opportunities
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight={600}>
                {data.potential}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Revenue Potential
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {data.confidence}%
                </Typography>
                <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Confidence
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Key Markets:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {data.keyMarkets.map((market) => (
              <Chip 
                key={market}
                label={market}
                size="small"
                sx={{ 
                  bgcolor: `${channel.color}10`,
                  color: channel.color,
                  fontWeight: 500
                }}
              />
            ))}
          </Box>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Top Brands:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {data.topBrands.map((brand) => (
              <Chip 
                key={brand}
                label={brand}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: channel.color,
                  color: channel.color
                }}
              />
            ))}
          </Box>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Key Insights:
          </Typography>
          <Box sx={{ pl: 1 }}>
            {data.insights.map((insight, index) => (
              <Typography 
                key={index}
                variant="body2" 
                sx={{ 
                  mb: 0.5,
                  color: 'text.secondary',
                  '&:before': {
                    content: '"•"',
                    color: channel.color,
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '1em',
                    marginLeft: '-1em'
                  }
                }}
              >
                {insight}
              </Typography>
            ))}
          </Box>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleExploreOpportunities(channel)}
              sx={{ 
                background: `linear-gradient(135deg, ${channel.color} 0%, ${channel.color}CC 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${channel.color}DD 0%, ${channel.color}AA 100%)`,
                }
              }}
              startIcon={<Launch />}
            >
              Explore Opportunities
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
          Discover Growth
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          AFH sub-channel opportunities across EMEA and Asia markets
        </Typography>

        {/* Region Selector */}
        <Paper sx={{ p: 1, display: 'inline-block', mb: 3 }}>
          <Tabs 
            value={regions.indexOf(selectedRegion)} 
            onChange={(e, newValue) => setSelectedRegion(regions[newValue])}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 120,
              },
              '& .Mui-selected': {
                color: `${pepsicoBrandColors.primary.navy} !important`,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: pepsicoBrandColors.primary.navy,
              },
            }}
          >
            {regions.map((region) => (
              <Tab 
                key={region}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public sx={{ fontSize: 18 }} />
                    {region}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" fontWeight={700}>
                  {getTotalOpportunities()}
                </Typography>
                <Typography variant="h6">
                  Total Opportunities in {selectedRegion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${pepsicoBrandColors.secondary.green} 0%, ${pepsicoBrandColors.secondary.green}CC 100%)`,
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" fontWeight={700}>
                  €{getTotalPotential().toFixed(1)}M
                </Typography>
                <Typography variant="h6">
                  Revenue Potential
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${pepsicoBrandColors.secondary.orange} 0%, ${pepsicoBrandColors.secondary.orange}CC 100%)`,
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" fontWeight={700}>
                  6
                </Typography>
                <Typography variant="h6">
                  AFH Sub-Channels
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* AFH Sub-Channels Grid */}
      <Grid container spacing={3}>
        {afhSubChannels.map((channel) => (
          <Grid item xs={12} md={6} lg={4} key={channel.id}>
            <ChannelCard channel={channel} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GrowthOpportunities;
