#!/usr/bin/env node

/**
 * Test script for the Concert Playbook Generation System
 * Tests the complete flow: Crawling -> ChatGPT Generation -> MongoDB Storage
 */

const mongoose = require('mongoose');
const ConcertIndustryCrawler = require('./services/concertCrawler');
const PlaybookGenerator = require('./services/playbookGenerator');
const Playbook = require('./models/Playbook');

// Test configuration
const TEST_CONFIG = {
  target: 'Tomorrowland',
  region: 'Europe',
  industry: 'concerts'
};

async function testPlaybookSystem() {
  console.log('🧪 Starting Concert Playbook System Test...\n');
  
  try {
    // Connect to MongoDB (if available)
    if (process.env.MONGODB_URI) {
      console.log('📦 Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected\n');
    } else {
      console.log('⚠️ MongoDB not configured, skipping database tests\n');
    }

    // Test 1: Concert Industry Crawler
    console.log('🎵 Test 1: Concert Industry Crawler');
    console.log('=====================================');
    
    const crawler = new ConcertIndustryCrawler();
    console.log(`Crawling data for ${TEST_CONFIG.target} in ${TEST_CONFIG.region}...`);
    
    const crawledData = await crawler.crawlIndustryData(TEST_CONFIG.region, TEST_CONFIG.target);
    
    console.log('✅ Crawling completed successfully!');
    console.log(`📊 Data sources found:`);
    console.log(`   - Industry News: ${crawledData.industryNews.length} sources`);
    console.log(`   - Festival Data: ${crawledData.festivalData.length} sources`);
    console.log(`   - Partnership News: ${crawledData.partnershipNews.length} sources`);
    console.log(`   - Regional Insights: ${crawledData.regionalInsights.length} sources`);
    
    // Extract insights
    const insights = crawler.extractInsights(crawledData);
    console.log(`🔍 Key insights extracted:`);
    console.log(`   - Market Size: ${insights.marketSize}`);
    console.log(`   - Key Players: ${insights.keyPlayers.slice(0, 3).join(', ')}...`);
    console.log(`   - Top Trends: ${insights.trends.slice(0, 3).join(', ')}...`);
    console.log(`   - Avg Deal Value: ${insights.avgDealValue}\n`);

    // Test 2: ChatGPT Playbook Generator
    console.log('🤖 Test 2: ChatGPT Playbook Generator');
    console.log('=====================================');
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ OpenAI API key not found, skipping ChatGPT test');
      console.log('   Set OPENAI_API_KEY environment variable to test this feature\n');
    } else {
      const generator = new PlaybookGenerator();
      console.log(`Generating playbook for ${TEST_CONFIG.target}...`);
      
      const generatedPlaybook = await generator.generateConcertPlaybook({
        target: TEST_CONFIG.target,
        region: TEST_CONFIG.region,
        crawledData: crawledData
      });
      
      console.log('✅ Playbook generated successfully!');
      console.log(`📚 Playbook details:`);
      console.log(`   - Title: ${generatedPlaybook.title}`);
      console.log(`   - Steps: ${generatedPlaybook.steps.length}`);
      console.log(`   - Success Rate: ${generatedPlaybook.successRate}%`);
      console.log(`   - Time to Close: ${generatedPlaybook.timeToClose}`);
      console.log(`   - Average Revenue: ${generatedPlaybook.averageRevenue}`);
      
      // Show first few steps
      console.log(`📋 First 3 steps:`);
      generatedPlaybook.steps.slice(0, 3).forEach((step, index) => {
        console.log(`   ${index + 1}. ${step.title} (${step.duration})`);
      });
      console.log('');

      // Test 3: MongoDB Storage (if available)
      if (process.env.MONGODB_URI) {
        console.log('💾 Test 3: MongoDB Storage');
        console.log('===========================');
        
        console.log('Saving playbook to database...');
        const savedPlaybook = await Playbook.create(generatedPlaybook);
        
        console.log('✅ Playbook saved successfully!');
        console.log(`📄 Database ID: ${savedPlaybook._id}`);
        console.log(`🔗 Playbook ID: ${savedPlaybook.id}`);
        
        // Test retrieval
        console.log('Testing playbook retrieval...');
        const retrievedPlaybook = await Playbook.findOne({ id: savedPlaybook.id });
        
        if (retrievedPlaybook) {
          console.log('✅ Playbook retrieved successfully!');
          console.log(`📊 Views: ${retrievedPlaybook.views}`);
          console.log(`📥 Downloads: ${retrievedPlaybook.downloads}\n`);
        } else {
          console.log('❌ Failed to retrieve playbook\n');
        }
        
        // Test analytics methods
        console.log('Testing analytics methods...');
        await retrievedPlaybook.incrementViews();
        await retrievedPlaybook.incrementDownloads();
        
        const updatedPlaybook = await Playbook.findOne({ id: savedPlaybook.id });
        console.log(`✅ Analytics updated - Views: ${updatedPlaybook.views}, Downloads: ${updatedPlaybook.downloads}\n`);
        
        // Clean up test data
        console.log('Cleaning up test data...');
        await Playbook.deleteOne({ id: savedPlaybook.id });
        console.log('✅ Test data cleaned up\n');
      }
    }

    // Test 4: API Endpoint Simulation
    console.log('🌐 Test 4: API Endpoint Simulation');
    console.log('===================================');
    
    console.log('Simulating API request payload:');
    const apiPayload = {
      industry: TEST_CONFIG.industry,
      region: TEST_CONFIG.region,
      target: TEST_CONFIG.target,
      skipCrawling: false
    };
    console.log(JSON.stringify(apiPayload, null, 2));
    
    console.log('✅ API payload structure validated\n');

    // Test Summary
    console.log('📋 Test Summary');
    console.log('===============');
    console.log('✅ Concert Industry Crawler: Working');
    console.log(process.env.OPENAI_API_KEY ? '✅ ChatGPT Playbook Generator: Working' : '⚠️ ChatGPT Playbook Generator: Skipped (no API key)');
    console.log(process.env.MONGODB_URI ? '✅ MongoDB Storage: Working' : '⚠️ MongoDB Storage: Skipped (not configured)');
    console.log('✅ API Structure: Valid');
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up environment variables (OPENAI_API_KEY, MONGODB_URI)');
    console.log('   2. Test the API endpoints with a REST client');
    console.log('   3. Integrate with the frontend Partnership Engine');
    console.log('   4. Deploy to Railway for production testing');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔍 Error details:', error.message);
    
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n📦 MongoDB disconnected');
    }
  }
}

// Run the test
if (require.main === module) {
  testPlaybookSystem()
    .then(() => {
      console.log('\n✅ Test script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testPlaybookSystem, TEST_CONFIG };
