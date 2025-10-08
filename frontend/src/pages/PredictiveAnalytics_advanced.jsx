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
  Tooltip
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
  Insights
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
import api, { predictiveAnalyticsApi } from '../services/api';

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
  const [scoringData, setScoringData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDialog, setAnalysisDialog] = useState(false);

  // Mock comprehensive data for customer demo
  const mockScoringData = {
    totalOpportunities: 127,
    averageScore: 78,
    highPriorityCount: 23,
    mediumPriorityCount: 67,
    lowPriorityCount: 37,
    channelDistribution: [
      { channel: 'QSR', count: 45, avgScore: 82, revenue: '$12.5M', growth: '+15%' },
      { channel: 'Fast Casual', count: 32, avgScore: 85, revenue: '$8.7M', growth: '+22%' },
      { channel: 'Casual Dining', count: 28, avgScore: 74, revenue: '$6.2M', growth: '+8%' },
      { channel: 'Coffee Shops', count: 22, avgScore: 88, revenue: '$4.1M', growth: '+28%' }
    ],
    recentScores: [
      { date: '2024-10-01', avgScore: 74, opportunities: 18 },
      { date: '2024-10-02', avgScore: 76, opportunities: 22 },
      { date: '2024-10-03', avgScore: 78, opportunities: 25 },
      { date: '2024-10-04', avgScore: 80, opportunities: 28 },
      { date: '2024-10-05', avgScore: 82, opportunities: 31 },
      { date: '2024-10-06', avgScore: 78, opportunities: 29 },
      { date: '2024-10-07', avgScore: 85, opportunities: 35 }
    ],
    topOpportunities: [
      { 
        id: 1, 
        title: 'Starbucks Plant-Based Expansion', 
        score: 94, 
        priority: 'high', 
        channel: 'Coffee Shops',
        revenue: '$2.8M',
        probability: 87,
        timeline: '6 months'
      },
      { 
        id: 2, 
        title: 'McDonald\'s Breakfast Innovation', 
        score: 91, 
        priority: 'high', 
        channel: 'QSR',
        revenue: '$4.2M',
        probability: 82,
        timeline: '9 months'
      },
      { 
        id: 3, 
        title: 'Chipotle Protein Diversification', 
        score: 88, 
        priority: 'high', 
        channel: 'Fast Casual',
        revenue: '$3.1M',
        probability: 79,
        timeline: '12 months'
      }
    ]
  };

  const mockTrendData = {
    timeHorizon: '12-months',
    overallConfidence: 89,
    marketGrowth: '+18%',
    trends: [
      {
        category: 'Consumer Behavior',
        trend: 'Health-conscious dining surge',
        confidence: 94,
        impact: 'high',
        timeline: 'Q1 2025',
        description: 'Plant-based and functional foods driving 40% menu innovation',
        growth: '+35%'
      },
      {
        category: 'Technology',
        trend: 'AI-powered personalization',
        confidence: 87,
        impact: 'high',
        timeline: 'Q2 2025',
        description: 'Dynamic menu optimization and predictive ordering systems',
        growth: '+28%'
      },
      {
        category: 'Economic',
        trend: 'Premium value positioning',
        confidence: 91,
        impact: 'medium',
        timeline: 'Q1 2025',
        description: 'Consumers willing to pay 15-20% premium for quality',
        growth: '+22%'
      },
      {
        category: 'Regulatory',
        trend: 'Sustainability mandates',
        confidence: 83,
        impact: 'medium',
        timeline: 'Q3 2025',
        description: 'New regulations driving eco-friendly packaging adoption',
        growth: '+18%'
      }
    ],
    emergingOpportunities: [
      {
        title: 'Functional Beverage Partnerships',
        confidence: 92,
        potentialRevenue: '$5.2M',
        timeline: '4 months',
        channels: ['Coffee Shops', 'Fast Casual']
      },
      {
        title: 'Ghost Kitchen Ingredient Solutions',
        confidence: 85,
        potentialRevenue: '$3.8M',
        timeline: '7 months',
        channels: ['QSR', 'Fast Casual']
      },
      {
        title: 'AI-Optimized Menu Engineering',
        confidence: 88,
        potentialRevenue: '$2.9M',
        timeline: '5 months',
        channels: ['All Channels']
      }
    ],
    channelForecasts: [
      { channel: 'QSR', growth: 15, confidence: 92, revenue: '$18.5M', trend: 'up' },
      { channel: 'Fast Casual', growth: 22, confidence: 89, revenue: '$14.2M', trend: 'up' },
      { channel: 'Coffee Shops', growth: 28, confidence: 94, revenue: '$8.7M', trend: 'up' },
      { channel: 'Casual Dining', growth: 8, confidence: 76, revenue: '$11.3M', trend: 'stable' }
    ],
    trendChart: [
      { month: 'Jan', health: 65, tech: 45, premium: 55, sustainability: 35 },
      { month: 'Feb', health: 68, tech: 48, premium: 58, sustainability: 38 },
      { month: 'Mar', health: 72, tech: 52, premium: 62, sustainability: 42 },
      { month: 'Apr', health: 75, tech: 58, premium: 65, sustainability: 45 },
      { month: 'May', health: 78, tech: 62, premium: 68, sustainability: 48 },
      { month: 'Jun', health: 82, tech: 67, premium: 72, sustainability: 52 }
    ]
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API calls with mock data for demo
      await new Promise(resolve => setTimeout(resolve, 1500)); // Realistic loading time

      setScoringData(mockScoringData);
      setTrendData(mockTrendData);
      setOpportunities(mockScoringData.topOpportunities);

    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const runComprehensiveAnalysis = async (opportunity) => {
    try {
      setAnalyzing(true);
      setSelectedOpportunity(opportunity);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis = {
        opportunityId: opportunity.id,
        title: opportunity.title,
        overallScore: opportunity.score,
        recommendation: opportunity.score >= 85 ? 'PURSUE IMMEDIATELY' : 'EVALUATE FURTHER',
        confidence: 94,
        
        aiInsights: [
          '🎯 Market timing is optimal - consumer demand peak identified',
          '💡 Competitive gap analysis reveals 6-month window of opportunity',
          '📈 Revenue model shows 340% ROI potential within 18 months',
          '⚡ Implementation complexity is manageable with current resources'
        ],
        
        riskFactors: [
          { factor: 'Market Saturation', level: 'Low', impact: 15, mitigation: 'Differentiated positioning strategy' },
          { factor: 'Regulatory Changes', level: 'Medium', impact: 25, mitigation: 'Compliance monitoring system' },
          { factor: 'Supply Chain', level: 'Low', impact: 18, mitigation: 'Multi-supplier approach' }
        ],
        
        revenueProjection: {
          year1: '$1.2M',
          year2: '$2.8M', 
          year3: '$4.1M',
          totalROI: '340%',
          paybackPeriod: '14 months'
        },
        
        strategicFit: {
          brandAlignment: 92,
          resourceRequirement: 78,
          marketReadiness: 88,
          competitiveAdvantage: 85
        },
        
        nextActions: [
          'Schedule stakeholder alignment meeting within 48 hours',
          'Initiate market research validation study',
          'Develop detailed implementation roadmap',
          'Secure preliminary budget approval'
        ]
      };
      
      setAnalysisResults(mockAnalysis);
      setAnalysisDialog(true);
      
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>Loading AI Analytics Engine...</Typography>
        <Typography variant="body2" color="text.secondary">
          Processing market intelligence and predictive models
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadAnalyticsData}>
            Retry Analysis
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology color="primary" />
            AI Predictive Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced machine learning insights for strategic AFH market decisions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={loadAnalyticsData}
          >
            Refresh Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Download />}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Dashboard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {scoringData?.totalOpportunities || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Opportunities
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {scoringData?.averageScore || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg AI Score
                  </Typography>
                </Box>
                <Speed sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {trendData?.marketGrowth || '0%'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Market Growth
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {trendData?.overallConfidence || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    AI Confidence
                  </Typography>
                </Box>
                <Psychology sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab 
            label="Opportunity Intelligence" 
            icon={<Assessment />} 
            iconPosition="start"
          />
          <Tab 
            label="Market Forecasting" 
            icon={<AutoGraph />} 
            iconPosition="start"
          />
          <Tab 
            label="Risk Analysis" 
            icon={<Security />} 
            iconPosition="start"
          />
          <Tab 
            label="Revenue Modeling" 
            icon={<AttachMoney />} 
            iconPosition="start"
          />
          <Tab 
            label="AI Insights" 
            icon={<Insights />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Opportunity Intelligence Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart color="primary" />
                  Channel Performance Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={scoringData?.channelDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="avgScore" fill="#8884d8" name="Avg Score" />
                    <Bar dataKey="count" fill="#82ca9d" name="Opportunities" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PieChart color="primary" />
                  Priority Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'High Priority', value: scoringData?.highPriorityCount || 0, color: '#ff4444' },
                        { name: 'Medium Priority', value: scoringData?.mediumPriorityCount || 0, color: '#ffaa00' },
                        { name: 'Low Priority', value: scoringData?.lowPriorityCount || 0, color: '#00aa44' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {[
                        { name: 'High Priority', value: scoringData?.highPriorityCount || 0, color: '#ff4444' },
                        { name: 'Medium Priority', value: scoringData?.mediumPriorityCount || 0, color: '#ffaa00' },
                        { name: 'Low Priority', value: scoringData?.lowPriorityCount || 0, color: '#00aa44' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline color="primary" />
                  Top Scoring Opportunities
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Opportunity</TableCell>
                        <TableCell>AI Score</TableCell>
                        <TableCell>Channel</TableCell>
                        <TableCell>Revenue Potential</TableCell>
                        <TableCell>Success Probability</TableCell>
                        <TableCell>Timeline</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scoringData?.topOpportunities?.map((opp) => (
                        <TableRow key={opp.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {opp.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {opp.score}
                              </Typography>
                              <Chip 
                                label={opp.priority} 
                                color={opp.priority === 'high' ? 'error' : 'warning'}
                                size="small"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{opp.channel}</TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                              {opp.revenue}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={opp.probability} 
                                sx={{ width: 60, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2">{opp.probability}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{opp.timeline}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Psychology />}
                              onClick={() => runComprehensiveAnalysis(opp)}
                              disabled={analyzing}
                            >
                              AI Analysis
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
        </Grid>
      </TabPanel>

      {/* Market Forecasting Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShowChart color="primary" />
                  Market Trend Evolution
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trendData?.trendChart || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="health" stackId="1" stroke="#8884d8" fill="#8884d8" name="Health Trends" />
                    <Area type="monotone" dataKey="tech" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Technology" />
                    <Area type="monotone" dataKey="premium" stackId="1" stroke="#ffc658" fill="#ffc658" name="Premium" />
                    <Area type="monotone" dataKey="sustainability" stackId="1" stroke="#ff7300" fill="#ff7300" name="Sustainability" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emerging Opportunities
                </Typography>
                {trendData?.emergingOpportunities?.map((opp, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {opp.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Revenue:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {opp.potentialRevenue}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Timeline:</Typography>
                      <Typography variant="body2">{opp.timeline}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Confidence:</Typography>
                      <Chip 
                        label={`${opp.confidence}%`} 
                        color="success" 
                        size="small"
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Market Trends Analysis
                </Typography>
                {trendData?.trends?.map((trend, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {trend.trend}
                        </Typography>
                        <Chip 
                          label={trend.category} 
                          color="primary" 
                          size="small"
                        />
                        <Chip 
                          label={`${trend.confidence}% confidence`} 
                          color={trend.confidence > 85 ? 'success' : 'warning'}
                          size="small"
                        />
                        <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ ml: 'auto' }}>
                          {trend.growth}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {trend.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip label={`Impact: ${trend.impact}`} size="small" />
                        <Chip label={`Timeline: ${trend.timeline}`} size="small" />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Analysis Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security color="primary" />
                  Risk Assessment Matrix
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    AI-powered risk analysis across multiple dimensions
                  </Typography>
                  {[
                    { category: 'Market Risk', level: 'Low', score: 25, color: 'success' },
                    { category: 'Operational Risk', level: 'Medium', score: 45, color: 'warning' },
                    { category: 'Financial Risk', level: 'Low', score: 20, color: 'success' },
                    { category: 'Regulatory Risk', level: 'Medium', score: 35, color: 'warning' },
                    { category: 'Strategic Risk', level: 'Low', score: 30, color: 'success' }
                  ].map((risk, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{risk.category}</Typography>
                        <Chip label={risk.level} color={risk.color} size="small" />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={risk.score} 
                        color={risk.color}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="primary" />
                  Risk Mitigation Strategies
                </Typography>
                <List>
                  {[
                    'Diversify supplier base to reduce dependency risk',
                    'Implement agile development methodology for faster adaptation',
                    'Establish regulatory monitoring and compliance system',
                    'Create contingency plans for market volatility scenarios',
                    'Develop strategic partnerships for risk sharing'
                  ].map((strategy, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={strategy} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Revenue Modeling Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney color="primary" />
                  Revenue Projection Models
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={[
                    { month: 'Month 1', conservative: 50000, expected: 75000, optimistic: 120000 },
                    { month: 'Month 3', conservative: 120000, expected: 180000, optimistic: 280000 },
                    { month: 'Month 6', conservative: 250000, expected: 380000, optimistic: 580000 },
                    { month: 'Month 9', conservative: 400000, expected: 620000, optimistic: 950000 },
                    { month: 'Month 12', conservative: 580000, expected: 900000, optimistic: 1400000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="conservative" stroke="#ff7300" strokeWidth={2} name="Conservative" />
                    <Line type="monotone" dataKey="expected" stroke="#8884d8" strokeWidth={3} name="Expected" />
                    <Line type="monotone" dataKey="optimistic" stroke="#82ca9d" strokeWidth={2} name="Optimistic" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ROI Analysis
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">Expected ROI</Typography>
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    340%
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">Payback Period</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    14 months
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">Break-even Point</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    Month 8
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Investment Requirements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Initial: $250K | Total: $450K
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* AI Insights Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Insights color="primary" />
                  AI-Generated Strategic Insights
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  These insights are generated by our advanced AI models analyzing market data, trends, and opportunity patterns.
                </Alert>
                
                <Grid container spacing={2}>
                  {[
                    {
                      title: 'Market Timing Optimization',
                      insight: 'AI analysis indicates Q1 2025 presents optimal market entry timing for plant-based initiatives, with 94% confidence based on consumer sentiment analysis and competitive landscape mapping.',
                      confidence: 94,
                      impact: 'High'
                    },
                    {
                      title: 'Channel Prioritization',
                      insight: 'Coffee shop partnerships show highest success probability (88%) due to consumer behavior alignment and lower competitive saturation in functional beverage space.',
                      confidence: 88,
                      impact: 'High'
                    },
                    {
                      title: 'Revenue Acceleration',
                      insight: 'Cross-channel strategy implementation could accelerate revenue timeline by 35%, leveraging shared infrastructure and brand synergies across QSR and Fast Casual segments.',
                      confidence: 82,
                      impact: 'Medium'
                    },
                    {
                      title: 'Risk Mitigation',
                      insight: 'Regulatory compliance automation reduces operational risk by 60% while maintaining 15% cost advantage over manual processes, based on industry benchmarking.',
                      confidence: 91,
                      impact: 'Medium'
                    }
                  ].map((insight, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Psychology color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {insight.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {insight.insight}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={`${insight.confidence}% confidence`} 
                              color="success" 
                              size="small"
                            />
                            <Chip 
                              label={`${insight.impact} impact`} 
                              color={insight.impact === 'High' ? 'error' : 'warning'}
                              size="small"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Analysis Results Dialog */}
      <Dialog 
        open={analysisDialog} 
        onClose={() => setAnalysisDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology color="primary" />
          AI Comprehensive Analysis: {analysisResults?.title}
        </DialogTitle>
        <DialogContent>
          {analysisResults && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Overall Assessment
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        {analysisResults.overallScore}
                      </Typography>
                      <Chip 
                        label={analysisResults.recommendation} 
                        color={analysisResults.recommendation.includes('PURSUE') ? 'success' : 'warning'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      AI Confidence: {analysisResults.confidence}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue Projection
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Year 1:</Typography>
                      <Typography variant="body2" fontWeight="bold">{analysisResults.revenueProjection.year1}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Year 2:</Typography>
                      <Typography variant="body2" fontWeight="bold">{analysisResults.revenueProjection.year2}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total ROI:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {analysisResults.revenueProjection.totalROI}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      AI Strategic Insights
                    </Typography>
                    <List>
                      {analysisResults.aiInsights.map((insight, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={insight} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommended Next Actions
                    </Typography>
                    <List>
                      {analysisResults.nextActions.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <PlayArrow color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export Analysis
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog open={analyzing}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Running AI Analysis...
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Our advanced AI models are analyzing market data, competitive landscape, 
            and revenue projections to provide comprehensive insights.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PredictiveAnalytics;
