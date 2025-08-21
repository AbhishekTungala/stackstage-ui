"""
Cloud Provider Connection Router
Handles authentication and data fetching from AWS, GCP, and Azure
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import boto3
from google.cloud import resource_manager
from google.oauth2 import service_account
from azure.identity import ClientSecretCredential
from azure.mgmt.resource import ResourceManagementClient
import json
import os

router = APIRouter()

class CloudCredentials(BaseModel):
    provider: str
    credentials: Dict[str, str]
    region: str

class ConnectionResponse(BaseModel):
    success: bool
    message: str
    resources: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@router.post("/connect", response_model=ConnectionResponse)
async def connect_cloud_provider(request: CloudCredentials):
    """
    Connect to cloud provider and validate credentials
    Returns basic resource information if connection is successful
    """
    try:
        if request.provider == "aws":
            return await connect_aws(request.credentials, request.region)
        elif request.provider == "gcp":
            return await connect_gcp(request.credentials, request.region)
        elif request.provider == "azure":
            return await connect_azure(request.credentials, request.region)
        else:
            raise HTTPException(status_code=400, detail="Unsupported cloud provider")
    
    except Exception as e:
        return ConnectionResponse(
            success=False,
            message="Connection failed",
            error=str(e)
        )

async def connect_aws(credentials: Dict[str, str], region: str) -> ConnectionResponse:
    """Connect to AWS and fetch basic resource information"""
    try:
        # Create AWS session
        session = boto3.Session(
            aws_access_key_id=credentials.get("accessKeyId"),
            aws_secret_access_key=credentials.get("secretAccessKey"),
            aws_session_token=credentials.get("sessionToken"),
            region_name=region
        )
        
        # Test connection with EC2 client
        ec2_client = session.client('ec2')
        
        # Fetch basic resources for validation
        regions = ec2_client.describe_regions()
        instances = ec2_client.describe_instances()
        vpcs = ec2_client.describe_vpcs()
        
        # Count resources
        instance_count = sum(len(reservation['Instances']) for reservation in instances['Reservations'])
        vpc_count = len(vpcs['Vpcs'])
        region_count = len(regions['Regions'])
        
        return ConnectionResponse(
            success=True,
            message="Successfully connected to AWS",
            resources={
                "provider": "AWS",
                "region": region,
                "instances": instance_count,
                "vpcs": vpc_count,
                "available_regions": region_count,
                "account_id": session.client('sts').get_caller_identity()['Account']
            }
        )
        
    except Exception as e:
        return ConnectionResponse(
            success=False,
            message="AWS connection failed",
            error=f"AWS Error: {str(e)}"
        )

async def connect_gcp(credentials: Dict[str, str], region: str) -> ConnectionResponse:
    """Connect to GCP and fetch basic resource information"""
    try:
        # Parse service account key
        service_account_info = json.loads(credentials.get("serviceAccountKey"))
        
        # Create credentials
        creds = service_account.Credentials.from_service_account_info(service_account_info)
        
        # Test connection with Resource Manager
        client = resource_manager.ProjectsClient(credentials=creds)
        
        project_id = credentials.get("projectId")
        project = client.get_project(name=f"projects/{project_id}")
        
        return ConnectionResponse(
            success=True,
            message="Successfully connected to Google Cloud",
            resources={
                "provider": "GCP",
                "region": region,
                "project_id": project_id,
                "project_name": project.display_name,
                "project_state": project.state.name
            }
        )
        
    except Exception as e:
        return ConnectionResponse(
            success=False,
            message="GCP connection failed",
            error=f"GCP Error: {str(e)}"
        )

async def connect_azure(credentials: Dict[str, str], region: str) -> ConnectionResponse:
    """Connect to Azure and fetch basic resource information"""
    try:
        # Create Azure credentials
        credential = ClientSecretCredential(
            tenant_id=credentials.get("tenantId"),
            client_id=credentials.get("clientId"),
            client_secret=credentials.get("clientSecret")
        )
        
        # Test connection with Resource Management
        subscription_id = credentials.get("subscriptionId")
        resource_client = ResourceManagementClient(credential, subscription_id)
        
        # Fetch resource groups
        resource_groups = list(resource_client.resource_groups.list())
        
        return ConnectionResponse(
            success=True,
            message="Successfully connected to Microsoft Azure",
            resources={
                "provider": "Azure",
                "region": region,
                "subscription_id": subscription_id,
                "resource_groups": len(resource_groups),
                "tenant_id": credentials.get("tenantId")
            }
        )
        
    except Exception as e:
        return ConnectionResponse(
            success=False,
            message="Azure connection failed",
            error=f"Azure Error: {str(e)}"
        )

@router.get("/regions/{provider}")
async def get_provider_regions(provider: str):
    """Get all available regions for a cloud provider"""
    
    regions_data = {
        "aws": [
            {"value": "us-east-1", "label": "US East (N. Virginia)", "location": "Virginia, USA"},
            {"value": "us-east-2", "label": "US East (Ohio)", "location": "Ohio, USA"},
            {"value": "us-west-1", "label": "US West (N. California)", "location": "California, USA"},
            {"value": "us-west-2", "label": "US West (Oregon)", "location": "Oregon, USA"},
            {"value": "ca-central-1", "label": "Canada (Central)", "location": "Montreal, Canada"},
            {"value": "eu-west-1", "label": "Europe (Ireland)", "location": "Dublin, Ireland"},
            {"value": "eu-west-2", "label": "Europe (London)", "location": "London, UK"},
            {"value": "eu-west-3", "label": "Europe (Paris)", "location": "Paris, France"},
            {"value": "eu-central-1", "label": "Europe (Frankfurt)", "location": "Frankfurt, Germany"},
            {"value": "eu-north-1", "label": "Europe (Stockholm)", "location": "Stockholm, Sweden"},
            {"value": "ap-northeast-1", "label": "Asia Pacific (Tokyo)", "location": "Tokyo, Japan"},
            {"value": "ap-northeast-2", "label": "Asia Pacific (Seoul)", "location": "Seoul, South Korea"},
            {"value": "ap-southeast-1", "label": "Asia Pacific (Singapore)", "location": "Singapore"},
            {"value": "ap-southeast-2", "label": "Asia Pacific (Sydney)", "location": "Sydney, Australia"},
            {"value": "ap-south-1", "label": "Asia Pacific (Mumbai)", "location": "Mumbai, India"},
            {"value": "sa-east-1", "label": "South America (São Paulo)", "location": "São Paulo, Brazil"}
        ],
        "gcp": [
            {"value": "us-central1", "label": "US Central (Iowa)", "location": "Iowa, USA"},
            {"value": "us-east1", "label": "US East (South Carolina)", "location": "South Carolina, USA"},
            {"value": "us-east4", "label": "US East (Northern Virginia)", "location": "Virginia, USA"},
            {"value": "us-west1", "label": "US West (Oregon)", "location": "Oregon, USA"},
            {"value": "us-west2", "label": "US West (Los Angeles)", "location": "Los Angeles, USA"},
            {"value": "us-west3", "label": "US West (Salt Lake City)", "location": "Utah, USA"},
            {"value": "us-west4", "label": "US West (Las Vegas)", "location": "Nevada, USA"},
            {"value": "northamerica-northeast1", "label": "Canada (Montreal)", "location": "Montreal, Canada"},
            {"value": "europe-west1", "label": "Europe (Belgium)", "location": "St. Ghislain, Belgium"},
            {"value": "europe-west2", "label": "Europe (London)", "location": "London, UK"},
            {"value": "europe-west3", "label": "Europe (Frankfurt)", "location": "Frankfurt, Germany"},
            {"value": "europe-west4", "label": "Europe (Netherlands)", "location": "Eemshaven, Netherlands"},
            {"value": "europe-west6", "label": "Europe (Zurich)", "location": "Zurich, Switzerland"},
            {"value": "asia-east1", "label": "Asia (Taiwan)", "location": "Changhua County, Taiwan"},
            {"value": "asia-northeast1", "label": "Asia (Tokyo)", "location": "Tokyo, Japan"},
            {"value": "asia-northeast2", "label": "Asia (Osaka)", "location": "Osaka, Japan"},
            {"value": "asia-southeast1", "label": "Asia (Singapore)", "location": "Jurong West, Singapore"},
            {"value": "asia-south1", "label": "Asia (Mumbai)", "location": "Mumbai, India"}
        ],
        "azure": [
            {"value": "eastus", "label": "East US", "location": "Virginia, USA"},
            {"value": "eastus2", "label": "East US 2", "location": "Virginia, USA"},
            {"value": "westus", "label": "West US", "location": "California, USA"},
            {"value": "westus2", "label": "West US 2", "location": "Washington, USA"},
            {"value": "westus3", "label": "West US 3", "location": "Arizona, USA"},
            {"value": "centralus", "label": "Central US", "location": "Iowa, USA"},
            {"value": "northcentralus", "label": "North Central US", "location": "Illinois, USA"},
            {"value": "southcentralus", "label": "South Central US", "location": "Texas, USA"},
            {"value": "canadacentral", "label": "Canada Central", "location": "Toronto, Canada"},
            {"value": "canadaeast", "label": "Canada East", "location": "Quebec City, Canada"},
            {"value": "westeurope", "label": "West Europe", "location": "Netherlands"},
            {"value": "northeurope", "label": "North Europe", "location": "Ireland"},
            {"value": "uksouth", "label": "UK South", "location": "London, UK"},
            {"value": "ukwest", "label": "UK West", "location": "Cardiff, UK"},
            {"value": "francecentral", "label": "France Central", "location": "Paris, France"},
            {"value": "germanywestcentral", "label": "Germany West Central", "location": "Frankfurt, Germany"},
            {"value": "japaneast", "label": "Japan East", "location": "Tokyo, Japan"},
            {"value": "japanwest", "label": "Japan West", "location": "Osaka, Japan"},
            {"value": "australiaeast", "label": "Australia East", "location": "New South Wales, Australia"},
            {"value": "australiasoutheast", "label": "Australia Southeast", "location": "Victoria, Australia"}
        ]
    }
    
    if provider not in regions_data:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    return {"regions": regions_data[provider]}