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
  Alert
} from '@mui/material';
import { Search, TrendingUp, Warning, Restaurant, LocalCafe, Business } from '@mui/icons-material';

const MarketMapping = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketData, setMarketData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('all');

  const channels = ['QSR', 'Workplace', 'Leisure', 'Education', 'Healthcare'];
  const priorityLevels = { high: 'error', medium: 'warning', low: 'info' };

  const sampleMarketData = [
    { 
      id: 1, 
      account: 'Burger King - Downtown', 
      channel: 'QSR', 
      location: 'New York, NY',
      signal: 'New menu expansion', 
      priority: 'high',
      opportunity: 'Beverage partnership',
      trend: 'up' 
    },
    { 
      id: 2, 
      account: 'Google Campus Cafe', 
      channel: 'Workplace', 
      location: 'Mountain View, CA',
      signal: 'Contract renewal Q2', 
      priority: 'high',
      opportunity: 'Healthy beverage line',
      trend: 'up' 
    },
    { 
      id: 3, 
      account: 'Hilton Hotels', 
      channel: 'Leisure', 
      location: 'Chicago, IL',
      signal: 'Mini-bar refresh', 
      priority: 'medium',
      opportunity: 'Premium portfolio',
      trend: 'up' 
    },
    { 
      id: 4, 
      account: 'State University', 
      channel: 'Education', 
      location: 'Boston, MA',
      signal: 'New dining hall', 
      priority: 'medium',
      opportunity: 'Volume contract',
      trend: 'up' 
    },
  ];

  useEffect(() => {
    setMarketData(sampleMarketData);
  }, []);

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
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
                      <TableRow key={row.id} hover>
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
    </Box>
  );
};

export default MarketMapping;
