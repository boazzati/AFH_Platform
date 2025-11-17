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
      title: 'Welcome to Partnership Accelerator',
      content: 'Your AI-powered solution for PepsiCo AFH partnership growth',
      description: 'This platform combines AI-generated playbooks, intelligent partnership recommendations, and performance tracking to accelerate your Away-From-Home success.',
      features: [
        'AI-powered partnership playbook generation',
        'Smart partnership recommendations and outreach',
        'Real-time performance tracking and analytics',
        'Growth opportunity discovery across channels'
      ],
      icon: <Business color="primary" />
    },
    {
      title: 'Partnership Playbooks',
      content: 'Generate AI-powered strategic partnership playbooks',
      description: 'Create comprehensive 8-step partnership strategies for gaming, concerts, theme parks, and retail channels.',
      features: [
        'AI-generated playbooks for 4 key channels',
        '8 comprehensive strategic implementation steps',
        'Success rates and revenue projections',
        'PDF and PowerPoint export capabilities'
      ],
      icon: <Map color="primary" />,
      page: '/partnership-engine'
    },
    {
      title: 'AI Assistant',
      content: 'Your intelligent partnership strategist',
      description: 'Get expert guidance on partnership strategies, playbook optimization, and market opportunities.',
      features: [
        'Context-aware partnership recommendations',
        'Gaming, concert, theme park, and retail expertise',
        'Real-time strategy guidance',
        'PepsiCo brand portfolio optimization'
      ],
      icon: <SmartToy color="primary" />,
      page: '/partnership-engine'
    },
    {
      title: 'Growth Opportunities',
      content: 'Discover new AFH market opportunities',
      description: 'Explore partnership opportunities across cinema, concerts, fashion, theme parks, petrol retail, and gaming.',
      features: [
        '6 key opportunity categories',
        'Revenue potential and confidence ratings',
        'Market insights and key brands',
        'Actionable exploration tools'
      ],
      icon: <TrendingUp color="primary" />,
      page: '/growth-opportunities'
    },
    {
      title: 'Success Tracking',
      content: 'Monitor partnership performance and impact',
      description: 'Track partnership success metrics, analyze channel performance, and measure your AFH portfolio growth.',
      features: [
        'Real-time partnership metrics',
        'Channel performance analytics',
        'Portfolio growth tracking',
        'Success rate monitoring'
      ],
      icon: <Analytics color="primary" />,
      page: '/success-tracking'
    }
  ];

  const quickTips = {
    '/partnership-engine': [
      'Generate AI-powered playbooks for gaming, concerts, theme parks, and retail',
      'Use the AI Assistant for strategic partnership guidance',
      'Export playbooks to PDF or PowerPoint for presentations',
      'View full playbooks to see all 8 strategic implementation steps'
    ],
    '/growth-opportunities': [
      'Explore 6 key opportunity categories for AFH partnerships',
      'Click "Explore Opportunities" to dive deeper into each category',
      'Review revenue potential and confidence ratings for prioritization',
      'Use market insights to identify the best partnership targets'
    ],
    '/success-tracking': [
      'Monitor real-time partnership performance metrics',
      'Analyze channel performance with interactive charts',
      'Track portfolio growth and success rates',
      'Use insights to optimize future partnership strategies'
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
                  primary="Partnership Playbooks" 
                  secondary="Generate AI-powered strategic partnership playbooks"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="AI Assistant" 
                  secondary="Get intelligent partnership strategy guidance"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Growth Opportunities" 
                  secondary="Discover new AFH market opportunities across channels"
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
