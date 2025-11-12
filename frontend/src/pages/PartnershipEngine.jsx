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
  Paper
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
  Person
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

  // PepsiCo Partnership Playbooks
  const partnershipPlaybooks = [
    {
      id: 1,
      title: 'C-Store Premium Placement',
      category: 'Convenience',
      description: 'Strategic playbook for securing premium shelf space in high-traffic convenience stores',
      steps: 8,
      duration: '2-4 weeks',
      successRate: '87%',
      brands: ['Gatorade', 'Lay\'s', 'Pepsi'],
      keyTactics: [
        'Consumer traffic analysis presentation',
        'Category growth data showcase',
        'Exclusive promotion proposals',
        'Digital integration opportunities'
      ]
    },
    {
      id: 2,
      title: 'Campus Dining Innovation',
      category: 'Education',
      description: 'Comprehensive approach to university dining partnerships with health-focused positioning',
      steps: 6,
      duration: '6-8 weeks',
      successRate: '92%',
      brands: ['Quaker', 'Bare', 'Tropicana'],
      keyTactics: [
        'Student preference surveys',
        'Sustainability impact metrics',
        'Nutrition education programs',
        'Social media activation plans'
      ]
    },
    {
      id: 3,
      title: 'Corporate Wellness Integration',
      category: 'Workplace',
      description: 'Employee wellness program integration with healthier snack and beverage options',
      steps: 5,
      duration: '3-5 weeks',
      successRate: '89%',
      brands: ['Gatorade Zero', 'PopCorners', 'Aquafina'],
      keyTactics: [
        'Wellness ROI calculations',
        'Employee satisfaction surveys',
        'Productivity correlation studies',
        'Flexible vending solutions'
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

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: chatMessage
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        message: 'I\'ll help you with that! Based on PepsiCo\'s AFH strategy and current market trends, here are my recommendations...'
      }]);
    }, 1000);
    
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

        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrow />}
          sx={{ 
            background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
          }}
        >
          Launch Playbook
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
        <Grid container spacing={3}>
          {partnershipPlaybooks.map((playbook) => (
            <Grid item xs={12} md={6} lg={4} key={playbook.id}>
              <PlaybookCard playbook={playbook} />
            </Grid>
          ))}
        </Grid>
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
    </Box>
  );
};

export default PartnershipEngine;
