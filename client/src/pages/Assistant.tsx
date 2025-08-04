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
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Start Templates */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                  Quick Start
                </h3>
                <div className="space-y-2">
                  {conversationTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 glass-card border-border/30 ${
                          selectedTemplate === template.id 
                            ? 'ring-1 ring-primary bg-primary/5' 
                            : 'hover:shadow-sm hover:border-primary/20'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-1.5">
                          <div className="flex items-start space-x-1.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center bg-${template.color}-500/20 flex-shrink-0 mt-0.5`}>
                              <template.icon className={`w-2.5 h-2.5 text-${template.color}-500`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm leading-tight">{template.title}</h4>
                              <p className="text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">{template.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start glass-card"
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
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
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span>Active now</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs py-0">
                          <Sparkles className="w-2.5 h-2.5 mr-1" />
                          AI Powered
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
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
                                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content}
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
                        </motion.div>
                      ))}
                      
                      {/* Typing Indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-start"
                          >
                            <div className="flex items-start space-x-2">
                              <Avatar className="w-6 h-6 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white">
                                  <Bot className="w-3 h-3" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-muted rounded-lg px-3 py-2">
                                <div className="flex space-x-1">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                  <div className="border-t border-border/50 p-3">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask about cloud architecture, security, costs..."
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
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="h-[44px] px-4"
                          variant="hero"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <p>Press Enter to send</p>
                      <div className="flex items-center space-x-3">
                        <span>Powered by StackStage AI</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Secure</span>
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