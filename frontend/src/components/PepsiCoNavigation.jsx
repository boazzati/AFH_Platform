import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  Insights,
  Handshake,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { pepsicoBrandColors } from '../theme/pepsico-theme';

const drawerWidth = 280;

// Simplified 3-section navigation for PepsiCo demo
const menuItems = [
  { 
    text: 'Growth Command Center', 
    icon: <TrendingUp />, 
    path: '/',
    description: 'Real-time AFH performance dashboard'
  },
  { 
    text: 'Discover Growth', 
    icon: <Insights />, 
    path: '/growth-opportunities',
    description: 'Find new AFH market opportunities'
  },
  { 
    text: 'Activate Partnerships', 
    icon: <Handshake />, 
    path: '/partnership-engine',
    description: 'AI-powered partnership recommendations'
  },
  { 
    text: 'Deliver Smiles', 
    icon: <EmojiEvents />, 
    path: '/success-tracking',
    description: 'Track impact and success metrics'
  },
];

// PepsiCo logo component (simplified P with smile)
const PepsiCoLogo = () => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2,
    mb: 2
  }}>
    <Avatar sx={{ 
      bgcolor: pepsicoBrandColors.primary.navy,
      width: 40,
      height: 40,
      fontSize: '1.5rem',
      fontWeight: 'bold'
    }}>
      p
    </Avatar>
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700,
          color: pepsicoBrandColors.primary.navy,
          fontSize: '1.25rem',
          lineHeight: 1.2
        }}
      >
        AFH Growth Platform
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: pepsicoBrandColors.neutral.darkGray,
          fontSize: '0.75rem',
          fontStyle: 'italic'
        }}
      >
        Food. Drinks. Smiles.
      </Typography>
    </Box>
  </Box>
);

const PepsiCoNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map old paths to new simplified paths
  const pathMapping = {
    '/': '/',
    '/market-mapping': '/growth-opportunities',
    '/predictive-analytics': '/growth-opportunities',
    '/intelligent-matching': '/growth-opportunities',
    '/playbook-generator': '/partnership-engine',
    '/execution-engine': '/partnership-engine',
    '/outreach-automation': '/partnership-engine',
    '/agentic-ai': '/partnership-engine',
    '/expert-network': '/success-tracking',
    '/benchmarking': '/success-tracking',
    '/data-integration': '/success-tracking',
  };

  const getCurrentPath = () => {
    return pathMapping[location.pathname] || location.pathname;
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: pepsicoBrandColors.neutral.white,
          borderRight: `1px solid ${pepsicoBrandColors.neutral.mediumGray}`,
          boxShadow: '4px 0 16px rgba(0, 51, 102, 0.05)',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 3 }}>
        <PepsiCoLogo />
      </Toolbar>
      
      <Divider sx={{ mx: 2, mb: 2 }} />
      
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isSelected = getCurrentPath() === item.path;
          
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: 3,
                mb: 1,
                mx: 1,
                py: 2,
                transition: 'all 0.3s ease-in-out',
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
                  color: pepsicoBrandColors.neutral.white,
                  boxShadow: '0 4px 16px rgba(0, 51, 102, 0.2)',
                  '& .MuiListItemIcon-root': {
                    color: pepsicoBrandColors.neutral.white,
                  },
                  '&:hover': {
                    background: `linear-gradient(135deg, ${pepsicoBrandColors.primary.navy} 0%, ${pepsicoBrandColors.primary.blue} 100%)`,
                    transform: 'translateX(4px)',
                  },
                },
                '&:hover': {
                  backgroundColor: `${pepsicoBrandColors.primary.navy}08`,
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <Box>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '1rem',
                    lineHeight: 1.2,
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isSelected ? 'rgba(255,255,255,0.8)' : pepsicoBrandColors.neutral.darkGray,
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                    mt: 0.5,
                    display: 'block'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* PepsiCo Brand Footer */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ 
          textAlign: 'center',
          p: 2,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${pepsicoBrandColors.neutral.lightGray} 0%, ${pepsicoBrandColors.neutral.mediumGray} 100%)`,
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: pepsicoBrandColors.neutral.darkGray,
              fontWeight: 500,
              display: 'block',
              mb: 0.5
            }}
          >
            Powered by PepsiCo Innovation
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: pepsicoBrandColors.primary.navy,
              fontSize: '0.7rem',
              fontStyle: 'italic'
            }}
          >
            "Creating more smiles with every sip and every bite"
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PepsiCoNavigation;
