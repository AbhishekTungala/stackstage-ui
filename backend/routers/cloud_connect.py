from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from utils.cloud_providers import multi_cloud_service
from utils.firebase_config import firebase_service
import asyncio

router = APIRouter()

class CloudConnectionRequest(BaseModel):
    cloud_provider: str
    aws_access_key: Optional[str] = None
    aws_secret_key: Optional[str] = None
    azure_subscription_id: Optional[str] = None
    gcp_project_id: Optional[str] = None
    user_region: str = "us-east-1"

class RegionOptimizationRequest(BaseModel):
    user_location: str
    cloud_provider: str
    workload_type: str = "web_application"

class MultiCloudAnalysisRequest(BaseModel):
    user_region: str
    current_provider: Optional[str] = None
    requirements: List[str] = ["high_availability", "cost_optimization"]

@router.post("/test-connection")
async def test_cloud_connection(request: CloudConnectionRequest):
    """Test connection to specified cloud provider"""
    try:
        if request.cloud_provider.lower() == "aws":
            result = await multi_cloud_service.test_aws_connection(
                request.aws_access_key, 
                request.aws_secret_key
            )
        elif request.cloud_provider.lower() == "azure":
            result = await multi_cloud_service.test_azure_connection(
                request.azure_subscription_id
            )
        elif request.cloud_provider.lower() == "gcp":
            result = await multi_cloud_service.test_gcp_connection(
                request.gcp_project_id
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported cloud provider")
        
        return {
            "success": result["connected"],
            "cloud_provider": request.cloud_provider,
            "connection_details": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection test failed: {str(e)}")

@router.post("/optimize-regions")
async def optimize_regions(request: RegionOptimizationRequest):
    """Get optimal region recommendations based on user location"""
    try:
        optimal_regions = multi_cloud_service.get_optimal_regions(
            request.user_location,
            request.cloud_provider
        )
        
        # Get cost estimates for top 3 regions
        cost_estimates = []
        for region in optimal_regions[:3]:
            cost_estimate = await multi_cloud_service.get_cloud_costs_estimation(
                request.cloud_provider,
                region["name"],
                ["load_balancer", "compute", "database", "storage"]
            )
            cost_estimates.append(cost_estimate)
        
        return {
            "user_location": request.user_location,
            "cloud_provider": request.cloud_provider,
            "optimal_regions": optimal_regions,
            "cost_estimates": cost_estimates,
            "recommendation": {
                "primary_region": optimal_regions[0]["name"] if optimal_regions else None,
                "backup_region": optimal_regions[1]["name"] if len(optimal_regions) > 1 else None,
                "rationale": f"Primary region offers lowest latency ({optimal_regions[0]['estimated_latency_ms']}ms) from {request.user_location}"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Region optimization failed: {str(e)}")

@router.post("/multi-cloud-analysis")
async def analyze_multi_cloud_setup(request: MultiCloudAnalysisRequest):
    """Analyze and recommend multi-cloud architecture setup"""
    try:
        analysis = await multi_cloud_service.analyze_multi_cloud_setup(request.user_region)
        
        # Get region recommendations for each cloud provider
        aws_regions = multi_cloud_service.get_optimal_regions(request.user_region, "aws")[:2]
        azure_regions = multi_cloud_service.get_optimal_regions(request.user_region, "azure")[:2]
        gcp_regions = multi_cloud_service.get_optimal_regions(request.user_region, "gcp")[:2]
        
        return {
            "multi_cloud_strategy": analysis,
            "recommended_regions": {
                "aws": aws_regions,
                "azure": azure_regions,
                "gcp": gcp_regions
            },
            "implementation_roadmap": [
                {
                    "phase": 1,
                    "duration_weeks": 3,
                    "tasks": ["Setup primary cloud infrastructure", "Implement monitoring", "Deploy application"]
                },
                {
                    "phase": 2,
                    "duration_weeks": 3,
                    "tasks": ["Setup secondary cloud", "Configure data replication", "Test failover procedures"]
                },
                {
                    "phase": 3,
                    "duration_weeks": 2,
                    "tasks": ["Implement disaster recovery", "Optimize costs", "Staff training"]
                }
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-cloud analysis failed: {str(e)}")

@router.get("/supported-regions/{cloud_provider}")
async def get_supported_regions(cloud_provider: str):
    """Get list of supported regions for a cloud provider"""
    try:
        if cloud_provider.lower() == "aws":
            regions = multi_cloud_service.aws_regions
        elif cloud_provider.lower() == "azure":
            regions = multi_cloud_service.azure_regions
        elif cloud_provider.lower() == "gcp":
            regions = multi_cloud_service.gcp_regions
        else:
            raise HTTPException(status_code=400, detail="Unsupported cloud provider")
        
        return {
            "cloud_provider": cloud_provider,
            "supported_regions": regions,
            "total_regions": len(regions)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get regions: {str(e)}")

@router.get("/cost-estimate/{cloud_provider}/{region}")
async def get_cost_estimate(cloud_provider: str, region: str):
    """Get cost estimate for standard architecture in specific region"""
    try:
        cost_estimate = await multi_cloud_service.get_cloud_costs_estimation(
            cloud_provider,
            region,
            ["load_balancer", "compute", "database", "storage", "networking", "cdn"]
        )
        
        return cost_estimate
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cost estimation failed: {str(e)}")

@router.get("/health")
async def cloud_connect_health():
    """Health check for cloud connect service"""
    return {
        "status": "operational", 
        "service": "cloud_connect",
        "supported_providers": ["aws", "azure", "gcp"],
        "features": ["connection_testing", "region_optimization", "multi_cloud_analysis", "cost_estimation"]
    }
