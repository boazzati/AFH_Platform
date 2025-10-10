import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Psychology,
  AutoGraph,
  TrendingUp,
  Assessment,
  Speed,
  Business,
  Group,
  Assignment,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Refresh,
  Add,
  Visibility,
  Edit,
  Star,
  ExpandMore,
  AttachMoney,
  Timeline,
  Analytics,
  Insights,
  School,
  Work,
  LocationOn,
  Email,
  Phone
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import api from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`matching-tabpanel-${index}`}
      aria-labelledby={`matching-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const IntelligentMatching = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchingData, setMatchingData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Mock comprehensive matching data
  const mockMatchingData = {
    metrics: {
      total_matches: 89,
      high_confidence_matches: 34,
      expert_recommendations: 45,
      playbook_suggestions: 23,
      average_match_score: 0.84,
      automation_efficiency: 0.91
    },
    opportunity_matches: [
      {
        id: 1,
        title: 'Starbucks Plant-Based Expansion',
        channel: 'Coffee Shops',
        match_score: 0.94,
        confidence: 0.89,
        revenue_potential: 2800000,
        recommended_products: ['Plant Protein Blend A', 'Organic Sweetener Mix'],
        recommended_experts: ['Sarah Johnson', 'Mike Chen'],
        recommended_playbooks: ['Coffee Chain Expansion', 'Plant-Based Launch'],
        factors: {
          channel_relevance: 0.95,
          market_timing: 0.88,
          competitive_position: 0.92,
          revenue_size: 0.96,
          execution_complexity: 0.78,
          strategic_fit: 0.94
        }
      },
      {
        id: 2,
        title: 'McDonald\'s Breakfast Innovation',
        channel: 'QSR',
        match_score: 0.87,
        confidence: 0.82,
        revenue_potential: 1500000,
        recommended_products: ['Breakfast Protein Bar', 'Morning Blend Coffee'],
        recommended_experts: ['David Wilson', 'Lisa Park'],
        recommended_playbooks: ['QSR Innovation', 'Breakfast Market Entry'],
        factors: {
          channel_relevance: 0.89,
          market_timing: 0.85,
          competitive_position: 0.84,
          revenue_size: 0.76,
          execution_complexity: 0.91,
          strategic_fit: 0.87
        }
      }
    ],
    expert_recommendations: [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Senior QSR Strategist',
        expertise: ['Coffee Chains', 'Plant-Based Products', 'Menu Innovation'],
        experience_years: 12,
        success_rate: 0.92,
        availability: 'Available',
        hourly_rate: 350,
        location: 'Seattle, WA',
        recent_projects: 3,
        match_score: 0.96,
        contact: { email: 'sarah.j@experts.com', phone: '+1-555-0123' }
      },
      {
        id: 2,
        name: 'Mike Chen',
        title: 'Food Innovation Director',
        expertise: ['Product Development', 'Supply Chain', 'Regulatory'],
        experience_years: 15,
        success_rate: 0.89,
        availability: 'Limited',
        hourly_rate: 425,
        location: 'San Francisco, CA',
        recent_projects: 5,
        match_score: 0.91,
        contact: { email: 'mike.c@experts.com', phone: '+1-555-0124' }
      },
      {
        id: 3,
        name: 'David Wilson',
        title: 'QSR Operations Expert',
        expertise: ['Operations', 'Franchise Management', 'Cost Optimization'],
        experience_years: 18,
        success_rate: 0.94,
        availability: 'Available',
        hourly_rate: 400,
        location: 'Chicago, IL',
        recent_projects: 2,
        match_score: 0.88,
        contact: { email: 'david.w@experts.com', phone: '+1-555-0125' }
      }
    ],
    playbook_suggestions: [
      {
        id: 1,
        title: 'Coffee Chain Expansion Strategy',
        category: 'Market Entry',
        success_rate: 0.87,
        avg_timeline: '6-8 months',
        complexity: 'Medium',
        match_score: 0.93,
        key_steps: ['Market Analysis', 'Product Development', 'Pilot Testing', 'Full Rollout'],
        recent_usage: 8
      },
      {
        id: 2,
        title: 'Plant-Based Product Launch',
        category: 'Product Innovation',
        success_rate: 0.82,
        avg_timeline: '4-6 months',
        complexity: 'High',
        match_score: 0.89,
        key_steps: ['Consumer Research', 'Formulation', 'Testing', 'Marketing Launch'],
        recent_usage: 12
      },
      {
        id: 3,
        title: 'QSR Innovation Framework',
        category: 'Innovation',
        success_rate: 0.91,
        avg_timeline: '3-5 months',
        complexity: 'Medium',
        match_score: 0.85,
        key_steps: ['Opportunity Assessment', 'Concept Development', 'Validation', 'Implementation'],
        recent_usage: 15
      }
    ],
    matching_trends: [
      { month: 'Jan', matches: 67, success_rate: 0.78 },
      { month: 'Feb', matches: 73, success_rate: 0.81 },
      { month: 'Mar', matches: 82, success_rate: 0.84 },
      { month: 'Apr', matches: 78, success_rate: 0.82 },
      { month: 'May', matches: 89, success_rate: 0.87 },
      { month: 'Jun', matches: 94, success_rate: 0.89 }
    ]
  };

  useEffect(() => {
    loadMatchingData();
  }, []);

  const loadMatchingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const response = await api.get('/matching/analytics');
        setMatchingData({ ...mockMatchingData, ...response.data });
      } catch (apiError) {
        console.log('Using mock data due to API error:', apiError.message);
        setMatchingData(mockMatchingData);
      }
    } catch (error) {
      console.error('Matching data loading error:', error);
      setError('Failed to load matching data');
      setMatchingData(mockMatchingData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMatchingData();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'low': return '#00C49F';
      case 'medium': return '#FFBB28';
      case 'high': return '#FF8042';
      default: return '#8884D8';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability.toLowerCase()) {
      case 'available': return '#00C49F';
      case 'limited': return '#FFBB28';
      case 'unavailable': return '#FF8042';
      default: return '#8884D8';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 4,
        borderRadius: '0 0 24px 24px',
        mb: 3
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Intelligent Matching
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              AI-powered opportunity matching and resource recommendations
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mx: 3 }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {matchingData?.metrics?.total_matches || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Matches
                  </Typography>
                </Box>
                <Psychology sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {matchingData?.metrics?.expert_recommendations || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Expert Recommendations
                  </Typography>
                </Box>
                <Group sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPercentage(matchingData?.metrics?.average_match_score || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average Match Score
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={matchingData?.metrics?.average_match_score * 100 || 0} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPercentage(matchingData?.metrics?.automation_efficiency || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Automation Efficiency
                  </Typography>
                </Box>
                <Speed sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={matchingData?.metrics?.automation_efficiency * 100 || 0} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            icon={<Business />} 
            label="Opportunity Matching" 
            iconPosition="start"
          />
          <Tab 
            icon={<Group />} 
            label="Expert Recommendations" 
            iconPosition="start"
          />
          <Tab 
            icon={<Assignment />} 
            label="Playbook Suggestions" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Opportunity Matching Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {matchingData?.opportunity_matches?.map((opportunity) => (
            <Grid item xs={12} key={opportunity.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {opportunity.title}
                          </Typography>
                          <Box display="flex" gap={1} mb={2}>
                            <Chip label={opportunity.channel} size="small" color="primary" />
                            <Chip 
                              label={`${formatPercentage(opportunity.match_score)} Match`} 
                              size="small" 
                              sx={{ bgcolor: '#00C49F', color: 'white' }}
                            />
                            <Chip 
                              label={formatCurrency(opportunity.revenue_potential)} 
                              size="small" 
                              sx={{ bgcolor: '#667eea', color: 'white' }}
                            />
                          </Box>
                        </Box>
                        <Button variant="outlined" startIcon={<Visibility />}>
                          View Details
                        </Button>
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        AI Confidence: {formatPercentage(opportunity.confidence)}
                      </Typography>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Recommended Resources
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Products
                              </Typography>
                              {opportunity.recommended_products.map((product, index) => (
                                <Chip 
                                  key={index} 
                                  label={product} 
                                  size="small" 
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Experts
                              </Typography>
                              {opportunity.recommended_experts.map((expert, index) => (
                                <Chip 
                                  key={index} 
                                  label={expert} 
                                  size="small" 
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Playbooks
                              </Typography>
                              {opportunity.recommended_playbooks.map((playbook, index) => (
                                <Chip 
                                  key={index} 
                                  label={playbook} 
                                  size="small" 
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Match Factors Analysis
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={Object.entries(opportunity.factors).map(([key, value]) => ({
                          factor: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          value: value * 100
                        }))}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="factor" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar
                            name="Score"
                            dataKey="value"
                            stroke="#667eea"
                            fill="#667eea"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Expert Recommendations Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {matchingData?.expert_recommendations?.map((expert) => (
            <Grid item xs={12} md={6} lg={4} key={expert.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: '#667eea', width: 56, height: 56 }}>
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {expert.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {expert.title}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${formatPercentage(expert.match_score)} Match`}
                      size="small"
                      sx={{ bgcolor: '#00C49F', color: 'white' }}
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expertise Areas
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {expert.expertise.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {expert.experience_years} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating 
                          value={expert.success_rate * 5} 
                          readOnly 
                          size="small" 
                          precision={0.1}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {formatPercentage(expert.success_rate)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Availability
                      </Typography>
                      <Chip 
                        label={expert.availability}
                        size="small"
                        sx={{ 
                          bgcolor: getAvailabilityColor(expert.availability),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Rate
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${expert.hourly_rate}/hr
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {expert.location}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Recent Projects: {expert.recent_projects}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Send Email">
                        <IconButton size="small">
                          <Email />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Profile">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Playbook Suggestions Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {matchingData?.playbook_suggestions?.map((playbook) => (
            <Grid item xs={12} md={6} key={playbook.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {playbook.title}
                      </Typography>
                      <Chip 
                        label={playbook.category} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Chip 
                      label={`${formatPercentage(playbook.match_score)} Match`}
                      size="small"
                      sx={{ bgcolor: '#00C49F', color: 'white' }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={playbook.success_rate * 100} 
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {formatPercentage(playbook.success_rate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Timeline
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {playbook.avg_timeline}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Complexity
                      </Typography>
                      <Chip 
                        label={playbook.complexity}
                        size="small"
                        sx={{ 
                          bgcolor: getComplexityColor(playbook.complexity),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Recent Usage
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {playbook.recent_usage} times
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Key Steps
                  </Typography>
                  <List dense>
                    {playbook.key_steps.map((step, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#00C49F' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={step}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Button variant="outlined" size="small" startIcon={<Visibility />}>
                      View Details
                    </Button>
                    <Button variant="contained" size="small" startIcon={<Add />}>
                      Use Playbook
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default IntelligentMatching;
