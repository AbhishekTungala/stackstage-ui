import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Cloud, 
  CheckCircle,
  Loader2,
  Shield,
  BarChart3,
  Settings,
  Globe,
  Database,
  Server,
  Lock,
  AlertCircle,
  Zap,
  ArrowRight
} from "lucide-react";

const AnalyzeNew = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cloudProvider, setCloudProvider] = useState("");
  const [cloudConnect, setCloudConnect] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  
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
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Implement analysis logic here
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Aurora className="fixed inset-0 z-0" fadeHeight={60} fadeDirection="bottom" />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Cloud Infrastructure Analysis</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your cloud providers, analyze your infrastructure, and get actionable insights
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">File Upload</TabsTrigger>
                <TabsTrigger value="connect">Cloud Connect</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Upload Infrastructure Files</span>
                    </CardTitle>
                    <CardDescription>
                      Upload Terraform, CloudFormation, or Kubernetes files for analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium">Click to upload files</p>
                        <p className="text-sm text-muted-foreground">
                          Supports .tf, .yaml, .json, .yml files
                        </p>
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Selected Files:</h4>
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Or paste configuration directly:</Label>
                      <Textarea
                        placeholder="Paste your Terraform, CloudFormation, or Kubernetes configuration here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="connect" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Cloud className="w-5 h-5" />
                      <span>Connect Cloud Provider</span>
                    </CardTitle>
                    <CardDescription>
                      Connect directly to your cloud provider for real-time analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Professional Cloud Provider Selection */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Select Cloud Provider</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {cloudProviders.map((provider) => (
                          <motion.div
                            key={provider.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                cloudProvider === provider.id 
                                  ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' 
                                  : 'hover:shadow-md hover:border-primary/20 border-gray-200/60 dark:border-gray-700/60'
                              }`}
                              onClick={() => setCloudProvider(provider.id)}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${provider.color} opacity-5 hover:opacity-10 transition-opacity`} />
                              <CardContent className="relative p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="text-3xl">{provider.icon}</div>
                                  {cloudProvider === provider.id && (
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{provider.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {provider.description}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    {provider.regions.length} regions
                                  </span>
                                  <span className="text-muted-foreground">
                                    {provider.credentials.length} credentials
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Credential Input Forms */}
                    <AnimatePresence>
                      {cloudProvider && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6"
                        >
                          <Card className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-200/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center">
                                <Lock className="w-4 h-4 mr-2 text-primary" />
                                {cloudProviders.find(p => p.id === cloudProvider)?.name} Credentials
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                              {cloudProvider && cloudProviders.find(p => p.id === cloudProvider)?.credentials.map((cred) => (
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Analysis Action */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFiles.length && !textInput.trim() && !cloudConnect}
                className="px-12 py-4 text-lg font-semibold"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Launch Analysis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AnalyzeNew;