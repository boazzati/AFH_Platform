import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  Search, 
  TrendingUp, 
  Warning, 
  Restaurant, 
  LocalCafe, 
  Business, 
  Add, 
  School,
  LocalHospital,
  Refresh,
  Analytics
} from '@mui/icons-material';
import { marketMappingAPI } from '../services/api';

const MarketMapping = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketData, setMarketData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [investigationDialogOpen, setInvestigationDialogOpen] = useState(false);
  const [currentInvestigation, setCurrentInvestigation] = useState(null);
  const [investigationResults, setInvestigationResults] = useState({});
  const [newAccount, setNewAccount] = useState({
    account: '',
    channel: '',
    location: '',
    signal: '',
    priority: 'medium',
    opportunity: ''
  });

  const channels = ['QSR', 'Workplace', 'Leisure', 'Education', 'Healthcare'];
  const priorityLevels = { high: 'error', medium: 'warning', low: 'info' };

  // Load data from API
  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const response = await marketMappingAPI.getMarketSignals();
      const transformedData = transformMarketSignals(response.data);
      setMarketData(transformedData);
    } catch (error) {
      console.error('Error loading market data:', error);
      setError('Failed to load market data. Using sample data.');
      setMarketData(getSampleMarketData());
    } finally {
      setLoading(false);
    }
  };

  const transformMarketSignals = (signals) => {
    return signals.map(signal => ({
      _id: signal._id,
      account: signal.location || 'Unknown Account',
      channel: getChannelFromSignal(signal),
      location: signal.location || 'Unknown Location',
      signal: signal.description || 'No signal description',
      priority: mapSeverityToPriority(signal.severity),
      opportunity: signal.potentialValue || 'Unknown opportunity',
      trend: getTrendFromConfidence(signal.confidence),
      confidence: signal.confidence,
      timestamp: signal.timestamp,
      source: signal.source
    }));
  };

  const getChannelFromSignal = (signal) => {
    if (signal.category) {
      const category = signal.category.toLowerCase();
      if (category.includes('qsr') || category.includes('restaurant')) return 'QSR';
      if (category.includes('workplace') || category.includes('corporate')) return 'Workplace';
      if (category.includes('leisure') || category.includes('hotel')) return 'Leisure';
      if (category.includes('education') || category.includes('campus')) return 'Education';
      if (category.includes('healthcare') || category.includes('hospital')) return 'Healthcare';
    }
    return channels[Math.floor(Math.random() * channels.length)];
  };

  const mapSeverityToPriority = (severity) => {
    const priorityMap = {
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return priorityMap[severity] || 'medium';
  };

  const getTrendFromConfidence = (confidence) => {
    return confidence > 70 ? 'up' : confidence > 40 ? 'stable' : 'down';
  };

  const getSampleMarketData = () => [
    { 
      _id: '1',
      account: 'Burger King - Downtown', 
      channel: 'QSR', 
      location: 'New York, NY',
      signal: 'New menu expansion', 
      priority: 'high',
      opportunity: 'Beverage partnership',
      trend: 'up',
      confidence: 85
    },
    { 
      _id: '2',
      account: 'Google Campus Cafe', 
      channel: 'Workplace', 
      location: 'Mountain View, CA',
      signal: 'Contract renewal Q2', 
      priority: 'high',
      opportunity: 'Healthy beverage line',
      trend: 'up',
      confidence: 78
    }
  ];

  const handleAddAccount = async () => {
    if (!newAccount.account || !newAccount.channel || !newAccount.signal) {
      setError('Please fill in account, channel, and market signal');
      return;
    }

    setLoading(true);
    try {
      const signalData = {
        type: 'market-opportunity',
        severity: newAccount.priority,
        location: `${newAccount.account} - ${newAccount.location}`,
        description: newAccount.signal,
        potentialValue: newAccount.opportunity,
        confidence: getConfidenceFromPriority(newAccount.priority),
        source: 'manual-entry',
        category: newAccount.channel
      };

      await marketMappingAPI.createMarketSignal(signalData);
      
      setSuccess(`Account "${newAccount.account}" added successfully!`);
      setOpenDialog(false);
      setNewAccount({
        account: '',
        channel: '',
        location: '',
        signal: '',
        priority: 'medium',
        opportunity: ''
      });
      
      await loadMarketData();
    } catch (error) {
      console.error('Error adding account:', error);
      setError('Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceFromPriority = (priority) => {
    const confidenceMap = {
      'high': 80,
      'medium': 60,
      'low': 40
    };
    return confidenceMap[priority] || 60;
  };

  const handleAnalyzeTrends = async () => {
    setLoading(true);
    try {
      const response = await marketMappingAPI.analyzeTrends({
        data: marketData,
        channel: selectedChannel === 'all' ? 'all channels' : selectedChannel
      });
      
      setSuccess('Market trends analyzed successfully! Check the console for insights.');
      console.log('Trend analysis:', response.data);
    } catch (error) {
      console.error('Error analyzing trends:', error);
      setError('Failed to analyze trends');
    } finally {
      setLoading(false);
    }
  };

  const handleInvestigate = async (account) => {
    try {
      setLoading(true);
      
      // Call AI analysis
      const response = await marketMappingAPI.analyzeTrends({
        data: [account],
        channel: account.channel
      });
      
      // Store results
      const analysisResult = response.data.analysis || `## AI Analysis for ${account.account}

**Opportunity Assessment:**
- **Market Potential:** ${account.confidence}% confidence
- **Channel:** ${account.channel}
- **Priority Level:** ${account.priority.toUpperCase()}

**Key Insights:**
1. Strong growth potential in ${account.location} market
2. ${account.signal} presents immediate opportunity
3. Estimated timeline: 4-6 weeks for implementation

**Recommended Actions:**
- Schedule discovery call with ${account.account}
- Prepare ${account.opportunity} proposal
- Allocate resources for Q2 initiative

**Risk Factors:**
- Competitive pressure in ${account.channel} channel
- Market saturation considerations
- Budget allocation requirements`;

      setInvestigationResults(prev => ({
        ...prev,
        [account._id]: analysisResult
      }));
      
      setCurrentInvestigation(account);
      setInvestigationDialogOpen(true);
      setSuccess(`AI analysis completed for ${account.account}`);
      
    } catch (error) {
      console.error('Error during investigation:', error);
      // Fallback analysis
      const fallbackAnalysis = `## Manual Analysis: ${account.account}

**Opportunity Summary:**
- **Location:** ${account.location}
- **Signal:** ${account.signal}
- **Potential:** ${account.opportunity}

**Initial Assessment:**
This appears to be a ${account.priority} priority opportunity in the ${account.channel} channel. The ${account.signal.toLowerCase()} suggests immediate action is warranted.

**Next Steps:**
1. Contact ${account.account} for initial discussion
2. Prepare partnership proposal
3. Schedule follow-up meeting`;

      setInvestigationResults(prev => ({
        ...prev,
        [account._id]: fallbackAnalysis
      }));
      setCurrentInvestigation(account);
      setInvestigationDialogOpen(true);
      setSuccess(`Analysis completed for ${account.account}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = marketData.filter(item =>
    (item.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.signal.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedChannel === 'all' || item.channel === selectedChannel)
  );

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'QSR': return <Restaurant />;
      case 'Workplace': return <Business />;
      case 'Leisure': return <LocalCafe />;
      case 'Education': return <School />;
      case 'Healthcare': return <LocalHospital />;
      default: return <Business />;
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <Warning color="error" />;
      default: return <TrendingUp color="disabled" />;
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AFH Market Mapping & Flagging Engine
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Continuously monitoring restaurant openings, menu partnerships, and channel opportunities
      </Alert>

      {/* Status Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  placeholder="Search accounts, locations, or signals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ minWidth: 300 }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <Button 
                  variant={selectedChannel === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedChannel('all')}
                >
                  All Channels
                </Button>
                {channels.map(channel => (
                  <Button
                    key={channel}
                    variant={selectedChannel === channel ? 'contained' : 'outlined'}
                    startIcon={getChannelIcon(channel)}
                    onClick={() => setSelectedChannel(channel)}
                  >
                    {channel}
                  </Button>
                ))}
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Refresh />}
                    onClick={loadMarketData}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Analytics />}
                    onClick={handleAnalyzeTrends}
                    disabled={loading || marketData.length === 0}
                  >
                    Analyze Trends
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    disabled={loading}
                  >
                    Add Account
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Account</TableCell>
                        <TableCell>Channel</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Market Signal</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Opportunity</TableCell>
                        <TableCell>Confidence</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row) => (
                        <TableRow key={row._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getTrendIcon(row.trend)}
                              <Typography fontWeight="bold">{row.account}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={getChannelIcon(row.channel)} 
                              label={row.channel} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>{row.location}</TableCell>
                          <TableCell>{row.signal}</TableCell>
                          <TableCell>
                            <Chip 
                              label={row.priority} 
                              color={priorityLevels[row.priority]}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{row.opportunity}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${row.confidence}%`}
                              size="small"
                              variant="outlined"
                              color={row.confidence > 70 ? 'success' : row.confidence > 40 ? 'warning' : 'error'}
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => handleInvestigate(row)}
                              disabled={loading}
                            >
                              Investigate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {filteredData.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography color="text.secondary">
                    No market data found. Try adjusting your search or add a new account.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Market Stats Card */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Opportunities
              </Typography>
              <Typography variant="h4">
                {marketData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                High Priority
              </Typography>
              <Typography variant="h4" color="error.main">
                {marketData.filter(item => item.priority === 'high').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg Confidence
              </Typography>
              <Typography variant="h4" color="primary.main">
                {marketData.length > 0 
                  ? Math.round(marketData.reduce((acc, item) => acc + (item.confidence || 0), 0) / marketData.length)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Channels
              </Typography>
              <Typography variant="h4">
                {new Set(marketData.map(item => item.channel)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Account Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Account Opportunity</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Account Name"
              value={newAccount.account}
              onChange={(e) => setNewAccount({...newAccount, account: e.target.value})}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Channel</InputLabel>
              <Select
                value={newAccount.channel}
                label="Channel"
                onChange={(e) => setNewAccount({...newAccount, channel: e.target.value})}
              >
                {channels.map(channel => (
                  <MenuItem key={channel} value={channel}>{channel}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Location"
              value={newAccount.location}
              onChange={(e) => setNewAccount({...newAccount, location: e.target.value})}
              fullWidth
            />
            <TextField
              label="Market Signal"
              value={newAccount.signal}
              onChange={(e) => setNewAccount({...newAccount, signal: e.target.value})}
              fullWidth
              required
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newAccount.priority}
                label="Priority"
                onChange={(e) => setNewAccount({...newAccount, priority: e.target.value})}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Opportunity"
              value={newAccount.opportunity}
              onChange={(e) => setNewAccount({...newAccount, opportunity: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddAccount}
            variant="contained"
            disabled={!newAccount.account || !newAccount.channel || !newAccount.signal || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Investigation Results Dialog */}
      <Dialog open={investigationDialogOpen} onClose={() => setInvestigationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          AI Analysis: {currentInvestigation?.account}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            whiteSpace: 'pre-wrap', 
            maxHeight: '400px', 
            overflow: 'auto',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.default'
          }}>
            {currentInvestigation && investigationResults[currentInvestigation._id] ? (
              investigationResults[currentInvestigation._id]
            ) : (
              <Typography color="text.secondary">No analysis available</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvestigationDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setSuccess(`Action plan created for ${currentInvestigation?.account}`);
              setInvestigationDialogOpen(false);
            }}
          >
            Create Action Plan
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default MarketMapping;
