import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  CloudUpload,
  Storage,
  Api,
  CheckCircle,
  Error,
  Pending,
  Add,
  PointOfSale,
  MenuBook,
  Group,
  Refresh,
  Delete,
  Sync
} from '@mui/icons-material';
import { dataIntegrationApi, crawlingAPI } from '../services/api';

const DataIntegration = () => {
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    type: '',
    endpoint: '',
    credentials: ''
  });

  // Load data sources on component mount
  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    setLoading(true);
    try {
      const response = await dataIntegrationApi.getMarketSignals();
      // Transform market signals into data source format
      const sources = transformMarketSignalsToDataSources(response.data);
      setDataSources(sources);
    } catch (error) {
      console.error('Error loading data sources:', error);
      setError('Failed to load data sources. Using sample data.');
      // Fallback to sample data
      setDataSources(getSampleDataSources());
    } finally {
      setLoading(false);
    }
  };

  const transformMarketSignalsToDataSources = (marketSignals) => {
    // Group signals by source type and create data source entries
    const sourceTypes = {
      'POS Data': marketSignals.filter(s => s.category === 'sales' || s.type === 'transaction'),
      'CRM': marketSignals.filter(s => s.category === 'account' || s.type === 'partnership'),
      'Web Data': marketSignals.filter(s => s.source === 'web' || s.category === 'competitive'),
      'Survey Data': marketSignals.filter(s => s.type === 'feedback' || s.category === 'consumer')
    };

    return Object.entries(sourceTypes).map(([type, signals], index) => ({
      id: index + 1,
      name: getSourceName(type, signals.length),
      type: type,
      status: signals.length > 0 ? 'connected' : 'pending',
      lastSync: getLastSyncTime(signals),
      coverage: getCoverage(signals.length, type),
      signalCount: signals.length,
      lastUpdated: signals.length > 0 ? new Date(Math.max(...signals.map(s => new Date(s.timestamp)))) : null
    }));
  };

  const getSourceName = (type, count) => {
    const names = {
      'POS Data': ['NCR Aloha', 'Micros', 'Toast', 'Square'],
      'CRM': ['Salesforce', 'HubSpot', 'Zoho', 'Dynamic 365'],
      'Web Data': ['Web Scraper', 'Menu Analytics', 'Competitive Intel', 'Price Monitoring'],
      'Survey Data': ['Customer Feedback', 'Review Analytics', 'Sentiment Analysis', 'NPS Data']
    };
    return names[type]?.[count % names[type].length] || `${type} Source`;
  };

  const getLastSyncTime = (signals) => {
    if (signals.length === 0) return 'Never';
    
    const latestSignal = signals.reduce((latest, signal) => {
      const signalTime = new Date(signal.timestamp);
      return signalTime > latest ? signalTime : latest;
    }, new Date(0));

    const diffMs = Date.now() - latestSignal.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getCoverage = (signalCount, type) => {
    const baseCoverage = {
      'POS Data': 85,
      'CRM': 90,
      'Web Data': 70,
      'Survey Data': 60
    };
    const adjustment = Math.min(signalCount * 2, 30);
    return `${baseCoverage[type] + adjustment}% coverage`;
  };

  const getSampleDataSources = () => [
    { 
      id: 1, 
      name: 'POS System - NCR Aloha', 
      type: 'POS Data', 
      status: 'connected', 
      lastSync: '2 hours ago',
      coverage: '85% of QSR accounts',
      signalCount: 45
    },
    { 
      id: 2, 
      name: 'Operator CRM', 
      type: 'CRM', 
      status: 'connected', 
      lastSync: '1 hour ago',
      coverage: 'All enterprise accounts',
      signalCount: 32
    },
    { 
      id: 3, 
      name: 'Digital Menu Scraping', 
      type: 'Web Data', 
      status: 'pending', 
      lastSync: 'Never',
      coverage: 'Major chain restaurants',
      signalCount: 0
    },
    { 
      id: 4, 
      name: 'Consumer Feedback Stream', 
      type: 'Survey Data', 
      status: 'error', 
      lastSync: '5 days ago',
      coverage: 'Mobile app users',
      signalCount: 18
    },
  ];

  const dataStreams = [
    { name: 'Real-time POS', value: '2.4M', trend: '+12%', description: 'Transactions processed today' },
    { name: 'Menu Updates', value: '156', trend: '+8', description: 'Menu changes detected' },
    { name: 'Consumer Reviews', value: '8.2K', trend: '+234', description: 'New reviews analyzed' },
    { name: 'Competitor Pricing', value: '98%', trend: '+5%', description: 'Price coverage accuracy' }
  ];

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.type) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create a market signal representing the new data source
      const signalData = {
        type: 'data-source',
        severity: 'info',
        location: newSource.name,
        description: `New ${newSource.type} integration`,
        potentialValue: 'High',
        confidence: 80,
        source: newSource.type,
        category: 'integration'
      };

      await dataIntegrationApi.createMarketSignal(signalData);
      
      setSuccess(`Data source "${newSource.name}" added successfully!`);
      setOpenDialog(false);
      setNewSource({ name: '', type: '', endpoint: '', credentials: '' });
      
      // Reload data sources
      await loadDataSources();
    } catch (error) {
      console.error('Error adding data source:', error);
      setError('Failed to add data source');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSource = async (sourceId) => {
    setSyncing(prev => ({ ...prev, [sourceId]: true }));
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the data source status
      setDataSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { 
              ...source, 
              status: 'connected', 
              lastSync: 'Just now',
              lastUpdated: new Date()
            }
          : source
      ));
      
      setSuccess('Data source synced successfully!');
    } catch (error) {
      console.error('Error syncing data source:', error);
      setError('Failed to sync data source');
    } finally {
      setSyncing(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  const handleToggleSource = async (sourceId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'connected' ? 'disabled' : 'connected';
      
      setDataSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: newStatus }
          : source
      ));
      
      setSuccess(`Data source ${newStatus === 'connected' ? 'enabled' : 'disabled'}!`);
    } catch (error) {
      console.error('Error toggling data source:', error);
      setError('Failed to update data source');
    }
  };

  const handleCrawlMenuData = async () => {
    setLoading(true);
    try {
      // Example: Crawl a restaurant menu
      const response = await crawlingAPI.crawlMenuData({
        restaurantUrl: 'https://example-restaurant.com/menu'
      });
      
      setSuccess('Menu data crawled successfully!');
      console.log('Crawled menu data:', response.data);
    } catch (error) {
      console.error('Error crawling menu data:', error);
      setError('Failed to crawl menu data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAll = () => {
    loadDataSources();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'pending': return <Pending color="warning" />;
      case 'disabled': return <Pending color="disabled" />;
      default: return <Pending color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'error': return 'error';
      case 'pending': return 'warning';
      case 'disabled': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'POS Data': return <PointOfSale />;
      case 'CRM': return <Group />;
      case 'Web Data': return <MenuBook />;
      case 'Survey Data': return <CloudUpload />;
      default: return <Storage />;
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Operator & Consumer Data Integration
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Aggregate and analyze POS, menu, and CRM data for real-time AFH insights
      </Typography>

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
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Connected Data Sources
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Refresh />}
                    onClick={handleRefreshAll}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    disabled={loading}
                  >
                    Add Source
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {dataSources.map((source) => (
                    <ListItem key={source.id} divider>
                      <ListItemIcon>
                        {getTypeIcon(source.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {source.name}
                            <Chip 
                              label={source.status} 
                              size="small" 
                              color={getStatusColor(source.status)}
                            />
                            {source.signalCount > 0 && (
                              <Chip 
                                label={`${source.signalCount} signals`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {source.type} • Coverage: {source.coverage} • Last sync: {source.lastSync}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={source.status === 'connected' ? 100 : 0} 
                              sx={{ mt: 1 }}
                              color={getStatusColor(source.status)}
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => handleSyncSource(source.id)}
                            disabled={syncing[source.id] || source.status === 'disabled'}
                            color="primary"
                          >
                            {syncing[source.id] ? <CircularProgress size={20} /> : <Sync />}
                          </IconButton>
                          <Switch
                            edge="end"
                            checked={source.status === 'connected'}
                            onChange={() => handleToggleSource(source.id, source.status)}
                            disabled={syncing[source.id]}
                          />
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Crawl Menu Data Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Web Data Collection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Crawl restaurant websites for menu data and pricing information
              </Typography>
              <Button
                variant="outlined"
                startIcon={<MenuBook />}
                onClick={handleCrawlMenuData}
                disabled={loading}
              >
                Crawl Menu Data
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Data Streams
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dataStreams.map((stream, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h4" color="primary">
                            {stream.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stream.name}
                          </Typography>
                        </Box>
                        <Chip label={stream.trend} color="success" size="small" />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {stream.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Quality Metrics
              </Typography>
              <Grid container spacing={2}>
                {[
                  { metric: 'POS Data Coverage', value: 85, color: 'success' },
                  { metric: 'Menu Update Latency', value: 92, color: 'warning' },
                  { metric: 'Review Sentiment Accuracy', value: 78, color: 'warning' },
                  { metric: 'Competitive Intelligence', value: 65, color: 'error' }
                ].map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color={`${item.color}.main`}>
                        {item.value}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.metric}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.value} 
                        color={item.color}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect New Data Source</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={newSource.type}
                label="Data Type"
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
              >
                <MenuItem value="POS Data">POS System</MenuItem>
                <MenuItem value="CRM">Operator CRM</MenuItem>
                <MenuItem value="Web Data">Menu & Web Data</MenuItem>
                <MenuItem value="Survey Data">Consumer Feedback</MenuItem>
                <MenuItem value="API">External API</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Source Name"
              value={newSource.name}
              onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Endpoint URL"
              value={newSource.endpoint}
              onChange={(e) => setNewSource({ ...newSource, endpoint: e.target.value })}
              fullWidth
            />
            <TextField
              label="API Key / Credentials"
              type="password"
              value={newSource.credentials}
              onChange={(e) => setNewSource({ ...newSource, credentials: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddSource} 
            variant="contained"
            disabled={!newSource.name || !newSource.type || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Connect Source'}
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

export default DataIntegration;
