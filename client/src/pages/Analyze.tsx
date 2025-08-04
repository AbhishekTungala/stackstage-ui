import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Cloud, 
  FileText, 
  Zap, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  BarChart3,
  Settings,
  Globe,
  Database,
  Server,
  Lock,
  Eye,
  TrendingUp,
  Activity,
  Clock,
  Users,
  Cpu,
  HardDrive,
  Network,
  DollarSign,
  AlertTriangle,
  Info,
  Star,
  Sparkles,
  Crown
} from "lucide-react";

const Analyze = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cloudProvider, setCloudProvider] = useState("");
  const [cloudConnect, setCloudConnect] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisMode, setAnalysisMode] = useState("comprehensive");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    // Simulate validation
    if (files.length > 0) {
      setTimeout(() => {
        setValidationResults({
          totalFiles: files.length,
          validFiles: files.length - 1,
          errors: files.length > 3 ? 1 : 0,
          warnings: files.length > 1 ? 2 : 0
        });
      }, 1000);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep("validating");

    // Simulate progressive analysis steps
    const steps = [
      { step: "validating", progress: 20, delay: 800 },
      { step: "parsing", progress: 40, delay: 1200 },
      { step: "analyzing", progress: 70, delay: 1500 },
      { step: "optimizing", progress: 90, delay: 1000 },
      { step: "complete", progress: 100, delay: 500 }
    ];

    for (const { step, progress, delay } of steps) {
      setTimeout(() => {
        setCurrentStep(step);
        setAnalysisProgress(progress);
      }, delay);
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      window.location.href = "/results";
    }, 5000);
  };

  useEffect(() => {
    // Simulate real-time validation for text input
    if (textInput.trim()) {
      const timer = setTimeout(() => {
        setValidationResults({
          syntax: "valid",
          resources: Math.floor(Math.random() * 15) + 5,
          issues: Math.floor(Math.random() * 3),
          estimatedCost: "$" + (Math.random() * 500 + 100).toFixed(0)
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [textInput]);

  const cloudProviders = [
    { value: "aws", label: "Amazon Web Services", icon: "☁️", color: "orange" },
    { value: "gcp", label: "Google Cloud Platform", icon: "🌐", color: "blue" },
    { value: "azure", label: "Microsoft Azure", icon: "⚡", color: "cyan" },
    { value: "alibaba", label: "Alibaba Cloud", icon: "🚀", color: "orange" },
    { value: "hybrid", label: "Multi-Cloud/Hybrid", icon: "🔗", color: "purple" }
  ];

  const analysisTypes = [
    { 
      id: "quick", 
      name: "Quick Scan", 
      time: "~2 mins", 
      features: ["Basic security", "Cost overview", "Resource inventory"],
      icon: Zap,
      color: "green"
    },
    { 
      id: "comprehensive", 
      name: "Comprehensive", 
      time: "~5 mins", 
      features: ["Deep security analysis", "Performance optimization", "Compliance checks", "Cost optimization"],
      icon: Shield,
      color: "blue"
    },
    { 
      id: "enterprise", 
      name: "Enterprise Plus", 
      time: "~10 mins", 
      features: ["Everything in Comprehensive", "Custom policies", "Governance analysis", "Risk assessment"],
      icon: Star,
      color: "purple",
      badge: "Premium"
    }
  ];

  const getAnalysisStepMessage = (step: string) => {
    switch(step) {
      case "validating": return "Validating infrastructure files...";
      case "parsing": return "Parsing configuration syntax...";
      case "analyzing": return "Running security & cost analysis...";
      case "optimizing": return "Generating optimization recommendations...";
      case "complete": return "Analysis complete!";
      default: return "Initializing analysis...";
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <Header />
      
      {/* Aurora Background with smooth fade */}
      <div className="absolute inset-0">
        <Aurora 
          intensity={0.4} 
          speed={1.2} 
          className="aurora-background"
          fadeHeight={300}
          fadeDirection="bottom"
        />
      </div>
      
      <main className="relative flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Enterprise-Grade Analysis
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent leading-tight">
              Analyze Your 
              <span className="block">Cloud Architecture</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-normal py-2">
              Upload infrastructure files, connect cloud providers, or paste configurations 
              for AI-powered security analysis, cost optimization, and compliance checking.
            </p>
            
            {/* Live Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Analyses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">$2.4M</div>
                <div className="text-sm text-muted-foreground">Cost Savings Identified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Analysis Mode Selection */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Choose Analysis Type</span>
                </CardTitle>
                <CardDescription>
                  Select the depth of analysis based on your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 relative ${
                          analysisMode === type.id 
                            ? 'ring-2 ring-primary shadow-xl bg-primary/5' 
                            : 'hover:shadow-lg'
                        }`}
                        onClick={() => setAnalysisMode(type.id)}
                      >
                        {type.badge && (
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                              {type.badge}
                            </Badge>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${type.color}-500/20`}>
                              <type.icon className={`w-5 h-5 text-${type.color}-500`} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{type.name}</h3>
                              <p className="text-sm text-muted-foreground">{type.time}</p>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {type.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Analysis Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <span>Infrastructure Analysis</span>
                </CardTitle>
                <CardDescription>
                  Multiple ways to analyze your cloud infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload">File Upload</TabsTrigger>
                    <TabsTrigger value="paste">Paste Code</TabsTrigger>
                    <TabsTrigger value="connect">Cloud Connect</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-6 mt-6">
                    {/* Enhanced File Upload */}
                    <div 
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                        dragActive 
                          ? 'border-primary bg-primary/5 scale-105' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept=".tf,.yaml,.yml,.json,.hcl,.py,.js,.ts"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Upload className="w-16 h-16 text-primary mx-auto mb-6" />
                        </motion.div>
                        <h3 className="text-2xl font-semibold text-foreground mb-3">
                          Drop files here or click to upload
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Supports Terraform, CloudFormation, Kubernetes, Docker, and more
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {[".tf", ".yaml", ".json", ".hcl", ".py", ".js", ".ts", ".docker"].map((ext) => (
                            <Badge key={ext} variant="outline" className="text-xs">
                              {ext}
                            </Badge>
                          ))}
                        </div>
                      </label>
                    </div>

                    {/* File Analysis Results */}
                    <AnimatePresence>
                      {selectedFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">Uploaded Files</h4>
                            {validationResults && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Validated
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid gap-3">
                            {selectedFiles.map((file, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-primary" />
                                  <div>
                                    <span className="font-medium">{file.name}</span>
                                    <p className="text-sm text-muted-foreground">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </motion.div>
                            ))}
                          </div>

                          {/* Validation Summary */}
                          {validationResults && (
                            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                              <CardContent className="p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">{validationResults.totalFiles}</div>
                                    <div className="text-xs text-muted-foreground">Total Files</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">{validationResults.validFiles}</div>
                                    <div className="text-xs text-muted-foreground">Valid Files</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-orange-600">{validationResults.warnings}</div>
                                    <div className="text-xs text-muted-foreground">Warnings</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-red-600">{validationResults.errors}</div>
                                    <div className="text-xs text-muted-foreground">Errors</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="paste" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="config-input" className="text-lg font-medium">Infrastructure Configuration</Label>
                        {textInput.trim() && validationResults && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            <Activity className="w-3 h-3 mr-1" />
                            Live Analysis
                          </Badge>
                        )}
                      </div>
                      
                      <Textarea
                        id="config-input"
                        placeholder={`# Paste your infrastructure code here - supports multiple formats:

# Terraform
resource "aws_instance" "web_server" {
  ami           = "ami-12345678"
  instance_type = "t3.medium"
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  tags = {
    Name = "Production-WebServer"
    Environment = "production"
  }
}

# CloudFormation, Kubernetes YAML, Docker Compose also supported...`}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[400px] font-mono text-sm resize-none"
                      />
                      
                      {/* Real-time Analysis Preview */}
                      <AnimatePresence>
                        {textInput.trim() && validationResults && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                                  Live Analysis Preview
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <Server className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                    <div className="text-xl font-bold">{validationResults.resources}</div>
                                    <div className="text-xs text-muted-foreground">Resources</div>
                                  </div>
                                  <div className="text-center">
                                    <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                    <div className="text-xl font-bold">{validationResults.syntax}</div>
                                    <div className="text-xs text-muted-foreground">Syntax</div>
                                  </div>
                                  <div className="text-center">
                                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                                    <div className="text-xl font-bold">{validationResults.issues}</div>
                                    <div className="text-xs text-muted-foreground">Issues</div>
                                  </div>
                                  <div className="text-center">
                                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                    <div className="text-xl font-bold">{validationResults.estimatedCost}</div>
                                    <div className="text-xs text-muted-foreground">Est. Cost/mo</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  <TabsContent value="connect" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cloud Provider Selection */}
                      <div className="space-y-4">
                        <Label className="text-lg font-medium">Cloud Provider</Label>
                        <Select value={cloudProvider} onValueChange={setCloudProvider}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select cloud provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {cloudProviders.map((provider) => (
                              <SelectItem key={provider.value} value={provider.value}>
                                <div className="flex items-center space-x-2">
                                  <span>{provider.icon}</span>
                                  <span>{provider.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Direct Connect Toggle */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cloud-connect" className="text-lg font-medium">
                            Direct Cloud Connection
                          </Label>
                          <Switch
                            id="cloud-connect"
                            checked={cloudConnect}
                            onCheckedChange={setCloudConnect}
                          />
                        </div>
                        
                        <AnimatePresence>
                          {cloudConnect && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4"
                            >
                              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                                <CardContent className="p-6">
                                  <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                      <Crown className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-purple-900">Enterprise Feature</h3>
                                      <p className="text-sm text-purple-700">Real-time cloud scanning</p>
                                    </div>
                                  </div>
                                  <ul className="space-y-2 text-sm text-purple-800">
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-purple-600" /> Live infrastructure discovery</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-purple-600" /> Real-time cost monitoring</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-purple-600" /> Continuous compliance scanning</li>
                                  </ul>
                                  <Button variant="outline" size="sm" className="mt-4 border-purple-300 text-purple-700 hover:bg-purple-100">
                                    <Link href="/pricing">Upgrade to Enterprise</Link>
                                  </Button>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analysis Control Panel */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass-card border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  <span>Analysis Control Center</span>
                </CardTitle>
                <CardDescription>
                  Configure and launch your infrastructure analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Analysis Progress */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          {getAnalysisStepMessage(currentStep)}
                        </h3>
                        <Progress value={analysisProgress} className="w-full h-3" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {analysisProgress}% Complete
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <Activity className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                          <div className="text-sm font-medium">CPU Usage</div>
                          <div className="text-xs text-muted-foreground">High</div>
                        </div>
                        <div className="text-center">
                          <HardDrive className="w-6 h-6 mx-auto mb-2 text-green-500" />
                          <div className="text-sm font-medium">Memory</div>
                          <div className="text-xs text-muted-foreground">Optimal</div>
                        </div>
                        <div className="text-center">
                          <Network className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                          <div className="text-sm font-medium">Network</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div className="text-center">
                          <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                          <div className="text-sm font-medium">ETA</div>
                          <div className="text-xs text-muted-foreground">2 min</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Launch Analysis Button */}
                {!isAnalyzing && (
                  <div className="text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleAnalyze}
                        disabled={!selectedFiles.length && !textInput.trim() && !cloudConnect}
                        className="px-12 py-4 text-lg font-semibold text-white drop-shadow-sm [&>*]:text-white [&]:text-white"
                        style={{ color: '#ffffff !important' }}
                        size="lg"
                        variant="hero"
                      >
                        <Zap className="mr-3 w-6 h-6" />
                        Launch {analysisTypes.find(t => t.id === analysisMode)?.name} Analysis
                        <ArrowRight className="ml-3 w-6 h-6" />
                      </Button>
                    </motion.div>
                    
                    <p className="text-sm text-muted-foreground">
                      Estimated time: {analysisTypes.find(t => t.id === analysisMode)?.time}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Features Grid */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
              <p className="text-muted-foreground text-lg">
                Professional cloud analysis tools trusted by leading organizations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div whileHover={{ y: -5 }}>
                <Card className="glass border-green-500/20 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="font-semibold">Enterprise Security</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      SOC 2 compliant with end-to-end encryption and zero data retention.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Zero-trust architecture</li>
                      <li>• GDPR compliant</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="glass border-blue-500/20 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="font-semibold">AI-Powered Insights</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Machine learning algorithms provide intelligent optimization recommendations.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Predictive cost analysis</li>
                      <li>• Smart resource rightsizing</li>
                      <li>• Anomaly detection</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="glass border-purple-500/20 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                      </div>
                      <h3 className="font-semibold">Real-time Analytics</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Live monitoring with instant alerts and comprehensive dashboards.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Custom dashboards</li>
                      <li>• Slack/Teams integration</li>
                      <li>• API webhooks</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="glass border-orange-500/20 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="font-semibold">Team Collaboration</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share analysis results with role-based access and commenting system.
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Role-based permissions</li>
                      <li>• Export to PDF/Excel</li>
                      <li>• Version control integration</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="glass-card bg-gradient-to-r from-primary/5 to-purple/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Trusted by Industry Leaders</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">SOC 2</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">500+</div>
                    <div className="text-sm text-muted-foreground">Enterprise Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">24/7</div>
                    <div className="text-sm text-muted-foreground">Expert Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">5M+</div>
                    <div className="text-sm text-muted-foreground">Resources Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">ISO</div>
                    <div className="text-sm text-muted-foreground">27001 Certified</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <div className="relative">
        <Footer />
      </div>
    </div>
  );
};

export default Analyze;