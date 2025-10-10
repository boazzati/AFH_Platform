import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Map as MapIcon,
  Add,
  Search,
  FilterList,
  Download,
  Visibility,
  Edit,
  Delete,
  TrendingUp,
  Assessment,
  AttachMoney,
  LocationOn,
  Business,
  Timeline,
  ExpandMore,
  Refresh,
  Analytics,
  Speed,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const MarketMapping = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketSignals, setMarketSignals] = useState([]);
  const [filteredSignals, setFilteredSignals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // New signal form state
  const [newSignal, setNewSignal] = useState({
    title: '',
    description: '',
    channel: '',
    priority: 'medium',
    location: ''
  });

  // Mock comprehensive market data
  const mockAnalytics = {
    totalSignals: 127,
    highPriorityCount: 23,
    averageConfidence: 0.84,
    totalRevenuePotential: 45000000,
    channelDistribution: [
      { channel: 'QSR', count: 45, revenue: 18500000, avgConfidence: 0.87, color: '#0088FE' },
      { channel: 'Fast Casual', count: 32, revenue: 12800000, avgConfidence: 0.89, color: '#00C49F' },
      { channel: 'Casual Dining', count: 28, revenue: 8200000, avgConfidence: 0.81, color: '#FFBB28' },
      { channel: 'Coffee Shops', count: 22, revenue: 5500000, avgConfidence: 0.92, color: '#FF8042' }
    ],
    priorityBreakdown: [
      { priority: 'High', count: 23, percentage: 18.1 },
      { priority: 'Medium', count: 67, percentage: 52.8 },
      { priority: 'Low', count: 37, percentage: 29.1 }
    ],
    confidenceTrend: [
      { month: 'Jan', confidence: 0.78, signals: 18 },
      { month: 'Feb', confidence: 0.81, signals: 22 },
      { month: 'Mar', confidence: 0.84, signals: 28 },
      { month: 'Apr', confidence: 0.82, signals: 25 },
      { month: 'May', confidence: 0.87, signals: 31 },
      { month: 'Jun', confidence: 0.89, signals: 35 }
    ]
  };

  const mockSignals = [
    {
      id: 1,
      title: 'Starbucks Expands Plant-Based Menu',
      description: 'New partnership opportunity for plant-based protein suppliers across 15,000+ locations',
      channel: 'Coffee Shops',
      priority: 'high',
      confidence: 0.94,
      revenue_potential: 2800000,
      location: 'National',
      timestamp: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 2,
      title: 'McDonald\'s Tests Breakfast Innovation',
      description: 'Limited-time breakfast items creating supplier opportunities in test markets',
      channel: 'QSR',
      priority: 'medium',
      confidence: 0.76,
      revenue_potential: 1500000,
      location: 'West Coast',
      timestamp: new Date().toISOString(),
      status: 'monitoring'
    },
    {
      id: 3,
      title: 'Chipotle Protein Diversification',
      description: 'Exploring alternative protein sources for menu expansion',
      channel: 'Fast Casual',
      priority: 'high',
      confidence: 0.88,
      revenue_potential: 3200000,
      location: 'Southwest',
      timestamp: new Date().toISOString(),
      status: 'active'
    }
  ];

  useEffect(() => {
    loadMarketSignals();
  }, []);

  useEffect(() => {
    filterSignals();
  }, [marketSignals, searchTerm, channelFilter, priorityFilter]);

  const loadMarketSignals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const response = await api.get('/market-signals');
        const signals = response.data.length > 0 ? response.data : mockSignals;
        setMarketSignals(signals);
      } catch (apiError) {
        console.log('Using mock data due to API error:', apiError.message);
        setMarketSignals(mockSignals);
      }
    } catch (error) {
      console.error('Market signals loading error:', error);
      setError('Failed to load market signals');
      setMarketSignals(mockSignals); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const filterSignals = () => {
    let filtered = marketSignals;

    if (searchTerm) {
      filtered = filtered.filter(signal =>
        signal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (channelFilter !== 'all') {
      filtered = filtered.filter(signal => signal.channel === channelFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(signal => signal.priority === priorityFilter);
    }

    setFilteredSignals(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMarketSignals();
    setRefreshing(false);
  };

  const handleAddSignal = async () => {
    try {
      const response = await api.post('/market-signals', newSignal);
      setMarketSignals([response.data, ...marketSignals]);
      setAddDialogOpen(false);
      setNewSignal({
        title: '',
        description: '',
        channel: '',
        priority: 'medium',
        location: ''
      });
    } catch (error) {
      console.error('Error adding signal:', error);
      // For demo purposes, add locally
      const newId = Math.max(...marketSignals.map(s => s.id)) + 1;
      const signal = {
        ...newSignal,
        id: newId,
        confidence: Math.random() * 0.3 + 0.7,
        revenue_potential: Math.floor(Math.random() * 5000000) + 500000,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      setMarketSignals([signal, ...marketSignals]);
      setAddDialogOpen(false);
      setNewSignal({
        title: '',
        description: '',
        channel: '',
        priority: 'medium',
        location: ''
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF8042';
      case 'medium': return '#FFBB28';
      case 'low': return '#00C49F';
      default: return '#8884D8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle sx={{ color: '#00C49F' }} />;
      case 'monitoring': return <Warning sx={{ color: '#FFBB28' }} />;
      case 'inactive': return <ErrorIcon sx={{ color: '#FF8042' }} />;
      default: return <CheckCircle sx={{ color: '#8884D8' }} />;
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
              Market Mapping Intelligence
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              AI-powered market signal detection and analysis
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
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Add Signal
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mx: 3 }}>
          {error}
        </Alert>
      )}

      {/* Analytics Summary Cards */}
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
                    {mockAnalytics.totalSignals}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Market Signals
                  </Typography>
                </Box>
                <MapIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {mockAnalytics.highPriorityCount}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    High Priority Signals
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(mockAnalytics.highPriorityCount / mockAnalytics.totalSignals) * 100} 
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
                    {formatCurrency(mockAnalytics.totalRevenuePotential)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Revenue Potential
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
                    {formatPercentage(mockAnalytics.averageConfidence)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average Confidence
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={mockAnalytics.averageConfidence * 100} 
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

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Channel Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <RechartsBarChart data={mockAnalytics.channelDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#667eea" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Priority Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <RechartsPieChart>
                  <Pie
                    data={mockAnalytics.priorityBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ priority, percentage }) => `${priority}: ${percentage.toFixed(1)}%`}
                  >
                    {mockAnalytics.priorityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3, mx: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search signals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  label="Channel"
                >
                  <MenuItem value="all">All Channels</MenuItem>
                  <MenuItem value="QSR">QSR</MenuItem>
                  <MenuItem value="Fast Casual">Fast Casual</MenuItem>
                  <MenuItem value="Casual Dining">Casual Dining</MenuItem>
                  <MenuItem value="Coffee Shops">Coffee Shops</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High Priority</MenuItem>
                  <MenuItem value="medium">Medium Priority</MenuItem>
                  <MenuItem value="low">Low Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {
                  // Export functionality
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + "Title,Channel,Priority,Confidence,Revenue Potential,Location\n"
                    + filteredSignals.map(signal => 
                        `"${signal.title}","${signal.channel}","${signal.priority}",${signal.confidence},"${formatCurrency(signal.revenue_potential)}","${signal.location}"`
                      ).join("\n");
                  
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "market_signals.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Export CSV
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Market Signals Table */}
      <Card sx={{ mx: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Market Signals ({filteredSignals.length})
            </Typography>
            <Chip 
              label={`${filteredSignals.length} of ${marketSignals.length} signals`}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Signal</strong></TableCell>
                  <TableCell><strong>Channel</strong></TableCell>
                  <TableCell><strong>Priority</strong></TableCell>
                  <TableCell><strong>Confidence</strong></TableCell>
                  <TableCell><strong>Revenue Potential</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSignals.map((signal) => (
                  <TableRow key={signal.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {signal.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {signal.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={signal.channel} 
                        size="small" 
                        sx={{ 
                          bgcolor: mockAnalytics.channelDistribution.find(c => c.channel === signal.channel)?.color || '#8884D8',
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={signal.priority} 
                        size="small" 
                        sx={{ 
                          bgcolor: getPriorityColor(signal.priority),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={signal.confidence * 100} 
                          sx={{ width: 60, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2">
                          {formatPercentage(signal.confidence)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(signal.revenue_potential)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {signal.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getStatusIcon(signal.status)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {signal.status}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Signal">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Signal Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Add New Market Signal
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Signal Title"
                value={newSignal.title}
                onChange={(e) => setNewSignal({ ...newSignal, title: e.target.value })}
                placeholder="e.g., Starbucks Expands Plant-Based Menu"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newSignal.description}
                onChange={(e) => setNewSignal({ ...newSignal, description: e.target.value })}
                placeholder="Detailed description of the market opportunity..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={newSignal.channel}
                  onChange={(e) => setNewSignal({ ...newSignal, channel: e.target.value })}
                  label="Channel"
                >
                  <MenuItem value="QSR">QSR</MenuItem>
                  <MenuItem value="Fast Casual">Fast Casual</MenuItem>
                  <MenuItem value="Casual Dining">Casual Dining</MenuItem>
                  <MenuItem value="Coffee Shops">Coffee Shops</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newSignal.priority}
                  onChange={(e) => setNewSignal({ ...newSignal, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="high">High Priority</MenuItem>
                  <MenuItem value="medium">Medium Priority</MenuItem>
                  <MenuItem value="low">Low Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                value={newSignal.location}
                onChange={(e) => setNewSignal({ ...newSignal, location: e.target.value })}
                placeholder="e.g., National, West Coast, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSignal} 
            variant="contained"
            disabled={!newSignal.title || !newSignal.channel}
          >
            Add Signal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketMapping;
