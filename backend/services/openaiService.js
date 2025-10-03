import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  // Generate market insights
  static async generateMarketInsights(prompt, context = '') {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert AFH (Away-From-Home) channel strategist for CPG companies like PepsiCo. 
            You provide strategic insights, market analysis, and commercial recommendations for QSR, workplace, 
            leisure, education, and healthcare channels. Focus on beverage partnerships, menu placements, 
            and commercial strategies.`
          },
          {
            role: "user",
            content: `${context} ${prompt}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  // Generate outreach email
  static async generateOutreachEmail(account, channel, context) {
    const prompt = `Generate a professional outreach email for ${account} in the ${channel} channel. Context: ${context}`;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a commercial sales expert for beverage companies. Create compelling, personalized 
            outreach emails that highlight value propositions and partnership opportunities.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate outreach email');
    }
  }

  // Analyze market trends
  static async analyzeMarketTrends(data, channel) {
    const prompt = `Analyze the following market data for ${channel} channel and provide strategic insights: ${JSON.stringify(data)}`;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a market analyst specializing in CPG AFH channels. Analyze data and provide 
            actionable insights, trends, and recommendations.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.5,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to analyze market trends');
    }
  }

  // Generate playbook strategy
  static async generatePlaybookStrategy(channels, accountType, objectives) {
    const prompt = `Create a commercial playbook for ${accountType} accounts targeting ${channels.join(', ')} channels. Objectives: ${objectives}`;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a strategic consultant for beverage companies. Create comprehensive commercial 
            playbooks with specific tactics, KPIs, and execution steps.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate playbook strategy');
    }
  }
}
