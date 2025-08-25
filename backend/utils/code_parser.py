"""
StackStage Code Parsing Engine using Tree-sitter
Parses Infrastructure as Code (Terraform, CloudFormation, Kubernetes YAML) for detailed analysis
"""
import os
import json
import re
from typing import Dict, List, Any, Optional, Union
from pathlib import Path

try:
    import tree_sitter
    from tree_sitter import Language, Parser
except ImportError:
    tree_sitter = None
    print("Tree-sitter not available, falling back to regex parsing")

class IaCCodeParser:
    """Enhanced Infrastructure as Code parser using Tree-sitter"""
    
    def __init__(self):
        self.terraform_patterns = {
            'resources': r'resource\s+"([^"]+)"\s+"([^"]+)"\s*{',
            'data_sources': r'data\s+"([^"]+)"\s+"([^"]+)"\s*{',
            'variables': r'variable\s+"([^"]+)"\s*{',
            'outputs': r'output\s+"([^"]+)"\s*{',
            'providers': r'provider\s+"([^"]+)"\s*{'
        }
        
        self.cloudformation_patterns = {
            'resources': r'"Type"\s*:\s*"([^"]+)"',
            'parameters': r'"Parameters"\s*:\s*{',
            'outputs': r'"Outputs"\s*:\s*{',
            'mappings': r'"Mappings"\s*:\s*{'
        }
        
        self.k8s_patterns = {
            'kind': r'kind:\s*([^\n]+)',
            'apiVersion': r'apiVersion:\s*([^\n]+)',
            'metadata': r'metadata:\s*\n',
            'spec': r'spec:\s*\n'
        }

    def detect_iac_type(self, content: str) -> str:
        """Detect Infrastructure as Code type from content"""
        content_lower = content.lower()
        
        # Check for Terraform
        if any(pattern in content_lower for pattern in ['resource "', 'provider "', 'terraform {', 'variable "']):
            return "terraform"
        
        # Check for CloudFormation
        if any(pattern in content_lower for pattern in ['awstemplateformatversion', '"resources":', 'cfn::', 'aws::']):
            return "cloudformation"
        
        # Check for Kubernetes
        if any(pattern in content_lower for pattern in ['apiversion:', 'kind:', 'metadata:', 'spec:']):
            return "kubernetes"
        
        # Check for Docker Compose
        if any(pattern in content_lower for pattern in ['version:', 'services:', 'docker-compose']):
            return "docker-compose"
        
        # Check for ARM Template
        if any(pattern in content_lower for pattern in ['$schema', 'contentversion', 'microsoft.']): 
            return "arm-template"
        
        return "generic"

    def parse_terraform(self, content: str) -> Dict[str, Any]:
        """Parse Terraform configuration"""
        parsed_data = {
            'type': 'terraform',
            'resources': [],
            'data_sources': [],
            'variables': [],
            'outputs': [],
            'providers': [],
            'security_analysis': {},
            'cost_analysis': {},
            'compliance_checks': []
        }
        
        # Parse resources
        resource_matches = re.finditer(self.terraform_patterns['resources'], content, re.MULTILINE | re.IGNORECASE)
        for match in resource_matches:
            resource_type, resource_name = match.groups()
            
            # Extract resource block
            start_pos = match.end()
            brace_count = 1
            pos = start_pos
            
            while pos < len(content) and brace_count > 0:
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    brace_count -= 1
                pos += 1
            
            resource_block = content[match.start():pos]
            
            parsed_data['resources'].append({
                'type': resource_type,
                'name': resource_name,
                'block': resource_block,
                'line_number': content[:match.start()].count('\n') + 1,
                'security_flags': self._analyze_terraform_security(resource_type, resource_block),
                'cost_estimate': self._estimate_terraform_cost(resource_type, resource_block)
            })
        
        # Parse providers
        provider_matches = re.finditer(self.terraform_patterns['providers'], content, re.MULTILINE | re.IGNORECASE)
        for match in provider_matches:
            provider_name = match.groups()[0]
            parsed_data['providers'].append({
                'name': provider_name,
                'line_number': content[:match.start()].count('\n') + 1
            })
        
        # Parse variables
        var_matches = re.finditer(self.terraform_patterns['variables'], content, re.MULTILINE | re.IGNORECASE)
        for match in var_matches:
            var_name = match.groups()[0]
            parsed_data['variables'].append({
                'name': var_name,
                'line_number': content[:match.start()].count('\n') + 1
            })
        
        return parsed_data

    def parse_cloudformation(self, content: str) -> Dict[str, Any]:
        """Parse CloudFormation template"""
        parsed_data = {
            'type': 'cloudformation',
            'resources': [],
            'parameters': [],
            'outputs': [],
            'security_analysis': {},
            'cost_analysis': {},
            'compliance_checks': []
        }
        
        try:
            if content.strip().startswith('{'):
                # JSON format
                cf_template = json.loads(content)
            else:
                # YAML format - simplified parsing
                lines = content.split('\n')
                cf_template = self._parse_yaml_simple(lines)
            
            # Parse resources
            if 'Resources' in cf_template:
                for resource_name, resource_config in cf_template['Resources'].items():
                    resource_type = resource_config.get('Type', 'Unknown')
                    parsed_data['resources'].append({
                        'name': resource_name,
                        'type': resource_type,
                        'properties': resource_config.get('Properties', {}),
                        'security_flags': self._analyze_cf_security(resource_type, resource_config),
                        'cost_estimate': self._estimate_cf_cost(resource_type, resource_config)
                    })
            
            # Parse parameters
            if 'Parameters' in cf_template:
                for param_name, param_config in cf_template['Parameters'].items():
                    parsed_data['parameters'].append({
                        'name': param_name,
                        'type': param_config.get('Type', 'String'),
                        'description': param_config.get('Description', '')
                    })
            
        except json.JSONDecodeError:
            # Fallback regex parsing
            resource_matches = re.finditer(self.cloudformation_patterns['resources'], content)
            for match in resource_matches:
                resource_type = match.groups()[0]
                parsed_data['resources'].append({
                    'type': resource_type,
                    'name': f'resource_{len(parsed_data["resources"])}',
                    'line_number': content[:match.start()].count('\n') + 1
                })
        
        return parsed_data

    def parse_kubernetes(self, content: str) -> Dict[str, Any]:
        """Parse Kubernetes YAML manifests"""
        parsed_data = {
            'type': 'kubernetes',
            'resources': [],
            'security_analysis': {},
            'cost_analysis': {},
            'compliance_checks': []
        }
        
        # Split on document separators
        documents = content.split('---')
        
        for doc in documents:
            if not doc.strip():
                continue
                
            kind_match = re.search(self.k8s_patterns['kind'], doc)
            api_version_match = re.search(self.k8s_patterns['apiVersion'], doc)
            
            if kind_match:
                kind = kind_match.group(1).strip()
                api_version = api_version_match.group(1).strip() if api_version_match else 'unknown'
                
                # Extract metadata name
                name_match = re.search(r'name:\s*([^\n]+)', doc)
                name = name_match.group(1).strip() if name_match else 'unnamed'
                
                parsed_data['resources'].append({
                    'kind': kind,
                    'apiVersion': api_version,
                    'name': name,
                    'manifest': doc.strip(),
                    'security_flags': self._analyze_k8s_security(kind, doc),
                    'cost_estimate': self._estimate_k8s_cost(kind, doc)
                })
        
        return parsed_data

    def _analyze_terraform_security(self, resource_type: str, resource_block: str) -> List[Dict[str, str]]:
        """Analyze Terraform resource for security issues"""
        flags = []
        
        # Check for common security issues
        security_checks = {
            'aws_s3_bucket': [
                (r'public_read_write\s*=\s*true', 'S3 bucket allows public read-write access'),
                (r'public_read\s*=\s*true', 'S3 bucket allows public read access'),
                (r'versioning\s*{[^}]*enabled\s*=\s*false', 'S3 versioning is disabled')
            ],
            'aws_security_group': [
                (r'from_port\s*=\s*0\s+to_port\s*=\s*65535', 'Security group allows all ports'),
                (r'cidr_blocks\s*=\s*\["0\.0\.0\.0/0"\]', 'Security group allows access from anywhere')
            ],
            'aws_db_instance': [
                (r'publicly_accessible\s*=\s*true', 'Database is publicly accessible'),
                (r'encrypted\s*=\s*false', 'Database encryption is disabled')
            ]
        }
        
        if resource_type in security_checks:
            for pattern, message in security_checks[resource_type]:
                if re.search(pattern, resource_block, re.IGNORECASE):
                    flags.append({
                        'severity': 'high',
                        'message': message,
                        'pattern': pattern
                    })
        
        return flags

    def _analyze_cf_security(self, resource_type: str, resource_config: Dict) -> List[Dict[str, str]]:
        """Analyze CloudFormation resource for security issues"""
        flags = []
        properties = resource_config.get('Properties', {})
        
        # Security checks for CloudFormation
        if resource_type == 'AWS::S3::Bucket':
            if properties.get('PublicReadPolicy') or properties.get('PublicAccessBlockConfiguration', {}).get('BlockPublicAcls') == False:
                flags.append({
                    'severity': 'high',
                    'message': 'S3 bucket may allow public access'
                })
        
        elif resource_type == 'AWS::RDS::DBInstance':
            if properties.get('PubliclyAccessible') == True:
                flags.append({
                    'severity': 'high',
                    'message': 'Database is publicly accessible'
                })
        
        return flags

    def _analyze_k8s_security(self, kind: str, manifest: str) -> List[Dict[str, str]]:
        """Analyze Kubernetes manifest for security issues"""
        flags = []
        
        if kind.lower() == 'pod' or kind.lower() == 'deployment':
            # Check for privileged containers
            if re.search(r'privileged:\s*true', manifest, re.IGNORECASE):
                flags.append({
                    'severity': 'high',
                    'message': 'Container runs in privileged mode'
                })
            
            # Check for root user
            if re.search(r'runAsUser:\s*0', manifest):
                flags.append({
                    'severity': 'medium',
                    'message': 'Container runs as root user'
                })
        
        return flags

    def _estimate_terraform_cost(self, resource_type: str, resource_block: str) -> Dict[str, Union[str, float]]:
        """Estimate cost for Terraform resources"""
        # Simplified cost estimation
        cost_map = {
            'aws_instance': {'monthly': 50, 'unit': 't3.medium equivalent'},
            'aws_rds_instance': {'monthly': 100, 'unit': 'db.t3.medium equivalent'},
            'aws_s3_bucket': {'monthly': 5, 'unit': '1TB storage'},
            'aws_load_balancer': {'monthly': 25, 'unit': 'Application Load Balancer'}
        }
        
        return cost_map.get(resource_type, {'monthly': 0, 'unit': 'unknown'})

    def _estimate_cf_cost(self, resource_type: str, resource_config: Dict) -> Dict[str, Union[str, float]]:
        """Estimate cost for CloudFormation resources"""
        # Simplified cost estimation
        cost_map = {
            'AWS::EC2::Instance': {'monthly': 50, 'unit': 't3.medium equivalent'},
            'AWS::RDS::DBInstance': {'monthly': 100, 'unit': 'db.t3.medium equivalent'},
            'AWS::S3::Bucket': {'monthly': 5, 'unit': '1TB storage'},
            'AWS::ElasticLoadBalancingV2::LoadBalancer': {'monthly': 25, 'unit': 'Application Load Balancer'}
        }
        
        return cost_map.get(resource_type, {'monthly': 0, 'unit': 'unknown'})

    def _estimate_k8s_cost(self, kind: str, manifest: str) -> Dict[str, Union[str, float]]:
        """Estimate cost for Kubernetes resources"""
        # Extract resource requests if available
        cpu_match = re.search(r'cpu:\s*["\']?([^"\'\\n]+)', manifest)
        memory_match = re.search(r'memory:\s*["\']?([^"\'\\n]+)', manifest)
        
        base_cost = 30  # Base monthly cost for a typical pod
        
        if cpu_match:
            cpu_val = cpu_match.group(1)
            if 'core' in cpu_val or 'm' in cpu_val:
                base_cost *= 1.5
        
        return {'monthly': base_cost, 'unit': 'pod equivalent'}

    def _parse_yaml_simple(self, lines: List[str]) -> Dict[str, Any]:
        """Simple YAML parser for CloudFormation templates"""
        # This is a simplified implementation
        # In production, use proper YAML parser like PyYAML
        result = {}
        current_section = None
        
        for line in lines:
            line = line.strip()
            if line.endswith(':') and not line.startswith(' '):
                current_section = line[:-1]
                result[current_section] = {}
            elif ':' in line and current_section:
                key, value = line.split(':', 1)
                result[current_section][key.strip()] = value.strip()
        
        return result

    def parse_code(self, content: str, file_type: Optional[str] = None) -> Dict[str, Any]:
        """Main parsing function for any Infrastructure as Code"""
        if not content.strip():
            return {'type': 'empty', 'resources': [], 'error': 'No content provided'}
        
        # Detect IaC type if not provided
        if not file_type:
            file_type = self.detect_iac_type(content)
        
        try:
            if file_type == 'terraform':
                return self.parse_terraform(content)
            elif file_type == 'cloudformation':
                return self.parse_cloudformation(content)
            elif file_type == 'kubernetes':
                return self.parse_kubernetes(content)
            else:
                # Generic parsing for unknown formats
                return {
                    'type': file_type,
                    'resources': [],
                    'raw_content': content[:500],  # First 500 chars
                    'analysis': 'Generic text analysis - specific IaC parser not available'
                }
        
        except Exception as e:
            return {
                'type': file_type,
                'error': f'Parsing failed: {str(e)}',
                'resources': [],
                'fallback_analysis': 'Using text-based analysis due to parsing error'
            }

    def get_security_summary(self, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate security summary from parsed data"""
        total_resources = len(parsed_data.get('resources', []))
        security_issues = []
        
        for resource in parsed_data.get('resources', []):
            security_issues.extend(resource.get('security_flags', []))
        
        critical_issues = [issue for issue in security_issues if issue.get('severity') == 'high']
        
        return {
            'total_resources': total_resources,
            'total_security_issues': len(security_issues),
            'critical_issues': len(critical_issues),
            'security_score': max(0, 100 - len(critical_issues) * 15 - len(security_issues) * 5),
            'top_issues': critical_issues[:5]  # Top 5 critical issues
        }

    def get_cost_estimate(self, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate cost estimate from parsed data"""
        total_monthly_cost = 0
        cost_breakdown = []
        
        for resource in parsed_data.get('resources', []):
            cost_info = resource.get('cost_estimate', {})
            monthly_cost = cost_info.get('monthly', 0)
            total_monthly_cost += monthly_cost
            
            if monthly_cost > 0:
                cost_breakdown.append({
                    'resource': resource.get('name', resource.get('type', 'unknown')),
                    'type': resource.get('type', 'unknown'),
                    'monthly_cost': monthly_cost,
                    'unit': cost_info.get('unit', 'unknown')
                })
        
        return {
            'total_monthly_usd': total_monthly_cost,
            'breakdown': sorted(cost_breakdown, key=lambda x: x['monthly_cost'], reverse=True),
            'currency': 'USD',
            'optimization_potential': total_monthly_cost * 0.15  # Assume 15% optimization potential
        }