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
  Map,
  PlayArrow,
  TrackChanges,
  IntegrationInstructions,
  Groups,
  SmartToy,
  Analytics,
  TrendingUp,
  Email,
  AutoAwesome
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  { text: 'AFH Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Market Mapping', icon: <Map />, path: '/market-mapping' },
  { text: 'Playbook Generator', icon: <PlayArrow />, path: '/playbook-generator' },
  { text: 'Execution Engine', icon: <TrackChanges />, path: '/execution-engine' },
  { text: 'Data Integration', icon: <IntegrationInstructions />, path: '/data-integration' },
  { text: 'Expert Network', icon: <Groups />, path: '/expert-network' },
  { text: 'Agentic AI', icon: <SmartToy />, path: '/agentic-ai' },
  { text: 'Predictive Analytics', icon: <TrendingUp />, path: '/predictive-analytics' },
  { text: 'Outreach Automation', icon: <Email />, path: '/outreach-automation' },
  { text: 'Intelligent Matching', icon: <AutoAwesome />, path: '/intelligent-matching' },
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
          backgroundColor: '#f5f5f5'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          AFH Accelerator
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white'
                }
              }
            }}
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
