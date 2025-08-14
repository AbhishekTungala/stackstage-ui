from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import List, Literal, Optional
from utils.ai_engine import assistant_chat
from utils.pdf_export import export_chat_pdf
import os

router = APIRouter()

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class AssistantPayload(BaseModel):
    messages: List[Message]
    role: Optional[Literal["CTO", "DevOps", "Architect"]] = None

@router.post("/chat")
async def chat(payload: AssistantPayload):
    """Enhanced AI assistant chat with conversation memory and role context"""
    try:
        if not payload.messages or len(payload.messages) == 0:
            raise HTTPException(status_code=400, detail="Messages cannot be empty")
        
        # Convert messages to dict format for AI engine
        message_dicts = [{"role": m.role, "content": m.content} for m in payload.messages]
        
        result = await assistant_chat(message_dicts, payload.role)
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/export/pdf")
async def export_pdf(payload: AssistantPayload):
    """Export chat conversation to PDF"""
    try:
        message_dicts = [m.dict() for m in payload.messages]
        path = export_chat_pdf(message_dicts)
        
        with open(path, "rb") as f:
            pdf_content = f.read()
        
        return Response(
            content=pdf_content, 
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="stackstage_chat.pdf"'}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")

@router.post("/export/txt")
async def export_txt(payload: AssistantPayload):
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