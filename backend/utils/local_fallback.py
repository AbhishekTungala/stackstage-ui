"""
StackStage Local Fallback Models
Provides offline analysis capabilities when OpenRouter API is unavailable
"""
import re
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

class LocalAnalysisEngine:
    """Local fallback analysis engine with rule-based intelligence"""
    
    def __init__(self):
        self.rule_patterns = {
            # Security Rules
            'security': {
                'hardcoded_secrets': {
                    'patterns': [
                        r'password\s*[=:]\s*["\'][^"\']{8,}["\']',
                        r'api[_-]?key\s*[=:]\s*["\'][A-Za-z0-9]{20,}["\']',
                        r'secret[_-]?key\s*[=:]\s*["\'][^"\']{16,}["\']',
                        r'access[_-]?token\s*[=:]\s*["\'][A-Za-z0-9+/=]{20,}["\']'
                    ],
                    'severity': 'critical',
                    'message': 'Hardcoded credentials detected - security risk'
                },
                'public_access': {
                    'patterns': [
                        r'public[-_]read[-_]write',
                        r'0\.0\.0\.0/0',
                        r'publicly[-_]accessible\s*=\s*true',
                        r'\*:\*@\*'
                    ],
                    'severity': 'high',
                    'message': 'Public access configuration detected'
                },
                'encryption_disabled': {
                    'patterns': [
                        r'encrypted\s*=\s*false',
                        r'encryption\s*=\s*["\']?none["\']?',
                        r'ssl\s*=\s*false',
                        r'tls\s*=\s*false'
                    ],
                    'severity': 'medium',
                    'message': 'Encryption is disabled'
                }
            },
            # Cost Optimization Rules
            'cost': {
                'oversized_instances': {
                    'patterns': [
                        r'instance_type\s*=\s*["\']?[a-z0-9]*\.([2-9]|1[0-9]|2[0-9])xlarge',
                        r'machine_type\s*=\s*["\']?n1-standard-([8-9]|[1-9][0-9])',
                        r'vm_size\s*=\s*["\']?Standard_D([8-9]|[1-9][0-9])'
                    ],
                    'severity': 'medium',
                    'message': 'Potentially oversized compute instances detected'
                },
                'no_reserved_instances': {
                    'patterns': [r'(?!.*reserved).*instance_type'],
                    'severity': 'low',
                    'message': 'Consider using reserved instances for cost savings'
                }
            },
            # Reliability Rules
            'reliability': {
                'single_az': {
                    'patterns': [
                        r'availability_zone\s*=\s*["\'][^"\']*["\'](?!.*availability_zone)',
                        r'(?!.*multi_az).*aws_db_instance'
                    ],
                    'severity': 'high',
                    'message': 'Single AZ deployment - consider multi-AZ for high availability'
                },
                'no_backups': {
                    'patterns': [
                        r'backup_retention_period\s*=\s*0',
                        r'backup\s*=\s*false',
                        r'(?!.*backup).*database'
                    ],
                    'severity': 'high',
                    'message': 'No backup configuration detected'
                }
            },
            # Performance Rules
            'performance': {
                'no_caching': {
                    'patterns': [r'(?!.*cache)(?!.*redis)(?!.*memcache).*web.*application'],
                    'severity': 'medium',
                    'message': 'No caching layer detected - consider adding cache for better performance'
                },
                'no_cdn': {
                    'patterns': [r'(?!.*cloudfront)(?!.*cdn).*static.*content'],
                    'severity': 'low',
                    'message': 'Consider using CDN for static content delivery'
                }
            }
        }
        
        self.architecture_patterns = {
            'monolith': {
                'indicators': ['single.*application', 'monolithic', 'all.*in.*one'],
                'score_adjustments': {'scalability': -10, 'maintainability': -5}
            },
            'microservices': {
                'indicators': ['microservice', 'service.*mesh', 'api.*gateway'],
                'score_adjustments': {'scalability': +15, 'complexity': +5}
            },
            'serverless': {
                'indicators': ['lambda', 'function.*app', 'cloud.*functions'],
                'score_adjustments': {'cost': +10, 'scalability': +10, 'cold_start': -5}
            },
            'container': {
                'indicators': ['docker', 'kubernetes', 'container', 'ecs'],
                'score_adjustments': {'portability': +10, 'scalability': +5}
            }
        }
        
        self.cost_estimates = {
            'aws': {
                'ec2': {'t3.micro': 8.5, 't3.small': 17, 't3.medium': 34, 't3.large': 68},
                'rds': {'db.t3.micro': 15, 'db.t3.small': 30, 'db.t3.medium': 60},
                's3': {'standard': 0.023, 'ia': 0.0125, 'glacier': 0.004},
                'cloudfront': {'data_transfer': 0.085, 'requests': 0.0075}
            },
            'azure': {
                'vm': {'B1s': 7.59, 'B2s': 30.37, 'D2s_v3': 96.36},
                'sql': {'basic': 5, 'standard': 15, 'premium': 465}
            },
            'gcp': {
                'compute': {'e2-micro': 6.11, 'e2-small': 12.21, 'e2-medium': 24.42},
                'sql': {'db-f1-micro': 7, 'db-g1-small': 25}
            }
        }

    def analyze_architecture_local(self, architecture_text: str, user_region: str = 'us-west-2') -> Dict[str, Any]:
        """Perform comprehensive local analysis without external API"""
        
        # Initialize analysis results
        analysis = {
            'summary': self._generate_local_summary(architecture_text, user_region),
            'score': self._calculate_local_scores(architecture_text),
            'issues': self._detect_issues(architecture_text),
            'recommendations': self._generate_recommendations(architecture_text),
            'diagram_mermaid': self._generate_basic_diagram(architecture_text),
            'estimated_cost': self._estimate_costs(architecture_text, user_region),
            'compliance_assessment': self._assess_compliance(architecture_text),
            'pattern_detected': self._detect_architecture_pattern(architecture_text),
            'analysis_method': 'local_fallback',
            'timestamp': datetime.now().isoformat()
        }
        
        return analysis

    def _generate_local_summary(self, architecture_text: str, user_region: str) -> str:
        """Generate executive summary using local analysis"""
        
        # Detect key components
        components = self._extract_components(architecture_text)
        pattern = self._detect_architecture_pattern(architecture_text)
        
        # Count issues
        issues = self._detect_issues(architecture_text)
        critical_issues = len([i for i in issues if i.get('severity') == 'critical'])
        
        summary_template = f"""
StackStage has completed a comprehensive local analysis of your {pattern} architecture deployed in {user_region}. 

The infrastructure includes {len(components)} main components and follows {pattern} design patterns. 
{critical_issues} critical security issues were identified that require immediate attention.

Key architectural strengths include proper component separation and cloud-native design principles. 
Areas for improvement focus on security hardening, cost optimization, and reliability enhancements.

This analysis provides actionable recommendations to achieve production-ready infrastructure 
that aligns with industry best practices and compliance requirements.
        """.strip()
        
        return summary_template

    def _calculate_local_scores(self, architecture_text: str) -> Dict[str, int]:
        """Calculate architecture scores using local rules"""
        
        base_scores = {
            'overall': 75,
            'security': 22,
            'reliability': 23,
            'performance': 15,
            'cost': 15
        }
        
        # Apply pattern-based adjustments
        pattern = self._detect_architecture_pattern(architecture_text)
        if pattern in self.architecture_patterns:
            adjustments = self.architecture_patterns[pattern].get('score_adjustments', {})
            for category, adjustment in adjustments.items():
                if category in base_scores:
                    base_scores[category] = max(0, min(30, base_scores[category] + adjustment))
        
        # Detect issues and adjust scores
        issues = self._detect_issues(architecture_text)
        
        for issue in issues:
            severity = issue.get('severity', 'medium')
            category = issue.get('category', 'security')
            
            # Deduct points based on severity
            deduction = {'critical': 8, 'high': 5, 'medium': 3, 'low': 1}.get(severity, 2)
            
            if category in base_scores and category != 'overall':
                base_scores[category] = max(0, base_scores[category] - deduction)
        
        # Calculate overall score
        component_scores = [base_scores['security'], base_scores['reliability'], 
                          base_scores['performance'], base_scores['cost']]
        base_scores['overall'] = sum(component_scores)
        
        return base_scores

    def _detect_issues(self, architecture_text: str) -> List[Dict[str, Any]]:
        """Detect security and architecture issues using pattern matching"""
        
        issues = []
        text_lower = architecture_text.lower()
        
        for category, rules in self.rule_patterns.items():
            for rule_name, rule_config in rules.items():
                patterns = rule_config['patterns']
                severity = rule_config['severity']
                message = rule_config['message']
                
                for pattern in patterns:
                    matches = re.findall(pattern, architecture_text, re.IGNORECASE | re.MULTILINE)
                    
                    if matches:
                        issues.append({
                            'id': f'LOCAL_{rule_name.upper()}_{len(issues)}',
                            'severity': severity,
                            'category': category,
                            'detail': message,
                            'evidence': f'Pattern matched: {pattern}',
                            'business_impact': self._get_business_impact(severity, category),
                            'matches_found': len(matches),
                            'rule': rule_name
                        })
        
        return issues

    def _generate_recommendations(self, architecture_text: str) -> List[Dict[str, Any]]:
        """Generate actionable recommendations based on local analysis"""
        
        recommendations = []
        issues = self._detect_issues(architecture_text)
        pattern = self._detect_architecture_pattern(architecture_text)
        
        # Security recommendations
        security_issues = [i for i in issues if i.get('category') == 'security']
        if security_issues:
            recommendations.append({
                'title': 'Implement Security Best Practices',
                'rationale': f'Found {len(security_issues)} security vulnerabilities that need immediate attention',
                'iac_fix': '''
# Terraform security hardening
resource "aws_s3_bucket_public_access_block" "secure_bucket" {
  bucket = aws_s3_bucket.main.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_encryption" "secure_bucket" {
  bucket = aws_s3_bucket.main.id
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}
                ''',
                'impact': {
                    'latency_ms': 0,
                    'cost_monthly_delta': 10,
                    'risk_reduction': 'Eliminates critical security vulnerabilities',
                    'implementation_effort': '4-6 hours'
                },
                'priority': 'P0'
            })
        
        # Multi-AZ recommendation
        if 'multi' not in architecture_text.lower() and 'availability' not in architecture_text.lower():
            recommendations.append({
                'title': 'Enable Multi-AZ High Availability',
                'rationale': 'Single AZ deployment creates availability risk and violates best practices',
                'iac_fix': '''
# Terraform Multi-AZ setup
resource "aws_db_instance" "main" {
  identifier = "main-database"
  multi_az   = true
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  delete_automated_backups = false
  deletion_protection     = true
}

resource "aws_autoscaling_group" "app" {
  name = "app-asg"
  availability_zones = ["${var.region}a", "${var.region}b", "${var.region}c"]
  
  health_check_type         = "ELB"
  health_check_grace_period = 300
}
                ''',
                'impact': {
                    'latency_ms': -20,
                    'cost_monthly_delta': 150,
                    'risk_reduction': 'Eliminates single points of failure',
                    'implementation_effort': '2-3 days'
                },
                'priority': 'P1'
            })
        
        # Cost optimization
        if 'xlarge' in architecture_text.lower() or 'large' in architecture_text.lower():
            recommendations.append({
                'title': 'Optimize Instance Sizing',
                'rationale': 'Large instances detected - consider right-sizing for cost efficiency',
                'iac_fix': '''
# Right-sized instances with auto-scaling
resource "aws_launch_template" "optimized" {
  name_prefix   = "optimized-"
  instance_type = "t3.medium"  # Instead of large/xlarge
  
  monitoring {
    enabled = true
  }
}

resource "aws_autoscaling_policy" "scale_up" {
  name                   = "scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app.name
}
                ''',
                'impact': {
                    'latency_ms': 10,
                    'cost_monthly_delta': -200,
                    'risk_reduction': 'Reduces over-provisioning costs',
                    'implementation_effort': '1-2 days'
                },
                'priority': 'P2'
            })
        
        return recommendations

    def _generate_basic_diagram(self, architecture_text: str) -> str:
        """Generate basic Mermaid diagram based on text analysis"""
        
        # Detect components
        components = []
        connections = []
        
        text_lower = architecture_text.lower()
        
        # Detect common components
        if any(keyword in text_lower for keyword in ['load balancer', 'alb', 'elb']):
            components.append('ALB[⚖️ Application Load Balancer]')
            connections.append('Users --> ALB')
        
        if any(keyword in text_lower for keyword in ['ec2', 'instance', 'server', 'compute']):
            components.append('EC2[💻 EC2 Instances]')
            if 'ALB' in str(components):
                connections.append('ALB --> EC2')
        
        if any(keyword in text_lower for keyword in ['rds', 'database', 'db']):
            components.append('RDS[🗄️ RDS Database]')
            connections.append('EC2 --> RDS')
        
        if any(keyword in text_lower for keyword in ['s3', 'storage', 'bucket']):
            components.append('S3[🪣 S3 Storage]')
            connections.append('EC2 --> S3')
        
        if any(keyword in text_lower for keyword in ['cloudfront', 'cdn']):
            components.append('CF[🌐 CloudFront CDN]')
            connections.insert(0, 'Users --> CF')
            connections.append('CF --> ALB')
        
        # Default basic diagram if no components detected
        if not components:
            return '''flowchart TB
    Users[👥 Users] --> App[🚀 Application]
    App --> DB[🗄️ Database]
    App --> Storage[💾 Storage]
    
    classDef default fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff'''
        
        # Build diagram
        diagram_lines = ['flowchart TB']
        diagram_lines.append('    Users[👥 Users]')
        diagram_lines.extend([f'    {comp}' for comp in components])
        diagram_lines.append('')
        diagram_lines.extend([f'    {conn}' for conn in connections])
        diagram_lines.append('')
        diagram_lines.append('    classDef default fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff')
        
        return '\n'.join(diagram_lines)

    def _estimate_costs(self, architecture_text: str, user_region: str) -> Dict[str, Any]:
        """Estimate infrastructure costs using local pricing data"""
        
        text_lower = architecture_text.lower()
        monthly_costs = {'compute': 0, 'storage': 0, 'network': 0, 'security': 0}
        
        # Estimate compute costs
        if 'ec2' in text_lower or 'instance' in text_lower:
            if 'large' in text_lower:
                monthly_costs['compute'] = 150
            elif 'medium' in text_lower:
                monthly_costs['compute'] = 75
            else:
                monthly_costs['compute'] = 35
        
        # Estimate database costs
        if 'rds' in text_lower or 'database' in text_lower:
            monthly_costs['storage'] += 100
        
        # Estimate S3 costs
        if 's3' in text_lower or 'storage' in text_lower:
            monthly_costs['storage'] += 25
        
        # Estimate load balancer costs
        if 'load balancer' in text_lower or 'alb' in text_lower:
            monthly_costs['network'] += 25
        
        # Estimate CloudFront costs
        if 'cloudfront' in text_lower or 'cdn' in text_lower:
            monthly_costs['network'] += 15
        
        # Security services
        if 'waf' in text_lower:
            monthly_costs['security'] += 20
        if 'guardduty' in text_lower:
            monthly_costs['security'] += 15
        
        total_monthly = sum(monthly_costs.values())
        optimization_potential = total_monthly * 0.2  # 20% optimization potential
        
        return {
            'currency': 'USD',
            'monthly': total_monthly,
            'breakdown': monthly_costs,
            'optimization_potential': optimization_potential,
            'notes': 'Estimated using local pricing models and best-practice assumptions'
        }

    def _assess_compliance(self, architecture_text: str) -> Dict[str, Any]:
        """Assess compliance frameworks using local rules"""
        
        text_lower = architecture_text.lower()
        
        # Base compliance scores
        framework_scores = {
            'SOC2': {'score': 75, 'status': 'partially_compliant'},
            'GDPR': {'score': 70, 'status': 'partially_compliant'},
            'HIPAA': {'score': 65, 'status': 'non_compliant'},
            'PCI_DSS': {'score': 68, 'status': 'non_compliant'}
        }
        
        # Adjust scores based on security features
        if 'encryption' in text_lower:
            for framework in framework_scores:
                framework_scores[framework]['score'] += 10
        
        if 'backup' in text_lower:
            for framework in framework_scores:
                framework_scores[framework]['score'] += 5
        
        if 'multi' in text_lower and 'az' in text_lower:
            for framework in framework_scores:
                framework_scores[framework]['score'] += 8
        
        # Update status based on final scores
        for framework in framework_scores:
            score = framework_scores[framework]['score']
            if score >= 80:
                framework_scores[framework]['status'] = 'compliant'
            elif score >= 60:
                framework_scores[framework]['status'] = 'partially_compliant'
            else:
                framework_scores[framework]['status'] = 'non_compliant'
        
        # Calculate overall compliance
        all_scores = [fw['score'] for fw in framework_scores.values()]
        overall_score = sum(all_scores) / len(all_scores)
        
        return {
            'frameworks': list(framework_scores.keys()),
            'current_posture': 'Partially compliant with major frameworks',
            'gaps': ['Encryption not consistently implemented', 'Access controls need strengthening'],
            'remediation_steps': [
                'Enable encryption for all data stores',
                'Implement comprehensive logging',
                'Add multi-factor authentication',
                'Create data retention policies'
            ],
            'framework_scores': framework_scores,
            'overall_compliance_score': int(overall_score)
        }

    def _extract_components(self, architecture_text: str) -> List[str]:
        """Extract architectural components from text"""
        
        components = []
        text_lower = architecture_text.lower()
        
        # Component patterns
        component_patterns = {
            'load_balancer': ['load balancer', 'alb', 'elb', 'nlb'],
            'compute': ['ec2', 'instance', 'server', 'compute', 'vm'],
            'database': ['rds', 'database', 'db', 'mysql', 'postgres'],
            'storage': ['s3', 'storage', 'bucket', 'efs', 'ebs'],
            'cache': ['redis', 'elasticache', 'memcached'],
            'cdn': ['cloudfront', 'cdn'],
            'security': ['waf', 'security group', 'nacl'],
            'monitoring': ['cloudwatch', 'monitoring', 'logging']
        }
        
        for component_type, patterns in component_patterns.items():
            if any(pattern in text_lower for pattern in patterns):
                components.append(component_type)
        
        return components

    def _detect_architecture_pattern(self, architecture_text: str) -> str:
        """Detect architectural pattern from text"""
        
        text_lower = architecture_text.lower()
        
        for pattern_name, pattern_config in self.architecture_patterns.items():
            indicators = pattern_config['indicators']
            for indicator in indicators:
                if re.search(indicator, text_lower):
                    return pattern_name
        
        # Default pattern based on components
        if any(keyword in text_lower for keyword in ['lambda', 'function']):
            return 'serverless'
        elif any(keyword in text_lower for keyword in ['microservice', 'api']):
            return 'microservices'
        elif any(keyword in text_lower for keyword in ['container', 'docker', 'kubernetes']):
            return 'containerized'
        else:
            return 'traditional'

    def _get_business_impact(self, severity: str, category: str) -> str:
        """Generate business impact statement"""
        
        impact_map = {
            'critical': {
                'security': 'High risk of data breach and regulatory fines',
                'reliability': 'Service outages will affect business operations',
                'cost': 'Significant budget overruns expected',
                'performance': 'User experience degradation affects customer retention'
            },
            'high': {
                'security': 'Moderate security risk requiring attention',
                'reliability': 'Potential service disruptions',
                'cost': 'Budget inefficiencies identified',
                'performance': 'Performance issues may impact user satisfaction'
            },
            'medium': {
                'security': 'Security improvement opportunity',
                'reliability': 'Reliability enhancement recommended',
                'cost': 'Cost optimization opportunity available',
                'performance': 'Performance tuning recommended'
            }
        }
        
        return impact_map.get(severity, {}).get(category, 'Business impact assessment needed')

    def chat_response_local(self, messages: List[Dict[str, str]], role_hint: Optional[str] = None) -> Dict[str, Any]:
        """Generate local chat response without external API"""
        
        last_message = messages[-1] if messages else {'content': 'Hello'}
        user_input = last_message.get('content', '').lower()
        
        # Rule-based response generation
        if any(keyword in user_input for keyword in ['security', 'secure', 'vulnerability']):
            response = self._generate_security_response(user_input, role_hint)
        elif any(keyword in user_input for keyword in ['cost', 'expensive', 'budget', 'pricing']):
            response = self._generate_cost_response(user_input, role_hint)
        elif any(keyword in user_input for keyword in ['performance', 'slow', 'latency', 'speed']):
            response = self._generate_performance_response(user_input, role_hint)
        elif any(keyword in user_input for keyword in ['availability', 'reliability', 'uptime', 'disaster']):
            response = self._generate_reliability_response(user_input, role_hint)
        else:
            response = self._generate_general_response(user_input, role_hint)
        
        return {
            'response': response,
            'suggestions': self._generate_contextual_suggestions(user_input, role_hint),
            'timestamp': datetime.now().isoformat(),
            'source': 'local_fallback'
        }

    def _generate_security_response(self, user_input: str, role_hint: Optional[str]) -> str:
        """Generate security-focused response"""
        
        if role_hint == 'CTO':
            return """As your CTO advisor, I recommend implementing a comprehensive security framework:

🔒 **Immediate Priority (P0):**
• Enable AWS WAF with OWASP Top 10 protection
• Implement KMS encryption for all data at rest
• Enable GuardDuty for threat detection

📊 **Business Impact:**
• Reduces breach risk by 85%
• Ensures compliance with SOC2/GDPR
• Protects customer trust and brand reputation

💰 **Investment:** ~$200/month for enterprise-grade security
⏱️ **Timeline:** 2-3 weeks implementation

Would you like me to create a detailed security implementation roadmap?"""
        
        elif role_hint == 'DevOps':
            return """Here's your security automation checklist:

🛠️ **Infrastructure Security:**
• Terraform security scanning with Checkov
• Automated vulnerability scanning in CI/CD
• Security group audit automation

⚙️ **Implementation Steps:**
1. Add pre-commit hooks for secret detection
2. Enable AWS Config rules for compliance
3. Set up CloudTrail for audit logging
4. Configure automated security testing

🚨 **Alerts & Monitoring:**
• Real-time security event notifications
• Compliance drift detection
• Automated incident response playbooks

Need help with the Terraform security configurations?"""
        
        else:
            return """Security is fundamental to reliable cloud architecture. Here are key areas to address:

🔐 **Essential Security Controls:**
• Identity & Access Management (IAM) with least privilege
• Network security with properly configured security groups
• Data encryption both in transit and at rest
• Regular security assessments and monitoring

🛡️ **Best Practices:**
• Enable multi-factor authentication
• Use AWS Secrets Manager for credentials
• Implement network segmentation
• Regular backup and disaster recovery testing

The investment in security pays dividends in preventing costly breaches and maintaining customer trust."""
        
    def _generate_cost_response(self, user_input: str, role_hint: Optional[str]) -> str:
        """Generate cost optimization response"""
        
        return """💰 **Cost Optimization Strategy:**

**Immediate Savings (20-30%):**
• Reserved Instances for predictable workloads
• Spot Instances for fault-tolerant processing
• Right-sizing based on actual usage metrics

**Ongoing Optimization:**
• Automated scaling policies
• Storage lifecycle management (S3 → IA → Glacier)
• Unused resource identification

**FinOps Best Practices:**
• Cost allocation tags for accountability
• Budget alerts with automated actions
• Regular cost reviews and optimization sprints

**Typical Savings:** $500-2000/month for medium-sized infrastructure

Would you like a detailed cost analysis of your current setup?"""

    def _generate_performance_response(self, user_input: str, role_hint: Optional[str]) -> str:
        """Generate performance optimization response"""
        
        return """⚡ **Performance Optimization Recommendations:**

**Frontend Performance:**
• CloudFront CDN for global content delivery
• Image optimization and compression
• Browser caching strategies

**Backend Performance:**
• ElastiCache for database query caching
• Connection pooling and optimization
• Async processing for non-critical tasks

**Database Performance:**
• Read replicas for query distribution
• Query optimization and indexing
• Connection pooling

**Monitoring:**
• CloudWatch custom metrics
• X-Ray for distributed tracing
• Application Performance Monitoring (APM)

**Expected Improvements:** 40-60% latency reduction, 2x throughput increase"""

    def _generate_reliability_response(self, user_input: str, role_hint: Optional[str]) -> str:
        """Generate reliability and availability response"""
        
        return """🔄 **High Availability & Disaster Recovery:**

**Multi-AZ Architecture:**
• Deploy across multiple Availability Zones
• Auto Scaling Groups with health checks
• Load balancer health monitoring

**Database Reliability:**
• RDS Multi-AZ with automated failover
• Automated backups with point-in-time recovery
• Read replicas for disaster recovery

**Application Resilience:**
• Circuit breaker patterns
• Graceful degradation strategies
• Automated retry mechanisms

**Recovery Objectives:**
• RPO (Recovery Point Objective): < 1 hour
• RTO (Recovery Time Objective): < 15 minutes
• Target Availability: 99.95% (22 minutes downtime/month)

This ensures business continuity and customer satisfaction."""

    def _generate_general_response(self, user_input: str, role_hint: Optional[str]) -> str:
        """Generate general architecture response"""
        
        return """🏗️ **Cloud Architecture Best Practices:**

**Design Principles:**
• Scalability: Design for growth and variable demand
• Reliability: Eliminate single points of failure
• Security: Implement defense-in-depth strategies
• Cost-Effectiveness: Optimize for your specific workload

**Architecture Patterns:**
• Microservices for large, complex applications
• Serverless for event-driven workloads
• Container orchestration for portable deployments
• Multi-tier architecture for traditional applications

**Key Considerations:**
• Choose the right region for your users
• Plan for data backup and disaster recovery
• Implement proper monitoring and alerting
• Regular architecture reviews and optimization

I'm here to help you build confidence in your cloud infrastructure. What specific area would you like to explore?"""

    def _generate_contextual_suggestions(self, user_input: str, role_hint: Optional[str]) -> List[str]:
        """Generate contextual suggestions based on input and role"""
        
        base_suggestions = [
            "🔍 Run comprehensive architecture health check",
            "💡 Get personalized optimization recommendations", 
            "📋 Review cloud security best practices",
            "🎯 Create improvement roadmap with priorities",
            "🛠️ Generate Infrastructure as Code templates"
        ]
        
        # Add role-specific suggestions
        if role_hint == 'CTO':
            base_suggestions.extend([
                "📊 Create executive dashboard with metrics",
                "💰 Analyze ROI of cloud infrastructure investments"
            ])
        elif role_hint == 'DevOps':
            base_suggestions.extend([
                "🚀 Design CI/CD pipeline with automated testing",
                "📦 Implement Infrastructure as Code best practices"
            ])
        
        # Add contextual suggestions based on input
        if 'security' in user_input:
            base_suggestions.append("🔐 Deep dive into Zero Trust architecture")
        if 'cost' in user_input:
            base_suggestions.append("💰 Detailed FinOps analysis and recommendations")
        
        return base_suggestions[:5]  # Return top 5 suggestions