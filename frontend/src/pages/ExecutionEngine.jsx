import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
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
  IconButton
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Schedule,
  Warning,
  Assignment,
  TrackChanges,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import { executionEngineAPI } from '../services/api';

const ExecutionEngine = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    account: '',
    type: 'Pitch',
    status: 'planned',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    nextAction: ''
  });

  // Load activities from backend
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const response = await executionEngineAPI.getProjects();
      // Transform projects to activities format
      const transformedActivities = response.data.map(project => ({
        id: project._id,
        account: project.name,
        type: getActivityTypeFromProject(project),
        status: mapProjectStatusToActivityStatus(project.status),
        date: new Date(project.lastUpdate).toISOString().split('T')[0],
        notes: project.risks?.join(', ') || project.description || 'No notes',
        nextAction: project.nextSteps?.[0] || 'No next action defined',
        projectData: project
      }));
      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setError('Failed to load activities. Using sample data.');
      setActivities(getSampleActivities());
    } finally {
      setLoading(false);
    }
  };

  const getActivityTypeFromProject = (project) => {
    if (project.progress === 0) return 'Pitch';
    if (project.progress > 0 && project.progress < 100) return 'Pilot';
    if (project.progress === 100) return 'Launch';
    return 'Follow-up';
  };

  const mapProjectStatusToActivityStatus = (projectStatus) => {
    const statusMap = {
      'completed': 'completed',
      'in-progress': 'in-progress',
      'active': 'in-progress',
      'planned': 'planned',
      'on-hold': 'planned'
    };
    return statusMap[projectStatus] || 'planned';
  };

  const getSampleActivities = () => [
    {
      id: 1,
      account: 'Burger King - Downtown',
      type: 'Pitch',
      status: 'completed',
      date: '2024-01-15',
      notes: 'Initial beverage partnership discussion',
      nextAction: 'Follow-up meeting scheduled'
    },
    {
      id: 2,
      account: 'Google Campus Cafe',
      type: 'Pilot',
      status: 'in-progress',
      date: '2024-01-18',
      notes: 'Healthy beverage line testing',
      nextAction: 'Monitor sales data'
    },
    {
      id: 3,
      account: 'Hilton Hotels',
      type: 'Launch',
      status: 'planned',
      date: '2024-02-01',
      notes: 'Premium portfolio placement',
      nextAction: 'Finalize contract'
    }
  ];

  const executionSteps = [
    {
      label: 'Account Identification',
      description: 'AI-flagged high-potential AFH accounts based on market signals'
    },
    {
      label: 'Strategy Assignment',
      description: 'Match account with appropriate commercial playbook'
    },
    {
      label: 'Pitch & Proposal',
      description: 'AI-assisted outreach and proposal generation'
    },
    {
      label: 'Pilot Execution',
      description: 'Limited rollout with performance tracking'
    },
    {
      label: 'Full Launch',
      description: 'Scaled implementation with ongoing monitoring'
    }
  ];

  const handleAddActivity = async () => {
    if (!newActivity.account || !newActivity.notes) {
      setError('Please fill in account and notes');
      return;
    }

    setLoading(true);
    try {
      // Create a new project in the backend
      const projectData = {
        name: newActivity.account,
        status: mapActivityStatusToProjectStatus(newActivity.status),
        progress: getProgressFromActivityType(newActivity.type),
        channel: 'QSR', // Default channel
        owner: 'Current User',
        timeline: newActivity.date,
        risks: [newActivity.notes],
        nextSteps: [newActivity.nextAction],
        performanceMetrics: {
          type: newActivity.type,
          status: newActivity.status
        }
      };

      const response = await executionEngineAPI.createProject(projectData);
      
      // Update activities list immediately
      const newActivityItem = {
        id: response.data._id,
        account: newActivity.account,
        type: newActivity.type,
        status: newActivity.status,
        date: newActivity.date,
        notes: newActivity.notes,
        nextAction: newActivity.nextAction
      };
      
      setActivities(prev => [newActivityItem, ...prev]);
      setSuccess('Activity logged successfully!');
      setOpenDialog(false);
      setNewActivity({
        account: '',
        type: 'Pitch',
        status: 'planned',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        nextAction: ''
      });
      
    } catch (error) {
      console.error('Error adding activity:', error);
      setError('Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivity = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      account: activity.account,
      type: activity.type,
      status: activity.status,
      date: activity.date,
      notes: activity.notes,
      nextAction: activity.nextAction
    });
    setOpenDialog(true);
  };

  const handleUpdateActivitySubmit = async () => {
    if (!editingActivity) return;

    setLoading(true);
    try {
      const projectData = {
        name: newActivity.account,
        status: mapActivityStatusToProjectStatus(newActivity.status),
        progress: getProgressFromActivityType(newActivity.type),
        timeline: newActivity.date,
        risks: [newActivity.notes],
        nextSteps: [newActivity.nextAction]
      };

      await executionEngineAPI.updateProject(editingActivity.id, projectData);
      
      // Update the activity in the local state
      setActivities(prev => prev.map(activity => 
        activity.id === editingActivity.id 
          ? { ...activity, ...newActivity }
          : activity
      ));
      
      setSuccess('Activity updated successfully!');
      setOpenDialog(false);
      setEditingActivity(null);
      setNewActivity({
        account: '',
        type: 'Pitch',
        status: 'planned',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        nextAction: ''
      });
      
    } catch (error) {
      console.error('Error updating activity:', error);
      setError('Failed to update activity');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRecommendation = async (recommendation) => {
    try {
      // Create a new project based on the recommendation
      const projectData = {
        name: `AI Action: ${recommendation.substring(0, 30)}...`,
        status: 'planned',
        progress: 0,
        channel: 'AI Recommended',
        owner: 'AI System',
        timeline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        risks: [recommendation],
        nextSteps: [
          'Review AI recommendation',
          'Assign team resources',
          'Set KPIs and timeline',
          'Execute action plan'
        ],
        performanceMetrics: {
          source: 'AI Recommendation',
          priority: 'High',
          expectedImpact: 'Significant'
        }
      };

      const response = await executionEngineAPI.createProject(projectData);
      
      // Add to activities immediately
      const newActivityItem = {
        id: response.data._id,
        account: projectData.name,
        type: 'AI Action',
        status: 'planned',
        date: new Date().toISOString().split('T')[0],
        notes: recommendation,
        nextAction: 'Review and assign'
      };
      
      setActivities(prev => [newActivityItem, ...prev]);
      setSuccess(`AI recommendation applied! Project "${projectData.name}" created.`);
      
    } catch (error) {
      console.error('Error applying recommendation:', error);
      setError('Failed to apply recommendation');
    }
  };

  const handleCompleteStep = (stepIndex) => {
    if (stepIndex < executionSteps.length - 1) {
      setActiveStep(stepIndex + 1);
    } else {
      setSuccess('All execution steps completed! Ready to launch new initiatives.');
      setActiveStep(0); // Reset to first step
    }
  };

  const mapActivityStatusToProjectStatus = (activityStatus) => {
    const statusMap = {
      'completed': 'completed',
      'in-progress': 'in-progress',
      'planned': 'planned'
    };
    return statusMap[activityStatus] || 'planned';
  };

  const getProgressFromActivityType = (type) => {
    const progressMap = {
      'Pitch': 25,
      'Pilot': 50,
      'Launch': 100,
      'Follow-up': 75,
      'AI Action': 10
    };
    return progressMap[type] || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'planned': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'in-progress': return <Schedule color="warning" />;
      case 'planned': return <Assignment color="info" />;
      default: return <Assignment />;
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingActivity(null);
    setNewActivity({
      account: '',
      type: 'Pitch',
      status: 'planned',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      nextAction: ''
    });
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Execution Engine with Closed-Loop Tracking
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track pitches, pilots, and launches with real-time feedback and AI recommendations
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
                <Typography variant="h6">
                  AFH Execution Pipeline
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                  disabled={loading}
                >
                  New Activity
                </Button>
              </Box>

              <Stepper activeStep={activeStep} orientation="vertical">
                {executionSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography variant="h6">{step.label}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      <Box sx={{ mb: 2, mt: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleCompleteStep(index)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === executionSteps.length - 1 ? 'Complete Process' : 'Mark Complete'}
                        </Button>
                        {index > 0 && (
                          <Button
                            onClick={() => setActiveStep(index - 1)}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Recommendations & Gap Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Apply AI insights to create actionable projects
              </Typography>
              <List>
                {[
                  'Increase follow-up frequency for Burger King account - Current win rate below target',
                  'Consider competitive pricing analysis for Google Campus - Opportunity for premium placement',
                  'Expand premium portfolio offering for Hilton Hotels - High-margin opportunity identified',
                  'Monitor Q1 menu changes in target QSR accounts - Seasonal menu updates create openings'
                ].map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrackChanges color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={recommendation.split(' - ')[0]}
                      secondary={recommendation.split(' - ')[1]}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleApplyRecommendation(recommendation)}
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Activities
                </Typography>
                <Button 
                  size="small" 
                  onClick={loadActivities}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {activities.map((activity) => (
                    <Paper key={activity.id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {activity.account}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(activity.status)}
                          label={activity.status}
                          color={getStatusColor(activity.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {activity.type} • {activity.date}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {activity.notes}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="primary">
                          Next: {activity.nextAction}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => handleUpdateActivity(activity)}
                          disabled={loading}
                        >
                          Update
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Execution Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { metric: 'Active Projects', value: activities.length, trend: activities.length > 0 ? '+2' : '0' },
                  { metric: 'Completion Rate', value: `${Math.round((activities.filter(a => a.status === 'completed').length / activities.length) * 100) || 0}%`, trend: '+8%' },
                  { metric: 'Avg Time to Complete', value: '45 days', trend: '-5 days' },
                  { metric: 'AI Recommendations Applied', value: activities.filter(a => a.type === 'AI Action').length, trend: '+3' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{item.metric}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {item.value}
                      </Typography>
                      <Chip 
                        label={item.trend} 
                        color={item.trend.startsWith('+') || item.trend.startsWith('-') ? "success" : "default"} 
                        size="small" 
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Activity Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingActivity ? 'Update Activity' : 'Log New Activity'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Account"
              value={newActivity.account}
              onChange={(e) => setNewActivity({ ...newActivity, account: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                value={newActivity.type}
                label="Activity Type"
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
              >
                <MenuItem value="Pitch">Pitch</MenuItem>
                <MenuItem value="Pilot">Pilot</MenuItem>
                <MenuItem value="Launch">Launch</MenuItem>
                <MenuItem value="Follow-up">Follow-up</MenuItem>
                <MenuItem value="AI Action">AI Action</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newActivity.status}
                label="Status"
                onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })}
              >
                <MenuItem value="planned">Planned</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={newActivity.notes}
              onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
              fullWidth
              placeholder="Describe the activity, key discussions, outcomes..."
            />
            <TextField
              label="Next Action"
              value={newActivity.nextAction}
              onChange={(e) => setNewActivity({ ...newActivity, nextAction: e.target.value })}
              fullWidth
              placeholder="What needs to happen next?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={editingActivity ? handleUpdateActivitySubmit : handleAddActivity}
            variant="contained"
            disabled={!newActivity.account || !newActivity.notes || loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingActivity ? 'Update Activity' : 'Log Activity')}
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

export default ExecutionEngine;
