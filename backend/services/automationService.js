const cron = require('node-cron');
const DataIngestionService = require('./dataIngestionService');
const DataProcessingService = require('./dataProcessingService');
const mongoose = require('mongoose');

class AutomationService {
  constructor() {
    this.dataIngestionService = new DataIngestionService();
    this.dataProcessingService = new DataProcessingService();
    this.isRunning = false;
    this.scheduledTasks = new Map();
    this.metrics = {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      lastRunTime: null,
      lastSuccessTime: null,
      averageProcessingTime: 0,
      opportunitiesProcessed: 0
    };

    // Automation configuration
    this.config = {
      schedules: {
        // High-frequency monitoring for urgent opportunities
        urgent: '*/15 * * * *', // Every 15 minutes
        // Regular monitoring for general opportunities
        regular: '0 */2 * * *', // Every 2 hours
        // Deep analysis for comprehensive reports
        deep: '0 6 * * *', // Daily at 6 AM
        // Weekly comprehensive analysis
        weekly: '0 6 * * 0', // Sundays at 6 AM
        // Health check
        healthCheck: '*/5 * * * *' // Every 5 minutes
      },
      retryConfig: {
        maxRetries: 3,
        retryDelay: 5000, // 5 seconds
        backoffMultiplier: 2
      },
      alerting: {
        enabled: true,
        thresholds: {
          failureRate: 0.3, // Alert if 30% of runs fail
          processingTime: 300000, // Alert if processing takes > 5 minutes
          noDataThreshold: 24 * 60 * 60 * 1000 // Alert if no data for 24 hours
        }
      }
    };
  }

  /**
   * Start the automation service
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Automation service is already running');
      return;
    }

    console.log('🚀 Starting AFH Platform Automation Service...');
    
    try {
      // Initialize scheduled tasks
      await this.initializeScheduledTasks();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      // Load existing metrics
      await this.loadMetrics();
      
      this.isRunning = true;
      console.log('✅ Automation service started successfully');
      
      // Run initial data collection
      await this.runInitialCollection();
      
    } catch (error) {
      console.error('❌ Failed to start automation service:', error);
      throw error;
    }
  }

  /**
   * Stop the automation service
   */
  async stop() {
    if (!this.isRunning) {
      console.log('⚠️ Automation service is not running');
      return;
    }

    console.log('🛑 Stopping AFH Platform Automation Service...');
    
    // Stop all scheduled tasks
    this.scheduledTasks.forEach((task, name) => {
      task.stop();
      console.log(`Stopped task: ${name}`);
    });
    
    this.scheduledTasks.clear();
    this.isRunning = false;
    
    // Save final metrics
    await this.saveMetrics();
    
    console.log('✅ Automation service stopped successfully');
  }

  /**
   * Initialize all scheduled tasks
   */
  async initializeScheduledTasks() {
    // Urgent monitoring - every 15 minutes
    const urgentTask = cron.schedule(this.config.schedules.urgent, async () => {
      await this.runDataCollection('urgent');
    }, { scheduled: false });
    
    // Regular monitoring - every 2 hours
    const regularTask = cron.schedule(this.config.schedules.regular, async () => {
      await this.runDataCollection('regular');
    }, { scheduled: false });
    
    // Deep analysis - daily
    const deepTask = cron.schedule(this.config.schedules.deep, async () => {
      await this.runDataCollection('deep');
    }, { scheduled: false });
    
    // Weekly comprehensive analysis
    const weeklyTask = cron.schedule(this.config.schedules.weekly, async () => {
      await this.runWeeklyAnalysis();
    }, { scheduled: false });
    
    // Health check - every 5 minutes
    const healthTask = cron.schedule(this.config.schedules.healthCheck, async () => {
      await this.performHealthCheck();
    }, { scheduled: false });

    // Store tasks
    this.scheduledTasks.set('urgent', urgentTask);
    this.scheduledTasks.set('regular', regularTask);
    this.scheduledTasks.set('deep', deepTask);
    this.scheduledTasks.set('weekly', weeklyTask);
    this.scheduledTasks.set('health', healthTask);

    // Start all tasks
    this.scheduledTasks.forEach((task, name) => {
      task.start();
      console.log(`✅ Started scheduled task: ${name}`);
    });
  }

