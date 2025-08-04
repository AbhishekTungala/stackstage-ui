import { useState, useEffect } from "react";

import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  BookOpen,
  Code,
  Settings,
  Zap,
  Shield,
  Cloud,
  Database,
  Server,
  Monitor,
  Cpu,
  Lock,
  Users,
  Rocket,
  FileText,
  ExternalLink,
  Copy,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  PlayCircle,
  GitBranch,
  Terminal,
  Globe,
  Layers,
  BarChart3,
  Package,
  Lightbulb,
  Target,
  ChevronRight,
  Home,
  Menu,
  X
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("getting-started");
  const [selectedArticle, setSelectedArticle] = useState("quick-start");
  const [copiedCode, setCopiedCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const docSections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      description: "Quick setup and initial configuration",
      articles: [
        {
          id: "quick-start",
          title: "Quick Start Guide",
          description: "Get up and running in 5 minutes",
          readTime: "5 min",
          difficulty: "beginner",
          tags: ["setup", "basics"]
        },
        {
          id: "installation",
          title: "Installation & Setup",
          description: "Complete installation instructions",
          readTime: "10 min",
          difficulty: "beginner",
          tags: ["install", "config"]
        },
        {
          id: "authentication",
          title: "Authentication",
          description: "Setup API keys and authentication",
          readTime: "8 min",
          difficulty: "intermediate",
          tags: ["auth", "security"]
        }
      ]
    },
    {
      id: "cloud-analysis",
      title: "Cloud Analysis",
      icon: Cloud,
      description: "Infrastructure analysis and optimization",
      articles: [
        {
          id: "analysis-types",
          title: "Analysis Types",
          description: "Overview of different analysis modes",
          readTime: "12 min",
          difficulty: "beginner",
          tags: ["analysis", "features"]
        },
        {
          id: "cost-optimization",
          title: "Cost Optimization",
          description: "Reduce cloud spending with AI insights",
          readTime: "15 min",
          difficulty: "intermediate",
          tags: ["cost", "optimization"]
        },
        {
          id: "security-scanning",
          title: "Security Scanning",
          description: "Comprehensive security vulnerability detection",
          readTime: "18 min",
          difficulty: "advanced",
          tags: ["security", "scanning"]
        }
      ]
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: Code,
      description: "Complete API documentation",
      articles: [
        {
          id: "rest-api",
          title: "REST API Overview",
          description: "Core REST API endpoints and usage",
          readTime: "20 min",
          difficulty: "intermediate",
          tags: ["api", "rest"]
        },
        {
          id: "webhooks",
          title: "Webhooks",
          description: "Real-time notifications and integrations",
          readTime: "12 min",
          difficulty: "advanced",
          tags: ["webhooks", "integration"]
        },
        {
          id: "sdks",
          title: "SDKs & Libraries",
          description: "Official SDKs for popular languages",
          readTime: "8 min",
          difficulty: "intermediate",
          tags: ["sdk", "libraries"]
        }
      ]
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Layers,
      description: "Connect with your existing tools",
      articles: [
        {
          id: "aws-integration",
          title: "AWS Integration",
          description: "Connect your AWS infrastructure",
          readTime: "15 min",
          difficulty: "intermediate",
          tags: ["aws", "cloud"]
        },
        {
          id: "kubernetes",
          title: "Kubernetes",
          description: "K8s cluster analysis and monitoring",
          readTime: "20 min",
          difficulty: "advanced",
          tags: ["k8s", "containers"]
        },
        {
          id: "ci-cd",
          title: "CI/CD Integration",
          description: "Integrate with your deployment pipeline",
          readTime: "12 min",
          difficulty: "intermediate",
          tags: ["ci-cd", "devops"]
        }
      ]
    },
    {
      id: "enterprise",
      title: "Enterprise",
      icon: Shield,
      description: "Enterprise features and compliance",
      articles: [
        {
          id: "sso",
          title: "Single Sign-On",
          description: "Configure SSO for your organization",
          readTime: "10 min",
          difficulty: "advanced",
          tags: ["sso", "enterprise"]
        },
        {
          id: "compliance",
          title: "Compliance & Governance",
          description: "SOC 2, GDPR, and other compliance standards",
          readTime: "25 min",
          difficulty: "advanced",
          tags: ["compliance", "governance"]
        },
        {
          id: "audit-logs",
          title: "Audit Logs",
          description: "Access and analyze audit logs",
          readTime: "8 min",
          difficulty: "intermediate",
          tags: ["audit", "logging"]
        }
      ]
    }
  ];

  const sampleCode = {
    "quick-start": `// Initialize StackStage SDK
import { StackStage } from '@stackstage/sdk';

const client = new StackStage({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Run a comprehensive analysis
const analysis = await client.analyze({
  type: 'comprehensive',
  target: 'aws://your-account',
  options: {
    includeOptimizations: true,
    securityScan: true
  }
});

console.log('Analysis completed:', analysis.id);`,

    "rest-api": `# Start a new analysis
curl -X POST https://api.stackstage.com/v1/analysis \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "comprehensive",
    "target": "aws://123456789012",
    "options": {
      "includeOptimizations": true,
      "securityScan": true
    }
  }'

# Response
{
  "id": "analysis_12345",
  "status": "pending",
  "estimatedDuration": "2-3 minutes",
  "webhookUrl": "https://your-app.com/webhooks/stackstage"
}`,

    "aws-integration": `# AWS IAM Policy for StackStage
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "rds:Describe*",
        "s3:GetBucketLocation",
        "s3:ListBucket",
        "cloudwatch:GetMetricStatistics",
        "costs:GetRightsizingRecommendation"
      ],
      "Resource": "*"
    }
  ]
}`
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const currentSection = docSections.find(s => s.id === selectedSection);
  const currentArticle = currentSection?.articles.find(a => a.id === selectedArticle);

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    // Auto-select first article when section changes
    if (currentSection && !currentSection.articles.find(a => a.id === selectedArticle)) {
      setSelectedArticle(currentSection.articles[0]?.id || "");
    }
  }, [selectedSection, currentSection, selectedArticle]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <Aurora intensity={0.2} speed={2} className="aurora-background" />
      </div>

      <main className="relative flex-1 pt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[calc(100vh-160px)]">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-full"
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    Documentation Menu
                  </Button>
                </div>

                {/* Search */}
                <div className={`${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-input"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className={`${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {filteredSections.map((section) => (
                        <div key={section.id}>
                          <div
                            className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 ${
                              selectedSection === section.id
                                ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
                                : 'border-white/10 hover:border-white/20 hover:bg-muted/50'
                            }`}
                            onClick={() => {
                              setSelectedSection(section.id);
                              setSelectedArticle(section.articles[0]?.id || "");
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                selectedSection === section.id
                                  ? 'bg-primary/20'
                                  : 'bg-muted/80'
                              }`}>
                                <section.icon className={`w-4 h-4 ${
                                  selectedSection === section.id ? 'text-primary' : 'text-muted-foreground'
                                }`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{section.title}</h4>
                                <p className="text-xs text-muted-foreground">{section.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Articles */}
                          {selectedSection === section.id && (
                            <div className="ml-4 mt-2 space-y-1 border-l border-border/50 pl-4">
                              {section.articles.map((article) => (
                                <div
                                  key={article.id}
                                  className={`cursor-pointer p-2 rounded-lg border border-white/10 transition-all duration-200 ${
                                    selectedArticle === article.id
                                      ? 'bg-primary/5 text-primary border-primary/20'
                                      : 'hover:bg-muted/50 hover:border-white/20 text-muted-foreground'
                                  }`}
                                  onClick={() => setSelectedArticle(article.id)}
                                >
                                  <div className="text-sm font-medium">{article.title}</div>
                                  <div className="text-xs text-muted-foreground">{article.readTime}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Home className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                  <span>{currentSection?.title}</span>
                  {currentArticle && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-foreground font-medium">{currentArticle.title}</span>
                    </>
                  )}
                </div>

                {/* Article Header */}
                {currentArticle && (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-4">{currentArticle.title}</h1>
                      <p className="text-lg text-muted-foreground mb-6">{currentArticle.description}</p>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getDifficultyColor(currentArticle.difficulty)}>
                          {currentArticle.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {currentArticle.readTime} read
                        </span>
                        <div className="flex items-center space-x-2">
                          {currentArticle.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-8">
                  {/* Quick Start Content */}
                  {selectedArticle === "quick-start" && (
                    <div className="space-y-8">
                      <Card className="glass-card border-primary/20">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Rocket className="w-5 h-5 mr-2 text-primary" />
                            Quick Start
                          </CardTitle>
                          <CardDescription>
                            Get started with StackStage in just a few steps
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-xl border border-primary/20 bg-primary/5">
                              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">1</span>
                              </div>
                              <h4 className="font-semibold mb-2">Sign Up</h4>
                              <p className="text-sm text-muted-foreground">Create your account and get API keys</p>
                            </div>
                            <div className="text-center p-4 rounded-xl border border-primary/20 bg-primary/5">
                              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">2</span>
                              </div>
                              <h4 className="font-semibold mb-2">Connect</h4>
                              <p className="text-sm text-muted-foreground">Link your cloud infrastructure</p>
                            </div>
                            <div className="text-center p-4 rounded-xl border border-primary/20 bg-primary/5">
                              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-primary">3</span>
                              </div>
                              <h4 className="font-semibold mb-2">Analyze</h4>
                              <p className="text-sm text-muted-foreground">Run your first comprehensive analysis</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Code className="w-4 h-4 mr-2" />
                              Installation
                            </h4>
                            <div className="relative">
                              <pre className="bg-muted/50 border border-border/50 rounded-xl p-4 overflow-x-auto">
                                <code className="text-sm">{sampleCode["quick-start"]}</code>
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(sampleCode["quick-start"], "quick-start")}
                              >
                                {copiedCode === "quick-start" ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass-card">
                          <CardHeader>
                            <CardTitle className="text-lg">Next Steps</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Link href="#" className="flex items-center p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group">
                              <Cloud className="w-5 h-5 mr-3 text-primary" />
                              <div>
                                <div className="font-medium">Cloud Analysis</div>
                                <div className="text-sm text-muted-foreground">Learn about analysis types</div>
                              </div>
                              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="#" className="flex items-center p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group">
                              <Code className="w-5 h-5 mr-3 text-primary" />
                              <div>
                                <div className="font-medium">API Reference</div>
                                <div className="text-sm text-muted-foreground">Explore the REST API</div>
                              </div>
                              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </CardContent>
                        </Card>

                        <Card className="glass-card">
                          <CardHeader>
                            <CardTitle className="text-lg">Resources</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Link href="#" className="flex items-center p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group">
                              <PlayCircle className="w-5 h-5 mr-3 text-primary" />
                              <div>
                                <div className="font-medium">Video Tutorials</div>
                                <div className="text-sm text-muted-foreground">Step-by-step guides</div>
                              </div>
                              <ExternalLink className="w-4 h-4 ml-auto" />
                            </Link>
                            <Link href="#" className="flex items-center p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group">
                              <Users className="w-5 h-5 mr-3 text-primary" />
                              <div>
                                <div className="font-medium">Community</div>
                                <div className="text-sm text-muted-foreground">Join our Discord</div>
                              </div>
                              <ExternalLink className="w-4 h-4 ml-auto" />
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* REST API Content */}
                  {selectedArticle === "rest-api" && (
                    <div className="space-y-8">
                      <Card className="glass-card border-primary/20">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Code className="w-5 h-5 mr-2 text-primary" />
                            REST API Overview
                          </CardTitle>
                          <CardDescription>
                            Comprehensive API endpoints for cloud infrastructure analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                              <div className="text-2xl font-bold text-blue-500 mb-2">99.9%</div>
                              <div className="text-sm font-medium">Uptime SLA</div>
                            </div>
                            <div className="text-center p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                              <div className="text-2xl font-bold text-green-500 mb-2">&lt;200ms</div>
                              <div className="text-sm font-medium">Response Time</div>
                            </div>
                            <div className="text-center p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                              <div className="text-2xl font-bold text-purple-500 mb-2">Rate Limited</div>
                              <div className="text-sm font-medium">Secure & Reliable</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Example Request</h4>
                            <div className="relative">
                              <pre className="bg-muted/50 border border-border/50 rounded-xl p-4 overflow-x-auto">
                                <code className="text-sm">{sampleCode["rest-api"]}</code>
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(sampleCode["rest-api"], "rest-api")}
                              >
                                {copiedCode === "rest-api" ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* AWS Integration Content */}
                  {selectedArticle === "aws-integration" && (
                    <div className="space-y-8">
                      <Card className="glass-card border-orange-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Cloud className="w-5 h-5 mr-2 text-orange-500" />
                            AWS Integration
                          </CardTitle>
                          <CardDescription>
                            Connect and analyze your AWS infrastructure securely
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-3">Required IAM Policy</h4>
                            <div className="relative">
                              <pre className="bg-muted/50 border border-border/50 rounded-xl p-4 overflow-x-auto">
                                <code className="text-sm">{sampleCode["aws-integration"]}</code>
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(sampleCode["aws-integration"], "aws-integration")}
                              >
                                {copiedCode === "aws-integration" ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <Shield className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="font-medium text-blue-900 dark:text-blue-100">Security Best Practices</span>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              StackStage follows principle of least privilege. The IAM policy above grants only read-only access to the minimum required services for analysis.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Article Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-border/50">
                  <div>
                    {currentSection && currentSection.articles.indexOf(currentArticle!) > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = currentSection.articles.indexOf(currentArticle!);
                          setSelectedArticle(currentSection.articles[currentIndex - 1].id);
                        }}
                      >
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div>
                    {currentSection && currentSection.articles.indexOf(currentArticle!) < currentSection.articles.length - 1 && (
                      <Button
                        onClick={() => {
                          const currentIndex = currentSection.articles.indexOf(currentArticle!);
                          setSelectedArticle(currentSection.articles[currentIndex + 1].id);
                        }}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Docs;