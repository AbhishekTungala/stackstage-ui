import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface AnalyzeRequest {
  project_type: string;
  cloud: string;
  requirements: string[];
  region: string;
  architecture_text: string;
  file_content?: string | null;
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
    // Use OpenRouter API for architecture analysis
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER;
    if (!apiKey) {
      throw new Error("OpenRouter API key not found. Please configure OPENROUTER_API_KEY environment variable.");
    }

    const analysisInput = request.architecture_text || request.file_content || '';
    const cloudProvider = request.cloud || 'aws';
    const projectType = request.project_type || 'comprehensive';
    const region = request.region || 'us-east-1';
    
    if (!analysisInput.trim()) {
      throw new Error("Infrastructure configuration is required for analysis");
    }
    
    const analysisPrompt = `You are a professional cloud architecture expert. Analyze this ${cloudProvider.toUpperCase()} infrastructure configuration for ${projectType} analysis in region ${region}.

🔍 INFRASTRUCTURE AS CODE TO ANALYZE:
${analysisInput}

📋 ANALYSIS REQUIREMENTS: ${(request.requirements || ['security', 'cost-optimization']).join(', ')}

Provide a comprehensive professional analysis as a JSON object with chart-specific data:
{
  "score": integer 0-100 (overall architecture quality),
  "security_score": integer 0-100 (security assessment),
  "performance_score": integer 0-100 (performance optimization),
  "cost_score": integer 0-100 (cost efficiency),
  "reliability_score": integer 0-100 (system reliability),
  "scalability_score": integer 0-100 (scalability rating),
  "compliance_score": integer 0-100 (compliance level),
  "issues": array of detailed security/compliance issues with severity (1-10),
  "recommendations": array of improvement suggestions with:
    - description: detailed recommendation
    - steps: implementation steps array
    - category: "Security|Performance|Cost|Reliability"
    - priority: "high|medium|low"  
    - estimated_savings: monthly cost savings in dollars
  "cost": estimated monthly cost range (e.g., "$500-800/month"),
  "cost_breakdown": {
    "compute": monthly compute costs,
    "storage": monthly storage costs,
    "network": monthly network costs,
    "services": monthly service costs
  },
  "performance_metrics": {
    "avg_response_time": average response time in milliseconds,
    "throughput": requests per second capacity,
    "availability": uptime percentage,
    "error_rate": error percentage
  },
  "trend_analysis": {
    "security_trend": "improving|stable|declining",
    "performance_trend": "improving|stable|declining",
    "cost_trend": "optimizing|stable|increasing"
  },
  "diagram": Mermaid diagram code representing the architecture
}

Analyze for: security vulnerabilities, cost optimization, performance bottlenecks, scalability issues, and ${cloudProvider.toUpperCase()} best practices. Provide realistic numeric values based on the actual infrastructure components.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://stackstage.dev',
        'X-Title': 'StackStage Cloud Analysis'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cloud architect with deep knowledge of AWS, GCP, Azure, and cloud security best practices. Always respond with valid JSON.'
          },
          {
            role: 'user', 
            content: analysisPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "{}";
    
    // Parse AI response and extract analysis data
    let analysisData;
    try {
      // Clean up the response to ensure valid JSON
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '');
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.replace(/\s*```$/, '');
      }
      
      analysisData = JSON.parse(cleanResponse);
      console.log("✅ Successfully parsed AI response JSON");
    } catch (parseError) {
      console.log("⚠️ JSON parsing failed, extracting data from text response:", parseError);
      
      // Try to extract meaningful data from the AI response text
      analysisData = extractDataFromTextResponse(aiResponse, analysisInput);
    }
    
    // Extract comprehensive chart data from AI analysis
    const overallScore = analysisData.score || 75;
    const numIssues = (analysisData.issues || []).length;
    const numRecommendations = (analysisData.recommendations || []).length;
    
    // Use only AI-generated scores - no fallbacks
    const securityScore = analysisData.security_score;
    const performanceScore = analysisData.performance_score;
    const costScore = analysisData.cost_score;
    const reliabilityScore = analysisData.reliability_score;
    const scalabilityScore = analysisData.scalability_score;
    const complianceScore = analysisData.compliance_score;

    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      score: overallScore,
      security_score: securityScore,
      performance_score: performanceScore,
      cost_score: costScore,
      reliability_score: reliabilityScore,
      scalability_score: scalabilityScore,
      compliance_score: complianceScore,
      issues: analysisData.issues,
      recommendations: analysisData.recommendations,
      cost: analysisData.cost,
      cost_breakdown: analysisData.cost_breakdown,
      performance_metrics: analysisData.performance_metrics,
      trend_analysis: analysisData.trend_analysis,
      diagram: analysisData.diagram,
      details: analysisData
    };
    
  } catch (error) {
    console.error("Backend integration error:", error);
    throw error;
  }
}

