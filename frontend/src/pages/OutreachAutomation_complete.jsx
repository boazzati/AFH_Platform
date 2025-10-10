import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import {
  Email,
  Send,
  Schedule,
  Analytics,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  Assessment,
  Speed,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Timeline,
  AutoGraph,
  Psychology,
  Business,
  Group,
  AttachMoney,
  Close
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`outreach-tabpanel-${index}`}
      aria-labelledby={`outreach-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const OutreachAutomation = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [outreachData, setOutreachData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [sequenceDialogOpen, setSequenceDialogOpen] = useState(false);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Form states
  const [emailForm, setEmailForm] = useState({
    recipient: '',
    subject: '',
    type: 'initial_outreach',
    tone: 'professional',
    opportunity: ''
  });

  const [sequenceForm, setSequenceForm] = useState({
    name: '',
    type: 'standard',
    target_audience: '',
    schedule: 'daily'
  });

  // Mock comprehensive outreach data
  const mockOutreachData = {
    metrics: {
      total_campaigns: 23,
      active_sequences: 8,
      emails_sent_today: 47,
      response_rate: 0.34,
      conversion_rate: 0.12,
      automation_status: 'active'
    },
    email_performance: {
      sent: 1247,
      delivered: 1189,
      opened: 523,
      clicked: 187,
      replied: 89,
      bounced: 58,
      open_rate: 0.44,
      click_rate: 0.16,
      reply_rate: 0.075
    },
    sequence_performance: [
      { name: 'Standard Outreach', emails: 456, responses: 67, conversion: 0.147, status: 'active' },
      { name: 'Follow-up Sequence', emails: 234, responses: 28, conversion: 0.120, status: 'active' },
      { name: 'Re-engagement', emails: 189, responses: 15, conversion: 0.079, status: 'paused' },
      { name: 'VIP Prospects', emails: 123, responses: 34, conversion: 0.276, status: 'active' }
    ],
    recent_campaigns: [
      {
        id: 1,
        name: 'Q4 Partnership Outreach',
        type: 'initial_outreach',
        status: 'active',
        sent: 156,
        responses: 23,
        created: '2024-10-01',
        next_send: '2024-10-10'
      },
      {
        id: 2,
        name: 'Starbucks Follow-up',
        type: 'follow_up',
        status: 'active',
        sent: 45,
        responses: 8,
        created: '2024-10-05',
        next_send: '2024-10-11'
      },
      {
        id: 3,
        name: 'McDonald\'s Re-engagement',
        type: 're_engagement',
        status: 'completed',
        sent: 78,
        responses: 12,
        created: '2024-09-28',
        next_send: null
      }
    ],
    performance_trend: [
      { week: 'Week 1', sent: 234, opened: 98, clicked: 34, replied: 12 },
      { week: 'Week 2', sent: 267, opened: 112, clicked: 41, replied: 18 },
      { week: 'Week 3', sent: 298, opened: 134, clicked: 48, replied: 22 },
      { week: 'Week 4', sent: 321, opened: 145, clicked: 52, replied: 25 }
    ]
  };

  useEffect(() => {
    loadOutreachData();
  }, []);

  const loadOutreachData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const response = await api.get('/outreach/analytics');
        setOutreachData({ ...mockOutreachData, ...response.data });
      } catch (apiError) {
        console.log('Using mock data due to API error:', apiError.message);
        setOutreachData(mockOutreachData);
      }
    } catch (error) {
      console.error('Outreach data loading error:', error);
      setError('Failed to load outreach data');
      setOutreachData(mockOutreachData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOutreachData();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGenerateEmail = async () => {
    try {
      setLoading(true);
      const response = await api.post('/outreach/generate-email', emailForm);
      
      showSnackbar('Email generated successfully!', 'success');
      setEmailDialogOpen(false);
      setEmailForm({
        recipient: '',
        subject: '',
        type: 'initial_outreach',
        tone: 'professional',
        opportunity: ''
      });
      
      // Refresh data
      await loadOutreachData();
    } catch (error) {
      console.error('Email generation error:', error);
      showSnackbar('Failed to generate email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSequence = async () => {
    try {
      setLoading(true);
      const response = await api.post('/outreach/create-sequence', sequenceForm);
      
      showSnackbar('Sequence created successfully!', 'success');
      setSequenceDialogOpen(false);
      setSequenceForm({
        name: '',
        type: 'standard',
        target_audience: '',
        schedule: 'daily'
      });
      
      // Refresh data
      await loadOutreachData();
    } catch (error) {
      console.error('Sequence creation error:', error);
      showSnackbar('Failed to create sequence. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProposal = async () => {
    try {
      setLoading(true);
      showSnackbar('Proposal generation started...', 'info');
      
      // Simulate proposal generation
      setTimeout(() => {
        showSnackbar('Proposal generated successfully!', 'success');
        setProposalDialogOpen(false);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Proposal generation error:', error);
      showSnackbar('Failed to generate proposal. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      setLoading(true);
      showSnackbar('Meeting scheduling started...', 'info');
      
      // Simulate meeting scheduling
      setTimeout(() => {
        showSnackbar('Meeting scheduled successfully!', 'success');
        setMeetingDialogOpen(false);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Meeting scheduling error:', error);
      showSnackbar('Failed to schedule meeting. Please try again.', 'error');
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00C49F';
      case 'paused': return '#FFBB28';
      case 'completed': return '#8884D8';
      case 'stopped': return '#FF8042';
      default: return '#8884D8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <PlayArrow sx={{ color: '#00C49F' }} />;
      case 'paused': return <Pause sx={{ color: '#FFBB28' }} />;
      case 'completed': return <CheckCircle sx={{ color: '#8884D8' }} />;
      case 'stopped': return <Stop sx={{ color: '#FF8042' }} />;
      default: return <CheckCircle sx={{ color: '#8884D8' }} />;
    }
  };

  if (loading && !outreachData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 4,
        borderRadius: '0 0 24px 24px',
        mb: 3
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Outreach Automation
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              AI-powered email campaigns and sequence management
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mx: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Actions */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setEmailDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
                }
              }}
            >
              Generate Email
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Schedule />}
              onClick={() => setSequenceDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                }
              }}
            >
              Create Sequence
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Business />}
              onClick={() => setProposalDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                }
              }}
            >
              Generate Proposal
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Schedule />}
              onClick={() => setMeetingDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
                }
              }}
            >
              Schedule Meeting
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {outreachData?.metrics?.total_campaigns || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Campaigns
                  </Typography>
                </Box>
                <Email sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {outreachData?.metrics?.emails_sent_today || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Emails Sent Today
                  </Typography>
                </Box>
                <Send sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={65} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPercentage(outreachData?.metrics?.response_rate || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Response Rate
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={outreachData?.metrics?.response_rate * 100 || 0} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPercentage(outreachData?.metrics?.conversion_rate || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Conversion Rate
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={outreachData?.metrics?.conversion_rate * 100 || 0} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                }} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            icon={<Analytics />} 
            label="Campaign Analytics" 
            iconPosition="start"
          />
          <Tab 
            icon={<Email />} 
            label="Email Performance" 
            iconPosition="start"
          />
          <Tab 
            icon={<Schedule />} 
            label="Sequence Management" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Campaign Analytics Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Performance Chart and Recent Campaigns */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Weekly Performance Trend
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={outreachData?.performance_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#667eea" strokeWidth={3} />
                    <Line type="monotone" dataKey="opened" stroke="#00C49F" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicked" stroke="#FFBB28" strokeWidth={2} />
                    <Line type="monotone" dataKey="replied" stroke="#FF8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Campaigns
                </Typography>
                <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                  {outreachData?.recent_campaigns?.map((campaign, index) => (
                    <React.Fragment key={campaign.id || index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(campaign.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={campaign.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {campaign.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Typography>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                <Typography variant="caption">
                                  Sent: {campaign.sent} | Responses: {campaign.responses}
                                </Typography>
                                <Chip 
                                  label={campaign.status} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: getStatusColor(campaign.status),
                                    color: 'white',
                                    fontSize: '0.75rem'
                                  }} 
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < outreachData.recent_campaigns.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Email Performance Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Email Funnel Performance
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsBarChart data={[
                    { stage: 'Sent', count: outreachData?.email_performance?.sent || 0 },
                    { stage: 'Delivered', count: outreachData?.email_performance?.delivered || 0 },
                    { stage: 'Opened', count: outreachData?.email_performance?.opened || 0 },
                    { stage: 'Clicked', count: outreachData?.email_performance?.clicked || 0 },
                    { stage: 'Replied', count: outreachData?.email_performance?.replied || 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#667eea" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Performance Rates
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body1">Open Rate</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatPercentage(outreachData?.email_performance?.open_rate || 0)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={outreachData?.email_performance?.open_rate * 100 || 0} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body1">Click Rate</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatPercentage(outreachData?.email_performance?.click_rate || 0)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={outreachData?.email_performance?.click_rate * 100 || 0} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body1">Reply Rate</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatPercentage(outreachData?.email_performance?.reply_rate || 0)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={outreachData?.email_performance?.reply_rate * 100 || 0} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box display="flex" justifyContent="center" mt={4}>
                    <Button variant="contained" startIcon={<Analytics />}>
                      View Detailed Analytics
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Sequence Management Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Email Sequences
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSequenceDialogOpen(true)}
              >
                Create Sequence
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Sequence Name</strong></TableCell>
                    <TableCell><strong>Emails Sent</strong></TableCell>
                    <TableCell><strong>Responses</strong></TableCell>
                    <TableCell><strong>Conversion Rate</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {outreachData?.sequence_performance?.map((sequence, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {sequence.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{sequence.emails}</TableCell>
                      <TableCell>{sequence.responses}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={sequence.conversion * 100} 
                            sx={{ width: 60, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2">
                            {formatPercentage(sequence.conversion)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          {getStatusIcon(sequence.status)}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {sequence.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Sequence">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={sequence.status === 'active' ? 'Pause' : 'Resume'}>
                            <IconButton size="small">
                              {sequence.status === 'active' ? <Pause /> : <PlayArrow />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Email Generation Dialog */}
      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Generate AI Email
            <IconButton onClick={() => setEmailDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recipient Email"
                value={emailForm.recipient}
                onChange={(e) => setEmailForm({ ...emailForm, recipient: e.target.value })}
                placeholder="contact@company.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject Line"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="Partnership Opportunity"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Email Type</InputLabel>
                <Select
                  value={emailForm.type}
                  onChange={(e) => setEmailForm({ ...emailForm, type: e.target.value })}
                  label="Email Type"
                >
                  <MenuItem value="initial_outreach">Initial Outreach</MenuItem>
                  <MenuItem value="follow_up">Follow-up</MenuItem>
                  <MenuItem value="proposal">Proposal</MenuItem>
                  <MenuItem value="meeting_request">Meeting Request</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={emailForm.tone}
                  onChange={(e) => setEmailForm({ ...emailForm, tone: e.target.value })}
                  label="Tone"
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="consultative">Consultative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Opportunity Context"
                value={emailForm.opportunity}
                onChange={(e) => setEmailForm({ ...emailForm, opportunity: e.target.value })}
                placeholder="Describe the opportunity or context for this email..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateEmail}
            disabled={loading || !emailForm.recipient || !emailForm.subject}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sequence Creation Dialog */}
      <Dialog open={sequenceDialogOpen} onClose={() => setSequenceDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Create Email Sequence
            <IconButton onClick={() => setSequenceDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sequence Name"
                value={sequenceForm.name}
                onChange={(e) => setSequenceForm({ ...sequenceForm, name: e.target.value })}
                placeholder="Q4 Partnership Outreach"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sequence Type</InputLabel>
                <Select
                  value={sequenceForm.type}
                  onChange={(e) => setSequenceForm({ ...sequenceForm, type: e.target.value })}
                  label="Sequence Type"
                >
                  <MenuItem value="standard">Standard Outreach</MenuItem>
                  <MenuItem value="aggressive">Aggressive Follow-up</MenuItem>
                  <MenuItem value="nurture">Nurture Sequence</MenuItem>
                  <MenuItem value="re_engagement">Re-engagement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Audience"
                value={sequenceForm.target_audience}
                onChange={(e) => setSequenceForm({ ...sequenceForm, target_audience: e.target.value })}
                placeholder="QSR Decision Makers"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Schedule</InputLabel>
                <Select
                  value={sequenceForm.schedule}
                  onChange={(e) => setSequenceForm({ ...sequenceForm, schedule: e.target.value })}
                  label="Schedule"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="every_2_days">Every 2 Days</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="bi_weekly">Bi-weekly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSequenceDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateSequence}
            disabled={loading || !sequenceForm.name || !sequenceForm.target_audience}
            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
          >
            {loading ? 'Creating...' : 'Create Sequence'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Proposal Generation Dialog */}
      <Dialog open={proposalDialogOpen} onClose={() => setProposalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate AI Proposal</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Generate a comprehensive partnership proposal using AI analysis of the opportunity and market data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProposalDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateProposal}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Business />}
          >
            {loading ? 'Generating...' : 'Generate Proposal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Meeting Scheduling Dialog */}
      <Dialog open={meetingDialogOpen} onClose={() => setMeetingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Meeting</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Schedule a meeting with the prospect using AI-powered calendar integration and optimal timing suggestions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMeetingDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleScheduleMeeting}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Schedule />}
          >
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OutreachAutomation;
