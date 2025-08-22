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
  Loader2
} from "lucide-react";

const Fixes = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [implementedFixes, setImplementedFixes] = useState<Set<string>>(new Set());
  const [applyingFixes, setApplyingFixes] = useState<Set<string>>(new Set());
  const [fixResults, setFixResults] = useState<Map<string, any>>(new Map());

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
        
        // Show success notification
        const benefits = result.details?.estimatedBenefits || {};
        const benefitText = Object.values(benefits).filter(Boolean).join(', ');
        alert(`✅ Fix applied successfully!\n\nType: ${result.details?.type}\nBenefits: ${benefitText}`);
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
                <div className="text-2xl font-bold text-success">0</div>
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
                                  <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                                    <code>{issue.code}</code>
                                  </pre>
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
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="w-4 h-4 mr-2" />
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
    </div>
  );
};

export default Fixes;