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
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-70b-instruct',
        messages: fullMessages,
        max_tokens: 1200,
        temperature: 0.15
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content || "I'm here to help with your cloud architecture questions.";
    
    // Enhanced JSON extraction and validation
    let structuredResponse;
    try {
      structuredResponse = extractAndValidateJson(aiResponse);
    } catch (parseError) {
      console.log("Response not in JSON format, using as text:", parseError.message);
    }
    
    if (structuredResponse) {
      // Return structured response with suggestions based on the structured data
      const suggestions = generateStructuredSuggestions(structuredResponse, role);
      
      return {
        response: structuredResponse,
        suggestions: suggestions,
        timestamp: new Date().toISOString(),
        structured: true
      };
    } else {
      // Fallback: return error-like structured response for failed JSON parsing
      const suggestions = ['Retry with a more specific question', 'Try asking about a specific cloud architecture pattern'];
      
      return {
        response: {
          score: 0,
          summary: "AI response parsing failed",
          rationale: "The AI provided an unstructured response that couldn't be parsed into the expected JSON format.",
          risks: [{ id: "PARSE-001", title: "Response Format Error", severity: "med", impact: "Unable to provide structured analysis", fix: "Please retry your question with more specific requirements." }],
          recommendations: [],
          rpo_rto_alignment: { rpo_minutes: 0, rto_minutes: 0, notes: "Unable to parse requirements from response" },
          pci_essentials: [],
          cost: { currency: "USD", assumptions: [], range_monthly_usd: { low: 0, high: 0 }, items: [] },
          latency: { primary_region: "", alt_regions_considered: [], notes: "No latency analysis available" },
          diagram_mermaid: "",
          alternatives: []
        },
        suggestions: suggestions,
        timestamp: new Date().toISOString(),
        structured: true,
        parsing_error: true
      };
    }
    
  } catch (error) {
    console.error("OpenRouter Assistant integration error:", error);
    throw error;
  }
}

