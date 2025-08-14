from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest, AnalyzeResponse
from utils.ai_engine import analyze_architecture

router = APIRouter()

@router.post("/", response_model=AnalyzeResponse)
async def analyze(data: AnalyzeRequest):
    """Analyze cloud architecture for security, performance, and cost optimization"""
    try:
        if not data.architecture_text.strip():
            raise HTTPException(status_code=400, detail="Architecture description cannot be empty")
        
        result = await analyze_architecture(data)
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/health")
async def analyze_health():
    """Health check for analyze endpoint"""
    return {"status": "operational", "service": "analyze"}