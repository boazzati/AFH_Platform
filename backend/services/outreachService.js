const OpenAI = require('openai');

class OutreachService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Generate personalized outreach email
  async generateOutreachEmail(opportunity, contactInfo, companyInfo, options = {}) {
    try {
      const {
        emailType = 'initial',
        tone = 'professional',
        industry = 'food-service',
        previousInteractions = [],
        customContext = ''
      } = options;

      const systemPrompt = this.buildSystemPrompt(emailType, tone, industry);
      const userPrompt = this.buildUserPrompt(opportunity, contactInfo, companyInfo, previousInteractions, customContext);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const emailContent = response.choices[0].message.content;
      const parsedEmail = this.parseEmailContent(emailContent);

      return {
        success: true,
        email: {
          ...parsedEmail,
          metadata: {
            opportunityId: opportunity.id,
            contactId: contactInfo.id,
            generatedAt: new Date().toISOString(),
            emailType,
            tone,
            aiModel: 'gpt-4'
          }
        }
      };

    } catch (error) {
      console.error('Error generating outreach email:', error);
      return {
        success: false,
        error: error.message,
        fallbackEmail: this.generateFallbackEmail(opportunity, contactInfo)
      };
    }
  }

  // Generate follow-up email sequence
  async generateFollowUpSequence(originalEmail, responseData, sequenceType = 'standard') {
    try {
      const systemPrompt = `You are an expert AFH (Away From Home) food service business development specialist creating follow-up email sequences. 

Your expertise includes:
- Building relationships with restaurant chains, coffee shops, and food service operators
- Understanding the AFH market dynamics and decision-making processes
- Creating compelling value propositions for food and beverage partnerships
- Timing follow-ups appropriately based on industry cycles

Generate a strategic follow-up email sequence that:
- Maintains professional relationship momentum
- Provides additional value and insights
- Addresses potential concerns or objections
- Includes clear next steps and calls to action
- Respects the recipient's time and decision-making process

Email tone should be: Professional, consultative, value-focused, and relationship-building.`;

      const userPrompt = `
Original Email Context:
${JSON.stringify(originalEmail, null, 2)}

Response Data:
${JSON.stringify(responseData, null, 2)}

Sequence Type: ${sequenceType}

Generate a 3-email follow-up sequence with the following structure for each email:
1. Subject line
2. Email body (150-250 words)
3. Call to action
4. Timing recommendation (days after previous email)
5. Key value proposition for this touchpoint

Focus on:
- Building on the original opportunity discussion
- Providing market insights and industry trends
- Sharing relevant case studies or success stories
- Addressing common AFH partnership concerns
- Moving toward a concrete next step (meeting, proposal, pilot program)

Format as JSON with emails array.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1200
      });

      const sequenceContent = response.choices[0].message.content;
      const parsedSequence = JSON.parse(sequenceContent);

      return {
        success: true,
        sequence: {
          ...parsedSequence,
          metadata: {
            originalEmailId: originalEmail.id,
            sequenceType,
            generatedAt: new Date().toISOString(),
            aiModel: 'gpt-4'
          }
        }
      };

    } catch (error) {
      console.error('Error generating follow-up sequence:', error);
      return {
        success: false,
        error: error.message,
        fallbackSequence: this.generateFallbackSequence(originalEmail)
      };
    }
  }

  // Generate proposal document
  async generateProposal(opportunity, companyInfo, proposalType = 'partnership') {
    try {
      const systemPrompt = `You are an expert AFH (Away From Home) business development specialist creating professional partnership proposals.

Your expertise includes:
- Structuring compelling partnership proposals for restaurant chains and food service operators
- Understanding AFH market dynamics, pricing models, and implementation timelines
- Creating clear value propositions with quantifiable benefits
- Addressing operational considerations and risk mitigation
- Developing realistic implementation roadmaps

Generate a comprehensive partnership proposal that:
- Clearly articulates the business opportunity and value proposition
- Includes specific financial projections and ROI analysis
- Addresses implementation considerations and timelines
- Provides risk assessment and mitigation strategies
- Includes clear next steps and decision framework

Proposal should be professional, data-driven, and actionable.`;

      const userPrompt = `
Opportunity Details:
${JSON.stringify(opportunity, null, 2)}

Company Information:
${JSON.stringify(companyInfo, null, 2)}

Proposal Type: ${proposalType}

Generate a comprehensive partnership proposal with the following sections:
1. Executive Summary
2. Opportunity Overview
3. Value Proposition
4. Financial Projections
5. Implementation Roadmap
6. Risk Assessment
7. Next Steps
8. Appendix (supporting data)

Each section should be detailed and professional, suitable for C-level executives in the food service industry.

Format as JSON with sections array containing title and content for each section.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });

      const proposalContent = response.choices[0].message.content;
      const parsedProposal = JSON.parse(proposalContent);

      return {
        success: true,
        proposal: {
          ...parsedProposal,
          metadata: {
            opportunityId: opportunity.id,
            proposalType,
            generatedAt: new Date().toISOString(),
            aiModel: 'gpt-4'
          }
        }
      };

    } catch (error) {
      console.error('Error generating proposal:', error);
      return {
        success: false,
        error: error.message,
        fallbackProposal: this.generateFallbackProposal(opportunity)
      };
    }
  }

  // Analyze email engagement and suggest optimizations
  async analyzeEmailPerformance(emailData, engagementMetrics) {
    try {
      const systemPrompt = `You are an expert email marketing analyst specializing in B2B outreach for the AFH (Away From Home) food service industry.

Analyze email performance data and provide actionable insights for optimization:
- Subject line effectiveness
- Content engagement patterns
- Timing optimization
- Personalization opportunities
- Call-to-action performance
- Industry-specific best practices

Provide specific, actionable recommendations for improving outreach effectiveness.`;

      const userPrompt = `
Email Data:
${JSON.stringify(emailData, null, 2)}

Engagement Metrics:
${JSON.stringify(engagementMetrics, null, 2)}

Provide analysis and recommendations in the following areas:
1. Subject Line Analysis
2. Content Performance
3. Timing Optimization
4. Personalization Opportunities
5. Call-to-Action Effectiveness
6. Industry-Specific Recommendations
7. A/B Testing Suggestions

Format as JSON with analysis object containing each area and specific recommendations.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      const analysisContent = response.choices[0].message.content;
      const parsedAnalysis = JSON.parse(analysisContent);

      return {
        success: true,
        analysis: {
          ...parsedAnalysis,
          metadata: {
            analyzedAt: new Date().toISOString(),
            aiModel: 'gpt-4'
          }
        }
      };

    } catch (error) {
      console.error('Error analyzing email performance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Build system prompt for email generation
  buildSystemPrompt(emailType, tone, industry) {
    const basePrompt = `You are an expert AFH (Away From Home) food service business development specialist with 15+ years of experience building partnerships with restaurant chains, coffee shops, and food service operators.

Your expertise includes:
- Deep understanding of AFH market dynamics and decision-making processes
- Proven track record of successful partnerships with major chains (QSR, Fast Casual, Coffee, Casual Dining)
- Knowledge of food service operations, supply chain, and menu development
- Understanding of seasonal trends, consumer preferences, and industry challenges
- Experience with product launches, menu innovations, and market expansion strategies

Your communication style is:
- Professional yet approachable
- Data-driven with compelling storytelling
- Focused on mutual value creation
- Respectful of busy executives' time
- Clear and actionable

Generate emails that:
- Lead with compelling value propositions
- Include relevant market insights and trends
- Reference specific industry challenges and opportunities
- Provide clear next steps and calls to action
- Maintain appropriate professional tone for the food service industry`;

    const typeSpecific = {
      initial: 'This is an initial outreach email to introduce a new partnership opportunity.',
      follow_up: 'This is a follow-up email to continue a previous conversation.',
      proposal: 'This is a proposal presentation email with detailed partnership terms.',
      meeting_request: 'This is a meeting request email to discuss partnership opportunities.',
      check_in: 'This is a relationship maintenance email to stay connected.'
    };

    const toneSpecific = {
      professional: 'Maintain a formal, business-appropriate tone.',
      friendly: 'Use a warm, approachable tone while remaining professional.',
      urgent: 'Convey appropriate urgency while being respectful.',
      consultative: 'Position yourself as a trusted advisor and industry expert.'
    };

    return `${basePrompt}\n\n${typeSpecific[emailType] || typeSpecific.initial}\n${toneSpecific[tone] || toneSpecific.professional}`;
  }

  // Build user prompt with opportunity and contact details
  buildUserPrompt(opportunity, contactInfo, companyInfo, previousInteractions, customContext) {
    return `
Generate a personalized outreach email with the following information:

OPPORTUNITY DETAILS:
- Title: ${opportunity.title}
- Channel: ${opportunity.channel}
- Description: ${opportunity.description || 'Partnership opportunity in the AFH space'}
- Potential Value: ${opportunity.revenue || 'Significant revenue potential'}
- Timeline: ${opportunity.timeline || '6-12 months'}
- Priority: ${opportunity.priority || 'high'}

CONTACT INFORMATION:
- Name: ${contactInfo.name}
- Title: ${contactInfo.title || 'Decision Maker'}
- Company: ${contactInfo.company}
- Industry: ${contactInfo.industry || 'Food Service'}

COMPANY INFORMATION:
- Company: ${companyInfo.name || 'Our Company'}
- Industry: ${companyInfo.industry || 'Food & Beverage Solutions'}
- Value Proposition: ${companyInfo.valueProposition || 'Innovative AFH solutions'}

PREVIOUS INTERACTIONS:
${previousInteractions.length > 0 ? previousInteractions.map(i => `- ${i.date}: ${i.summary}`).join('\n') : 'No previous interactions'}

CUSTOM CONTEXT:
${customContext || 'Standard partnership outreach'}

Generate an email with:
1. Compelling subject line (under 60 characters)
2. Professional greeting
3. Brief introduction and credibility establishment
4. Clear value proposition tied to their specific situation
5. Relevant market insight or trend
6. Specific call to action
7. Professional closing

Format as JSON with: subject, greeting, body, callToAction, closing

Keep the email concise (200-300 words) and focused on value creation.`;
  }

  // Parse AI-generated email content
  parseEmailContent(content) {
    try {
      // Try to parse as JSON first
      return JSON.parse(content);
    } catch (error) {
      // If not JSON, parse as structured text
      const lines = content.split('\n').filter(line => line.trim());
      
      return {
        subject: this.extractSection(lines, 'subject') || 'Partnership Opportunity',
        greeting: this.extractSection(lines, 'greeting') || 'Dear Valued Partner,',
        body: this.extractSection(lines, 'body') || content,
        callToAction: this.extractSection(lines, 'call') || 'I would welcome the opportunity to discuss this further.',
        closing: this.extractSection(lines, 'closing') || 'Best regards,'
      };
    }
  }

  // Extract section from structured text
  extractSection(lines, sectionType) {
    const patterns = {
      subject: /^(subject|title):/i,
      greeting: /^(greeting|hello|dear):/i,
      body: /^(body|content|message):/i,
      call: /^(call|action|next):/i,
      closing: /^(closing|regards|sincerely):/i
    };

    const pattern = patterns[sectionType];
    if (!pattern) return null;

    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        return lines[i].replace(pattern, '').trim();
      }
    }
    return null;
  }

  // Generate fallback email when AI fails
  generateFallbackEmail(opportunity, contactInfo) {
    return {
      subject: `Partnership Opportunity: ${opportunity.title}`,
      greeting: `Dear ${contactInfo.name},`,
      body: `I hope this email finds you well. I'm reaching out regarding an exciting partnership opportunity in the ${opportunity.channel} space that could deliver significant value for ${contactInfo.company}.

Our analysis indicates strong potential for collaboration in ${opportunity.title}, with projected benefits including increased revenue, enhanced customer satisfaction, and competitive differentiation.

I would welcome the opportunity to discuss how this partnership could benefit ${contactInfo.company} and explore next steps together.`,
      callToAction: 'Would you be available for a brief call next week to discuss this opportunity?',
      closing: 'Best regards,'
    };
  }

  // Generate fallback follow-up sequence
  generateFallbackSequence(originalEmail) {
    return {
      emails: [
        {
          subject: 'Following up on our partnership discussion',
          timing: 7,
          body: 'I wanted to follow up on my previous email regarding the partnership opportunity...',
          callToAction: 'Would you have 15 minutes for a brief call this week?'
        },
        {
          subject: 'Market insights relevant to your business',
          timing: 14,
          body: 'I came across some interesting market trends that might be relevant to your business...',
          callToAction: 'I would love to share these insights with you over a quick call.'
        },
        {
          subject: 'Final follow-up on partnership opportunity',
          timing: 21,
          body: 'I understand you are likely very busy, so this will be my final follow-up...',
          callToAction: 'Please let me know if there might be a better time to reconnect in the future.'
        }
      ]
    };
  }

  // Generate fallback proposal
  generateFallbackProposal(opportunity) {
    return {
      sections: [
        {
          title: 'Executive Summary',
          content: `This proposal outlines a strategic partnership opportunity for ${opportunity.title} that could deliver significant value through innovative AFH solutions.`
        },
        {
          title: 'Opportunity Overview',
          content: `The ${opportunity.channel} market presents compelling opportunities for growth and innovation through strategic partnerships.`
        },
        {
          title: 'Value Proposition',
          content: 'Our partnership would deliver measurable benefits including increased revenue, enhanced customer satisfaction, and competitive differentiation.'
        }
      ]
    };
  }
}

module.exports = OutreachService;
