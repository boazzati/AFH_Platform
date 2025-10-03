import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  PlayArrow,
  TrendingUp,
  IntegrationInstructions,
  Groups,
  SmartToy,
  Analytics
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Market Mapping', icon: <Assessment />, path: '/market-mapping' },
  { text: 'Playbook Generator', icon: <PlayArrow />, path: '/playbook-generator' },
  { text: 'Execution Engine', icon: <TrendingUp />, path: '/execution-engine' },
  { text: 'Data Integration', icon: <IntegrationInstructions />, path: '/data-integration' },
  { text: 'Expert Network', icon: <Groups />, path: '/expert-network' },
  { text: 'Agentic AI', icon: <SmartToy />, path: '/agentic-ai' },
  { text: 'Benchmarking', icon: <Analytics />, path: '/benchmarking' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          AI Finance Platform
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation;
