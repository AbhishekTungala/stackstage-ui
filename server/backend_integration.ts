import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface AnalyzeRequest {
  text: string;
  options?: {
    region?: string;
    mode?: string;
  };
}

export interface AnalyzeResult {
  id: string;
  timestamp: string;
  score: number;
  issues: string[];
  recommendations: string[];
  cost: string;
  diagram: string;
  details?: any;
}

export async function callPythonAnalyze(request: AnalyzeRequest): Promise<AnalyzeResult> {
  try {
    const pythonScript = `
import sys
import os
import asyncio
import json
sys.path.insert(0, './backend')

async def main():
    try:
        from utils.ai_engine import analyze_architecture
        from models.schemas import AnalyzeRequest
        
        data = AnalyzeRequest(
            architecture_text="""${request.text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""",
            user_region="${request.options?.region || 'us-east-1'}"
        )
        result = await analyze_architecture(data)
        print(json.dumps(result, default=str))
    except Exception as e:
        print(json.dumps({"error": str(e)}, default=str))

asyncio.run(main())
    `;

    const { stdout, stderr } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
    
    if (stderr && stderr.trim()) {
      console.error("Python backend stderr:", stderr);
    }
    
    const result = JSON.parse(stdout.trim());
    
    if (result.error) {
      throw new Error(`Python backend error: ${result.error}`);
    }
    
    return {
      id: result.analysis_id || Date.now().toString(),
      timestamp: result.timestamp || new Date().toISOString(),
      score: result.score || 0,
      issues: result.issues || [],
      recommendations: result.recommendations || [],
      cost: result.estimated_cost || "Unable to estimate",
      diagram: result.diagram || "graph TD; A[Analysis] --> B[Error]",
      details: result.details || {}
    };
    
  } catch (error) {
    console.error("Backend integration error:", error);
    throw error;
  }
}

export async function callPythonAssistant(messages: any[] | string, role?: string): Promise<any> {
  try {
    console.log("Calling OpenRouter API for enhanced assistant...");
    
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY; // Using same env var for OpenRouter key
    if (!apiKey) {
      throw new Error("OpenRouter API key not found");
    }
    
    // Prepare messages for OpenAI
    let formattedMessages: any[];
    
    if (Array.isArray(messages)) {
      formattedMessages = messages;
    } else {
      // Convert string to message format
      formattedMessages = [
        { role: 'user', content: messages }
      ];
    }
    
    // Create role-specific system prompt
    const systemPrompt = getRoleBasedSystemPrompt(role);
    
    // Add system message at the beginning
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...formattedMessages
    ];
    
    // Call OpenRouter API for cost-effective access to multiple models
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://stackstage.dev',
        'X-Title': 'StackStage Cloud Intelligence'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: fullMessages,
        max_tokens: 1500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm here to help with your cloud architecture questions.";
    
    // Generate contextual suggestions based on role and content
    const suggestions = generateRoleBasedSuggestions(aiResponse, role);
    
    return {
      response: aiResponse,
      suggestions: suggestions,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error("OpenRouter Assistant integration error:", error);
    throw error;
  }
}

function getRoleBasedSystemPrompt(role?: string): string {
  const basePrompt = "You are an expert cloud architecture consultant with deep expertise in AWS, Azure, and GCP. Provide detailed, actionable advice based on industry best practices.";
  
  switch (role) {
    case 'CTO':
      return `${basePrompt}

You are speaking to a CTO. Focus on:
- Business impact and ROI of technical decisions
- Strategic technology roadmaps and risk assessments
- Compliance, governance, and enterprise security
- Cost optimization and budget planning
- Executive-level summaries with clear recommendations

Provide responses that help inform strategic business decisions with technical depth when needed.`;

    case 'DevOps':
      return `${basePrompt}

You are speaking to a DevOps Engineer. Focus on:
- Operational excellence and automation strategies
- CI/CD pipeline optimization and deployment best practices
- Infrastructure as Code (Terraform, CloudFormation)
- Monitoring, logging, and observability implementation
- Container orchestration and Kubernetes management
- Disaster recovery and incident response procedures

Provide hands-on, technical guidance with specific implementation steps and tool recommendations.`;

    case 'Architect':
      return `${basePrompt}

You are speaking to a Cloud Architect. Focus on:
- System design patterns and architectural best practices
- Scalability, performance, and high availability design
- Microservices architecture and service communication
- Data architecture and storage optimization
- Security architecture and compliance frameworks
- Multi-cloud and hybrid cloud strategies

Provide comprehensive architectural guidance with detailed technical specifications and design considerations.`;

    default:
      return `${basePrompt}

Provide comprehensive cloud architecture guidance covering security, performance, cost optimization, and operational best practices. Tailor your response to the specific question asked while maintaining technical accuracy and actionable recommendations.`;
  }
}

function generateRoleBasedSuggestions(response: string, role?: string): string[] {
  const suggestions: string[] = [];
  
  // Analyze response content for contextual suggestions
  const responseLower = response.toLowerCase();
  
  if (role === 'CTO') {
    suggestions.push(
      "What's the ROI analysis for this cloud migration?",
      "How do we ensure SOC 2 compliance with this architecture?",
      "What are the business risks we should consider?",
      "Create an executive summary for the board"
    );
  } else if (role === 'DevOps') {
    suggestions.push(
      "How do we implement CI/CD for this architecture?",
      "What monitoring and alerting should we set up?",
      "Create a disaster recovery plan",
      "Show me the infrastructure as code templates"
    );
  } else if (role === 'Architect') {
    suggestions.push(
      "Compare this with alternative architectural patterns",
      "How does this scale to handle 10x traffic?",
      "What are the security design considerations?",
      "Create a detailed technical specification"
    );
  } else {
    // Generic suggestions based on content
    if (responseLower.includes('security') || responseLower.includes('compliance')) {
      suggestions.push("Generate a security checklist");
    }
    if (responseLower.includes('cost') || responseLower.includes('budget')) {
      suggestions.push("Create a cost optimization plan");
    }
    if (responseLower.includes('performance') || responseLower.includes('scale')) {
      suggestions.push("Design a performance testing strategy");
    }
    if (responseLower.includes('monitoring') || responseLower.includes('observability')) {
      suggestions.push("Set up comprehensive monitoring");
    }
  }
  
  // Add generic helpful suggestions
  suggestions.push("Export this conversation to PDF");
  
  return suggestions.slice(0, 4);
}