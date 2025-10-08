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
  PersonAdd,
  Email,
  Phone
} from '@mui/icons-material';
import { expertNetworkAPI } from '../services/api';

const ExpertNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    urgency: 'medium',
    contactMethod: 'email'
  });
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    duration: '30',
    topic: ''
  });
  const [newExpert, setNewExpert] = useState({
    name: '',
    title: '',
    company: '',
    specialization: [],
    experience: 0,
    rating: 0,
    hourlyRate: 0,
    availability: 'Within 72h',
    email: '',
    phone: ''
  });

  // Load experts from backend
  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    setLoading(true);
    try {
      const response = await expertNetworkAPI.getExperts();
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
      previousProjects: ['McDonalds Beverage Program', 'Burger King Menu Refresh'],
      email: 'maria.rodriguez@example.com',
      phone: '+1 (555) 123-4567'
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
      previousProjects: ['Hilton Mini-bar Strategy', 'Marriott Premium Brands'],
      email: 'james.chen@example.com',
      phone: '+1 (555) 234-5678'
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
        previousProjects: [],
        email: newExpert.email,
        phone: newExpert.phone
      };

      const response = await expertNetworkAPI.createExpert(expertData);
      
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
        availability: 'Within 72h',
        email: '',
        phone: ''
      });
      
      await loadExperts();
    } catch (error) {
      console.error('Error adding expert:', error);
      setError('Failed to add expert');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultExpert = (expert) => {
    setSelectedExpert(expert);
    setContactForm({
      subject: `Consultation Request: ${expert.specialization[0]}`,
      message: `Hello ${expert.name},\n\nI would like to schedule a consultation regarding ${expert.specialization[0]}.\n\nCould you please let me know your availability and rates?\n\nBest regards,\n[Your Name]`,
      urgency: 'medium',
      contactMethod: 'email'
    });
    setContactDialogOpen(true);
  };

  const handleScheduleMeeting = (expert) => {
    setSelectedExpert(expert);
    setScheduleForm({
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: '30',
      topic: `Discussion about ${expert.specialization[0]}`
    });
    setScheduleDialogOpen(true);
  };

  const handleSendConsultation = async () => {
    try {
      setLoading(true);
      
      // Simulate sending consultation request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const contactInfo = contactForm.contactMethod === 'email' 
        ? `Email: ${selectedExpert.email}`
        : `Phone: ${selectedExpert.phone}`;
      
      setSuccess(
        `Consultation request sent to ${selectedExpert.name}! ` +
        `They will respond within ${selectedExpert.availability.toLowerCase()}. ` +
        `Contact: ${contactInfo}`
      );
      setContactDialogOpen(false);
      
    } catch (error) {
      console.error('Error sending consultation:', error);
      setError('Failed to send consultation request');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleConsultation = async () => {
    try {
      setLoading(true);
      
      // Simulate scheduling
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(
        `Meeting scheduled with ${selectedExpert.name}! ` +
        `Date: ${scheduleForm.date} at ${scheduleForm.time} for ${scheduleForm.duration} minutes. ` +
        `Topic: ${scheduleForm.topic}`
      );
      setScheduleDialogOpen(false);
      
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setError('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickConsultation = async (consultationType) => {
    try {
      const relevantExpert = experts.find(expert => 
        expert.specialization.some(spec => 
          spec.toLowerCase().includes(consultationType.toLowerCase())
        )
      ) || experts[0];

      setContactDialogOpen(true);
      setSelectedExpert(relevantExpert);
      setContactForm({
        subject: `Quick Consultation: ${consultationType}`,
        message: `Hello ${relevantExpert.name},\n\nI would like a quick consultation about ${consultationType}.\n\nPlease let me know your availability.\n\nBest regards,\n[Your Name]`,
        urgency: 'medium',
        contactMethod: 'email'
      });
      
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

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              {expert.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email fontSize="small" color="action" />
                                  <Typography variant="caption">{expert.email}</Typography>
                                </Box>
                              )}
                              {expert.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Phone fontSize="small" color="action" />
                                  <Typography variant="caption">{expert.phone}</Typography>
                                </Box>
                              )}
                            </Box>

                            {expert.previousProjects && expert.previousProjects.length > 0 && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
            <TextField
              label="Email"
              type="email"
              value={newExpert.email}
              onChange={(e) => setNewExpert({ ...newExpert, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone"
              value={newExpert.phone}
              onChange={(e) => setNewExpert({ ...newExpert, phone: e.target.value })}
              fullWidth
            />
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

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Contact {selectedExpert?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Consultation Rate: ${selectedExpert?.hourlyRate}/hour • {selectedExpert?.availability}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Contact Method</InputLabel>
              <Select
                value={contactForm.contactMethod}
                label="Contact Method"
                onChange={(e) => setContactForm({...contactForm, contactMethod: e.target.value})}
              >
                <MenuItem value="email">Email: {selectedExpert?.email}</MenuItem>
                <MenuItem value="phone">Phone: {selectedExpert?.phone}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              fullWidth
            />
            <TextField
              label="Message"
              multiline
              rows={6}
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={contactForm.urgency}
                label="Urgency"
                onChange={(e) => setContactForm({...contactForm, urgency: e.target.value})}
              >
                <MenuItem value="low">Low - Within 1 week</MenuItem>
                <MenuItem value="medium">Medium - Within 3 days</MenuItem>
                <MenuItem value="high">High - Within 24 hours</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendConsultation}
            disabled={!contactForm.subject || !contactForm.message || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Schedule Meeting with {selectedExpert?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rate: ${selectedExpert?.hourlyRate}/hour • Estimated cost: ${(selectedExpert?.hourlyRate * (parseInt(scheduleForm.duration) / 60)).toFixed(2)}
            </Typography>
            <TextField
              label="Meeting Date"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Meeting Time"
              type="time"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                value={scheduleForm.duration}
                label="Duration"
                onChange={(e) => setScheduleForm({...scheduleForm, duration: e.target.value})}
              >
                <MenuItem value="30">30 minutes</MenuItem>
                <MenuItem value="60">60 minutes</MenuItem>
                <MenuItem value="90">90 minutes</MenuItem>
                <MenuItem value="120">120 minutes</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Meeting Topic"
              value={scheduleForm.topic}
              onChange={(e) => setScheduleForm({...scheduleForm, topic: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleScheduleConsultation}
            disabled={!scheduleForm.date || !scheduleForm.topic || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Schedule Meeting'}
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
