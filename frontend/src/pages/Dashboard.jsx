import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  PlayArrow,
  IntegrationInstructions,
  Groups,
  SmartToy,
  Analytics
} from '@mui/icons-material';

const Dashboard = () => {
  const modules = [
    {
      title: 'Market Mapping',
      description: 'Analyze market trends and company performance',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      path: '/market-mapping',
      color: '#1976d2'
    },
    {
      title: 'Playbook Generator',
      description: 'Create investment strategies and playbooks',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      path: '/playbook-generator',
      color: '#2e7d32'
    },
    {
      title: 'Execution Engine',
      description: 'Automated trade execution and monitoring',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      path: '/execution-engine',
      color: '#ed6c02'
    },
    {
      title: 'Data Integration',
      description: 'Connect and analyze multiple data sources',
      icon: <IntegrationInstructions sx={{ fontSize: 40 }} />,
      path: '/data-integration',
      color: '#9c27b0'
    },
    {
      title: 'Expert Network',
      description: 'Access industry experts and insights',
      icon: <Groups sx={{ fontSize: 40 }} />,
      path: '/expert-network',
      color: '#d32f2f'
    },
    {
      title: 'Agentic AI',
      description: 'AI-powered analysis and recommendations',
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      path: '/agentic-ai',
      color: '#0288d1'
    },
    {
      title: 'Benchmarking',
      description: 'Compare performance against benchmarks',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      path: '/benchmarking',
      color: '#7b1fa2'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Financial Platform Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Comprehensive tools for investment analysis and execution
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: module.color, mb: 2 }}>
                  {module.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: module.color,
                    color: module.color,
                    '&:hover': {
                      backgroundColor: module.color,
                      color: 'white'
                    }
                  }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
