from fastapi import APIRouter, HTTPException
from models.schemas import AssistantRequest, AssistantResponse
from utils.ai_engine import assistant_chat

router = APIRouter()

@router.post("/", response_model=AssistantResponse)
async def chat(data: AssistantRequest):
    """Handle AI assistant chat interactions"""
    try:
        if not data.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
        result = await assistant_chat(data.prompt, data.context)
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.get("/health")
async def assistant_health():
    """Health check for assistant endpoint"""
    return {"status": "operational", "service": "assistant"}