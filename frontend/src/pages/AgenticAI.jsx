import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import {
  SmartToy,
  Send,
  AutoAwesome,
  Psychology,
  Analytics,
  TrendingUp,
  Code,
  Refresh
} from '@mui/icons-material';

const AgenticAI = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'ai', content: 'Hello! I\'m your AI financial analyst. How can I assist you with market analysis, investment strategies, or data interpretation today?' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const aiAgents = [
    {
      id: 1,
      name: 'Market Analyst',
      description: 'Analyzes market trends and identifies opportunities',
      status: 'active',
      capabilities: ['Trend Analysis', 'Pattern Recognition', 'Market Forecasting'],
      avatar: <TrendingUp />
    },
    {
      id: 2,
      name: 'Risk Assessor',
      description: 'Evaluates investment risks and provides mitigation strategies',
      status: 'active',
      capabilities: ['Risk Scoring', 'Portfolio Analysis', 'Stress Testing'],
      avatar: <Analytics />
    },
    {
      id: 3,
      name: 'Strategy Generator',
      description: 'Creates optimized investment strategies based on goals',
      status: 'developing',
      capabilities: ['Strategy Formulation', 'Backtesting', 'Optimization'],
      avatar: <Psychology />
    },
    {
      id: 4,
      name: 'Code Interpreter',
      description: 'Analyzes and executes financial models and algorithms',
      status: 'active',
      capabilities: ['Python Execution', 'Data Analysis', 'Model Validation'],
      avatar: <Code />
    }
  ];

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setConversation(prev => [...prev, userMessage]);
    setPrompt('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        content: `I've analyzed your query about "${prompt}". Based on current market data and historical trends, I recommend considering diversified exposure to emerging technologies while maintaining defensive positions in stable sectors. The current volatility suggests a balanced approach with 60% growth assets and 40% defensive holdings.`
      };
      setConversation(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agentic AI Assistant
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Intelligent AI agents working together to provide comprehensive financial analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Agents
              </Typography>
              <List>
                {aiAgents.map((agent) => (
                  <ListItem key={agent.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: agent.status === 'active' ? 'success.main' : 'warning.main' }}>
                        {agent.avatar}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {agent.name}
                          <Chip 
                            label={agent.status} 
                            size="small" 
                            color={agent.status === 'active' ? 'success' : 'warning'}
                          />
                        </Box>
                      }
                      secondary={agent.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Analysis
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { task: 'Market Trend Analysis', progress: 75, agent: 'Market Analyst' },
                  { task: 'Portfolio Risk Assessment', progress: 40, agent: 'Risk Assessor' },
                  { task: 'Investment Strategy Optimization', progress: 90, agent: 'Strategy Generator' }
                ].map((analysis, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {analysis.task}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {analysis.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={analysis.progress} />
                    <Typography variant="caption" color="text.secondary">
                      by {analysis.agent}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                AI Conversation
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  flexGrow: 1, 
                  p: 2, 
                  mb: 2, 
                  overflow: 'auto',
                  maxHeight: 400,
                  backgroundColor: 'grey.50'
                }}
              >
                {conversation.map((message, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar sx={{ 
                        bgcolor: message.role === 'ai' ? 'primary.main' : 'secondary.main',
                        width: 32, 
                        height: 32 
                      }}>
                        {message.role === 'ai' ? <SmartToy /> : 'U'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {message.role === 'ai' ? 'AI Assistant' : 'You'}
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 1.5, 
                            mt: 0.5,
                            backgroundColor: message.role === 'ai' ? 'primary.50' : 'grey.100',
                            borderColor: message.role === 'ai' ? 'primary.100' : 'grey.300'
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                ))}
                {isProcessing && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <SmartToy />
                    </Avatar>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Analyzing your query...
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Paper>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Ask about market trends, investment strategies, or data analysis..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={isProcessing || !prompt.trim()}
                  sx={{ minWidth: 100 }}
                >
                  Send
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Quick prompts:
                </Typography>
                {[
                  'Analyze tech sector trends',
                  'Portfolio risk assessment',
                  'Generate investment strategy',
                  'Market volatility forecast'
                ].map((quickPrompt, index) => (
                  <Chip
                    key={index}
                    label={quickPrompt}
                    size="small"
                    onClick={() => setPrompt(quickPrompt)}
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgenticAI;
