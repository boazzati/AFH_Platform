import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper
} from '@mui/material';
import { Add, Save, PlayArrow, Restaurant, Business, LocalCafe, Visibility } from '@mui/icons-material';
import { playbookGeneratorAPI } from '../services/api';

const PlaybookGenerator = () => {
  const [playbookName, setPlaybookName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [accountType, setAccountType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [savedPlaybooks, setSavedPlaybooks] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);

  const channels = [
    { name: 'Quick Service Restaurant (QSR)', icon: <Restaurant />, value: 'QSR' },
    { name: 'Workplace & Corporate', icon: <Business />, value: 'Workplace' },
    { name: 'Leisure & Hospitality', icon: <LocalCafe />, value: 'Leisure' },
    { name: 'Education', icon: <Business />, value: 'Education' },
    { name: 'Healthcare', icon: <Business />, value: 'Healthcare' }
  ];

  const accountTypes = ['New Account Acquisition', 'Existing Account Growth', 'Competitive Takeover', 'Menu Expansion'];

  const playbookTemplates = [
    { name: 'QSR Beverage Partnership', channel: 'QSR', focus: 'New account acquisition' },
    { name: 'Workplace Wellness Program', channel: 'Workplace', focus: 'Healthy beverage placement' },
    { name: 'Hotel Mini-Bar Refresh', channel: 'Leisure', focus: 'Premium portfolio placement' },
    { name: 'Campus Dining Expansion', channel: 'Education', focus: 'Volume contract strategy' }
  ];

  // Load saved playbooks
  useEffect(() => {
    loadSavedPlaybooks();
  }, []);

  const loadSavedPlaybooks = async () => {
    try {
      const response = await playbookGeneratorAPI.getPlaybooks();
      setPlaybooks(response.data);
    } catch (error) {
      console.error('Error loading playbooks:', error);
    }
  };

  const handleChannelSelect = (channel) => {
    if (!selectedChannels.find(c => c.name === channel.name)) {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleChannelRemove = (channelToRemove) => {
    setSelectedChannels(selectedChannels.filter(channel => channel.name !== channelToRemove.name));
  };

  const handleGeneratePlaybook = async () => {
    if (!playbookName || !accountType || selectedChannels.length === 0) {
      setError('Please fill in all fields and select at least one channel');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // First generate the strategy using AI
      const aiResponse = await playbookGeneratorAPI.generatePlaybook({
        channels: selectedChannels.map(ch => ch.value),
        accountType: accountType,
        objectives: playbookName
      });

      const generatedStrategy = aiResponse.data.strategy;

      // Then save the playbook to database
      const saveResponse = await playbookGeneratorAPI.createPlaybook({
        title: playbookName,
        channel: selectedChannels.map(ch => ch.name).join(', '),
        description: `AI-generated playbook for ${accountType} in ${selectedChannels.map(ch => ch.name).join(', ')}`,
        sections: [generatedStrategy],
        aiGenerated: true,
        successRate: 85,
        performanceData: {
          estimatedROI: 'High',
          timeline: '6-8 weeks',
          resources: ['Sales Team', 'Marketing Materials', 'Budget Allocation']
        }
      });

      // Add to local state for immediate display
      const newPlaybook = {
        id: saveResponse.data._id || Date.now(),
        title: playbookName,
        channel: selectedChannels.map(ch => ch.name).join(', '),
        description: `AI-generated playbook for ${accountType}`,
        accountType: accountType,
        successRate: 85,
        content: generatedStrategy,
        created: new Date().toLocaleDateString()
      };

      setSavedPlaybooks(prev => [newPlaybook, ...prev]);
      setSuccess('Playbook generated and saved successfully!');
      setGeneratedContent(generatedStrategy);
      setPreviewOpen(true);
      
      // Reload from backend
      await loadSavedPlaybooks();
      
    } catch (error) {
      console.error('Error generating playbook:', error);
      setError('Failed to generate playbook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewStrategy = async () => {
    if (!playbookName || !accountType || selectedChannels.length === 0) {
      setError('Please fill in all fields and select at least one channel');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await playbookGeneratorAPI.generatePlaybook({
        channels: selectedChannels.map(ch => ch.value),
        accountType: accountType,
        objectives: playbookName
      });

      setGeneratedContent(response.data.strategy);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      setError('Failed to generate preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (template) => {
    setPlaybookName(template.name);
    setAccountType('New Account Acquisition');
    
    const channel = channels.find(ch => ch.value === template.channel);
    if (channel) {
      setSelectedChannels([channel]);
    }

    setSuccess(`Template "${template.name}" loaded. Click "Generate Playbook" to continue.`);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleViewSavedPlaybook = (playbook) => {
    setGeneratedContent(playbook.sections?.[0] || playbook.content || 'No content available');
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Commercial Playbook Generator
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        AI-generated living playbooks for AFH channel strategies
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
              <Typography variant="h6" gutterBottom>
                Create New Playbook
              </Typography>
              
              <TextField
                fullWidth
                label="Playbook Name"
                placeholder="e.g., QSR Beverage Partnership Strategy"
                value={playbookName}
                onChange={(e) => setPlaybookName(e.target.value)}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={accountType}
                  label="Account Type"
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  {accountTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle1" gutterBottom>
                Target Channels
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {channels.map(channel => (
                  <Chip
                    key={channel.name}
                    icon={channel.icon}
                    label={channel.name}
                    onClick={() => handleChannelSelect(channel)}
                    color={selectedChannels.find(c => c.name === channel.name) ? 'primary' : 'default'}
                    variant={selectedChannels.find(c => c.name === channel.name) ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>

              {selectedChannels.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Channels:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {selectedChannels.map(channel => (
                      <Chip
                        key={channel.name}
                        icon={channel.icon}
                        label={channel.name}
                        onDelete={() => handleChannelRemove(channel)}
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleGeneratePlaybook}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Playbook'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<PlayArrow />}
                  onClick={handlePreviewStrategy}
                  disabled={loading}
                >
                  Preview Strategy
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Saved Playbooks Section */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Saved Playbooks
              </Typography>
              {savedPlaybooks.length === 0 && playbooks.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No playbooks saved yet. Generate your first playbook!
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {[...savedPlaybooks, ...playbooks].map((playbook, index) => (
                    <Paper key={playbook.id || playbook._id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {playbook.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {playbook.channel} • {playbook.accountType || 'Various Accounts'}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {playbook.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip 
                              label={`${playbook.successRate || 85}% Success`} 
                              color="success" 
                              size="small" 
                            />
                            <Typography variant="caption" color="text.secondary">
                              Created: {playbook.created || new Date(playbook.lastUpdated).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Button 
                          startIcon={<Visibility />}
                          onClick={() => handleViewSavedPlaybook(playbook)}
                          size="small"
                        >
                          View
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Playbook Templates
              </Typography>
              <Stack spacing={2}>
                {playbookTemplates.map((template, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {template.channel} • {template.focus}
                      </Typography>
                      <Button 
                        size="small" 
                        startIcon={<Add />}
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>
          Playbook Content
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            whiteSpace: 'pre-wrap', 
            maxHeight: '400px', 
            overflow: 'auto',
            p: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }}>
            {generatedContent || 'No content available'}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
          <Button variant="contained" onClick={handleClosePreview}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlaybookGenerator;
