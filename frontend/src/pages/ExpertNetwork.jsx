import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search,
  Restaurant,
  LocalCafe,
  Business,
  School,
  LocalHospital,
  Message,
  Schedule,
  Verified,
  TrendingUp
} from '@mui/icons-material';
import { expertNetworkApi } from '../services/api';
const ExpertNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const experts = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      title: 'Former QSR Operations Director',
      company: 'Ex-McDonalds, Burger King',
      expertise: ['QSR Operations', 'Menu Strategy', 'Beverage Programs'],
      rating: 4.9,
      rate: 450,
      availability: 'Within 24h',
      verified: true,
      experience: '15+ years',
      specialties: ['Beverage Partnerships', 'Menu Engineering', 'Operator Relations']
    },
    {
      id: 2,
      name: 'James Chen',
      title: 'Hospitality Industry Consultant',
      company: 'Hilton, Marriott Alumni',
      expertise: ['Hotel F&B', 'Premium Placement', 'Contract Negotiation'],
      rating: 4.7,
      rate: 380,
      availability: 'Within 48h',
      verified: true,
      experience: '12+ years',
      specialties: ['Mini-bar Strategy', 'Premium Brands', 'Revenue Management']
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      title: 'Consumer Behavior Researcher',
      company: 'Kantar, Nielsen Alumni',
      expertise: ['AFH Trends', 'Consumer Insights', 'Market Research'],
      rating: 4.8,
      rate: 520,
      availability: 'Within 72h',
      verified: true,
      experience: '18+ years',
      specialties: ['Trend Analysis', 'Consumer Segmentation', 'Purchase Drivers']
    }
  ];

  const channels = [
    { name: 'QSR Experts', icon: <Restaurant />, count: 24, description: 'Quick service restaurant specialists' },
    { name: 'Hospitality', icon: <LocalCafe />, count: 18, description: 'Hotel and leisure channel experts' },
    { name: 'Workplace', icon: <Business />, count: 15, description: 'Corporate and B&I specialists' },
    { name: 'Education', icon: <School />, count: 12, description: 'Campus and education channel' },
    { name: 'Healthcare', icon: <LocalHospital />, count: 8, description: 'Healthcare facility experts' }
  ];

  const recentConsultations = [
    { topic: 'QSR Beverage Strategy', expert: 'Maria Rodriguez', date: '2 days ago', status: 'Completed', outcome: 'Strategy implemented' },
    { topic: 'Hotel Mini-bar Optimization', expert: 'James Chen', date: '1 week ago', status: 'Scheduled', outcome: 'Meeting scheduled' },
    { topic: 'Consumer Trend Analysis', expert: 'Dr. Sarah Johnson', date: '2 weeks ago', status: 'Completed', outcome: 'Insights applied' }
  ];

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Embedded Expert Network
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        On-demand AFH experts and peer consultations for rapid problem-solving
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab label="All Experts" />
                  <Tab label="Available Now" />
                  <Tab label="QSR Specialists" />
                  <Tab label="Strategic Consultants" />
                </Tabs>
                <TextField
                  placeholder="Search experts or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ minWidth: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredExperts.map((expert) => (
                  <Card key={expert.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                          {expert.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6">
                              {expert.name}
                            </Typography>
                            {expert.verified && <Verified color="primary" fontSize="small" />}
                            <Chip label={expert.experience} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {expert.title} • {expert.company}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                            {expert.expertise.map((skill, index) => (
                              <Chip key={index} label={skill} size="small" variant="outlined" />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Rating value={expert.rating} readOnly size="small" />
                            <Typography variant="body2">
                              ${expert.rate}/hour
                            </Typography>
                            <Chip 
                              label={expert.availability} 
                              size="small" 
                              color={expert.availability === 'Within 24h' ? 'success' : 'warning'}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            Specialties: {expert.specialties.join(', ')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                          <Button variant="contained" startIcon={<Message />}>
                            Consult
                          </Button>
                          <Button variant="outlined" startIcon={<Schedule />}>
                            Schedule
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AFH Channel Experts
              </Typography>
              <List>
                {channels.map((channel, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {channel.icon}
                          {channel.name}
                        </Box>
                      }
                      secondary={channel.description}
                    />
                    <ListItemSecondaryAction>
                      <Badge badgeContent={channel.count} color="primary" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Consultations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentConsultations.map((consultation, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {consultation.topic}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        with {consultation.expert}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {consultation.date}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={consultation.status} 
                        size="small" 
                        color={consultation.status === 'Completed' ? 'success' : 'primary'}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {consultation.outcome}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Consultation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Need immediate help? Start a micro-consultation.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" size="small">
                  Strategy Review
                </Button>
                <Button variant="outlined" size="small">
                  Competitive Intelligence
                </Button>
                <Button variant="outlined" size="small">
                  Contract Negotiation
                </Button>
                <Button variant="outlined" size="small">
                  Market Entry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpertNetwork;
