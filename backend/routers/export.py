from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Dict, Any
from utils.pdf_export import generate_analysis_pdf, generate_pdf_base64

router = APIRouter()

class ExportRequest(BaseModel):
    analysis_data: Dict[str, Any]
    format: str = "pdf"

class ExportResponse(BaseModel):
    download_url: str
    file_name: str
    format: str
    size_kb: int

@router.post("/pdf", response_class=Response)
async def export_pdf(data: ExportRequest):
    """Export analysis results as PDF"""
    try:
        if data.format.lower() != "pdf":
            raise HTTPException(status_code=400, detail="Only PDF format is currently supported")
        
        # Validate required analysis data
        required_fields = ['score', 'issues', 'recommendations', 'timestamp']
        missing_fields = [field for field in required_fields if field not in data.analysis_data]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required analysis data fields: {', '.join(missing_fields)}"
            )
        
        # Generate PDF
        pdf_bytes = generate_analysis_pdf(data.analysis_data)
        
        # Create filename with analysis ID and timestamp
        analysis_id = data.analysis_data.get('analysis_id', 'unknown')
        timestamp = data.analysis_data.get('timestamp', '').split('T')[0]  # Get date part
        filename = f"stackstage_analysis_{analysis_id[:8]}_{timestamp}.pdf"
        
        # Return PDF as response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Length": str(len(pdf_bytes))
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.post("/pdf-base64")
async def export_pdf_base64(data: ExportRequest):
    """Export analysis results as base64-encoded PDF for frontend download"""
    try:
        if data.format.lower() != "pdf":
            raise HTTPException(status_code=400, detail="Only PDF format is currently supported")
        
        # Validate required analysis data
        required_fields = ['score', 'issues', 'recommendations', 'timestamp']
        missing_fields = [field for field in required_fields if field not in data.analysis_data]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required analysis data fields: {', '.join(missing_fields)}"
            )
        
        # Generate base64 PDF
        pdf_base64 = generate_pdf_base64(data.analysis_data)
        
        # Create filename
        analysis_id = data.analysis_data.get('analysis_id', 'unknown')
        timestamp = data.analysis_data.get('timestamp', '').split('T')[0]
        filename = f"stackstage_analysis_{analysis_id[:8]}_{timestamp}.pdf"
        
        return {
            "pdf_base64": pdf_base64,
            "filename": filename,
            "content_type": "application/pdf",
            "size_kb": round(len(pdf_base64) * 0.75 / 1024, 2)  # Approximate size after base64 encoding
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.get("/formats")
async def get_export_formats():
    """Get available export formats"""
    return {
        "formats": [
            {
                "format": "pdf",
                "name": "PDF Report",
                "description": "Professional PDF report with analysis results",
                "mime_type": "application/pdf",
                "supported": True
            }
        ]
    }

@router.get("/health")
async def export_health():
    """Health check for export endpoint"""
    return {"status": "operational", "service": "export"}