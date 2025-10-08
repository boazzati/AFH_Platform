import React, { useState, useEffect, useRef } from 'react';
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
  InputLabel,
  IconButton,
  Tooltip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
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
  Refresh,
  History,
  Bookmark,
  Share,
  ExpandMore,
  Clear,
  ContentCopy,
  Download
} from '@mui/icons-material';
import { agenticAIApi, dashboardApi } from '../services/api';

const AgenticAI = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('market-analyst');
  const [conversation, setConversation] = useState([
    { 
      role: 'ai', 
      content: 'Hello! I\'m your AFH AI assistant. I can help you with market analysis, outreach strategies, proposal generation, and competitive intelligence for the Away-From-Home channel. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [platformData, setPlatformData] = useState({
    marketSignals: [],
    projects: [],
    experts: []
  });
  const [savedPrompts, setSavedPrompts] = useState([]);
  const messagesEndRef = useRef(null);

  const aiAgents = [
    {
      id: 'market-analyst',
      name: 'Market Analyst',
      description: 'Analyzes AFH market trends and identifies account opportunities',
      capabilities: ['Trend Analysis', 'Account Identification', 'Market Forecasting'],
      color: '#1976d2',
      avatar: '📊'
    },
    {
      id: 'outreach-generator',
      name: 'Outreach Generator',
      description: 'Creates compelling outreach emails and proposals',
      capabilities: ['Email Generation', 'Proposal Writing', 'Pitch Decks'],
      color: '#2e7d32',
      avatar: '✉️'
    },
    {
      id: 'competitive-intel',
      name: 'Competitive Intelligence',
      description: 'Monitors competitors and analyzes market positioning',
      capabilities: ['Competitor Analysis', 'Market Positioning', 'SWOT Analysis'],
      color: '#d32f2f',
      avatar: '🔍'
    },
    {
      id: 'strategy-advisor',
      name: 'Strategy Advisor',
      description: 'Provides strategic guidance for AFH channel expansion',
      capabilities: ['Strategic Planning', 'Channel Strategy', 'Growth Planning'],
      color: '#7b1fa2',
      avatar: '🎯'
    }
  ];

  const quickPrompts = [
    {
      text: 'Analyze QSR beverage trends in Northeast region',
      agent: 'market-analyst',
      category: 'Market Analysis'
    },
    {
      text: 'Draft outreach email for hotel chain partnership',
      agent: 'outreach-generator',
      category: 'Outreach'
    },
    {
      text: 'Competitive analysis of energy drink placements',
      agent: 'competitive-intel',
      category: 'Competitive Intelligence'
    },
    {
      text: 'Generate proposal for campus dining contract',
      agent: 'outreach-generator',
      category: 'Proposals'
    },
    {
      text: 'Identify emerging workplace beverage trends',
      agent: 'market-analyst',
      category: 'Trend Analysis'
    },
    {
      text: 'Create strategy for healthcare channel entry',
      agent: 'strategy-advisor',
      category: 'Strategy'
    }
  ];

  const activeTasks = [
    { name: 'Market Trend Analysis', progress: 75, agent: 'Market Analyst' },
    { name: 'Proposal Generation', progress: 40, agent: 'Outreach Generator' },
    { name: 'Competitive Monitoring', progress: 90, agent: 'Competitive Intelligence' }
  ];

  useEffect(() => {
    loadPlatformData();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const loadPlatformData = async () => {
    try {
      const [signalsRes, projectsRes, expertsRes] = await dashboardApi.getOverview();
      setPlatformData({
        marketSignals: signalsRes.data || [],
        projects: projectsRes.data || [],
        experts: expertsRes.data || []
      });
    } catch (error) {
      console.error('Error loading platform data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: prompt,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Enhanced context with platform data
      const contextData = {
        marketSignals: platformData.marketSignals.length,
        activeProjects: platformData.projects.filter(p => p.status === 'active').length,
        availableExperts: platformData.experts.length,
        recentSignals: platformData.marketSignals.slice(0, 3).map(s => ({
          channel: s.channel,
          priority: s.priority,
          location: s.location
        }))
      };

      const response = await agenticAIApi.chat({
        prompt,
        agentType: selectedAgent,
        context: `Platform Context: ${JSON.stringify(contextData)}. Previous conversation: ${conversation.slice(-3).map(m => `${m.role}: ${m.content}`).join(' ')}`
      });

      const aiMessage = { 
        role: 'ai', 
        content: response.data.response,
        agent: selectedAgent,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      
      // Save to conversation history
      setConversationHistory(prev => [...prev, { userMessage, aiMessage, agent: selectedAgent }]);
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = { 
        role: 'ai', 
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  const handleQuickPrompt = (promptText, agentId) => {
    setPrompt(promptText);
    setSelectedAgent(agentId);
  };

  const handleClearConversation = () => {
    setConversation([
      { 
        role: 'ai', 
        content: 'Hello! I\'m your AFH AI assistant. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleSavePrompt = (promptText) => {
    setSavedPrompts(prev => [...prev, { text: promptText, timestamp: new Date() }]);
  };

  const selectedAgentData = aiAgents.find(agent => agent.id === selectedAgent);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agentic AI for Sales & Account Teams
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        AI-powered tools for targeting, outreach, proposal generation, and competitive intelligence
      </Typography>

      <Grid container spacing={3}>
        {/* AI Agents Selection */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Agents
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Agent</InputLabel>
                <Select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  label="Select Agent"
                >
                  {aiAgents.map(agent => (
                    <MenuItem key={agent.id} value={agent.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>{agent.avatar}</Typography>
                        {agent.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedAgentData && (
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: selectedAgentData.color, mr: 2 }}>
                        {selectedAgentData.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{selectedAgentData.name}</Typography>
                        <Chip label="active" size="small" color="success" />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedAgentData.description}
                    </Typography>
                    <Box>
                      {selectedAgentData.capabilities.map((capability, index) => (
                        <Chip
                          key={index}
                          label={capability}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Active Tasks */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Tasks
              </Typography>
              {activeTasks.map((task, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {task.name}
                    </Typography>
                    <Typography variant="caption">
                      {task.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    by {task.agent}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Description />}
                    size="small"
                  >
                    Generate Proposal
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Campaign />}
                    size="small"
                  >
                    Draft Email
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Analytics />}
                    size="small"
                  >
                    Competitive Analysis
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUp />}
                    size="small"
                  >
                    Market Report
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Conversation */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  AI Conversation - {selectedAgentData?.name}
                </Typography>
                <Box>
                  <Tooltip title="Conversation History">
                    <IconButton size="small">
                      <Badge badgeContent={conversationHistory.length} color="primary">
                        <History />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear Conversation">
                    <IconButton size="small" onClick={handleClearConversation}>
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Conversation Messages */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  height: 400, 
                  overflow: 'auto', 
                  p: 2, 
                  mb: 2,
                  backgroundColor: '#fafafa'
                }}
              >
                {conversation.map((message, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}>
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '80%',
                          backgroundColor: message.role === 'user' ? '#1976d2' : '#fff',
                          color: message.role === 'user' ? '#fff' : '#000',
                          borderRadius: message.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px'
                        }}
                      >
                        {message.role === 'ai' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '12px' }}>
                              {selectedAgentData?.avatar}
                            </Avatar>
                            <Typography variant="caption" fontWeight="bold">
                              {selectedAgentData?.name} AI
                            </Typography>
                            <Box sx={{ ml: 'auto' }}>
                              <Tooltip title="Copy Message">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleCopyMessage(message.content)}
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Save Prompt">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleSavePrompt(message.content)}
                                >
                                  <Bookmark fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        )}
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                        {message.timestamp && (
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  </Box>
                ))}
                {isProcessing && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      {selectedAgentData?.avatar}
                    </Avatar>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      {selectedAgentData?.name} is thinking...
                    </Typography>
                    <LinearProgress sx={{ flexGrow: 1 }} />
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Paper>

              {/* Input Area */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Ask ${selectedAgentData?.name} about AFH strategies, market trends, or outreach...`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isProcessing}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={!prompt.trim() || isProcessing}
                  sx={{ minWidth: 100 }}
                >
                  Send
                </Button>
              </Box>

              {/* Quick Prompts */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quick prompts:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {quickPrompts.map((quickPrompt, index) => (
                    <Chip
                      key={index}
                      label={quickPrompt.text}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickPrompt(quickPrompt.text, quickPrompt.agent)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Platform Context */}
          {platformData.marketSignals.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Platform Context Available</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Market Signals: {platformData.marketSignals.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Active Projects: {platformData.projects.filter(p => p.status === 'active').length}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Available Experts: {platformData.experts.length}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      AI responses are enhanced with real-time platform data for more contextual insights.
                    </Alert>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgenticAI;
