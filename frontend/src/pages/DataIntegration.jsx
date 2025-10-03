import React, { useState } from 'react';
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
  MenuItem
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
  Group
} from '@mui/icons-material';

const DataIntegration = () => {
  const [dataSources, setDataSources] = useState([
    { 
      id: 1, 
      name: 'POS System - NCR Aloha', 
      type: 'POS Data', 
      status: 'connected', 
      lastSync: '2 hours ago',
      coverage: '85% of QSR accounts'
    },
    { 
      id: 2, 
      name: 'Operator CRM', 
      type: 'CRM', 
      status: 'connected', 
      lastSync: '1 hour ago',
      coverage: 'All enterprise accounts'
    },
    { 
      id: 3, 
      name: 'Digital Menu Scraping', 
      type: 'Web Data', 
      status: 'pending', 
      lastSync: 'Never',
      coverage: 'Major chain restaurants'
    },
    { 
      id: 4, 
      name: 'Consumer Feedback Stream', 
      type: 'Survey Data', 
      status: 'error', 
      lastSync: '5 days ago',
      coverage: 'Mobile app users'
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    type: '',
    endpoint: '',
    credentials: ''
  });

  const dataStreams = [
    { name: 'Real-time POS', value: '2.4M', trend: '+12%', description: 'Transactions processed today' },
    { name: 'Menu Updates', value: '156', trend: '+8', description: 'Menu changes detected' },
    { name: 'Consumer Reviews', value: '8.2K', trend: '+234', description: 'New reviews analyzed' },
    { name: 'Competitor Pricing', value: '98%', trend: '+5%', description: 'Price coverage accuracy' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'pending': return <Pending color="warning" />;
      default: return <Pending color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'error': return 'error';
      case 'pending': return 'warning';
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Operator & Consumer Data Integration
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Aggregate and analyze POS, menu, and CRM data for real-time AFH insights
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Connected Data Sources
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Source
                </Button>
              </Box>

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
                      <Switch
                        edge="end"
                        checked={source.status === 'connected'}
                        onChange={() => {}}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
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
            onClick={() => setOpenDialog(false)} 
            variant="contained"
            disabled={!newSource.name || !newSource.type}
          >
            Connect Source
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataIntegration;
