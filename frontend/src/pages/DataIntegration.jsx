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
  Storage, // Changed from Database to Storage
  Api,
  CheckCircle,
  Error,
  Pending,
  Add,
  Cancel
} from '@mui/icons-material';

const DataIntegration = () => {
  const [dataSources, setDataSources] = useState([
    { id: 1, name: 'Bloomberg Terminal', type: 'API', status: 'connected', lastSync: '2 hours ago' },
    { id: 2, name: 'Reuters Data', type: 'API', status: 'connected', lastSync: '1 hour ago' },
    { id: 3, name: 'SEC EDGAR', type: 'Web Scraping', status: 'pending', lastSync: 'Never' },
    { id: 4, name: 'Internal CRM', type: 'Database', status: 'error', lastSync: '5 days ago' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    type: '',
    endpoint: '',
    credentials: ''
  });

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

  const handleAddSource = () => {
    const newDataSource = {
      id: dataSources.length + 1,
      name: newSource.name,
      type: newSource.type,
      status: 'pending',
      lastSync: 'Never'
    };
    setDataSources([...dataSources, newDataSource]);
    setNewSource({ name: '', type: '', endpoint: '', credentials: '' });
    setOpenDialog(false);
  };

  const toggleDataSource = (id) => {
    setDataSources(dataSources.map(source =>
      source.id === id 
        ? { ...source, status: source.status === 'connected' ? 'disabled' : 'connected' }
        : source
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Integration Hub
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
                      {getStatusIcon(source.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={source.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Type: {source.type} • Last sync: {source.lastSync}
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
                        onChange={() => toggleDataSource(source.id)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Quality Metrics
              </Typography>
              <Grid container spacing={2}>
                {[
                  { metric: 'Completeness', value: 92, color: 'success' },
                  { metric: 'Accuracy', value: 88, color: 'warning' },
                  { metric: 'Timeliness', value: 95, color: 'success' },
                  { metric: 'Consistency', value: 85, color: 'warning' }
                ].map((item, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color={`${item.color}.main`}>
                        {item.value}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.metric}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Connectors
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { name: 'Financial APIs', icon: <Api />, count: 12 },
                  { name: 'Databases', icon: <Storage />, count: 8 }, {/* Changed from Database to Storage */}
                  { name: 'Cloud Storage', icon: <CloudUpload />, count: 6 },
                  { name: 'Custom APIs', icon: <Add />, count: 'Unlimited' }
                ].map((connector, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {connector.icon}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{connector.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {connector.count} connectors
                        </Typography>
                      </Box>
                      <Button size="small">Explore</Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Data Source</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Source Name"
              value={newSource.name}
              onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newSource.type}
                label="Type"
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
              >
                <MenuItem value="API">API</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
                <MenuItem value="Web Scraping">Web Scraping</MenuItem>
                <MenuItem value="File Upload">File Upload</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Endpoint URL"
              value={newSource.endpoint}
              onChange={(e) => setNewSource({ ...newSource, endpoint: e.target.value })}
              fullWidth
            />
            <TextField
              label="Credentials"
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
            disabled={!newSource.name || !newSource.type}
          >
            Add Source
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataIntegration;