function getRoleBasedSystemPrompt(role?: string): string {
  const baseStackStagePrompt = `You are StackStage AI, a senior cloud architecture advisor for AWS, Azure, and GCP.
You MUST return STRICT JSON only — nothing else (no prose before/after). Follow this exact schema:

{
  "score": integer (0-100),
  "summary": string,
  "rationale": string,
  "risks": [{"id": string, "title": string, "severity": "high|med|low", "impact": string, "fix": string}],
  "recommendations": [{"title": string, "why": string, "how": string, "iac_snippet": string}],
  "rpo_rto_alignment": {"rpo_minutes": integer, "rto_minutes": integer, "notes": string},
  "pci_essentials": [{"control": string, "status": "pass|gap", "action": string}],
  "cost": {
    "currency": "USD",
    "assumptions": [string],
    "range_monthly_usd": {"low": number, "high": number},
    "items": [{"service": string, "est_usd": number}]
  },
  "latency": {"primary_region": string, "alt_regions_considered": [string], "notes": string},
  "diagram_mermaid": string,
  "alternatives": [{"name": string, "pros": [string], "cons": [string], "cost_delta_pct": number, "latency_delta_ms": number}]
}

RULES:
1. Do not include any text outside the JSON object.
2. Use integers for score and RPO/RTO minutes.
3. Provide cost ranges not single hard numbers. If you give estimates for items, they must sum to be inside range.
4. For RPO=5 / RTO=30 — explicitly map at least 2 technical controls that achieve each (e.g., PITR frequency, cross-AZ failover, replica promotion time).
5. Include at least one secured PCI control (segmentation, tokenization, logging retention).
6. Provide a working Mermaid diagram in diagram_mermaid.
7. Be concise and use factual-sounding assumptions. If information is missing, add it under cost.assumptions.`;
  
  switch (role) {
    case 'CTO':
      return `${baseStackStagePrompt}

Role bias: Focus on cost control, compliance, and business risk. Emphasize ROI analysis, strategic roadmaps, governance frameworks, and executive-level summaries with clear business impact.`;

    case 'DevOps':
      return `${baseStackStagePrompt}

Role bias: Focus on automation, CI/CD, scaling policies, and observability. Emphasize Infrastructure as Code, deployment strategies, monitoring implementations, and operational excellence.`;

    case 'Architect':
      return `${baseStackStagePrompt}

Role bias: Focus on design trade-offs, HA/DR patterns, and multi-region topology. Emphasize system design patterns, scalability considerations, and technical architecture decisions.`;

    default:
      return `${baseStackStagePrompt}

Provide comprehensive cloud architecture guidance covering security, performance, cost optimization, and operational best practices.`;
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

function generateStructuredSuggestions(structuredResponse: any, role?: string): string[] {
  const suggestions: string[] = [];
  
  // Generate suggestions based on structured response content
  if (structuredResponse.alternatives && structuredResponse.alternatives.length > 0) {
    suggestions.push(`Compare with ${structuredResponse.alternatives[0].name} approach`);
  }
  
  if (structuredResponse.risks && structuredResponse.risks.length > 0) {
    const highRisks = structuredResponse.risks.filter((r: any) => r.severity === 'high');
    if (highRisks.length > 0) {
      suggestions.push(`Implement fix for ${highRisks[0].title}`);
    }
  }
  
  if (structuredResponse.cost && structuredResponse.cost.range_monthly_usd) {
    suggestions.push("Optimize costs further with reserved instances");
  }
  
  if (structuredResponse.pci_essentials) {
    const gaps = structuredResponse.pci_essentials.filter((p: any) => p.status === 'gap');
    if (gaps.length > 0) {
      suggestions.push(`Address PCI gap: ${gaps[0].control}`);
    }
  }
  
  // Role-specific suggestions
  if (role === 'CTO') {
    suggestions.push("Generate executive risk assessment");
  } else if (role === 'DevOps') {
    suggestions.push("Create implementation automation scripts");
  } else if (role === 'Architect') {
    suggestions.push("Design detailed service mesh topology");
  }
  
  suggestions.push("Export detailed analysis report");
  
  return suggestions.slice(0, 4);
}

function extractAndValidateJson(rawText: string): any {
  // Remove leading/trailing backticks and whitespace
  let cleanText = rawText.trim();
  cleanText = cleanText.replace(/^```json?\s*/, '').replace(/\s*```$/, '');
  
  // Find JSON boundaries
  const jsonStart = cleanText.indexOf('{');
  const jsonEnd = cleanText.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON object found in AI response");
  }
  
  let candidate = cleanText.substring(jsonStart, jsonEnd + 1);
  
  // Fix common trailing comma issues
  candidate = candidate.replace(/,\s*}/g, '}');
  candidate = candidate.replace(/,\s*]/g, ']');
  
  const parsed = JSON.parse(candidate);
  
  // Validation and normalization
  const required = ['score', 'summary', 'diagram_mermaid', 'cost'];
  for (const key of required) {
    if (!(key in parsed)) {
      throw new Error(`AI response missing required field: ${key}`);
    }
  }
  
  // Normalize score to integer 0-100
  if (typeof parsed.score === 'number') {
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
  } else if (typeof parsed.score === 'string') {
    const nums = parsed.score.match(/\d+/);
    parsed.score = nums ? Math.max(0, Math.min(100, parseInt(nums[0]))) : 0;
  } else {
    parsed.score = 0;
  }
  
  // Ensure cost range coherence
  const costRange = parsed.cost?.range_monthly_usd;
  if (costRange && costRange.low > costRange.high) {
    const temp = costRange.low;
    costRange.low = costRange.high;
    costRange.high = temp;
  }
  
  // Ensure RPO/RTO are integers
  if (parsed.rpo_rto_alignment) {
    if (typeof parsed.rpo_rto_alignment.rpo_minutes === 'number') {
      parsed.rpo_rto_alignment.rpo_minutes = Math.round(parsed.rpo_rto_alignment.rpo_minutes);
    }
    if (typeof parsed.rpo_rto_alignment.rto_minutes === 'number') {
      parsed.rpo_rto_alignment.rto_minutes = Math.round(parsed.rpo_rto_alignment.rto_minutes);
    }
  }
  
  return parsed;
}