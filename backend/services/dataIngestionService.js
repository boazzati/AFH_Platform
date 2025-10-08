const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');

class DataIngestionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.crawl4aiUrl = process.env.CRAWL4AI_API_URL;
    this.crawl4aiKey = process.env.CRAWL4AI_API_KEY;
    
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
   * Main data ingestion orchestrator
   */
  async ingestMarketData() {
    console.log('🚀 Starting automated market data ingestion...');
    
    try {
      const results = {
        restaurantNews: await this.scrapeRestaurantNews(),
        industryReports: await this.scrapeIndustryReports(),
        chainUpdates: await this.scrapeChainWebsites(),
        socialMedia: await this.scrapeSocialMedia(),
        timestamp: new Date().toISOString()
      };

      // Process and classify the collected data
      const processedData = await this.processAndClassifyData(results);
      
      console.log(`✅ Data ingestion completed. Processed ${processedData.length} opportunities`);
      return processedData;
      
    } catch (error) {
      console.error('❌ Error in data ingestion:', error);
      throw error;
    }
  }

  /**
   * Scrape restaurant industry news for opportunities
   */
  async scrapeRestaurantNews() {
    console.log('📰 Scraping restaurant industry news...');
    const newsData = [];

    for (const source of this.dataSources.restaurantNews) {
      try {
        const articles = await this.scrapeWebsite(source, {
          extractionRules: {
            articles: {
              selector: 'article, .article, .news-item',
              fields: {
                title: 'h1, h2, h3, .title',
                content: '.content, .article-body, p',
                date: '.date, .published, time',
                url: 'a@href'
              }
            }
          }
        });

        // Filter articles for AFH opportunities
        const relevantArticles = articles.filter(article => 
          this.containsOpportunityKeywords(article.title + ' ' + article.content)
        );

        newsData.push(...relevantArticles.map(article => ({
          ...article,
          source: source,
          type: 'news',
          category: this.categorizeContent(article.title + ' ' + article.content)
        })));

      } catch (error) {
        console.error(`Error scraping ${source}:`, error.message);
      }
    }

    return newsData;
  }

  /**
   * Scrape industry reports and analysis
   */
  async scrapeIndustryReports() {
    console.log('📊 Scraping industry reports...');
    const reportData = [];

    for (const source of this.dataSources.industryReports) {
      try {
        const reports = await this.scrapeWebsite(source, {
          extractionRules: {
            reports: {
              selector: '.report, .analysis, .insight',
              fields: {
                title: 'h1, h2, .title',
                summary: '.summary, .excerpt, .description',
                date: '.date, .published',
                category: '.category, .tag'
              }
            }
          }
        });

        reportData.push(...reports.map(report => ({
          ...report,
          source: source,
          type: 'report',
          relevanceScore: this.calculateRelevanceScore(report.title + ' ' + report.summary)
        })));

      } catch (error) {
        console.error(`Error scraping reports from ${source}:`, error.message);
      }
    }

    return reportData;
  }

  /**
   * Scrape major chain websites for updates
   */
  async scrapeChainWebsites() {
    console.log('🏪 Scraping chain websites...');
    const chainData = [];

    for (const chainUrl of this.dataSources.chainWebsites) {
      try {
        const updates = await this.scrapeWebsite(chainUrl, {
          extractionRules: {
            news: {
              selector: '.news-item, .press-release, .announcement',
              fields: {
                title: 'h1, h2, h3',
                content: '.content, .body, p',
                date: '.date, time',
                category: '.category, .type'
              }
            }
          }
        });

        const chainName = this.extractChainName(chainUrl);
        
        chainData.push(...updates.map(update => ({
          ...update,
          source: chainUrl,
          chain: chainName,
          type: 'chain_update',
          opportunityType: this.identifyOpportunityType(update.title + ' ' + update.content)
        })));

      } catch (error) {
        console.error(`Error scraping chain ${chainUrl}:`, error.message);
      }
    }

    return chainData;
  }

  /**
   * Scrape social media for partnership announcements
   */
  async scrapeSocialMedia() {
    console.log('📱 Monitoring social media...');
    // Note: This would typically use social media APIs
    // For demo purposes, we'll simulate social media data
    
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
   * Fallback scraping using cheerio
   */
  async fallbackScraping(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AFH-Platform-Bot/1.0)'
        }
      });

      const $ = cheerio.load(response.data);
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
      return [];
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
        // Use AI to classify and extract opportunity details
        const classification = await this.classifyWithAI(item);
        
        if (classification.isOpportunity) {
          const opportunity = {
            title: item.title,
            description: item.content || item.summary,
            source: item.source,
            type: item.type,
            channel: classification.channel,
            priority: classification.priority,
            confidence: classification.confidence,
            location: classification.location,
            potentialValue: classification.potentialValue,
            tags: classification.tags,
            extractedAt: new Date().toISOString(),
            originalData: item
          };

          processedOpportunities.push(opportunity);
        }
      } catch (error) {
        console.error('Error processing item:', error.message);
      }
    }

    return processedOpportunities;
  }

  /**
   * Use AI to classify content and extract opportunity details
   */
  async classifyWithAI(item) {
    const prompt = `
Analyze this content for AFH (Away-From-Home) channel opportunities:

Title: ${item.title}
Content: ${item.content || item.summary || ''}
Source: ${item.source}

Determine:
1. Is this a potential AFH opportunity? (true/false)
2. Channel type: QSR, Workplace, Leisure, Education, Healthcare, or Other
3. Priority level: high, medium, low
4. Confidence score: 0-100
5. Location (if mentioned)
6. Potential value/impact
7. Relevant tags

Respond in JSON format:
{
  "isOpportunity": boolean,
  "channel": "string",
  "priority": "string",
  "confidence": number,
  "location": "string",
  "potentialValue": "string",
  "tags": ["array", "of", "strings"],
  "reasoning": "brief explanation"
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in AFH (Away-From-Home) channel analysis for CPG companies. Analyze content for business opportunities in restaurants, workplaces, leisure venues, education, and healthcare.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('AI classification error:', error.message);
      // Fallback classification
      return {
        isOpportunity: this.containsOpportunityKeywords(item.title + ' ' + (item.content || '')),
        channel: 'Other',
        priority: 'medium',
        confidence: 50,
        location: '',
        potentialValue: '',
        tags: [],
        reasoning: 'Fallback classification due to AI error'
      };
    }
  }

  /**
   * Helper methods
   */
  containsOpportunityKeywords(text) {
    const lowerText = text.toLowerCase();
    return Object.values(this.opportunityKeywords)
      .flat()
      .some(keyword => lowerText.includes(keyword));
  }

  categorizeContent(text) {
    const lowerText = text.toLowerCase();
    
    if (this.opportunityKeywords.expansion.some(kw => lowerText.includes(kw))) {
      return 'expansion';
    }
    if (this.opportunityKeywords.menu.some(kw => lowerText.includes(kw))) {
      return 'menu';
    }
    if (this.opportunityKeywords.partnership.some(kw => lowerText.includes(kw))) {
      return 'partnership';
    }
    if (this.opportunityKeywords.trends.some(kw => lowerText.includes(kw))) {
      return 'trends';
    }
    
    return 'general';
  }

  calculateRelevanceScore(text) {
    const keywords = Object.values(this.opportunityKeywords).flat();
    const lowerText = text.toLowerCase();
    const matches = keywords.filter(keyword => lowerText.includes(keyword));
    return Math.min(100, (matches.length / keywords.length) * 100);
  }

  identifyOpportunityType(text) {
    return this.categorizeContent(text);
  }

  extractChainName(url) {
    const domain = new URL(url).hostname;
    const name = domain.split('.')[1] || domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

module.exports = DataIngestionService;
