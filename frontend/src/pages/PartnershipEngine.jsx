import React, { useState } from 'react';
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
  Chip,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  SmartToy,
  Send,
  PlayArrow,
  Email,
  Phone,
  LinkedIn,
  Business,
  TrendingUp,
  CheckCircle,
  Schedule,
  Person,
  Close,
  ExpandMore,
  AccessTime,
  TrendingUp as TrendingUpIcon,
  AttachMoney
} from '@mui/icons-material';
import { pepsicoBrandColors } from '../theme/pepsico-theme';

// PepsiCo Partnership Engine - AI Assistant + Playbooks + Outreach
const PartnershipEngine = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'assistant',
      message: 'Hello! I\'m your PepsiCo Partnership AI. I can help you create activation strategies, generate outreach campaigns, and optimize partnership opportunities. What would you like to work on today?'
    }
  ]);

  // State for dynamic playbooks
  const [dynamicPlaybooks, setDynamicPlaybooks] = useState([]);
  const [isGeneratingPlaybook, setIsGeneratingPlaybook] = useState(false);
  
  // State for playbook modal
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  
  // Handle viewing full playbook
  const handleViewPlaybook = (playbook) => {
    setSelectedPlaybook(playbook);
    setShowPlaybookModal(true);
  };
  
  const handleClosePlaybookModal = () => {
    setShowPlaybookModal(false);
    setSelectedPlaybook(null);
  };

  // Generate a new playbook
  const generateNewPlaybook = async (industry, target, region = 'Global') => {
    setIsGeneratingPlaybook(true);
    try {
      const response = await fetch('https://afhplatform-production.up.railway.app/api/playbooks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, target, region })
      });
      
      const data = await response.json();
      
      if (data.playbook) {
        const newPlaybook = {
          id: Date.now(),
          title: data.playbook.title,
          category: data.playbook.industryInsights?.demographics || industry,
          description: data.playbook.steps[0]?.description || 'AI-generated partnership strategy',
          steps: data.playbook.steps.length,
          duration: data.playbook.timeToClose,
          successRate: `${data.playbook.successRate}%`,
          brands: data.playbook.keyBrands || ['PepsiCo Products'],
          isGenerated: true,
          fullPlaybook: data.playbook
        };
        
        setDynamicPlaybooks(prev => [newPlaybook, ...prev]);
      }
    } catch (error) {
      console.error('Error generating playbook:', error);
    } finally {
      setIsGeneratingPlaybook(false);
    }
  };

  // PepsiCo Partnership Playbooks (Static Examples)
  const partnershipPlaybooks = [
    {
      id: 1,
      title: 'Local Restaurant Value Services',
      category: 'Foodservice',
      description: 'AI-powered value-added services for mid-size restaurant chains (50-150 outlets) including SRP tools and dynamic pricing',
      steps: 8,
      duration: '4-6 weeks',
      successRate: '89%',
      brands: ['Pepsi', 'Lay\'s', 'Gatorade'],
      priority: 'High - Most Profitable Channel',
      revenueImpact: '€3-7M annually',
      keyTactics: [
        'AI-driven lead generation and prioritization',
        'Dynamic pricing optimization tools',
        'Traffic conversion from third-party ordering',
        'Churn reduction and retention strategies'
      ]
    },
    {
      id: 2,
      title: 'Immersive Food Experience',
      category: 'Theme Parks',
      description: 'Doritos Loaded-style culinary activations with full story-world integration and co-creation partnerships',
      steps: 12,
      duration: '8-12 months',
      successRate: '94%',
      brands: ['Doritos', 'Cheetos', 'Flamin\' Hot'],
      priority: 'Strategic - Brand Building',
      revenueImpact: '€5-15M+ per activation',
      keyTactics: [
        'Storytelling integration with fictional characters',
        'Authentic theming and period props',
        'Co-creation with design and innovation teams',
        'Permanent installation vs temporary activation'
      ]
    },
    {
      id: 3,
      title: 'New F&B Occasions Expansion',
      category: 'Innovation',
      description: 'Menu innovation using PepsiCo products as ingredients, seasonings, and mixology components for incremental revenue',
      steps: 6,
      duration: '3-5 months',
      successRate: '85%',
      brands: ['Flamin\' Hot Seasoning', 'Pepsi Mixers', 'Cheetos Dust'],
      priority: 'Growth - New Revenue Streams',
      revenueImpact: '€2-8M incremental',
      keyTactics: [
        'Culinary activations as ingredients and coatings',
        'Mixology experiences with crafted drinks',
        'Equipment solutions for scale deployment',
        'AI-powered menu optimization recommendations'
      ]
    }
  ];

  // Active Outreach Campaigns
  const outreachCampaigns = [
    {
      id: 1,
      name: 'Northeast C-Store Expansion',
      status: 'Active',
      prospects: 24,
      responses: 8,
      meetings: 3,
      deals: 1,
      responseRate: '33%',
      nextAction: 'Follow-up calls scheduled for this week'
    },
    {
      id: 2,
      name: 'University Partnership Drive',
      status: 'Planning',
      prospects: 15,
      responses: 0,
      meetings: 0,
      deals: 0,
      responseRate: '0%',
      nextAction: 'Campaign launches Monday'
    },
    {
      id: 3,
      name: 'Tech Company Wellness',
      status: 'Completed',
      prospects: 12,
      responses: 9,
      meetings: 6,
      deals: 4,
      responseRate: '75%',
      nextAction: 'Contract negotiations in progress'
    }
  ];

  // AI Chat Suggestions
  const chatSuggestions = [
    'Create a playbook for fast-casual restaurant partnerships',
    'Generate outreach email for premium convenience stores',
    'Analyze success factors for campus dining deals',
    'Suggest partnership terms for corporate wellness programs'
  ];

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: chatMessage
    }]);
    
    // Show loading message
    setChatHistory(prev => [...prev, {
      type: 'assistant',
      message: 'Generating your partnership playbook... 🚀'
    }]);
    
    try {
      // Call the real backend API
      const response = await fetch('https://afhplatform-production.up.railway.app/api/playbooks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: 'general',
          target: chatMessage,
          region: 'Global'
        })
      });
      
      const data = await response.json();
      
      if (data.playbook) {
        const playbook = data.playbook;
        const responseMessage = `✅ **${playbook.title}**\n\n` +
          `📊 **Success Rate:** ${playbook.successRate}%\n` +
          `💰 **Revenue Potential:** ${playbook.averageRevenue}\n` +
          `⏱️ **Timeline:** ${playbook.timeToClose}\n\n` +
          `**Key Steps:**\n` +
          playbook.steps.slice(0, 3).map((step, i) => 
            `${i + 1}. ${step.title} (${step.duration})`
          ).join('\n') +
          `\n\n🎯 This playbook includes ${playbook.steps.length} detailed steps with actionable insights for ${playbook.targetAudience}.`;
        
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            type: 'assistant',
            message: responseMessage
          };
          return newHistory;
        });
      } else {
        throw new Error('No playbook generated');
      }
    } catch (error) {
      console.error('Error generating playbook:', error);
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          type: 'assistant',
          message: 'I apologize, but I\'m having trouble connecting to the playbook generation service right now. Please try again in a moment, or contact support if the issue persists.'
        };
        return newHistory;
      });
    }
    
    setChatMessage('');
  };

  const PlaybookCard = ({ playbook }) => (
    <Card sx={{ 
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0, 51, 102, 0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {playbook.title}
            </Typography>
            <Chip 
              label={playbook.category}
              size="small"
              sx={{ 
                bgcolor: `${pepsicoBrandColors.secondary.orange}20`,
                color: pepsicoBrandColors.secondary.orange,
                fontWeight: 500
              }}
            />
          </Box>
          <Avatar sx={{ 
            bgcolor: pepsicoBrandColors.primary.navy,
            width: 40,
            height: 40
          }}>
            <PlayArrow />
          </Avatar>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {playbook.description}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Steps</Typography>
            <Typography variant="h6" fontWeight={600}>{playbook.steps}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Duration</Typography>
            <Typography variant="body2" fontWeight={500}>{playbook.duration}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Success Rate</Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">
              {playbook.successRate}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Key Brands:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {playbook.brands.map((brand, index) => (
              <Chip 
                key={index}
                label={brand}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>
        
        {/* Show priority and revenue impact for real AFH playbooks */}
        {playbook.priority && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5, color: pepsicoBrandColors.primary.navy }}>
              Priority: {playbook.priority}
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ color: pepsicoBrandColors.secondary.green }}>
              Revenue Impact: {playbook.revenueImpact}
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrow />}
          sx={{ 
            background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
          }}
          onClick={() => {
            if (playbook.isGenerated && playbook.fullPlaybook) {
              handleViewPlaybook(playbook.fullPlaybook);
            }
          }}
        >
          {playbook.isGenerated ? 'View Full Playbook' : 'Launch Playbook'}
        </Button>
      </CardContent>
    </Card>
  );

  const CampaignCard = ({ campaign }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Active': return pepsicoBrandColors.secondary.green;
        case 'Planning': return pepsicoBrandColors.secondary.orange;
        case 'Completed': return pepsicoBrandColors.primary.blue;
        default: return pepsicoBrandColors.neutral.darkGray;
      }
    };

    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {campaign.name}
              </Typography>
              <Chip 
                label={campaign.status}
                size="small"
                sx={{ 
                  bgcolor: `${getStatusColor(campaign.status)}20`,
                  color: getStatusColor(campaign.status),
                  fontWeight: 500
                }}
              />
            </Box>
            <Typography variant="h6" fontWeight={600} color="primary">
              {campaign.responseRate}
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Prospects</Typography>
              <Typography variant="h6" fontWeight={600}>{campaign.prospects}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Responses</Typography>
              <Typography variant="h6" fontWeight={600}>{campaign.responses}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Meetings</Typography>
              <Typography variant="h6" fontWeight={600}>{campaign.meetings}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Deals</Typography>
              <Typography variant="h6" fontWeight={600} color="success.main">
                {campaign.deals}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {campaign.nextAction}
          </Typography>

          <LinearProgress 
            variant="determinate" 
            value={(campaign.responses / campaign.prospects) * 100} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: `${pepsicoBrandColors.primary.navy}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: pepsicoBrandColors.primary.navy,
                borderRadius: 3,
              }
            }}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: pepsicoBrandColors.primary.navy,
          mb: 1
        }}>
          Activate Partnerships
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered partnership activation with smart playbooks and automated outreach
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              color: `${pepsicoBrandColors.primary.navy} !important`,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: pepsicoBrandColors.primary.navy,
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="AI Assistant" />
          <Tab label="Partnership Playbooks" />
          <Tab label="Outreach Campaigns" />
        </Tabs>
      </Box>

      {/* AI Assistant Tab */}
      {selectedTab === 0 && (
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
                    sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}
                    onClick={() => setChatMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Partnership Playbooks Tab */}
      {selectedTab === 1 && (
        <Box>
          {/* Quick Generate Section */}
          <Card sx={{ mb: 3, bgcolor: `${pepsicoBrandColors.primary.navy}10` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                🚀 Generate New Partnership Playbook
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
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
                <Grid item xs={12} sm={4}>
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
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => generateNewPlaybook('foodservice', 'Local Restaurant Value Services', 'Global')}
                    disabled={isGeneratingPlaybook}
                    sx={{ 
                      borderColor: pepsicoBrandColors.primary.navy,
                      color: pepsicoBrandColors.primary.navy,
                      '&:hover': { bgcolor: `${pepsicoBrandColors.primary.navy}10` }
                    }}
                  >
                    🏪 Retail Partnership
                  </Button>
                </Grid>
              </Grid>
              {isGeneratingPlaybook && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress sx={{ 
                    bgcolor: `${pepsicoBrandColors.primary.navy}20`,
                    '& .MuiLinearProgress-bar': { bgcolor: pepsicoBrandColors.primary.navy }
                  }} />
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    Generating AI-powered partnership playbook...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Dynamic AI-Generated Playbooks */}
            {dynamicPlaybooks.map((playbook) => (
              <Grid item xs={12} md={6} lg={4} key={playbook.id}>
                <Box sx={{ position: 'relative' }}>
                  <Chip 
                    label="AI Generated" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 1,
                      bgcolor: pepsicoBrandColors.secondary.green,
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                  <PlaybookCard playbook={playbook} />
                </Box>
              </Grid>
            ))}
            
            {/* Static Template Playbooks */}
            {partnershipPlaybooks.map((playbook) => (
              <Grid item xs={12} md={6} lg={4} key={playbook.id}>
                <PlaybookCard playbook={playbook} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Outreach Campaigns Tab */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {outreachCampaigns.map((campaign) => (
            <Grid item xs={12} md={6} key={campaign.id}>
              <CampaignCard campaign={campaign} />
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Recent Partnership Activities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: pepsicoBrandColors.secondary.green }}>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Metro Convenience Chain - Deal Closed"
                      secondary="$1.2M annual partnership secured for Gatorade and Lay's placement"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: pepsicoBrandColors.secondary.orange }}>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="University of California - Meeting Scheduled"
                      secondary="Campus dining partnership discussion set for next Tuesday"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: pepsicoBrandColors.primary.blue }}>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Tech Corp Wellness - Proposal Sent"
                      secondary="Comprehensive wellness program proposal delivered to decision makers"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Playbook Detail Modal */}
      <Dialog
        open={showPlaybookModal}
        onClose={handleClosePlaybookModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: `${pepsicoBrandColors.primary.navy}10`,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {selectedPlaybook?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-Generated Partnership Strategy
            </Typography>
          </Box>
          <IconButton onClick={handleClosePlaybookModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {selectedPlaybook && (
            <Box>
              {/* Overview Section */}
              <Box sx={{ p: 3, bgcolor: `${pepsicoBrandColors.primary.navy}05` }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: pepsicoBrandColors.secondary.green,
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 1
                      }}>
                        <TrendingUpIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        {selectedPlaybook.successRate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: pepsicoBrandColors.secondary.orange,
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 1
                      }}>
                        <AttachMoney sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlaybook.averageRevenue}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Revenue Potential
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: pepsicoBrandColors.primary.blue,
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 1
                      }}>
                        <AccessTime sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlaybook.timeToClose}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Timeline
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: pepsicoBrandColors.primary.navy,
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 1
                      }}>
                        <Business sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedPlaybook.steps?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Strategic Steps
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Target Audience */}
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  🎯 Target Audience
                </Typography>
                <Typography variant="body1">
                  {selectedPlaybook.targetAudience}
                </Typography>
              </Box>
              
              {/* Key Brands */}
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  🏷️ Key Brands
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedPlaybook.keyBrands?.map((brand, index) => (
                    <Chip 
                      key={index}
                      label={brand}
                      sx={{ 
                        bgcolor: `${pepsicoBrandColors.primary.navy}10`,
                        color: pepsicoBrandColors.primary.navy,
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              {/* Strategic Steps */}
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  📋 Strategic Implementation Steps
                </Typography>
                
                {selectedPlaybook.steps?.map((step, index) => (
                  <Accordion 
                    key={index}
                    sx={{ 
                      mb: 2,
                      '&:before': { display: 'none' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        bgcolor: `${pepsicoBrandColors.primary.navy}05`,
                        '&:hover': {
                          bgcolor: `${pepsicoBrandColors.primary.navy}10`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Avatar sx={{ 
                          bgcolor: pepsicoBrandColors.primary.navy,
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem'
                        }}>
                          {step.stepNumber}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {step.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Duration: {step.duration}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Key Actions:
                      </Typography>
                      <List dense>
                        {step.keyActions?.map((action, actionIndex) => (
                          <ListItem key={actionIndex} sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`• ${action}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 2 }}>
                        Success Metrics:
                      </Typography>
                      <List dense>
                        {step.successMetrics?.map((metric, metricIndex) => (
                          <ListItem key={metricIndex} sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`✓ ${metric}`}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                color: 'success.main'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleClosePlaybookModal}
            variant="outlined"
            sx={{ 
              borderColor: pepsicoBrandColors.primary.navy,
              color: pepsicoBrandColors.primary.navy
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            sx={{ 
              background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
            }}
          >
            Export Playbook
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnershipEngine;
