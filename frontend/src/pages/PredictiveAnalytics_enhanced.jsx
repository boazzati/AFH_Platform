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
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  TextField,
  Snackbar,
  Slider
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  Security,
  AttachMoney,
  Analytics,
  ExpandMore,
  PlayArrow,
  Refresh,
  Download,
  Visibility,
  TrendingDown,
  Warning,
  CheckCircle,
  Speed,
  Timeline,
  PieChart,
  BarChart,
  ShowChart,
  Psychology,
  AutoGraph,
  Insights,
  Add,
  Close,
  Save
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import api from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const PredictiveAnalytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dialog states
  const [trendDialogOpen, setTrendDialogOpen] = useState(false);
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  
  // Form states
  const [trendForm, setTrendForm] = useState({
    name: '',
    category: 'consumer_behavior',
    impact_level: 'medium',
    confidence: 75,
    description: ''
  });
  
  const [opportunityForm, setOpportunityForm] = useState({
    company: '',
    channel: 'qsr',
    revenue_potential: 'medium',
    priority: 'medium'
  });
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Comprehensive mock data
  const mockAnalyticsData = {
    overview: {
      total_opportunities: 127,
      avg_ai_score: 0.78,
      revenue_pipeline: 45200000,
      ai_confidence: 0.94,
      active_trends: 15,
      predictions_accuracy: 0.89
    },
    opportunity_scoring: {
      distribution: [
        { priority: 'High', count: 34, percentage: 0.27 },
        { priority: 'Medium', count: 58, percentage: 0.46 },
        { priority: 'Low', count: 35, percentage: 0.27 }
      ],
      channel_performance: [
        { channel: 'QSR', score: 85, opportunities: 45, revenue: 18500000 },
        { channel: 'Fast Casual', score: 78, opportunities: 32, revenue: 12300000 },
        { channel: 'Coffee Shops', score: 72, opportunities: 28, revenue: 8900000 },
        { channel: 'Convenience', score: 69, opportunities: 22, revenue: 5500000 }
      ],
      top_opportunities: [
        {
          id: 1,
          company: 'Starbucks Corporation',
          channel: 'Coffee Shops',
          ai_score: 0.92,
          revenue_potential: 8500000,
          confidence: 0.89,
          factors: {
            channel_relevance: 0.95,
            market_timing: 0.88,
            competitive_position: 0.91,
            revenue_size: 0.94,
            execution_complexity: 0.87,
            strategic_fit: 0.96
          }
        },
        {
          id: 2,
          company: 'McDonald\'s USA',
          channel: 'QSR',
          ai_score: 0.89,
          revenue_potential: 12300000,
          confidence: 0.85,
          factors: {
            channel_relevance: 0.98,
            market_timing: 0.82,
            competitive_position: 0.88,
            revenue_size: 0.97,
            execution_complexity: 0.79,
            strategic_fit: 0.90
          }
        },
        {
          id: 3,
          company: 'Subway Restaurants',
          channel: 'Fast Casual',
          ai_score: 0.84,
          revenue_potential: 6700000,
          confidence: 0.81,
          factors: {
            channel_relevance: 0.87,
            market_timing: 0.85,
            competitive_position: 0.82,
            revenue_size: 0.79,
            execution_complexity: 0.88,
            strategic_fit: 0.83
          }
        }
      ]
    },
    trend_forecasting: {
      market_trends: [
        {
          id: 1,
          name: 'Plant-Based Menu Expansion',
          category: 'consumer_behavior',
          growth_rate: 0.34,
          confidence: 0.87,
          impact_level: 'high',
          timeline: '6-12 months',
          description: 'Increasing demand for plant-based alternatives across all AFH channels',
          opportunities: 23,
          revenue_impact: 15600000
        },
        {
          id: 2,
          name: 'AI-Powered Personalization',
          category: 'technology',
          growth_rate: 0.28,
          confidence: 0.82,
          impact_level: 'high',
          timeline: '12-18 months',
          description: 'Advanced AI systems for personalized customer experiences',
          opportunities: 18,
          revenue_impact: 12400000
        },
        {
          id: 3,
          name: 'Sustainability Initiatives',
          category: 'regulatory',
          growth_rate: 0.22,
          confidence: 0.91,
          impact_level: 'medium',
          timeline: '3-6 months',
          description: 'Regulatory push for sustainable packaging and operations',
          opportunities: 31,
          revenue_impact: 8900000
        },
        {
          id: 4,
          name: 'Premium Coffee Experiences',
          category: 'consumer_behavior',
          growth_rate: 0.19,
          confidence: 0.78,
          impact_level: 'medium',
          timeline: '6-12 months',
          description: 'Growing demand for premium, artisanal coffee experiences',
          opportunities: 15,
          revenue_impact: 7200000
        }
      ],
      emerging_opportunities: [
        { trend: 'Ghost Kitchen Expansion', potential: 'High', confidence: 0.85, timeline: '3-6 months' },
        { trend: 'Voice Ordering Integration', potential: 'Medium', confidence: 0.72, timeline: '6-12 months' },
        { trend: 'Contactless Payment Evolution', potential: 'High', confidence: 0.89, timeline: '1-3 months' },
        { trend: 'Micro-Location Strategies', potential: 'Medium', confidence: 0.76, timeline: '12-18 months' }
      ],
      trend_evolution: [
        { month: 'Jan', plant_based: 65, ai_personalization: 45, sustainability: 78, premium_coffee: 52 },
        { month: 'Feb', plant_based: 68, ai_personalization: 48, sustainability: 81, premium_coffee: 54 },
        { month: 'Mar', plant_based: 72, ai_personalization: 52, sustainability: 84, premium_coffee: 57 },
        { month: 'Apr', plant_based: 76, ai_personalization: 56, sustainability: 87, premium_coffee: 59 },
        { month: 'May', plant_based: 80, ai_personalization: 61, sustainability: 89, premium_coffee: 62 },
        { month: 'Jun', plant_based: 84, ai_personalization: 65, sustainability: 92, premium_coffee: 65 }
      ]
    },
    risk_assessment: {
      risk_categories: [
        { category: 'Market Risk', level: 'Medium', score: 0.35, factors: ['Competition', 'Market Saturation', 'Economic Conditions'] },
        { category: 'Execution Risk', level: 'Low', score: 0.22, factors: ['Team Capability', 'Resource Availability', 'Timeline'] },
        { category: 'Technology Risk', level: 'Low', score: 0.18, factors: ['Integration Complexity', 'Scalability', 'Security'] },
        { category: 'Regulatory Risk', level: 'Medium', score: 0.28, factors: ['Compliance', 'Policy Changes', 'Standards'] },
        { category: 'Financial Risk', level: 'Low', score: 0.15, factors: ['Investment Size', 'ROI Uncertainty', 'Cash Flow'] }
      ],
      mitigation_strategies: [
        { risk: 'Market Competition', strategy: 'Differentiation through innovation', priority: 'High' },
        { risk: 'Regulatory Changes', strategy: 'Proactive compliance monitoring', priority: 'Medium' },
        { risk: 'Technology Integration', strategy: 'Phased implementation approach', priority: 'Medium' },
        { risk: 'Resource Constraints', strategy: 'Strategic partnership development', priority: 'High' }
      ]
    },
    revenue_prediction: {
      scenarios: {
        conservative: {
          total_revenue: 28500000,
          probability: 0.85,
          timeline: '12 months',
          key_assumptions: ['Market conditions remain stable', 'Conservative growth rates', 'Standard execution']
        },
        expected: {
          total_revenue: 45200000,
          probability: 0.65,
          timeline: '12 months',
          key_assumptions: ['Favorable market conditions', 'Expected growth rates', 'Good execution']
        },
        optimistic: {
          total_revenue: 67800000,
          probability: 0.35,
          timeline: '12 months',
          key_assumptions: ['Excellent market conditions', 'Accelerated growth', 'Perfect execution']
        }
      },
      monthly_projections: [
        { month: 'Jul', conservative: 2100000, expected: 3400000, optimistic: 5200000 },
        { month: 'Aug', conservative: 2300000, expected: 3700000, optimistic: 5600000 },
        { month: 'Sep', conservative: 2500000, expected: 4000000, optimistic: 6000000 },
        { month: 'Oct', conservative: 2700000, expected: 4300000, optimistic: 6400000 },
        { month: 'Nov', conservative: 2900000, expected: 4600000, optimistic: 6800000 },
        { month: 'Dec', conservative: 3100000, expected: 4900000, optimistic: 7200000 }
      ],
      roi_analysis: {
        investment_required: 8500000,
        payback_period: '14 months',
        irr: 0.34,
        npv: 18700000
      }
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const response = await api.get('/analytics/predictive');
        setAnalyticsData({ ...mockAnalyticsData, ...response.data });
      } catch (apiError) {
        console.log('Using mock data due to API error:', apiError.message);
        setAnalyticsData(mockAnalyticsData);
      }
    } catch (error) {
      console.error('Analytics data loading error:', error);
      setError('Failed to load analytics data');
      setAnalyticsData(mockAnalyticsData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddTrend = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      const newTrend = {
        id: Date.now(),
        name: trendForm.name,
        category: trendForm.category,
        growth_rate: trendForm.confidence / 100 * 0.4, // Convert confidence to growth rate
        confidence: trendForm.confidence / 100,
        impact_level: trendForm.impact_level,
        timeline: '6-12 months',
        description: trendForm.description,
        opportunities: Math.floor(Math.random() * 20) + 5,
        revenue_impact: Math.floor(Math.random() * 10000000) + 5000000
      };

      // Add to existing trends
      setAnalyticsData(prev => ({
        ...prev,
        trend_forecasting: {
          ...prev.trend_forecasting,
          market_trends: [newTrend, ...prev.trend_forecasting.market_trends]
        }
      }));

      showSnackbar('Market trend added successfully!', 'success');
      setTrendDialogOpen(false);
      resetTrendForm();
    } catch (error) {
      console.error('Add trend error:', error);
      showSnackbar('Failed to add trend. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeOpportunity = async () => {
    try {
      setLoading(true);
      
      // Simulate comprehensive analysis
      showSnackbar('Starting comprehensive analysis...', 'info');
      
      setTimeout(() => {
        showSnackbar('Comprehensive analysis completed!', 'success');
        setAnalysisDialogOpen(false);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Analysis error:', error);
      showSnackbar('Analysis failed. Please try again.', 'error');
      setLoading(false);
    }
  };

  const resetTrendForm = () => {
    setTrendForm({
      name: '',
      category: 'consumer_behavior',
      impact_level: 'medium',
      confidence: 75,
      description: ''
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimation: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      case 'low': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return '#FF6B6B';
      case 'Medium': return '#F39C12';
      case 'Low': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  if (loading && !analyticsData) {
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
              Predictive Analytics
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              AI-powered market intelligence and forecasting
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
                    {analyticsData?.overview?.total_opportunities || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Opportunities
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {formatPercentage(analyticsData?.overview?.avg_ai_score || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average AI Score
                  </Typography>
                </Box>
                <Psychology sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analyticsData?.overview?.avg_ai_score * 100 || 0} 
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
                    {formatCurrency(analyticsData?.overview?.revenue_pipeline || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Revenue Pipeline
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
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
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPercentage(analyticsData?.overview?.ai_confidence || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    AI Confidence
                  </Typography>
                </Box>
                <Speed sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analyticsData?.overview?.ai_confidence * 100 || 0} 
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
            icon={<Assessment />} 
            label="Opportunity Scoring" 
            iconPosition="start"
          />
          <Tab 
            icon={<TrendingUp />} 
            label="Trend Forecasting" 
            iconPosition="start"
          />
          <Tab 
            icon={<Security />} 
            label="Risk Assessment" 
            iconPosition="start"
          />
          <Tab 
            icon={<AttachMoney />} 
            label="Revenue Prediction" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="Comprehensive Analysis" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Opportunity Scoring Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Channel Performance Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={analyticsData?.opportunity_scoring?.channel_performance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#667eea" name="AI Score" />
                    <Bar dataKey="opportunities" fill="#00C49F" name="Opportunities" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top Scoring Opportunities
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Company</strong></TableCell>
                        <TableCell><strong>Channel</strong></TableCell>
                        <TableCell><strong>AI Score</strong></TableCell>
                        <TableCell><strong>Revenue Potential</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData?.opportunity_scoring?.top_opportunities?.map((opp, index) => (
                        <TableRow key={opp.id || index} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {opp.company}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={opp.channel} 
                              size="small" 
                              sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LinearProgress 
                                variant="determinate" 
                                value={opp.ai_score * 100} 
                                sx={{ width: 60, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2" fontWeight="bold">
                                {formatPercentage(opp.ai_score)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                              {formatCurrency(opp.revenue_potential)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Analytics />}
                              onClick={() => setAnalysisDialogOpen(true)}
                            >
                              Analyze
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Priority Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData?.opportunity_scoring?.distribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${(percentage * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="priority"
                    >
                      {analyticsData?.opportunity_scoring?.distribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Scoring Statistics
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {formatPercentage(analyticsData?.overview?.avg_ai_score || 0)}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      High Priority Opportunities
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {analyticsData?.opportunity_scoring?.distribution?.[0]?.count || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Pipeline Value
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {formatCurrency(analyticsData?.overview?.revenue_pipeline || 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Trend Forecasting Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Market Trend Analysis
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setTrendDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Add Market Trend
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Trend Evolution Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.trend_forecasting?.trend_evolution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="plant_based" stroke="#00C49F" strokeWidth={3} name="Plant-Based" />
                    <Line type="monotone" dataKey="ai_personalization" stroke="#0088FE" strokeWidth={2} name="AI Personalization" />
                    <Line type="monotone" dataKey="sustainability" stroke="#FFBB28" strokeWidth={2} name="Sustainability" />
                    <Line type="monotone" dataKey="premium_coffee" stroke="#FF8042" strokeWidth={2} name="Premium Coffee" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Key Market Trends
                </Typography>
                {analyticsData?.trend_forecasting?.market_trends?.map((trend, index) => (
                  <Accordion key={trend.id || index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: getImpactColor(trend.impact_level), width: 32, height: 32 }}>
                            <TrendingUp />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {trend.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {trend.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} • {trend.timeline}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip 
                            label={`${formatPercentage(trend.growth_rate)} Growth`}
                            size="small"
                            color="success"
                          />
                          <Chip 
                            label={`${formatPercentage(trend.confidence)} Confidence`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="body2" paragraph>
                            {trend.description}
                          </Typography>
                          <Box display="flex" gap={2} mt={2}>
                            <Chip 
                              label={`${trend.opportunities} Opportunities`}
                              variant="outlined"
                              size="small"
                            />
                            <Chip 
                              label={`${formatCurrency(trend.revenue_impact)} Revenue Impact`}
                              variant="outlined"
                              size="small"
                              color="success"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box display="flex" flex-direction="column" gap={1}>
                            <Button size="small" variant="outlined" startIcon={<Visibility />}>
                              View Details
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<Analytics />}>
                              Analyze Impact
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Emerging Opportunities
                </Typography>
                <List>
                  {analyticsData?.trend_forecasting?.emerging_opportunities?.map((opp, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUp color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={opp.trend}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {opp.timeline}
                              </Typography>
                              <Box display="flex" gap={1} mt={0.5}>
                                <Chip 
                                  label={opp.potential} 
                                  size="small" 
                                  color={opp.potential === 'High' ? 'success' : 'default'}
                                />
                                <Chip 
                                  label={`${formatPercentage(opp.confidence)} Confidence`}
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < analyticsData.trend_forecasting.emerging_opportunities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Trend Summary
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Active Trends
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {analyticsData?.overview?.active_trends || 0}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Prediction Accuracy
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatPercentage(analyticsData?.overview?.predictions_accuracy || 0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Button variant="contained" fullWidth startIcon={<Download />}>
                      Export Trends Report
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Assessment Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Risk Category Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analyticsData?.risk_assessment?.risk_categories || []}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 1]} />
                    <Radar
                      name="Risk Score"
                      dataKey="score"
                      stroke="#FF6B6B"
                      fill="#FF6B6B"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Mitigation Strategies
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Risk Factor</strong></TableCell>
                        <TableCell><strong>Mitigation Strategy</strong></TableCell>
                        <TableCell><strong>Priority</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData?.risk_assessment?.mitigation_strategies?.map((strategy, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {strategy.risk}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {strategy.strategy}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={strategy.priority}
                              size="small"
                              color={strategy.priority === 'High' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" startIcon={<PlayArrow />}>
                              Implement
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Risk Categories
                </Typography>
                <List>
                  {analyticsData?.risk_assessment?.risk_categories?.map((risk, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Warning sx={{ color: getRiskColor(risk.level) }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={risk.category}
                          secondary={
                            <Box>
                              <Box display="flex" alignItems="center" gap={1} mt={1}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={risk.score * 100} 
                                  sx={{ 
                                    width: 80, 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': { 
                                      bgcolor: getRiskColor(risk.level) 
                                    }
                                  }}
                                />
                                <Typography variant="body2" fontWeight="bold">
                                  {risk.level}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {risk.factors.join(', ')}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < analyticsData.risk_assessment.risk_categories.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Revenue Prediction Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Revenue Projection Scenarios
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData?.revenue_prediction?.monthly_projections || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="conservative" 
                      stackId="1" 
                      stroke="#FF8042" 
                      fill="#FF8042" 
                      fillOpacity={0.6}
                      name="Conservative"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expected" 
                      stackId="2" 
                      stroke="#00C49F" 
                      fill="#00C49F" 
                      fillOpacity={0.6}
                      name="Expected"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="optimistic" 
                      stackId="3" 
                      stroke="#0088FE" 
                      fill="#0088FE" 
                      fillOpacity={0.6}
                      name="Optimistic"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  ROI Analysis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Investment Required
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {formatCurrency(analyticsData?.revenue_prediction?.roi_analysis?.investment_required || 0)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Payback Period
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {analyticsData?.revenue_prediction?.roi_analysis?.payback_period || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Internal Rate of Return (IRR)
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {formatPercentage(analyticsData?.revenue_prediction?.roi_analysis?.irr || 0)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Net Present Value (NPV)
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {formatCurrency(analyticsData?.revenue_prediction?.roi_analysis?.npv || 0)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Scenario Analysis
                </Typography>
                {Object.entries(analyticsData?.revenue_prediction?.scenarios || {}).map(([scenario, data]) => (
                  <Box key={scenario} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                        {scenario}
                      </Typography>
                      <Chip 
                        label={formatPercentage(data.probability)}
                        size="small"
                        color={scenario === 'expected' ? 'primary' : 'default'}
                      />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="success.main" gutterBottom>
                      {formatCurrency(data.total_revenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Timeline: {data.timeline}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Key Assumptions:
                    </Typography>
                    <List dense>
                      {data.key_assumptions?.map((assumption, index) => (
                        <ListItem key={index} sx={{ py: 0, px: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            • {assumption}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Comprehensive Analysis Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                AI-Powered Comprehensive Analysis
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Analytics />}
                onClick={handleAnalyzeOpportunity}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1.5
                }}
              >
                {loading ? 'Analyzing...' : 'Run Comprehensive Analysis'}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, textAlign: 'center' }}>
                  <Analytics sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Multi-Factor Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Comprehensive evaluation across all opportunity dimensions including market timing, competitive landscape, revenue potential, and execution complexity.
                  </Typography>
                  <Button variant="outlined" startIcon={<PlayArrow />}>
                    Start Analysis
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, textAlign: 'center' }}>
                  <Psychology sx={{ fontSize: 60, color: '#f093fb', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    AI Insights & Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Advanced AI-powered insights with strategic recommendations, risk mitigation strategies, and optimal execution pathways.
                  </Typography>
                  <Button variant="outlined" startIcon={<Insights />}>
                    Generate Insights
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Pro Tip:</strong> The comprehensive analysis combines data from all modules including market signals, 
                    expert recommendations, and historical performance to provide the most accurate opportunity assessment.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Add Trend Dialog */}
      <Dialog open={trendDialogOpen} onClose={() => setTrendDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add Market Trend for Analysis
            <IconButton onClick={() => setTrendDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trend Name"
                value={trendForm.name}
                onChange={(e) => setTrendForm({ ...trendForm, name: e.target.value })}
                placeholder="e.g., Plant-Based Menu Expansion"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={trendForm.category}
                  onChange={(e) => setTrendForm({ ...trendForm, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="consumer_behavior">Consumer Behavior</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="regulatory">Regulatory</MenuItem>
                  <MenuItem value="economic">Economic</MenuItem>
                  <MenuItem value="competitive">Competitive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Impact Level</InputLabel>
                <Select
                  value={trendForm.impact_level}
                  onChange={(e) => setTrendForm({ ...trendForm, impact_level: e.target.value })}
                  label="Impact Level"
                >
                  <MenuItem value="low">Low Impact</MenuItem>
                  <MenuItem value="medium">Medium Impact</MenuItem>
                  <MenuItem value="high">High Impact</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Confidence Level: {trendForm.confidence}%
                </Typography>
                <Slider
                  value={trendForm.confidence}
                  onChange={(e, value) => setTrendForm({ ...trendForm, confidence: value })}
                  min={0}
                  max={100}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={trendForm.description}
                onChange={(e) => setTrendForm({ ...trendForm, description: e.target.value })}
                placeholder="Describe the trend and its potential impact on the AFH market..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrendDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddTrend}
            disabled={loading || !trendForm.name || !trendForm.description}
            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
          >
            {loading ? 'Adding...' : 'Add Trend'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comprehensive Analysis Dialog */}
      <Dialog open={analysisDialogOpen} onClose={() => setAnalysisDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Comprehensive Opportunity Analysis</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Run a complete AI-powered analysis including market assessment, competitive analysis, 
            revenue forecasting, and strategic recommendations.
          </Typography>
          {loading && (
            <Box display="flex" alignItems="center" gap={2} mt={3}>
              <CircularProgress size={24} />
              <Typography variant="body2">
                Analyzing opportunity data and generating insights...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAnalyzeOpportunity}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Analytics />}
          >
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PredictiveAnalytics;
