from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    architecture_text: str
    user_region: Optional[str] = "us-east-1"

class AnalyzeResponse(BaseModel):
    score: int
    issues: List[str]
    recommendations: List[str]
    diagram: str
    estimated_cost: str
    analysis_id: str
    timestamp: str
    details: Dict[str, Any]

class AssistantRequest(BaseModel):
    prompt: str
    context: Optional[str] = None

class AssistantResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
    timestamp: str

class DiagramRequest(BaseModel):
    architecture_type: Optional[str] = "web-app"
    components: Optional[List[str]] = None

class DiagramResponse(BaseModel):
    diagram: str
    diagram_type: str
    legend: Dict[str, str]