const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { OpenAI } = require('openai');

class DataIngestionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.crawl4aiUrl = process.env.CRAWL4AI_API_URL;
    this.crawl4aiKey = process.env.CRAWL4AI_API_KEY;
    
    // Puppeteer configuration for Docker/Railway
    this.puppeteerConfig = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    };
    
    // Data sources for AFH market intelligence
    this.dataSources = {
      restaurantNews: [
        'https://www.restaurantbusinessonline.com',
        'https://www.qsrmagazine.com',
        'https://www.nrn.com',
        'https://www.restaurantnews.com'
      ],
      industryReports: [
        'https://www.foodservicedirector.com',
        'https://www.foodandwine.com/news',
        'https://www.eater.com'
      ],
      chainWebsites: [
        'https://www.mcdonalds.com/us/en-us/about-us/newsroom.html',
        'https://www.starbucks.com/news',
        'https://www.subway.com/en-us/explore/newsroom'
      ]
    };

    // Keywords for opportunity identification
    this.opportunityKeywords = {
      expansion: ['new location', 'opening', 'expansion', 'franchise', 'store opening'],
      menu: ['new menu', 'menu launch', 'beverage', 'drink', 'partnership', 'supplier'],
      partnership: ['partnership', 'collaboration', 'supplier', 'vendor', 'contract'],
      trends: ['trend', 'consumer preference', 'market shift', 'demand']
    };
  }

  /**
   * Get properly configured Puppeteer browser instance
   */
  async getBrowser() {
    try {
      return await puppeteer.launch(this.puppeteerConfig);
    } catch (error) {
      console.error('Failed to launch Puppeteer:', error);
      throw error;
    }
  }

  /**
   * Main data ingestion orchestrator
   */
  async ingestMarketData() {
    console.log('🚀 Starting automated market data ingestion...');
    
    try {
      const results = {
        restaurantNews: await this.scrapeRestaurantNews(),
        industryReports: await this.scrapeIndustryReports(),
        chainUpdates: await this.scrapeChainWebsites(),
        socialMedia: await this.scrapeSocialMedia()
      };

      // Process and classify the collected data
      const processedData = await this.processAndClassifyData(results);
      
      console.log('✅ Data ingestion completed successfully');
      return processedData;
    } catch (error) {
      console.error('❌ Data ingestion failed:', error);
      throw error;
    }
  }

  /**
   * Scrape restaurant industry news
   */
  async scrapeRestaurantNews() {
    console.log('📰 Scraping restaurant news...');
    const allNews = [];

    for (const url of this.dataSources.restaurantNews) {
      try {
        const articles = await this.scrapeWebsite(url, {
          extractionRules: {
            articles: {
              selector: 'article, .article-item, .news-item',
              fields: {
                title: 'h1, h2, h3, .title',
                content: '.content, .excerpt, p',
                date: '.date, time, .published',
                link: 'a@href'
              }
            }
          }
        });
        
        allNews.push(...articles);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
      }
    }

    return allNews;
  }

  /**
   * Scrape industry reports and analysis
   */
  async scrapeIndustryReports() {
    console.log('📊 Scraping industry reports...');
    const allReports = [];

    for (const url of this.dataSources.industryReports) {
      try {
        const reports = await this.scrapeWebsite(url, {
          extractionRules: {
            reports: {
              selector: '.report, .analysis, .insight',
              fields: {
                title: 'h1, h2, .title',
                summary: '.summary, .abstract, p',
                date: '.date, time',
                category: '.category, .tag'
              }
            }
          }
        });
        
        allReports.push(...reports);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
      }
    }

    return allReports;
  }

  /**
   * Scrape major chain websites for updates
   */
  async scrapeChainWebsites() {
    console.log('🏢 Scraping chain websites...');
    const allUpdates = [];

    for (const url of this.dataSources.chainWebsites) {
      try {
        const updates = await this.scrapeWebsite(url, {
          extractionRules: {
            news: {
              selector: '.news-item, .press-release, .announcement',
              fields: {
                title: 'h1, h2, h3',
                content: '.content, p',
                date: '.date, time',
                type: '.type, .category'
              }
            }
          }
        });
        
        allUpdates.push(...updates);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
      }
    }

    return allUpdates;
  }

  /**
   * Monitor social media for industry mentions
   */
  async scrapeSocialMedia() {
    console.log('📱 Monitoring social media...');
    
    // For demo purposes, return mock social media data
    // In production, this would integrate with Twitter API, LinkedIn API, etc.
    return [
      {
        platform: 'twitter',
        content: 'Excited to announce our new beverage partnership with @LocalCoffeeRoasters',
        account: '@StarbucksNews',
        date: new Date().toISOString(),
        type: 'social_media',
        category: 'partnership'
      },
      {
        platform: 'linkedin',
        content: 'Opening 50 new locations across the Northeast region this quarter',
        account: 'McDonald\'s Corporate',
        date: new Date().toISOString(),
        type: 'social_media',
        category: 'expansion'
      }
    ];
  }

  /**
   * Use Crawl4AI service for advanced web scraping
   */
  async scrapeWebsite(url, options = {}) {
    if (!this.crawl4aiUrl || !this.crawl4aiKey) {
      console.log('⚠️ Crawl4AI not configured, using fallback scraping...');
      return await this.fallbackScraping(url);
    }

    try {
      const response = await axios.post(`${this.crawl4aiUrl}/crawl`, {
        url: url,
        extraction_config: options.extractionRules || {},
        wait_for: 2000,
        remove_overlay: true,
        ...options
      }, {
        headers: {
          'Authorization': `Bearer ${this.crawl4aiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data.extracted_data || [];
    } catch (error) {
      console.error(`Crawl4AI error for ${url}:`, error.message);
      return await this.fallbackScraping(url);
    }
  }

  /**
   * Fallback scraping using Puppeteer and Cheerio
   */
  async fallbackScraping(url) {
    let browser;
    try {
      browser = await this.getBrowser();
      const page = await browser.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent('Mozilla/5.0 (compatible; AFH-Platform-Bot/1.0)');
      await page.setViewport({ width: 1280, height: 720 });
      
      // Navigate to page
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);
      const articles = [];

      // Generic article extraction
      $('article, .article, .news-item, .post').each((i, element) => {
        const $el = $(element);
        const title = $el.find('h1, h2, h3, .title').first().text().trim();
        const content = $el.find('p, .content, .excerpt').first().text().trim();
        const date = $el.find('.date, time, .published').first().text().trim();

        if (title && content) {
          articles.push({
            title,
            content: content.substring(0, 500), // Limit content length
            date,
            url: url
          });
        }
      });

      return articles;
    } catch (error) {
      console.error(`Fallback scraping error for ${url}:`, error.message);
      
      // Try simple axios fallback
      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AFH-Platform-Bot/1.0)'
          }
        });

        const $ = cheerio.load(response.data);
        const articles = [];

        $('article, .article, .news-item, .post').each((i, element) => {
          const $el = $(element);
          const title = $el.find('h1, h2, h3, .title').first().text().trim();
          const content = $el.find('p, .content, .excerpt').first().text().trim();

          if (title && content) {
            articles.push({
              title,
              content: content.substring(0, 500),
              url: url
            });
          }
        });

        return articles;
      } catch (axiosError) {
        console.error(`Axios fallback error for ${url}:`, axiosError.message);
        return [];
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Process and classify collected data using AI
   */
  async processAndClassifyData(rawData) {
    console.log('🤖 Processing and classifying data with AI...');
    
    const allData = [
      ...rawData.restaurantNews,
      ...rawData.industryReports,
      ...rawData.chainUpdates,
      ...rawData.socialMedia
    ];

    const processedOpportunities = [];

    for (const item of allData) {
      try {
        // Use AI to classify and score the opportunity
        const classification = await this.classifyOpportunity(item);
        
        if (classification.isOpportunity) {
          processedOpportunities.push({
            ...item,
            ...classification,
            processedAt: new Date().toISOString()
          });
        }
        
        // Rate limiting for AI calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error processing item:', error.message);
      }
    }

    return processedOpportunities;
  }

  /**
   * Use AI to classify if content represents a business opportunity
   */
  async classifyOpportunity(item) {
    try {
      const prompt = `
        Analyze this content for AFH (Away From Home) food and beverage business opportunities:
        
        Title: ${item.title}
        Content: ${item.content}
        
        Determine:
        1. Is this a potential business opportunity? (yes/no)
        2. What type of opportunity? (expansion, menu_innovation, partnership, supplier_change, trend)
        3. Which channel? (QSR, Fast_Casual, Coffee, Convenience, Other)
        4. Priority level? (high, medium, low)
        5. Confidence score? (0.0 to 1.0)
        6. Brief opportunity description (1-2 sentences)
        
        Respond in JSON format only.
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert in AFH food and beverage market analysis. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      const classification = JSON.parse(response);

      return {
        isOpportunity: classification.isOpportunity === 'yes',
        opportunityType: classification.opportunityType,
        channel: classification.channel,
        priority: classification.priority,
        confidence: classification.confidence,
        description: classification.description,
        aiProcessed: true
      };
    } catch (error) {
      console.error('AI classification error:', error.message);
      
      // Fallback classification based on keywords
      return this.fallbackClassification(item);
    }
  }

  /**
   * Fallback classification using keyword matching
   */
  fallbackClassification(item) {
    const content = `${item.title} ${item.content}`.toLowerCase();
    
    let opportunityType = 'other';
    let channel = 'Other';
    let priority = 'low';
    let confidence = 0.3;

    // Check for opportunity types
    if (this.opportunityKeywords.expansion.some(keyword => content.includes(keyword))) {
      opportunityType = 'expansion';
      priority = 'medium';
      confidence = 0.6;
    } else if (this.opportunityKeywords.menu.some(keyword => content.includes(keyword))) {
      opportunityType = 'menu_innovation';
      priority = 'high';
      confidence = 0.7;
    } else if (this.opportunityKeywords.partnership.some(keyword => content.includes(keyword))) {
      opportunityType = 'partnership';
      priority = 'high';
      confidence = 0.8;
    }

    // Determine channel
    if (content.includes('coffee') || content.includes('starbucks')) {
      channel = 'Coffee';
    } else if (content.includes('fast casual') || content.includes('chipotle')) {
      channel = 'Fast_Casual';
    } else if (content.includes('qsr') || content.includes('mcdonald') || content.includes('burger')) {
      channel = 'QSR';
    } else if (content.includes('convenience') || content.includes('7-eleven')) {
      channel = 'Convenience';
    }

    return {
      isOpportunity: confidence > 0.5,
      opportunityType,
      channel,
      priority,
      confidence,
      description: `${opportunityType} opportunity in ${channel} channel`,
      aiProcessed: false
    };
  }

  /**
   * Health check for the data ingestion service
   */
  async healthCheck() {
    try {
      // Test Crawl4AI connection
      let crawl4aiStatus = 'unavailable';
      if (this.crawl4aiUrl && this.crawl4aiKey) {
        try {
          await axios.get(`${this.crawl4aiUrl}/health`, {
            headers: { 'Authorization': `Bearer ${this.crawl4aiKey}` },
            timeout: 5000
          });
          crawl4aiStatus = 'connected';
        } catch (error) {
          crawl4aiStatus = 'error';
        }
      }

      // Test OpenAI connection
      let openaiStatus = 'unavailable';
      if (process.env.OPENAI_API_KEY) {
        try {
          await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5
          });
          openaiStatus = 'connected';
        } catch (error) {
          openaiStatus = 'error';
        }
      }

      // Test Puppeteer
      let puppeteerStatus = 'unavailable';
      try {
        const browser = await this.getBrowser();
        await browser.close();
        puppeteerStatus = 'connected';
      } catch (error) {
        puppeteerStatus = 'error';
      }

      return {
        status: 'healthy',
        services: {
          crawl4ai: crawl4aiStatus,
          openai: openaiStatus,
          puppeteer: puppeteerStatus
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = DataIngestionService;
