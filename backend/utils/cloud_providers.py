import os
import boto3
import asyncio
from typing import Dict, Any, List, Optional, Tuple
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
try:
    from google.cloud import resourcemanager
    from google.auth import default as google_default
    HAS_GCP = True
except ImportError:
    resourcemanager = None
    google_default = None
    HAS_GCP = False
from dotenv import load_dotenv
import json
import requests
from datetime import datetime

# Load environment variables
load_dotenv()

class MultiCloudProvider:
    """Multi-cloud provider integration for StackStage"""
    
    def __init__(self):
        self.aws_regions = [
            "us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", 
            "ap-northeast-1", "eu-central-1", "us-west-1", "ap-south-1"
        ]
        self.azure_regions = [
            "eastus", "westus2", "westeurope", "southeastasia",
            "japaneast", "germanywestcentral", "centralus", "southindia"
        ]
        self.gcp_regions = [
            "us-central1", "us-west1", "europe-west1", "asia-southeast1",
            "asia-northeast1", "europe-central2", "us-east1", "asia-south1"
        ]
    
    def get_optimal_regions(self, user_location: str, cloud_provider: str) -> List[Dict[str, Any]]:
        """Get optimal regions based on user location and latency estimates"""
        
        region_latency_map = {
            "us-east": {
                "aws": [("us-east-1", 10), ("us-west-2", 70), ("eu-west-1", 80)],
                "azure": [("eastus", 8), ("westus2", 68), ("westeurope", 82)],
                "gcp": [("us-central1", 12), ("us-west1", 65), ("europe-west1", 85)]
            },
            "us-west": {
                "aws": [("us-west-2", 8), ("us-east-1", 70), ("ap-southeast-1", 120)],
                "azure": [("westus2", 6), ("eastus", 68), ("southeastasia", 118)],
                "gcp": [("us-west1", 10), ("us-central1", 45), ("asia-southeast1", 115)]
            },
            "europe": {
                "aws": [("eu-west-1", 8), ("eu-central-1", 15), ("us-east-1", 80)],
                "azure": [("westeurope", 6), ("germanywestcentral", 12), ("eastus", 82)],
                "gcp": [("europe-west1", 10), ("europe-central2", 18), ("us-central1", 85)]
            },
            "asia": {
                "aws": [("ap-southeast-1", 8), ("ap-northeast-1", 25), ("ap-south-1", 35)],
                "azure": [("southeastasia", 6), ("japaneast", 22), ("southindia", 32)],
                "gcp": [("asia-southeast1", 10), ("asia-northeast1", 28), ("asia-south1", 38)]
            }
        }
        
        # Determine user region category
        location_key = "us-east"  # default
        if "west" in user_location.lower() or "california" in user_location.lower():
            location_key = "us-west"
        elif any(region in user_location.lower() for region in ["europe", "uk", "germany", "france"]):
            location_key = "europe"
        elif any(region in user_location.lower() for region in ["asia", "japan", "singapore", "india"]):
            location_key = "asia"
        
        regions = region_latency_map.get(location_key, region_latency_map["us-east"])
        provider_regions = regions.get(cloud_provider, regions["aws"])
        
        return [
            {
                "name": region,
                "estimated_latency_ms": latency,
                "recommended": i == 0,
                "availability_zones": 3 if cloud_provider != "gcp" else 3,
                "cost_multiplier": 1.0 if i == 0 else 1.1 + (i * 0.05)
            }
            for i, (region, latency) in enumerate(provider_regions[:5])
        ]
    
    async def test_aws_connection(self, access_key: str = None, secret_key: str = None) -> Dict[str, Any]:
        """Test AWS connection and gather account information"""
        try:
            session = boto3.Session(
                aws_access_key_id=access_key or os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=secret_key or os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            
            # Test connection with STS
            sts = session.client('sts')
            identity = sts.get_caller_identity()
            
            # Get available regions
            ec2 = session.client('ec2', region_name='us-east-1')
            regions = ec2.describe_regions()['Regions']
            
            return {
                "connected": True,
                "account_id": identity['Account'],
                "user_arn": identity['Arn'],
                "available_regions": [r['RegionName'] for r in regions],
                "services_available": ["EC2", "RDS", "S3", "Lambda", "ECS", "EKS"],
                "connection_test_time": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "services_available": [],
                "connection_test_time": datetime.now().isoformat()
            }
    
    async def test_azure_connection(self, subscription_id: str = None) -> Dict[str, Any]:
        """Test Azure connection and gather subscription information"""
        try:
            credential = DefaultAzureCredential()
            sub_id = subscription_id or os.getenv('AZURE_SUBSCRIPTION_ID')
            
            if not sub_id:
                raise ValueError("Azure subscription ID not provided")
            
            resource_client = ResourceManagementClient(credential, sub_id)
            
            # Test connection by listing resource groups
            resource_groups = list(resource_client.resource_groups.list())
            
            return {
                "connected": True,
                "subscription_id": sub_id,
                "resource_groups_count": len(resource_groups),
                "available_regions": self.azure_regions,
                "services_available": ["Virtual Machines", "App Service", "SQL Database", "Storage", "AKS"],
                "connection_test_time": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "services_available": [],
                "connection_test_time": datetime.now().isoformat()
            }
    
    async def test_gcp_connection(self, project_id: str = None) -> Dict[str, Any]:
        """Test GCP connection and gather project information"""
        try:
            credentials, default_project = google_default()
            proj_id = project_id or default_project or os.getenv('GCP_PROJECT_ID')
            
            if not proj_id:
                raise ValueError("GCP project ID not provided")
            
            client = resource_manager.Client(credentials=credentials)
            project = client.get_project(proj_id)
            
            return {
                "connected": True,
                "project_id": proj_id,
                "project_name": project.name,
                "project_number": project.project_number,
                "available_regions": self.gcp_regions,
                "services_available": ["Compute Engine", "Cloud SQL", "GKS", "Cloud Storage", "Cloud Functions"],
                "connection_test_time": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "services_available": [],
                "connection_test_time": datetime.now().isoformat()
            }
    
    async def get_cloud_costs_estimation(self, 
                                       cloud_provider: str, 
                                       region: str, 
                                       architecture_components: List[str]) -> Dict[str, Any]:
        """Estimate costs for cloud architecture components"""
        
        # Base cost estimates per region (monthly USD)
        base_costs = {
            "aws": {
                "load_balancer": 25,
                "ec2_t3_medium": 35,
                "rds_db_t3_micro": 20,
                "s3_storage_100gb": 23,
                "nat_gateway": 45,
                "cloudfront": 15
            },
            "azure": {
                "load_balancer": 22,
                "vm_standard_b2s": 31,
                "sql_database_basic": 15,
                "blob_storage_100gb": 21,
                "nat_gateway": 40,
                "cdn": 12
            },
            "gcp": {
                "load_balancer": 20,
                "compute_n1_standard_1": 30,
                "cloud_sql_db_f1_micro": 18,
                "cloud_storage_100gb": 20,
                "cloud_nat": 38,
                "cloud_cdn": 10
            }
        }
        
        provider_costs = base_costs.get(cloud_provider, base_costs["aws"])
        
        # Regional cost multipliers
        region_multiplier = 1.0
        if "west" in region or "us-west" in region:
            region_multiplier = 1.1
        elif "europe" in region or "eu-" in region:
            region_multiplier = 1.15
        elif "asia" in region or "ap-" in region:
            region_multiplier = 1.2
        
        estimated_monthly_cost = sum(provider_costs.values()) * region_multiplier
        
        return {
            "cloud_provider": cloud_provider,
            "region": region,
            "estimated_monthly_usd": round(estimated_monthly_cost, 2),
            "cost_breakdown": {k: round(v * region_multiplier, 2) for k, v in provider_costs.items()},
            "region_multiplier": region_multiplier,
            "cost_calculation_time": datetime.now().isoformat(),
            "components_included": list(provider_costs.keys())
        }
    
    async def analyze_multi_cloud_setup(self, user_region: str) -> Dict[str, Any]:
        """Analyze and recommend multi-cloud setup strategies"""
        
        recommendations = {
            "primary_cloud": "aws",
            "secondary_cloud": "azure", 
            "disaster_recovery_cloud": "gcp",
            "strategy": "active-passive",
            "estimated_setup_time_weeks": 8,
            "complexity_score": 7,  # out of 10
            "monthly_cost_estimate_usd": 1200,
            "benefits": [
                "99.99% uptime across multiple providers",
                "Reduced vendor lock-in risks", 
                "Geographic redundancy and compliance flexibility",
                "Cost optimization through provider arbitrage"
            ],
            "challenges": [
                "Increased operational complexity",
                "Data synchronization overhead",
                "Multiple billing and monitoring systems",
                "Staff training across multiple platforms"
            ],
            "recommended_architecture": {
                "primary": f"AWS {self.get_optimal_regions(user_region, 'aws')[0]['name']}",
                "secondary": f"Azure {self.get_optimal_regions(user_region, 'azure')[0]['name']}",
                "data_replication": "Cross-cloud database replication with 5min RPO",
                "traffic_routing": "DNS-based failover with health checks",
                "monitoring": "Unified monitoring across all cloud providers"
            }
        }
        
        return recommendations

# Global multi-cloud service instance
multi_cloud_service = MultiCloudProvider()