  /**
   * Run data collection with specified mode
   */
  async runDataCollection(mode = 'regular') {
    const startTime = Date.now();
    console.log(`🔄 Starting ${mode} data collection...`);
    
    try {
      this.metrics.totalRuns++;
      
      // Step 1: Ingest raw data
      const rawOpportunities = await this.dataIngestionService.ingestMarketData();
      console.log(`📥 Ingested ${rawOpportunities.length} raw opportunities`);
      
      // Step 2: Process and enhance data
      const processedOpportunities = await this.dataProcessingService.processIngestedData(rawOpportunities);
      console.log(`🔄 Processed ${processedOpportunities.length} opportunities`);
      
      // Step 3: Store in database
      const storedCount = await this.storeOpportunities(processedOpportunities, mode);
      console.log(`💾 Stored ${storedCount} new opportunities`);
      
      // Step 4: Update metrics
      const processingTime = Date.now() - startTime;
      await this.updateMetrics(true, processingTime, processedOpportunities.length);
      
      // Step 5: Generate alerts if needed
      await this.checkAndGenerateAlerts(processedOpportunities);
      
      console.log(`✅ ${mode} data collection completed in ${processingTime}ms`);
      
      return {
        success: true,
        mode,
        rawCount: rawOpportunities.length,
        processedCount: processedOpportunities.length,
        storedCount,
        processingTime
      };
      
    } catch (error) {
      console.error(`❌ ${mode} data collection failed:`, error);
      await this.updateMetrics(false, Date.now() - startTime, 0);
      await this.handleCollectionError(error, mode);
      throw error;
    }
  }

