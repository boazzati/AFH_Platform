const cron = require('node-cron');
const OutreachService = require('./outreachService');

class SequenceService {
  constructor() {
    this.outreachService = new OutreachService();
    this.activeSequences = new Map();
    this.scheduledTasks = new Map();
    this.initializeSequenceEngine();
  }

  // Initialize the sequence automation engine
  initializeSequenceEngine() {
    console.log('🔄 Initializing automated sequence engine...');
    
    // Run sequence processor every hour
    cron.schedule('0 * * * *', () => {
      this.processScheduledSequences();
    });

    // Daily sequence optimization
    cron.schedule('0 6 * * *', () => {
      this.optimizeSequences();
    });

    console.log('✅ Sequence automation engine initialized');
  }

  // Create and start an automated follow-up sequence
  async createSequence(sequenceData) {
    try {
      const {
        opportunityId,
        contactId,
        sequenceType = 'standard',
        customization = {},
        triggerConditions = {},
        originalEmail
      } = sequenceData;

      // Generate AI-powered sequence
      const sequenceResult = await this.outreachService.generateFollowUpSequence(
        originalEmail,
        { opportunityId, contactId },
        sequenceType
      );

      if (!sequenceResult.success) {
        throw new Error(`Failed to generate sequence: ${sequenceResult.error}`);
      }

      const sequence = {
        id: this.generateSequenceId(),
        opportunityId,
        contactId,
        sequenceType,
        status: 'active',
        createdAt: new Date().toISOString(),
        emails: sequenceResult.sequence.emails || [],
        customization,
        triggerConditions,
        analytics: {
          emailsSent: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          emailsReplied: 0,
          conversionEvents: []
        },
        nextEmailIndex: 0,
        lastEmailSent: null
      };

      // Store sequence
      this.activeSequences.set(sequence.id, sequence);

      // Schedule first email
      await this.scheduleNextEmail(sequence.id);

      console.log(`📧 Created sequence ${sequence.id} for opportunity ${opportunityId}`);

      return {
        success: true,
        sequenceId: sequence.id,
        sequence: sequence
      };

    } catch (error) {
      console.error('Error creating sequence:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Schedule the next email in a sequence
  async scheduleNextEmail(sequenceId) {
    try {
      const sequence = this.activeSequences.get(sequenceId);
      if (!sequence || sequence.status !== 'active') {
        return { success: false, error: 'Sequence not found or inactive' };
      }

      const nextEmail = sequence.emails[sequence.nextEmailIndex];
      if (!nextEmail) {
        // Sequence completed
        sequence.status = 'completed';
        console.log(`✅ Sequence ${sequenceId} completed`);
        return { success: true, status: 'completed' };
      }

      // Calculate send time
      const sendTime = this.calculateSendTime(sequence, nextEmail);
      
      // Schedule email
      const taskId = this.scheduleEmail(sequenceId, nextEmail, sendTime);
      
      console.log(`⏰ Scheduled email ${sequence.nextEmailIndex + 1} for sequence ${sequenceId} at ${sendTime}`);

      return {
        success: true,
        scheduledAt: sendTime,
        taskId: taskId
      };

    } catch (error) {
      console.error('Error scheduling next email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate optimal send time for email
  calculateSendTime(sequence, email) {
    const now = new Date();
    const lastSent = sequence.lastEmailSent ? new Date(sequence.lastEmailSent) : new Date(sequence.createdAt);
    
    // Add email timing (in days) to last sent date
    const daysToAdd = email.timing || 7;
    const sendDate = new Date(lastSent);
    sendDate.setDate(sendDate.getDate() + daysToAdd);

    // Optimize for business hours (9 AM - 5 PM, Tuesday-Thursday for best engagement)
    const optimizedTime = this.optimizeForBusinessHours(sendDate);
    
    return optimizedTime;
  }

  // Optimize send time for business hours and best engagement
  optimizeForBusinessHours(date) {
    const optimized = new Date(date);
    
    // Set to optimal time (10 AM)
    optimized.setHours(10, 0, 0, 0);
    
    // Avoid weekends
    const dayOfWeek = optimized.getDay();
    if (dayOfWeek === 0) { // Sunday
      optimized.setDate(optimized.getDate() + 1); // Move to Monday
    } else if (dayOfWeek === 6) { // Saturday
      optimized.setDate(optimized.getDate() + 2); // Move to Monday
    }
    
    // Prefer Tuesday-Thursday for best engagement
    if (dayOfWeek === 1) { // Monday
      optimized.setDate(optimized.getDate() + 1); // Move to Tuesday
    } else if (dayOfWeek === 5) { // Friday
      optimized.setDate(optimized.getDate() + 4); // Move to Tuesday
    }
    
    return optimized;
  }

  // Schedule individual email
  scheduleEmail(sequenceId, email, sendTime) {
    const taskId = `${sequenceId}_${Date.now()}`;
    
    // Calculate delay in milliseconds
    const delay = sendTime.getTime() - Date.now();
    
    if (delay <= 0) {
      // Send immediately if time has passed
      this.sendSequenceEmail(sequenceId, email);
      return taskId;
    }

    // Schedule for future
    const timeout = setTimeout(() => {
      this.sendSequenceEmail(sequenceId, email);
      this.scheduledTasks.delete(taskId);
    }, delay);

    this.scheduledTasks.set(taskId, {
      timeout,
      sequenceId,
      email,
      sendTime
    });

    return taskId;
  }

  // Send sequence email
  async sendSequenceEmail(sequenceId, email) {
    try {
      const sequence = this.activeSequences.get(sequenceId);
      if (!sequence) {
        console.error(`Sequence ${sequenceId} not found`);
        return;
      }

      console.log(`📤 Sending sequence email for ${sequenceId}: ${email.subject}`);

      // In a real implementation, this would integrate with email service
      // For now, we'll simulate sending and track analytics
      
      // Update sequence state
      sequence.nextEmailIndex++;
      sequence.lastEmailSent = new Date().toISOString();
      sequence.analytics.emailsSent++;

      // Add to sent emails log
      if (!sequence.sentEmails) {
        sequence.sentEmails = [];
      }
      
      sequence.sentEmails.push({
        emailIndex: sequence.nextEmailIndex - 1,
        sentAt: new Date().toISOString(),
        subject: email.subject,
        status: 'sent'
      });

      // Schedule next email if sequence continues
      if (sequence.nextEmailIndex < sequence.emails.length) {
        await this.scheduleNextEmail(sequenceId);
      } else {
        sequence.status = 'completed';
        console.log(`✅ Sequence ${sequenceId} completed`);
      }

      // Simulate engagement tracking (in real implementation, this would come from email service webhooks)
      this.simulateEngagement(sequenceId, email);

    } catch (error) {
      console.error('Error sending sequence email:', error);
    }
  }

  // Simulate email engagement for demo purposes
  simulateEngagement(sequenceId, email) {
    const sequence = this.activeSequences.get(sequenceId);
    if (!sequence) return;

    // Simulate realistic engagement rates
    setTimeout(() => {
      if (Math.random() < 0.35) { // 35% open rate
        sequence.analytics.emailsOpened++;
        console.log(`👁️ Email opened for sequence ${sequenceId}`);
        
        setTimeout(() => {
          if (Math.random() < 0.15) { // 15% click rate of opens
            sequence.analytics.emailsClicked++;
            console.log(`🖱️ Email clicked for sequence ${sequenceId}`);
            
            setTimeout(() => {
              if (Math.random() < 0.08) { // 8% reply rate of clicks
                sequence.analytics.emailsReplied++;
                console.log(`💬 Email replied for sequence ${sequenceId}`);
                
                // Stop sequence on reply
                this.pauseSequence(sequenceId, 'reply_received');
              }
            }, Math.random() * 3600000); // Random delay up to 1 hour
          }
        }, Math.random() * 1800000); // Random delay up to 30 minutes
      }
    }, Math.random() * 7200000); // Random delay up to 2 hours
  }

  // Process all scheduled sequences
  async processScheduledSequences() {
    console.log('🔄 Processing scheduled sequences...');
    
    let processedCount = 0;
    for (const [sequenceId, sequence] of this.activeSequences) {
      if (sequence.status === 'active') {
        // Check if sequence needs processing
        const needsProcessing = await this.checkSequenceNeedsProcessing(sequence);
        if (needsProcessing) {
          await this.scheduleNextEmail(sequenceId);
          processedCount++;
        }
      }
    }
    
    console.log(`📊 Processed ${processedCount} sequences`);
  }

  // Check if sequence needs processing
  async checkSequenceNeedsProcessing(sequence) {
    // Check for trigger conditions
    if (sequence.triggerConditions) {
      const conditionsMet = await this.evaluateTriggerConditions(sequence);
      if (!conditionsMet) {
        return false;
      }
    }

    // Check if next email is due
    if (sequence.nextEmailIndex >= sequence.emails.length) {
      return false; // Sequence completed
    }

    const nextEmail = sequence.emails[sequence.nextEmailIndex];
    const lastSent = sequence.lastEmailSent ? new Date(sequence.lastEmailSent) : new Date(sequence.createdAt);
    const daysSinceLastEmail = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceLastEmail >= (nextEmail.timing || 7);
  }

  // Evaluate trigger conditions
  async evaluateTriggerConditions(sequence) {
    const { triggerConditions } = sequence;
    
    // Example conditions
    if (triggerConditions.minDaysSinceLastContact) {
      const daysSince = (Date.now() - new Date(sequence.lastEmailSent || sequence.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < triggerConditions.minDaysSinceLastContact) {
        return false;
      }
    }

    if (triggerConditions.requiresNoReply && sequence.analytics.emailsReplied > 0) {
      return false;
    }

    if (triggerConditions.maxEmailsSent && sequence.analytics.emailsSent >= triggerConditions.maxEmailsSent) {
      return false;
    }

    return true;
  }

  // Optimize sequences based on performance data
  async optimizeSequences() {
    console.log('🎯 Optimizing sequence performance...');
    
    for (const [sequenceId, sequence] of this.activeSequences) {
      if (sequence.analytics.emailsSent > 0) {
        const optimization = await this.analyzeSequencePerformance(sequence);
        if (optimization.recommendations.length > 0) {
          console.log(`💡 Optimization recommendations for sequence ${sequenceId}:`, optimization.recommendations);
        }
      }
    }
  }

  // Analyze sequence performance
  async analyzeSequencePerformance(sequence) {
    const analytics = sequence.analytics;
    const openRate = analytics.emailsSent > 0 ? (analytics.emailsOpened / analytics.emailsSent) * 100 : 0;
    const clickRate = analytics.emailsOpened > 0 ? (analytics.emailsClicked / analytics.emailsOpened) * 100 : 0;
    const replyRate = analytics.emailsSent > 0 ? (analytics.emailsReplied / analytics.emailsSent) * 100 : 0;

    const recommendations = [];

    if (openRate < 25) {
      recommendations.push('Consider improving subject lines for better open rates');
    }
    
    if (clickRate < 10) {
      recommendations.push('Enhance call-to-action clarity and positioning');
    }
    
    if (replyRate < 3) {
      recommendations.push('Increase personalization and value proposition strength');
    }

    return {
      performance: {
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        replyRate: Math.round(replyRate * 100) / 100
      },
      recommendations
    };
  }

  // Pause sequence
  pauseSequence(sequenceId, reason = 'manual') {
    const sequence = this.activeSequences.get(sequenceId);
    if (sequence) {
      sequence.status = 'paused';
      sequence.pausedAt = new Date().toISOString();
      sequence.pauseReason = reason;
      
      // Cancel any scheduled tasks for this sequence
      for (const [taskId, task] of this.scheduledTasks) {
        if (task.sequenceId === sequenceId) {
          clearTimeout(task.timeout);
          this.scheduledTasks.delete(taskId);
        }
      }
      
      console.log(`⏸️ Paused sequence ${sequenceId}: ${reason}`);
      return { success: true };
    }
    
    return { success: false, error: 'Sequence not found' };
  }

  // Resume sequence
  async resumeSequence(sequenceId) {
    const sequence = this.activeSequences.get(sequenceId);
    if (sequence && sequence.status === 'paused') {
      sequence.status = 'active';
      sequence.resumedAt = new Date().toISOString();
      
      // Schedule next email
      await this.scheduleNextEmail(sequenceId);
      
      console.log(`▶️ Resumed sequence ${sequenceId}`);
      return { success: true };
    }
    
    return { success: false, error: 'Sequence not found or not paused' };
  }

  // Get sequence status
  getSequenceStatus(sequenceId) {
    const sequence = this.activeSequences.get(sequenceId);
    if (!sequence) {
      return { success: false, error: 'Sequence not found' };
    }

    return {
      success: true,
      sequence: {
        id: sequence.id,
        status: sequence.status,
        progress: {
          emailsSent: sequence.analytics.emailsSent,
          totalEmails: sequence.emails.length,
          nextEmailIndex: sequence.nextEmailIndex
        },
        analytics: sequence.analytics,
        createdAt: sequence.createdAt,
        lastEmailSent: sequence.lastEmailSent
      }
    };
  }

  // Get all active sequences
  getAllSequences() {
    const sequences = Array.from(this.activeSequences.values()).map(seq => ({
      id: seq.id,
      opportunityId: seq.opportunityId,
      contactId: seq.contactId,
      status: seq.status,
      sequenceType: seq.sequenceType,
      progress: {
        emailsSent: seq.analytics.emailsSent,
        totalEmails: seq.emails.length,
        nextEmailIndex: seq.nextEmailIndex
      },
      analytics: seq.analytics,
      createdAt: seq.createdAt,
      lastEmailSent: seq.lastEmailSent
    }));

    return {
      success: true,
      sequences,
      summary: {
        total: sequences.length,
        active: sequences.filter(s => s.status === 'active').length,
        paused: sequences.filter(s => s.status === 'paused').length,
        completed: sequences.filter(s => s.status === 'completed').length
      }
    };
  }

  // Generate unique sequence ID
  generateSequenceId() {
    return `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get sequence analytics summary
  getAnalyticsSummary() {
    const allSequences = Array.from(this.activeSequences.values());
    
    const totalEmailsSent = allSequences.reduce((sum, seq) => sum + seq.analytics.emailsSent, 0);
    const totalEmailsOpened = allSequences.reduce((sum, seq) => sum + seq.analytics.emailsOpened, 0);
    const totalEmailsClicked = allSequences.reduce((sum, seq) => sum + seq.analytics.emailsClicked, 0);
    const totalEmailsReplied = allSequences.reduce((sum, seq) => sum + seq.analytics.emailsReplied, 0);

    return {
      success: true,
      analytics: {
        totalSequences: allSequences.length,
        totalEmailsSent,
        totalEmailsOpened,
        totalEmailsClicked,
        totalEmailsReplied,
        averageOpenRate: totalEmailsSent > 0 ? Math.round((totalEmailsOpened / totalEmailsSent) * 10000) / 100 : 0,
        averageClickRate: totalEmailsOpened > 0 ? Math.round((totalEmailsClicked / totalEmailsOpened) * 10000) / 100 : 0,
        averageReplyRate: totalEmailsSent > 0 ? Math.round((totalEmailsReplied / totalEmailsSent) * 10000) / 100 : 0
      }
    };
  }
}

module.exports = SequenceService;
