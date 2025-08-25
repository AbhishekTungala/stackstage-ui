"""
StackStage Static Analysis Engine using Checkov + OPA
Provides comprehensive security, compliance, and best-practice analysis for IaC
"""
import os
import json
import subprocess
import tempfile
from typing import Dict, List, Any, Optional
from pathlib import Path

class StaticAnalyzer:
    """Enhanced static analysis using Checkov and OPA (Open Policy Agent)"""
    
    def __init__(self):
        self.checkov_available = self._check_checkov_availability()
        self.opa_policies = self._load_default_policies()
        
    def _check_checkov_availability(self) -> bool:
        """Check if Checkov is available in the system"""
        try:
            subprocess.run(['checkov', '--version'], 
                         capture_output=True, check=True, timeout=10)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
            print("Checkov not available, using built-in analysis")
            return False
    
    def _load_default_policies(self) -> Dict[str, Any]:
        """Load default OPA-style policies for infrastructure analysis"""
        return {
            'aws_security_policies': {
                's3_public_access': {
                    'rule': 'S3 buckets should not allow public access',
                    'severity': 'HIGH',
                    'description': 'Public S3 buckets can lead to data breaches'
                },
                'ec2_security_groups': {
                    'rule': 'Security groups should not allow unrestricted access',
                    'severity': 'HIGH', 
                    'description': 'Open security groups increase attack surface'
                },
                'rds_encryption': {
                    'rule': 'RDS instances should be encrypted',
                    'severity': 'MEDIUM',
                    'description': 'Database encryption protects sensitive data'
                },
                'iam_root_access': {
                    'rule': 'Root access keys should not be used',
                    'severity': 'CRITICAL',
                    'description': 'Root access keys pose significant security risk'
                }
            },
            'compliance_frameworks': {
                'SOC2': ['encryption_at_rest', 'encryption_in_transit', 'access_controls', 'logging'],
                'HIPAA': ['data_encryption', 'access_logging', 'network_segmentation'],
                'GDPR': ['data_encryption', 'access_controls', 'data_retention'],
                'PCI_DSS': ['network_segmentation', 'encryption', 'access_controls', 'monitoring']
            },
            'cost_optimization': {
                'unused_resources': {
                    'rule': 'Identify potentially unused resources',
                    'description': 'Unused resources incur unnecessary costs'
                },
                'right_sizing': {
                    'rule': 'Resources should be appropriately sized',
                    'description': 'Over-provisioned resources waste money'
                }
            }
        }
    
    def run_checkov_analysis(self, file_path: str, iac_type: str) -> Dict[str, Any]:
        """Run Checkov analysis on infrastructure code"""
        if not self.checkov_available:
            return self._fallback_analysis(file_path, iac_type)
        
        try:
            # Determine checkov framework based on IaC type
            framework_map = {
                'terraform': 'terraform',
                'cloudformation': 'cloudformation',
                'kubernetes': 'kubernetes',
                'docker-compose': 'docker_compose'
            }
            
            framework = framework_map.get(iac_type, 'terraform')
            
            # Run Checkov with JSON output
            cmd = [
                'checkov',
                '-f', file_path,
                '--framework', framework,
                '--output', 'json',
                '--soft-fail',  # Don't exit with error code on failures
                '--quiet'       # Reduce verbose output
            ]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=30
            )
            
            if result.stdout:
                checkov_results = json.loads(result.stdout)
                return self._process_checkov_results(checkov_results)
            else:
                return self._fallback_analysis(file_path, iac_type)
                
        except (subprocess.CalledProcessError, json.JSONDecodeError, subprocess.TimeoutExpired) as e:
            print(f"Checkov analysis failed: {e}")
            return self._fallback_analysis(file_path, iac_type)
    
    def _process_checkov_results(self, checkov_results: Dict[str, Any]) -> Dict[str, Any]:
        """Process Checkov results into StackStage format"""
        processed = {
            'tool': 'checkov',
            'summary': {
                'total_checks': 0,
                'passed_checks': 0,
                'failed_checks': 0,
                'skipped_checks': 0
            },
            'failed_checks': [],
            'passed_checks': [],
            'compliance_status': {},
            'security_score': 0
        }
        
        # Process check results
        results = checkov_results.get('results', {})
        
        if 'failed_checks' in results:
            for failed_check in results['failed_checks']:
                processed['failed_checks'].append({
                    'check_id': failed_check.get('check_id', 'unknown'),
                    'check_name': failed_check.get('check_name', 'Unknown Check'),
                    'severity': self._map_checkov_severity(failed_check.get('severity', 'MEDIUM')),
                    'description': failed_check.get('description', ''),
                    'file_path': failed_check.get('file_path', ''),
                    'line_range': failed_check.get('file_line_range', []),
                    'resource': failed_check.get('resource', ''),
                    'guideline': failed_check.get('guideline', '')
                })
        
        if 'passed_checks' in results:
            for passed_check in results['passed_checks']:
                processed['passed_checks'].append({
                    'check_id': passed_check.get('check_id', 'unknown'),
                    'check_name': passed_check.get('check_name', 'Unknown Check'),
                    'resource': passed_check.get('resource', '')
                })
        
        # Calculate summary
        processed['summary']['failed_checks'] = len(processed['failed_checks'])
        processed['summary']['passed_checks'] = len(processed['passed_checks'])
        processed['summary']['total_checks'] = processed['summary']['failed_checks'] + processed['summary']['passed_checks']
        
        # Calculate security score (0-100)
        total_checks = processed['summary']['total_checks']
        if total_checks > 0:
            passed_checks = processed['summary']['passed_checks']
            processed['security_score'] = int((passed_checks / total_checks) * 100)
        else:
            processed['security_score'] = 0
        
        return processed
    
    def _map_checkov_severity(self, severity: str) -> str:
        """Map Checkov severity levels to StackStage levels"""
        severity_map = {
            'CRITICAL': 'critical',
            'HIGH': 'high',
            'MEDIUM': 'medium',
            'LOW': 'low',
            'INFO': 'info'
        }
        return severity_map.get(severity.upper(), 'medium')
    
    def _fallback_analysis(self, file_path: str, iac_type: str) -> Dict[str, Any]:
        """Fallback analysis when Checkov is not available"""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
        except Exception:
            content = ""
        
        return self._built_in_analysis(content, iac_type)
    
    def _built_in_analysis(self, content: str, iac_type: str) -> Dict[str, Any]:
        """Built-in security analysis using regex patterns"""
        analysis_results = {
            'tool': 'builtin',
            'summary': {
                'total_checks': 0,
                'passed_checks': 0,
                'failed_checks': 0
            },
            'failed_checks': [],
            'security_score': 85,  # Default score
            'compliance_status': {}
        }
        
        # Define security patterns based on IaC type
        if iac_type == 'terraform':
            patterns = {
                's3_public_read': {
                    'pattern': r'acl\s*=\s*["\']public-read["\']',
                    'message': 'S3 bucket allows public read access',
                    'severity': 'high'
                },
                's3_public_readwrite': {
                    'pattern': r'acl\s*=\s*["\']public-read-write["\']',
                    'message': 'S3 bucket allows public read-write access', 
                    'severity': 'critical'
                },
                'sg_all_ports': {
                    'pattern': r'from_port\s*=\s*0\s+to_port\s*=\s*65535',
                    'message': 'Security group allows all ports',
                    'severity': 'high'
                },
                'sg_open_internet': {
                    'pattern': r'cidr_blocks\s*=\s*\[\s*["\']0\.0\.0\.0/0["\']',
                    'message': 'Security group allows access from internet',
                    'severity': 'medium'
                },
                'db_public_access': {
                    'pattern': r'publicly_accessible\s*=\s*true',
                    'message': 'Database is publicly accessible',
                    'severity': 'high'
                },
                'encryption_disabled': {
                    'pattern': r'encrypted\s*=\s*false',
                    'message': 'Encryption is disabled',
                    'severity': 'medium'
                }
            }
        
        elif iac_type == 'kubernetes':
            patterns = {
                'privileged_container': {
                    'pattern': r'privileged:\s*true',
                    'message': 'Container runs in privileged mode',
                    'severity': 'high'
                },
                'root_user': {
                    'pattern': r'runAsUser:\s*0',
                    'message': 'Container runs as root user',
                    'severity': 'medium'
                },
                'host_network': {
                    'pattern': r'hostNetwork:\s*true',
                    'message': 'Pod uses host network',
                    'severity': 'high'
                },
                'no_resource_limits': {
                    'pattern': r'spec:(?!.*limits).*containers:',
                    'message': 'Container has no resource limits',
                    'severity': 'low'
                }
            }
        
        else:
            # Generic patterns
            patterns = {
                'password_hardcoded': {
                    'pattern': r'password\s*[=:]\s*["\'][^"\']{8,}["\']',
                    'message': 'Hardcoded password detected',
                    'severity': 'critical'
                },
                'api_key_hardcoded': {
                    'pattern': r'api[_-]?key\s*[=:]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'message': 'Hardcoded API key detected',
                    'severity': 'high'
                }
            }
        
        # Check patterns against content
        import re
        for check_name, check_info in patterns.items():
            matches = re.findall(check_info['pattern'], content, re.IGNORECASE | re.MULTILINE)
            analysis_results['summary']['total_checks'] += 1
            
            if matches:
                analysis_results['failed_checks'].append({
                    'check_id': f'BUILTIN_{check_name.upper()}',
                    'check_name': check_name.replace('_', ' ').title(),
                    'severity': check_info['severity'],
                    'description': check_info['message'],
                    'matches': len(matches),
                    'evidence': matches[:3]  # Show first 3 matches as evidence
                })
                analysis_results['summary']['failed_checks'] += 1
            else:
                analysis_results['summary']['passed_checks'] += 1
        
        # Calculate security score
        total_checks = analysis_results['summary']['total_checks']
        if total_checks > 0:
            passed_ratio = analysis_results['summary']['passed_checks'] / total_checks
            # Adjust score based on severity of failed checks
            critical_fails = len([c for c in analysis_results['failed_checks'] if c['severity'] == 'critical'])
            high_fails = len([c for c in analysis_results['failed_checks'] if c['severity'] == 'high'])
            
            score = int(passed_ratio * 100)
            score -= critical_fails * 20  # -20 for each critical
            score -= high_fails * 10      # -10 for each high
            analysis_results['security_score'] = max(0, score)
        
        return analysis_results
    
    def analyze_compliance(self, analysis_results: Dict[str, Any], frameworks: List[str] = None) -> Dict[str, Any]:
        """Analyze compliance against security frameworks"""
        if frameworks is None:
            frameworks = ['SOC2', 'GDPR', 'HIPAA']
        
        compliance_analysis = {
            'frameworks_assessed': frameworks,
            'overall_compliance_score': 0,
            'framework_scores': {},
            'compliance_gaps': [],
            'recommendations': []
        }
        
        failed_checks = analysis_results.get('failed_checks', [])
        
        # Map failed checks to compliance requirements
        compliance_mapping = {
            'SOC2': {
                'encryption': ['encryption_disabled', 'no_encryption'],
                'access_control': ['sg_open_internet', 'db_public_access', 's3_public'],
                'logging': ['no_logging', 'log_retention']
            },
            'GDPR': {
                'data_protection': ['encryption_disabled', 's3_public'],
                'access_rights': ['no_access_controls', 'overly_permissive']
            },
            'HIPAA': {
                'data_security': ['encryption_disabled', 'db_public_access'],
                'access_control': ['sg_open_internet', 'weak_authentication']
            }
        }
        
        # Calculate compliance scores
        for framework in frameworks:
            framework_issues = []
            
            # Check for framework-specific violations
            for failed_check in failed_checks:
                check_id = failed_check.get('check_id', '').lower()
                check_name = failed_check.get('check_name', '').lower()
                
                # Simple mapping based on keywords
                if framework == 'SOC2':
                    if any(keyword in check_id or keyword in check_name 
                          for keyword in ['encryption', 'access', 'public', 'logging']):
                        framework_issues.append(failed_check)
                
                elif framework == 'GDPR':
                    if any(keyword in check_id or keyword in check_name
                          for keyword in ['encryption', 'data', 'privacy', 'access']):
                        framework_issues.append(failed_check)
                
                elif framework == 'HIPAA':
                    if any(keyword in check_id or keyword in check_name
                          for keyword in ['encryption', 'access', 'audit', 'security']):
                        framework_issues.append(failed_check)
            
            # Calculate framework compliance score
            total_possible_score = 100
            deduction_per_issue = 15
            score = max(0, total_possible_score - (len(framework_issues) * deduction_per_issue))
            
            compliance_analysis['framework_scores'][framework] = {
                'score': score,
                'status': 'compliant' if score >= 80 else 'non_compliant' if score < 60 else 'partially_compliant',
                'issues_count': len(framework_issues),
                'critical_issues': [issue for issue in framework_issues if issue.get('severity') == 'critical']
            }
        
        # Calculate overall compliance score
        if compliance_analysis['framework_scores']:
            scores = [fw['score'] for fw in compliance_analysis['framework_scores'].values()]
            compliance_analysis['overall_compliance_score'] = int(sum(scores) / len(scores))
        
        # Generate recommendations
        if compliance_analysis['overall_compliance_score'] < 80:
            compliance_analysis['recommendations'] = [
                'Enable encryption for all data stores',
                'Implement proper access controls and least privilege',
                'Enable comprehensive logging and monitoring',
                'Regular security assessments and vulnerability scanning',
                'Implement data classification and handling procedures'
            ]
        
        return compliance_analysis
    
    def analyze_file(self, file_path: str, iac_type: str) -> Dict[str, Any]:
        """Main entry point for static analysis"""
        # Run Checkov analysis
        checkov_results = self.run_checkov_analysis(file_path, iac_type)
        
        # Run compliance analysis
        compliance_results = self.analyze_compliance(checkov_results)
        
        # Combine results
        complete_analysis = {
            'static_analysis': checkov_results,
            'compliance_analysis': compliance_results,
            'summary': {
                'total_issues': checkov_results.get('summary', {}).get('failed_checks', 0),
                'security_score': checkov_results.get('security_score', 85),
                'compliance_score': compliance_results.get('overall_compliance_score', 85),
                'critical_issues': len([
                    issue for issue in checkov_results.get('failed_checks', [])
                    if issue.get('severity') == 'critical'
                ])
            },
            'timestamp': self._get_timestamp(),
            'analyzer_version': '1.0.0'
        }
        
        return complete_analysis
    
    def analyze_content(self, content: str, iac_type: str) -> Dict[str, Any]:
        """Analyze content directly without file"""
        # Create temporary file for analysis
        with tempfile.NamedTemporaryFile(mode='w', suffix=f'.{iac_type}', delete=False) as tmp_file:
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            return self.analyze_file(tmp_path, iac_type)
        finally:
            # Clean up temporary file
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()

# Example OPA policies (for future implementation)
OPA_POLICIES = {
    "terraform_s3_policy": """
    package terraform.s3
    
    deny[msg] {
        input.resource_type == "aws_s3_bucket"
        input.config.acl == "public-read"
        msg := "S3 bucket should not allow public read access"
    }
    
    deny[msg] {
        input.resource_type == "aws_s3_bucket"
        input.config.acl == "public-read-write"
        msg := "S3 bucket should not allow public read-write access"
    }
    """,
    
    "kubernetes_security_policy": """
    package kubernetes.security
    
    deny[msg] {
        input.kind == "Pod"
        input.spec.securityContext.privileged == true
        msg := "Pod should not run in privileged mode"
    }
    
    deny[msg] {
        input.kind == "Pod"
        input.spec.securityContext.runAsUser == 0
        msg := "Pod should not run as root user"
    }
    """
}