  /**
   * Store processed opportunities in database
   */
  async storeOpportunities(opportunities, mode) {
    let storedCount = 0;
    
    for (const opportunity of opportunities) {
      try {
        // Check if opportunity already exists
        const existing = await mongoose.connection.db
          .collection('market-signals')
          .findOne({ contentHash: opportunity.contentHash });
        
        if (!existing) {
          // Store new opportunity
          await mongoose.connection.db
            .collection('market-signals')
            .insertOne({
              ...opportunity,
              collectionMode: mode,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          storedCount++;
        } else {
          // Update existing opportunity with new analysis
          await mongoose.connection.db
            .collection('market-signals')
            .updateOne(
              { contentHash: opportunity.contentHash },
              {
                $set: {
                  ...opportunity,
                  updatedAt: new Date(),
                  lastCollectionMode: mode
                }
              }
            );
        }
      } catch (error) {
        console.error('Error storing opportunity:', error);
      }
    }
    
    return storedCount;
  }

  /**
   * Run weekly comprehensive analysis
   */
  async runWeeklyAnalysis() {
    console.log('📊 Starting weekly comprehensive analysis...');
    
    try {
      // Get all opportunities from the past week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklyOpportunities = await mongoose.connection.db
        .collection('market-signals')
        .find({ createdAt: { $gte: weekAgo } })
        .toArray();
      
      // Generate weekly insights
      const insights = await this.generateWeeklyInsights(weeklyOpportunities);
      
      // Store weekly report
      await mongoose.connection.db
        .collection('weekly-reports')
        .insertOne({
          reportDate: new Date(),
          period: { start: weekAgo, end: new Date() },
          opportunityCount: weeklyOpportunities.length,
          insights,
          metrics: this.metrics,
          createdAt: new Date()
        });
      
      console.log('✅ Weekly analysis completed');
      
    } catch (error) {
      console.error('❌ Weekly analysis failed:', error);
    }
  }

  /**
   * Generate weekly insights from opportunities
   */
  async generateWeeklyInsights(opportunities) {
    const insights = {
      totalOpportunities: opportunities.length,
      channelBreakdown: {},
      priorityBreakdown: {},
      averageConfidence: 0,
      topSources: {},
      trendingKeywords: [],
      recommendations: []
    };

    // Channel breakdown
    opportunities.forEach(opp => {
      insights.channelBreakdown[opp.channel] = (insights.channelBreakdown[opp.channel] || 0) + 1;
    });

    // Priority breakdown
    opportunities.forEach(opp => {
      insights.priorityBreakdown[opp.priority] = (insights.priorityBreakdown[opp.priority] || 0) + 1;
    });

    // Average confidence
    if (opportunities.length > 0) {
      insights.averageConfidence = opportunities.reduce((sum, opp) => sum + (opp.confidence || 0), 0) / opportunities.length;
    }

    // Top sources
    opportunities.forEach(opp => {
      insights.topSources[opp.source] = (insights.topSources[opp.source] || 0) + 1;
    });

    // Generate recommendations
    insights.recommendations = this.generateWeeklyRecommendations(insights);

    return insights;
  }

  /**
   * Generate weekly recommendations based on insights
   */
  generateWeeklyRecommendations(insights) {
    const recommendations = [];

    // High priority opportunities
    if (insights.priorityBreakdown.high > 0) {
      recommendations.push(`Focus on ${insights.priorityBreakdown.high} high-priority opportunities this week`);
    }

    // Channel focus
    const topChannel = Object.entries(insights.channelBreakdown)
      .sort(([,a], [,b]) => b - a)[0];
    if (topChannel) {
      recommendations.push(`${topChannel[0]} channel shows highest activity with ${topChannel[1]} opportunities`);
    }

    // Confidence levels
    if (insights.averageConfidence < 60) {
      recommendations.push('Consider additional data validation - average confidence is below 60%');
    }

    return recommendations;
  }

  /**
   * Perform health check
   */
  async performHealthCheck() {
    try {
      // Check database connectivity
      const dbStatus = await this.checkDatabaseHealth();
      
      // Check API services
      const apiStatus = await this.checkAPIHealth();
      
      // Check recent data freshness
      const dataFreshness = await this.checkDataFreshness();
      
      // Update health metrics
      const healthStatus = {
        timestamp: new Date(),
        database: dbStatus,
        apis: apiStatus,
        dataFreshness,
        overallHealth: dbStatus.healthy && apiStatus.healthy && dataFreshness.healthy
      };

      // Store health status
      await mongoose.connection.db
        .collection('health-checks')
        .insertOne(healthStatus);

      // Alert if unhealthy
      if (!healthStatus.overallHealth) {
        await this.generateHealthAlert(healthStatus);
      }

    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  /**
   * Check database health
   */
  async checkDatabaseHealth() {
    try {
      await mongoose.connection.db.admin().ping();
      return { healthy: true, message: 'Database connection OK' };
    } catch (error) {
      return { healthy: false, message: `Database error: ${error.message}` };
    }
  }

  /**
   * Check API health
   */
  async checkAPIHealth() {
    const apiChecks = {
      openai: false,
      crawl4ai: false
    };

    // Check OpenAI
    try {
      if (process.env.OPENAI_API_KEY) {
        apiChecks.openai = true;
      }
    } catch (error) {
      console.error('OpenAI health check failed:', error);
    }

    // Check Crawl4AI
    try {
      if (process.env.CRAWL4AI_API_URL && process.env.CRAWL4AI_API_KEY) {
        apiChecks.crawl4ai = true;
      }
    } catch (error) {
      console.error('Crawl4AI health check failed:', error);
    }

    return {
      healthy: Object.values(apiChecks).every(status => status),
      details: apiChecks
    };
  }

  /**
   * Check data freshness
   */
  async checkDataFreshness() {
    try {
      const recentData = await mongoose.connection.db
        .collection('market-signals')
        .findOne(
          {},
          { sort: { createdAt: -1 } }
        );

      if (!recentData) {
        return { healthy: false, message: 'No data found' };
      }

      const dataAge = Date.now() - new Date(recentData.createdAt).getTime();
      const isHealthy = dataAge < this.config.alerting.thresholds.noDataThreshold;

      return {
        healthy: isHealthy,
        lastDataTime: recentData.createdAt,
        ageHours: Math.round(dataAge / (1000 * 60 * 60))
      };
    } catch (error) {
      return { healthy: false, message: `Data freshness check failed: ${error.message}` };
    }
  }

  /**
   * Update metrics
   */
  async updateMetrics(success, processingTime, opportunitiesCount) {
    if (success) {
      this.metrics.successfulRuns++;
      this.metrics.lastSuccessTime = new Date();
    } else {
      this.metrics.failedRuns++;
    }

    this.metrics.lastRunTime = new Date();
    this.metrics.opportunitiesProcessed += opportunitiesCount;
    
    // Update average processing time
    const totalRuns = this.metrics.successfulRuns + this.metrics.failedRuns;
    this.metrics.averageProcessingTime = 
      (this.metrics.averageProcessingTime * (totalRuns - 1) + processingTime) / totalRuns;

    await this.saveMetrics();
  }

  /**
   * Save metrics to database
   */
  async saveMetrics() {
    try {
      await mongoose.connection.db
        .collection('automation-metrics')
        .replaceOne(
          { _id: 'current' },
          { _id: 'current', ...this.metrics, updatedAt: new Date() },
          { upsert: true }
        );
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  /**
   * Load metrics from database
   */
  async loadMetrics() {
    try {
      const savedMetrics = await mongoose.connection.db
        .collection('automation-metrics')
        .findOne({ _id: 'current' });

      if (savedMetrics) {
        this.metrics = { ...this.metrics, ...savedMetrics };
        delete this.metrics._id;
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  }

  /**
   * Check and generate alerts
   */
  async checkAndGenerateAlerts(opportunities) {
    if (!this.config.alerting.enabled) return;

    const alerts = [];

    // High priority opportunities
    const highPriorityCount = opportunities.filter(opp => opp.priority === 'high').length;
    if (highPriorityCount > 0) {
      alerts.push({
        type: 'high_priority_opportunities',
        message: `${highPriorityCount} high-priority opportunities detected`,
        count: highPriorityCount,
        timestamp: new Date()
      });
    }

    // Low confidence opportunities
    const lowConfidenceCount = opportunities.filter(opp => opp.confidence < 50).length;
    if (lowConfidenceCount > opportunities.length * 0.5) {
      alerts.push({
        type: 'low_confidence_data',
        message: `${lowConfidenceCount} opportunities have low confidence scores`,
        count: lowConfidenceCount,
        timestamp: new Date()
      });
    }

    // Store alerts
    if (alerts.length > 0) {
      await mongoose.connection.db
        .collection('automation-alerts')
        .insertMany(alerts);
      
      console.log(`🚨 Generated ${alerts.length} alerts`);
    }
  }

  /**
   * Handle collection errors
   */
  async handleCollectionError(error, mode) {
    const errorAlert = {
      type: 'collection_error',
      mode,
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    };

    try {
      await mongoose.connection.db
        .collection('automation-alerts')
        .insertOne(errorAlert);
    } catch (dbError) {
      console.error('Failed to store error alert:', dbError);
    }
  }

  /**
   * Generate health alert
   */
  async generateHealthAlert(healthStatus) {
    const alert = {
      type: 'health_alert',
      message: 'System health check failed',
      details: healthStatus,
      timestamp: new Date()
    };

    try {
      await mongoose.connection.db
        .collection('automation-alerts')
        .insertOne(alert);
      
      console.log('🚨 Health alert generated');
    } catch (error) {
      console.error('Failed to generate health alert:', error);
    }
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring() {
    console.log('💓 Health monitoring started');
  }

  /**
   * Run initial data collection
   */
  async runInitialCollection() {
    console.log('🎯 Running initial data collection...');
    try {
      await this.runDataCollection('initial');
    } catch (error) {
      console.error('Initial collection failed:', error);
    }
  }

  /**
   * Get automation status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeTasks: Array.from(this.scheduledTasks.keys()),
      metrics: this.metrics,
      config: this.config
    };
  }

  /**
   * Manual trigger for data collection
   */
  async triggerCollection(mode = 'manual') {
    if (!this.isRunning) {
      throw new Error('Automation service is not running');
    }
    
    return await this.runDataCollection(mode);
  }
}

module.exports = AutomationService;
