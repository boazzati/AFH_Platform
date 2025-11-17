import React, { useState } from 'react';
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
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  Insights,
  Handshake,
  EmojiEvents,
  Menu,
  Close
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { pepsicoBrandColors } from '../theme/pepsico-theme';

const drawerWidth = 300;

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
        Partnership Accelerator
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: pepsicoBrandColors.neutral.darkGray,
          fontSize: '0.75rem',
          fontStyle: 'italic'
        }}
      >
        Accelerating partnerships across every consumer experience
      </Typography>
    </Box>
  </Box>
);

const PepsiCoNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawerContent = (
    <Box>
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
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
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
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: pepsicoBrandColors.primary.navy,
            color: 'white',
            '&:hover': {
              bgcolor: pepsicoBrandColors.primary.blue,
            },
          }}
        >
          <Menu />
        </IconButton>
      )}
      
      {/* Desktop Drawer */}
      {!isMobile && (
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
          {drawerContent}
        </Drawer>
      )}
      
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: pepsicoBrandColors.neutral.white,
              borderRight: `1px solid ${pepsicoBrandColors.neutral.mediumGray}`,
              boxShadow: '4px 0 16px rgba(0, 51, 102, 0.05)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default PepsiCoNavigation;
