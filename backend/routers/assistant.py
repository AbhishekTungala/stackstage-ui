from fastapi import APIRouter, HTTPException, Response
from models.schemas import Message, AssistantRequest, AssistantResponse, RoleType
from utils.ai_engine import assistant_chat
from utils.pdf_export_chat import generate_chat_pdf
from typing import Dict, Any, List, Literal
import os

router = APIRouter()

# Session storage for conversation memory (in production, use Redis or database)
session_memory: Dict[str, List[Dict[str, str]]] = {}

@router.post("/chat", response_model=AssistantResponse)
async def chat(payload: AssistantRequest):
    """Enhanced AI assistant chat with conversation memory and role context"""
    try:
        if not payload.messages or len(payload.messages) == 0:
            raise HTTPException(status_code=400, detail="Messages cannot be empty")
        
        # Convert messages to dict format for AI engine
        message_dicts = [{"role": m.role, "content": m.content} for m in payload.messages]
        
        # Call the updated assistant_chat function
        result = await assistant_chat(message_dicts, payload.role)
        
        return AssistantResponse(
            response=result.get("response", ""),
            suggestions=result.get("suggestions", [])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/")
async def assistant(payload: AssistantRequest):
    """Main assistant endpoint for backward compatibility"""
    return await chat(payload)

@router.post("/export/pdf")
async def export_pdf(payload: AssistantRequest):
    """Export chat conversation to PDF"""
    try:
        message_dicts = [m.dict() for m in payload.messages]
        pdf_bytes = generate_chat_pdf(message_dicts)
        
        return Response(
            content=pdf_bytes, 
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="stackstage_chat.pdf"'}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")

# Chat memory management
@router.post("/memory/{session_id}")
async def store_message(session_id: str, message: Message):
    """Store message in session memory"""
    if session_id not in session_memory:
        session_memory[session_id] = []
    
    session_memory[session_id].append(message.dict())
    
    # Keep only last 20 messages for memory efficiency
    if len(session_memory[session_id]) > 20:
        session_memory[session_id] = session_memory[session_id][-20:]
    
    return {"success": True, "message_count": len(session_memory[session_id])}

@router.get("/memory/{session_id}")
async def get_session_memory(session_id: str):
    """Get conversation history for session"""
    return {
        "session_id": session_id,
        "messages": session_memory.get(session_id, []),
        "message_count": len(session_memory.get(session_id, []))
    }

@router.post("/export/txt")
async def export_txt(payload: AssistantRequest):
    """Export chat conversation to text file"""
    try:
        lines = [f"{m.role.upper()}: {m.content}" for m in payload.messages]
        txt_content = "\n\n".join(lines)
        
        return Response(
            content=txt_content, 
            media_type="text/plain",
            headers={"Content-Disposition": 'attachment; filename="stackstage_chat.txt"'}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text export failed: {str(e)}")

@router.delete("/memory/{session_id}")
async def clear_session_memory(session_id: str):
    """Clear conversation history for session"""
    if session_id in session_memory:
        del session_memory[session_id]
    
    return {"success": True, "message": f"Session {session_id} memory cleared"}

@router.get("/templates/{role}")
async def get_role_templates(role: Literal["CTO", "DevOps", "Architect"]):
    """Get role-specific conversation templates"""
    templates = {
        "CTO": [
            {
                "title": "PCI Compliance & Cost Optimization",
                "description": "Audit PCI posture and identify 20% cost reduction opportunities",
                "prompt": "Audit our PCI posture and cost hot-spots for a 2-AZ AWS SaaS (RDS, ECS, NAT x2). Propose 20% cost cut without reducing 99.9% SLO.",
                "category": "security"
            },
            {
                "title": "Cloud ROI Analysis",
                "description": "Analyze current cloud spend and return on investment",
                "prompt": "What's our current cloud spend breakdown and ROI analysis?",
                "category": "finance"
            },
            {
                "title": "SOC 2 Compliance Strategy",
                "description": "Ensure SOC 2 compliance across multi-cloud setup",
                "prompt": "How do we ensure SOC 2 compliance across our multi-cloud setup?",
                "category": "compliance"
            }
        ],
        "DevOps": [
            {
                "title": "Blue/Green CI/CD Pipeline",
                "description": "Design automated blue/green deployment with canary releases",
                "prompt": "Design GitHub Actions → ECS blue/green with canary, automated rollbacks, infra drift detection.",
                "category": "automation"
            },
            {
                "title": "Zero-Downtime Deployments",
                "description": "Implement continuous deployment without service interruption",
                "prompt": "How can we implement zero-downtime deployments?",
                "category": "deployment"
            },
            {
                "title": "Kubernetes Monitoring",
                "description": "Add comprehensive monitoring for Kubernetes cluster",
                "prompt": "What monitoring should we add for our Kubernetes cluster?",
                "category": "monitoring"
            }
        ],
        "Architect": [
            {
                "title": "Multi-Region DR Strategy",
                "description": "Compare DR patterns with specific RPO/RTO requirements",
                "prompt": "Compare active-passive multi-region vs pilot-light for RPO≤5m, RTO≤30m, 50k DAU. Include data replication, DNS failover, and cost deltas.",
                "category": "architecture"
            },
            {
                "title": "Microservices Communication",
                "description": "Design secure microservices communication patterns",
                "prompt": "How should we design our microservices communication patterns?",
                "category": "design"
            },
            {
                "title": "Service Mesh Security",
                "description": "Implement proper service mesh security configuration",
                "prompt": "How do we implement proper service mesh security?",
                "category": "security"
            }
        ]
    }
    
    return {"templates": templates.get(role, [])}

@router.get("/health")
async def assistant_health():
    """Health check for assistant endpoint"""
    return {"status": "operational", "service": "assistant"}