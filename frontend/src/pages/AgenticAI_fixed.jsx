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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Download,
  Add,
  Person
} from '@mui/icons-material';
import api from '../services/api';

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
  const [error, setError] = useState(null);
  const [showExpertDialog, setShowExpertDialog] = useState(false);
  const [newExpert, setNewExpert] = useState({
    name: '',
    expertise: '',
    experience: '',
    location: '',
    availability: 'available'
  });
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
      // Load platform data with error handling
      const marketSignals = await api.get('/api/market-signals').catch(() => ({ data: [] }));
      const projects = await api.get('/api/projects').catch(() => ({ data: [] }));
      const experts = await api.get('/api/experts').catch(() => ({ data: [] }));
      
      setPlatformData({
        marketSignals: marketSignals.data || [],
        projects: projects.data || [],
        experts: experts.data || []
      });
    } catch (error) {
      console.error('Error loading platform data:', error);
      setError('Failed to load platform data');
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
    setError(null);

    try {
      // Enhanced context with platform data
      const contextData = {
        marketSignals: platformData.marketSignals.length,
        activeProjects: platformData.projects.filter(p => p.status === 'active').length,
        availableExperts: platformData.experts.length,
        recentSignals: platformData.marketSignals.slice(0, 3).map(s => ({
          channel: s.channel || 'Unknown',
          priority: s.priority || 'Medium',
          location: s.location || 'Unknown'
        }))
      };

      const response = await api.post('/api/ai/chat', {
        prompt,
        agentType: selectedAgent,
        context: `Platform Context: ${JSON.stringify(contextData)}. Previous conversation: ${conversation.slice(-3).map(m => `${m.role}: ${m.content}`).join(' ')}`
      });

      const aiMessage = { 
        role: 'ai', 
        content: response.data.response || 'I received your message and I\'m processing it. Here\'s my analysis based on the current AFH market data...',
        agent: selectedAgent,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      
      // Save to conversation history
      setConversationHistory(prev => [...prev, { userMessage, aiMessage, agent: selectedAgent }]);
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      let errorMessage = 'I apologize, but I encountered an error processing your request. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Please check your input and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Our team has been notified.';
      }
      
      const aiErrorMessage = { 
        role: 'ai', 
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      };
      setConversation(prev => [...prev, aiErrorMessage]);
      setError('Failed to get AI response');
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
    setError(null);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleSavePrompt = (promptText) => {
    setSavedPrompts(prev => [...prev, { text: promptText, timestamp: new Date() }]);
  };

  const handleAddExpert = async () => {
    try {
      const response = await api.post('/api/experts', newExpert);
      setPlatformData(prev => ({
        ...prev,
        experts: [...prev.experts, response.data]
      }));
      setShowExpertDialog(false);
      setNewExpert({
        name: '',
        expertise: '',
        experience: '',
        location: '',
        availability: 'available'
      });
    } catch (error) {
      console.error('Error adding expert:', error);
      setError('Failed to add expert');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedAgentData = aiAgents.find(agent => agent.id === selectedAgent);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with gradient background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
          mb: 3,
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Agentic AI for Sales & Account Teams
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          AI-powered tools for targeting, outreach, proposal generation, and competitive intelligence
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* AI Agents Selection */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
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
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
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
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
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
                    onClick={() => handleQuickPrompt('Generate a comprehensive proposal for a new AFH partnership', 'outreach-generator')}
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
                    onClick={() => handleQuickPrompt('Draft a personalized outreach email for a potential client', 'outreach-generator')}
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
                    onClick={() => handleQuickPrompt('Analyze competitive landscape in the AFH beverage market', 'competitive-intel')}
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
                    onClick={() => handleQuickPrompt('Generate market trend report for AFH channels', 'market-analyst')}
                  >
                    Market Report
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    size="small"
                    onClick={() => setShowExpertDialog(true)}
                  >
                    Add Expert
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Conversation */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  AI Conversation - {selectedAgentData?.name}
                </Typography>
                <Box>
                  <Tooltip title="Conversation History">
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <Badge badgeContent={conversationHistory.length} color="error">
                        <History />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear Conversation">
                    <IconButton size="small" onClick={handleClearConversation} sx={{ color: 'white' }}>
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
                          backgroundColor: message.role === 'user' ? '#1976d2' : message.isError ? '#ffebee' : '#fff',
                          color: message.role === 'user' ? '#fff' : message.isError ? '#d32f2f' : '#000',
                          borderRadius: message.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                          border: message.isError ? '1px solid #f44336' : 'none'
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '12px' }}>
                          {selectedAgentData?.avatar}
                        </Avatar>
                        <Typography variant="body2">
                          {selectedAgentData?.name} is thinking...
                        </Typography>
                        <LinearProgress sx={{ ml: 2, width: 100 }} />
                      </Box>
                    </Paper>
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
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${selectedAgentData?.name} anything about AFH market intelligence...`}
                  variant="outlined"
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 1
                  }}
                  disabled={isProcessing}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!prompt.trim() || isProcessing}
                  sx={{ 
                    minWidth: 60,
                    backgroundColor: 'white',
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <Send />
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Prompts */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Prompts
              </Typography>
              <Grid container spacing={1}>
                {quickPrompts.map((quickPrompt, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickPrompt(quickPrompt.text, quickPrompt.agent)}
                      sx={{ 
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        p: 1
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {quickPrompt.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {quickPrompt.text}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Expert Dialog */}
      <Dialog open={showExpertDialog} onClose={() => setShowExpertDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Expert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expert Name"
                value={newExpert.name}
                onChange={(e) => setNewExpert(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expertise Area"
                value={newExpert.expertise}
                onChange={(e) => setNewExpert(prev => ({ ...prev, expertise: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                value={newExpert.experience}
                onChange={(e) => setNewExpert(prev => ({ ...prev, experience: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={newExpert.location}
                onChange={(e) => setNewExpert(prev => ({ ...prev, location: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={newExpert.availability}
                  onChange={(e) => setNewExpert(prev => ({ ...prev, availability: e.target.value }))}
                  label="Availability"
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="busy">Busy</MenuItem>
                  <MenuItem value="unavailable">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExpertDialog(false)}>Cancel</Button>
          <Button onClick={handleAddExpert} variant="contained">Add Expert</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgenticAI;
