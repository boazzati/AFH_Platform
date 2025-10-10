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
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Assessment,
  AttachMoney,
  Analytics,
  PlayArrow,
  Refresh,
  Visibility,
  Speed,
  Timeline,
  PieChart,
  BarChart,
  ShowChart,
  Psychology,
  AutoGraph,
  Insights,
  Business,
  Group,
  Assignment,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info
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
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
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

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock comprehensive dashboard data
  const mockDashboardData = {
    metrics: {
      total_opportunities: 127,
      active_projects: 8,
      total_experts: 45,
      success_rate: 0.78,
      revenue_pipeline: 45000000,
      ai_confidence: 0.89,
      automation_status: 'active'
    },
    recent_activity: [
      {
        id: 1,
        type: 'opportunity',
        title: 'New Starbucks partnership identified',
        description: 'Plant-based menu expansion opportunity',
        timestamp: new Date().toISOString(),
        priority: 'high',
        value: '$2.8M'
      },
      {
        id: 2,
        type: 'project',
        title: 'McDonald\'s project milestone reached',
        description: 'Breakfast innovation phase completed',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        value: '75% complete'
      },
      {
        id: 3,
        type: 'expert',
        title: 'New QSR expert onboarded',
        description: 'Sarah Johnson joined the network',
        timestamp: new Date().toISOString(),
        priority: 'low',
        value: '92% success rate'
      }
    ],
    revenue_breakdown: {
      total: 45000000,
      high_probability: 18000000,
      medium_probability: 15000000,
      low_probability: 12000000,
      monthly_trend: [
        { month: 'Jan', revenue: 3200000, opportunities: 18 },
        { month: 'Feb', revenue: 3800000, opportunities: 22 },
        { month: 'Mar', revenue: 4200000, opportunities: 28 },
        { month: 'Apr', revenue: 3900000, opportunities: 25 },
        { month: 'May', revenue: 4500000, opportunities: 31 },
        { month: 'Jun', revenue: 5100000, opportunities: 35 }
      ]
    },
    channel_performance: [
      { channel: 'QSR', opportunities: 45, revenue: 18500000, growth: '+15%', color: '#0088FE' },
      { channel: 'Fast Casual', opportunities: 32, revenue: 12800000, growth: '+22%', color: '#00C49F' },
      { channel: 'Casual Dining', opportunities: 28, revenue: 8200000, growth: '+8%', color: '#FFBB28' },
      { channel: 'Coffee Shops', opportunities: 22, revenue: 5500000, growth: '+28%', color: '#FF8042' }
    ],
    automation_metrics: {
      data_collection: { status: 'active', last_run: '2 hours ago', success_rate: 0.94 },
      ai_analysis: { status: 'active', processed_today: 47, accuracy: 0.89 },
      outreach_automation: { status: 'active', emails_sent: 23, response_rate: 0.34 },
      predictive_scoring: { status: 'active', opportunities_scored: 127, confidence: 0.87 }
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const response = await api.get('/dashboard/overview');
        setDashboardData({ ...mockDashboardData, ...response.data });
      } catch (apiError) {
        console.log('Using mock data due to API error:', apiError.message);
        setDashboardData(mockDashboardData);
      }
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      setError('Failed to load dashboard data');
      setDashboardData(mockDashboardData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimization: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'opportunity': return <Business sx={{ color: '#0088FE' }} />;
      case 'project': return <Assignment sx={{ color: '#00C49F' }} />;
      case 'expert': return <Group sx={{ color: '#FFBB28' }} />;
      default: return <Info sx={{ color: '#8884D8' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF8042';
      case 'medium': return '#FFBB28';
      case 'low': return '#00C49F';
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
              AFH Platform Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Real-time insights and automation metrics
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
            icon={<DashboardIcon />} 
            label="Platform Overview" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="Performance Analytics" 
            iconPosition="start"
          />
          <Tab 
            icon={<AutoGraph />} 
            label="Automation Status" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Platform Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
                      {dashboardData?.metrics?.total_opportunities || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Opportunities
                    </Typography>
                  </Box>
                  <Business sx={{ fontSize: 40, opacity: 0.8 }} />
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
                      {dashboardData?.metrics?.active_projects || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Projects
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
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
                      {formatCurrency(dashboardData?.metrics?.revenue_pipeline || 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Revenue Pipeline
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={78} 
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
                      {formatPercentage(dashboardData?.metrics?.success_rate || 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Success Rate
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardData?.metrics?.success_rate * 100 || 0} 
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

        {/* Charts and Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Revenue Pipeline Trend
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={dashboardData?.revenue_breakdown?.monthly_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#667eea" 
                      fill="url(#colorRevenue)" 
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Activity
                </Typography>
                <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                  {dashboardData?.recent_activity?.map((activity, index) => (
                    <React.Fragment key={activity.id || index}>
                      <ListItem>
                        <ListItemIcon>
                          {getActivityIcon(activity.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                <Chip 
                                  label={activity.priority} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: getPriorityColor(activity.priority),
                                    color: 'white',
                                    fontSize: '0.75rem'
                                  }} 
                                />
                                <Typography variant="caption" fontWeight="bold">
                                  {activity.value}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.recent_activity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Channel Performance
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsBarChart data={dashboardData?.channel_performance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#667eea" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Revenue Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'High Probability', value: dashboardData?.revenue_breakdown?.high_probability || 0 },
                        { name: 'Medium Probability', value: dashboardData?.revenue_breakdown?.medium_probability || 0 },
                        { name: 'Low Probability', value: dashboardData?.revenue_breakdown?.low_probability || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Automation Status Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {Object.entries(dashboardData?.automation_metrics || {}).map(([key, metric]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Typography>
                    <Chip 
                      label={metric.status} 
                      color={metric.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  {metric.last_run && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last run: {metric.last_run}
                    </Typography>
                  )}
                  
                  {metric.success_rate && (
                    <Box mb={1}>
                      <Typography variant="body2">
                        Success Rate: {formatPercentage(metric.success_rate)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.success_rate * 100} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                  
                  {metric.processed_today && (
                    <Typography variant="body2" color="text.secondary">
                      Processed today: {metric.processed_today}
                    </Typography>
                  )}
                  
                  {metric.emails_sent && (
                    <Typography variant="body2" color="text.secondary">
                      Emails sent: {metric.emails_sent}
                    </Typography>
                  )}
                  
                  {metric.response_rate && (
                    <Typography variant="body2" color="text.secondary">
                      Response rate: {formatPercentage(metric.response_rate)}
                    </Typography>
                  )}
                  
                  {metric.opportunities_scored && (
                    <Typography variant="body2" color="text.secondary">
                      Opportunities scored: {metric.opportunities_scored}
                    </Typography>
                  )}
                  
                  {metric.accuracy && (
                    <Box mt={1}>
                      <Typography variant="body2">
                        Accuracy: {formatPercentage(metric.accuracy)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.accuracy * 100} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                  
                  {metric.confidence && (
                    <Box mt={1}>
                      <Typography variant="body2">
                        Confidence: {formatPercentage(metric.confidence)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.confidence * 100} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
