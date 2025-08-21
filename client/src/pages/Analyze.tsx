import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import AnimatedList from "@/components/ui/AnimatedList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisLoading } from "@/components/ui/loading-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeoRegionSelector from "@/components/ui/geo-region-selector";
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
import { Input } from "@/components/ui/input";

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
  const [selectedRegion, setSelectedRegion] = useState("us-east-1");
  const [regionalImpact, setRegionalImpact] = useState<any>(null);
  
  // Enhanced cloud provider state
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [selectedCloudRegion, setSelectedCloudRegion] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  // Comprehensive cloud provider data
  const cloudProviders = [
    {
      id: "aws",
      name: "Amazon Web Services",
      description: "Industry-leading cloud platform with 200+ services",
      icon: "☁️",
      color: "from-orange-500 to-yellow-500",
      credentials: [
        { key: "accessKeyId", label: "Access Key ID", type: "text", required: true },
        { key: "secretAccessKey", label: "Secret Access Key", type: "password", required: true },
        { key: "sessionToken", label: "Session Token", type: "password", required: false },
        { key: "region", label: "Default Region", type: "select", required: true }
      ],
      regions: [
        { value: "us-east-1", label: "US East (N. Virginia)", location: "Virginia, USA" },
        { value: "us-east-2", label: "US East (Ohio)", location: "Ohio, USA" },
        { value: "us-west-1", label: "US West (N. California)", location: "California, USA" },
        { value: "us-west-2", label: "US West (Oregon)", location: "Oregon, USA" },
        { value: "ca-central-1", label: "Canada (Central)", location: "Montreal, Canada" },
        { value: "eu-west-1", label: "Europe (Ireland)", location: "Dublin, Ireland" },
        { value: "eu-west-2", label: "Europe (London)", location: "London, UK" },
        { value: "eu-west-3", label: "Europe (Paris)", location: "Paris, France" },
        { value: "eu-central-1", label: "Europe (Frankfurt)", location: "Frankfurt, Germany" },
        { value: "eu-north-1", label: "Europe (Stockholm)", location: "Stockholm, Sweden" },
        { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)", location: "Tokyo, Japan" },
        { value: "ap-northeast-2", label: "Asia Pacific (Seoul)", location: "Seoul, South Korea" },
        { value: "ap-southeast-1", label: "Asia Pacific (Singapore)", location: "Singapore" },
        { value: "ap-southeast-2", label: "Asia Pacific (Sydney)", location: "Sydney, Australia" },
        { value: "ap-south-1", label: "Asia Pacific (Mumbai)", location: "Mumbai, India" },
        { value: "sa-east-1", label: "South America (São Paulo)", location: "São Paulo, Brazil" }
      ]
    },
    {
      id: "gcp",
      name: "Google Cloud Platform",
      description: "Google's secure, intelligent, and highly performant cloud",
      icon: "🌐",
      color: "from-blue-500 to-green-500",
      credentials: [
        { key: "serviceAccountKey", label: "Service Account Key (JSON)", type: "textarea", required: true },
        { key: "projectId", label: "Project ID", type: "text", required: true },
        { key: "region", label: "Default Region", type: "select", required: true }
      ],
      regions: [
        { value: "us-central1", label: "US Central (Iowa)", location: "Iowa, USA" },
        { value: "us-east1", label: "US East (South Carolina)", location: "South Carolina, USA" },
        { value: "us-east4", label: "US East (Northern Virginia)", location: "Virginia, USA" },
        { value: "us-west1", label: "US West (Oregon)", location: "Oregon, USA" },
        { value: "us-west2", label: "US West (Los Angeles)", location: "Los Angeles, USA" },
        { value: "us-west3", label: "US West (Salt Lake City)", location: "Utah, USA" },
        { value: "us-west4", label: "US West (Las Vegas)", location: "Nevada, USA" },
        { value: "northamerica-northeast1", label: "Canada (Montreal)", location: "Montreal, Canada" },
        { value: "europe-west1", label: "Europe (Belgium)", location: "St. Ghislain, Belgium" },
        { value: "europe-west2", label: "Europe (London)", location: "London, UK" },
        { value: "europe-west3", label: "Europe (Frankfurt)", location: "Frankfurt, Germany" },
        { value: "europe-west4", label: "Europe (Netherlands)", location: "Eemshaven, Netherlands" },
        { value: "europe-west6", label: "Europe (Zurich)", location: "Zurich, Switzerland" },
        { value: "asia-east1", label: "Asia (Taiwan)", location: "Changhua County, Taiwan" },
        { value: "asia-northeast1", label: "Asia (Tokyo)", location: "Tokyo, Japan" },
        { value: "asia-northeast2", label: "Asia (Osaka)", location: "Osaka, Japan" },
        { value: "asia-southeast1", label: "Asia (Singapore)", location: "Jurong West, Singapore" },
        { value: "asia-south1", label: "Asia (Mumbai)", location: "Mumbai, India" }
      ]
    },
    {
      id: "azure",
      name: "Microsoft Azure",
      description: "Microsoft's comprehensive cloud computing platform",
      icon: "⚡",
      color: "from-blue-600 to-purple-600",
      credentials: [
        { key: "subscriptionId", label: "Subscription ID", type: "text", required: true },
        { key: "clientId", label: "Client ID (Application ID)", type: "text", required: true },
        { key: "clientSecret", label: "Client Secret", type: "password", required: true },
        { key: "tenantId", label: "Tenant ID (Directory ID)", type: "text", required: true },
        { key: "region", label: "Default Region", type: "select", required: true }
      ],
      regions: [
        { value: "eastus", label: "East US", location: "Virginia, USA" },
        { value: "eastus2", label: "East US 2", location: "Virginia, USA" },
        { value: "westus", label: "West US", location: "California, USA" },
        { value: "westus2", label: "West US 2", location: "Washington, USA" },
        { value: "westus3", label: "West US 3", location: "Arizona, USA" },
        { value: "centralus", label: "Central US", location: "Iowa, USA" },
        { value: "northcentralus", label: "North Central US", location: "Illinois, USA" },
        { value: "southcentralus", label: "South Central US", location: "Texas, USA" },
        { value: "canadacentral", label: "Canada Central", location: "Toronto, Canada" },
        { value: "canadaeast", label: "Canada East", location: "Quebec City, Canada" },
        { value: "westeurope", label: "West Europe", location: "Netherlands" },
        { value: "northeurope", label: "North Europe", location: "Ireland" },
        { value: "uksouth", label: "UK South", location: "London, UK" },
        { value: "ukwest", label: "UK West", location: "Cardiff, UK" },
        { value: "francecentral", label: "France Central", location: "Paris, France" },
        { value: "germanywestcentral", label: "Germany West Central", location: "Frankfurt, Germany" },
        { value: "japaneast", label: "Japan East", location: "Tokyo, Japan" },
        { value: "japanwest", label: "Japan West", location: "Osaka, Japan" },
        { value: "australiaeast", label: "Australia East", location: "New South Wales, Australia" },
        { value: "australiasoutheast", label: "Australia Southeast", location: "Victoria, Australia" }
      ]
    }
  ];

  // Cloud connection handlers
  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const handleCloudConnect = async () => {
    if (!cloudProvider) return;
    
    const provider = cloudProviders.find(p => p.id === cloudProvider);
    if (!provider) return;

    setIsConnecting(true);
    setConnectionStatus("Validating credentials...");

    try {
      // Send credentials to backend for validation
      const response = await fetch('/api/cloud/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: cloudProvider,
          credentials: credentials,
          region: selectedCloudRegion
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus("Connected successfully");
        setCloudConnect(true);
      } else {
        setConnectionStatus(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    
    // Analyze uploaded files for premium preview
    if (files.length > 0) {
      analyzeUploadedFiles(files);
    }
  };

  // Unified Analysis Engine - Deterministic and Professional
  const analyzeInfrastructureContent = (content: string) => {
    // Create deterministic hash from content for consistent results
    const contentHash = content.split('').reduce((hash, char) => {
      return (hash << 5) - hash + char.charCodeAt(0);
    }, 0);
    
    // Professional Infrastructure Analysis
    const analysis = {
      resources: 0,
      issues: 0,
      estimatedCost: 0,
      syntax: "valid"
    };
    
    // 1. RESOURCE DETECTION (Deterministic)
    const terraformResources = content.match(/resource\s+"[^"]+"\s+"[^"]+"/g) || [];
    const awsResources = content.match(/aws_[a-z_]+/g) || [];
    const gcpResources = content.match(/google_[a-z_]+/g) || [];
    const azureResources = content.match(/azurerm_[a-z_]+/g) || [];
    const k8sResources = content.match(/kind:\s*(Deployment|Service|Pod|ConfigMap|Secret)/g) || [];
    const dockerResources = content.match(/FROM\s+|EXPOSE\s+|RUN\s+/g) || [];
    
    analysis.resources = terraformResources.length + 
                        awsResources.length + 
                        gcpResources.length + 
                        azureResources.length + 
                        k8sResources.length + 
                        dockerResources.length;
    
    // 2. SECURITY ISSUES DETECTION (Deterministic)
    const securityIssues = [
      content.match(/0\.0\.0\.0\/0/g) || [],
      content.match(/"0\.0\.0\.0\/0"/g) || [],
      content.match(/allow_all/g) || [],
      content.match(/"\*"/g) || [],
      content.match(/public.*true/g) || [],
      content.match(/publicly_accessible.*=.*true/g) || []
    ];
    
    const complianceIssues = [
      content.match(/unencrypted|no_encryption/g) || [],
      content.match(/skip_final_snapshot.*=.*true/g) || [],
      content.match(/deletion_protection.*=.*false/g) || []
    ];
    
    analysis.issues = securityIssues.flat().length + complianceIssues.flat().length;
    
    // 3. COST ESTIMATION (Deterministic based on resource types)
    const costFactors = {
      // AWS Services
      ec2: (content.match(/aws_instance|t3\.|m5\.|c5\./g) || []).length * 75,
      rds: (content.match(/aws_db_instance|mysql|postgresql/g) || []).length * 120,
      lambda: (content.match(/aws_lambda_function/g) || []).length * 15,
      s3: (content.match(/aws_s3_bucket/g) || []).length * 25,
      elb: (content.match(/aws_lb|aws_elb/g) || []).length * 45,
      
      // GCP Services  
      compute: (content.match(/google_compute_instance|n1-|n2-/g) || []).length * 80,
      storage: (content.match(/google_storage_bucket/g) || []).length * 20,
      
      // Azure Services
      vm: (content.match(/azurerm_virtual_machine|Standard_/g) || []).length * 85,
      
      // Kubernetes
      k8s: (content.match(/kind:\s*(Deployment|Service)/g) || []).length * 35
    };
    
    const baseCost = Object.values(costFactors).reduce((sum, cost) => sum + cost, 0);
    
    // Professional Cost Ranges (Safe and Reliable)
    let costRange = "";
    if (baseCost === 0) {
      costRange = "$0-50";
    } else if (baseCost <= 100) {
      costRange = "$50-150";
    } else if (baseCost <= 300) {
      costRange = "$150-400";
    } else if (baseCost <= 600) {
      costRange = "$400-800";
    } else if (baseCost <= 1000) {
      costRange = "$800-1.2K";
    } else {
      costRange = "$1K+";
    }
    
    analysis.estimatedCost = costRange as any;
    
    // 4. SYNTAX VALIDATION
    const syntaxErrors = [
      content.match(/\s+{[\s\S]*?}\s*{/g) || [], // Double braces
      content.match(/=\s*{[^}]*$/g) || [], // Unclosed braces
      content.match(/"\s*[^"]*$/g) || [] // Unclosed quotes
    ];
    
    analysis.syntax = syntaxErrors.flat().length > 0 ? "error" : "valid";
    
    return analysis;
  };

  const analyzeUploadedFiles = async (files: File[]) => {
    try {
      let combinedContent = "";
      
      // Read all files and combine content
      for (const file of files) {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        combinedContent += "\n" + content;
      }
      
      // Use unified analysis engine
      const analysis = analyzeInfrastructureContent(combinedContent);
      
      setTimeout(() => {
        setValidationResults({
          syntax: analysis.syntax,
          resources: analysis.resources,
          issues: analysis.issues,
          estimatedCost: analysis.estimatedCost
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error analyzing uploaded files:", error);
      setValidationResults({
        syntax: "error",
        resources: 0,
        issues: 1,
        estimatedCost: "$0"
      });
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
      
      // Analyze dropped files for premium preview
      if (files.length > 0) {
        analyzeUploadedFiles(files);
      }
    }
  };

  const handleAnalyze = async () => {
    console.log("🚀 Analysis started - Text input length:", textInput.trim().length);
    console.log("📁 Selected files:", selectedFiles.length, selectedFiles.map(f => f.name));
    
    if (!textInput.trim() && selectedFiles.length === 0) {
      alert("Please provide infrastructure configuration or upload files to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep("validating");

    try {
      // Progressive UI updates for professional feel
      const steps = [
        { step: "validating", progress: 15, delay: 500 },
        { step: "parsing", progress: 30, delay: 800 },
        { step: "analyzing", progress: 60, delay: 1500 },
        { step: "optimizing", progress: 85, delay: 2000 }
      ];

      // Update UI progressively
      steps.forEach(({ step, progress, delay }) => {
        setTimeout(() => {
          setCurrentStep(step);
          setAnalysisProgress(progress);
        }, delay);
      });

      // Prepare analysis content
      let content = textInput.trim();
      
      if (selectedFiles.length > 0) {
        console.log("📂 Reading file contents...");
        try {
          // Read actual file contents
          const fileContents = await Promise.all(
            selectedFiles.map(async (file) => {
              console.log(`📄 Reading file: ${file.name} (${file.size} bytes)`);
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  console.log(`✅ File read successfully: ${file.name} - ${result.length} characters`);
                  resolve(result);
                };
                reader.onerror = (error) => {
                  console.error(`❌ File read error for ${file.name}:`, error);
                  reject(error);
                };
                reader.readAsText(file);
              });
            })
          );
          
          // Add file contents to analysis
          const filesText = selectedFiles.map((file, index) => 
            `\n\n--- File: ${file.name} ---\n${fileContents[index]}`
          ).join('');
          
          content = content ? content + filesText : filesText.trim();
          console.log("📋 Final content length:", content.length);
          
          if (!content.trim()) {
            content = `# Infrastructure Configuration Files\n${filesText}`;
            console.log("⚠️ Using fallback content structure");
          }
        } catch (fileError) {
          console.error("❌ File reading failed:", fileError);
          const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown file error';
          throw new Error(`Failed to read uploaded files: ${errorMessage}`);
        }
      }
      
      console.log("🔍 Final analysis content preview:", content.substring(0, 200) + "...");
      
      if (!content.trim()) {
        throw new Error("No content available for analysis");
      }

      // Call real OpenAI API
      console.log("🤖 Calling analysis API with:", {
        contentLength: content.length,
        analysisMode,
        cloudProvider,
        userRegion: selectedRegion
      });
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          analysisMode,
          cloudProvider,
          userRegion: selectedRegion,
          regionalImpact
        }),
      });

      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log("✅ Analysis completed successfully:", data);
      
      // Complete the progress
      setCurrentStep("complete");
      setAnalysisProgress(100);
      
      // Store result in localStorage for Results page
      localStorage.setItem('analysisResult', JSON.stringify(data.result));
      localStorage.setItem('analysisId', data.analysisId);

      setTimeout(() => {
        setIsAnalyzing(false);
        window.location.href = "/results";
      }, 1000);

    } catch (error) {
      console.error('❌ Analysis error:', error);
      setIsAnalyzing(false);
      setCurrentStep("error");
      
      // Professional error handling with better UX
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      
      // Show error state briefly before resetting
      setTimeout(() => {
        setCurrentStep("upload");
        setAnalysisProgress(0);
      }, 3000);
      
      // Premium error notification (you can replace with a toast component)
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed top-4 right-4 z-50 p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl shadow-lg max-w-md';
      errorDialog.innerHTML = `
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 text-red-500 mt-0.5">⚠️</div>
          <div>
            <h3 class="font-semibold text-red-900 dark:text-red-100">Analysis Failed</h3>
            <p class="text-sm text-red-700 dark:text-red-200 mt-1">${errorMessage}</p>
            <p class="text-xs text-red-600 dark:text-red-300 mt-2">Please check your files and try again.</p>
          </div>
        </div>
      `;
      document.body.appendChild(errorDialog);
      
      // Remove error dialog after 5 seconds
      setTimeout(() => {
        errorDialog.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => errorDialog.remove(), 300);
      }, 5000);
    }
  };

  useEffect(() => {
    // Professional real-time validation for text input
    if (textInput.trim()) {
      const timer = setTimeout(() => {
        // Use the same unified analysis engine
        const analysis = analyzeInfrastructureContent(textInput);
        setValidationResults({
          syntax: analysis.syntax,
          resources: analysis.resources,
          issues: analysis.issues,
          estimatedCost: analysis.estimatedCost
        });
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setValidationResults(null); // Clear results when input is empty
    }
  }, [textInput]);



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
                        accept=".tf,.yaml,.yml,.json,.hcl,.py,.js,.ts,.toml,.cfg,.conf,.env,.properties,.sh,.bat,.ps1,.dockerfile,.docker,.k8s,.helm,.terraform,.tfvars,.tfstate,.txt,*"
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
                          {validationResults && validationResults.resources && (
                            <div className="relative">
                              {/* Premium glow effect */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl"
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                              
                              <Card className="glass-card relative overflow-hidden bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                  <CardTitle className="flex items-center text-lg text-blue-900 dark:text-blue-100">
                                    <motion.div
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <Eye className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    </motion.div>
                                    Live Analysis Preview
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-blue-200/30 dark:border-blue-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                      >
                                        <Server className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-blue-900 dark:text-blue-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                      >
                                        {validationResults.resources}
                                      </motion.div>
                                      <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Resources</div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-green-200/30 dark:border-green-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                      >
                                        <Shield className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-green-900 dark:text-green-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                      >
                                        {validationResults.syntax}
                                      </motion.div>
                                      <div className="text-xs text-green-700 dark:text-green-300 font-medium">Syntax</div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-orange-200/30 dark:border-orange-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                      >
                                        <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-orange-900 dark:text-orange-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                      >
                                        {validationResults.issues}
                                      </motion.div>
                                      <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">Issues</div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-purple-200/30 dark:border-purple-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ y: [0, -2, 0] }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                                      >
                                        <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-purple-900 dark:text-purple-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                                      >
                                        {validationResults.estimatedCost}
                                      </motion.div>
                                      <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Est. Cost/mo</div>
                                    </motion.div>
                                  </div>
                                  
                                  {/* Premium bottom accent */}
                                  <motion.div 
                                    className="mt-4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                </CardContent>
                              </Card>
                            </div>
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
                            <div className="relative">
                              {/* Premium glow effect */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl"
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                              
                              <Card className="glass-card relative overflow-hidden bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                  <CardTitle className="flex items-center text-lg text-blue-900 dark:text-blue-100">
                                    <motion.div
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <Eye className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    </motion.div>
                                    Live Analysis Preview
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-blue-200/30 dark:border-blue-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                      >
                                        <Server className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-blue-900 dark:text-blue-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                      >
                                        {validationResults.resources}
                                      </motion.div>
                                      <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Resources</div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-green-200/30 dark:border-green-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                      >
                                        <Shield className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-green-900 dark:text-green-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                      >
                                        {validationResults.syntax}
                                      </motion.div>
                                      <div className="text-xs text-green-700 dark:text-green-300 font-medium">Syntax</div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-orange-200/30 dark:border-orange-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                      >
                                        <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-orange-900 dark:text-orange-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                      >
                                        {validationResults.issues}
                                      </motion.div>
                                      <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">Issues</div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-purple-200/30 dark:border-purple-800/30"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <motion.div
                                        animate={{ y: [0, -2, 0] }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                                      >
                                        <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xl font-bold text-purple-900 dark:text-purple-100"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                                      >
                                        {validationResults.estimatedCost}
                                      </motion.div>
                                      <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Est. Cost/mo</div>
                                    </motion.div>
                                  </div>
                                  
                                  {/* Premium bottom accent */}
                                  <motion.div 
                                    className="mt-4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  <TabsContent value="connect" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Cloud Provider Selection */}
                      <div className="space-y-4">
                        <Label className="text-lg font-medium">Select Cloud Provider</Label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {cloudProviders.map((provider) => (
                            <motion.div
                              key={provider.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Card 
                                className={`cursor-pointer transition-all duration-300 group ${
                                  cloudProvider === provider.id 
                                    ? 'ring-2 ring-primary shadow-lg bg-primary/5 border-primary/30' 
                                    : 'hover:shadow-md hover:border-primary/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-gray-700/30'
                                }`}
                                onClick={() => setCloudProvider(provider.id)}
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start space-x-4">
                                    {/* Provider Icon */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${provider.color} shadow-sm`}>
                                      {provider.icon}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                          {provider.name}
                                        </h3>
                                        {cloudProvider === provider.id && (
                                          <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {provider.description}
                                      </p>
                                      
                                      {/* Feature List */}
                                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex items-center">
                                          <span className="w-1 h-1 bg-primary rounded-full mr-3"></span>
                                          {provider.regions.length} global regions available
                                        </li>
                                        <li className="flex items-center">
                                          <span className="w-1 h-1 bg-primary rounded-full mr-3"></span>
                                          {provider.credentials.length} credential fields required
                                        </li>
                                        <li className="flex items-center">
                                          <span className="w-1 h-1 bg-primary rounded-full mr-3"></span>
                                          Real-time infrastructure scanning
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Credential Input Fields */}
                        <AnimatePresence>
                          {cloudProvider && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4"
                            >
                              <Card className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-200/50">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-medium flex items-center">
                                    <Lock className="w-4 h-4 mr-2 text-primary" />
                                    {cloudProviders.find(p => p.id === cloudProvider)?.name} Credentials
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-4">
                                  {cloudProvider && cloudProviders.find(p => p.id === cloudProvider)?.credentials.map((cred, index) => (
                                    <div key={cred.key}>
                                      <Label className="text-xs flex items-center">
                                        {cred.label}
                                        {cred.required && <span className="text-red-500 ml-1">*</span>}
                                      </Label>
                                      {cred.type === 'textarea' ? (
                                        <Textarea
                                          placeholder={cred.key === 'serviceAccountKey' ? 'Paste your service account JSON here...' : ''}
                                          className="h-20 text-sm font-mono"
                                          value={credentials[cred.key] || ''}
                                          onChange={(e) => handleCredentialChange(cred.key, e.target.value)}
                                        />
                                      ) : cred.type === 'select' ? (
                                        <Select
                                          value={selectedCloudRegion}
                                          onValueChange={setSelectedCloudRegion}
                                        >
                                          <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Select region..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {cloudProviders.find(p => p.id === cloudProvider)?.regions.map((region) => (
                                              <SelectItem key={region.value} value={region.value}>
                                                {region.label} - {region.location}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <Input
                                          type={cred.type}
                                          placeholder={
                                            cred.key === 'accessKeyId' ? 'AKIA...' :
                                            cred.key === 'secretAccessKey' ? '••••••••••••••••' :
                                            cred.key === 'projectId' ? 'my-project-id' :
                                            cred.key === 'subscriptionId' ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' :
                                            ''
                                          }
                                          className="h-8 text-sm"
                                          value={credentials[cred.key] || ''}
                                          onChange={(e) => handleCredentialChange(cred.key, e.target.value)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  
                                  {/* Connection Actions */}
                                  <div className="flex items-center justify-between pt-4 border-t">
                                    {connectionStatus && (
                                      <div className="flex items-center text-xs">
                                        {connectionStatus.includes("success") ? (
                                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                        ) : connectionStatus.includes("error") || connectionStatus.includes("failed") ? (
                                          <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                                        ) : (
                                          <Loader2 className="w-4 h-4 text-blue-500 mr-1 animate-spin" />
                                        )}
                                        <span className={
                                          connectionStatus.includes("success") ? "text-green-700" :
                                          connectionStatus.includes("error") || connectionStatus.includes("failed") ? "text-red-700" :
                                          "text-blue-700"
                                        }>
                                          {connectionStatus}
                                        </span>
                                      </div>
                                    )}
                                    <Button 
                                      size="sm" 
                                      onClick={handleCloudConnect}
                                      disabled={isConnecting || !selectedCloudRegion}
                                      className="ml-auto"
                                    >
                                      {isConnecting ? (
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                      )}
                                      {isConnecting ? "Connecting..." : "Connect"}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Connection Configuration */}
                      <div className="space-y-6">
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
                          {cloudConnect && cloudProvider && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="space-y-6"
                            >
                              {/* Connection Setup Card */}
                              <Card className="glass-card bg-gradient-to-br from-primary/5 to-purple/5 border-primary/20">
                                <CardHeader className="pb-4">
                                  <CardTitle className="flex items-center space-x-2">
                                    <Cloud className="w-5 h-5 text-primary" />
                                    <span>{cloudProviders.find(p => p.id === cloudProvider)?.name} Connection</span>
                                  </CardTitle>
                                  <CardDescription>
                                    Securely connect to your cloud account for live infrastructure analysis
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {/* Connection Methods */}
                                  <div className="space-y-3">
                                    <Label className="text-sm font-medium">Connection Method</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                      <Card className="p-4 cursor-pointer hover:bg-primary/5 transition-colors border-primary/20">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-green-500" />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium text-sm">OAuth 2.0 (Recommended)</h4>
                                            <p className="text-xs text-muted-foreground">Secure, temporary access without storing credentials</p>
                                          </div>
                                          <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                      </Card>
                                      
                                      <Card className="p-4 opacity-60">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                                            <Lock className="w-4 h-4 text-gray-500" />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium text-sm">API Keys</h4>
                                            <p className="text-xs text-muted-foreground">Manual credential entry (Enterprise only)</p>
                                          </div>
                                          <Crown className="w-5 h-5 text-gray-400" />
                                        </div>
                                      </Card>
                                    </div>
                                  </div>

                                  {/* Connection Action */}
                                  <motion.div className="pt-4">
                                    <Button 
                                      className="w-full bg-gradient-to-r from-primary to-primary-glow text-white hover:shadow-lg transition-all duration-300"
                                      size="lg"
                                      onClick={() => {
                                        // Here you would integrate with actual OAuth flows
                                        alert(`Initiating secure OAuth connection to ${cloudProviders.find(p => p.id === cloudProvider)?.name}...\n\nIn a production environment, this would redirect to the cloud provider's OAuth authorization page.`);
                                      }}
                                    >
                                      <Cloud className="w-5 h-5 mr-2" />
                                      Connect to {cloudProviders.find(p => p.id === cloudProvider)?.name}
                                    </Button>
                                  </motion.div>

                                  {/* Security Notice */}
                                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                      <div>
                                        <h4 className="font-medium text-green-900 dark:text-green-100 text-sm">Enterprise Security</h4>
                                        <ul className="text-xs text-green-700 dark:text-green-300 mt-1 space-y-1">
                                          <li>• End-to-end encryption in transit and at rest</li>
                                          <li>• No credential storage - OAuth tokens expire automatically</li>
                                          <li>• Read-only access with minimal required permissions</li>
                                          <li>• SOC 2 Type II compliant infrastructure</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                          
                          {cloudConnect && !cloudProvider && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                                <CardContent className="p-6 text-center">
                                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                                    Select Cloud Provider
                                  </h3>
                                  <p className="text-sm text-orange-700 dark:text-orange-300">
                                    Please choose your cloud provider to configure the connection
                                  </p>
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

          {/* Geo-Region Configuration */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GeoRegionSelector
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              onRegionalImpact={setRegionalImpact}
              showAutoDetect={true}
              showImpactPreview={true}
            />
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
                {/* Premium Analysis Progress */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Main Analysis Display */}
                      <div className="relative">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple/10 to-primary/10 rounded-3xl blur-xl"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        <Card className="glass-card relative overflow-hidden border-primary/30">
                          <CardContent className="p-8">
                            <div className="text-center space-y-6">
                              {/* Premium Spinner */}
                              <motion.div className="relative">
                                <motion.div
                                  className="w-20 h-20 mx-auto rounded-full relative"
                                  style={{
                                    background: `conic-gradient(from 0deg, rgb(var(--primary)) 0deg, rgb(var(--primary)/0.3) 90deg, rgb(var(--primary)) 180deg, rgb(var(--primary)/0.3) 270deg, rgb(var(--primary)) 360deg)`,
                                    padding: '4px'
                                  }}
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <Sparkles className="w-8 h-8 text-primary" />
                                    </motion.div>
                                  </div>
                                </motion.div>
                              </motion.div>

                              {/* Analysis Status */}
                              <div className="space-y-3">
                                <motion.h3 
                                  className="text-3xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent"
                                  animate={{ opacity: [0.7, 1, 0.7] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  AI Analysis in Progress
                                </motion.h3>
                                
                                <motion.p 
                                  className="text-lg text-muted-foreground"
                                  key={currentStep}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {currentStep === "validating" && "🔍 Validating infrastructure configuration..."}
                                  {currentStep === "parsing" && "📊 Parsing cloud architecture components..."}
                                  {currentStep === "analyzing" && "🤖 Running AI-powered comprehensive analysis..."}
                                  {currentStep === "optimizing" && "⚡ Generating optimization recommendations..."}
                                  {currentStep === "complete" && "✨ Analysis complete! Preparing results..."}
                                  {currentStep === "error" && "❌ Analysis encountered an error. Please try again."}
                                </motion.p>
                              </div>

                              {/* Premium Progress Bar */}
                              <div className="relative">
                                <div className="w-full h-4 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-primary via-purple to-primary relative"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${analysisProgress}%` }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                  >
                                    <motion.div 
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                      animate={{ x: ['-100%', '200%'] }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                  </motion.div>
                                </div>
                                <div className="absolute -top-1 -right-1">
                                  <motion.div
                                    className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full border border-primary/20"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    {analysisProgress}%
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Real-time Metrics */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Card className="glass-card border-primary/20">
                          <CardContent className="p-6">
                            <h4 className="text-sm font-semibold mb-4 text-center text-muted-foreground">Real-time Analysis Metrics</h4>
                            <div className="grid grid-cols-4 gap-6">
                              {[
                                { Icon: Activity, label: "Processing", value: "Active", color: "text-blue-500" },
                                { Icon: HardDrive, label: "Memory", value: "Optimal", color: "text-green-500" },
                                { Icon: Network, label: "AI Engine", value: "Online", color: "text-orange-500" },
                                { Icon: Clock, label: "ETA", value: "45s", color: "text-purple-500" }
                              ].map((metric, index) => {
                                const { Icon } = metric;
                                return (
                                  <motion.div 
                                    key={index}
                                    className="text-center"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                  >
                                    <motion.div
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                    >
                                      <Icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                                    </motion.div>
                                    <div className="text-sm font-medium">{metric.label}</div>
                                    <div className="text-xs text-muted-foreground">{metric.value}</div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Launch Analysis Button */}
                {!isAnalyzing && (
                  <div className="text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <motion.div
                        className="relative"
                        whileHover="hover"
                        variants={{
                          hover: {
                            boxShadow: "0 20px 25px -5px rgba(var(--primary) / 0.3), 0 10px 10px -5px rgba(var(--primary) / 0.1)"
                          }
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          onClick={handleAnalyze}
                          disabled={!selectedFiles.length && !textInput.trim() && !cloudConnect}
                          className="px-12 py-4 text-lg font-semibold text-white relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                          size="lg"
                        >
                          <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Zap className="mr-3 w-6 h-6" />
                          </motion.div>
                          Launch {analysisTypes.find(t => t.id === analysisMode)?.name} Analysis
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ArrowRight className="ml-3 w-6 h-6" />
                          </motion.div>
                        </Button>
                      </motion.div>
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