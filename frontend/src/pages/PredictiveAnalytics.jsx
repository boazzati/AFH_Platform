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
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  PredictiveText,
  Warning,
  MonetizationOn,
  Timeline,
  ExpandMore,
  Refresh,
  Download,
  Info,
  CheckCircle,
  Error,
  Speed,
  Analytics,
  Insights,
  TrendingDown,
  TrendingFlat,
  Star,
  Schedule,
  AttachMoney,
  Security
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PredictiveAnalytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [scoringData, setScoringData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Analysis states
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all analytics data
      const [scoring, trends, opportunities] = await Promise.all([
        predictiveAnalyticsApi.getScoringStatistics(),
        predictiveAnalyticsApi.getTrendForecast(),
        api.get('/api/market-signals')
      ]);

      setScoringData(scoring.data);
      setTrendData(trends.data);
      setOpportunities(opportunities.data || []);

    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const runPredictiveAnalysis = async (opportunityId) => {
    try {
      setAnalyzing(true);
      const response = await predictiveAnalyticsApi.runComprehensiveAnalysis(opportunityId);
      setAnalysisResults(response.data);
      setSelectedOpportunity(opportunities.find(o => o._id === opportunityId));
    } catch (error) {
      console.error('Error running analysis:', error);
      setError('Failed to run predictive analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={loadAnalyticsData} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Predictive Analytics
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AI-powered opportunity scoring, trend forecasting, and risk assessment
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAnalyticsData}
            sx={{ mr: 2 }}
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Assessment />} label="Opportunity Scoring" />
          <Tab icon={<TrendingUp />} label="Trend Forecasting" />
          <Tab icon={<Security />} label="Risk Assessment" />
          <Tab icon={<MonetizationOn />} label="Revenue Prediction" />
          <Tab icon={<Analytics />} label="Comprehensive Analysis" />
        </Tabs>
      </Box>

      {/* Opportunity Scoring Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Scoring Overview */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scoring Overview
                </Typography>
                {scoringData && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Total Scored</Typography>
                      <Typography variant="h6">{scoringData.totalScored}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Average Score</Typography>
                      <Typography variant="h6" sx={{ color: getScoreColor(scoringData.averageScore) }}>
                        {scoringData.averageScore}/100
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>Priority Distribution</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`High: ${scoringData.priorityDistribution.high}`} 
                        color="error" 
                        size="small" 
                      />
                      <Chip 
                        label={`Medium: ${scoringData.priorityDistribution.medium}`} 
                        color="warning" 
                        size="small" 
                      />
                      <Chip 
                        label={`Low: ${scoringData.priorityDistribution.low}`} 
                        color="success" 
                        size="small" 
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Performing Channels */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performing Channels
                </Typography>
                {scoringData?.topPerformingChannels && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoringData.topPerformingChannels}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="averageScore" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Opportunities */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Opportunities with Scores
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Opportunity</TableCell>
                        <TableCell>Channel</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Success Probability</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {opportunities.slice(0, 10).map((opportunity) => (
                        <TableRow key={opportunity._id}>
                          <TableCell>{opportunity.title}</TableCell>
                          <TableCell>
                            <Chip label={opportunity.channel} size="small" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ color: getScoreColor(opportunity.scoring?.overallScore || 50) }}
                              >
                                {opportunity.scoring?.overallScore || 'N/A'}
                              </Typography>
                              {opportunity.scoring?.overallScore && (
                                <LinearProgress
                                  variant="determinate"
                                  value={opportunity.scoring.overallScore}
                                  sx={{ width: 60, height: 6 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={opportunity.priority} 
                              color={
                                opportunity.priority === 'high' ? 'error' :
                                opportunity.priority === 'medium' ? 'warning' : 'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {opportunity.scoring?.successProbability ? 
                              `${opportunity.scoring.successProbability}%` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => runPredictiveAnalysis(opportunity._id)}
                              disabled={analyzing}
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
        </Grid>
      </TabPanel>

      {/* Trend Forecasting Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Trend Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Trend Forecast
                </Typography>
                {trendData && (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Forecast Confidence: {trendData.confidence}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={trendData.confidence} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    {trendData.topTrends && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Top Growing Trends
                        </Typography>
                        {trendData.topTrends.map((trend, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{trend.trend}</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ color: trend.growth > 0 ? '#4caf50' : '#f44336' }}
                            >
                              {formatPercentage(trend.growth)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Emerging Opportunities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emerging Opportunities
                </Typography>
                {trendData && (
                  <Box>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {trendData.emergingCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      New opportunities identified
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 2 }}
                      startIcon={<Insights />}
                    >
                      View Details
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Trend Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trend Growth Patterns
                </Typography>
                {trendData?.topTrends && (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={trendData.topTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="trend" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="growth" 
                        stroke="#1976d2" 
                        strokeWidth={2}
                        dot={{ fill: '#1976d2' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="strength" 
                        stroke="#ff9800" 
                        strokeWidth={2}
                        dot={{ fill: '#ff9800' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Assessment Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Risk assessment provides comprehensive analysis of market, operational, financial, and regulatory risks for each opportunity.
            </Alert>
          </Grid>

          {/* Risk Categories */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Categories
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Market Risk" 
                      secondary="Competition, saturation, demand changes"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Speed color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Operational Risk" 
                      secondary="Execution, supply chain, quality"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MonetizationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Financial Risk" 
                      secondary="Payment, costs, profitability"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Regulatory Risk" 
                      secondary="Compliance, changes, requirements"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Mitigation */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Mitigation Strategies
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Proactive Measures
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Market research and competitive analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Operational excellence and quality controls
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Financial monitoring and reserves
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Regulatory compliance and monitoring
                  </Typography>
                </Box>
                <Button variant="outlined" startIcon={<Info />}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Analysis Results */}
          {analysisResults?.riskAssessment && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Risk Analysis Results
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: getRiskColor(analysisResults.riskAssessment.riskLevel) }}>
                          {analysisResults.riskAssessment.overallRiskScore}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Risk Score
                        </Typography>
                        <Chip 
                          label={analysisResults.riskAssessment.riskLevel} 
                          color={
                            analysisResults.riskAssessment.riskLevel === 'low' ? 'success' :
                            analysisResults.riskAssessment.riskLevel === 'medium' ? 'warning' : 'error'
                          }
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Typography variant="subtitle2" gutterBottom>
                        Top Risks
                      </Typography>
                      {analysisResults.riskAssessment.topRisks?.map((risk, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">{risk.description}</Typography>
                            <Chip 
                              label={risk.impact} 
                              size="small"
                              color={
                                risk.impact === 'low' ? 'success' :
                                risk.impact === 'medium' ? 'warning' : 'error'
                              }
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={risk.score} 
                            sx={{ mt: 0.5, height: 4 }}
                          />
                        </Box>
                      ))}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Revenue Prediction Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Revenue Scenarios */}
          {analysisResults?.revenuePrediction && (
            <>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Conservative
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {formatCurrency(analysisResults.revenuePrediction.scenarios.conservative.total)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Probability: {formatPercentage(analysisResults.revenuePrediction.scenarios.conservative.probability * 100)}
                    </Typography>
                    <List dense sx={{ mt: 1 }}>
                      {analysisResults.revenuePrediction.scenarios.conservative.assumptions?.map((assumption, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            • {assumption}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      Expected
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {formatCurrency(analysisResults.revenuePrediction.scenarios.expected.total)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Probability: {formatPercentage(analysisResults.revenuePrediction.scenarios.expected.probability * 100)}
                    </Typography>
                    <List dense sx={{ mt: 1 }}>
                      {analysisResults.revenuePrediction.scenarios.expected.assumptions?.map((assumption, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            • {assumption}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="warning.main">
                      Optimistic
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {formatCurrency(analysisResults.revenuePrediction.scenarios.optimistic.total)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Probability: {formatPercentage(analysisResults.revenuePrediction.scenarios.optimistic.probability * 100)}
                    </Typography>
                    <List dense sx={{ mt: 1 }}>
                      {analysisResults.revenuePrediction.scenarios.optimistic.assumptions?.map((assumption, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            • {assumption}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Revenue Timeline */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue Timeline Projections
                    </Typography>
                    {analysisResults.revenuePrediction.timeProjections && (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={[
                          { period: '3 Months', conservative: analysisResults.revenuePrediction.timeProjections.conservative.month3, expected: analysisResults.revenuePrediction.timeProjections.expected.month3, optimistic: analysisResults.revenuePrediction.timeProjections.optimistic.month3 },
                          { period: '6 Months', conservative: analysisResults.revenuePrediction.timeProjections.conservative.month6, expected: analysisResults.revenuePrediction.timeProjections.expected.month6, optimistic: analysisResults.revenuePrediction.timeProjections.optimistic.month6 },
                          { period: '12 Months', conservative: analysisResults.revenuePrediction.timeProjections.conservative.month12, expected: analysisResults.revenuePrediction.timeProjections.expected.month12, optimistic: analysisResults.revenuePrediction.timeProjections.optimistic.month12 },
                          { period: '24 Months', conservative: analysisResults.revenuePrediction.timeProjections.conservative.month24, expected: analysisResults.revenuePrediction.timeProjections.expected.month24, optimistic: analysisResults.revenuePrediction.timeProjections.optimistic.month24 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                          <Area type="monotone" dataKey="conservative" stackId="1" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="expected" stackId="2" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="optimistic" stackId="3" stroke="#ff9800" fill="#ff9800" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* ROI Analysis */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ROI Analysis
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Scenario</TableCell>
                            <TableCell>Revenue</TableCell>
                            <TableCell>Investment</TableCell>
                            <TableCell>Gross Profit</TableCell>
                            <TableCell>ROI</TableCell>
                            <TableCell>Payback Period</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {analysisResults.revenuePrediction.roiEstimates && Object.entries(analysisResults.revenuePrediction.roiEstimates).map(([scenario, roi]) => (
                            <TableRow key={scenario}>
                              <TableCell>
                                <Chip 
                                  label={scenario} 
                                  color={scenario === 'expected' ? 'primary' : 'default'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{formatCurrency(roi.revenue)}</TableCell>
                              <TableCell>{formatCurrency(roi.investment)}</TableCell>
                              <TableCell>{formatCurrency(roi.grossProfit)}</TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ color: roi.roi > 0 ? '#4caf50' : '#f44336' }}
                                >
                                  {formatPercentage(roi.roi)}
                                </Typography>
                              </TableCell>
                              <TableCell>{roi.paybackPeriod} months</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {!analysisResults && (
            <Grid item xs={12}>
              <Alert severity="info">
                Select an opportunity from the Opportunity Scoring tab and run analysis to see revenue predictions.
              </Alert>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Comprehensive Analysis Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          {selectedOpportunity && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Analyzing: {selectedOpportunity.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={selectedOpportunity.channel} size="small" />
                    <Chip label={selectedOpportunity.priority} size="small" color="primary" />
                  </Box>
                  {analyzing && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2">Running comprehensive analysis...</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {analysisResults && (
            <>
              {/* Overall Score */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Opportunity Score
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ color: getScoreColor(analysisResults.opportunityScore.overall) }}>
                        {analysisResults.opportunityScore.overall}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Score
                      </Typography>
                      <Chip 
                        label={analysisResults.opportunityScore.recommendation} 
                        color={
                          analysisResults.opportunityScore.recommendation === 'pursue' ? 'success' :
                          analysisResults.opportunityScore.recommendation === 'evaluate' ? 'warning' : 'error'
                        }
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Score Breakdown */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Score Breakdown
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={[
                        { subject: 'Revenue Potential', score: analysisResults.opportunityScore.revenue, fullMark: 100 },
                        { subject: 'Risk Level', score: analysisResults.opportunityScore.risk, fullMark: 100 },
                        { subject: 'Market Timing', score: 75, fullMark: 100 },
                        { subject: 'Competitive Position', score: 80, fullMark: 100 },
                        { subject: 'Strategic Fit', score: 70, fullMark: 100 },
                        { subject: 'Execution Feasibility', score: 85, fullMark: 100 }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Score" dataKey="score" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Strategic Recommendations */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Strategic Recommendations
                    </Typography>
                    {analysisResults.strategicRecommendations?.map((rec, index) => (
                      <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Chip 
                              label={rec.priority} 
                              size="small"
                              color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'}
                            />
                            <Typography variant="subtitle1">{rec.action}</Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {rec.rationale}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip label={`Type: ${rec.type}`} size="small" variant="outlined" />
                            <Chip label={`Timeline: ${rec.timeline}`} size="small" variant="outlined" />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Analysis Confidence */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Analysis Confidence
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h4" color="primary">
                        {analysisResults.overallConfidence}%
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={analysisResults.overallConfidence} 
                          sx={{ height: 8 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Based on data quality, model accuracy, and market conditions
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {!selectedOpportunity && (
            <Grid item xs={12}>
              <Alert severity="info">
                Select an opportunity from the Opportunity Scoring tab to run comprehensive analysis.
              </Alert>
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default PredictiveAnalytics;