function extractDataFromTextResponse(aiResponse: string, inputCode: string): any {
  /**
   * Extract structured data from AI text response when JSON parsing fails
   */
  console.log("Extracting data from AI text response...");
  
  // Try to find JSON blocks in the response
  const jsonMatches = aiResponse.match(/\{[\s\S]*\}/);
  if (jsonMatches) {
    try {
      return JSON.parse(jsonMatches[0]);
    } catch (e) {
      console.log("Failed to parse extracted JSON block");
    }
  }
  
  // Analyze the input code to generate meaningful scores
  const inputLower = inputCode.toLowerCase();
  let baseScore = 75;
  const issues = [];
  const recommendations = [];
  
  // Security analysis
  if (!inputLower.includes('encryption') && !inputLower.includes('kms')) {
    issues.push("Encryption configuration missing");
    recommendations.push("Enable encryption at rest and in transit");
    baseScore -= 5;
  }
  
  if (!inputLower.includes('multi') && !inputLower.includes('az')) {
    issues.push("Single AZ deployment detected");
    recommendations.push("Implement multi-AZ deployment for high availability");
    baseScore -= 8;
  }
  
  if (!inputLower.includes('backup') && !inputLower.includes('snapshot')) {
    issues.push("Backup strategy not configured");
    recommendations.push("Configure automated backups and disaster recovery");
    baseScore -= 6;
  }
  
  if (!inputLower.includes('waf') && !inputLower.includes('firewall')) {
    issues.push("Web Application Firewall missing");
    recommendations.push("Deploy WAF for application layer protection");
    baseScore -= 7;
  }
  
  // Include partial AI response content in summary
  const summaryText = aiResponse.substring(0, 300).replace(/[{}[\]"]/g, '');
  
  // Throw error instead of returning hardcoded fallback data
  throw new Error(`Unable to extract valid analysis data from AI response. AI returned unstructured text: ${aiResponse.substring(0, 200)}...`);
}

export async function callPythonAssistant(messages: any[] | string, role?: string): Promise<any> {
  try {
    console.log("Calling OpenAI API for enhanced assistant...");
    
    // Check for API key
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER;
    if (!apiKey) {
      throw new Error("OpenRouter API key not found. Please set OPENROUTER_API_KEY environment variable.");
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
    
    // Call OpenRouter API for assistant responses
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
    
    // Simple and reliable JSON extraction
    let structuredResponse;
    try {
      // Try parsing the AI response directly as JSON (it's already clean)
      const cleanText = aiResponse.trim();
      structuredResponse = JSON.parse(cleanText);
      
      // Validate required fields exist
      if (typeof structuredResponse === 'object' && structuredResponse.score !== undefined) {
        console.log("Direct JSON parsing successful!");
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (parseError: any) {
      console.log("Direct parsing failed, trying extraction:", parseError.message);
      
      try {
        structuredResponse = extractAndValidateJson(aiResponse);
        console.log("Extraction parsing successful!");
      } catch (extractError: any) {
        console.log("🚨 Failed to parse AI response - returning error");
        // Return error instead of generic fallback
        throw new Error(`AI response parsing failed: ${extractError.message}. Raw response: ${aiResponse.substring(0, 200)}...`);
      }
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
    }
    
  } catch (error) {
    console.error("OpenAI Assistant integration error:", error);
    
    // Return error details instead of generic fallback
    return {
      response: `Technical error occurred: ${error.message}. Please check your API configuration and try again.`,
      suggestions: ["Verify OpenRouter API key", "Check internet connection", "Try with a simpler question"],
      timestamp: new Date().toISOString(),
      error: true
    };
  }
}



function getRoleBasedSystemPrompt(role?: string): string {
  const baseStackStagePrompt = `You are StackStage AI, the world's most advanced cloud architecture advisor specializing in AWS, Azure, and GCP enterprise infrastructure.

Your mission: "Build with Confidence" - deliver precise, actionable, and enterprise-grade cloud architecture analysis that empowers teams to ship resilient, compliant, and optimized infrastructure.

EXPERTISE AREAS:
- Security: IAM, encryption, network segmentation, compliance frameworks
- Reliability: Multi-AZ, disaster recovery, backup strategies, fault tolerance  
- Performance: Auto-scaling, caching, CDN optimization, latency reduction
- Cost: Resource optimization, reserved instances, right-sizing, waste elimination
- Compliance: SOC2, HIPAA, GDPR, PCI-DSS requirements

OUTPUT REQUIREMENTS:
Return ONLY valid, properly escaped JSON (no markdown, no prose, no backticks). 
- Escape all quotes inside string values using \"
- Use only ASCII characters in string values 
- No newlines, tabs, or special characters inside strings
- Ensure all string values are properly quoted
- Do not include any text before or after the JSON object

Follow this exact schema:

{
  "score": integer (0-100, overall architecture health),
  "summary": string (2-3 sentence executive summary),
  "rationale": string (detailed technical reasoning for the score),
  "risks": [{"id": string, "title": string, "severity": "critical|high|medium|low", "impact": string, "fix": string, "business_impact": string}],
  "recommendations": [{"title": string, "why": string, "how": string, "iac_snippet": string, "priority": "P0|P1|P2|P3", "effort": "low|medium|high"}],
  "rpo_rto_alignment": {"rpo_minutes": integer, "rto_minutes": integer, "notes": string, "controls": [string]},
  "pci_essentials": [{"control": string, "status": "compliant|gap|not_applicable", "action": string, "priority": "critical|high|medium|low"}],
  "cost": {
    "currency": "USD",
    "assumptions": [string],
    "range_monthly_usd": {"low": number, "high": number},
    "items": [{"service": string, "est_usd": number, "optimization": string}],
    "savings_opportunity": {"potential_monthly_usd": number, "percentage": number}
  },
  "latency": {"primary_region": string, "alt_regions_considered": [string], "notes": string, "performance_score": integer},
  "diagram_mermaid": string (professional architecture diagram),
  "alternatives": [{"name": string, "pros": [string], "cons": [string], "cost_delta_pct": number, "latency_delta_ms": number, "complexity": "low|medium|high"}],
  "security_score": integer (0-100),
  "performance_score": integer (0-100),
  "reliability_score": integer (0-100),
  "cost_score": integer (0-100)
}

QUALITY STANDARDS:
1. Precise Analysis: Base scores on actual architecture patterns, not generic advice
2. Actionable Insights: Every recommendation must include specific implementation steps
3. Business Context: Link technical issues to business impact and risk
4. Professional Precision: Use exact service names, regions, and configurations
5. Enterprise Focus: Consider scale, compliance, and operational requirements
6. Cost Intelligence: Provide realistic estimates with optimization opportunities
7. Visual Excellence: Generate comprehensive Mermaid diagrams showing data flow and components

SCORING METHODOLOGY:
- 90-100: Enterprise-grade, production-ready architecture
- 80-89: Good architecture with minor improvements needed
- 70-79: Solid foundation but requires optimization
- 60-69: Functional but needs significant improvements
- Below 60: Critical issues that pose business risks

Be the senior cloud architect enterprises trust for their most critical infrastructure decisions.`;
  
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
  
  // Find JSON boundaries - look for the outermost braces
  const jsonStart = cleanText.indexOf('{');
  const jsonEnd = cleanText.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON object found in AI response");
  }
  
  let candidate = cleanText.substring(jsonStart, jsonEnd + 1);
  
  // Simple cleanup only - the AI is already returning clean JSON
  let parsed;
  try {
    // First try parsing as-is (AI returns good JSON now)
    parsed = JSON.parse(candidate);
  } catch (e) {
    // Only if parsing fails, try minimal cleanup
    try {
      // Remove trailing commas only
      candidate = candidate.replace(/,\s*}/g, '}');
      candidate = candidate.replace(/,\s*]/g, ']');
      parsed = JSON.parse(candidate);
    } catch (e2) {
      throw new Error(`Failed to parse JSON: ${(e as Error).message}`);
    }
  }
  
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

