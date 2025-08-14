import { useState, useRef, useEffect } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GeoRegionSelector from "@/components/ui/geo-region-selector";
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
  Globe,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Lightbulb,
  Target,
  TrendingUp,
  X,
  Upload,
  Search,
  Share2,
  MapPin
} from "lucide-react";
import { ChatLoading } from "@/components/ui/loading-skeleton";
import StructuredResponse from "@/components/ui/structured-response";

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
      content: `Welcome to StackStage Cloud Intelligence Assistant! I'm your dedicated cloud architecture expert, specifically designed for enterprise teams. I provide expert guidance on:

**Cloud Architecture & Strategy**
• Multi-cloud and hybrid cloud architecture design
• Microservices and serverless architecture patterns
• Container orchestration with Kubernetes and Docker
• Infrastructure as Code (IaC) with Terraform, CloudFormation, Pulumi

**Security & Compliance**
• Cloud security posture management and zero-trust architecture
• Compliance frameworks (SOC 2, HIPAA, PCI DSS, ISO 27001)
• Identity and Access Management (IAM) best practices
• Security automation and threat detection

**Cost Optimization & FinOps**
• Cloud cost analysis and right-sizing recommendations
• Reserved instances and spot instance strategies
• Multi-cloud cost optimization and billing management
• FinOps implementation and governance frameworks

**DevOps & Automation**
• CI/CD pipeline optimization and GitOps workflows
• Infrastructure monitoring and observability strategies
• Disaster recovery and business continuity planning
• Performance optimization and auto-scaling policies

Select your role below to get personalized recommendations, or ask me anything about your cloud infrastructure!`,
      timestamp: new Date(),
      suggestions: [
        "Review my Kubernetes cluster security configuration",
        "Optimize multi-cloud cost allocation strategy", 
        "Design a zero-trust architecture for microservices",
        "Implement GitOps workflow for infrastructure deployment"
      ]
    }
  ]);
  
  const [currentRole, setCurrentRole] = useState<'CTO' | 'DevOps' | 'Architect' | null>(null);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    responseLength: 'medium',
    technicality: 'balanced',
    autoSuggestions: true,
    soundNotifications: false,
    saveChatHistory: true,
    includeCodeExamples: true,
    realTimeAnalysis: true,
    complianceMode: false
  });
  const [selectedRegion, setSelectedRegion] = useState("us-east-1");
  const [regionalImpact, setRegionalImpact] = useState<any>(null);
  const [showRegionSelector, setShowRegionSelector] = useState(false);

  // Export chat functionality
  const exportChat = async () => {
    try {
      const response = await fetch('/api/chat/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp
          })),
          session_info: {
            role: currentRole,
            region: selectedRegion,
            export_date: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Download PDF
        const pdfBlob = new Blob([
          Uint8Array.from(atob(result.pdf_data), c => c.charCodeAt(0))
        ], { type: 'application/pdf' });
        
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

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
      title: "Cloud Security Assessment",
      description: "Zero-trust architecture and multi-cloud security audit",
      icon: Shield,
      prompt: "I need a comprehensive cloud security assessment covering zero-trust architecture, IAM policies, network security, data encryption, and compliance posture across my multi-cloud environment. Please provide actionable security recommendations with implementation timelines.",
      color: "green",
      badge: "Enterprise",
      stats: { usage: "5.2k", rating: 4.9 }
    },
    {
      id: "finops",
      title: "FinOps Cost Strategy",
      description: "Advanced cloud cost optimization and financial governance",
      icon: TrendingUp,
      prompt: "Analyze my cloud spending patterns across AWS, Azure, and GCP. I need FinOps strategies for cost allocation, right-sizing, reserved instances optimization, and implementing cloud cost governance frameworks for our organization.",
      color: "blue",
      badge: "Popular",
      stats: { usage: "4.8k", rating: 4.8 }
    },
    {
      id: "kubernetes",
      title: "Kubernetes at Scale",
      description: "Production-ready K8s cluster optimization and management",
      icon: Code,
      prompt: "Help me optimize my Kubernetes clusters for production workloads handling 100k+ daily users. I need guidance on resource management, security hardening, networking, monitoring, GitOps workflows, and multi-cluster management.",
      color: "purple",
      badge: "Expert",
      stats: { usage: "3.7k", rating: 4.9 }
    },
    {
      id: "architecture",
      title: "Cloud-Native Architecture",
      description: "Microservices, serverless, and scalable system design",
      icon: Cloud,
      prompt: "I need to design a cloud-native architecture for a microservices application with auto-scaling, disaster recovery, observability, and multi-region deployment. Include API gateway, service mesh, and event-driven patterns.",
      color: "cyan",
      badge: "Pro",
      stats: { usage: "3.1k", rating: 4.8 }
    },
    {
      id: "devops",
      title: "DevOps Pipeline Excellence",
      description: "CI/CD optimization and infrastructure automation",
      icon: Cpu,
      prompt: "Optimize my DevOps pipeline with advanced CI/CD practices, infrastructure as code, automated testing, security scanning, deployment strategies, and observability for cloud-native applications.",
      color: "orange",
      badge: "Pro",
      stats: { usage: "2.9k", rating: 4.7 }
    },
    {
      id: "compliance",
      title: "Enterprise Compliance",
      description: "SOC 2, HIPAA, PCI DSS compliance implementation",
      icon: CheckCircle,
      prompt: "I need comprehensive compliance guidance for SOC 2 Type II, HIPAA, and PCI DSS requirements in my cloud infrastructure. Please provide implementation roadmap, audit preparation strategies, and automated compliance monitoring.",
      color: "green",
      badge: "Enterprise",
      stats: { usage: "1.8k", rating: 4.9 }
    }
  ];

  const quickActions = [
    { label: "Upload Config", icon: FileText },
    { label: "Scan Infrastructure", icon: BarChart3 },
    { label: "Generate Report", icon: Download },
    { label: "Share Analysis", icon: Share }
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
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Prepare message history for OpenAI
      const messageHistory = [...messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
      }));

      // Call enhanced AI assistant API
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory,
          role: currentRole
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      // Handle both structured and unstructured responses
      const assistantResponse = data.structured ? data.response : data.response;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      // Professional error handling
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I apologize, but I'm experiencing technical difficulties. ${error instanceof Error ? error.message : 'Please try again in a moment.'}\n\nIn the meantime, you can:\n• Check your internet connection\n• Try rephrasing your question\n• Use one of the quick start templates above`,
        timestamp: new Date(),
        suggestions: [
          "Try the Security Analysis template",
          "Use the Cost Optimization template",
          "Ask about performance tuning",
          "Contact support if issues persist"
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Generate contextual suggestions based on AI response and user input
  const generateSuggestions = (aiResponse: string | any, userInput: string): string[] => {
    const suggestions = [];
    
    // Extract content from response object or use as string
    const responseContent = typeof aiResponse === 'object' ? 
      (aiResponse.content || aiResponse.response || JSON.stringify(aiResponse)) : 
      (aiResponse || '');
    
    const contentLower = responseContent.toString().toLowerCase();
    
    // Professional cloud-focused suggestions based on response content
    if (contentLower.includes('security') || contentLower.includes('compliance') || contentLower.includes('iam')) {
      suggestions.push("Generate security checklist for implementation");
      suggestions.push("Show me compliance audit framework");
      suggestions.push("Create IAM policy templates");
    }
    
    if (contentLower.includes('cost') || contentLower.includes('finops') || contentLower.includes('optimization')) {
      suggestions.push("Build cost monitoring dashboard strategy");
      suggestions.push("Create FinOps governance framework");
      suggestions.push("Generate reserved instance recommendations");
    }
    
    if (contentLower.includes('kubernetes') || contentLower.includes('container') || contentLower.includes('orchestration')) {
      suggestions.push("Show me Kubernetes security hardening steps");
      suggestions.push("Create GitOps workflow implementation");
      suggestions.push("Generate monitoring and alerting setup");
    }
    
    if (contentLower.includes('terraform') || contentLower.includes('cloudformation') || contentLower.includes('iac')) {
      suggestions.push("Create Infrastructure as Code templates");
      suggestions.push("Generate deployment pipeline configuration");
      suggestions.push("Show me state management best practices");
    }
    
    // Enterprise-focused generic suggestions
    suggestions.push("Generate technical implementation roadmap");
    suggestions.push("Create executive summary for stakeholders");
    suggestions.push("Show me metrics and KPIs to track");
    
    // Return 4 most relevant suggestions
    return suggestions.slice(0, 4);
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
              <div>
                <Card className="glass-card border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">StackStage AI</CardTitle>
                        <CardDescription>Cloud Architecture Expert</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-muted-foreground">Online & Ready</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Response time: ~2s</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-muted-foreground">99.9% accuracy</span>
                      </div>
                    </div>
                    
                    {/* Role Selector */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Select Your Role</Label>
                        <Select value={currentRole || ""} onValueChange={(value: 'CTO' | 'DevOps' | 'Architect') => setCurrentRole(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose your role for personalized advice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CTO">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span>CTO - Business Impact</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="DevOps">
                              <div className="flex items-center space-x-2">
                                <Code className="w-4 h-4 text-green-500" />
                                <span>DevOps - Operations</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Architect">
                              <div className="flex items-center space-x-2">
                                <Cloud className="w-4 h-4 text-purple-500" />
                                <span>Architect - Design</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Geo-Region Configuration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-primary" />
                    Target Region
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRegionSelector(!showRegionSelector)}
                    className="h-8 w-8 p-0"
                  >
                    {showRegionSelector ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {showRegionSelector ? (
                  <GeoRegionSelector
                    selectedRegion={selectedRegion}
                    onRegionChange={setSelectedRegion}
                    onRegionalImpact={setRegionalImpact}
                    showAutoDetect={true}
                    showImpactPreview={false}
                    className="mb-0"
                  />
                ) : (
                  <Card className="glass-card border-white/10">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {selectedRegion === "us-east-1" ? "🇺🇸" : 
                             selectedRegion === "eu-west-1" ? "🇮🇪" : 
                             selectedRegion === "ap-south-1" ? "🇮🇳" : "🌍"}
                          </span>
                          <div>
                            <p className="text-sm font-medium">
                              {selectedRegion === "us-east-1" ? "US East" : 
                               selectedRegion === "eu-west-1" ? "Europe" : 
                               selectedRegion === "ap-south-1" ? "Asia Pacific" : "Global"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {regionalImpact?.latency || "Baseline latency"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRegionSelector(true)}
                          className="h-6 text-xs px-2 glass-button"
                        >
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Quick Start Templates */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                  Quick Start
                </h3>
                <div className="space-y-2">
                  {conversationTemplates.map((template) => (
                    <div key={template.id}>
                      <Card 
                        className={`cursor-pointer transition-all duration-200 glass-card border border-white/10 hover:shadow-lg hover:border-primary/30 ${
                          selectedTemplate === template.id 
                            ? 'ring-2 ring-primary bg-primary/5 border-primary/30' 
                            : 'hover:bg-background/90'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${template.color}-500/10 border border-${template.color}-500/20`}>
                                  <template.icon className={`w-4 h-4 text-${template.color}-500`} />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-sm text-foreground">{template.title}</h4>
                                    {template.badge && (
                                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                        {template.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                                </div>
                              </div>
                            </div>
                            
                            {template.stats && (
                              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                  <span className="flex items-center space-x-1">
                                    <User className="w-3 h-3" />
                                    <span>{template.stats.usage}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{template.stats.rating}</span>
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  Start →
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    "🔍 Analyze Infrastructure",
                    "💰 Cost Optimization Review", 
                    "🔐 Security Assessment",
                    "📊 Performance Metrics"
                  ].map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 rounded-lg bg-background/50 border border-white/10 text-sm font-medium cursor-pointer hover:bg-background/80 hover:border-white/20 transition-all duration-200"
                    >
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-3">
              <div className="h-full">
                <Card className="glass-card border-primary/20 h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border/50 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/ai-avatar.png" />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm">StackStage AI Assistant</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            <span>Active now</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs py-0">
                          <Sparkles className="w-2.5 h-2.5 mr-1" />
                          AI Powered
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
                          <Settings className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4 h-[calc(100vh-28rem)] overflow-y-auto scroll-smooth">
                    <div className="space-y-6 pb-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className="flex items-start space-x-2">
                              {message.type === 'assistant' && (
                                <Avatar className="w-6 h-6 mt-1">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                                    <Bot className="w-3 h-3" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className="space-y-2 flex-1">
                                <div
                                  className={`rounded-lg px-3 py-2 ${
                                    message.type === 'user'
                                      ? 'bg-primary text-primary-foreground ml-auto'
                                      : 'bg-muted'
                                  } ${message.id === '1' && message.type === 'assistant' ? 'max-h-64 overflow-auto' : ''}`}
                                >
                                  <div className="text-sm leading-relaxed">
                                    {typeof message.content === 'object' && message.content.score !== undefined ? (
                                      <StructuredResponse 
                                        data={message.content} 
                                        parsingError={message.content.score === 0 && message.content.summary?.includes("parsing failed")}
                                      />
                                    ) : (
                                      <div className="whitespace-pre-wrap">
                                        {typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Message Actions */}
                                {message.type === 'assistant' && (
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <span>{message.timestamp.toLocaleTimeString()}</span>
                                    <Button variant="ghost" size="sm" className="h-5 px-1.5">
                                      <Copy className="w-2.5 h-2.5" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 px-1.5">
                                      <ThumbsUp className="w-2.5 h-2.5" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 px-1.5">
                                      <ThumbsDown className="w-2.5 h-2.5" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 px-1.5">
                                      <RefreshCw className="w-2.5 h-2.5" />
                                    </Button>
                                  </div>
                                )}
                                
                                {/* Suggestions */}
                                {message.suggestions && (
                                  <div className="space-y-1.5">
                                    <p className="text-xs text-muted-foreground">Suggested follow-ups:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {message.suggestions.map((suggestion, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-6 px-2"
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
                                <Avatar className="w-6 h-6 mt-1">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    <User className="w-3 h-3" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Professional AI Typing Indicator */}
                      {isTyping && <ChatLoading className="ml-8" />}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t border-border/50 p-3">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask about cloud architecture, Kubernetes, DevOps, security, FinOps..."
                          className="min-h-[44px] max-h-24 resize-none pr-16 text-sm"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center space-x-0.5">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <PaperclipIcon className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Mic className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="h-[44px] px-4"
                          variant="hero"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span>Press Enter to send</span>
                        {currentRole && (
                          <Badge variant="outline" className="text-xs py-0">
                            {currentRole} Mode
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            const conversationHistory = messages.map(msg => ({
                              role: msg.type === 'assistant' ? 'assistant' : 'user',
                              content: msg.content
                            }));
                            
                            fetch('/api/assistant/export/pdf', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ messages: conversationHistory, role: currentRole })
                            })
                            .then(response => response.blob())
                            .then(blob => {
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'stackstage_chat.pdf';
                              a.click();
                              URL.revokeObjectURL(url);
                            });
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                        <span>Enterprise Cloud Intelligence</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Secure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="glass-card border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              AI Assistant Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Response Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                Response Preferences
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responseLength">Response Length</Label>
                  <Select value={settings.responseLength} onValueChange={(value) => setSettings({...settings, responseLength: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief - Quick answers</SelectItem>
                      <SelectItem value="medium">Medium - Balanced detail</SelectItem>
                      <SelectItem value="detailed">Detailed - Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technicality">Technical Level</Label>
                  <Select value={settings.technicality} onValueChange={(value) => setSettings({...settings, technicality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - Simple terms</SelectItem>
                      <SelectItem value="balanced">Balanced - Mixed approach</SelectItem>
                      <SelectItem value="expert">Expert - Technical depth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                AI Features
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Suggestions</Label>
                    <p className="text-sm text-muted-foreground">Show suggested questions after responses</p>
                  </div>
                  <Switch 
                    checked={settings.autoSuggestions} 
                    onCheckedChange={(checked) => setSettings({...settings, autoSuggestions: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Code Examples</Label>
                    <p className="text-sm text-muted-foreground">Provide code snippets when relevant</p>
                  </div>
                  <Switch 
                    checked={settings.includeCodeExamples} 
                    onCheckedChange={(checked) => setSettings({...settings, includeCodeExamples: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Analysis</Label>
                    <p className="text-sm text-muted-foreground">Enable live infrastructure monitoring insights</p>
                  </div>
                  <Switch 
                    checked={settings.realTimeAnalysis} 
                    onCheckedChange={(checked) => setSettings({...settings, realTimeAnalysis: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compliance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enhanced security and compliance checking</p>
                  </div>
                  <Switch 
                    checked={settings.complianceMode} 
                    onCheckedChange={(checked) => setSettings({...settings, complianceMode: checked})}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy & Storage */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="w-4 h-4 mr-2 text-primary" />
                Privacy & Storage
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Save Chat History</Label>
                    <p className="text-sm text-muted-foreground">Store conversations for future reference</p>
                  </div>
                  <Switch 
                    checked={settings.saveChatHistory} 
                    onCheckedChange={(checked) => setSettings({...settings, saveChatHistory: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sound when receiving responses</p>
                  </div>
                  <Switch 
                    checked={settings.soundNotifications} 
                    onCheckedChange={(checked) => setSettings({...settings, soundNotifications: checked})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSettingsOpen(false)} className="bg-primary">
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Assistant;