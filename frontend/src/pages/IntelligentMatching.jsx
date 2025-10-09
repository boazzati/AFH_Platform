import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Insights as InsightsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [matchingOverview, setMatchingOverview] = useState(null);
  const [productMatches, setProductMatches] = useState([]);
  const [expertRecommendations, setExpertRecommendations] = useState([]);
  const [playbookSuggestions, setPlaybookSuggestions] = useState([]);
  const [nextBestActions, setNextBestActions] = useState([]);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  
  // Dialog states
  const [matchingDialog, setMatchingDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState('');
  const [matchingResults, setMatchingResults] = useState(null);

  // Mock opportunities for selection
  const mockOpportunities = [
    { id: 'opp_001', title: 'Starbucks Menu Innovation Partnership', channel: 'Coffee' },
    { id: 'opp_002', title: 'McDonald\'s Digital Ordering Integration', channel: 'QSR' },
    { id: 'opp_003', title: 'Chipotle Supply Chain Optimization', channel: 'Fast Casual' },
    { id: 'opp_004', title: 'Panera Sustainability Initiative', channel: 'Fast Casual' },
    { id: 'opp_005', title: 'Domino\'s Technology Platform', channel: 'QSR' }
  ];

  useEffect(() => {
    loadMatchingOverview();
  }, []);

  const loadMatchingOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demonstration
      setMatchingOverview({
        totalOpportunities: 127,
        matchedOpportunities: 98,
        matchingAccuracy: 0.89,
        averageScore: 0.76,
        activeWorkflows: 23,
        completedMatches: 156,
        expertEngagements: 34,
        playbookImplementations: 28
      });

      setWorkflowStatus({
        automationEnabled: true,
        lastUpdate: new Date().toISOString(),
        processingQueue: 5,
        successRate: 0.91,
        averageProcessingTime: '2.3 minutes'
      });

    } catch (err) {
      console.error('Error loading matching overview:', err);
      setError('Failed to load matching data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const runIntelligentMatching = async () => {
    if (!selectedOpportunity) return;

    try {
      setLoading(true);
      setError(null);

      // Mock comprehensive matching results
      const mockResults = {
        opportunity: mockOpportunities.find(o => o.id === selectedOpportunity),
        productMatches: [
          {
            product: {
              name: 'Menu Innovation Platform',
              category: 'Food Innovation',
              channels: ['QSR', 'Fast Casual', 'Coffee']
            },
            score: { overall: 0.92, confidence: 0.88 },
            reasoning: 'Perfect alignment with innovation requirements and channel expertise',
            revenue: { scenarios: { expected: { revenue: 3.2, timeline: '12-18 months' } } }
          },
          {
            product: {
              name: 'Digital Ordering Solutions',
              category: 'Technology',
              channels: ['QSR', 'Fast Casual', 'Coffee']
            },
            score: { overall: 0.85, confidence: 0.82 },
            reasoning: 'Strong technology fit with proven implementation track record',
            revenue: { scenarios: { expected: { revenue: 2.8, timeline: '9-15 months' } } }
          }
        ],
        expertRecommendations: [
          {
            expert: {
              name: 'Sarah Chen',
              title: 'Former VP of Innovation, Starbucks',
              expertise: ['Coffee', 'Menu Innovation', 'Digital Transformation'],
              hourlyRate: 450,
              availability: 'Available'
            },
            score: { overall: 0.94, confidence: 0.91 },
            reasoning: 'Exceptional expertise match with direct industry experience',
            recommendedRole: 'Innovation Strategy Lead'
          },
          {
            expert: {
              name: 'David Thompson',
              title: 'Former Head of Technology, Domino\'s Pizza',
              expertise: ['Technology', 'Digital Innovation', 'Mobile Apps'],
              hourlyRate: 425,
              availability: 'Available'
            },
            score: { overall: 0.87, confidence: 0.84 },
            reasoning: 'Strong technology leadership with proven digital transformation results',
            recommendedRole: 'Technology Integration Advisor'
          }
        ],
        playbookRecommendations: [
          {
            playbook: {
              title: 'Menu Innovation & Product Launch',
              category: 'Product Development',
              successRate: 0.72,
              averageDuration: '32 weeks',
              estimatedROI: '15-25%'
            },
            score: { overall: 0.89, confidence: 0.86 },
            reasoning: 'Direct methodology match with proven success in similar initiatives',
            timeline: { adjustedWeeks: 28, totalWeeks: 28 }
          },
          {
            playbook: {
              title: 'Digital Ordering & Technology Integration',
              category: 'Technology',
              successRate: 0.81,
              averageDuration: '40 weeks',
              estimatedROI: '20-30%'
            },
            score: { overall: 0.82, confidence: 0.79 },
            reasoning: 'Strong technology implementation framework with high success rate',
            timeline: { adjustedWeeks: 35, totalWeeks: 35 }
          }
        ],
        nextBestActions: [
          {
            title: 'Conduct Market Research',
            description: 'Research Coffee market dynamics and competitive landscape',
            priority: 'High',
            timeframe: '1-2 weeks',
            category: 'Research'
          },
          {
            title: 'Identify Key Stakeholders',
            description: 'Map and prioritize key decision makers and influencers',
            priority: 'High',
            timeframe: '1 week',
            category: 'Stakeholder Management'
          },
          {
            title: 'Develop Partnership Proposal',
            description: 'Create comprehensive partnership proposal with value proposition',
            priority: 'High',
            timeframe: '3-4 weeks',
            category: 'Proposal Development'
          }
        ]
      };

      setMatchingResults(mockResults);
      setProductMatches(mockResults.productMatches);
      setExpertRecommendations(mockResults.expertRecommendations);
      setPlaybookSuggestions(mockResults.playbookRecommendations);
      setNextBestActions(mockResults.nextBestActions);

    } catch (err) {
      console.error('Error running intelligent matching:', err);
      setError('Failed to run intelligent matching');
    } finally {
      setLoading(false);
      setMatchingDialog(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#4caf50';
    if (score >= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Medium': return '#1976d2';
      case 'Low': return '#388e3c';
      default: return '#757575';
    }
  };

  // Chart data
  const matchingTrendData = [
    { month: 'Jan', matches: 12, accuracy: 0.85 },
    { month: 'Feb', matches: 18, accuracy: 0.87 },
    { month: 'Mar', matches: 24, accuracy: 0.89 },
    { month: 'Apr', matches: 31, accuracy: 0.91 },
    { month: 'May', matches: 28, accuracy: 0.88 },
    { month: 'Jun', matches: 35, accuracy: 0.92 }
  ];

  const categoryDistribution = [
    { name: 'Product Matching', value: 35, color: '#8884d8' },
    { name: 'Expert Recommendations', value: 28, color: '#82ca9d' },
    { name: 'Playbook Suggestions', value: 22, color: '#ffc658' },
    { name: 'Action Planning', value: 15, color: '#ff7300' }
  ];

  const performanceMetrics = [
    { metric: 'Accuracy', current: 89, target: 90, color: '#4caf50' },
    { metric: 'Speed', current: 92, target: 85, color: '#2196f3' },
    { metric: 'Coverage', current: 77, target: 80, color: '#ff9800' },
    { metric: 'Satisfaction', current: 94, target: 90, color: '#9c27b0' }
  ];

  if (loading && !matchingOverview) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Intelligent Matching...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          <AutoAwesomeIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#1976d2' }} />
          Intelligent Matching & Recommendations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          AI-powered opportunity matching, expert recommendations, and intelligent workflow orchestration
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      {matchingOverview && (
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
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {matchingOverview.matchedOpportunities}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Matched Opportunities
                    </Typography>
                  </Box>
                  <PsychologyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(matchingOverview.matchedOpportunities / matchingOverview.totalOpportunities) * 100}
                  sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
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
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {Math.round(matchingOverview.matchingAccuracy * 100)}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Matching Accuracy
                    </Typography>
                  </Box>
                  <SpeedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={matchingOverview.matchingAccuracy * 100}
                  sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
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
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {matchingOverview.activeWorkflows}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Workflows
                    </Typography>
                  </Box>
                  <TimelineIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  {workflowStatus?.processingQueue} in queue
                </Typography>
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
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {Math.round(matchingOverview.averageScore * 100)}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Average Score
                    </Typography>
                  </Box>
                  <InsightsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  {workflowStatus?.averageProcessingTime} avg time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PlayArrowIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setMatchingDialog(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }}
            >
              Run Intelligent Matching
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadMatchingOverview}
              disabled={loading}
            >
              Refresh Data
            </Button>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
            >
              Configure Matching
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="matching tabs">
            <Tab label="Overview & Analytics" icon={<AnalyticsIcon />} />
            <Tab label="Product Matching" icon={<BusinessIcon />} />
            <Tab label="Expert Recommendations" icon={<PersonIcon />} />
            <Tab label="Playbook Intelligence" icon={<MenuBookIcon />} />
            <Tab label="Action Planning" icon={<AssignmentIcon />} />
          </Tabs>
        </Box>

        {/* Overview & Analytics Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Matching Trends Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Matching Performance Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={matchingTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="matches" fill="#8884d8" name="Matches" />
                      <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={3} name="Accuracy" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Distribution */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Matching Categories
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={3}>
                    {performanceMetrics.map((metric, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: metric.color, fontWeight: 'bold' }}>
                            {metric.current}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metric.metric}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={metric.current}
                            sx={{ 
                              mt: 1, 
                              height: 8, 
                              borderRadius: 4,
                              '& .MuiLinearProgress-bar': { backgroundColor: metric.color }
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Target: {metric.target}%
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Product Matching Tab */}
        <TabPanel value={tabValue} index={1}>
          {productMatches.length > 0 ? (
            <Grid container spacing={3}>
              {productMatches.map((match, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {match.product.name}
                          </Typography>
                          <Chip 
                            label={match.product.category} 
                            size="small" 
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h5" sx={{ color: getScoreColor(match.score.overall), fontWeight: 'bold' }}>
                            {Math.round(match.score.overall * 100)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Match Score
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {match.reasoning}
                      </Typography>

                      <Box display="flex" gap={1} mb={2}>
                        {match.product.channels.map((channel, idx) => (
                          <Chip key={idx} label={channel} size="small" variant="outlined" />
                        ))}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Expected Revenue
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${match.revenue.scenarios.expected.revenue}M
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Timeline
                          </Typography>
                          <Typography variant="h6">
                            {match.revenue.scenarios.expected.timeline}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box mt={2}>
                        <LinearProgress
                          variant="determinate"
                          value={match.score.confidence * 100}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': { backgroundColor: getScoreColor(match.score.confidence) }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Confidence: {Math.round(match.score.confidence * 100)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No product matches available. Run intelligent matching to see recommendations.
            </Alert>
          )}
        </TabPanel>

        {/* Expert Recommendations Tab */}
        <TabPanel value={tabValue} index={2}>
          {expertRecommendations.length > 0 ? (
            <Grid container spacing={3}>
              {expertRecommendations.map((recommendation, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="flex-start" mb={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {recommendation.expert.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h6">
                            {recommendation.expert.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recommendation.expert.title}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            <StarIcon sx={{ color: '#ffc107', fontSize: 20, mr: 0.5 }} />
                            <Typography variant="h6" sx={{ color: getScoreColor(recommendation.score.overall), fontWeight: 'bold' }}>
                              {Math.round(recommendation.score.overall * 100)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              Match Score
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {recommendation.reasoning}
                      </Typography>

                      <Box display="flex" gap={1} mb={2}>
                        {recommendation.expert.expertise.map((skill, idx) => (
                          <Chip key={idx} label={skill} size="small" variant="outlined" />
                        ))}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Hourly Rate
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${recommendation.expert.hourlyRate}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Availability
                          </Typography>
                          <Chip 
                            label={recommendation.expert.availability}
                            size="small"
                            color={recommendation.expert.availability === 'Available' ? 'success' : 'warning'}
                          />
                        </Grid>
                      </Grid>

                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                          Recommended Role
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {recommendation.recommendedRole}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No expert recommendations available. Run intelligent matching to see suggestions.
            </Alert>
          )}
        </TabPanel>

        {/* Playbook Intelligence Tab */}
        <TabPanel value={tabValue} index={3}>
          {playbookSuggestions.length > 0 ? (
            <Grid container spacing={3}>
              {playbookSuggestions.map((suggestion, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {suggestion.playbook.title}
                              </Typography>
                              <Chip 
                                label={suggestion.playbook.category} 
                                size="small" 
                                sx={{ mb: 1 }}
                              />
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="h5" sx={{ color: getScoreColor(suggestion.score.overall), fontWeight: 'bold' }}>
                                {Math.round(suggestion.score.overall * 100)}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Relevance Score
                              </Typography>
                            </Box>
                          </Box>

                          <Typography variant="body2" color="text.secondary" paragraph>
                            {suggestion.reasoning}
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">
                                Success Rate
                              </Typography>
                              <Typography variant="h6" color="success.main">
                                {Math.round(suggestion.playbook.successRate * 100)}%
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">
                                Duration
                              </Typography>
                              <Typography variant="h6">
                                {suggestion.timeline.adjustedWeeks} weeks
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">
                                Expected ROI
                              </Typography>
                              <Typography variant="h6" color="primary">
                                {suggestion.playbook.estimatedROI}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box height="100%" display="flex" flexDirection="column" justifyContent="center">
                            <LinearProgress
                              variant="determinate"
                              value={suggestion.score.confidence * 100}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                mb: 1,
                                '& .MuiLinearProgress-bar': { backgroundColor: getScoreColor(suggestion.score.confidence) }
                              }}
                            />
                            <Typography variant="caption" color="text.secondary" textAlign="center">
                              Confidence: {Math.round(suggestion.score.confidence * 100)}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No playbook suggestions available. Run intelligent matching to see recommendations.
            </Alert>
          )}
        </TabPanel>

        {/* Action Planning Tab */}
        <TabPanel value={tabValue} index={4}>
          {nextBestActions.length > 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Action</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Timeframe</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nextBestActions.map((action, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {action.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {action.description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={action.priority}
                              size="small"
                              sx={{ 
                                bgcolor: getPriorityColor(action.priority),
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={action.category} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {action.timeframe}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label="Recommended"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">
              No action recommendations available. Run intelligent matching to see next best actions.
            </Alert>
          )}
        </TabPanel>
      </Card>

      {/* Intelligent Matching Dialog */}
      <Dialog 
        open={matchingDialog} 
        onClose={() => setMatchingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <AutoAwesomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Run Intelligent Matching
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select an opportunity to run comprehensive AI-powered matching analysis including product recommendations, expert suggestions, playbook intelligence, and action planning.
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Opportunity</InputLabel>
            <Select
              value={selectedOpportunity}
              onChange={(e) => setSelectedOpportunity(e.target.value)}
              label="Select Opportunity"
            >
              {mockOpportunities.map((opp) => (
                <MenuItem key={opp.id} value={opp.id}>
                  <Box>
                    <Typography variant="subtitle2">{opp.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {opp.channel} Channel
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMatchingDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={runIntelligentMatching}
            variant="contained"
            disabled={!selectedOpportunity || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          >
            {loading ? 'Processing...' : 'Run Matching'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IntelligentMatching;
