from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from enum import Enum

class CloudProvider(str, Enum):
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"

class RoleType(str, Enum):
    CTO = "CTO"
    DEVOPS = "DevOps"
    ARCHITECT = "Architect"

class AnalyzeRequest(BaseModel):
    project_type: str = Field(..., description="Type of project (e.g., ecommerce, fintech)")
    cloud: CloudProvider = Field(..., description="Cloud provider")
    requirements: List[str] = Field(..., description="List of requirements")
    region: str = Field(..., description="Cloud region")
    architecture_text: Optional[str] = Field(None, description="Architecture description or uploaded file content")
    file_content: Optional[str] = Field(None, description="Uploaded file content (YAML/JSON)")
    
class InfrastructureCode(BaseModel):
    terraform: str = Field(..., description="Terraform configuration")
    cloudformation: Optional[str] = Field(None, description="CloudFormation template")
    
class AnalyzeResponse(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Architecture score")
    issues: List[str] = Field(..., description="Identified issues")
    recommendations: List[str] = Field(..., description="Improvement recommendations")
    diagram: str = Field(..., description="Mermaid diagram code")
    diagram_image: Optional[str] = Field(None, description="Base64 or URL of diagram image")
    infrastructure_code: InfrastructureCode = Field(..., description="Infrastructure as code")
    estimated_cost: str = Field(..., description="Estimated monthly cost")
    
class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str
    
class AssistantRequest(BaseModel):
    messages: List[Message] = Field(..., description="Conversation messages")
    role: Optional[RoleType] = Field(None, description="User role context")
    
class AssistantResponse(BaseModel):
    response: str = Field(..., description="AI assistant response")
    suggestions: List[str] = Field(..., description="Follow-up suggestions")
    
class AuthRequest(BaseModel):
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")
    
class AuthResponse(BaseModel):
    success: bool = Field(..., description="Authentication success")
    message: str = Field(..., description="Response message")
    token: Optional[str] = Field(None, description="Firebase ID token")
    user_id: Optional[str] = Field(None, description="User ID")
    
class PDFExportRequest(BaseModel):
    analysis_data: Optional[AnalyzeResponse] = Field(None, description="Analysis results to export")
    chat_messages: Optional[List[Message]] = Field(None, description="Chat messages to export")
    export_type: Literal["analysis", "chat"] = Field(..., description="Type of export")
    
# Legacy schemas for backward compatibility
class DiagramRequest(BaseModel):
    architecture_type: Optional[str] = "web-app"
    components: Optional[List[str]] = None

class DiagramResponse(BaseModel):
    diagram: str
    diagram_type: str
    legend: Dict[str, str]