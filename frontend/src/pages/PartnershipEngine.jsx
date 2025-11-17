import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tab,
  Tabs,
  Avatar,
  TextField,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import {
  SmartToy,
  Send,
  TrendingUp,
  Business,
  School,
  Close,
  ExpandMore,
  GetApp,
  PictureAsPdf,
  Slideshow
} from '@mui/icons-material';

const pepsicoBrandColors = {
  primary: {
    navy: '#004B87',
    red: '#E32017',
    blue: '#0066CC'
  },
  secondary: {
    orange: '#FF6B35',
    yellow: '#FFD100',
    green: '#00A651'
  },
  neutral: {
    darkGray: '#2C2C2C',
    mediumGray: '#666666',
    lightGray: '#F5F5F5',
    white: '#FFFFFF'
  }
};

const PartnershipEngine = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: "Hello! I'm your PepsiCo Partnership AI. I can help you create activation strategies, generate outreach campaigns, and optimize partnership opportunities. What would you like to work on today?"
    }
  ]);
  const [isGeneratingPlaybook, setIsGeneratingPlaybook] = useState(false);
  const [generatedPlaybooks, setGeneratedPlaybooks] = useState([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const chatSuggestions = [
    "Create a concert festival partnership playbook",
    "Generate gaming esports partnership strategy", 
    "Analyze theme park collaboration opportunities"
  ];

  const staticPlaybooks = [
    {
      id: 'restaurant-services',
      title: 'Local Restaurant Value Services',
      category: 'Foodservice',
      description: 'AI-powered value-added services for mid-size restaurant chains (50-150 outlets) including SRP tools and dynamic pricing',
      steps: 8,
      duration: '4-6 weeks',
      successRate: 89,
      brands: ['Pepsi', 'Lay\'s', 'Gatorade'],
      keyInsights: [
        'Most profitable AFH channel with highest margins',
        'Focus on operational efficiency and cost reduction',
        'Digital integration opportunities with POS systems'
      ],
      isStatic: true
    },
    {
      id: 'immersive-experience',
      title: 'Immersive Food Experience',
      category: 'Theme Parks',
      description: 'Doritos Loaded-style culinary activations with full story-world integration and co-creation partnerships',
      steps: 12,
      duration: '8-12 months',
      successRate: 94,
      brands: ['Doritos', 'Cheetos', 'Flamin\' Hot'],
      keyInsights: [
        'Highest brand building impact and consumer engagement',
        'Premium pricing opportunities with experiential value',
        'Social media amplification through immersive storytelling'
      ],
      isStatic: true
    }
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: `I'll help you with that! Based on PepsiCo's AFH strategy and current market trends, here are my recommendations for "${userMessage}"...` 
      }]);
    }, 1000);
  };

  const generateNewPlaybook = async (type, title, region) => {
    setIsGeneratingPlaybook(true);
    
    try {
      const response = await fetch('https://afhplatform-production.up.railway.app/api/playbooks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: type,
          region: region,
          target: title
        }),
      });

      if (response.ok) {
        const playbookData = await response.json();
        const newPlaybook = {
          id: `generated-${Date.now()}`,
          title: playbookData.title || `Strategic Partnership Playbook: ${title}`,
          category: type.charAt(0).toUpperCase() + type.slice(1),
          description: playbookData.overview || `AI-generated partnership strategy for ${title}`,
          steps: playbookData.steps?.length || 8,
          duration: playbookData.timeline || '3-5 months',
          successRate: playbookData.successRate || 75,
          brands: playbookData.brands || ['Pepsi', 'Doritos', 'Lay\'s'],
          keyInsights: playbookData.keyInsights || [`Strategic partnership opportunity for ${title}`],
          fullData: playbookData,
          isGenerated: true
        };
        
        setGeneratedPlaybooks(prev => [newPlaybook, ...prev]);
      }
    } catch (error) {
      console.error('Error generating playbook:', error);
    } finally {
      setIsGeneratingPlaybook(false);
    }
  };

  const handleViewPlaybook = (playbook) => {
    setSelectedPlaybook(playbook);
    setModalOpen(true);
  };

  const handleExportPlaybook = (format) => {
    if (selectedPlaybook) {
      console.log(`Exporting ${selectedPlaybook.title} as ${format}`);
      // Implementation for PDF/PPT export would go here
    }
  };

  const allPlaybooks = [...generatedPlaybooks, ...staticPlaybooks];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: pepsicoBrandColors.primary.navy }}>
        Activate Partnerships
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        AI-powered partnership activation with smart playbooks and automated outreach
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Partnership Playbooks" />
          <Tab label="AI Assistant" />
          <Tab label="Outreach Campaigns" />
        </Tabs>
      </Box>

      {/* Partnership Playbooks Tab */}
      {selectedTab === 0 && (
        <Box>
          {/* Quick Generate Section */}
          <Card sx={{ mb: 3, bgcolor: `${pepsicoBrandColors.primary.navy}10` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                🚀 Generate New Partnership Playbook
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => generateNewPlaybook('concerts', 'Tomorrowland Festival - Immersive Food Experience', 'Europe')}
                    disabled={isGeneratingPlaybook}
                    sx={{ 
                      borderColor: pepsicoBrandColors.primary.navy,
                      color: pepsicoBrandColors.primary.navy,
                      '&:hover': { bgcolor: `${pepsicoBrandColors.primary.navy}10` }
                    }}
                  >
                    🎵 Concert Partnership
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => generateNewPlaybook('gaming', 'T1 Esports - Gaming Arena Partnership', 'Asia')}
                    disabled={isGeneratingPlaybook}
                    sx={{ 
                      borderColor: pepsicoBrandColors.primary.navy,
                      color: pepsicoBrandColors.primary.navy,
                      '&:hover': { bgcolor: `${pepsicoBrandColors.primary.navy}10` }
                    }}
                  >
                    🎮 Gaming Partnership
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => generateNewPlaybook('petrol', 'Shell Premium Stations - Travel Convenience', 'Europe')}
                    disabled={isGeneratingPlaybook}
                    sx={{ 
                      borderColor: pepsicoBrandColors.primary.navy,
                      color: pepsicoBrandColors.primary.navy,
                      '&:hover': { bgcolor: `${pepsicoBrandColors.primary.navy}10` }
                    }}
                  >
                    ⛽ Petrol Retail
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => generateNewPlaybook('themepark', 'Europa-Park - Immersive Brand Experience', 'Europe')}
                    disabled={isGeneratingPlaybook}
                    sx={{ 
                      borderColor: pepsicoBrandColors.primary.navy,
                      color: pepsicoBrandColors.primary.navy,
                      '&:hover': { bgcolor: `${pepsicoBrandColors.primary.navy}10` }
                    }}
                  >
                    🎢 Theme Park
                  </Button>
                </Grid>
              </Grid>
              {isGeneratingPlaybook && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Generating AI-powered partnership playbook...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Playbook Cards */}
          <Grid container spacing={3}>
            {allPlaybooks.map((playbook) => (
              <Grid item xs={12} md={6} key={playbook.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {playbook.title}
                      </Typography>
                      <Chip 
                        label={playbook.isGenerated ? "AI Generated" : playbook.category}
                        color={playbook.isGenerated ? "success" : "primary"}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {playbook.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {playbook.steps}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Steps
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {playbook.duration}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600} color="success.main">
                          {playbook.successRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Success Rate
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Key Brands:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {playbook.brands.map((brand, index) => (
                          <Chip key={index} label={brand} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleViewPlaybook(playbook)}
                      sx={{ 
                        bgcolor: pepsicoBrandColors.primary.navy,
                        '&:hover': { bgcolor: pepsicoBrandColors.primary.blue }
                      }}
                    >
                      View Full Playbook
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* AI Assistant Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: 500 }}>
              <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: pepsicoBrandColors.primary.navy }}>
                      <SmartToy />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        PepsiCo Partnership AI
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Your intelligent partnership strategist
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                  {chatHistory.map((chat, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: chat.type === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}>
                      <Paper sx={{ 
                        p: 2, 
                        maxWidth: '70%',
                        bgcolor: chat.type === 'user' ? pepsicoBrandColors.primary.navy : pepsicoBrandColors.neutral.lightGray,
                        color: chat.type === 'user' ? 'white' : 'text.primary'
                      }}>
                        <Typography variant="body2">
                          {chat.message}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Ask about partnership strategies, playbooks, or outreach..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      size="small"
                    />
                    <IconButton 
                      onClick={handleSendMessage}
                      sx={{ color: pepsicoBrandColors.primary.navy }}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                {chatSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    fullWidth
                    variant="outlined"
                    onClick={() => setChatMessage(suggestion)}
                    sx={{ 
                      mb: 1,
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderColor: pepsicoBrandColors.neutral.mediumGray,
                      color: 'text.primary',
                      '&:hover': { bgcolor: pepsicoBrandColors.neutral.lightGray }
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Outreach Campaigns Tab */}
      {selectedTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Outreach Campaigns
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Automated outreach campaign functionality coming soon...
          </Typography>
        </Box>
      )}

      {/* Playbook Detail Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPlaybook && (
          <>
            <DialogTitle sx={{ 
              bgcolor: pepsicoBrandColors.primary.navy, 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" fontWeight={600}>
                {selectedPlaybook.title}
              </Typography>
              <IconButton 
                onClick={() => setModalOpen(false)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="h4" fontWeight={600} color="success.dark">
                        {selectedPlaybook.successRate}%
                      </Typography>
                      <Typography variant="caption" color="success.dark">
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="h4" fontWeight={600} color="primary.dark">
                        €2-8M
                      </Typography>
                      <Typography variant="caption" color="primary.dark">
                        Revenue Potential
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                      <Typography variant="h4" fontWeight={600} color="warning.dark">
                        {selectedPlaybook.duration}
                      </Typography>
                      <Typography variant="caption" color="warning.dark">
                        Timeline
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                <strong>Target Audience:</strong> {selectedPlaybook.fullData?.targetAudience || `${selectedPlaybook.title} audience with high engagement potential`}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Key Brands:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedPlaybook.brands.map((brand, index) => (
                    <Chip key={index} label={brand} color="primary" />
                  ))}
                </Box>
              </Box>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Strategic Implementation Steps:
              </Typography>
              
              {selectedPlaybook.fullData?.steps ? (
                selectedPlaybook.fullData.steps.map((step, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>
                        Step {index + 1}: {step.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        {step.description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                selectedPlaybook.keyInsights.map((insight, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>
                        Step {index + 1}: {insight}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Detailed implementation guidance for {insight.toLowerCase()}.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={() => handleExportPlaybook('PDF')}
              >
                Export PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Slideshow />}
                onClick={() => handleExportPlaybook('PPT')}
              >
                Export PPT
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: pepsicoBrandColors.primary.navy,
                  '&:hover': { bgcolor: pepsicoBrandColors.primary.blue }
                }}
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PartnershipEngine;
