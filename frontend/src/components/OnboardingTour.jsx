import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Fab,
  Tooltip,
  Backdrop,
  Paper,
  IconButton
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  Close,
  Help,
  Lightbulb,
  TrendingUp,
  SmartToy,
  Assessment,
  People,
  Business,
  Map,
  Analytics
} from '@mui/icons-material';

const OnboardingTour = ({ open, onClose, currentPage }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const tourSteps = [
    {
      title: 'Welcome to AFH Platform',
      content: 'Your AI-powered solution for accelerating Away-From-Home channel growth',
      description: 'This platform combines market intelligence, AI assistance, and expert networks to help CPG companies succeed in the AFH channel.',
      features: [
        'Real-time market mapping and opportunity identification',
        'AI-powered outreach and proposal generation',
        'Expert network for specialized knowledge',
        'Performance tracking and analytics'
      ],
      icon: <Business color="primary" />
    },
    {
      title: 'Market Mapping Engine',
      content: 'Discover and track AFH opportunities across all channels',
      description: 'Our market mapping engine continuously monitors restaurant openings, menu partnerships, and channel opportunities.',
      features: [
        'Real-time opportunity flagging',
        'Multi-channel coverage (QSR, Workplace, Leisure, Education, Healthcare)',
        'Priority scoring and confidence ratings',
        'Advanced filtering and search capabilities'
      ],
      icon: <Map color="primary" />,
      page: '/market-mapping'
    },
    {
      title: 'Agentic AI Assistant',
      content: 'Your intelligent partner for sales and account management',
      description: 'Multiple AI agents specialized in different aspects of AFH channel development.',
      features: [
        'Market Analyst: Trend analysis and opportunity identification',
        'Outreach Generator: Email and proposal creation',
        'Competitive Intelligence: Market positioning analysis',
        'Strategy Advisor: Channel expansion guidance'
      ],
      icon: <SmartToy color="primary" />,
      page: '/agentic-ai'
    },
    {
      title: 'Analytics Dashboard',
      content: 'Comprehensive insights into your AFH performance',
      description: 'Track key metrics, visualize trends, and monitor the health of your AFH initiatives.',
      features: [
        'Interactive charts and visualizations',
        'Real-time performance metrics',
        'Channel distribution analysis',
        'Project progress tracking'
      ],
      icon: <Analytics color="primary" />,
      page: '/dashboard'
    },
    {
      title: 'Expert Network',
      content: 'Access on-demand AFH expertise and peer consultations',
      description: 'Connect with industry experts and peers for specialized knowledge and strategic guidance.',
      features: [
        'Curated expert database',
        'Skill-based matching',
        'Consultation scheduling',
        'Knowledge sharing platform'
      ],
      icon: <People color="primary" />,
      page: '/expert-network'
    }
  ];

  const quickTips = {
    '/dashboard': [
      'Use the Analytics tab to view detailed performance metrics',
      'Click on any module card to navigate directly to that feature',
      'The health status shows real-time system connectivity'
    ],
    '/market-mapping': [
      'Use advanced filters to narrow down opportunities by channel, priority, or confidence',
      'Export data to CSV for external analysis',
      'Click on channel buttons for quick filtering'
    ],
    '/agentic-ai': [
      'Switch between different AI agents for specialized assistance',
      'Use quick prompts to get started with common tasks',
      'The AI has access to your platform data for contextual responses'
    ],
    '/expert-network': [
      'Filter experts by skills and experience level',
      'Use the consultation scheduler for expert meetings',
      'Rate and review experts after consultations'
    ],
    '/playbook-generator': [
      'Generate custom playbooks for different channels',
      'Use AI assistance for content creation',
      'Share playbooks with your team'
    ]
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    localStorage.setItem('afhPlatformOnboardingCompleted', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('afhPlatformOnboardingSkipped', 'true');
    onClose();
  };

  const HelpFab = () => (
    <Fab
      color="primary"
      size="medium"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000
      }}
      onClick={() => setShowHelp(true)}
    >
      <Help />
    </Fab>
  );

  const HelpDialog = () => (
    <Dialog
      open={showHelp}
      onClose={() => setShowHelp(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Lightbulb sx={{ mr: 1 }} />
            Quick Tips for {currentPage}
          </Box>
          <IconButton onClick={() => setShowHelp(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {quickTips[currentPage] ? (
          <List>
            {quickTips[currentPage].map((tip, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">
            No specific tips available for this page. Use the main navigation to explore different features.
          </Alert>
        )}
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Need More Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Here are some additional resources:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Platform Overview" 
                  secondary="Visit the Dashboard for a complete overview of all features"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="AI Assistant" 
                  secondary="Ask the AI assistant for help with specific tasks"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Expert Network" 
                  secondary="Connect with AFH experts for personalized guidance"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowHelp(false)}>Close</Button>
        <Button variant="contained" onClick={() => {
          setShowHelp(false);
          // Could trigger onboarding tour restart
        }}>
          Restart Tour
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (!open) {
    return (
      <>
        <HelpFab />
        <HelpDialog />
      </>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleSkip}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">
              Platform Onboarding
            </Typography>
            <Chip 
              label={`${activeStep + 1} of ${tourSteps.length}`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {tourSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {step.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {step.title}
                    </Typography>
                  </Box>
                </StepLabel>
                <StepContent>
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {step.content}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {step.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Key Features:
                      </Typography>
                      <List dense>
                        {step.features.map((feature, featureIndex) => (
                          <ListItem key={featureIndex}>
                            <ListItemIcon>
                              <CheckCircle color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>

                      {step.page && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            💡 You can explore this feature at: <strong>{step.page}</strong>
                          </Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleSkip} color="inherit">
            Skip Tour
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          {activeStep === tourSteps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleFinish}
              endIcon={<CheckCircle />}
            >
              Get Started
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <HelpFab />
      <HelpDialog />
    </>
  );
};

export default OnboardingTour;
