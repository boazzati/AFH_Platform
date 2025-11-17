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
  LinearProgress,
  Alert
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerationSuccess, setShowGenerationSuccess] = useState(false);
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
          title: playbookData.data?.title || `Strategic Partnership Playbook: ${title}`,
          category: playbookData.data?.partnershipModel || type.charAt(0).toUpperCase() + type.slice(1),
          description: playbookData.data?.overview || `AI-generated partnership strategy for ${title}`,
          steps: playbookData.data?.strategicSteps?.length || 8,
          duration: playbookData.data?.timeToClose || '3-5 months',
          successRate: playbookData.data?.successRate || 75,
          brands: playbookData.data?.keyBrands || ['Pepsi', 'Doritos', 'Lay\'s'],
          keyInsights: playbookData.data?.industryInsights?.opportunities || [`Strategic partnership opportunity for ${title}`],
          targetAudience: playbookData.data?.targetAudience || 'Target audience analysis',
          revenueModel: playbookData.data?.revenueModel || 'Revenue sharing model',
          averageRevenue: playbookData.data?.averageRevenue || '€2-8M',
          strategicSteps: playbookData.data?.strategicSteps || [],
          industryInsights: playbookData.data?.industryInsights || {},
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

  const handleExportPlaybook = async (format) => {
    if (!selectedPlaybook) return;
    
    try {
      // Create export content
      const exportContent = {
        title: selectedPlaybook.title,
        category: selectedPlaybook.category,
        description: selectedPlaybook.description,
        steps: selectedPlaybook.steps,
        duration: selectedPlaybook.duration,
        successRate: selectedPlaybook.successRate,
        brands: selectedPlaybook.brands,
        keyInsights: selectedPlaybook.keyInsights,
        strategicSteps: selectedPlaybook.strategicSteps,
        targetAudience: selectedPlaybook.targetAudience,
        averageRevenue: selectedPlaybook.averageRevenue,
        fullData: selectedPlaybook.fullData
      };
      
      if (format === 'pdf') {
        // Generate PDF
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text(selectedPlaybook.title, 20, 30);
        
        // Add category
        doc.setFontSize(14);
        doc.text(`Category: ${selectedPlaybook.category}`, 20, 50);
        
        // Add description
        doc.setFontSize(12);
        const splitDescription = doc.splitTextToSize(selectedPlaybook.description, 170);
        doc.text(splitDescription, 20, 70);
        
        // Add metrics
        doc.text(`Steps: ${selectedPlaybook.steps} | Duration: ${selectedPlaybook.duration} | Success Rate: ${selectedPlaybook.successRate}%`, 20, 100);
        doc.text(`Revenue Potential: ${selectedPlaybook.averageRevenue}`, 20, 110);
        
        // Add target audience
        doc.text(`Target Audience: ${selectedPlaybook.targetAudience}`, 20, 125);
        
        // Add brands
        doc.text(`Key Brands: ${selectedPlaybook.brands.join(', ')}`, 20, 140);
        
        // Add strategic steps if available
        if (selectedPlaybook.strategicSteps && selectedPlaybook.strategicSteps.length > 0) {
          doc.text('Strategic Implementation Steps:', 20, 160);
          let yPosition = 175;
          selectedPlaybook.strategicSteps.forEach((step, index) => {
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 30;
            }
            doc.text(`${step.stepNumber}. ${step.title} (${step.duration})`, 20, yPosition);
            yPosition += 10;
            const splitDesc = doc.splitTextToSize(step.description, 170);
            doc.text(splitDesc, 25, yPosition);
            yPosition += splitDesc.length * 5 + 10;
          });
        }
        
        // Download PDF
        doc.save(`${selectedPlaybook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_playbook.pdf`);
        
      } else if (format === 'ppt') {
        // Generate PPT using PptxGenJS
        const { default: PptxGenJS } = await import('pptxgenjs');
        const pptx = new PptxGenJS();
        
        // Title slide
        const slide1 = pptx.addSlide();
        slide1.addText(selectedPlaybook.title, {
          x: 1, y: 1, w: 8, h: 1.5,
          fontSize: 24, bold: true, color: '004B87'
        });
        slide1.addText(selectedPlaybook.category, {
          x: 1, y: 2.5, w: 8, h: 0.5,
          fontSize: 16, color: '666666'
        });
        slide1.addText(selectedPlaybook.description, {
          x: 1, y: 3.5, w: 8, h: 2,
          fontSize: 14
        });
        
        // Metrics slide
        const slide2 = pptx.addSlide();
        slide2.addText('Partnership Metrics', {
          x: 1, y: 0.5, w: 8, h: 1,
          fontSize: 20, bold: true, color: '004B87'
        });
        slide2.addText(`Steps: ${selectedPlaybook.steps}`, { x: 1, y: 2, w: 4, h: 0.5, fontSize: 16 });
        slide2.addText(`Duration: ${selectedPlaybook.duration}`, { x: 1, y: 2.7, w: 4, h: 0.5, fontSize: 16 });
        slide2.addText(`Success Rate: ${selectedPlaybook.successRate}%`, { x: 1, y: 3.4, w: 4, h: 0.5, fontSize: 16 });
        slide2.addText(`Revenue: ${selectedPlaybook.averageRevenue}`, { x: 1, y: 4.1, w: 4, h: 0.5, fontSize: 16 });
        slide2.addText(`Key Brands: ${selectedPlaybook.brands.join(', ')}`, { x: 1, y: 4.8, w: 8, h: 0.5, fontSize: 16 });
        
        // Strategic steps slides
        if (selectedPlaybook.strategicSteps && selectedPlaybook.strategicSteps.length > 0) {
          selectedPlaybook.strategicSteps.forEach((step, index) => {
            const stepSlide = pptx.addSlide();
            stepSlide.addText(`Step ${step.stepNumber}: ${step.title}`, {
              x: 1, y: 0.5, w: 8, h: 1,
              fontSize: 18, bold: true, color: '004B87'
            });
            stepSlide.addText(`Duration: ${step.duration}`, {
              x: 1, y: 1.5, w: 8, h: 0.5,
              fontSize: 14, color: '666666'
            });
            stepSlide.addText(step.description, {
              x: 1, y: 2.2, w: 8, h: 1.5,
              fontSize: 12
            });
            
            // Add key actions
            if (step.keyActions && step.keyActions.length > 0) {
              stepSlide.addText('Key Actions:', {
                x: 1, y: 4, w: 8, h: 0.5,
                fontSize: 14, bold: true
              });
              step.keyActions.slice(0, 3).forEach((action, actionIndex) => {
                stepSlide.addText(`• ${action}`, {
                  x: 1.2, y: 4.5 + (actionIndex * 0.4), w: 7.5, h: 0.4,
                  fontSize: 11
                });
              });
            }
          });
        }
        
        // Download PPT
        pptx.writeFile({ fileName: `${selectedPlaybook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_playbook.pptx` });
      }
      
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      alert(`Error exporting ${format.toUpperCase()}. Please try again.`);
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
                Generate New Partnership Playbook
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
              
              {/* Success Notification */}
              {showGenerationSuccess && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 2,
                    animation: 'fadeIn 0.5s ease-in-out',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(-10px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  <strong>Success!</strong> New AI-powered partnership playbook generated and added to your collection.
                </Alert>
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
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: `${pepsicoBrandColors.secondary.green}20`, borderRadius: 1, border: `1px solid ${pepsicoBrandColors.secondary.green}` }}>
                      <Typography variant="h4" fontWeight={600} color={pepsicoBrandColors.secondary.green}>
                        {selectedPlaybook.successRate}%
                      </Typography>
                      <Typography variant="caption" color={pepsicoBrandColors.secondary.green}>
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: `${pepsicoBrandColors.primary.navy}15`, borderRadius: 1, border: `1px solid ${pepsicoBrandColors.primary.navy}` }}>
                      <Typography variant="h4" fontWeight={600} color={pepsicoBrandColors.primary.navy}>
                        {selectedPlaybook.averageRevenue}
                      </Typography>
                      <Typography variant="caption" color={pepsicoBrandColors.primary.navy}>
                        Revenue Potential
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: `${pepsicoBrandColors.accent.orange}20`, borderRadius: 1, border: `1px solid ${pepsicoBrandColors.accent.orange}` }}>
                      <Typography variant="h4" fontWeight={600} color={pepsicoBrandColors.accent.orange}>
                        {selectedPlaybook.duration}
                      </Typography>
                      <Typography variant="caption" color={pepsicoBrandColors.accent.orange}>
                        Timeline
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                <strong>Target Audience:</strong> {selectedPlaybook.targetAudience}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Key Brands:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedPlaybook.brands.map((brand, index) => (
                    <Chip 
                      key={index} 
                      label={brand} 
                      sx={{ 
                        bgcolor: `${pepsicoBrandColors.primary.navy}10`,
                        color: pepsicoBrandColors.primary.navy,
                        border: `1px solid ${pepsicoBrandColors.primary.navy}30`
                      }} 
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Strategic Implementation Steps:
              </Typography>
              
              {selectedPlaybook.strategicSteps && selectedPlaybook.strategicSteps.length > 0 ? (
                selectedPlaybook.strategicSteps.map((step, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>
                        Step {step.stepNumber}: {step.title}
                      </Typography>
                      <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                        ({step.duration})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Key Actions:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                        {step.keyActions.map((action, actionIndex) => (
                          <Typography component="li" variant="body2" key={actionIndex} sx={{ mb: 0.5 }}>
                            {action}
                          </Typography>
                        ))}
                      </Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Success Metrics:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {step.successMetrics.map((metric, metricIndex) => (
                          <Typography component="li" variant="body2" key={metricIndex} sx={{ mb: 0.5 }}>
                            {metric}
                          </Typography>
                        ))}
                      </Box>
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
                onClick={() => handleExportPlaybook('pdf')}
              >
                Export PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Slideshow />}
                onClick={() => handleExportPlaybook('ppt')}
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
