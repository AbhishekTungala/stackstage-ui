import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import mermaid from "mermaid";
import { toPng, toSvg } from "html-to-image";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Eye,
  EyeOff,
  Share2,
  Copy,
  CheckCircle,
  FileImage,
  FileCode,
  Loader2,
  Refresh,
  Settings,
  Palette,
  Move3D
} from "lucide-react";

const Diagram = () => {
  const [viewMode, setViewMode] = useState<"all" | "problems">("all");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagramTheme, setDiagramTheme] = useState<"default" | "dark" | "neutral">("default");
  const [exportFormat, setExportFormat] = useState<"svg" | "png">("png");
  const [isExporting, setIsExporting] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [diagramRendered, setDiagramRendered] = useState(false);

  // Dynamic diagram generation based on AI analysis
  const [diagramCode, setDiagramCode] = useState(`
graph TB
    subgraph "AWS Production Environment"
        subgraph "VPC: 10.0.0.0/16"
            subgraph "Public Subnet: 10.0.1.0/24"
                ALB[Application Load Balancer<br/>Critical: SSL/TLS Configuration]
                NAT[NAT Gateway<br/>Healthy]
                IGW[Internet Gateway]
            end
            
            subgraph "Private Subnet: 10.0.2.0/24"
                EC2_1[EC2 Instance 1<br/>t3.large - Warning: Oversized]
                EC2_2[EC2 Instance 2<br/>t3.large - Warning: Oversized]
                EC2_3[EC2 Instance 3<br/>t3.large - Warning: Oversized]
            end
            
            subgraph "Database Subnet: 10.0.3.0/24"
                RDS[(RDS MySQL<br/>db.r5.large - Healthy)]
                RDS_READ[(Read Replica<br/>Missing)]
            end
            
            subgraph "Storage Layer"
                S3[S3 Bucket<br/>Critical: Public Read Access]
                EBS1[EBS Volume<br/>Critical: Unattached]
                EBS2[EBS Volume<br/>Critical: Unencrypted]
            end
        end
        
        subgraph "CDN & Edge"
            CF[CloudFront<br/>Warning: Not Configured]
            WAF[AWS WAF<br/>Missing]
        end
        
        subgraph "Monitoring & Security"
            CW[CloudWatch<br/>Basic Monitoring]
            CT[CloudTrail<br/>Warning: Limited Logging]
        end
    end
    
    subgraph "External"
        Internet[Internet Traffic]
        Users[End Users]
    end
    
    %% Connection flows
    Users --> CF
    Internet --> IGW
    IGW --> ALB
    ALB --> EC2_1
    ALB --> EC2_2
    ALB --> EC2_3
    EC2_1 --> RDS
    EC2_2 --> RDS
    EC2_3 --> RDS
    EC2_1 --> S3
    EC2_2 --> S3
    EC2_3 --> S3
    CF -.-> S3
    Internet -.->|Direct Access| S3
    
    %% Monitoring connections
    EC2_1 --> CW
    RDS --> CW
    ALB --> CT
    
    %% Problem highlighting with enhanced styling
    classDef critical fill:#fef2f2,stroke:#dc2626,stroke-width:3px,color:#dc2626
    classDef warning fill:#fefce8,stroke:#f59e0b,stroke-width:2px,color:#f59e0b
    classDef healthy fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#16a34a
    classDef missing fill:#f3f4f6,stroke:#6b7280,stroke-width:2px,stroke-dasharray: 5 5,color:#6b7280
    
    class S3,EBS1,EBS2,ALB critical
    class EC2_1,EC2_2,EC2_3,CF,CT warning
    class NAT,RDS,CW,IGW healthy
    class RDS_READ,WAF missing
  `);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: diagramTheme,
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        curve: 'cardinal',
      },
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#1d4ed8',
        lineColor: '#6b7280',
        sectionBkColor: '#f9fafb',
        altSectionBkColor: '#f3f4f6',
        gridColor: '#e5e7eb',
        tertiaryColor: '#fef3c7',
      }
    });
  }, [diagramTheme]);

  // Render diagram when code changes
  useEffect(() => {
    if (mermaidRef.current && diagramCode) {
      renderDiagram();
    }
  }, [diagramCode, diagramTheme]);

  const renderDiagram = async () => {
    if (!mermaidRef.current) return;
    
    try {
      setDiagramRendered(false);
      mermaidRef.current.innerHTML = '';
      
      const { svg } = await mermaid.render('mermaid-diagram', diagramCode);
      mermaidRef.current.innerHTML = svg;
      setDiagramRendered(true);
    } catch (error) {
      console.error('Error rendering diagram:', error);
      mermaidRef.current.innerHTML = '<p class="text-red-500">Error rendering diagram</p>';
    }
  };

  const copyDiagram = async () => {
    try {
      await navigator.clipboard.writeText(diagramCode.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const exportDiagram = async () => {
    if (!mermaidRef.current || !diagramRendered) return;
    
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `architecture-diagram-${timestamp}`;
      
      if (exportFormat === 'svg') {
        const svgData = await toSvg(mermaidRef.current, {
          backgroundColor: 'white',
          width: 1920,
          height: 1080,
        });
        
        const link = document.createElement('a');
        link.download = `${filename}.svg`;
        link.href = svgData;
        link.click();
      } else {
        const pngData = await toPng(mermaidRef.current, {
          backgroundColor: 'white',
          width: 1920,
          height: 1080,
          pixelRatio: 2,
        });
        
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = pngData;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateNewDiagram = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI-generated diagram with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate dynamic diagram based on different scenarios
      const scenarios = [
        // Multi-region setup
        `graph TB
    subgraph "Multi-Region AWS Architecture"
        subgraph "US-East-1 (Primary)"
            subgraph "VPC: 10.0.0.0/16"
                ALB1[Application Load Balancer]
                EC2_1A[EC2 Auto Scaling Group]
                RDS1[(RDS Primary)]
                S3_1[S3 Bucket - Primary]
            end
        end
        
        subgraph "US-West-2 (DR)"
            subgraph "VPC: 10.1.0.0/16"
                ALB2[Application Load Balancer]
                EC2_2A[EC2 Auto Scaling Group]
                RDS2[(RDS Replica)]
                S3_2[S3 Bucket - Replica]
            end
        end
        
        subgraph "Global Services"
            R53[Route 53]
            CF[CloudFront]
            WAF[AWS WAF]
        end
    end
    
    R53 --> CF
    CF --> ALB1
    CF --> ALB2
    ALB1 --> EC2_1A
    ALB2 --> EC2_2A
    EC2_1A --> RDS1
    EC2_2A --> RDS2
    RDS1 -.->|Replication| RDS2
    S3_1 -.->|Cross-Region Replication| S3_2
    
    classDef healthy fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    classDef warning fill:#fefce8,stroke:#f59e0b,stroke-width:2px
    
    class ALB1,EC2_1A,RDS1,R53 healthy
    class ALB2,EC2_2A,RDS2,S3_2 warning`,

        // Microservices architecture
        `graph TB
    subgraph "Kubernetes Microservices Architecture"
        subgraph "API Gateway Layer"
            APIG[API Gateway]
            LB[Load Balancer]
        end
        
        subgraph "Service Mesh"
            AUTH[Auth Service]
            USER[User Service]
            ORDER[Order Service]
            PAY[Payment Service]
            NOTIFY[Notification Service]
        end
        
        subgraph "Data Layer"
            REDIS[(Redis Cache)]
            POSTGRES[(PostgreSQL)]
            MONGO[(MongoDB)]
            ELASTIC[(Elasticsearch)]
        end
        
        subgraph "Message Queue"
            KAFKA[Apache Kafka]
            SQS[AWS SQS]
        end
    end
    
    APIG --> LB
    LB --> AUTH
    LB --> USER
    LB --> ORDER
    LB --> PAY
    
    AUTH --> REDIS
    USER --> POSTGRES
    ORDER --> POSTGRES
    PAY --> POSTGRES
    
    ORDER --> KAFKA
    KAFKA --> NOTIFY
    NOTIFY --> SQS
    
    USER --> ELASTIC
    
    classDef service fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    classDef data fill:#fef7cd,stroke:#f59e0b,stroke-width:2px
    classDef queue fill:#f3e8ff,stroke:#9333ea,stroke-width:2px
    
    class AUTH,USER,ORDER,PAY,NOTIFY service
    class REDIS,POSTGRES,MONGO,ELASTIC data
    class KAFKA,SQS queue`,

        // Serverless architecture
        `graph TB
    subgraph "Serverless Architecture"
        subgraph "API Layer"
            APIGW[API Gateway]
            CF[CloudFront]
        end
        
        subgraph "Compute Layer"
            LAMBDA1[Lambda: Auth]
            LAMBDA2[Lambda: Users]
            LAMBDA3[Lambda: Orders]
            LAMBDA4[Lambda: Analytics]
        end
        
        subgraph "Storage"
            DYNAMO[(DynamoDB)]
            S3[S3 Bucket]
            AURORA[(Aurora Serverless)]
        end
        
        subgraph "Integration"
            SQS[SQS Queue]
            SNS[SNS Topics]
            EVENTBRIDGE[EventBridge]
        end
        
        subgraph "Monitoring"
            XRAY[X-Ray Tracing]
            CW[CloudWatch]
        end
    end
    
    CF --> APIGW
    APIGW --> LAMBDA1
    APIGW --> LAMBDA2
    APIGW --> LAMBDA3
    
    LAMBDA1 --> DYNAMO
    LAMBDA2 --> AURORA
    LAMBDA3 --> DYNAMO
    LAMBDA3 --> SQS
    
    SQS --> LAMBDA4
    LAMBDA4 --> SNS
    SNS --> EVENTBRIDGE
    
    LAMBDA1 --> XRAY
    LAMBDA2 --> XRAY
    LAMBDA3 --> XRAY
    
    classDef serverless fill:#fff7ed,stroke:#f97316,stroke-width:2px
    classDef storage fill:#f0f9ff,stroke:#0ea5e9,stroke-width:2px
    classDef integration fill:#f0fdf4,stroke:#22c55e,stroke-width:2px
    
    class LAMBDA1,LAMBDA2,LAMBDA3,LAMBDA4 serverless
    class DYNAMO,S3,AURORA storage
    class SQS,SNS,EVENTBRIDGE integration`
      ];
      
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setDiagramCode(randomScenario);
    } catch (error) {
      console.error('Failed to generate diagram:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const problems = [
    { type: "Critical", count: 5, color: "destructive", items: ["S3 Public Access", "Unattached EBS Volumes", "Unencrypted Storage", "Missing SSL/TLS", "Public Database"] },
    { type: "Warning", count: 6, color: "warning", items: ["Oversized EC2s", "Missing CloudFront", "Limited Logging", "No Auto Scaling", "Single AZ", "No Backups"] },
    { type: "Healthy", count: 4, color: "success", items: ["Load Balancer", "NAT Gateway", "RDS Setup", "VPC Configuration"] }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Architecture 
              <span className="text-gradient"> Diagrams</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Interactive infrastructure visualization with AI-powered analysis, real-time issue detection, and professional export capabilities.
            </p>
          </div>

          {/* Professional Control Panel */}
          <div className="glass-card mb-8 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* View Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "all" ? "default" : "outline"}
                    onClick={() => setViewMode("all")}
                    size="sm"
                    className="glass-button"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    All Components
                  </Button>
                  <Button
                    variant={viewMode === "problems" ? "default" : "outline"}
                    onClick={() => setViewMode("problems")}
                    size="sm"
                    className="glass-button"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Issues Only
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateNewDiagram}
                    disabled={isGenerating}
                    className="glass-button"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Refresh className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? "Generating..." : "Generate New"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDiagramTheme(diagramTheme === "default" ? "dark" : diagramTheme === "dark" ? "neutral" : "default")}
                    className="glass-button"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Theme
                  </Button>
                </div>
              </div>

              {/* Export and Action Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExportFormat(exportFormat === "svg" ? "png" : "svg")}
                    className="glass-button"
                  >
                    {exportFormat === "svg" ? <FileCode className="w-4 h-4 mr-2" /> : <FileImage className="w-4 h-4 mr-2" />}
                    {exportFormat.toUpperCase()}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyDiagram}
                    disabled={copied}
                    className="glass-button"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy Code"}
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={exportDiagram}
                    disabled={isExporting || !diagramRendered}
                    className="premium-gradient text-white border-0"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isExporting ? "Exporting..." : `Export ${exportFormat.toUpperCase()}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Interactive Diagram */}
            <div className="xl:col-span-3">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Interactive Architecture Diagram</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="glass-badge">
                      {diagramTheme.charAt(0).toUpperCase() + diagramTheme.slice(1)} Theme
                    </Badge>
                    <Badge variant="outline" className="glass-badge">
                      {diagramRendered ? "Live" : "Rendering..."}
                    </Badge>
                  </div>
                </div>
                
                <TransformWrapper
                  initialScale={1}
                  initialPositionX={0}
                  initialPositionY={0}
                  minScale={0.5}
                  maxScale={3}
                  wheel={{ step: 0.1 }}
                  panning={{ disabled: false }}
                  doubleClick={{ disabled: false }}
                >
                  <TransformComponent wrapperClass="w-full h-[600px] border border-white/10 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                    <div 
                      ref={mermaidRef}
                      className="w-full h-full flex items-center justify-center p-8 text-foreground"
                      style={{ minWidth: '800px', minHeight: '600px' }}
                    >
                      {!diagramRendered && (
                        <div className="text-center space-y-4">
                          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                          <p className="text-muted-foreground">Rendering diagram...</p>
                        </div>
                      )}
                    </div>
                  </TransformComponent>
                </TransformWrapper>
                
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Move3D className="w-4 h-4" />
                      <span>Pan & Zoom enabled</span>
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    Double-click to reset view • Scroll to zoom • Drag to pan
                  </div>
                </div>
              </div>
            </div>
            {/* Analysis Panel */}
            <div className="xl:col-span-1 space-y-6">
              {/* Real-time Analysis Stats */}
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Live Analysis
                  </CardTitle>
                  <CardDescription>
                    Real-time infrastructure metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {problems.map((problem) => (
                    <div key={problem.type} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{problem.type}</span>
                        <Badge 
                          variant={problem.color as any}
                          className="px-2 py-1 text-xs font-bold"
                        >
                          {problem.count} items
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {problem.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center text-xs text-muted-foreground">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              problem.type === 'Critical' ? 'bg-red-500' :
                              problem.type === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            {item}
                          </div>
                        ))}
                        {problem.items.length > 3 && (
                          <div className="text-xs text-muted-foreground/60 pl-4">
                            +{problem.items.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Visual Legend */}
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Component Legend</CardTitle>
                  <CardDescription>Color-coded status indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <div className="w-4 h-4 bg-red-500/20 border-2 border-red-500 rounded-md"></div>
                      <div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">Critical Issues</span>
                        <p className="text-xs text-red-600 dark:text-red-400">Immediate attention required</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                      <div className="w-4 h-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-md"></div>
                      <div>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Warnings</span>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">Optimization recommended</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                      <div className="w-4 h-4 bg-green-500/20 border-2 border-green-500 rounded-md"></div>
                      <div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Healthy</span>
                        <p className="text-xs text-green-600 dark:text-green-400">Operating optimally</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-950/20">
                      <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-md"></div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Missing</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Not configured</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Actions */}
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Enterprise Actions</CardTitle>
                  <CardDescription>Professional workflow options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start glass-button" asChild>
                    <Link to="/analyze">
                      <Refresh className="w-4 h-4 mr-2" />
                      Run New Analysis
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start glass-button" asChild>
                    <Link to="/results">
                      <Share2 className="w-4 h-4 mr-2" />
                      View Full Report
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start glass-button" asChild>
                    <Link to="/assistant">
                      <Settings className="w-4 h-4 mr-2" />
                      Ask AI Assistant
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" className="w-full justify-start premium-gradient text-white border-0">
                    <Download className="w-4 h-4 mr-2" />
                    Export Premium Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI-Powered Insights */}
          <div className="mt-12">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                  AI-Powered Architecture Insights
                </CardTitle>
                <CardDescription className="text-base">
                  Dynamic recommendations generated from your infrastructure analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-600 dark:text-red-400">Critical Priority</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium">S3 Bucket Security</p>
                        <p className="text-xs text-muted-foreground">Public read access detected - immediate action required</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium">SSL/TLS Configuration</p>
                        <p className="text-xs text-muted-foreground">Load balancer missing HTTPS encryption</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Optimization Opportunities</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm font-medium">Cost Reduction</p>
                        <p className="text-xs text-muted-foreground">EC2 instances are oversized - potential 30% savings</p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm font-medium">Performance Enhancement</p>
                        <p className="text-xs text-muted-foreground">CloudFront CDN not configured for static assets</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Best Practices</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium">Well-Architected</p>
                        <p className="text-xs text-muted-foreground">Load balancer and VPC configuration optimal</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium">Database Setup</p>
                        <p className="text-xs text-muted-foreground">RDS configuration follows AWS best practices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call-to-Action */}
          <div className="mt-16 text-center">
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Infrastructure?</h3>
              <p className="text-muted-foreground mb-6">
                Get detailed implementation guides, cost estimates, and step-by-step fixes for all identified issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" size="lg" className="premium-gradient text-white border-0" asChild>
                  <Link to="/results">
                    <Download className="w-5 h-5 mr-2" />
                    Generate Full Report
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="glass-button" asChild>
                  <Link to="/assistant">
                    <Settings className="w-5 h-5 mr-2" />
                    Consult AI Expert
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Diagram;
              <Button variant="hero" size="lg" asChild>
                <Link to="/results/fixes">
                  Fix Critical Issues
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/results/share">
                  Share Diagram
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Download className="mr-2 w-5 h-5" />
                Download PNG
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Diagram;