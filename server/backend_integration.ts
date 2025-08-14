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
    console.log("Calling Python backend for assistant...");
    
    // Handle different input formats
    let requestData: any;
    
    if (Array.isArray(messages)) {
      // New format: array of messages with role context
      requestData = {
        messages: messages,
        role: role || null
      };
    } else {
      // Legacy format: single prompt string
      const cleanPrompt = typeof messages === 'string' 
        ? messages.replace(/[^\w\s.,!?-]/g, '').trim()
        : JSON.stringify(messages).replace(/[^\w\s.,!?-]/g, '').trim();
        
      requestData = {
        prompt: cleanPrompt,
        context: role
      };
    }
    
    const pythonScript = `
import sys
import os
import asyncio
import json
sys.path.insert(0, './backend')

async def main():
    try:
        from utils.ai_engine import assistant_chat
        
        # Handle different input formats
        request_data = ${JSON.stringify(requestData)}
        
        if 'messages' in request_data:
            # New enhanced format
            result = await assistant_chat(
                messages=request_data['messages'],
                role=request_data.get('role', 'Architect')
            )
        else:
            # Legacy format
            result = await assistant_chat(
                prompt=request_data['prompt'],
                context=request_data.get('context', ''),
                role=request_data.get('role', 'Architect')
            )
        
        print(json.dumps(result, default=str))
    except Exception as e:
        print(json.dumps({"error": str(e)}, default=str))

asyncio.run(main())
    `;

    const { stdout, stderr } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
    
    if (stderr && stderr.trim()) {
      console.error("Python assistant stderr:", stderr);
    }
    
    const result = JSON.parse(stdout.trim());
    
    if (result.error) {
      throw new Error(`Python assistant error: ${result.error}`);
    }
    
    return result;
    
  } catch (error) {
    console.error("Assistant integration error:", error);
    throw error;
  }
}