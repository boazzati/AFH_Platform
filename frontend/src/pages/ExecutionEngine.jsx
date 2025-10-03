import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Schedule,
  Warning,
  Assignment,
  TrackChanges,
  Add
} from '@mui/icons-material';

const ExecutionEngine = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activities, setActivities] = useState([
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
  ]);

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Execution Engine with Closed-Loop Tracking
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track pitches, pilots, and launches with real-time feedback and AI recommendations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  AFH Execution Pipeline
                </Typography>
                <Button variant="contained" startIcon={<Add />}>
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
                          onClick={() => setActiveStep(index + 1)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === executionSteps.length - 1 ? 'Finish' : 'Continue'}
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
              <List>
                {[
                  'Increase follow-up frequency for Burger King account',
                  'Consider competitive pricing analysis for Google Campus',
                  'Expand premium portfolio offering for Hilton Hotels',
                  'Monitor Q1 menu changes in target QSR accounts'
                ].map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrackChanges color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                    <Button size="small">Apply</Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
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
                      <Button size="small">Update</Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Log Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField size="small" label="Account" placeholder="Enter account name" />
                <TextField size="small" label="Activity Type" select>
                  <option value="pitch">Pitch</option>
                  <option value="pilot">Pilot</option>
                  <option value="launch">Launch</option>
                  <option value="follow-up">Follow-up</option>
                </TextField>
                <TextField size="small" label="Notes" multiline rows={2} />
                <Button variant="outlined" startIcon={<Add />}>
                  Log Activity
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExecutionEngine;
