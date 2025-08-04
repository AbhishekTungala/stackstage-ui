import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export interface AnalysisRequest {
  content: string;
  analysisMode: 'basic' | 'comprehensive' | 'security' | 'cost' | 'performance';
  cloudProvider?: string;
  userRegion?: string;
}

export interface AnalysisResult {
  overallScore: number;
  securityScore: number;
  costScore: number;
  performanceScore: number;
  criticalIssues: Issue[];
  warnings: Issue[];
  recommendations: Recommendation[];
  estimatedSavings: number;
  diagramCode: string;
  summary: string;
}

export interface Issue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'security' | 'cost' | 'performance' | 'compliance';
  title: string;
  description: string;
  impact: string;
  severity: number;
  resource?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'cost' | 'performance';
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: string;
  estimatedSavings?: number;
  implementation: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export class OpenAIService {
  private static instance: OpenAIService;
  
  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async analyzeInfrastructure(request: AnalysisRequest): Promise<AnalysisResult> {
    const systemPrompt = this.buildAnalysisPrompt(request.analysisMode, request.cloudProvider);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: request.content }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return this.formatAnalysisResult(result);
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error('Failed to analyze infrastructure. Please check your API key and try again.');
    }
  }

  async chatWithAssistant(messages: ChatMessage[]): Promise<string> {
    const systemPrompt = `You are an expert cloud infrastructure consultant with deep knowledge of AWS, Azure, GCP, and modern DevOps practices. 

Provide detailed, actionable advice on:
- Cloud architecture design and optimization
- Security best practices and compliance
- Cost optimization strategies
- Performance tuning and scalability
- Infrastructure as Code (Terraform, CloudFormation)
- Containerization and orchestration
- CI/CD pipeline optimization
- Monitoring and observability

Always provide specific, implementable recommendations with:
- Step-by-step instructions when appropriate
- Code examples or configuration snippets
- Best practices and industry standards
- Potential risks and mitigation strategies
- Cost implications and ROI considerations

Keep responses professional, detailed, and focused on practical solutions.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(msg => ({ role: msg.role, content: msg.content }))
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content || 'I apologize, but I was unable to generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw new Error('Failed to get AI response. Please check your connection and try again.');
    }
  }

  private buildAnalysisPrompt(mode: string, provider?: string): string {
    const basePrompt = `You are an expert cloud infrastructure analyst. Analyze the provided infrastructure configuration and return a comprehensive assessment in JSON format.

Required JSON structure:
{
  "overallScore": number (0-100),
  "securityScore": number (0-100),
  "costScore": number (0-100),
  "performanceScore": number (0-100),
  "criticalIssues": [
    {
      "id": "unique-id",
      "type": "critical",
      "category": "security|cost|performance|compliance",
      "title": "Issue Title",
      "description": "Detailed description",
      "impact": "Business impact description",
      "severity": number (1-10),
      "resource": "affected resource name"
    }
  ],
  "warnings": [similar structure with type: "warning"],
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "category": "security|cost|performance",
      "priority": "high|medium|low",
      "effort": "low|medium|high",
      "impact": "Expected impact description",
      "estimatedSavings": number (monthly USD),
      "implementation": ["step 1", "step 2", "step 3"]
    }
  ],
  "estimatedSavings": number (total monthly USD savings),
  "diagramCode": "mermaid diagram code representing the architecture",
  "summary": "executive summary of findings"
}`;

    const modeSpecific = {
      'security': ' Focus heavily on security vulnerabilities, compliance issues, and access controls.',
      'cost': ' Prioritize cost optimization opportunities, resource utilization, and spending efficiency.',
      'performance': ' Emphasize performance bottlenecks, scalability issues, and optimization opportunities.',
      'comprehensive': ' Provide balanced analysis across security, cost, and performance dimensions.'
    };

    const providerSpecific = provider ? ` Focus on ${provider} best practices and services.` : '';

    return basePrompt + (modeSpecific[mode as keyof typeof modeSpecific] || modeSpecific.comprehensive) + providerSpecific;
  }

  private formatAnalysisResult(rawResult: any): AnalysisResult {
    return {
      overallScore: Math.min(100, Math.max(0, rawResult.overallScore || 0)),
      securityScore: Math.min(100, Math.max(0, rawResult.securityScore || 0)),
      costScore: Math.min(100, Math.max(0, rawResult.costScore || 0)),
      performanceScore: Math.min(100, Math.max(0, rawResult.performanceScore || 0)),
      criticalIssues: rawResult.criticalIssues || [],
      warnings: rawResult.warnings || [],
      recommendations: rawResult.recommendations || [],
      estimatedSavings: rawResult.estimatedSavings || 0,
      diagramCode: rawResult.diagramCode || 'graph TD\n    A[No Architecture Detected] --> B[Please provide valid configuration]',
      summary: rawResult.summary || 'Analysis completed successfully.'
    };
  }
}

export const openaiService = OpenAIService.getInstance();