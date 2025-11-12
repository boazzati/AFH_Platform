import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Fade,
  Grow
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  Handshake,
  Insights,
  Launch,
  Refresh,
  PlayArrow,
  AutoAwesome,
  Business,
  Restaurant,
  Store,
  School
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { pepsicoBrandColors } from '../theme/pepsico-theme';
import { successMetrics, recentActivities, afhChannels } from '../data/pepsico-demo-data';
import { useNavigate } from 'react-router-dom';

// PepsiCo Growth Command Center - Hero Dashboard
const PepsiCoDashboard = () => {
  const navigate = useNavigate();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hero metric - Total Smiles Delivered (5-second wow factor)
  const heroMetric = {
    value: successMetrics.smilesDelivered.current,
    label: 'Smiles Delivered This Month',
    growth: `+${successMetrics.smilesDelivered.growth}%`,
    description: successMetrics.smilesDelivered.description
  };

  // Real-time growth data for animation
  const growthData = [
    { time: '6h ago', smiles: heroMetric.value * 0.93 },
    { time: '5h ago', smiles: heroMetric.value * 0.94 },
    { time: '4h ago', smiles: heroMetric.value * 0.96 },
    { time: '3h ago', smiles: heroMetric.value * 0.97 },
    { time: '2h ago', smiles: heroMetric.value * 0.98 },
    { time: '1h ago', smiles: heroMetric.value * 0.99 },
    { time: 'now', smiles: heroMetric.value }
  ];

  // Key performance indicators
  const kpis = [
    {
      title: 'Active Partnerships',
      value: successMetrics.activePartnerships.current,
      change: `+${successMetrics.activePartnerships.growth}%`,
      icon: <Handshake />,
      color: pepsicoBrandColors.secondary.orange,
      action: () => navigate('/partnership-engine')
    },
    {
      title: 'Growth Opportunities',
      value: 24,
      change: '+8 new',
      icon: <Insights />,
      color: pepsicoBrandColors.secondary.green,
      action: () => navigate('/growth-opportunities')
    },
    {
      title: 'Portfolio Revenue',
      value: `$${successMetrics.portfolioRevenue.current}M`,
      change: `+${successMetrics.portfolioRevenue.growth}%`,
      icon: <TrendingUp />,
      color: pepsicoBrandColors.primary.blue,
      action: () => navigate('/success-tracking')
    }
  ];

  // Channel performance highlights
  const channelHighlights = [
    {
      channel: afhChannels.convenience.name,
      icon: <Store />,
      performance: 92,
      trend: afhChannels.convenience.growth,
      color: pepsicoBrandColors.secondary.orange,
      highlight: 'Premium placement secured in 156 new locations'
    },
    {
      channel: afhChannels.foodservice.name,
      icon: <Restaurant />,
      performance: 87,
      trend: afhChannels.foodservice.growth,
      color: pepsicoBrandColors.primary.blue,
      highlight: 'Exclusive partnerships with 3 major chains'
    },
    {
      channel: afhChannels.education.name,
      icon: <School />,
      performance: 94,
      trend: afhChannels.education.growth,
      color: pepsicoBrandColors.secondary.green,
      highlight: 'Campus wellness programs launched at 12 universities'
    },
    {
      channel: afhChannels.workplace.name,
      icon: <Business />,
      performance: 78,
      trend: afhChannels.workplace.growth,
      color: pepsicoBrandColors.secondary.red,
      highlight: 'Workplace vending solutions in 50+ tech companies'
    }
  ];

  // Recent wins for momentum
  const recentWins = recentActivities.slice(0, 3).map(activity => ({
    title: activity.title.split(' - ')[0],
    value: activity.value,
    description: activity.description,
    timeAgo: activity.timestamp,
    type: activity.type
  }));

  // Animate hero metric on load
  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedValue(prev => {
          if (prev >= heroMetric.value) {
            clearInterval(interval);
            return heroMetric.value;
          }
          return prev + Math.ceil(heroMetric.value / 100);
        });
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  const HeroMetricCard = () => (
    <Grow in={isLoaded} timeout={1000}>
      <Card sx={{ 
        background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
        color: 'white',
        textAlign: 'center',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}>
        <CardContent sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            fontSize: '2rem'
          }}>
            😊
          </Avatar>
          
          <Typography variant="h1" sx={{ 
            fontWeight: 800,
            fontSize: { xs: '3rem', md: '4.5rem' },
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {formatNumber(animatedValue)}
          </Typography>
          
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            mb: 2,
            opacity: 0.95
          }}>
            {heroMetric.label}
          </Typography>
          
          <Chip 
            label={heroMetric.growth}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              px: 2,
              py: 1,
              mb: 2
            }}
          />
          
          <Typography variant="body1" sx={{ 
            opacity: 0.9,
            maxWidth: 400,
            mx: 'auto',
            mb: 3
          }}>
            {heroMetric.description}
          </Typography>

          {/* Real-time growth chart */}
          <Box sx={{ height: 100, mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <Area 
                  type="monotone" 
                  dataKey="smiles" 
                  stroke="rgba(255,255,255,0.8)"
                  fill="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  const KPICard = ({ kpi, index }) => (
    <Fade in={isLoaded} timeout={1500 + (index * 200)}>
      <Card sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 51, 102, 0.15)',
        }
      }}
      onClick={kpi.action}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ 
            bgcolor: `${kpi.color}20`,
            color: kpi.color,
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2
          }}>
            {kpi.icon}
          </Avatar>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            color: pepsicoBrandColors.primary.navy,
            mb: 1
          }}>
            {kpi.value}
          </Typography>
          
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            mb: 1
          }}>
            {kpi.title}
          </Typography>
          
          <Chip 
            label={kpi.change}
            size="small"
            sx={{ 
              bgcolor: `${pepsicoBrandColors.secondary.green}20`,
              color: pepsicoBrandColors.secondary.green,
              fontWeight: 600
            }}
          />
        </CardContent>
      </Card>
    </Fade>
  );

  const ChannelCard = ({ channel, index }) => (
    <Fade in={isLoaded} timeout={2000 + (index * 150)}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: `${channel.color}20`,
              color: channel.color,
              mr: 2
            }}>
              {channel.icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {channel.channel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Performance Score
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight={700} color="primary">
                {channel.performance}%
              </Typography>
              <Chip 
                label={channel.trend}
                size="small"
                sx={{ 
                  bgcolor: `${pepsicoBrandColors.secondary.green}20`,
                  color: pepsicoBrandColors.secondary.green,
                  fontWeight: 500
                }}
              />
            </Box>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={channel.performance} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              bgcolor: `${channel.color}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: channel.color,
                borderRadius: 4,
              }
            }}
          />
          
          <Typography variant="body2" sx={{ 
            mt: 2,
            color: 'text.secondary',
            fontStyle: 'italic'
          }}>
            {channel.highlight}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );

  const WinCard = ({ win, index }) => (
    <Fade in={isLoaded} timeout={2500 + (index * 100)}>
      <Paper sx={{ 
        p: 2,
        mb: 2,
        border: `1px solid ${pepsicoBrandColors.neutral.mediumGray}`,
        borderLeft: `4px solid ${pepsicoBrandColors.secondary.orange}`
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {win.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {win.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {win.timeAgo}
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            {win.value}
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: pepsicoBrandColors.primary.navy,
            mb: 1
          }}>
            Growth Command Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time AFH performance and partnership intelligence
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton sx={{ color: pepsicoBrandColors.primary.navy }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            sx={{ 
              background: `linear-gradient(135deg, ${pepsicoBrandColors.secondary.orange} 0%, ${pepsicoBrandColors.secondary.green} 100%)`,
            }}
            onClick={() => navigate('/partnership-engine')}
          >
            Launch AI Assistant
          </Button>
        </Box>
      </Box>

      {/* Hero Metric */}
      <Box sx={{ mb: 4 }}>
        <HeroMetricCard />
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} md={4} key={index}>
            <KPICard kpi={kpi} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Channel Performance & Recent Wins */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: pepsicoBrandColors.primary.navy,
            mb: 3
          }}>
            Channel Performance
          </Typography>
          <Grid container spacing={3}>
            {channelHighlights.map((channel, index) => (
              <Grid item xs={12} md={6} key={index}>
                <ChannelCard channel={channel} index={index} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: pepsicoBrandColors.primary.navy,
            mb: 3
          }}>
            Recent Wins
          </Typography>
          {recentWins.map((win, index) => (
            <WinCard key={index} win={win} index={index} />
          ))}
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Launch />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/success-tracking')}
          >
            View All Success Metrics
          </Button>
        </Grid>
      </Grid>

      {/* PepsiCo Brand Footer */}
      <Box sx={{ 
        mt: 6,
        p: 3,
        textAlign: 'center',
        background: `linear-gradient(135deg, ${pepsicoBrandColors.neutral.lightGray} 0%, ${pepsicoBrandColors.neutral.mediumGray} 100%)`,
        borderRadius: 3
      }}>
        <Typography variant="h6" sx={{ 
          color: pepsicoBrandColors.primary.navy,
          fontWeight: 600,
          mb: 1
        }}>
          "Creating more smiles with every sip and every bite"
        </Typography>
        <Typography variant="body2" color="text.secondary">
          PepsiCo Away-From-Home Growth Platform • Powered by AI • Built for Scale
        </Typography>
      </Box>
    </Box>
  );
};

export default PepsiCoDashboard;
