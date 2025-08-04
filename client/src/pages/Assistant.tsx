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
      content: `Welcome to StackStage AI Assistant! I'm here to help you with cloud architecture analysis, optimization, and best practices. I can:

• Analyze your infrastructure configurations
• Provide security recommendations
• Suggest cost optimization strategies
• Answer questions about cloud best practices
• Help with compliance requirements

How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        "Analyze my AWS setup for security issues",
        "How can I reduce my cloud costs?",
        "Best practices for Kubernetes security",
        "Explain Infrastructure as Code benefits"
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
      title: "Security Analysis",
      description: "Get security recommendations for your infrastructure",
      icon: Shield,
      prompt: "Please analyze my cloud infrastructure for potential security vulnerabilities and provide detailed recommendations.",
      color: "green"
    },
    {
      id: "cost",
      title: "Cost Optimization",
      description: "Reduce cloud spending with AI insights",
      icon: TrendingUp,
      prompt: "Help me identify cost optimization opportunities in my cloud infrastructure and provide specific recommendations to reduce expenses.",
      color: "blue"
    },
    {
      id: "performance",
      title: "Performance Tuning",
      description: "Optimize infrastructure performance",
      icon: Cpu,
      prompt: "Analyze my infrastructure performance and suggest optimizations for better efficiency and response times.",
      color: "purple"
    },
    {
      id: "compliance",
      title: "Compliance Check",
      description: "Ensure regulatory compliance",
      icon: CheckCircle,
      prompt: "Review my infrastructure for compliance with industry standards like SOC 2, GDPR, and HIPAA.",
      color: "orange"
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
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: `I've analyzed your request about "${inputMessage.slice(0, 50)}...". Here's my detailed analysis:

**Key Findings:**
• Identified 3 potential security improvements
• Found 2 cost optimization opportunities
• Detected 1 performance bottleneck

**Recommendations:**
1. **Security**: Enable MFA for all admin accounts
2. **Cost**: Consider reserved instances for stable workloads
3. **Performance**: Implement auto-scaling for dynamic loads

Would you like me to elaborate on any of these recommendations?`,
          suggestions: [
            "Tell me more about the security improvements",
            "Show me the cost savings calculation",
            "How do I implement auto-scaling?",
            "Generate a detailed report"
          ]
        },
        {
          content: `Based on your infrastructure analysis request, I've generated the following insights:

**Infrastructure Overview:**
• 15 EC2 instances across 3 regions
• 8 RDS databases with varying configurations
• 12 S3 buckets with mixed access patterns

**Critical Issues Found:**
🔴 **High Priority**: Unencrypted data at rest in 3 databases
🟡 **Medium Priority**: Over-provisioned instances costing $2,400/month
🟢 **Low Priority**: Missing backup policies on 4 resources

**Immediate Actions Required:**
1. Enable encryption on RDS instances
2. Right-size EC2 instances (potential $1,200/month savings)
3. Implement automated backup schedules

