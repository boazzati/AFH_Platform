import React, { useState, useEffect } from 'react';
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
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
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
  TrendingUp,
  Add,
  PersonAdd
} from '@mui/icons-material';
import { expertNetworkApi } from '../services/api';

const ExpertNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newExpert, setNewExpert] = useState({
    name: '',
    title: '',
    company: '',
    specialization: [],
    experience: 0,
    rating: 0,
    hourlyRate: 0,
    availability: 'Within 72h'
  });

  // Load experts from backend
  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    setLoading(true);
    try {
      const response = await expertNetworkApi.getExperts();
      setExperts(response.data);
    } catch (error) {
      console.error('Error loading experts:', error);
      setError('Failed to load experts. Using sample data.');
      setExperts(getSampleExperts());
    } finally {
      setLoading(false);
    }
  };

  const getSampleExperts = () => [
    {
      id: 1,
      name: 'Maria Rodriguez',
      title: 'Former QSR Operations Director',
      company: 'Ex-McDonalds, Burger King',
      specialization: ['QSR Operations', 'Menu Strategy', 'Beverage Programs'],
      rating: 4.9,
      hourlyRate: 450,
      availability: 'Within 24h',
      verified: true,
      experience: 15,
      previousProjects: ['McDonalds Beverage Program', 'Burger King Menu Refresh']
    },
    {
      id: 2,
      name: 'James Chen',
      title: 'Hospitality Industry Consultant',
      company: 'Hilton, Marriott Alumni',
      specialization: ['Hotel F&B', 'Premium Placement', 'Contract Negotiation'],
      rating: 4.7,
      hourlyRate: 380,
      availability: 'Within 48h',
      verified: true,
      experience: 12,
      previousProjects: ['Hilton Mini-bar Strategy', 'Marriott Premium Brands']
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      title: 'Consumer Behavior Researcher',
      company: 'Kantar, Nielsen Alumni',
      specialization: ['AFH Trends', 'Consumer Insights', 'Market Research'],
      rating: 4.8,
      hourlyRate: 520,
      availability: 'Within 72h',
      verified: true,
      experience: 18,
      previousProjects: ['Beverage Trend Analysis', 'Consumer Segmentation Study']
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

  const handleAddExpert = async () => {
    if (!newExpert.name || !newExpert.title || !newExpert.specialization.length) {
      setError('Please fill in name, title, and at least one specialization');
      return;
    }

    setLoading(true);
    try {
      const expertData = {
        name: newExpert.name,
        title: newExpert.title,
        company: newExpert.company,
        specialization: newExpert.specialization,
        experience: newExpert.experience,
        rating: newExpert.rating,
        hourlyRate: newExpert.hourlyRate,
        availability: newExpert.availability,
        previousProjects: []
      };

      const response = await expertNetworkApi.createExpert(expertData);
      
      setSuccess(`Expert "${newExpert.name}" added successfully!`);
      setOpenDialog(false);
      setNewExpert({
        name: '',
        title: '',
        company: '',
        specialization: [],
        experience: 0,
        rating: 0,
        hourlyRate: 0,
        availability: 'Within 72h'
      });
      
      // Reload experts
      await loadExperts();
    } catch (error) {
      console.error('Error adding expert:', error);
      setError('Failed to add expert');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultExpert = async (expert) => {
    try {
      // Simulate consultation request
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Consultation request sent to ${expert.name}! They will contact you within ${expert.availability.toLowerCase()}.`);
    } catch (error) {
      console.error('Error requesting consultation:', error);
      setError('Failed to request consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async (expert) => {
    try {
      // Simulate scheduling
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Meeting scheduled with ${expert.name}! Check your calendar for confirmation.`);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setError('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickConsultation = async (consultationType) => {
    try {
      // Find relevant expert for the consultation type
      const relevantExpert = experts.find(expert => 
        expert.specialization.some(spec => 
          spec.toLowerCase().includes(consultationType.toLowerCase())
        )
      ) || experts[0]; // Fallback to first expert

      setSuccess(`Quick consultation for "${consultationType}" requested! ${relevantExpert.name} will assist you.`);
    } catch (error) {
      console.error('Error starting quick consultation:', error);
      setError('Failed to start consultation');
    }
  };

  const handleSpecializationChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewExpert({
      ...newExpert,
      specialization: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialization.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    expert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Within 24h': return 'success';
      case 'Within 48h': return 'warning';
      case 'Within 72h': return 'info';
      default: return 'default';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Embedded Expert Network
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        On-demand AFH experts and peer consultations for rapid problem-solving
      </Typography>

      {/* Status Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

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
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  <Button 
                    variant="contained" 
                    startIcon={<PersonAdd />}
                    onClick={() => setOpenDialog(true)}
                    disabled={loading}
                  >
                    Add Expert
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredExperts.map((expert) => (
                    <Card key={expert.id || expert._id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                            {getInitials(expert.name)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6">
                                {expert.name}
                              </Typography>
                              {expert.verified && <Verified color="primary" fontSize="small" />}
                              <Chip label={`${expert.experience}+ years`} size="small" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {expert.title} • {expert.company}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                              {expert.specialization.map((skill, index) => (
                                <Chip key={index} label={skill} size="small" variant="outlined" />
                              ))}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Rating value={expert.rating} readOnly size="small" />
                              <Typography variant="body2">
                                ${expert.hourlyRate || expert.rate}/hour
                              </Typography>
                              <Chip 
                                label={expert.availability} 
                                size="small" 
                                color={getAvailabilityColor(expert.availability)}
                              />
                            </Box>

                            {expert.previousProjects && expert.previousProjects.length > 0 && (
                              <Typography variant="body2" color="text.secondary">
                                Previous: {expert.previousProjects.slice(0, 2).join(', ')}
                                {expert.previousProjects.length > 2 && `... (+${expert.previousProjects.length - 2} more)`}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<Message />}
                              onClick={() => handleConsultExpert(expert)}
                              disabled={loading}
                            >
                              Consult
                            </Button>
                            <Button 
                              variant="outlined" 
                              startIcon={<Schedule />}
                              onClick={() => handleScheduleMeeting(expert)}
                              disabled={loading}
                            >
                              Schedule
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
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
                {['Strategy Review', 'Competitive Intelligence', 'Contract Negotiation', 'Market Entry'].map((type) => (
                  <Button 
                    key={type}
                    variant="outlined" 
                    size="small"
                    onClick={() => handleQuickConsultation(type)}
                    disabled={loading}
                  >
                    {type}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Expert Stats Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Total Experts', value: experts.length },
                  { label: 'Average Rating', value: (experts.reduce((acc, expert) => acc + expert.rating, 0) / experts.length || 0).toFixed(1) },
                  { label: 'Response Time', value: '< 24h' },
                  { label: 'Success Rate', value: '94%' }
                ].map((stat, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{stat.label}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Expert Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Expert</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Full Name"
              value={newExpert.name}
              onChange={(e) => setNewExpert({ ...newExpert, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Title"
              value={newExpert.title}
              onChange={(e) => setNewExpert({ ...newExpert, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Company"
              value={newExpert.company}
              onChange={(e) => setNewExpert({ ...newExpert, company: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Specialization</InputLabel>
              <Select
                multiple
                value={newExpert.specialization}
                onChange={handleSpecializationChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {[
                  'QSR Operations', 'Menu Strategy', 'Beverage Programs', 'Hotel F&B',
                  'Premium Placement', 'Contract Negotiation', 'AFH Trends', 'Consumer Insights',
                  'Market Research', 'Supply Chain', 'Distribution', 'Marketing'
                ].map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Experience (years)"
                type="number"
                value={newExpert.experience}
                onChange={(e) => setNewExpert({ ...newExpert, experience: parseInt(e.target.value) || 0 })}
                fullWidth
              />
              <TextField
                label="Hourly Rate ($)"
                type="number"
                value={newExpert.hourlyRate}
                onChange={(e) => setNewExpert({ ...newExpert, hourlyRate: parseInt(e.target.value) || 0 })}
                fullWidth
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                value={newExpert.availability}
                label="Availability"
                onChange={(e) => setNewExpert({ ...newExpert, availability: e.target.value })}
              >
                <MenuItem value="Within 24h">Within 24h</MenuItem>
                <MenuItem value="Within 48h">Within 48h</MenuItem>
                <MenuItem value="Within 72h">Within 72h</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddExpert}
            variant="contained"
            disabled={!newExpert.name || !newExpert.title || !newExpert.specialization.length || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Expert'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default ExpertNetwork;
