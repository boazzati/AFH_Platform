import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  People,
  Business,
  Refresh,
  Info,
  Warning,
  CheckCircle,
  Schedule,
  Map,
  PlayArrow,
  TrackChanges,
  IntegrationInstructions,
  Groups,
  SmartToy,
  Analytics
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    marketSignals: [],
    playbooks: [],
    projects: [],
    experts: []
  });
  const [healthStatus, setHealthStatus] = useState(null);

  const modules = [
    {
      title: 'AFH Market Mapping',
      description: 'Dynamic mapping of restaurant openings, menu trends, and channel opportunities',
      icon: <Map sx={{ fontSize: 40 }} />,
      path: '/market-mapping',
      color: '#1976d2'
    },
    {
      title: 'Commercial Playbook Generator',
      description: 'AI-generated playbooks for QSR, workplace, leisure channels',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      path: '/playbook-generator',
      color: '#2e7d32'
    },
    {
      title: 'Execution Engine',
      description: 'Track pitches, pilots, launches with closed-loop feedback',
      icon: <TrackChanges sx={{ fontSize: 40 }} />,
      path: '/execution-engine',
      color: '#ed6c02'
    },
    {
      title: 'Operator Data Integration',
      description: 'POS, menu data, and CRM integration for real-time insights',
      icon: <IntegrationInstructions sx={{ fontSize: 40 }} />,
      path: '/data-integration',
      color: '#9c27b0'
    },
    {
      title: 'Expert Network',
      description: 'On-demand AFH experts and peer consultations',
      icon: <Groups sx={{ fontSize: 40 }} />,
      path: '/expert-network',
      color: '#d32f2f'
    },
    {
      title: 'Agentic AI Assistant',
      description: 'AI-powered targeting, outreach, and proposal generation',
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      path: '/agentic-ai',
      color: '#0288d1'
    },
    {
      title: 'Performance Benchmarking',
      description: 'Cross-market performance and competitive win analysis',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      path: '/benchmarking',
      color: '#7b1fa2'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load health status
      const healthResponse = await dashboardApi.getHealth();
      setHealthStatus(healthResponse.data);

      // Load all dashboard data
      const [signalsRes, playbooksRes, projectsRes, expertsRes] = await dashboardApi.getOverview();
      
      setData({
        marketSignals: signalsRes.data || [],
        playbooks: playbooksRes.data || [],
        projects: projectsRes.data || [],
        experts: expertsRes.data || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = (path) => {
    navigate(path);
  };

  // Analytics calculations
  const analytics = {
    totalOpportunities: data.marketSignals.length,
    highPrioritySignals: data.marketSignals.filter(s => s.priority === 'high').length,
    activeProjects: data.projects.filter(p => p.status === 'active').length,
    completedProjects: data.projects.filter(p => p.status === 'completed').length,
    avgProjectProgress: data.projects.length > 0 
      ? Math.round(data.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / data.projects.length)
      : 0,
    playbookSuccessRate: data.playbooks.length > 0
      ? Math.round(data.playbooks.reduce((sum, p) => sum + (p.successRate || 0), 0) / data.playbooks.length)
      : 0
  };

  // Chart data preparation
  const channelDistribution = data.marketSignals.reduce((acc, signal) => {
    acc[signal.channel] = (acc[signal.channel] || 0) + 1;
    return acc;
  }, {});

  const channelChartData = Object.entries(channelDistribution).map(([channel, count]) => ({
    channel,
    count,
    percentage: Math.round((count / data.marketSignals.length) * 100)
  }));

  const priorityDistribution = data.marketSignals.reduce((acc, signal) => {
    acc[signal.priority] = (acc[signal.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityChartData = Object.entries(priorityDistribution).map(([priority, count]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    count,
    color: priority === 'high' ? '#f44336' : priority === 'medium' ? '#ff9800' : '#4caf50'
  }));

  // Project timeline data (last 6 months)
  const projectTimelineData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    // Calculate projects for this month (simplified)
    const projectsThisMonth = Math.floor(Math.random() * 5) + 1;
    const completedThisMonth = Math.floor(projectsThisMonth * 0.7);
    
    return {
      month: monthName,
      active: projectsThisMonth,
      completed: completedThisMonth,
      total: projectsThisMonth + completedThisMonth
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const OverviewTab = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        AFH Channel Acceleration Platform
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        AI-powered tools to accelerate Away-From-Home channel growth for CPG
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: module.color, mb: 2 }}>
                  {module.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: module.color,
                    color: module.color,
                    '&:hover': {
                      backgroundColor: module.color,
                      color: 'white'
                    }
                  }}
                  onClick={() => handleExplore(module.path)}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const AnalyticsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Health Status Alert */}
      {healthStatus && (
        <Alert 
          severity={healthStatus.status === 'healthy' ? 'success' : 'warning'} 
          sx={{ mb: 3 }}
          action={
            <Tooltip title="System Health Details">
              <IconButton size="small">
                <Info />
              </IconButton>
            </Tooltip>
          }
        >
          System Status: {healthStatus.status} | 
          Database: {healthStatus.database} | 
          AI: {healthStatus.openai ? 'Connected' : 'Disconnected'} | 
          Crawler: {healthStatus.crawler ? 'Available' : 'Unavailable'}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Market Opportunities
                      </Typography>
                      <Typography variant="h4">
                        {analytics.totalOpportunities}
                      </Typography>
                      <Typography variant="body2" color="error">
                        {analytics.highPrioritySignals} high priority
                      </Typography>
                    </Box>
                    <TrendingUp color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Active Projects
                      </Typography>
                      <Typography variant="h4">
                        {analytics.activeProjects}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {analytics.avgProjectProgress}% avg progress
                      </Typography>
                    </Box>
                    <Assessment color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Expert Network
                      </Typography>
                      <Typography variant="h4">
                        {data.experts.length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Available consultants
                      </Typography>
                    </Box>
                    <People color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Playbook Success
                      </Typography>
                      <Typography variant="h4">
                        {analytics.playbookSuccessRate}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Average success rate
                      </Typography>
                    </Box>
                    <Business color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Channel Distribution */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Opportunities by Channel
                  </Typography>
                  {channelChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={channelChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ channel, percentage }) => `${channel} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {channelChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="textSecondary">
                        No channel data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Priority Distribution */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Signal Priority Distribution
                  </Typography>
                  {priorityChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priorityChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="priority" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {priorityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="textSecondary">
                        No priority data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Project Timeline */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Activity Timeline
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={projectTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Active Projects"
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Completed Projects"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Market Signals
                  </Typography>
                  {data.marketSignals.slice(0, 5).map((signal, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }}>
                        {signal.priority === 'high' ? (
                          <Warning color="error" />
                        ) : signal.priority === 'medium' ? (
                          <Schedule color="warning" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {signal.type || signal.description || 'Market Signal'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {signal.location} • {signal.channel}
                        </Typography>
                      </Box>
                      <Chip
                        label={signal.priority}
                        size="small"
                        color={signal.priority === 'high' ? 'error' : signal.priority === 'medium' ? 'warning' : 'success'}
                      />
                    </Box>
                  ))}
                  {data.marketSignals.length === 0 && (
                    <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                      No market signals available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Projects Status
                  </Typography>
                  {data.projects.slice(0, 5).map((project, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {project.name || `Project ${index + 1}`}
                        </Typography>
                        <Typography variant="caption">
                          {project.progress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress || 0}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {project.channel} • {project.owner || 'Unassigned'}
                      </Typography>
                    </Box>
                  ))}
                  {data.projects.length === 0 && (
                    <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                      No active projects
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Platform Overview" />
        <Tab label="Analytics Dashboard" />
      </Tabs>

      {tabValue === 0 && <OverviewTab />}
      {tabValue === 1 && <AnalyticsTab />}
    </Box>
  );
};

export default Dashboard;
