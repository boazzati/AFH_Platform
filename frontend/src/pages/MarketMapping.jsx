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
  Chip
} from '@mui/material';
import { Search, TrendingUp, TrendingDown } from '@mui/icons-material';

const MarketMapping = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketData, setMarketData] = useState([]);
  const [selectedSector, setSelectedSector] = useState('all');

  const sectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods'];

  const sampleMarketData = [
    { id: 1, company: 'Tech Corp', sector: 'Technology', marketCap: 2500, growth: 12.5, trend: 'up' },
    { id: 2, company: 'Health Plus', sector: 'Healthcare', marketCap: 1800, growth: 8.3, trend: 'up' },
    { id: 3, company: 'FinSecure', sector: 'Finance', marketCap: 3200, growth: -2.1, trend: 'down' },
    { id: 4, company: 'Energy Solutions', sector: 'Energy', marketCap: 950, growth: 15.7, trend: 'up' },
  ];

  useEffect(() => {
    // Simulate API call
    setMarketData(sampleMarketData);
  }, []);

  const filteredData = marketData.filter(item =>
    item.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSector === 'all' || item.sector === selectedSector)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Market Mapping & Analysis
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <Button variant="outlined" onClick={() => setSelectedSector('all')}>
                  All Sectors
                </Button>
                {sectors.map(sector => (
                  <Chip
                    key={sector}
                    label={sector}
                    onClick={() => setSelectedSector(sector)}
                    color={selectedSector === sector ? 'primary' : 'default'}
                  />
                ))}
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Sector</TableCell>
                      <TableCell>Market Cap (B)</TableCell>
                      <TableCell>Growth (%)</TableCell>
                      <TableCell>Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.company}</TableCell>
                        <TableCell>
                          <Chip label={row.sector} size="small" />
                        </TableCell>
                        <TableCell>${row.marketCap}B</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {row.trend === 'up' ? 
                              <TrendingUp sx={{ color: 'success.main', mr: 1 }} /> : 
                              <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                            }
                            {row.growth}%
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.trend === 'up' ? 'Bullish' : 'Bearish'} 
                            color={row.trend === 'up' ? 'success' : 'error'}
                            size="small"
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
      </Grid>
    </Box>
  );
};

export default MarketMapping;
