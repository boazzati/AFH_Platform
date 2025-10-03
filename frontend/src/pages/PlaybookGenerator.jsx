import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import { Add, Save, PlayArrow, Restaurant, Business, LocalCafe } from '@mui/icons-material';

const PlaybookGenerator = () => {
  const [playbookName, setPlaybookName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [accountType, setAccountType] = useState('');

  const channels = [
    { name: 'Quick Service Restaurant (QSR)', icon: <Restaurant /> },
    { name: 'Workplace & Corporate', icon: <Business /> },
    { name: 'Leisure & Hospitality', icon: <LocalCafe /> },
    { name: 'Education', icon: <Business /> },
    { name: 'Healthcare', icon: <Business /> }
  ];

  const accountTypes = ['New Account Acquisition', 'Existing Account Growth', 'Competitive Takeover', 'Menu Expansion'];

  const playbookTemplates = [
    { name: 'QSR Beverage Partnership', channel: 'QSR', focus: 'New account acquisition' },
    { name: 'Workplace Wellness Program', channel: 'Workplace', focus: 'Healthy beverage placement' },
    { name: 'Hotel Mini-Bar Refresh', channel: 'Leisure', focus: 'Premium portfolio placement' },
    { name: 'Campus Dining Expansion', channel: 'Education', focus: 'Volume contract strategy' }
  ];

  const handleChannelSelect = (channel) => {
    if (!selectedChannels.find(c => c.name === channel.name)) {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleChannelRemove = (channelToRemove) => {
    setSelectedChannels(selectedChannels.filter(channel => channel.name !== channelToRemove.name));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Commercial Playbook Generator
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        AI-generated living playbooks for AFH channel strategies
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New Playbook
              </Typography>
              
              <TextField
                fullWidth
                label="Playbook Name"
                placeholder="e.g., QSR Beverage Partnership Strategy"
                value={playbookName}
                onChange={(e) => setPlaybookName(e.target.value)}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={accountType}
                  label="Account Type"
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  {accountTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle1" gutterBottom>
                Target Channels
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {channels.map(channel => (
                  <Chip
                    key={channel.name}
                    icon={channel.icon}
                    label={channel.name}
                    onClick={() => handleChannelSelect(channel)}
                    color={selectedChannels.find(c => c.name === channel.name) ? 'primary' : 'default'}
                    variant={selectedChannels.find(c => c.name === channel.name) ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>

              {selectedChannels.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Channels:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {selectedChannels.map(channel => (
                      <Chip
                        key={channel.name}
                        icon={channel.icon}
                        label={channel.name}
                        onDelete={() => handleChannelRemove(channel)}
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<Save />}>
                  Generate Playbook
                </Button>
                <Button variant="outlined" startIcon={<PlayArrow />}>
                  Preview Strategy
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Playbook Templates
              </Typography>
              <Stack spacing={2}>
                {playbookTemplates.map((template, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {template.channel} • {template.focus}
                      </Typography>
                      <Button size="small" startIcon={<Add />}>
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaybookGenerator;
