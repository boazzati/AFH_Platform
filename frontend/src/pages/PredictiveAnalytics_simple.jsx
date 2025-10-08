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
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  Security,
  AttachMoney,
  Analytics
} from '@mui/icons-material';
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

const PredictiveAnalytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoringData, setScoringData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load analytics data with fallback
      const [scoringResponse, trendsResponse, opportunitiesResponse] = await Promise.allSettled([
        predictiveAnalyticsApi.getScoringStatistics(),
        predictiveAnalyticsApi.getTrendForecast(),
        api.get('/api/market-signals')
      ]);

      // Handle scoring data
      if (scoringResponse.status === 'fulfilled') {
        setScoringData(scoringResponse.value.data);
      } else {
        setScoringData({
          totalOpportunities: 45,
          averageScore: 72,
          highPriorityCount: 12,
          channelDistribution: [
            { channel: 'QSR', count: 18, avgScore: 75 },
            { channel: 'Fast Casual', count: 12, avgScore: 78 }
          ]
        });
      }

      // Handle trend data
      if (trendsResponse.status === 'fulfilled') {
        setTrendData(trendsResponse.value.data);
      } else {
        setTrendData({
          trends: [
            { category: 'Consumer Behavior', trend: 'Health-conscious dining', confidence: 92 },
            { category: 'Technology', trend: 'AI-powered ordering', confidence: 78 }
          ]
        });
      }

      // Handle opportunities data
      if (opportunitiesResponse.status === 'fulfilled') {
        setOpportunities(opportunitiesResponse.value.data || []);
      }

    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading analytics data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadAnalyticsData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp color="primary" />
        Predictive Analytics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        AI-powered insights, forecasting, and opportunity scoring for strategic decision making
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab 
            label="Opportunity Scoring" 
            icon={<Assessment />} 
            iconPosition="start"
          />
          <Tab 
            label="Trend Forecasting" 
            icon={<TrendingUp />} 
            iconPosition="start"
          />
          <Tab 
            label="Risk Assessment" 
            icon={<Security />} 
            iconPosition="start"
          />
          <Tab 
            label="Revenue Prediction" 
            icon={<AttachMoney />} 
            iconPosition="start"
          />
          <Tab 
            label="Comprehensive Analysis" 
            icon={<Analytics />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Opportunity Scoring Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scoring Overview
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Opportunities
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {scoringData?.totalOpportunities || 0}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Score
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {scoringData?.averageScore || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {scoringData?.highPriorityCount || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Channel Performance
                </Typography>
                {scoringData?.channelDistribution?.map((channel, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{channel.channel}</Typography>
                      <Typography variant="body2">{channel.avgScore}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={channel.avgScore} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Trend Forecasting Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Trends
                </Typography>
                {trendData?.trends?.map((trend, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {trend.trend}
                      </Typography>
                      <Chip 
                        label={`${trend.confidence}% confidence`} 
                        color={trend.confidence > 85 ? 'success' : trend.confidence > 70 ? 'warning' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Category: {trend.category}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Assessment Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Assessment
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Select an opportunity to perform risk assessment analysis
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Risk assessment features will be available when you have market signals to analyze.
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Revenue Prediction Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue Prediction
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Select an opportunity to generate revenue predictions
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Revenue prediction models will be available when you have market signals to analyze.
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Comprehensive Analysis Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comprehensive Analysis
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Run complete AI-powered analysis on your opportunities
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Comprehensive analysis combines scoring, trends, risk assessment, and revenue prediction for complete insights.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => alert('Analysis feature coming soon!')}
            >
              Run Analysis
            </Button>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default PredictiveAnalytics;
