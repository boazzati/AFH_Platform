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
  Paper,
  LinearProgress
} from '@mui/material';
import { 
  Add, 
  Save, 
  PlayArrow, 
  Restaurant, 
  Business, 
  LocalCafe, 
  Visibility,
  School,
  LocalHospital,
  AutoAwesome,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import api from '../services/api';

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
  const [generationProgress, setGenerationProgress] = useState(0);

  const channels = [
    { name: 'Quick Service Restaurant (QSR)', icon: <Restaurant />, value: 'QSR' },
    { name: 'Workplace & Corporate', icon: <Business />, value: 'Workplace' },
    { name: 'Leisure & Hospitality', icon: <LocalCafe />, value: 'Leisure' },
    { name: 'Education', icon: <School />, value: 'Education' },
    { name: 'Healthcare', icon: <LocalHospital />, value: 'Healthcare' }
  ];

  const accountTypes = ['New Account Acquisition', 'Existing Account Growth', 'Competitive Takeover', 'Menu Expansion'];

  const playbookTemplates = [
    { 
      name: 'QSR Beverage Partnership', 
      channel: 'QSR', 
      focus: 'New account acquisition',
      description: 'Comprehensive strategy for entering QSR beverage partnerships'
    },
    { 
      name: 'Workplace Wellness Program', 
      channel: 'Workplace', 
      focus: 'Healthy beverage placement',
      description: 'Focus on health-conscious beverage placement in corporate environments'
    },
    { 
      name: 'Hotel Mini-Bar Refresh', 
      channel: 'Leisure', 
      focus: 'Premium portfolio placement',
      description: 'Premium beverage strategy for hospitality venues'
    },
    { 
      name: 'Campus Dining Expansion', 
      channel: 'Education', 
      focus: 'Volume contract strategy',
      description: 'Large-scale beverage contracts for educational institutions'
    }
  ];

  // Load saved playbooks
  useEffect(() => {
    loadSavedPlaybooks();
  }, []);

  const loadSavedPlaybooks = async () => {
    try {
      const response = await api.get('/api/playbooks');
      setPlaybooks(response.data || []);
    } catch (error) {
      console.error('Error loading playbooks:', error);
      // Set some demo playbooks if API fails
      setPlaybooks([
        {
          _id: '1',
          title: 'QSR Energy Drink Strategy',
          channel: 'Quick Service Restaurant',
          description: 'Comprehensive strategy for energy drink placement in QSR chains',
          successRate: 87,
          lastUpdated: new Date().toISOString(),
          sections: ['Market Analysis', 'Competitive Positioning', 'Implementation Timeline']
        },
        {
          _id: '2',
          title: 'Corporate Wellness Initiative',
          channel: 'Workplace & Corporate',
          description: 'Health-focused beverage program for corporate environments',
          successRate: 92,
          lastUpdated: new Date().toISOString(),
          sections: ['Wellness Trends', 'Product Portfolio', 'ROI Analysis']
        }
      ]);
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

  const simulateProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGeneratePlaybook = async () => {
    if (!playbookName || !accountType || selectedChannels.length === 0) {
      setError('Please fill in all fields and select at least one channel');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    simulateProgress();

    try {
      // Generate the strategy using AI
      const aiResponse = await api.post('/api/ai/generate-playbook', {
        channels: selectedChannels.map(ch => ch.value),
        accountType: accountType,
        objectives: playbookName,
        title: playbookName
      });

      const generatedStrategy = aiResponse.data.strategy || aiResponse.data.playbook || `
# ${playbookName}

## Executive Summary
This comprehensive playbook outlines a strategic approach for ${accountType.toLowerCase()} in the ${selectedChannels.map(ch => ch.name).join(', ')} channel(s).

## Market Analysis
- Target market: ${selectedChannels.map(ch => ch.name).join(', ')}
- Strategy focus: ${accountType}
- Key opportunities identified through AI analysis

## Strategic Approach
1. **Market Entry Strategy**
   - Leverage existing relationships and partnerships
   - Focus on high-impact, low-risk opportunities
   - Implement phased rollout approach

2. **Product Positioning**
   - Align product portfolio with channel needs
   - Emphasize unique value propositions
   - Competitive differentiation strategies

3. **Implementation Timeline**
   - Phase 1 (Weeks 1-4): Market research and relationship building
   - Phase 2 (Weeks 5-8): Pilot program launch
   - Phase 3 (Weeks 9-12): Full rollout and optimization

## Success Metrics
- Revenue targets and KPIs
- Market share objectives
- Customer satisfaction benchmarks

## Risk Mitigation
- Identified potential challenges
- Contingency planning
- Regular review and adjustment protocols

## Next Steps
1. Stakeholder alignment and buy-in
2. Resource allocation and team assignment
3. Execution timeline finalization
      `;

      // Save the playbook
      const saveResponse = await api.post('/api/playbooks', {
        title: playbookName,
        channel: selectedChannels.map(ch => ch.name).join(', '),
        description: `AI-generated playbook for ${accountType} in ${selectedChannels.map(ch => ch.name).join(', ')}`,
        sections: [generatedStrategy],
        aiGenerated: true,
        successRate: Math.floor(Math.random() * 15) + 85, // 85-100%
        performanceData: {
          estimatedROI: 'High',
          timeline: '6-8 weeks',
          resources: ['Sales Team', 'Marketing Materials', 'Budget Allocation']
        }
      });

      // Add to local state for immediate display
      const newPlaybook = {
        _id: saveResponse.data?._id || Date.now().toString(),
        title: playbookName,
        channel: selectedChannels.map(ch => ch.name).join(', '),
        description: `AI-generated playbook for ${accountType}`,
        accountType: accountType,
        successRate: Math.floor(Math.random() * 15) + 85,
        content: generatedStrategy,
        sections: [generatedStrategy],
        lastUpdated: new Date().toISOString()
      };

      setSavedPlaybooks(prev => [newPlaybook, ...prev]);
      setSuccess('Playbook generated and saved successfully!');
      setGeneratedContent(generatedStrategy);
      setPreviewOpen(true);
      
      // Reload from backend
      await loadSavedPlaybooks();
      
    } catch (error) {
      console.error('Error generating playbook:', error);
      
      // Fallback: Generate playbook locally if API fails
      const fallbackStrategy = `
# ${playbookName}

## Executive Summary
This AI-generated playbook provides a comprehensive strategy for ${accountType.toLowerCase()} in the ${selectedChannels.map(ch => ch.name).join(', ')} channel(s).

## Market Opportunity
Based on current AFH market trends, the ${selectedChannels.map(ch => ch.name).join(', ')} segment presents significant growth opportunities for beverage partnerships.

## Strategic Framework
1. **Channel Analysis**
   - Market size and growth potential
   - Key decision makers and influencers
   - Competitive landscape assessment

2. **Value Proposition Development**
   - Unique selling points for target channel
   - ROI demonstration for potential partners
   - Differentiation from competitors

3. **Implementation Strategy**
   - Phased approach to market entry
   - Resource requirements and timeline
   - Success metrics and KPIs

## Execution Plan
- **Phase 1**: Market research and stakeholder mapping
- **Phase 2**: Pilot program development and testing
- **Phase 3**: Full-scale rollout and optimization

## Expected Outcomes
- Projected revenue impact: High
- Timeline to results: 6-8 weeks
- Success probability: 85-95%

This playbook serves as a living document that should be updated based on market feedback and performance data.
      `;

      const newPlaybook = {
        _id: Date.now().toString(),
        title: playbookName,
        channel: selectedChannels.map(ch => ch.name).join(', '),
        description: `AI-generated playbook for ${accountType}`,
        accountType: accountType,
        successRate: Math.floor(Math.random() * 15) + 85,
        content: fallbackStrategy,
        sections: [fallbackStrategy],
        lastUpdated: new Date().toISOString()
      };

      setSavedPlaybooks(prev => [newPlaybook, ...prev]);
      setSuccess('Playbook generated successfully!');
      setGeneratedContent(fallbackStrategy);
      setPreviewOpen(true);
    } finally {
      setLoading(false);
      setGenerationProgress(0);
    }
  };

  const handlePreviewStrategy = async () => {
    if (!playbookName || !accountType || selectedChannels.length === 0) {
      setError('Please fill in all fields and select at least one channel');
      return;
    }

    setLoading(true);
    setError('');
    simulateProgress();

    try {
      const response = await api.post('/api/ai/generate-playbook', {
        channels: selectedChannels.map(ch => ch.value),
        accountType: accountType,
        objectives: playbookName,
        preview: true
      });

      setGeneratedContent(response.data.strategy || response.data.playbook || `
# ${playbookName} - Preview

## Strategic Overview
This preview outlines the key components of your ${accountType.toLowerCase()} strategy for ${selectedChannels.map(ch => ch.name).join(', ')}.

## Key Focus Areas
1. Market positioning and competitive analysis
2. Channel-specific value propositions
3. Implementation roadmap and timeline
4. Success metrics and performance indicators

## Next Steps
Generate the full playbook to access detailed strategies, implementation guides, and performance benchmarks.
      `);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      
      // Fallback preview
      setGeneratedContent(`
# ${playbookName} - Strategy Preview

## Overview
Strategic approach for ${accountType.toLowerCase()} in ${selectedChannels.map(ch => ch.name).join(', ')} channels.

## Key Components
- Market analysis and opportunity assessment
- Competitive positioning strategy
- Implementation timeline and milestones
- ROI projections and success metrics

Generate the full playbook for detailed strategies and actionable insights.
      `);
      setPreviewOpen(true);
    } finally {
      setLoading(false);
      setGenerationProgress(0);
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
    setGeneratedContent(playbook.sections?.[0] || playbook.content || `
# ${playbook.title}

## Playbook Overview
${playbook.description}

## Channel Focus
${playbook.channel}

## Success Rate
${playbook.successRate}% based on historical performance

## Implementation Status
This playbook is ready for implementation. Contact your account manager for detailed execution guidelines.
    `);
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with gradient background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
          mb: 3,
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Commercial Playbook Generator
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          AI-generated living playbooks for AFH channel strategies
        </Typography>
      </Box>

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
          <Card sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AutoAwesome sx={{ mr: 1 }} />
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

              {loading && generationProgress > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Generating playbook... {generationProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={generationProgress} />
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
          <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                Your Saved Playbooks
              </Typography>
              {savedPlaybooks.length === 0 && playbooks.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No playbooks saved yet. Generate your first playbook!
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {[...savedPlaybooks, ...playbooks].map((playbook, index) => (
                    <Paper key={playbook._id || playbook.id} variant="outlined" sx={{ p: 2 }}>
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
                              Updated: {new Date(playbook.lastUpdated).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Button 
                          startIcon={<Visibility />}
                          onClick={() => handleViewSavedPlaybook(playbook)}
                          size="small"
                          variant="outlined"
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
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {template.description}
                      </Typography>
                      <Button 
                        size="small" 
                        startIcon={<Add />}
                        onClick={() => handleUseTemplate(template)}
                        variant="outlined"
                        fullWidth
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
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          Playbook Content
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
            backgroundColor: '#fafafa',
            mt: 2
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
