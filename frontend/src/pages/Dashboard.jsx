import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
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
  IconButton,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  SmartToy,
  People,
  Business,
  Refresh,
  PlayArrow,
  Pause,
  Settings,
  Notifications,
  CheckCircle,
  Warning,
  Error,
  Info,
  Schedule,
  DataUsage,
  Speed,
  Timeline,
  AutoMode,
  TouchApp,
  Insights,
  Analytics
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { marketMappingApi } from '../services/api';

// Mock automation API for now
const automationApi = {
  getStatus: () => Promise.resolve({
    isRunning: true,
    activeTasks: ['urgent', 'regular', 'health'],
    metrics: {
      totalRuns: 45,
      successfulRuns: 42,
      failedRuns: 3,
      lastRunTime: new Date().toISOString(),
      averageProcessingTime: 15000,
      opportunitiesProcessed: 127
    }
  }),
  getMetrics: () => Promise.resolve({
    totalRuns: 45,
    successfulRuns: 42,
    failedRuns: 3,
    lastRunTime: new Date().toISOString(),
    lastSuccessTime: new Date().toISOString(),
    averageProcessingTime: 15000,
    opportunitiesProcessed: 127
  }),
  getAlerts: () => Promise.resolve([
    {
      type: 'high_priority_opportunities',
      message: '3 high-priority opportunities detected',
      timestamp: new Date().toISOString()
    },
    {
      type: 'collection_success',
      message: 'Successfully collected 15 new market signals',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]),
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  triggerCollection: () => Promise.resolve()
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    marketSignals: [],
    projects: [],
    experts: [],
    automationStatus: null,
    systemHealth: null
  });
  const [automationMetrics, setAutomationMetrics] = useState(null);
  const [recentInsights, setRecentInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
    loadAutomationData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadAutomationData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [signalsResponse, projectsResponse, expertsResponse] = await Promise.allSettled([
        marketMappingApi.getMarketSignals(),
        fetch('/api/projects').then(res => res.json()).catch(() => ({ data: [] })),
        fetch('/api/experts').then(res => res.json()).catch(() => ({ data: [] }))
      ]);

      setDashboardData({
        marketSignals: signalsResponse.status === 'fulfilled' ? signalsResponse.value.data || [] : [],
        projects: projectsResponse.status === 'fulfilled' ? projectsResponse.value.data || [] : [],
        experts: expertsResponse.status === 'fulfilled' ? expertsResponse.value.data || [] : [],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAutomationData = async () => {
    try {
      const [statusResponse, metricsResponse, alertsResponse] = await Promise.allSettled([
        automationApi.getStatus(),
        automationApi.getMetrics(),
        automationApi.getAlerts()
      ]);

      if (statusResponse.status === 'fulfilled') {
        const status = statusResponse.value;
        setAutomationEnabled(status.isRunning);
        setDashboardData(prev => ({ ...prev, automationStatus: status }));
      }

      if (metricsResponse.status === 'fulfilled') {
        setAutomationMetrics(metricsResponse.value);
      }

      if (alertsResponse.status === 'fulfilled') {
        setAlerts(alertsResponse.value.slice(0, 5)); // Show latest 5 alerts
      }
    } catch (error) {
      console.error('Error loading automation data:', error);
    }
  };

  const handleAutomationToggle = async () => {
    try {
      if (automationEnabled) {
        await automationApi.stop();
      } else {
        await automationApi.start();
      }
      setAutomationEnabled(!automationEnabled);
      await loadAutomationData();
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  const triggerManualCollection = async () => {
    try {
      await automationApi.triggerCollection();
      await loadAutomationData();
      await loadDashboardData();
    } catch (error) {
      console.error('Error triggering manual collection:', error);
    }
  };

  // Calculate analytics
  const analytics = {
    totalOpportunities: dashboardData.marketSignals.length,
    highPriorityCount: dashboardData.marketSignals.filter(signal => signal.priority === 'high').length,
    averageConfidence: dashboardData.marketSignals.length > 0 
      ? Math.round(dashboardData.marketSignals.reduce((sum, signal) => sum + (signal.confidence || 0), 0) / dashboardData.marketSignals.length)
      : 0,
    channelDistribution: getChannelDistribution(dashboardData.marketSignals),
    recentActivity: getRecentActivity(dashboardData.marketSignals),
    automationHealth: getAutomationHealth()
  };

  function getChannelDistribution(signals) {
    const distribution = {};
    signals.forEach(signal => {
      distribution[signal.channel] = (distribution[signal.channel] || 0) + 1;
    });
    return Object.entries(distribution).map(([channel, count]) => ({ channel, count }));
  }

  function getRecentActivity(signals) {
    const last7Days = signals.filter(signal => {
      const signalDate = new Date(signal.createdAt || signal.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return signalDate >= weekAgo;
    });
    
    return last7Days.length;
  }

  function getAutomationHealth() {
    if (!automationMetrics) return 'unknown';
    
    const successRate = automationMetrics.totalRuns > 0 
      ? (automationMetrics.successfulRuns / automationMetrics.totalRuns) * 100 
      : 0;
    
    if (successRate >= 90) return 'excellent';
    if (successRate >= 75) return 'good';
    if (successRate >= 50) return 'fair';
    return 'poor';
  }

  const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f'];

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          AFH Platform Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={automationEnabled}
                onChange={handleAutomationToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {automationEnabled ? <AutoMode /> : <TouchApp />}
                Automation
              </Box>
            }
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDashboardData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={triggerManualCollection}
            disabled={!automationEnabled}
          >
            Collect Data
          </Button>
        </Box>
      </Box>

      {/* Automation Status Alert */}
      {dashboardData.automationStatus && (
        <Alert 
          severity={automationEnabled ? 'success' : 'warning'} 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setShowAutomationDialog(true)}>
              Details
            </Button>
          }
        >
          Automation is {automationEnabled ? 'active' : 'inactive'}. 
          {automationMetrics && ` Last run: ${new Date(automationMetrics.lastRunTime).toLocaleString()}`}
        </Alert>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recent Alerts
            </Typography>
            <List dense>
              {alerts.map((alert, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {alert.type === 'high_priority_opportunities' && <Warning color="warning" />}
                    {alert.type === 'collection_error' && <Error color="error" />}
                    {alert.type === 'health_alert' && <Error color="error" />}
                    {alert.type === 'collection_success' && <CheckCircle color="success" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={alert.message}
                    secondary={new Date(alert.timestamp).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Platform Overview" />
        <Tab label="Analytics Dashboard" />
        <Tab label="Automation Insights" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        {/* Platform Overview */}
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary">
                  {analytics.totalOpportunities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Market Opportunities
                </Typography>
                <Chip 
                  label={`${analytics.recentActivity} this week`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Warning sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" color="error">
                  {analytics.highPriorityCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Priority
                </Typography>
                <Chip 
                  label="Requires attention" 
                  size="small" 
                  color="error" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" color="success.main">
                  {analytics.averageConfidence}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Confidence
                </Typography>
                <Chip 
                  label={analytics.averageConfidence >= 70 ? 'High quality' : 'Needs review'} 
                  size="small" 
                  color={analytics.averageConfidence >= 70 ? 'success' : 'warning'} 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Speed sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" color="info.main">
                  {analytics.automationHealth.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automation Health
                </Typography>
                <Chip 
                  label={automationEnabled ? 'Active' : 'Inactive'} 
                  size="small" 
                  color={automationEnabled ? 'success' : 'default'} 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Module Navigation */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Platform Modules
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6">Market Mapping</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  AI-powered market intelligence and opportunity flagging engine
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={`${analytics.totalOpportunities} opportunities`} size="small" />
                  <Button size="small" href="/market-mapping">Explore</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SmartToy sx={{ fontSize: 30, color: 'secondary.main', mr: 2 }} />
                  <Typography variant="h6">Agentic AI</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Intelligent AI assistants for sales, analysis, and strategy
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="4 AI agents" size="small" />
                  <Button size="small" href="/agentic-ai">Chat Now</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ fontSize: 30, color: 'success.main', mr: 2 }} />
                  <Typography variant="h6">Expert Network</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Connect with AFH industry experts and consultants
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={`${dashboardData.experts.length} experts`} size="small" />
                  <Button size="small" href="/expert-network">Connect</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Analytics Dashboard */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Channel Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.channelDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ channel, count }) => `${channel}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.channelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Priority Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { priority: 'High', count: analytics.highPriorityCount },
                    { priority: 'Medium', count: dashboardData.marketSignals.filter(s => s.priority === 'medium').length },
                    { priority: 'Low', count: dashboardData.marketSignals.filter(s => s.priority === 'low').length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {automationMetrics && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Automation Performance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {automationMetrics.totalRuns}
                        </Typography>
                        <Typography variant="body2">Total Runs</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {automationMetrics.successfulRuns}
                        </Typography>
                        <Typography variant="body2">Successful</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error">
                          {automationMetrics.failedRuns}
                        </Typography>
                        <Typography variant="body2">Failed</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          {Math.round(automationMetrics.averageProcessingTime / 1000)}s
                        </Typography>
                        <Typography variant="body2">Avg Time</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {/* Automation Insights */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Automated Data Collection Status
                </Typography>
                
                {automationEnabled ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Automation is actively monitoring market intelligence sources
                  </Alert>
                ) : (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Automation is currently disabled. Enable to start collecting market data automatically.
                  </Alert>
                )}

                {automationMetrics && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Collection Schedule:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><Schedule /></ListItemIcon>
                        <ListItemText 
                          primary="Urgent Monitoring" 
                          secondary="Every 15 minutes - High-priority opportunities"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Schedule /></ListItemIcon>
                        <ListItemText 
                          primary="Regular Monitoring" 
                          secondary="Every 2 hours - General market intelligence"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Schedule /></ListItemIcon>
                        <ListItemText 
                          primary="Deep Analysis" 
                          secondary="Daily at 6 AM - Comprehensive market analysis"
                        />
                      </ListItem>
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Sources
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Restaurant Industry News" secondary="QSR Magazine, Restaurant Business" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Chain Websites" secondary="McDonald's, Starbucks, Subway" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Industry Reports" secondary="Foodservice Director, Eater" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Social Media" secondary="Twitter, LinkedIn monitoring" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Processing Pipeline
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><DataUsage color="primary" /></ListItemIcon>
                    <ListItemText primary="Data Ingestion" secondary="Web scraping and content extraction" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SmartToy color="primary" /></ListItemIcon>
                    <ListItemText primary="AI Classification" secondary="Opportunity identification and scoring" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Analytics color="primary" /></ListItemIcon>
                    <ListItemText primary="Enhancement" secondary="Market analysis and enrichment" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Timeline color="primary" /></ListItemIcon>
                    <ListItemText primary="Prioritization" secondary="Scoring and ranking algorithms" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Automation Details Dialog */}
      <Dialog open={showAutomationDialog} onClose={() => setShowAutomationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Automation System Details</DialogTitle>
        <DialogContent>
          {dashboardData.automationStatus && (
            <Box>
              <Typography variant="h6" gutterBottom>System Status</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">Status: {automationEnabled ? 'Running' : 'Stopped'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    Active Tasks: {dashboardData.automationStatus.activeTasks?.join(', ') || 'None'}
                  </Typography>
                </Grid>
              </Grid>

              {automationMetrics && (
                <>
                  <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Runs</TableCell>
                          <TableCell>{automationMetrics.totalRuns}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Success Rate</TableCell>
                          <TableCell>
                            {automationMetrics.totalRuns > 0 
                              ? `${Math.round((automationMetrics.successfulRuns / automationMetrics.totalRuns) * 100)}%`
                              : 'N/A'
                            }
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Last Run</TableCell>
                          <TableCell>
                            {automationMetrics.lastRunTime 
                              ? new Date(automationMetrics.lastRunTime).toLocaleString()
                              : 'Never'
                            }
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Opportunities Processed</TableCell>
                          <TableCell>{automationMetrics.opportunitiesProcessed}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAutomationDialog(false)}>Close</Button>
          <Button variant="contained" onClick={triggerManualCollection} disabled={!automationEnabled}>
            Run Collection Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
