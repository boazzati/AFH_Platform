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
  Share
} from '@mui/icons-material';

const Benchmarking = () => {
  const [timeframe, setTimeframe] = useState('1y');
  const [benchmark, setBenchmark] = useState('sp500');
  const [showDetails, setShowDetails] = useState(false);

  const performanceData = [
    {
      metric: 'Total Return',
      yourPortfolio: 15.2,
      benchmark: 12.8,
      difference: 2.4,
      status: 'outperform'
    },
    {
      metric: 'Volatility',
      yourPortfolio: 8.1,
      benchmark: 9.4,
      difference: -1.3,
      status: 'better'
    },
    {
      metric: 'Sharpe Ratio',
      yourPortfolio: 1.87,
      benchmark: 1.36,
      difference: 0.51,
      status: 'outperform'
    },
    {
      metric: 'Max Drawdown',
      yourPortfolio: -12.3,
      benchmark: -15.7,
      difference: 3.4,
      status: 'better'
    },
    {
      metric: 'Alpha',
      yourPortfolio: 2.1,
      benchmark: 0,
      difference: 2.1,
      status: 'positive'
    },
    {
      metric: 'Beta',
      yourPortfolio: 0.92,
      benchmark: 1.0,
      difference: -0.08,
      status: 'neutral'
    }
  ];

  const sectorAllocation = [
    { sector: 'Technology', yourPortfolio: 35, benchmark: 28, difference: 7 },
    { sector: 'Healthcare', yourPortfolio: 18, benchmark: 13, difference: 5 },
    { sector: 'Financials', yourPortfolio: 12, benchmark: 11, difference: 1 },
    { sector: 'Consumer', yourPortfolio: 15, benchmark: 18, difference: -3 },
    { sector: 'Energy', yourPortfolio: 8, benchmark: 4, difference: 4 },
    { sector: 'Industrials', yourPortfolio: 12, benchmark: 14, difference: -2 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'outperform':
      case 'better':
      case 'positive':
        return 'success';
      case 'underperform':
      case 'worse':
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'outperform':
      case 'better':
      case 'positive':
        return <TrendingUp color="success" />;
      case 'underperform':
      case 'worse':
      case 'negative':
        return <TrendingDown color="error" />;
      default:
        return <Equalizer color="disabled" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Performance Benchmarking
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Portfolio vs Benchmark
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={timeframe}
                      label="Timeframe"
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <MenuItem value="1m">1 Month</MenuItem>
                      <MenuItem value="3m">3 Months</MenuItem>
                      <MenuItem value="6m">6 Months</MenuItem>
                      <MenuItem value="1y">1 Year</MenuItem>
                      <MenuItem value="3y">3 Years</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Benchmark</InputLabel>
                    <Select
                      value={benchmark}
                      label="Benchmark"
                      onChange={(e) => setBenchmark(e.target.value)}
                    >
                      <MenuItem value="sp500">S&P 500</MenuItem>
                      <MenuItem value="nasdaq">NASDAQ</MenuItem>
                      <MenuItem value="russell2000">Russell 2000</MenuItem>
                      <MenuItem value="custom">Custom Index</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showDetails}
                        onChange={(e) => setShowDetails(e.target.value)}
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
                              <TableCell align="right">Your Portfolio</TableCell>
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
                                  {typeof row.yourPortfolio === 'number' 
                                    ? `${row.yourPortfolio}%` 
                                    : row.yourPortfolio
                                  }
                                </TableCell>
                                <TableCell align="right">
                                  {typeof row.benchmark === 'number' 
                                    ? `${row.benchmark}%` 
                                    : row.benchmark
                                  }
                                </TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={`${row.difference > 0 ? '+' : ''}${row.difference}%`}
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
                        Sector Allocation Comparison
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {sectorAllocation.map((sector, index) => (
                          <Box key={index}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {sector.sector}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant="body2">
                                  You: {sector.yourPortfolio}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Bench: {sector.benchmark}%
                                </Typography>
                                <Chip
                                  label={`${sector.difference > 0 ? '+' : ''}${sector.difference}%`}
                                  size="small"
                                  color={sector.difference > 0 ? 'success' : sector.difference < 0 ? 'error' : 'default'}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', height: 8, gap: 0.5 }}>
                              <LinearProgress
                                variant="determinate"
                                value={sector.yourPortfolio}
                                sx={{ 
                                  flexGrow: 1,
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#1976d2'
                                  }
                                }}
                              />
                              <LinearProgress
                                variant="determinate"
                                value={sector.benchmark}
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
                Performance Summary
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Total Return', value: '15.2%', benchmark: '12.8%', trend: 'up' },
                  { label: 'Risk Adjusted Return', value: '1.87', benchmark: '1.36', trend: 'up' },
                  { label: 'Volatility', value: '8.1%', benchmark: '9.4%', trend: 'down' },
                  { label: 'Active Return', value: '2.4%', benchmark: '0.0%', trend: 'up' }
                ].map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" color={`${item.trend === 'up' ? 'success.main' : 'error.main'}`}>
                          {item.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          vs {item.benchmark} benchmark
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { action: 'Increase Technology exposure', impact: 'High', confidence: 85 },
                  { action: 'Reduce Consumer discretionary', impact: 'Medium', confidence: 72 },
                  { action: 'Add Healthcare positions', impact: 'High', confidence: 78 },
                  { action: 'Consider Energy sector ETF', impact: 'Medium', confidence: 65 }
                ].map((rec, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        {rec.action}
                      </Typography>
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
