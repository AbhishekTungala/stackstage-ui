import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  Settings,
  Mic,
  PaperclipIcon,
  MoreHorizontal,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Share,
  Clock,
  Shield,
  Cpu,
  BarChart3,
  Code,
  Database,
  Cloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  suggestions?: string[];
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Welcome to StackStage Enterprise AI – your dedicated cloud architecture intelligence platform. I'm powered by advanced ML models trained on thousands of production environments and industry best practices.

**🚀 Enterprise Capabilities:**
• **Real-time Infrastructure Analysis** – Deep scanning of AWS, Azure, GCP environments
• **Predictive Cost Intelligence** – AI-driven cost forecasting and optimization recommendations  
• **Zero-Trust Security Assessment** – Advanced threat modeling and compliance validation
• **Performance Optimization Engine** – Automated bottleneck detection and scaling recommendations
• **Regulatory Compliance Suite** – SOC 2, ISO 27001, GDPR, HIPAA compliance verification

**💡 Advanced Features:**
• Multi-cloud architecture reviews with deployment blueprints
• Real-time anomaly detection with automated remediation suggestions
• Custom policy enforcement and drift detection
• Infrastructure-as-Code generation and validation
• Executive-ready reports with ROI analysis

Ready to optimize your cloud infrastructure? Let's start with your specific challenges.`,
      timestamp: new Date(),
      suggestions: [
        "Perform comprehensive security audit of my production environment",
        "Generate cost optimization roadmap with ROI projections",
        "Create multi-cloud disaster recovery strategy",
        "Assess compliance readiness for SOC 2 certification"
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const conversationTemplates = [
    {
      id: "security",
      title: "Enterprise Security Audit",
      description: "Zero-trust security assessment with threat modeling",
      icon: Shield,
      prompt: "Conduct a comprehensive enterprise security audit of my cloud infrastructure, including zero-trust architecture assessment, threat modeling, and advanced persistent threat detection. Provide executive summary with risk scores and remediation roadmap.",
      color: "red",
      badge: "Critical",
      stats: "99.9% threat detection"
    },
    {
      id: "cost",
      title: "Cost Intelligence & ROI",
      description: "AI-powered cost optimization with forecasting",
      icon: TrendingUp,
      prompt: "Perform advanced cost intelligence analysis including predictive forecasting, rightsizing recommendations, reserved instance optimization, and multi-cloud cost comparison. Generate executive dashboard with 12-month ROI projections.",
      color: "green",
      badge: "High Impact",
      stats: "Average 35% savings"
    },
    {
      id: "performance",
      title: "Performance Engineering",
      description: "Advanced performance optimization and scaling",
      icon: Cpu,
      prompt: "Execute comprehensive performance engineering analysis including auto-scaling optimization, database performance tuning, CDN configuration, and microservices architecture review. Provide performance benchmarks and SLA improvements.",
      color: "blue",
      badge: "Enterprise",
      stats: "Up to 10x performance"
    },
    {
      id: "compliance",
      title: "Regulatory Compliance Suite",
      description: "Multi-framework compliance validation",
      icon: CheckCircle,
      prompt: "Comprehensive compliance assessment across SOC 2 Type II, ISO 27001, GDPR, HIPAA, PCI DSS, and industry-specific regulations. Generate audit-ready documentation and remediation timeline with priority matrix.",
      color: "purple",
      badge: "Audit Ready",
      stats: "100% compliance score"
    },
    {
      id: "architecture",
      title: "Cloud Architecture Review",
      description: "Enterprise architecture patterns and modernization",
      icon: Cloud,
      prompt: "Deep architectural review including microservices migration strategy, cloud-native transformation roadmap, serverless opportunities, and technology stack modernization. Provide architectural decision records and implementation timeline.",
      color: "indigo",
      badge: "Strategic",
      stats: "Future-proof design"
    },
    {
      id: "disaster",
      title: "Business Continuity & DR",
      description: "Multi-region disaster recovery planning",
      icon: AlertTriangle,
      prompt: "Design comprehensive business continuity and disaster recovery strategy including RTO/RPO analysis, multi-region failover architecture, data backup strategies, and crisis management procedures. Include tabletop exercise scenarios.",
      color: "orange",
      badge: "Mission Critical",
      stats: "99.99% uptime target"
    }
  ];

  const quickActions = [
    { label: "Upload Infrastructure Config", icon: FileText, description: "Terraform, ARM, CloudFormation" },
    { label: "Real-time Infrastructure Scan", icon: BarChart3, description: "Live environment analysis" },
    { label: "Executive Summary Report", icon: Download, description: "C-suite ready insights" },
    { label: "Secure Team Collaboration", icon: Share, description: "Enterprise sharing & access" },
    { label: "Custom Policy Validation", icon: CheckCircle, description: "Governance & compliance" },
    { label: "Cost Anomaly Detection", icon: AlertTriangle, description: "Automated monitoring" }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: `## 🎯 Enterprise Analysis Complete

I've conducted a comprehensive deep-dive analysis of your request: "${inputMessage.slice(0, 60)}..."

### 📊 Executive Summary
**Risk Score: 7.2/10** | **Potential Savings: $847K annually** | **Implementation Timeline: 90 days**

### 🔍 Key Findings & Strategic Recommendations

**🛡️ SECURITY ARCHITECTURE (Priority: Critical)**
• **Zero-Trust Implementation Gap**: 67% of services lack proper segmentation
• **Identity & Access Management**: 23 over-privileged accounts detected
• **Data Encryption**: 4 databases with encryption at rest disabled
• **Network Security**: Missing WAF rules for 3 critical endpoints

**💰 COST INTELLIGENCE (ROI: 312%)**
• **Reserved Instance Optimization**: $234K annual savings opportunity
• **Auto-scaling Inefficiencies**: $156K in over-provisioned compute
• **Storage Optimization**: $89K in unused EBS volumes and snapshots
• **Multi-cloud Strategy**: 23% cost reduction through workload distribution

**⚡ PERFORMANCE ENGINEERING**  
• **Database Optimization**: 3.2x query performance improvement possible
• **CDN Configuration**: 45% faster global content delivery
• **Microservices Architecture**: 67% reduction in service dependencies

### 🚀 Next Steps & Implementation Roadmap

**Phase 1 (30 days)**: Security hardening and immediate cost optimizations
**Phase 2 (60 days)**: Performance tuning and architectural improvements  
**Phase 3 (90 days)**: Advanced automation and monitoring implementation

Would you like me to generate detailed implementation blueprints for any specific area?`,
          suggestions: [
            "Generate Phase 1 security implementation blueprint",
            "Create detailed cost optimization roadmap with timelines",
            "Design performance improvement architecture diagrams", 
            "Prepare executive presentation with ROI analysis"
          ]
        },
        {
          content: `## 🏢 Enterprise Infrastructure Assessment Complete

**Analysis Scope**: Full production environment scan across AWS, Azure, and GCP
**Methodology**: ML-powered analysis with 50,000+ best practice validations
**Confidence Level**: 99.7% | **Audit Trail**: Complete

### 📈 Infrastructure Health Score: 8.3/10

**Multi-Cloud Environment Overview:**
• **AWS**: 847 resources across 4 regions (us-east-1, us-west-2, eu-west-1, ap-southeast-1)
• **Azure**: 234 resources in 2 regions (East US, West Europe) 
• **GCP**: 156 resources in 3 regions (us-central1, europe-west1, asia-east1)
• **Hybrid Connectivity**: 12 VPN tunnels, 8 Direct Connect/ExpressRoute links

### 🚨 Critical Findings & Executive Actions

**🔴 IMMEDIATE ATTENTION REQUIRED**
• **Compliance Gap**: SOC 2 readiness at 73% - missing 18 controls
• **Security Incident**: Potential data exfiltration risk in 2 S3 buckets
• **Cost Anomaly**: 34% spending increase detected in the last 30 days
• **Performance Degradation**: 15% increase in response times across microservices

**🟡 HIGH IMPACT OPTIMIZATIONS**  
• **Reserved Instance Strategy**: $1.2M annual commitment for $380K savings
• **Database Modernization**: Migration to managed services (67% ops reduction)
• **Container Orchestration**: Kubernetes optimization (23% resource efficiency)
• **Disaster Recovery**: RTO improvement from 4h to 15min

**🟢 STRATEGIC ENHANCEMENTS**
• **Observability Platform**: Unified monitoring across all clouds
• **Infrastructure as Code**: 100% Terraform coverage with GitOps
• **Data Lake Architecture**: Advanced analytics and ML capabilities
• **Edge Computing**: Global CDN with edge functions deployment

### 💼 Business Impact Analysis

**Immediate ROI**: $2.3M annual savings identified
**Risk Mitigation**: 89% reduction in security vulnerabilities  
**Operational Efficiency**: 45% reduction in manual operations
**Time to Market**: 67% faster deployment cycles

Ready to begin implementation? I can provide detailed runbooks and architecture diagrams.`,
          suggestions: [
            "Generate SOC 2 compliance remediation plan with timelines",
            "Create multi-cloud cost optimization strategy presentation",
            "Design comprehensive disaster recovery architecture",
            "Prepare board-level executive summary with business impact"
          ]
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        suggestions: randomResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000);
  };

  const handleTemplateSelect = (template: any) => {
    setInputMessage(template.prompt);
    setSelectedTemplate(template.id);
    textareaRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <Aurora 
          intensity={0.3} 
          speed={1.5} 
          className="aurora-background"
          fadeHeight={300}
          fadeDirection="bottom"
        />
      </div>

      <main className="relative flex-1 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Assistant Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-card border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-3xl"></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary via-primary-glow to-purple-600 rounded-xl flex items-center justify-center relative">
                        <Brain className="w-7 h-7 text-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">StackStage Enterprise AI</CardTitle>
                        <CardDescription className="text-primary font-medium">Cloud Intelligence Platform</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-lg font-bold text-green-600">99.9%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-lg font-bold text-blue-600">1.2s</div>
                        <div className="text-xs text-muted-foreground">Response</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-muted-foreground">Enterprise AI Online</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Shield className="w-4 h-4 mr-3 text-green-500" />
                        <span className="text-muted-foreground">SOC 2 Type II Certified</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Database className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-muted-foreground">50K+ Infrastructure Patterns</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Conversation Templates */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="w-5 h-5 mr-2 text-primary" />
                      Enterprise Templates
                    </CardTitle>
                    <CardDescription>AI-powered analysis templates for enterprise infrastructure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {conversationTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                            selectedTemplate === template.id 
                              ? 'ring-2 ring-primary bg-primary/5 shadow-lg' 
                              : 'hover:shadow-lg hover:border-primary/30'
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-${template.color}-500/20 to-transparent rounded-bl-2xl`}></div>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${template.color}-500/20 group-hover:bg-${template.color}-500/30 transition-colors`}>
                                <template.icon className={`w-5 h-5 text-${template.color}-600`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-sm truncate">{template.title}</h4>
                                  <Badge variant="secondary" className={`text-xs bg-${template.color}-500/10 text-${template.color}-700 border-${template.color}-500/20`}>
                                    {template.badge}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{template.description}</p>
                                <div className="flex items-center text-xs text-primary font-medium">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {template.stats}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Zap className="w-5 h-5 mr-2 text-primary" />
                      Enterprise Actions
                    </CardTitle>
                    <CardDescription>One-click infrastructure operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start h-auto p-3 hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                              <action.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{action.label}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <Card className="glass-card border-primary/20 h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/ai-avatar.png" />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">StackStage AI Assistant</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span>Active now</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Powered
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className="flex items-start space-x-3">
                              {message.type === 'assistant' && (
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                                    <Bot className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className="space-y-2 flex-1">
                                <div
                                  className={`rounded-2xl px-4 py-3 ${
                                    message.type === 'user'
                                      ? 'bg-primary text-primary-foreground ml-auto'
                                      : 'bg-muted'
                                  } ${message.id === '1' && message.type === 'assistant' ? 'max-h-96 overflow-auto' : ''}`}
                                >
                                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content}
                                  </div>
                                </div>
                                
                                {/* Message Actions */}
                                {message.type === 'assistant' && (
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <span>{message.timestamp.toLocaleTimeString()}</span>
                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                      <ThumbsUp className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                      <ThumbsDown className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                      <RefreshCw className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                                
                                {/* Suggestions */}
                                {message.suggestions && (
                                  <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Suggested follow-ups:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {message.suggestions.map((suggestion, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-7"
                                          onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                          {suggestion}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {message.type === 'user' && (
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    <User className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Typing Indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-start"
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-muted rounded-2xl px-4 py-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t border-border/50 p-4">
                    <div className="flex items-end space-x-3">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about cloud architecture, security, optimization..."
                          className="min-h-[60px] max-h-32 resize-none pr-20"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <PaperclipIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mic className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="h-[60px] px-6"
                          variant="hero"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <p>Press Enter to send, Shift+Enter for new line</p>
                      <div className="flex items-center space-x-4">
                        <span>Powered by StackStage AI</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Secure & Private</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Assistant;