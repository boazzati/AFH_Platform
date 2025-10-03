import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Equalizer,
  BarChart,
  Download,
  Share,
  EmojiEvents,
  Insights
} from '@mui/icons-material';

const Benchmarking = () => {
  const [timeframe, setTimeframe] = useState('q1');
  const [channel, setChannel] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  const performanceData = [
    {
      metric: 'Account Win Rate',
      yourPerformance: 42,
      benchmark: 38,
      difference: 4,
      status: 'outperform'
    },
    {
      metric: 'Pilot-to-Launch Conversion',
      yourPerformance: 68,
      benchmark: 62,
      difference: 6,
      status: 'outperform'
    },
    {
      metric: 'Average Contract Value',
      yourPerformance: 125000,
      benchmark: 142000,
      difference: -17000,
      status: 'underperform'
    },
    {
      metric: 'Sales Cycle Length (days)',
      yourPerformance: 45,
      benchmark: 52,
      difference: -7,
      status: 'better'
    },
    {
      metric: 'Account Retention Rate',
      yourPerformance: 92,
      benchmark: 88,
      difference: 4,
      status: 'outperform'
    },
    {
      metric: 'Market Share Growth',
      yourPerformance: 3.2,
      benchmark: 2.1,
      difference: 1.1,
      status: 'outperform'
    }
  ];

  const channelPerformance = [
    { channel: 'QSR', yourGrowth: 15.2, industryAvg: 12.8, trend: 'up' },
    { channel: 'Workplace', yourGrowth: 8.7, industryAvg: 6.3, trend: 'up' },
    { channel: 'Leisure', yourGrowth: 12.1, industryAvg: 14.2, trend: 'down' },
    { channel: 'Education', yourGrowth: 5.4, industryAvg: 4.8, trend: 'up' },
    { channel: 'Healthcare', yourGrowth: 3.2, industryAvg: 2.9, trend: 'up' }
  ];

  const competitiveWins = [
    { account: 'Burger King Regional', competitor: 'Coca-Cola', winReason: 'Superior beverage portfolio', impact: 'High' },
    { account: 'Google EMEA', competitor: 'PepsiCo', winReason: 'Better wellness offering', impact: 'Medium' },
    { account: 'Hilton Americas', competitor: 'Local Brands', winReason: 'Premium positioning', impact: 'High' },
    { account: 'State University System', competitor: 'Coca-Cola', winReason: 'Competitive pricing', impact: 'Medium' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'outperform':
      case 'better':
      case 'up':
        return 'success';
      case 'underperform':
      case 'worse':
      case 'down':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'outperform':
      case 'better':
      case 'up':
        return <TrendingUp color="success" />;
      case 'underperform':
      case 'worse':
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <Equalizer color="disabled" />;
    }
  };

  const formatValue = (value, metric) => {
    if (metric.includes('Value')) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    if (metric.includes('Rate') || metric.includes('Growth')) {
      return `${value}%`;
    }
    if (metric.includes('Days')) {
      return `${value} days`;
    }
    return value;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AFH Performance Benchmarking
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Cross-market performance analysis and competitive win intelligence
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Performance vs Industry Benchmarks
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={timeframe}
                      label="Timeframe"
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <MenuItem value="q1">Q1 2024</MenuItem>
                      <MenuItem value="q4">Q4 2023</MenuItem>
                      <MenuItem value="q3">Q3 2023</MenuItem>
                      <MenuItem value="ytd">YTD 2024</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Channel</InputLabel>
                    <Select
                      value={channel}
                      label="Channel"
                      onChange={(e) => setChannel(e.target.value)}
                    >
                      <MenuItem value="all">All Channels</MenuItem>
                      <MenuItem value="qsr">QSR</MenuItem>
                      <MenuItem value="workplace">Workplace</MenuItem>
                      <MenuItem value="leisure">Leisure</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showDetails}
                        onChange={(e) => setShowDetails(e.target.checked)}
                      />
                    }
                    label="Detailed View"
                  />
                  <Button startIcon={<Download />}>Export</Button>
                  <Button startIcon={<Share />}>Share</Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Key Performance Metrics
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Metric</TableCell>
                              <TableCell align="right">Your Performance</TableCell>
                              <TableCell align="right">Benchmark</TableCell>
                              <TableCell align="right">Difference</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {performanceData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getStatusIcon(row.status)}
                                    {row.metric}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  {formatValue(row.yourPerformance, row.metric)}
                                </TableCell>
                                <TableCell align="right">
                                  {formatValue(row.benchmark, row.metric)}
                                </TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={formatValue(row.difference, row.metric)}
                                    size="small"
                                    color={getStatusColor(row.status)}
                                    variant="outlined"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Channel Performance
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {channelPerformance.map((item, index) => (
                          <Box key={index}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {item.channel}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Typography variant="body2" color="primary">
                                  You: {item.yourGrowth}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Industry: {item.industryAvg}%
                                </Typography>
                                <Chip
                                  icon={getStatusIcon(item.trend)}
                                  label={`${(item.yourGrowth - item.industryAvg).toFixed(1)}%`}
                                  size="small"
                                  color={getStatusColor(item.trend)}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', height: 8, gap: 0.5 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(item.yourGrowth * 2, 100)}
                                sx={{ 
                                  flexGrow: 1,
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#1976d2'
                                  }
                                }}
                              />
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(item.industryAvg * 2, 100)}
                                sx={{ 
                                  flexGrow: 1,
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#666'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Competitive Win Analysis
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {competitiveWins.map((win, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {win.account}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Won from {win.competitor}
                          </Typography>
                        </Box>
                        <Chip 
                          icon={<EmojiEvents />}
                          label={win.impact} 
                          color={win.impact === 'High' ? 'success' : 'primary'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2">
                        {win.winReason}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Recommendations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { 
                    action: 'Focus on Leisure channel premium placements', 
                    insight: 'Underperforming industry average by 2.1%',
                    impact: 'High', 
                    confidence: 85 
                  },
                  { 
                    action: 'Increase contract values in QSR segment', 
                    insight: '17% below benchmark despite higher win rate',
                    impact: 'High', 
                    confidence: 78 
                  },
                  { 
                    action: 'Expand workplace wellness initiatives', 
                    insight: 'Strong growth but opportunity for premiumization',
                    impact: 'Medium', 
                    confidence: 72 
                  },
                  { 
                    action: 'Accelerate education channel partnerships', 
                    insight: 'Solid performance with room for expansion',
                    impact: 'Medium', 
                    confidence: 65 
                  }
                ].map((rec, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <Insights color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                            {rec.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rec.insight}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={`${rec.impact} Impact`} size="small" />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption">
                            Confidence: {rec.confidence}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={rec.confidence} 
                            sx={{ width: 60 }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Benchmarking;
