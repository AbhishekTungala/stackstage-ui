import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Infrastructure Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { content, analysisMode = 'comprehensive', cloudProvider, userRegion } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required for analysis" });
      }

      const systemPrompt = buildAnalysisPrompt(analysisMode, cloudProvider);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const formattedResult = formatAnalysisResult(result);

      // Store analysis result
      const analysisId = `analysis_${Date.now()}`;
      await storage.storeAnalysis(analysisId, {
        ...formattedResult,
        timestamp: new Date(),
        mode: analysisMode,
        provider: cloudProvider
      });

      res.json({ success: true, analysisId, result: formattedResult });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        error: "Failed to analyze infrastructure", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Assistant Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

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

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const assistantResponse = response.choices[0].message.content;

      res.json({ 
        success: true, 
        message: assistantResponse,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: "Failed to get AI response", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get Analysis Results
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json({ success: true, analysis });
    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ error: "Failed to retrieve analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function buildAnalysisPrompt(mode: string, provider?: string): string {
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
  "diagramCode": "mermaid diagram code representing the architecture with proper styling classes for issues",
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

function formatAnalysisResult(rawResult: any) {
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
