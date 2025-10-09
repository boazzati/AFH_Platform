import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Divider
} from '@mui/material';
import {
  Email,
  Send,
  Schedule,
  Analytics,
  TrendingUp,
  Person,
  Business,
  AttachMoney,
  CalendarToday,
  PlayArrow,
  Pause,
  Stop,
  Visibility,
  Edit,
  Delete,
  Add,
  Download,
  Share,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const OutreachAutomation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for different components
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [analytics, setAnalytics] = useState({});
  
  // Dialog states
  const [emailDialog, setEmailDialog] = useState(false);
  const [sequenceDialog, setSequenceDialog] = useState(false);
  const [proposalDialog, setProposalDialog] = useState(false);
  const [meetingDialog, setMeetingDialog] = useState(false);
  
  // Form states
  const [emailForm, setEmailForm] = useState({
    opportunityId: '',
    contactName: '',
    contactEmail: '',
    emailType: 'initial',
    tone: 'professional',
    customContext: ''
  });
  
  const [sequenceForm, setSequenceForm] = useState({
    opportunityId: '',
    contactId: '',
    sequenceType: 'standard',
    triggerConditions: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all outreach data
      await Promise.all([
        loadEmailCampaigns(),
        loadSequences(),
        loadProposals(),
        loadMeetings(),
        loadAnalytics()
      ]);
    } catch (error) {
      setError('Failed to load outreach data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailCampaigns = async () => {
    // Mock data for email campaigns
    setEmailCampaigns([
      {
        id: 'camp_001',
        name: 'Q4 Partnership Outreach',
        status: 'active',
        emailsSent: 45,
        openRate: 32.5,
        clickRate: 8.2,
        replyRate: 4.1,
        createdAt: '2024-10-01',
        lastActivity: '2024-10-07'
      },
      {
        id: 'camp_002',
        name: 'Menu Innovation Series',
        status: 'completed',
        emailsSent: 78,
        openRate: 28.7,
        clickRate: 6.9,
        replyRate: 3.8,
        createdAt: '2024-09-15',
        lastActivity: '2024-09-30'
      }
    ]);
  };

  const loadSequences = async () => {
    // Mock data for sequences
    setSequences([
      {
        id: 'seq_001',
        opportunityId: 'opp_001',
        contactName: 'John Smith',
        company: 'Coffee Chain Co.',
        status: 'active',
        progress: { current: 2, total: 5 },
        nextEmailDate: '2024-10-10',
        analytics: { sent: 2, opened: 1, clicked: 0, replied: 0 }
      },
      {
        id: 'seq_002',
        opportunityId: 'opp_002',
        contactName: 'Sarah Johnson',
        company: 'Fast Casual Group',
        status: 'paused',
        progress: { current: 3, total: 5 },
        nextEmailDate: null,
        analytics: { sent: 3, opened: 2, clicked: 1, replied: 1 }
      }
    ]);
  };

  const loadProposals = async () => {
    // Mock data for proposals
    setProposals([
      {
        id: 'prop_001',
        title: 'Strategic Partnership - Coffee Chain Co.',
        status: 'sent',
        opportunityId: 'opp_001',
        contactName: 'John Smith',
        sentDate: '2024-10-05',
        views: 3,
        timeSpent: 12,
        lastViewed: '2024-10-07',
        value: '$2.5M'
      },
      {
        id: 'prop_002',
        title: 'Menu Innovation - Fast Casual Group',
        status: 'draft',
        opportunityId: 'opp_002',
        contactName: 'Sarah Johnson',
        createdDate: '2024-10-06',
        views: 0,
        timeSpent: 0,
        value: '$1.8M'
      }
    ]);
  };

  const loadMeetings = async () => {
    // Mock data for meetings
    setMeetings([
      {
        id: 'meet_001',
        title: 'Discovery Call - Coffee Chain Co.',
        type: 'discovery',
        opportunityId: 'opp_001',
        contactName: 'John Smith',
        scheduledAt: '2024-10-12T10:00:00Z',
        duration: 60,
        status: 'scheduled',
        agenda: ['Company overview', 'Partnership discussion', 'Next steps']
      },
      {
        id: 'meet_002',
        title: 'Proposal Review - Fast Casual Group',
        type: 'proposal',
        opportunityId: 'opp_002',
        contactName: 'Sarah Johnson',
        scheduledAt: '2024-10-15T14:00:00Z',
        duration: 90,
        status: 'scheduled',
        agenda: ['Proposal presentation', 'Q&A', 'Financial review']
      }
    ]);
  };

  const loadAnalytics = async () => {
    // Mock analytics data
    setAnalytics({
      overview: {
        totalEmails: 156,
        totalSequences: 12,
        totalProposals: 8,
        totalMeetings: 15,
        averageOpenRate: 31.2,
        averageClickRate: 7.8,
        averageReplyRate: 4.2,
        conversionRate: 12.5
      },
      trends: {
        emailPerformance: [
          { month: 'Jul', sent: 45, opened: 14, clicked: 3, replied: 2 },
          { month: 'Aug', sent: 52, opened: 18, clicked: 4, replied: 3 },
          { month: 'Sep', sent: 38, opened: 12, clicked: 2, replied: 1 },
          { month: 'Oct', sent: 21, opened: 7, clicked: 2, replied: 1 }
        ],
        conversionFunnel: [
          { stage: 'Emails Sent', count: 156, percentage: 100 },
          { stage: 'Emails Opened', count: 51, percentage: 32.7 },
          { stage: 'Links Clicked', count: 11, percentage: 7.1 },
          { stage: 'Replies Received', count: 7, percentage: 4.5 },
          { stage: 'Meetings Scheduled', count: 4, percentage: 2.6 },
          { stage: 'Proposals Sent', count: 3, percentage: 1.9 }
        ]
      }
    });
  };

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/outreach/generate-email', emailForm);
      if (response.data.success) {
        // Handle successful email generation
        setEmailDialog(false);
        setEmailForm({
          opportunityId: '',
          contactName: '',
          contactEmail: '',
          emailType: 'initial',
          tone: 'professional',
          customContext: ''
        });
        await loadEmailCampaigns();
      }
    } catch (error) {
      setError('Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const createSequence = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/outreach/create-sequence', sequenceForm);
      if (response.data.success) {
        setSequenceDialog(false);
        setSequenceForm({
          opportunityId: '',
          contactId: '',
          sequenceType: 'standard',
          triggerConditions: {}
        });
        await loadSequences();
      }
    } catch (error) {
      setError('Failed to create sequence');
    } finally {
      setLoading(false);
    }
  };

  const controlSequence = async (sequenceId, action) => {
    try {
      await api.post(`/api/outreach/sequence/${sequenceId}/${action}`);
      await loadSequences();
    } catch (error) {
      setError(`Failed to ${action} sequence`);
    }
  };

  const renderOverviewTab = () => (
    <Box>
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview?.totalEmails || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Emails Sent
                  </Typography>
                </Box>
                <Email sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview?.totalSequences || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Sequences
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview?.averageOpenRate || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average Open Rate
                  </Typography>
                </Box>
                <Visibility sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview?.conversionRate || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Conversion Rate
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.trends?.emailPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Sent" />
                  <Line type="monotone" dataKey="opened" stroke="#82ca9d" name="Opened" />
                  <Line type="monotone" dataKey="clicked" stroke="#ffc658" name="Clicked" />
                  <Line type="monotone" dataKey="replied" stroke="#ff7300" name="Replied" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversion Funnel
              </Typography>
              <Box sx={{ mt: 2 }}>
                {analytics.trends?.conversionFunnel?.map((stage, index) => (
                  <Box key={stage.stage} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2">{stage.stage}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stage.count} ({stage.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stage.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: `hsl(${120 - index * 20}, 70%, 50%)`
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setEmailDialog(true)}
                sx={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}
              >
                Generate Email
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Schedule />}
                onClick={() => setSequenceDialog(true)}
                sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}
              >
                Create Sequence
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Business />}
                onClick={() => setProposalDialog(true)}
                sx={{ background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)' }}
              >
                Generate Proposal
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<CalendarToday />}
                onClick={() => setMeetingDialog(true)}
                sx={{ background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)' }}
              >
                Schedule Meeting
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderSequencesTab = () => (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Email Sequences
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setSequenceDialog(true)}
        >
          Create Sequence
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Next Email</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sequences.map((sequence) => (
              <TableRow key={sequence.id}>
                <TableCell>{sequence.contactName}</TableCell>
                <TableCell>{sequence.company}</TableCell>
                <TableCell>
                  <Chip
                    label={sequence.status}
                    color={sequence.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={(sequence.progress.current / sequence.progress.total) * 100}
                      sx={{ width: 60, height: 6 }}
                    />
                    <Typography variant="body2">
                      {sequence.progress.current}/{sequence.progress.total}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {sequence.nextEmailDate ? new Date(sequence.nextEmailDate).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      Opened: {sequence.analytics.opened}/{sequence.analytics.sent}
                    </Typography>
                    <Typography variant="body2">
                      Replied: {sequence.analytics.replied}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {sequence.status === 'active' ? (
                      <Tooltip title="Pause">
                        <IconButton
                          size="small"
                          onClick={() => controlSequence(sequence.id, 'pause')}
                        >
                          <Pause />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Resume">
                        <IconButton
                          size="small"
                          onClick={() => controlSequence(sequence.id, 'resume')}
                        >
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Stop">
                      <IconButton
                        size="small"
                        onClick={() => controlSequence(sequence.id, 'stop')}
                      >
                        <Stop />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderProposalsTab = () => (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Proposals
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setProposalDialog(true)}
        >
          Generate Proposal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {proposals.map((proposal) => (
          <Grid item xs={12} md={6} key={proposal.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="between" alignItems="start" sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {proposal.title}
                  </Typography>
                  <Chip
                    label={proposal.status}
                    color={proposal.status === 'sent' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Contact: {proposal.contactName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Value: {proposal.value}
                </Typography>
                
                {proposal.status === 'sent' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Views: {proposal.views} | Time Spent: {proposal.timeSpent}m
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Viewed: {new Date(proposal.lastViewed).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                
                <Box display="flex" gap={1} sx={{ mt: 2 }}>
                  <Button size="small" startIcon={<Visibility />}>
                    View
                  </Button>
                  <Button size="small" startIcon={<Edit />}>
                    Edit
                  </Button>
                  <Button size="small" startIcon={<Share />}>
                    Share
                  </Button>
                  <Button size="small" startIcon={<Download />}>
                    Download
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMeetingsTab = () => (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Meetings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setMeetingDialog(true)}
        >
          Schedule Meeting
        </Button>
      </Box>

      <Grid container spacing={3}>
        {meetings.map((meeting) => (
          <Grid item xs={12} md={6} key={meeting.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="between" alignItems="start" sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {meeting.title}
                  </Typography>
                  <Chip
                    label={meeting.status}
                    color={meeting.status === 'scheduled' ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Contact: {meeting.contactName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {new Date(meeting.scheduledAt).toLocaleString()}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Duration: {meeting.duration} minutes
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {meeting.type}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Agenda:
                  </Typography>
                  {meeting.agenda.map((item, index) => (
                    <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                      • {item}
                    </Typography>
                  ))}
                </Box>
                
                <Box display="flex" gap={1} sx={{ mt: 2 }}>
                  <Button size="small" startIcon={<Edit />}>
                    Edit
                  </Button>
                  <Button size="small" startIcon={<CalendarToday />}>
                    Add to Calendar
                  </Button>
                  <Button size="small" startIcon={<Send />}>
                    Send Reminder
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Outreach Automation
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        AI-powered email generation, automated follow-up sequences, and comprehensive communication analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" icon={<Analytics />} />
          <Tab label="Email Sequences" icon={<Schedule />} />
          <Tab label="Proposals" icon={<Business />} />
          <Tab label="Meetings" icon={<CalendarToday />} />
        </Tabs>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {activeTab === 0 && renderOverviewTab()}
      {activeTab === 1 && renderSequencesTab()}
      {activeTab === 2 && renderProposalsTab()}
      {activeTab === 3 && renderMeetingsTab()}

      {/* Email Generation Dialog */}
      <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate AI-Powered Email</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Opportunity ID"
                value={emailForm.opportunityId}
                onChange={(e) => setEmailForm({ ...emailForm, opportunityId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                value={emailForm.contactName}
                onChange={(e) => setEmailForm({ ...emailForm, contactName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={emailForm.contactEmail}
                onChange={(e) => setEmailForm({ ...emailForm, contactEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Email Type</InputLabel>
                <Select
                  value={emailForm.emailType}
                  onChange={(e) => setEmailForm({ ...emailForm, emailType: e.target.value })}
                >
                  <MenuItem value="initial">Initial Outreach</MenuItem>
                  <MenuItem value="follow_up">Follow Up</MenuItem>
                  <MenuItem value="proposal">Proposal</MenuItem>
                  <MenuItem value="meeting_request">Meeting Request</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={emailForm.tone}
                  onChange={(e) => setEmailForm({ ...emailForm, tone: e.target.value })}
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
                label="Custom Context"
                value={emailForm.customContext}
                onChange={(e) => setEmailForm({ ...emailForm, customContext: e.target.value })}
                placeholder="Additional context or specific points to include..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
          <Button onClick={generateEmail} variant="contained" disabled={loading}>
            Generate Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sequence Creation Dialog */}
      <Dialog open={sequenceDialog} onClose={() => setSequenceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Email Sequence</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Opportunity ID"
                value={sequenceForm.opportunityId}
                onChange={(e) => setSequenceForm({ ...sequenceForm, opportunityId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact ID"
                value={sequenceForm.contactId}
                onChange={(e) => setSequenceForm({ ...sequenceForm, contactId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sequence Type</InputLabel>
                <Select
                  value={sequenceForm.sequenceType}
                  onChange={(e) => setSequenceForm({ ...sequenceForm, sequenceType: e.target.value })}
                >
                  <MenuItem value="standard">Standard Follow-up</MenuItem>
                  <MenuItem value="aggressive">Aggressive Outreach</MenuItem>
                  <MenuItem value="nurture">Long-term Nurture</MenuItem>
                  <MenuItem value="reengagement">Re-engagement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSequenceDialog(false)}>Cancel</Button>
          <Button onClick={createSequence} variant="contained" disabled={loading}>
            Create Sequence
          </Button>
        </DialogActions>
      </Dialog>

      {/* Proposal Generation Dialog */}
      <Dialog open={proposalDialog} onClose={() => setProposalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Proposal</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2 }}>
            AI-powered proposal generation coming soon. This will create comprehensive partnership proposals with financial modeling and implementation timelines.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProposalDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Meeting Scheduling Dialog */}
      <Dialog open={meetingDialog} onClose={() => setMeetingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Meeting</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2 }}>
            Automated meeting scheduling with calendar integration coming soon. This will include agenda generation and reminder automation.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMeetingDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutreachAutomation;
