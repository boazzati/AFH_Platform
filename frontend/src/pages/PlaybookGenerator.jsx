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
import { Add, Save, PlayArrow } from '@mui/icons-material';

const PlaybookGenerator = () => {
  const [strategyName, setStrategyName] = useState('');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [riskLevel, setRiskLevel] = useState('medium');

  const sectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Real Estate', 'Consumer'];
  const riskLevels = ['low', 'medium', 'high', 'aggressive'];

  const handleSectorSelect = (sector) => {
    if (!selectedSectors.includes(sector)) {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  const handleSectorRemove = (sectorToRemove) => {
    setSelectedSectors(selectedSectors.filter(sector => sector !== sectorToRemove));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Investment Playbook Generator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New Strategy
              </Typography>
              
              <TextField
                fullWidth
                label="Strategy Name"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={riskLevel}
                  label="Risk Level"
                  onChange={(e) => setRiskLevel(e.target.value)}
                >
                  {riskLevels.map(level => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle1" gutterBottom>
                Select Sectors
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {sectors.map(sector => (
                  <Chip
                    key={sector}
                    label={sector}
                    onClick={() => handleSectorSelect(sector)}
                    color={selectedSectors.includes(sector) ? 'primary' : 'default'}
                    variant={selectedSectors.includes(sector) ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>

              {selectedSectors.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Sectors:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {selectedSectors.map(sector => (
                      <Chip
                        key={sector}
                        label={sector}
                        onDelete={() => handleSectorRemove(sector)}
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<Save />}>
                  Save Strategy
                </Button>
                <Button variant="outlined" startIcon={<PlayArrow />}>
                  Execute Strategy
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Strategy Templates
              </Typography>
              <Stack spacing={2}>
                {['Growth Portfolio', 'Value Investment', 'Sector Rotation', 'Market Neutral'].map(template => (
                  <Card key={template} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">{template}</Typography>
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
