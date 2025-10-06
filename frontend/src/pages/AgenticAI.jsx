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
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  SmartToy,
  Send,
  AutoAwesome,
  Psychology,
  Analytics,
  TrendingUp,
  Description,
  Campaign,
  Refresh
} from '@mui/icons-material';
import { agenticAIApi } from '../services/api';

const AgenticAI = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('market-analyst');
  const [conversation, setConversation] = useState([
    { 
      role: 'ai', 
      content: 'Hello! I\'m your AFH AI assistant. I can help you with market analysis, outreach strategies, proposal generation, and competitive intelligence for the Away-From-Home channel. How can I assist you today?' 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const aiAgents = [
    {
      id: 'market-analyst',
      name: 'Market Analyst',
      description: 'Analyzes AFH market trends and identifies account opportunities',
      status: 'active',
      capabilities: ['Trend Analysis', 'Account Identification', 'Market Forecasting'],
      avatar: <TrendingUp />
    },
    {
      id: 'outreach-generator',
      name: 'Outreach Generator',
      description: 'Creates personalized outreach and proposal content',
      status: 'active',
      capabilities: ['Proposal Drafting', 'Email Templates', 'Pitch Decks'],
      avatar: <Campaign />
    },
    {
      id: 'competitive-intel',
      name: 'Competitive Intelligence',
      description: 'Monitors competitor activities and market positioning',
      status: 'active',
      capabilities: ['Competitor Tracking', 'Price Analysis', 'Win/Loss Analysis'],
      avatar: <Analytics />
    },
    {
      id: 'strategy-advisor',
      name: 'Strategy Advisor',
      description: 'Recommends AFH channel strategies and playbooks',
      status: 'developing',
      capabilities: ['Strategy Formulation', 'Playbook Recommendations', 'Performance Optimization'],
      avatar: <Psychology />
    }
  ];

  const quickPrompts = [
    'Analyze QSR beverage trends in Northeast region',
    'Draft outreach email for hotel chain partnership',
    'Competitive analysis of energy drink placements',
    'Generate proposal for campus dining contract'
  ];

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setConversation(prev => [...prev, userMessage]);
    setPrompt('');
    setIsProcessing(true);

    try {
      const response = await agenticAIApi.chat({
        prompt,
        context: `User is asking about AFH channel strategies. Current agent: ${currentAgent?.name}`,
        agentType: selectedAgent
      });

      // Fixed: Use response.data directly instead of response.data.response
      const aiResponse = {
        role: 'ai',
        content: response.data.response || response.data
      };
      
      setConversation(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorResponse = {
        role: 'ai',
        content: `I apologize, but I encountered an error: ${error.response?.data?.message || error.message}. Please try again.`
      };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentAgent = aiAgents.find(agent => agent.id === selectedAgent);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agentic AI for Sales & Account Teams
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        AI-powered tools for targeting, outreach, proposal generation, and competitive intelligence
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Agents
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Agent</InputLabel>
                <Select
                  value={selectedAgent}
                  label="Select Agent"
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  {aiAgents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {currentAgent && (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {currentAgent.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{currentAgent.name}</Typography>
                        <Chip 
                          label={currentAgent.status} 
                          size="small" 
                          color={currentAgent.status === 'active' ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {currentAgent.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {currentAgent.capabilities.map((capability, index) => (
                        <Chip key={index} label={capability} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Active Tasks
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { task: 'Market Trend Analysis', progress: 75, agent: 'Market Analyst' },
                  { task: 'Proposal Generation', progress: 40, agent: 'Outreach Generator' },
                  { task: 'Competitive Monitoring', progress: 90, agent: 'Competitive Intelligence' }
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

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Description />}
                  onClick={() => handleQuickPrompt('Generate a comprehensive proposal for a new beverage line in hotel chains')}
                >
                  Generate Proposal
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Campaign />}
                  onClick={() => handleQuickPrompt('Draft an outreach email for restaurant chain partnership')}
                >
                  Draft Outreach Email
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Analytics />}
                  onClick={() => handleQuickPrompt('Provide competitive analysis of energy drink market in convenience stores')}
                >
                  Competitive Analysis
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<TrendingUp />}
                  onClick={() => handleQuickPrompt('Generate market report for QSR beverage trends')}
                >
                  Market Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                AI Conversation - {currentAgent?.name}
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
                          {message.role === 'ai' ? `${currentAgent?.name} AI` : 'You'}
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
                  placeholder={`Ask ${currentAgent?.name} about AFH strategies, market trends, or outreach...`}
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
                {quickPrompts.map((quickPrompt, index) => (
                  <Chip
                    key={index}
                    label={quickPrompt}
                    size="small"
                    onClick={() => handleQuickPrompt(quickPrompt)}
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