Shall I provide step-by-step implementation guides for these fixes?`,
          suggestions: [
            "Show me how to enable RDS encryption",
            "Create a rightsizing implementation plan",
            "Generate backup policy templates",
            "Calculate total potential savings"
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
        <Aurora intensity={0.3} speed={1.5} className="aurora-background" />
      </div>

      <main className="relative flex-1 pt-20 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-160px)]">
            
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-6 overflow-y-auto">
              {/* AI Assistant Info - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-primary-glow/5">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary-glow to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                          StackStage AI
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">Cloud Architecture Expert</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-600 dark:text-green-400 font-medium">Online & Ready</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">~2s</div>
                            <div className="text-xs text-muted-foreground">Response</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-500">99.9%</div>
                            <div className="text-xs text-muted-foreground">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Start Templates - Compact & Premium */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {conversationTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div 
                          className={`group cursor-pointer p-3 rounded-xl border transition-all duration-200 ${
                            selectedTemplate === template.id 
                              ? 'ring-2 ring-primary bg-primary/10 border-primary/30' 
                              : 'hover:shadow-md hover:border-primary/20 border-border/50'
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                              template.color === 'green' ? 'from-green-500/20 to-green-600/20' :
                              template.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                              template.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                              'from-orange-500/20 to-orange-600/20'
                            }`}>
                              <template.icon className={`w-4 h-4 ${
                                template.color === 'green' ? 'text-green-600' :
                                template.color === 'blue' ? 'text-blue-600' :
                                template.color === 'purple' ? 'text-purple-600' :
                                'text-orange-600'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm">{template.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions - Premium Style */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start h-10 hover:bg-primary/5 hover:border-primary/30 group"
                        >
                          <action.icon className="w-4 h-4 mr-3 group-hover:text-primary transition-colors" />
                          <span className="font-medium">{action.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Chat Interface - Optimized Proportions */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <Card className="glass-card border-primary/20 h-full flex flex-col shadow-xl">
                  {/* Enhanced Chat Header */}
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary-glow/5 to-purple-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                            <AvatarImage src="/ai-avatar.png" />
                            <AvatarFallback className="bg-gradient-to-br from-primary via-primary-glow to-purple-600 text-white">
                              <Bot className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                            StackStage AI Assistant
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="font-medium">Active & Learning</span>
                            <span className="mx-2">•</span>
                            <span>Enterprise Grade</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Powered
                        </Badge>
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Secure
                        </Badge>
                        <Button variant="outline" size="sm" className="hover:bg-primary/5">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Optimized Messages Area */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6 max-w-4xl mx-auto">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className="flex items-start space-x-3">
                              {message.type === 'assistant' && (
                                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                                    <Bot className="w-5 h-5" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className="space-y-3 flex-1">
                                <div
                                  className={`rounded-2xl px-5 py-4 shadow-sm ${
                                    message.type === 'user'
                                      ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground ml-auto shadow-primary/20'
                                      : 'bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50'
                                  } ${message.id === '1' && message.type === 'assistant' ? 'max-h-80 overflow-y-auto' : ''}`}
                                >
                                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content}
                                  </div>
                                </div>
                                
                                {/* Enhanced Message Actions */}
                                {message.type === 'assistant' && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground font-medium">
                                      {message.timestamp.toLocaleTimeString()} • AI Response
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                                          <Copy className="w-3 h-3" />
                                        </Button>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900">
                                          <ThumbsUp className="w-3 h-3" />
                                        </Button>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900">
                                          <ThumbsDown className="w-3 h-3" />
                                        </Button>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                                          <RefreshCw className="w-3 h-3" />
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Enhanced Suggestions */}
                                {message.suggestions && (
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                      <Target className="w-4 h-4 text-primary" />
                                      <p className="text-sm font-medium text-primary">Suggested Actions:</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {message.suggestions.map((suggestion, index) => (
                                        <motion.div
                                          key={index}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-9 w-full justify-start bg-gradient-to-r from-primary/5 to-primary-glow/5 hover:from-primary/10 hover:to-primary-glow/10 border-primary/20"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                          >
                                            <Zap className="w-3 h-3 mr-2 text-primary" />
                                            {suggestion}
                                          </Button>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {message.type === 'user' && (
                                <Avatar className="w-10 h-10 ring-2 ring-blue-500/20">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    <User className="w-5 h-5" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Enhanced Typing Indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-start"
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                                  <Bot className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-4">
                                <div className="flex items-center space-x-2">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                  <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Premium Input Area */}
                  <div className="border-t border-border/50 p-6 bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-end space-x-4 max-w-4xl mx-auto">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about cloud architecture, security, optimization, compliance..."
                          className="min-h-[60px] max-h-32 resize-none pr-24 border-primary/20 focus:border-primary/40 bg-background/80 backdrop-blur-sm"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                              <PaperclipIcon className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                              <Mic className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="h-[60px] px-8 bg-gradient-to-r from-primary via-primary-glow to-purple-600 hover:from-primary/90 hover:via-primary-glow/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
                          variant="hero"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Send
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground max-w-4xl mx-auto">
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">Press Enter to send, Shift+Enter for new line</p>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-green-500" />
                          <span>End-to-End Encrypted</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">Powered by StackStage AI</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Enterprise Ready</span>
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