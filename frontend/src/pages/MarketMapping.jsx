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
  DialogActions
} from '@mui/material';
import { Search, TrendingUp, Warning, Restaurant, LocalCafe, Business, Add } from '@mui/icons-material';
import { marketMappingApi } from '../services/api';
const MarketMapping = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketData, setMarketData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
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
    try {
      const response = await marketMappingAPI.getAll();
      setMarketData(response.data);
    } catch (error) {
      console.error('Error loading market data:', error);
      // Fallback to sample data if API fails
      setMarketData([
        { 
          _id: '1',
          account: 'Burger King - Downtown', 
          channel: 'QSR', 
          location: 'New York, NY',
          signal: 'New menu expansion', 
          priority: 'high',
          opportunity: 'Beverage partnership',
          trend: 'up' 
        },
        { 
          _id: '2',
          account: 'Google Campus Cafe', 
          channel: 'Workplace', 
          location: 'Mountain View, CA',
          signal: 'Contract renewal Q2', 
          priority: 'high',
          opportunity: 'Healthy beverage line',
          trend: 'up' 
        }
      ]);
    }
  };

  const handleAddAccount = async () => {
    try {
      await marketMappingAPI.create(newAccount);
      setNewAccount({
        account: '',
        channel: '',
        location: '',
        signal: '',
        priority: 'medium',
        opportunity: ''
      });
      setOpenDialog(false);
      loadMarketData(); // Reload data
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const filteredData = marketData.filter(item =>
    item.account.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedChannel === 'all' || item.channel === selectedChannel)
  );

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'QSR': return <Restaurant />;
      case 'Workplace': return <Business />;
      case 'Leisure': return <LocalCafe />;
      default: return <Business />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AFH Market Mapping & Flagging Engine
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Continuously monitoring restaurant openings, menu partnerships, and channel opportunities
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  placeholder="Search accounts or locations..."
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
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                  sx={{ ml: 'auto' }}
                >
                  Add Account
                </Button>
              </Box>

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
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow key={row._id} hover>
                        <TableCell>
                          <Typography fontWeight="bold">{row.account}</Typography>
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
                          <Button size="small" variant="outlined">
                            Investigate
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
            />
            <TextField
              select
              label="Channel"
              value={newAccount.channel}
              onChange={(e) => setNewAccount({...newAccount, channel: e.target.value})}
              fullWidth
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </TextField>
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
            />
            <TextField
              select
              label="Priority"
              value={newAccount.priority}
              onChange={(e) => setNewAccount({...newAccount, priority: e.target.value})}
              fullWidth
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>
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
            disabled={!newAccount.account || !newAccount.channel}
          >
            Add Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketMapping;
