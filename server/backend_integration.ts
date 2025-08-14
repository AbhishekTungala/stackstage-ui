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

export async function callPythonAssistant(prompt: string, context?: string, conversationHistory?: any[], role?: string): Promise<any> {
  try {
    const pythonScript = `
import sys
import os
import asyncio
import json
sys.path.insert(0, './backend')

async def main():
    try:
        from utils.ai_engine import assistant_chat
        
        result = await assistant_chat(
            prompt="""${prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""",
            context=${context ? `"""${context.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"""` : 'None'},
            conversation_history=${conversationHistory ? JSON.stringify(conversationHistory).replace(/"/g, '\\"') : 'None'},
            role="${role || 'architect'}"
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