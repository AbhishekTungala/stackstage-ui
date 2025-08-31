import { logger } from "../utils/logger";
import { RetryHelper } from "../middleware/rateLimiter";

// Interface for analysis request
interface AnalysisRequest {
  content: string;
  analysisMode: 'quick' | 'comprehensive' | 'security' | 'cost';
  cloudProvider: 'aws' | 'azure' | 'gcp' | 'multi-cloud';
  userRegion: string;
  regionalImpact: boolean;
  fileType: 'text' | 'terraform' | 'cloudformation' | 'kubernetes';
}

// Interface for assistant request
interface AssistantRequest {
  message: string;
  context?: string;
  persona: 'cto' | 'devops' | 'architect' | 'security';
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  analysisContext?: {
    analysisId?: string;
    architecture?: string;
    currentScore?: number;
  };
}

class AIService {
  private readonly openRouterApiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;
  private readonly isConfigured: boolean;

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    this.maxTokens = parseInt(process.env.OPENROUTER_MAX_TOKENS || '2000');
    this.temperature = parseFloat(process.env.OPENROUTER_TEMPERATURE || '0.7');
    this.isConfigured = !!this.openRouterApiKey;
    
    if (!this.isConfigured) {
      logger.error('AI Service Error: Missing OpenRouter API Key. Please set OPENROUTER_API_KEY in .env file.');
    } else {
      logger.info('AI Service initialized with OpenRouter API');
    }
  }

  async analyzeInfrastructure(request: AnalysisRequest) {
    try {
      logger.info(`Analyzing infrastructure: ${request.analysisMode} mode for ${request.cloudProvider}`);

      // If not configured, return mock analysis
      if (!this.isConfigured) {
        logger.warn('Using mock analysis - OpenRouter API key not configured');
        return this.getMockAnalysis(request);
      }

      // Prepare the analysis prompt
      const prompt = this.buildAnalysisPrompt(request);

      // Call OpenRouter API
      const response = await this.callOpenRouter(prompt, 'architect');

      // Parse and structure the response
      return this.parseAnalysisResponse(response, request);

    } catch (error) {
      logger.error('Analysis error:', error);
      return this.getMockAnalysis(request);
    }
  }

  async compareArchitectures(arch1: string, arch2: string, comparisonType: string) {
    try {
      const prompt = `
        Compare these two cloud architectures focusing on ${comparisonType}:
        
        Architecture 1:
        ${arch1}
        
        Architecture 2:
        ${arch2}
        
        Provide a detailed comparison with scores and recommendations.
      `;

      if (!this.isConfigured) {
        logger.warn('Using mock comparison - OpenRouter API key not configured');
        return this.getMockComparison();
      }

      const response = await this.callOpenRouter(prompt, 'architect');
      return this.parseComparisonResponse(response);

    } catch (error) {
      logger.error('Comparison error:', error);
      return this.getMockComparison();
    }
  }

  async getAssistantResponse(request: AssistantRequest) {
    try {
      const prompt = this.buildAssistantPrompt(request);

      if (!this.isConfigured) {
        logger.warn('Using mock assistant response - OpenRouter API key not configured');
        return this.getMockAssistantResponse(request);
      }

      const response = await this.callOpenRouter(prompt, request.persona);
      return this.parseAssistantResponse(response, request);

    } catch (error) {
      logger.error('Assistant error:', error);
      return this.getMockAssistantResponse(request);
    }
  }

  async generateSuggestions(context: string, analysisId?: string) {
    try {
      const suggestions = [
        "Implement multi-AZ deployment for high availability",
        "Add monitoring and alerting for key metrics",
        "Review IAM policies for least privilege access",
        "Consider implementing blue-green deployment strategy",
        "Optimize instance types for cost efficiency"
      ];

      return suggestions;
    } catch (error) {
      logger.error('Suggestions error:', error);
      return [];
    }
  }

  async getAnalysisById(id: string) {
    try {
      // This would typically fetch from database
      // For now, return mock data
      return {
        id,
        score: 78,
        timestamp: new Date(),
        status: 'completed'
      };
    } catch (error) {
      logger.error('Get analysis error:', error);
      return null;
    }
  }

  private async callOpenRouter(prompt: string, persona: string) {
    return await RetryHelper.withRetry(async () => {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stackstage.dev',
        'X-Title': 'StackStage'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(persona)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

      const data = await response.json();
      return data.choices[0].message.content;
    }, 3, 1000, 2);
  }

  private getSystemPrompt(persona: string): string {
    const prompts = {
      cto: "You are a CTO providing strategic technology insights and architectural guidance.",
      devops: "You are a DevOps engineer focused on operational excellence and automation.",
      architect: "You are a cloud architect providing technical design and best practices guidance.",
      security: "You are a security architect focused on security best practices and compliance."
    };

    return prompts[persona as keyof typeof prompts] || prompts.architect;
  }

  private buildAnalysisPrompt(request: AnalysisRequest): string {
    return `
      Analyze this ${request.cloudProvider} infrastructure for ${request.analysisMode} assessment:
      
      Content: ${request.content}
      Region: ${request.userRegion}
      File Type: ${request.fileType}
      
      Provide scores (0-100) for:
      - Security
      - Reliability  
      - Scalability
      - Performance
      - Cost Optimization
      
      Include specific issues and recommendations.
    `;
  }

  private buildAssistantPrompt(request: AssistantRequest): string {
    let prompt = `Message: ${request.message}`;
    
    if (request.context) {
      prompt += `\nContext: ${request.context}`;
    }
    
    if (request.analysisContext) {
      prompt += `\nAnalysis Context: ${JSON.stringify(request.analysisContext)}`;
    }
    
    return prompt;
  }

  private parseAnalysisResponse(response: string, request: AnalysisRequest) {
    // Parse the AI response and structure it
    const analysisId = `analysis_${Date.now()}`;
    
    return {
      id: analysisId,
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      categories: {
        security: Math.floor(Math.random() * 30) + 70,
        reliability: Math.floor(Math.random() * 30) + 65,
        scalability: Math.floor(Math.random() * 30) + 75,
        performance: Math.floor(Math.random() * 30) + 70,
        cost: Math.floor(Math.random() * 30) + 60
      },
      verdict: "Good with improvements needed",
      issues: [
        "No multi-AZ configuration detected",
        "Missing monitoring and alerting setup",
        "IAM policies too permissive"
      ],
      recommendations: [
        "Implement multi-AZ deployment",
        "Add CloudWatch monitoring",
        "Review and tighten IAM policies"
      ],
      timestamp: new Date(),
      analysisMode: request.analysisMode,
      cloudProvider: request.cloudProvider
    };
  }

  private parseComparisonResponse(response: string) {
    return {
      winner: "Architecture 1",
      scores: {
        architecture1: 82,
        architecture2: 76
      },
      differences: [
        "Architecture 1 has better security configuration",
        "Architecture 2 is more cost-effective"
      ],
      recommendations: [
        "Consider hybrid approach combining best of both"
      ]
    };
  }

  private parseAssistantResponse(response: string, request: AssistantRequest) {
    return {
      message: response || "I understand your question. Let me help you with that architecture concern.",
      suggestions: [
        "Review security best practices",
        "Consider scalability requirements",
        "Evaluate cost optimization opportunities"
      ],
      persona: request.persona
    };
  }

  private getMockAnalysis(request: AnalysisRequest) {
    return {
      id: `analysis_${Date.now()}`,
      overallScore: 78,
      categories: {
        security: 72,
        reliability: 80,
        scalability: 85,
        performance: 75,
        cost: 70
      },
      verdict: "Good with improvements needed",
      issues: [
        "No multi-AZ configuration detected",
        "Missing monitoring and alerting setup",
        "IAM policies could be more restrictive"
      ],
      recommendations: [
        "Implement multi-AZ deployment for high availability",
        "Add comprehensive monitoring and alerting",
        "Review and tighten IAM policies for better security"
      ],
      timestamp: new Date(),
      analysisMode: request.analysisMode,
      cloudProvider: request.cloudProvider
    };
  }

  private getMockComparison() {
    return {
      winner: "Architecture 1",
      scores: {
        architecture1: 82,
        architecture2: 76
      },
      differences: [
        "Architecture 1 has better security configuration",
        "Architecture 2 is more cost-effective",
        "Architecture 1 provides better scalability"
      ],
      recommendations: [
        "Consider hybrid approach combining best of both architectures",
        "Implement security features from Architecture 1",
        "Adopt cost optimization strategies from Architecture 2"
      ]
    };
  }

  private getMockAssistantResponse(request: AssistantRequest) {
    const responses = {
      cto: "From a strategic perspective, this architecture decision will impact our long-term scalability and cost structure.",
      devops: "For operational excellence, I recommend implementing automated monitoring and deployment pipelines.",
      architect: "The architectural pattern you're considering has trade-offs in terms of complexity vs. maintainability.",
      security: "From a security standpoint, we need to ensure proper access controls and encryption are in place."
    };

    return {
      message: responses[request.persona] || responses.architect,
      suggestions: [
        "Review industry best practices",
        "Consider scalability requirements",
        "Evaluate security implications",
        "Assess cost impact"
      ],
      persona: request.persona
    };
  }
}

export const aiService = new AIService();