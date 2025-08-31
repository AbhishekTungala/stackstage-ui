import asyncio
import re
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class DiagramEngine:
    def __init__(self):
        self.templates = self._load_templates()
    
    async def generate(
        self,
        content: str,
        diagram_type: str = "architecture",
        output_format: str = "mermaid",
        theme: str = "default",
        highlight_risks: bool = True
    ) -> Dict[str, Any]:
        """
        Generate diagrams based on architecture content
        """
        try:
            logger.info(f"Generating {diagram_type} diagram in {output_format} format")
            
            # Parse content to identify components
            components = await self._parse_architecture_components(content)
            
            # Generate Mermaid code based on diagram type
            mermaid_code = await self._generate_mermaid_code(
                components, diagram_type, highlight_risks
            )
            
            # Apply theme
            themed_code = self._apply_theme(mermaid_code, theme)
            
            result = {
                "mermaid_code": themed_code,
                "components": components,
                "diagram_type": diagram_type,
                "theme": theme,
                "metadata": {
                    "component_count": len(components),
                    "complexity": self._assess_complexity(components),
                    "risk_highlights": highlight_risks
                }
            }
            
            # Convert to other formats if needed
            if output_format != "mermaid":
                result["converted"] = await self._convert_diagram(themed_code, output_format)
            
            return result
            
        except Exception as e:
            logger.error(f"Diagram generation failed: {str(e)}")
            return await self._generate_fallback_diagram(diagram_type, theme)
    
    async def get_templates(self) -> Dict[str, List[Dict[str, str]]]:
        """
        Get available diagram templates
        """
        return self.templates
    
    async def _parse_architecture_components(self, content: str) -> List[Dict[str, Any]]:
        """
        Parse architecture content to identify components
        """
        components = []
        
        # Common cloud components patterns
        component_patterns = {
            "load_balancer": ["load balancer", "alb", "elb", "nginx", "haproxy"],
            "web_server": ["web server", "apache", "nginx", "iis", "ec2"],
            "app_server": ["application server", "app server", "tomcat", "express"],
            "database": ["database", "db", "rds", "mysql", "postgresql", "mongodb"],
            "cache": ["cache", "redis", "memcached", "elasticache"],
            "queue": ["queue", "sqs", "rabbitmq", "kafka"],
            "storage": ["storage", "s3", "bucket", "blob", "file"],
            "cdn": ["cdn", "cloudfront", "distribution"],
            "api_gateway": ["api gateway", "api", "gateway"],
            "lambda": ["lambda", "function", "serverless"],
            "container": ["container", "docker", "ecs", "kubernetes", "k8s"],
            "monitoring": ["monitoring", "cloudwatch", "datadog", "newrelic"]
        }
        
        content_lower = content.lower()
        
        for component_type, patterns in component_patterns.items():
            for pattern in patterns:
                if pattern in content_lower:
                    components.append({
                        "type": component_type,
                        "name": component_type.replace("_", " ").title(),
                        "risk_level": self._assess_component_risk(component_type, content),
                        "connections": []
                    })
                    break
        
        # If no specific components found, create generic ones
        if not components:
            components = [
                {"type": "users", "name": "Users", "risk_level": "low", "connections": []},
                {"type": "web_app", "name": "Web Application", "risk_level": "medium", "connections": []},
                {"type": "database", "name": "Database", "risk_level": "high", "connections": []}
            ]
        
        return components
    
    async def _generate_mermaid_code(
        self, 
        components: List[Dict[str, Any]], 
        diagram_type: str,
        highlight_risks: bool
    ) -> str:
        """
        Generate Mermaid diagram code
        """
        if diagram_type == "architecture":
            return self._generate_architecture_diagram(components, highlight_risks)
        elif diagram_type == "security":
            return self._generate_security_diagram(components, highlight_risks)
        elif diagram_type == "cost-flow":
            return self._generate_cost_diagram(components)
        else:
            return self._generate_default_diagram(components)
    
    def _generate_architecture_diagram(
        self, 
        components: List[Dict[str, Any]], 
        highlight_risks: bool
    ) -> str:
        """
        Generate architecture flow diagram
        """
        diagram = "graph TD\n"
        
        # Create nodes with risk highlighting
        node_mappings = {}
        for i, component in enumerate(components):
            node_id = f"A{i+1}"
            node_mappings[component["type"]] = node_id
            
            if highlight_risks and component["risk_level"] == "high":
                diagram += f"    {node_id}[{component['name']}]:::high-risk\n"
            elif highlight_risks and component["risk_level"] == "medium":
                diagram += f"    {node_id}[{component['name']}]:::medium-risk\n"
            else:
                diagram += f"    {node_id}[{component['name']}]\n"
        
        # Create connections
        for i in range(len(components) - 1):
            diagram += f"    A{i+1} --> A{i+2}\n"
        
        # Add styling for risk levels
        if highlight_risks:
            diagram += "\n"
            diagram += "    classDef high-risk fill:#ffcccc,stroke:#ff0000,stroke-width:2px\n"
            diagram += "    classDef medium-risk fill:#fff3cd,stroke:#ffc107,stroke-width:2px\n"
        
        return diagram
    
    def _generate_security_diagram(
        self, 
        components: List[Dict[str, Any]], 
        highlight_risks: bool
    ) -> str:
        """
        Generate security-focused diagram
        """
        diagram = "graph TB\n"
        diagram += "    subgraph \"External\"\n"
        diagram += "        A1[Internet]\n"
        diagram += "        A2[Users]\n"
        diagram += "    end\n"
        diagram += "    subgraph \"Edge Security\"\n"
        diagram += "        B1[WAF]\n"
        diagram += "        B2[DDoS Protection]\n"
        diagram += "    end\n"
        diagram += "    subgraph \"Application Layer\"\n"
        diagram += "        C1[Load Balancer]\n"
        diagram += "        C2[Web Servers]\n"
        diagram += "    end\n"
        diagram += "    subgraph \"Data Layer\"\n"
        diagram += "        D1[Database]\n"
        diagram += "        D2[Encryption]\n"
        diagram += "    end\n"
        diagram += "\n"
        diagram += "    A1 --> B1\n"
        diagram += "    A2 --> B1\n"
        diagram += "    B1 --> B2\n"
        diagram += "    B2 --> C1\n"
        diagram += "    C1 --> C2\n"
        diagram += "    C2 --> D1\n"
        diagram += "    D1 --> D2\n"
        
        return diagram
    
    def _generate_cost_diagram(self, components: List[Dict[str, Any]]) -> str:
        """
        Generate cost flow diagram
        """
        diagram = "graph TD\n"
        diagram += "    A[Total Monthly Cost] --> B[Compute - 45%]\n"
        diagram += "    A --> C[Storage - 25%]\n"
        diagram += "    A --> D[Network - 20%]\n"
        diagram += "    A --> E[Other - 10%]\n"
        diagram += "\n"
        diagram += "    B --> B1[EC2 Instances]\n"
        diagram += "    B --> B2[Lambda Functions]\n"
        diagram += "    C --> C1[S3 Storage]\n"
        diagram += "    C --> C2[EBS Volumes]\n"
        diagram += "    D --> D1[Data Transfer]\n"
        diagram += "    D --> D2[Load Balancer]\n"
        diagram += "    E --> E1[Monitoring]\n"
        diagram += "    E --> E2[Security Services]\n"
        
        return diagram
    
    def _generate_default_diagram(self, components: List[Dict[str, Any]]) -> str:
        """
        Generate default generic diagram
        """
        diagram = "graph TD\n"
        diagram += "    A[Start] --> B[Process]\n"
        diagram += "    B --> C{Decision}\n"
        diagram += "    C -->|Yes| D[Action 1]\n"
        diagram += "    C -->|No| E[Action 2]\n"
        diagram += "    D --> F[End]\n"
        diagram += "    E --> F\n"
        
        return diagram
    
    def _apply_theme(self, mermaid_code: str, theme: str) -> str:
        """
        Apply theme styling to Mermaid diagram
        """
        theme_configs = {
            "default": "",
            "dark": "\n%%{init: {'theme':'dark'}}%%\n",
            "neutral": "\n%%{init: {'theme':'neutral'}}%%\n",
            "forest": "\n%%{init: {'theme':'forest'}}%%\n"
        }
        
        theme_config = theme_configs.get(theme, "")
        return theme_config + mermaid_code if theme_config else mermaid_code
    
    def _assess_component_risk(self, component_type: str, content: str) -> str:
        """
        Assess risk level of components
        """
        high_risk_components = ["database", "storage", "api_gateway"]
        medium_risk_components = ["web_server", "app_server", "cache"]
        
        if component_type in high_risk_components:
            return "high"
        elif component_type in medium_risk_components:
            return "medium"
        else:
            return "low"
    
    def _assess_complexity(self, components: List[Dict[str, Any]]) -> str:
        """
        Assess diagram complexity
        """
        count = len(components)
        if count <= 3:
            return "low"
        elif count <= 6:
            return "medium"
        else:
            return "high"
    
    async def _convert_diagram(self, mermaid_code: str, output_format: str) -> Dict[str, Any]:
        """
        Convert Mermaid to other formats
        """
        # In production, this would use actual conversion services
        return {
            "format": output_format,
            "note": f"Conversion to {output_format} would be implemented here",
            "original_mermaid": mermaid_code
        }
    
    async def _generate_fallback_diagram(self, diagram_type: str, theme: str) -> Dict[str, Any]:
        """
        Generate fallback diagram when main generation fails
        """
        fallback_mermaid = """
graph TD
    A[Cloud Infrastructure] --> B[Load Balancer]
    B --> C[Web Servers]
    C --> D[Application Layer]
    D --> E[Database]
    E --> F[Storage]
        """
        
        return {
            "mermaid_code": self._apply_theme(fallback_mermaid, theme),
            "components": [
                {"type": "infrastructure", "name": "Cloud Infrastructure", "risk_level": "medium"}
            ],
            "diagram_type": diagram_type,
            "theme": theme,
            "metadata": {
                "component_count": 6,
                "complexity": "medium",
                "fallback": True
            }
        }
    
    def _load_templates(self) -> Dict[str, List[Dict[str, str]]]:
        """
        Load diagram templates
        """
        return {
            "architecture": [
                {
                    "name": "Three-Tier Web App",
                    "description": "Classic three-tier web application architecture",
                    "mermaid_code": """
graph TD
    A[Users] --> B[Load Balancer]
    B --> C[Web Tier]
    C --> D[Application Tier]
    D --> E[Database Tier]
                    """
                },
                {
                    "name": "Microservices",
                    "description": "Microservices architecture with API gateway",
                    "mermaid_code": """
graph TD
    A[API Gateway] --> B[Auth Service]
    A --> C[User Service]
    A --> D[Order Service]
    C --> E[User DB]
    D --> F[Order DB]
                    """
                }
            ],
            "security": [
                {
                    "name": "Security Zones",
                    "description": "Network security zones and controls",
                    "mermaid_code": """
graph TB
    subgraph "DMZ"
        A[WAF]
        B[Load Balancer]
    end
    subgraph "Private Zone"
        C[App Servers]
        D[Database]
    end
    A --> B --> C --> D
                    """
                }
            ],
            "cost": [
                {
                    "name": "Cost Breakdown",
                    "description": "Infrastructure cost distribution",
                    "mermaid_code": """
graph TD
    A[Total Cost] --> B[Compute 45%]
    A --> C[Storage 25%]
    A --> D[Network 20%]
    A --> E[Other 10%]
                    """
                }
            ]
        }