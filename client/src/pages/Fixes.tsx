import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  Zap, 
  TrendingUp,
  CheckCircle,
  Copy,
  ExternalLink,
  Code,
  Wrench,
  Clock,
  Loader2,
  BookOpen,
  X
} from "lucide-react";

const Fixes = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [implementedFixes, setImplementedFixes] = useState<Set<string>>(new Set());
  const [applyingFixes, setApplyingFixes] = useState<Set<string>>(new Set());
  const [fixResults, setFixResults] = useState<Map<string, any>>(new Map());
  const [viewMode, setViewMode] = useState<Record<string, 'before' | 'after'>>({});
  const [documentationModal, setDocumentationModal] = useState<{ isOpen: boolean; content: any }>({ 
    isOpen: false, 
    content: null 
  });

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const applyFix = async (fixId: string, fixData: any) => {
    setApplyingFixes(prev => new Set([...Array.from(prev), fixId]));
    
    try {
      const response = await fetch('/api/apply-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fixId,
          fixType: fixData.category?.toLowerCase() || 'general',
          code: fixData.code,
          description: fixData.description,
          impact: fixData.impact
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setImplementedFixes(prev => new Set([...Array.from(prev), fixId]));
        setFixResults(prev => new Map(prev.set(fixId, result)));
        
        // Show professional success notification with detailed changes
        const changes = result.details?.changes || {};
        const infrastructureChanges = result.details?.infrastructureChanges || [];
        const validationSteps = result.details?.validationSteps || [];
        
        const changeDetails = changes.diff ? `\n\nCode Changes:\n${changes.diff.map(change => `  ${change}`).join('\n')}` : '';
        const infraDetails = infrastructureChanges.length ? `\n\nInfrastructure Updates:\n${infrastructureChanges.map(change => `  • ${change}`).join('\n')}` : '';
        const validationDetails = validationSteps.length ? `\n\nValidation Results:\n${validationSteps.map(step => `  ✓ ${step}`).join('\n')}` : '';
        
        alert(`✅ Fix Applied Successfully!\n\nChange ID: ${result.details?.changeId}\nType: ${result.details?.type}${changeDetails}${infraDetails}${validationDetails}`);
      } else {
        // Show error notification
        const suggestions = result.suggestions?.map((s: string) => `• ${s}`).join('\n') || '';
        alert(`❌ Fix application failed: ${result.error}\n\nSuggestions:\n${suggestions}`);
      }
    } catch (error) {
      console.error('Apply fix error:', error);
      alert('❌ Failed to apply fix. Please check your connection and try again.');
    } finally {
      setApplyingFixes(prev => {
        const newSet = new Set(prev);
        newSet.delete(fixId);
        return newSet;
      });
    }
  };

  const rollbackFix = async (fixId: string) => {
    try {
      const response = await fetch('/api/rollback-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fixId, reason: 'User requested rollback' }),
      });

      const result = await response.json();
      
      if (result.success) {
        setImplementedFixes(prev => {
          const newSet = new Set(prev);
          newSet.delete(fixId);
          return newSet;
        });
        setFixResults(prev => {
          const newMap = new Map(prev);
          newMap.delete(fixId);
          return newMap;
        });
        alert('✅ Fix rolled back successfully!');
      } else {
        alert(`❌ Rollback failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Rollback error:', error);
      alert('❌ Failed to rollback fix. Please try again.');
    }
  };

  const markAsImplemented = (fixId: string) => {
    setImplementedFixes(prev => new Set([...Array.from(prev), fixId]));
  };

  const getDocumentationContent = (category: string, issue: any) => {
    const baseContent = {
      title: `${category} - ${issue.title}`,
      description: issue.description,
      impact: issue.impact,
      severity: issue.severity
    };

    switch (category.toLowerCase()) {
      case 'security':
        return {
          ...baseContent,
          sections: [
            {
              title: "Security Overview",
              content: [
                "This security vulnerability exposes your infrastructure to potential threats and compliance violations.",
                "Addressing security issues should be your highest priority as they can lead to data breaches, unauthorized access, and regulatory penalties."
              ]
            },
            {
              title: "Implementation Guide", 
              content: [
                "1. Review the current configuration and identify security gaps",
                "2. Apply the recommended security hardening measures",
                "3. Test access controls to ensure proper restrictions",
                "4. Enable monitoring and alerting for security events",
                "5. Document changes and update security policies"
              ]
            },
            {
              title: "Best Practices",
              content: [
                "• Enable encryption at rest and in transit for all data",
                "• Implement least-privilege access controls",
                "• Regularly audit and rotate access keys",
                "• Enable comprehensive logging and monitoring",
                "• Keep security policies up to date with compliance requirements"
              ]
            },
            {
              title: "Compliance Impact",
              content: [
                "SOC 2 Type II: Improves security controls and monitoring",
                "GDPR: Enhances data protection and privacy measures", 
                "HIPAA: Strengthens safeguards for protected health information",
                "PCI DSS: Meets security requirements for payment data"
              ]
            }
          ]
        };

      case 'cost optimization':
        return {
          ...baseContent,
          sections: [
            {
              title: "Cost Optimization Overview",
              content: [
                "This optimization opportunity can reduce your cloud spending without impacting performance.",
                "Right-sizing resources and optimizing configurations typically saves 15-40% on cloud costs."
              ]
            },
            {
              title: "Implementation Strategy",
              content: [
                "1. Analyze current resource utilization patterns",
                "2. Identify over-provisioned or underutilized resources", 
                "3. Apply right-sizing recommendations gradually",
                "4. Monitor performance impact after changes",
                "5. Set up cost monitoring and budgets for ongoing optimization"
              ]
            },
            {
              title: "Optimization Techniques",
              content: [
                "• Right-size EC2 instances based on CPU and memory usage",
                "• Convert to newer generation instance types (gp2 → gp3)",
                "• Implement auto-scaling for variable workloads",
                "• Use Reserved Instances for predictable workloads",
                "• Clean up unused resources and snapshots regularly"
              ]
            },
            {
              title: "ROI Calculation",
              content: [
                "Monthly Savings: $450-$650 per optimization",
                "Annual Impact: $5,400-$7,800 cost reduction",
                "Payback Period: Immediate upon implementation",
                "Performance Impact: Minimal to zero degradation expected"
              ]
            }
          ]
        };

      case 'performance':
        return {
          ...baseContent,
          sections: [
            {
              title: "Performance Enhancement Overview", 
              content: [
                "This performance improvement will reduce latency and improve user experience globally.",
                "CDN implementation typically reduces response times by 40-60% and improves cache hit ratios to 85%+."
              ]
            },
            {
              title: "Implementation Roadmap",
              content: [
                "1. Deploy CloudFront distribution with global edge locations",
                "2. Configure origin access controls for security",
                "3. Optimize cache behaviors and TTL settings",
                "4. Enable compression for text-based content",
                "5. Monitor performance metrics and fine-tune configuration"
              ]
            },
            {
              title: "Performance Gains",
              content: [
                "• 40% reduction in global response times",
                "• 25% improvement in request handling capacity",
                "• 85% cache hit ratio for static content",
                "• <100ms latency from major global regions",
                "• Improved Core Web Vitals and SEO rankings"
              ]
            },
            {
              title: "Monitoring & Optimization",
              content: [
                "CloudWatch Metrics: Monitor cache hit ratios and origin requests",
                "Real User Monitoring: Track actual user experience improvements",
                "Core Web Vitals: Measure LCP, FID, and CLS improvements",
                "Geographic Performance: Analyze latency from different regions"
              ]
            }
          ]
        };

      default:
        return {
          ...baseContent,
          sections: [
            {
              title: "General Best Practices",
              content: [
                "Follow infrastructure as code principles",
                "Implement comprehensive monitoring",
                "Regular security audits and compliance checks"
              ]
            }
          ]
        };
    }
  };

  const openDocumentation = (category: string, issue: any) => {
    const content = getDocumentationContent(category, issue);
    setDocumentationModal({ isOpen: true, content });
  };

  const fixes = [
    {
      category: "Security",
      severity: "high",
      icon: Shield,
      color: "destructive",
      issues: [
        {
          title: "S3 Bucket Public Read Access",
          description: "Your S3 bucket allows public read access which could expose sensitive data.",
          impact: "Data breach risk, compliance violations",
          priority: "Critical",
          timeToFix: "5 minutes",
          code: `resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.example.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`,
          language: "terraform"
        },
        {
          title: "RDS Instance Without Encryption",
          description: "Database instance is not encrypted at rest, exposing sensitive data.",
          impact: "Data confidentiality risk",
          priority: "High",
          timeToFix: "2 minutes",
          code: `resource "aws_db_instance" "example" {
  # ... other configuration
  
  storage_encrypted = true
  kms_key_id       = aws_kms_key.example.arn
}`,
          language: "terraform"
        }
      ]
    },
    {
      category: "Cost Optimization",
      severity: "medium",
      icon: DollarSign,
      color: "warning",
      issues: [
        {
          title: "Oversized EC2 Instances",
          description: "Several EC2 instances are oversized for their current CPU utilization.",
          impact: "Monthly cost savings: $450",
          priority: "Medium",
          timeToFix: "10 minutes",
          code: `resource "aws_instance" "web" {
  ami           = "ami-12345678"
  instance_type = "t3.medium"  # Changed from t3.large
  
  tags = {
    Name        = "WebServer"
    Environment = "production"
  }
}`,
          language: "terraform"
        },
        {
          title: "Unused EBS Volumes",
          description: "Found 3 unattached EBS volumes incurring unnecessary costs.",
          impact: "Monthly savings: $120",
          priority: "Low",
          timeToFix: "5 minutes",
          code: `# Remove unused volumes or add lifecycle policy
resource "aws_ebs_volume" "data" {
  availability_zone = "us-west-2a"
  size              = 40
  type              = "gp3"  # More cost-effective than gp2
  
  tags = {
    Name = "data-volume"
  }
}`,
          language: "terraform"
        }
      ]
    },
    {
      category: "Performance",
      severity: "low",
      icon: Zap,
      color: "success",
      issues: [
        {
          title: "Missing CloudFront CDN",
          description: "Static assets are served directly from S3 without CDN caching.",
          impact: "40% faster page load times globally",
          priority: "Medium",
          timeToFix: "15 minutes",
          code: `resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.example.bucket_regional_domain_name
    origin_id   = "S3-example"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.example.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-example"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}`,
          language: "terraform"
        }
      ]
    }
  ];



  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Architecture 
              <span className="text-gradient"> Fix Suggestions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Actionable recommendations to improve your cloud infrastructure security, 
              performance, and cost efficiency.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-destructive">2</div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-warning">$570</div>
                <div className="text-sm text-muted-foreground">Monthly Savings</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">37m</div>
                <div className="text-sm text-muted-foreground">Time to Fix All</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">{implementedFixes.size}</div>
                <div className="text-sm text-muted-foreground">Fixed Issues</div>
              </CardContent>
            </Card>
          </div>

          {/* Fixes by Category */}
          <div className="space-y-8">
            {fixes.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <Card key={category.category} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          category.color === 'destructive' ? 'bg-destructive/10' :
                          category.color === 'warning' ? 'bg-warning/10' : 'bg-success/10'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            category.color === 'destructive' ? 'text-destructive' :
                            category.color === 'warning' ? 'text-warning' : 'text-success'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{category.category}</CardTitle>
                          <CardDescription>
                            {category.issues.length} issue{category.issues.length !== 1 ? 's' : ''} found
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(category.severity) as any}>
                        {category.severity} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.issues.map((issue, issueIndex) => {
                        const fixIndex = categoryIndex * 100 + issueIndex;
                        return (
                          <AccordionItem key={issueIndex} value={`item-${fixIndex}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center justify-between w-full mr-4">
                                <div className="text-left">
                                  <div className="font-semibold">{issue.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {issue.impact}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{issue.timeToFix}</Badge>
                                  <Badge variant={
                                    issue.priority === 'Critical' ? 'destructive' :
                                    issue.priority === 'High' ? 'destructive' :
                                    issue.priority === 'Medium' ? 'default' : 'secondary'
                                  }>
                                    {issue.priority}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            
                            <AccordionContent className="space-y-4">
                              <p className="text-muted-foreground">
                                {issue.description}
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold flex items-center space-x-2">
                                    <Code className="w-4 h-4" />
                                    <span>Fix Implementation</span>
                                  </h4>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(issue.code, fixIndex)}
                                  >
                                    {copiedIndex === fixIndex ? (
                                      <CheckCircle className="w-4 h-4 text-success mr-2" />
                                    ) : (
                                      <Copy className="w-4 h-4 mr-2" />
                                    )}
                                    {copiedIndex === fixIndex ? "Copied!" : "Copy Code"}
                                  </Button>
                                </div>
                                
                                <div className="relative">
                                  {implementedFixes.has(`${categoryIndex}-${issueIndex}`) && fixResults.has(`${categoryIndex}-${issueIndex}`) ? (
                                    <div className="space-y-4">
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => setViewMode(prevMode => ({ 
                                            ...prevMode, 
                                            [`${categoryIndex}-${issueIndex}`]: 
                                              prevMode[`${categoryIndex}-${issueIndex}`] === 'after' ? 'before' : 'after' 
                                          }))}
                                          className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        >
                                          Show {(viewMode[`${categoryIndex}-${issueIndex}`] || 'before') === 'before' ? 'Updated Code' : 'Original Code'}
                                        </button>
                                        <div className="text-xs text-muted-foreground flex items-center">
                                          <CheckCircle className="w-3 h-3 mr-1 text-success" />
                                          Applied: {fixResults.get(`${categoryIndex}-${issueIndex}`)?.details?.changeId}
                                        </div>
                                      </div>
                                      
                                      <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto border-l-4 border-success">
                                        <code>
                                          {(viewMode[`${categoryIndex}-${issueIndex}`] || 'before') === 'after' 
                                            ? fixResults.get(`${categoryIndex}-${issueIndex}`)?.details?.changes?.after || issue.code
                                            : issue.code
                                          }
                                        </code>
                                      </pre>
                                      
                                      {/* Show detailed changes */}
                                      {fixResults.get(`${categoryIndex}-${issueIndex}`)?.details?.changes?.diff && (
                                        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                          <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Configuration Changes Applied
                                          </h5>
                                          <div className="text-sm space-y-1">
                                            {fixResults.get(`${categoryIndex}-${issueIndex}`).details.changes.diff.map((change, idx) => (
                                              <div key={idx} className="font-mono text-green-700 dark:text-green-300">
                                                {change}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Show infrastructure changes */}
                                      {fixResults.get(`${categoryIndex}-${issueIndex}`)?.details?.infrastructureChanges && (
                                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Infrastructure Updates</h5>
                                          <div className="text-sm space-y-1">
                                            {fixResults.get(`${categoryIndex}-${issueIndex}`).details.infrastructureChanges.map((change, idx) => (
                                              <div key={idx} className="text-blue-700 dark:text-blue-300">• {change}</div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                                      <code>{issue.code}</code>
                                    </pre>
                                  )}
                                </div>
                                
                                <div className="flex gap-3">
                                  {implementedFixes.has(`${categoryIndex}-${issueIndex}`) ? (
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="border-success text-success"
                                        disabled
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Applied
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => rollbackFix(`${categoryIndex}-${issueIndex}`)}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        Rollback
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => applyFix(`${categoryIndex}-${issueIndex}`, {
                                        ...issue,
                                        category: category.category
                                      })}
                                      disabled={applyingFixes.has(`${categoryIndex}-${issueIndex}`)}
                                    >
                                      {applyingFixes.has(`${categoryIndex}-${issueIndex}`) ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Applying...
                                        </>
                                      ) : (
                                        <>
                                          <Wrench className="w-4 h-4 mr-2" />
                                          Apply Fix
                                        </>
                                      )}
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openDocumentation(category.category, issue)}
                                  >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    View Documentation
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={async () => {
                  // Apply all critical fixes (high priority issues)
                  const criticalFixes = fixes.filter(category => category.severity === 'high')
                    .flatMap((category, categoryIndex) => 
                      category.issues.map((issue, issueIndex) => ({
                        fixId: `${categoryIndex}-${issueIndex}`,
                        fixData: { ...issue, category: category.category }
                      }))
                    );
                  
                  for (const { fixId, fixData } of criticalFixes) {
                    if (!implementedFixes.has(fixId)) {
                      await applyFix(fixId, fixData);
                      // Add delay between fixes for better UX
                      await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                  }
                }}
                disabled={applyingFixes.size > 0}
              >
                {applyingFixes.size > 0 ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Applying Critical Fixes...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Apply All Critical Fixes
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/results/diagram">
                  View Architecture Diagram
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/results/share">
                  Export Fix Report
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Need help implementing these fixes?{" "}
              <Link to="/assistant" className="text-primary hover:underline">
                Ask our AI Assistant
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Professional Documentation Modal */}
      {documentationModal.isOpen && documentationModal.content && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background/95 backdrop-blur border border-white/10 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold">{documentationModal.content.title}</h2>
                <p className="text-muted-foreground mt-1">{documentationModal.content.description}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDocumentationModal({ isOpen: false, content: null })}
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[70vh] p-6">
              <div className="space-y-8">
                {documentationModal.content.sections?.map((section: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.content.map((item: string, itemIndex: number) => (
                        <div key={itemIndex} className="text-muted-foreground leading-relaxed">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Additional Resources */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">AWS Documentation</h4>
                        <p className="text-sm text-muted-foreground">
                          Official AWS best practices and implementation guides
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Security Standards</h4>
                        <p className="text-sm text-muted-foreground">
                          Industry compliance requirements and security frameworks
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-muted/10">
              <Button
                variant="outline"
                onClick={() => setDocumentationModal({ isOpen: false, content: null })}
              >
                Close
              </Button>
              <Button variant="default">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open External Docs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fixes;