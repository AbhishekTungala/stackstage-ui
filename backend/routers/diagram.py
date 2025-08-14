from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.schemas import DiagramRequest, DiagramResponse

router = APIRouter()

@router.post("/", response_model=DiagramResponse)
async def generate_diagram(data: DiagramRequest):
    """Generate Mermaid diagram based on architecture type"""
    try:
        # Generate diagram based on architecture type
        diagrams = {
            "web-app": """graph TD
                A[Users] --> B[Load Balancer]
                B --> C[Web Servers]
                C --> D[Application Layer]
                D --> E[Database]
                C --> F[Cache]
                D --> G[External APIs]""",
            
            "microservices": """graph TD
                A[API Gateway] --> B[User Service]
                A --> C[Product Service] 
                A --> D[Order Service]
                B --> E[User DB]
                C --> F[Product DB]
                D --> G[Order DB]
                H[Message Queue] --> B
                H --> C
                H --> D""",
            
            "serverless": """graph TD
                A[Users] --> B[CloudFront CDN]
                B --> C[API Gateway]
                C --> D[Lambda Functions]
                D --> E[DynamoDB]
                D --> F[S3 Storage]
                G[SQS Queue] --> D
                H[EventBridge] --> D""",
                
            "data-pipeline": """graph TD
                A[Data Sources] --> B[Data Ingestion]
                B --> C[Data Processing]
                C --> D[Data Storage]
                D --> E[Analytics]
                E --> F[Dashboards]
                C --> G[ML Models]"""
        }
        
        diagram = diagrams.get(data.architecture_type or "web-app", diagrams["web-app"])
        
        legend = {
            "Users": "End users accessing the system",
            "Load Balancer": "Distributes incoming requests",
            "Web Servers": "Handle HTTP requests",
            "Database": "Persistent data storage",
            "Cache": "High-speed data cache",
            "APIs": "External service integrations"
        }
        
        return DiagramResponse(
            diagram=diagram,
            diagram_type=data.architecture_type or "web-app",
            legend=legend
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagram generation failed: {str(e)}")

@router.get("/templates")
async def get_diagram_templates():
    """Get available diagram templates"""
    templates = [
        {
            "type": "web-app",
            "name": "Web Application",
            "description": "Standard 3-tier web application architecture"
        },
        {
            "type": "microservices", 
            "name": "Microservices",
            "description": "Distributed microservices architecture"
        },
        {
            "type": "serverless",
            "name": "Serverless",
            "description": "Cloud-native serverless architecture"
        },
        {
            "type": "data-pipeline",
            "name": "Data Pipeline", 
            "description": "Data processing and analytics pipeline"
        }
    ]
    
    return {"templates": templates}

@router.get("/health")
async def diagram_health():
    """Health check for diagram endpoint"""
    return {"status": "operational", "service": "diagram"}