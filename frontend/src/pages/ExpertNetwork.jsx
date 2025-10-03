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
  IconButton
} from '@mui/material';
import {
  Search,
  Business,
  Science,
  MedicalServices,
  Computer,
  TrendingUp,
  Message,
  Schedule,
  Verified
} from '@mui/icons-material';

const ExpertNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const experts = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Biotech Research Director',
      company: 'Genomics Inc',
      expertise: ['Biotechnology', 'Pharmaceuticals', 'Clinical Trials'],
      rating: 4.9,
      rate: 450,
      availability: 'Within 24h',
      verified: true,
      avatar: '/static/images/avatar/1.jpg'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'FinTech Strategist',
      company: 'Quantum Capital',
      expertise: ['Blockchain', 'Digital Assets', 'Payment Systems'],
      rating: 4.7,
      rate: 380,
      availability: 'Within 48h',
      verified: true,
      avatar: '/static/images/avatar/2.jpg'
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      title: 'AI Research Scientist',
      company: 'Neural Dynamics Lab',
      expertise: ['Machine Learning', 'Computer Vision', 'Neural Networks'],
      rating: 4.8,
      rate: 520,
      availability: 'Within 72h',
      verified: true,
      avatar: '/static/images/avatar/3.jpg'
    },
    {
      id: 4,
      name: 'James Kim',
      title: 'Renewable Energy Consultant',
      company: 'Green Energy Solutions',
      expertise: ['Solar Technology', 'Energy Storage', 'Grid Management'],
      rating: 4.6,
      rate: 320,
      availability: 'Within 24h',
      verified: false,
      avatar: '/static/images/avatar/4.jpg'
    }
  ];

  const industries = [
    { name: 'Technology', icon: <Computer />, count: 24 },
    { name: 'Healthcare', icon: <MedicalServices />, count: 18 },
    { name: 'Finance', icon: <TrendingUp />, count: 15 },
    { name: 'Biotech', icon: <Science />, count: 12 },
    { name: 'Industrial', icon: <Business />, count: 8 }
  ];

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Expert Network
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Connect with industry experts for specialized insights
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab label="All Experts" />
                  <Tab label="Available Now" />
                  <Tab label="Top Rated" />
                </Tabs>
                <TextField
                  placeholder="Search experts or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                {filteredExperts.map((expert) => (
                  <Grid item xs={12} key={expert.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={expert.avatar} sx={{ width: 60, height: 60 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6">
                                {expert.name}
                              </Typography>
                              {expert.verified && <Verified color="primary" fontSize="small" />}
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {expert.title} • {expert.company}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                              {expert.expertise.map((skill, index) => (
                                <Chip key={index} label={skill} size="small" variant="outlined" />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button variant="contained" startIcon={<Message />}>
                              Contact
                            </Button>
                            <Button variant="outlined" startIcon={<Schedule />}>
                              Schedule
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Industries
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {industries.map((industry, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {industry.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{industry.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {industry.count} experts
                        </Typography>
                      </Box>
                      <Badge badgeContent={industry.count} color="primary" />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Consultations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { topic: 'AI Market Trends', expert: 'Dr. Emily Watson', date: '2 days ago', status: 'Completed' },
                  { topic: 'Blockchain Regulation', expert: 'Michael Rodriguez', date: '1 week ago', status: 'Scheduled' },
                  { topic: 'Drug Discovery Process', expert: 'Dr. Sarah Chen', date: '2 weeks ago', status: 'Completed' }
                ].map((consultation, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {consultation.topic}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        with {consultation.expert}
                      </Typography>
                    </Box>
                    <Chip 
                      label={consultation.status} 
                      size="small" 
                      color={consultation.status === 'Completed' ? 'success' : 'primary'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpertNetwork;
