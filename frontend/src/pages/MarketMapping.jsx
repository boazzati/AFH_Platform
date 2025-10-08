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
  Checkbox,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Slider,
  Badge,
  TableSortLabel,
  Pagination,
  LinearProgress
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Warning,
  Restaurant,
  LocalCafe,
  Business,
  Add,
  FilterList,
  Download,
  Refresh,
  MoreVert,
  Clear,
  School,
  LocalHospital,
  Hotel,
  Work
} from '@mui/icons-material';
import { marketMappingApi } from '../services/api';

const MarketMapping = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketData, setMarketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confidenceRange, setConfidenceRange] = useState([0, 100]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [newAccount, setNewAccount] = useState({
    account: '',
    channel: '',
    location: '',
    signal: '',
    priority: 'medium',
    opportunity: '',
    confidence: 60,
    potentialValue: '',
    source: 'manual'
  });

  const channels = [
    { id: 'QSR', name: 'Quick Service Restaurant', icon: <Restaurant />, color: '#1976d2' },
    { id: 'Workplace', name: 'Workplace & Corporate', icon: <Work />, color: '#2e7d32' },
    { id: 'Leisure', name: 'Leisure & Hospitality', icon: <Hotel />, color: '#ed6c02' },
    { id: 'Education', name: 'Education', icon: <School />, color: '#9c27b0' },
    { id: 'Healthcare', name: 'Healthcare', icon: <LocalHospital />, color: '#d32f2f' }
  ];

  const priorityLevels = { 
    high: { color: 'error', label: 'High', value: 3 }, 
    medium: { color: 'warning', label: 'Medium', value: 2 }, 
    low: { color: 'info', label: 'Low', value: 1 } 
  };

  const tableColumns = [
    { id: 'account', label: 'Account', sortable: true },
    { id: 'channel', label: 'Channel', sortable: true },
    { id: 'location', label: 'Location', sortable: true },
    { id: 'signal', label: 'Market Signal', sortable: false },
    { id: 'priority', label: 'Priority', sortable: true },
    { id: 'confidence', label: 'Confidence', sortable: true },
    { id: 'opportunity', label: 'Opportunity', sortable: false },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  useEffect(() => {
    loadMarketData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [marketData, searchTerm, selectedChannels, selectedPriorities, confidenceRange, dateRange]);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const response = await marketMappingApi.getMarketSignals();
      setMarketData(response.data || []);
    } catch (error) {
      console.error('Error loading market data:', error);
      // Fallback to empty array if API fails
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = marketData.filter(item => {
      const matchesSearch = (item.account || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.signal || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesChannel = selectedChannels.length === 0 || selectedChannels.includes(item.channel);
      const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(item.priority);
      const matchesConfidence = (item.confidence || 0) >= confidenceRange[0] && (item.confidence || 0) <= confidenceRange[1];
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.timestamp || item.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDate = itemDate >= startDate && itemDate <= endDate;
      }

      return matchesSearch && matchesChannel && matchesPriority && matchesConfidence && matchesDate;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'priority') {
          aValue = priorityLevels[aValue]?.value || 0;
          bValue = priorityLevels[bValue]?.value || 0;
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleSort = (columnId) => {
    const isAsc = sortConfig.key === columnId && sortConfig.direction === 'asc';
    setSortConfig({ key: columnId, direction: isAsc ? 'desc' : 'asc' });
  };

  const handleAddAccount = async () => {
    try {
      await marketMappingApi.createMarketSignal({
        ...newAccount,
        timestamp: new Date().toISOString()
      });
      setNewAccount({
        account: '',
        channel: '',
        location: '',
        signal: '',
        priority: 'medium',
        opportunity: '',
        confidence: 60,
        potentialValue: '',
        source: 'manual'
      });
      setOpenDialog(false);
      loadMarketData();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Account', 'Channel', 'Location', 'Signal', 'Priority', 'Confidence', 'Opportunity'],
      ...filteredData.map(row => [
        row.account || '', row.channel || '', row.location || '', row.signal || '', row.priority || '', row.confidence || '', row.opportunity || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market-signals.csv';
    a.click();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedChannels([]);
    setSelectedPriorities([]);
    setConfidenceRange([0, 100]);
    setDateRange({ start: '', end: '' });
  };

  const getChannelIcon = (channelId) => {
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.icon : <Business />;
  };

  const getChannelColor = (channelId) => {
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.color : '#666';
  };

  // Pagination
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Analytics
  const analytics = {
    total: filteredData.length,
    highPriority: filteredData.filter(item => item.priority === 'high').length,
    avgConfidence: filteredData.length > 0 
      ? Math.round(filteredData.reduce((sum, item) => sum + (item.confidence || 0), 0) / filteredData.length)
      : 0,
    channelBreakdown: channels.map(channel => ({
      ...channel,
      count: filteredData.filter(item => item.channel === channel.id).length
    }))
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AFH Market Mapping & Flagging Engine
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Continuously monitoring restaurant openings, menu partnerships, and channel opportunities
      </Alert>

      {/* Analytics Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analytics.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Opportunities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error">
                {analytics.highPriority}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {analytics.avgConfidence}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Confidence
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {analytics.channelBreakdown.filter(c => c.count > 0).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Channels
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {/* Search and Filter Bar */}
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
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setOpenFilters(true)}
                  sx={{ position: 'relative' }}
                >
                  Filters
                  {(selectedChannels.length > 0 || selectedPriorities.length > 0) && (
                    <Badge
                      badgeContent={selectedChannels.length + selectedPriorities.length}
                      color="primary"
                      sx={{ position: 'absolute', top: -8, right: -8 }}
                    />
                  )}
                </Button>

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
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  Export
                </Button>

                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                  sx={{ ml: 'auto' }}
                >
                  Add Signal
                </Button>
              </Box>

              {/* Quick Channel Filters */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Button
                  variant={selectedChannels.length === 0 ? 'contained' : 'outlined'}
                  onClick={() => setSelectedChannels([])}
                  size="small"
                >
                  All Channels
                </Button>
                {channels.map(channel => (
                  <Button
                    key={channel.id}
                    variant={selectedChannels.includes(channel.id) ? 'contained' : 'outlined'}
                    startIcon={channel.icon}
                    onClick={() => {
                      setSelectedChannels(prev => 
                        prev.includes(channel.id) 
                          ? prev.filter(c => c !== channel.id)
                          : [...prev, channel.id]
                      );
                    }}
                    size="small"
                    sx={{ 
                      borderColor: channel.color,
                      color: selectedChannels.includes(channel.id) ? 'white' : channel.color,
                      backgroundColor: selectedChannels.includes(channel.id) ? channel.color : 'transparent',
                      '&:hover': {
                        backgroundColor: channel.color,
                        color: 'white'
                      }
                    }}
                  >
                    {channel.id}
                  </Button>
                ))}
              </Box>

              {/* Active Filters Display */}
              {(selectedChannels.length > 0 || selectedPriorities.length > 0 || searchTerm) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active filters:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    {searchTerm && (
                      <Chip
                        label={`Search: "${searchTerm}"`}
                        onDelete={() => setSearchTerm('')}
                        size="small"
                      />
                    )}
                    {selectedChannels.map(channel => (
                      <Chip
                        key={channel}
                        label={`Channel: ${channel}`}
                        onDelete={() => setSelectedChannels(prev => prev.filter(c => c !== channel))}
                        size="small"
                      />
                    ))}
                    {selectedPriorities.map(priority => (
                      <Chip
                        key={priority}
                        label={`Priority: ${priority}`}
                        onDelete={() => setSelectedPriorities(prev => prev.filter(p => p !== priority))}
                        size="small"
                      />
                    ))}
                    <Button
                      size="small"
                      startIcon={<Clear />}
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Data Table */}
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                          checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(paginatedData.map(row => row._id || row.id));
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                        />
                      </TableCell>
                      {tableColumns.map((column) => (
                        <TableCell key={column.id}>
                          {column.sortable ? (
                            <TableSortLabel
                              active={sortConfig.key === column.id}
                              direction={sortConfig.key === column.id ? sortConfig.direction : 'asc'}
                              onClick={() => handleSort(column.id)}
                            >
                              {column.label}
                            </TableSortLabel>
                          ) : (
                            column.label
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((row, index) => (
                      <TableRow 
                        key={row._id || row.id || index} 
                        hover
                        selected={selectedRows.includes(row._id || row.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(row._id || row.id)}
                            onChange={(e) => {
                              const rowId = row._id || row.id;
                              if (e.target.checked) {
                                setSelectedRows(prev => [...prev, rowId]);
                              } else {
                                setSelectedRows(prev => prev.filter(id => id !== rowId));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">{row.account || row.type || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getChannelIcon(row.channel)} 
                            label={row.channel || 'N/A'} 
                            size="small"
                            sx={{ 
                              backgroundColor: getChannelColor(row.channel) + '20',
                              color: getChannelColor(row.channel)
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.location || 'N/A'}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.signal || row.description || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={priorityLevels[row.priority]?.label || row.priority || 'Medium'} 
                            color={priorityLevels[row.priority]?.color || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {row.confidence || 0}%
                            </Typography>
                            <Box sx={{ width: 50 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={row.confidence || 0} 
                                size="small"
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{row.opportunity || row.potentialValue || 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography color="text.secondary">
                            {loading ? 'Loading market signals...' : 'No market signals found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {((page - 1) * rowsPerPage) + 1}-{Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} results
                  </Typography>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                    color="primary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Advanced Filters Dialog */}
      <Dialog open={openFilters} onClose={() => setOpenFilters(false)} maxWidth="md" fullWidth>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Channels</InputLabel>
                <Select
                  multiple
                  value={selectedChannels}
                  onChange={(e) => setSelectedChannels(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {channels.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                      <Checkbox checked={selectedChannels.indexOf(channel.id) > -1} />
                      <ListItemIcon>{channel.icon}</ListItemIcon>
                      <ListItemText primary={channel.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priorities</InputLabel>
                <Select
                  multiple
                  value={selectedPriorities}
                  onChange={(e) => setSelectedPriorities(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.entries(priorityLevels).map(([key, priority]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedPriorities.indexOf(key) > -1} />
                      <ListItemText primary={priority.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Confidence Range</Typography>
              <Slider
                value={confidenceRange}
                onChange={(e, newValue) => setConfidenceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearAllFilters}>Clear All</Button>
          <Button onClick={() => setOpenFilters(false)}>Cancel</Button>
          <Button onClick={() => setOpenFilters(false)} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Market Signal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Account Name"
              value={newAccount.account}
              onChange={(e) => setNewAccount({...newAccount, account: e.target.value})}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Channel</InputLabel>
              <Select
                value={newAccount.channel}
                onChange={(e) => setNewAccount({...newAccount, channel: e.target.value})}
              >
                {channels.map(channel => (
                  <MenuItem key={channel.id} value={channel.id}>
                    <ListItemIcon>{channel.icon}</ListItemIcon>
                    <ListItemText primary={channel.name} />
                  </MenuItem>
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
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newAccount.priority}
                onChange={(e) => setNewAccount({...newAccount, priority: e.target.value})}
              >
                {Object.entries(priorityLevels).map(([key, priority]) => (
                  <MenuItem key={key} value={key}>{priority.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography gutterBottom>Confidence Level: {newAccount.confidence}%</Typography>
              <Slider
                value={newAccount.confidence}
                onChange={(e, value) => setNewAccount({...newAccount, confidence: value})}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Box>
            <TextField
              label="Opportunity Description"
              value={newAccount.opportunity}
              onChange={(e) => setNewAccount({...newAccount, opportunity: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Potential Value"
              value={newAccount.potentialValue}
              onChange={(e) => setNewAccount({...newAccount, potentialValue: e.target.value})}
              fullWidth
              placeholder="e.g., $50K annual revenue"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddAccount}
            variant="contained"
            disabled={!newAccount.account || !newAccount.channel}
          >
            Add Signal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketMapping;
