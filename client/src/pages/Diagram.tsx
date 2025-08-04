import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TiltedCard from "@/components/ui/tilted-card";
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
  CheckCircle
} from "lucide-react";

const Diagram = () => {
  const [viewMode, setViewMode] = useState<"all" | "problems">("all");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

  const diagramCode = `
graph TB
    subgraph "VPC: 10.0.0.0/16"
        subgraph "Public Subnet: 10.0.1.0/24"
            ALB[Application Load Balancer]
            NAT[NAT Gateway]
        end
        
        subgraph "Private Subnet: 10.0.2.0/24"
            EC2_1[EC2 Instance 1<br/>t3.large]
            EC2_2[EC2 Instance 2<br/>t3.large]
            EC2_3[EC2 Instance 3<br/>t3.large]
        end
        
        subgraph "Database Subnet: 10.0.3.0/24"
            RDS[(RDS MySQL<br/>db.r5.large)]
        end
        
        subgraph "Storage"
            S3[S3 Bucket<br/>Public Read]
            EBS1[EBS Volume<br/>Unattached]
            EBS2[EBS Volume<br/>Unattached]
        end
    end
    
    subgraph "CDN"
        CF[CloudFront<br/>Not Configured]
    end
    
    Internet[Internet] --> ALB
    ALB --> EC2_1
    ALB --> EC2_2
    ALB --> EC2_3
    EC2_1 --> RDS
    EC2_2 --> RDS
    EC2_3 --> RDS
    EC2_1 --> S3
    EC2_2 --> S3
    EC2_3 --> S3
    Internet -.-> S3
    CF -.-> S3
    
    %% Problem highlighting
    classDef problem fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    classDef warning fill:#fefce8,stroke:#eab308,stroke-width:2px
    classDef good fill:#f0fdf4,stroke:#22c55e,stroke-width:2px
    
    class S3,EBS1,EBS2 problem
    class EC2_1,EC2_2,EC2_3,CF warning
    class ALB,NAT,RDS good
  `;

  const copyDiagram = () => {
    navigator.clipboard.writeText(diagramCode.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const problems = [
    { type: "Critical", count: 3, color: "destructive", items: ["S3 Public Access", "Unattached EBS Volumes"] },
    { type: "Warning", count: 4, color: "warning", items: ["Oversized EC2s", "Missing CloudFront"] },
    { type: "Good", count: 3, color: "success", items: ["Load Balancer", "NAT Gateway", "RDS Setup"] }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-20">
          {/* Header */}
          <div className="text-center mb-8 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Architecture 
              <span className="text-gradient"> Diagram</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Visual representation of your cloud infrastructure with highlighted issues and recommendations.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                onClick={() => setViewMode("all")}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                All Components
              </Button>
              <Button
                variant={viewMode === "problems" ? "default" : "outline"}
                onClick={() => setViewMode("problems")}
                size="sm"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Problems Only
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(100)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={copyDiagram}>
                {copied ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-success" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export SVG
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Diagram with Tilted Card */}
            <div className="lg:col-span-3">
              <TiltedCard
                captionText="Designed by StackStage AI"
                rotateAmplitude={8}
                scaleOnHover={1.03}
                displayOverlayContent={true}
                overlayContent={
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Diagram Controls</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Red = Critical Issues, Yellow = Warnings, Green = Healthy
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm">
                        <ZoomIn className="w-4 h-4 mr-2" />
                        Zoom
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                }
              >
                <div 
                  className="w-full overflow-auto border rounded-lg bg-white"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                >
                  <div className="p-8 min-h-[600px] flex items-center justify-center">
                    {/* Mermaid Diagram Placeholder */}
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Share2 className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Interactive Architecture Diagram
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Your cloud infrastructure visualized with Mermaid.js. 
                        Red components indicate critical issues, yellow shows warnings.
                      </p>
                      <div className="bg-muted/20 rounded-lg p-4 text-left">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {diagramCode.trim()}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltedCard>
            </div>

            {/* Legend & Stats */}
            <div className="space-y-6">
              {/* Issue Summary */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Issue Summary</CardTitle>
                  <CardDescription>
                    Components grouped by status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {problems.map((problem) => (
                    <div key={problem.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{problem.type}</span>
                        <Badge variant={problem.color as any}>
                          {problem.count}
                        </Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {problem.items.map((item, index) => (
                          <li key={index} className="pl-2">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-destructive/20 border-2 border-destructive rounded"></div>
                    <span className="text-sm">Critical Issues</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-warning/20 border-2 border-warning rounded"></div>
                    <span className="text-sm">Warnings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-success/20 border-2 border-success rounded"></div>
                    <span className="text-sm">Healthy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-dashed border-muted-foreground rounded"></div>
                    <span className="text-sm">Not Configured</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link to="/results/fixes">
                      View All Fixes
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link to="/results/share">
                      Export Report
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link to="/assistant">
                      Ask AI Assistant
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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