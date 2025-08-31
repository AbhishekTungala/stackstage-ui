import asyncio
import re
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class ScoringEngine:
    def __init__(self):
        self.scoring_weights = {
            "security": 0.25,
            "reliability": 0.25,
            "scalability": 0.20,
            "performance": 0.15,
            "cost": 0.15
        }
        
        self.scoring_criteria = self._load_scoring_criteria()
    
    async def calculate_scores(
        self,
        architecture: str,
        cloud_provider: str = "aws",
        requirements: List[str] = None
    ) -> Dict[str, int]:
        """
        Calculate comprehensive scores for architecture
        """
        try:
            logger.info(f"Calculating scores for {cloud_provider} architecture")
            
            # Analyze architecture content
            analysis = await self._analyze_architecture(architecture, cloud_provider)
            
            # Calculate individual scores
            security_score = await self._calculate_security_score(analysis, architecture)
            reliability_score = await self._calculate_reliability_score(analysis, architecture)
            scalability_score = await self._calculate_scalability_score(analysis, architecture)
            performance_score = await self._calculate_performance_score(analysis, architecture)
            cost_score = await self._calculate_cost_score(analysis, architecture)
            
            # Calculate weighted overall score
            overall_score = int(
                security_score * self.scoring_weights["security"] +
                reliability_score * self.scoring_weights["reliability"] +
                scalability_score * self.scoring_weights["scalability"] +
                performance_score * self.scoring_weights["performance"] +
                cost_score * self.scoring_weights["cost"]
            )
            
            return {
                "overall": overall_score,
                "security": security_score,
                "reliability": reliability_score,
                "scalability": scalability_score,
                "performance": performance_score,
                "cost": cost_score
            }
            
        except Exception as e:
            logger.error(f"Scoring calculation failed: {str(e)}")
            return self._get_default_scores()
    
    async def _analyze_architecture(self, architecture: str, cloud_provider: str) -> Dict[str, Any]:
        """
        Analyze architecture content for scoring components
        """
        arch_lower = architecture.lower()
        
        analysis = {
            "has_load_balancer": any(term in arch_lower for term in ["load balancer", "alb", "elb"]),
            "has_multi_az": any(term in arch_lower for term in ["multi-az", "multiple availability", "zone"]),
            "has_monitoring": any(term in arch_lower for term in ["monitoring", "cloudwatch", "logging"]),
            "has_backup": any(term in arch_lower for term in ["backup", "snapshot", "restore"]),
            "has_encryption": any(term in arch_lower for term in ["encryption", "ssl", "tls"]),
            "has_auto_scaling": any(term in arch_lower for term in ["auto scaling", "autoscaling", "scale"]),
            "has_cache": any(term in arch_lower for term in ["cache", "redis", "memcached"]),
            "has_cdn": any(term in arch_lower for term in ["cdn", "cloudfront", "distribution"]),
            "has_iam": any(term in arch_lower for term in ["iam", "role", "policy", "access"]),
            "has_vpc": any(term in arch_lower for term in ["vpc", "virtual private", "network"]),
            "has_firewall": any(term in arch_lower for term in ["firewall", "security group", "nacl"]),
            "has_database": any(term in arch_lower for term in ["database", "db", "rds", "mysql", "postgres"]),
            "has_containers": any(term in arch_lower for term in ["container", "docker", "kubernetes", "ecs"]),
            "has_serverless": any(term in arch_lower for term in ["lambda", "serverless", "function"]),
            "cloud_provider": cloud_provider,
            "complexity": self._assess_complexity(architecture)
        }
        
        return analysis
    
    async def _calculate_security_score(self, analysis: Dict[str, Any], architecture: str) -> int:
        """
        Calculate security score based on security best practices
        """
        base_score = 60
        
        # Security enhancements
        if analysis["has_encryption"]:
            base_score += 15
        if analysis["has_iam"]:
            base_score += 10
        if analysis["has_vpc"]:
            base_score += 8
        if analysis["has_firewall"]:
            base_score += 7
        
        # Security penalties
        if not analysis["has_monitoring"]:
            base_score -= 10
        if not analysis["has_backup"]:
            base_score -= 5
        
        # Additional security checks
        arch_lower = architecture.lower()
        if "waf" in arch_lower:
            base_score += 5
        if "ddos" in arch_lower:
            base_score += 3
        if "private subnet" in arch_lower:
            base_score += 5
        
        return min(max(base_score, 0), 100)
    
    async def _calculate_reliability_score(self, analysis: Dict[str, Any], architecture: str) -> int:
        """
        Calculate reliability score based on availability and resilience
        """
        base_score = 65
        
        # Reliability enhancements
        if analysis["has_multi_az"]:
            base_score += 15
        if analysis["has_load_balancer"]:
            base_score += 10
        if analysis["has_backup"]:
            base_score += 8
        if analysis["has_monitoring"]:
            base_score += 7
        
        # High availability patterns
        arch_lower = architecture.lower()
        if "failover" in arch_lower:
            base_score += 5
        if "redundant" in arch_lower:
            base_score += 5
        if "disaster recovery" in arch_lower:
            base_score += 5
        
        # Penalties for single points of failure
        if not analysis["has_multi_az"]:
            base_score -= 15
        if not analysis["has_load_balancer"] and analysis["has_database"]:
            base_score -= 10
        
        return min(max(base_score, 0), 100)
    
    async def _calculate_scalability_score(self, analysis: Dict[str, Any], architecture: str) -> int:
        """
        Calculate scalability score based on scaling capabilities
        """
        base_score = 70
        
        # Scalability enhancements
        if analysis["has_auto_scaling"]:
            base_score += 15
        if analysis["has_load_balancer"]:
            base_score += 10
        if analysis["has_cache"]:
            base_score += 8
        if analysis["has_cdn"]:
            base_score += 7
        
        # Modern architectures
        if analysis["has_containers"]:
            base_score += 8
        if analysis["has_serverless"]:
            base_score += 5
        
        # Architecture patterns
        arch_lower = architecture.lower()
        if "microservices" in arch_lower:
            base_score += 10
        if "horizontal scaling" in arch_lower:
            base_score += 5
        if "queue" in arch_lower or "sqs" in arch_lower:
            base_score += 5
        
        # Complexity penalty
        if analysis["complexity"] == "high":
            base_score -= 5
        
        return min(max(base_score, 0), 100)
    
    async def _calculate_performance_score(self, analysis: Dict[str, Any], architecture: str) -> int:
        """
        Calculate performance score based on performance optimizations
        """
        base_score = 70
        
        # Performance enhancements
        if analysis["has_cache"]:
            base_score += 12
        if analysis["has_cdn"]:
            base_score += 10
        if analysis["has_load_balancer"]:
            base_score += 8
        
        # Performance patterns
        arch_lower = architecture.lower()
        if "read replica" in arch_lower:
            base_score += 8
        if "connection pooling" in arch_lower:
            base_score += 5
        if "compression" in arch_lower:
            base_score += 3
        if "optimization" in arch_lower:
            base_score += 5
        
        # Modern technologies
        if analysis["has_containers"]:
            base_score += 5
        if analysis["has_serverless"]:
            base_score += 3
        
        # Performance penalties
        if not analysis["has_cache"] and analysis["has_database"]:
            base_score -= 8
        if not analysis["has_cdn"] and "web" in arch_lower:
            base_score -= 5
        
        return min(max(base_score, 0), 100)
    
    async def _calculate_cost_score(self, analysis: Dict[str, Any], architecture: str) -> int:
        """
        Calculate cost efficiency score
        """
        base_score = 70
        
        # Cost optimization features
        if analysis["has_auto_scaling"]:
            base_score += 12
        if analysis["has_serverless"]:
            base_score += 10
        if analysis["has_cache"]:
            base_score += 5  # Reduces database load
        
        # Cost considerations
        arch_lower = architecture.lower()
        if "spot instance" in arch_lower:
            base_score += 8
        if "reserved instance" in arch_lower:
            base_score += 6
        if "lifecycle policy" in arch_lower:
            base_score += 5
        if "cost monitoring" in arch_lower:
            base_score += 5
        
        # Cost penalties
        if analysis["complexity"] == "high":
            base_score -= 8  # More complex = potentially more expensive
        if analysis["has_multi_az"] and "database" in arch_lower:
            base_score -= 3  # Multi-AZ adds cost but necessary for reliability
        
        # Over-provisioning indicators
        if "large" in arch_lower and "instance" in arch_lower:
            base_score -= 5
        
        return min(max(base_score, 0), 100)
    
    def _assess_complexity(self, architecture: str) -> str:
        """
        Assess architecture complexity
        """
        component_count = 0
        components = [
            "load balancer", "database", "cache", "cdn", "queue",
            "lambda", "container", "microservice", "api gateway"
        ]
        
        arch_lower = architecture.lower()
        for component in components:
            if component in arch_lower:
                component_count += 1
        
        if component_count <= 3:
            return "low"
        elif component_count <= 6:
            return "medium"
        else:
            return "high"
    
    def _get_default_scores(self) -> Dict[str, int]:
        """
        Get default scores when calculation fails
        """
        return {
            "overall": 75,
            "security": 70,
            "reliability": 75,
            "scalability": 80,
            "performance": 75,
            "cost": 70
        }
    
    def _load_scoring_criteria(self) -> Dict[str, Dict[str, int]]:
        """
        Load scoring criteria and weights
        """
        return {
            "security": {
                "encryption": 15,
                "iam": 10,
                "vpc": 8,
                "firewall": 7,
                "monitoring": 10,
                "backup": 5
            },
            "reliability": {
                "multi_az": 15,
                "load_balancer": 10,
                "backup": 8,
                "monitoring": 7,
                "failover": 5
            },
            "scalability": {
                "auto_scaling": 15,
                "load_balancer": 10,
                "cache": 8,
                "cdn": 7,
                "containers": 8
            },
            "performance": {
                "cache": 12,
                "cdn": 10,
                "load_balancer": 8,
                "read_replica": 8
            },
            "cost": {
                "auto_scaling": 12,
                "serverless": 10,
                "spot_instances": 8,
                "reserved_instances": 6
            }
        }