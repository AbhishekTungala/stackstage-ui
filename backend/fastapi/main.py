from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import asyncio
import logging

# Import services
from services.analysis_engine import AnalysisEngine
from services.diagram_engine import DiagramEngine
from services.scoring import ScoringEngine

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="StackStage AI Engine",
    version="2.0.0",
    description="Production-grade FastAPI AI backend for StackStage cloud architecture analysis platform"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
analysis_engine = AnalysisEngine()
diagram_engine = DiagramEngine()
scoring_engine = ScoringEngine()

# Request/Response Models
class AnalysisRequest(BaseModel):
    project_type: str = "comprehensive"
    cloud: str = "aws"
    requirements: List[str] = ["security", "cost-optimization", "performance"]
    region: str = "us-east-1"
    architecture_text: str
    file_content: Optional[str] = None

class AssistantRequest(BaseModel):
    message: str
    context: Optional[str] = None
    persona: str = "architect"
    conversation_history: Optional[List[Dict[str, str]]] = None
    analysis_context: Optional[Dict[str, Any]] = None

class DiagramRequest(BaseModel):
    content: str
    diagram_type: str = "architecture"
    format: str = "mermaid"
    theme: str = "default"
    highlight_risks: bool = True

class AnalysisResponse(BaseModel):
    id: str
    score: int
    categories: Dict[str, int]
    verdict: str
    issues: List[str]
    recommendations: List[str]
    timestamp: str
    analysis_mode: str
    cloud_provider: str

@app.get("/")
async def root():
    return {
        "message": "StackStage AI Engine is operational!",
        "status": "healthy",
        "version": "2.0.0",
        "engines": {
            "analysis": "active",
            "diagram": "active", 
            "scoring": "active"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "timestamp": analysis_engine.get_timestamp(),
        "engines_status": {
            "analysis_engine": "operational",
            "diagram_engine": "operational",
            "scoring_engine": "operational"
        }
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_infrastructure(request: AnalysisRequest):
    try:
        logger.info(f"Processing analysis request for {request.cloud} infrastructure")
        
        # Run comprehensive analysis
        result = await analysis_engine.analyze(
            content=request.architecture_text,
            analysis_mode=request.project_type,
            cloud_provider=request.cloud,
            region=request.region,
            requirements=request.requirements,
            file_content=request.file_content
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/assistant")
async def assistant_chat(request: AssistantRequest):
    try:
        logger.info(f"Processing assistant request with persona: {request.persona}")
        
        response = await analysis_engine.get_assistant_response(
            message=request.message,
            context=request.context,
            persona=request.persona,
            conversation_history=request.conversation_history,
            analysis_context=request.analysis_context
        )
        
        return {
            "success": True,
            "response": response,
            "persona": request.persona,
            "timestamp": analysis_engine.get_timestamp()
        }
        
    except Exception as e:
        logger.error(f"Assistant error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Assistant request failed: {str(e)}")

@app.post("/api/diagram")
async def generate_diagram(request: DiagramRequest):
    try:
        logger.info(f"Generating {request.diagram_type} diagram in {request.format} format")
        
        result = await diagram_engine.generate(
            content=request.content,
            diagram_type=request.diagram_type,
            output_format=request.format,
            theme=request.theme,
            highlight_risks=request.highlight_risks
        )
        
        return {
            "success": True,
            "diagram": result,
            "type": request.diagram_type,
            "format": request.format,
            "timestamp": analysis_engine.get_timestamp()
        }
        
    except Exception as e:
        logger.error(f"Diagram generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Diagram generation failed: {str(e)}")

@app.post("/api/score")
async def score_architecture(request: dict):
    try:
        logger.info("Processing architecture scoring request")
        
        result = await scoring_engine.calculate_scores(
            architecture=request.get("architecture", ""),
            cloud_provider=request.get("cloud_provider", "aws"),
            requirements=request.get("requirements", [])
        )
        
        return {
            "success": True,
            "scores": result,
            "timestamp": analysis_engine.get_timestamp()
        }
        
    except Exception as e:
        logger.error(f"Scoring error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")

@app.post("/api/compare")
async def compare_architectures(request: dict):
    try:
        arch1 = request.get("architecture1", "")
        arch2 = request.get("architecture2", "")
        comparison_type = request.get("comparison_type", "all")
        
        logger.info(f"Comparing architectures - type: {comparison_type}")
        
        result = await analysis_engine.compare_architectures(arch1, arch2, comparison_type)
        
        return {
            "success": True,
            "comparison": result,
            "timestamp": analysis_engine.get_timestamp()
        }
        
    except Exception as e:
        logger.error(f"Comparison error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Architecture comparison failed: {str(e)}")

@app.get("/api/templates")
async def get_templates():
    try:
        templates = await diagram_engine.get_templates()
        return {
            "success": True,
            "templates": templates
        }
    except Exception as e:
        logger.error(f"Template retrieval error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve templates")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "timestamp": analysis_engine.get_timestamp()
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )