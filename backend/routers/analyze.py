from fastapi import APIRouter, HTTPException, File, UploadFile
from models.schemas import AnalyzeRequest, AnalyzeResponse, InfrastructureCode
from utils.ai_engine import analyze_architecture
from typing import Optional
import json
try:
    import yaml
except ImportError:
    yaml = None

router = APIRouter()

@router.post("/", response_model=AnalyzeResponse)
async def analyze(data: AnalyzeRequest):
    """Analyze cloud architecture for security, performance, and cost optimization"""
    try:
        # Validate input
        if not data.architecture_text and not data.file_content:
            raise HTTPException(status_code=400, detail="Architecture description or file content is required")
        
        # Use architecture_text or file_content for analysis
        analysis_input = data.architecture_text or data.file_content or ""
        
        if not analysis_input.strip():
            raise HTTPException(status_code=400, detail="Architecture description cannot be empty")
        
        # Perform analysis
        result = await analyze_architecture(data)
        
        # Structure the response according to the new schema
        return AnalyzeResponse(
            score=result.get("score", {}).get("overall", 75),
            issues=[issue.get("detail", str(issue)) if isinstance(issue, dict) else str(issue) 
                   for issue in result.get("issues", [])],
            recommendations=[rec.get("title", str(rec)) if isinstance(rec, dict) else str(rec) 
                           for rec in result.get("recommendations", [])],
            diagram=result.get("diagram_mermaid", result.get("diagram", "graph TD; A[Analysis] --> B[Complete]")),
            diagram_image=None,  # Can be enhanced later
            infrastructure_code=InfrastructureCode(
                terraform=result.get("recommendations", [{}])[0].get("iac_fix", "# Terraform configuration\n# Add your resources here") if result.get("recommendations") else "# Terraform configuration\n# Add your resources here",
                cloudformation=None
            ),
            estimated_cost=f"${result.get('estimated_cost', {}).get('monthly', 500)}/month"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/upload")
async def analyze_file(file: UploadFile = File(...)):
    """Analyze uploaded architecture file (YAML/JSON)"""
    try:
        # Read file content
        content = await file.read()
        
        # Parse based on file type
        if file.filename.endswith(('.yml', '.yaml')):
            try:
                parsed_content = yaml.safe_load(content)
                file_content = yaml.dump(parsed_content, default_flow_style=False)
            except:
                file_content = content.decode('utf-8')
        elif file.filename.endswith('.json'):
            try:
                parsed_content = json.loads(content)
                file_content = json.dumps(parsed_content, indent=2)
            except:
                file_content = content.decode('utf-8')
        else:
            file_content = content.decode('utf-8')
        
        # Create analysis request
        analysis_request = AnalyzeRequest(
            project_type="uploaded_file",
            cloud="aws",  # Default, can be inferred from content
            requirements=["security", "performance", "cost_optimization"],
            region="us-east-1",
            architecture_text=None,
            file_content=file_content
        )
        
        # Perform analysis
        result = await analyze_architecture(analysis_request)
        
        return {
            "success": True,
            "filename": file.filename,
            "analysis": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File analysis failed: {str(e)}")

@router.get("/health")
async def analyze_health():
    """Health check for analyze endpoint"""
    return {"status": "operational", "service": "analyze"}