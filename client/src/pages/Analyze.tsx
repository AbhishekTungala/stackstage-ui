import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Cloud, 
  FileText, 
  Zap, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

const Analyze = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cloudProvider, setCloudProvider] = useState("");
  const [cloudConnect, setCloudConnect] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // Redirect to results - using wouter navigation
      window.location.href = "/results";
    }, 3000);
  };

  const cloudProviders = [
    { value: "aws", label: "Amazon Web Services" },
    { value: "gcp", label: "Google Cloud Platform" },
    { value: "azure", label: "Microsoft Azure" },
    { value: "hybrid", label: "Multi-Cloud/Hybrid" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Analyze Your 
              <span className="text-gradient"> Cloud Architecture</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your infrastructure files or connect directly to your cloud provider 
              for comprehensive analysis and optimization recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Panel */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <span>Upload Infrastructure Files</span>
                </CardTitle>
                <CardDescription>
                  Terraform, CloudFormation, Kubernetes YAML, or configuration files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".tf,.yaml,.yml,.json,.hcl"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports .tf, .yaml, .json, .hcl files
                    </p>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Input Panel */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Paste Configuration</span>
                </CardTitle>
                <CardDescription>
                  Paste your infrastructure code directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`# Paste your Terraform, CloudFormation, or Kubernetes configuration here
resource "aws_instance" "web" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  
  tags = {
    Name = "HelloWorld"
  }
}`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Configuration Options */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-primary" />
                <span>Analysis Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cloud Provider Selection */}
                <div className="space-y-2">
                  <Label htmlFor="cloud-provider">Cloud Provider</Label>
                  <Select value={cloudProvider} onValueChange={setCloudProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cloud provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cloud Connect Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cloud-connect"
                      checked={cloudConnect}
                      onCheckedChange={setCloudConnect}
                    />
                    <Label htmlFor="cloud-connect">Connect to Cloud Provider</Label>
                  </div>
                  {cloudConnect && (
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Premium Feature</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Direct cloud scanning requires API credentials and is available in premium plans.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Button */}
              <div className="pt-6 border-t border-border">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFiles.length && !textInput.trim() && !cloudConnect}
                  className="w-full md:w-auto"
                  size="lg"
                  variant={isAnalyzing ? "outline" : "hero"}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Analyzing Architecture...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 w-5 h-5" />
                      Analyze Architecture
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="glass border-success/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <h3 className="font-semibold">Secure Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your data is processed securely and never stored permanently.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">Fast Results</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive analysis results in under 30 seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-warning/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-warning" />
                  </div>
                  <h3 className="font-semibold">Detailed Reports</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Export comprehensive reports for your team and stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;