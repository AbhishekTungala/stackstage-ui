import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  MapPin, 
  Wifi, 
  Clock, 
  TrendingDown, 
  TrendingUp,
  Zap,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface GeoRegion {
  code: string;
  name: string;
  flag: string;
  continent: string;
  latency: number;
  cost: number;
  compliance: string[];
  performance: "excellent" | "good" | "fair" | "poor";
}

interface RegionalImpact {
  latency: string;
  cost: string;
  compliance: string;
  recommendation: string;
  severity: "info" | "warning" | "critical";
}

interface GeoRegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  onRegionalImpact?: (impact: RegionalImpact) => void;
  showAutoDetect?: boolean;
  showImpactPreview?: boolean;
  className?: string;
}

const REGIONS: GeoRegion[] = [
  {
    code: "us-east-1",
    name: "US East (N. Virginia)",
    flag: "🇺🇸",
    continent: "North America",
    latency: 20,
    cost: 1.0,
    compliance: ["SOC 2", "FedRAMP", "HIPAA"],
    performance: "excellent"
  },
  {
    code: "us-west-2",
    name: "US West (Oregon)",
    flag: "🇺🇸",
    continent: "North America",
    latency: 25,
    cost: 1.1,
    compliance: ["SOC 2", "FedRAMP"],
    performance: "excellent"
  },
  {
    code: "eu-west-1",
    name: "Europe (Ireland)",
    flag: "🇮🇪",
    continent: "Europe",
    latency: 45,
    cost: 1.15,
    compliance: ["GDPR", "ISO 27001"],
    performance: "excellent"
  },
  {
    code: "eu-central-1",
    name: "Europe (Frankfurt)",
    flag: "🇩🇪",
    continent: "Europe",
    latency: 50,
    cost: 1.2,
    compliance: ["GDPR", "ISO 27001", "C5"],
    performance: "good"
  },
  {
    code: "ap-south-1",
    name: "Asia Pacific (Mumbai)",
    flag: "🇮🇳",
    continent: "Asia",
    latency: 85,
    cost: 0.9,
    compliance: ["ISO 27001"],
    performance: "good"
  },
  {
    code: "ap-southeast-1",
    name: "Asia Pacific (Singapore)",
    flag: "🇸🇬",
    continent: "Asia",
    latency: 95,
    cost: 1.05,
    compliance: ["MTCS", "ISO 27001"],
    performance: "good"
  },
  {
    code: "ap-northeast-1",
    name: "Asia Pacific (Tokyo)",
    flag: "🇯🇵",
    continent: "Asia",
    latency: 110,
    cost: 1.25,
    compliance: ["ISMS", "ISO 27001"],
    performance: "fair"
  }
];

export const GeoRegionSelector = ({
  selectedRegion,
  onRegionChange,
  onRegionalImpact,
  showAutoDetect = true,
  showImpactPreview = true,
  className = ""
}: GeoRegionSelectorProps) => {
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [detectedRegion, setDetectedRegion] = useState<string | null>(null);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(false);
  const [regionalImpact, setRegionalImpact] = useState<RegionalImpact | null>(null);

  const selectedRegionData = REGIONS.find(r => r.code === selectedRegion);
  const baselineRegion = REGIONS[0]; // US East as baseline

  // Auto-detect user region (mock implementation)
  const detectUserRegion = async () => {
    setAutoDetecting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock detection based on timezone (in real implementation, use IP geolocation API)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detected = "us-east-1";
      
      if (timezone.includes("Europe")) {
        detected = "eu-west-1";
      } else if (timezone.includes("Asia")) {
        detected = "ap-south-1";
      } else if (timezone.includes("Pacific")) {
        detected = "us-west-2";
      }
      
      setDetectedRegion(detected);
      if (autoDetectEnabled) {
        onRegionChange(detected);
      }
    } catch (error) {
      console.error("Failed to detect region:", error);
    } finally {
      setAutoDetecting(false);
    }
  };

  // Calculate regional impact
  useEffect(() => {
    if (selectedRegionData) {
      const latencyDiff = selectedRegionData.latency - baselineRegion.latency;
      const costMultiplier = selectedRegionData.cost;
      
      const impact: RegionalImpact = {
        latency: latencyDiff > 0 
          ? `+${latencyDiff}ms vs baseline` 
          : latencyDiff < 0 
            ? `${latencyDiff}ms vs baseline` 
            : "Baseline latency",
        cost: costMultiplier !== 1.0 
          ? `${costMultiplier > 1 ? '+' : ''}${((costMultiplier - 1) * 100).toFixed(0)}% cost impact`
          : "Baseline cost",
        compliance: selectedRegionData.compliance.join(", "),
        recommendation: latencyDiff > 50 
          ? "Consider CDN for global users" 
          : latencyDiff > 20 
            ? "Good choice for regional deployment"
            : "Optimal for primary region",
        severity: latencyDiff > 50 ? "warning" : latencyDiff > 20 ? "info" : "info"
      };
      
      setRegionalImpact(impact);
      onRegionalImpact?.(impact);
    }
  }, [selectedRegionData, onRegionalImpact]);

  // Auto-detect on component mount
  useEffect(() => {
    if (showAutoDetect && !detectedRegion && !autoDetecting) {
      detectUserRegion();
    }
  }, [showAutoDetect]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent": return "text-green-600 dark:text-green-400";
      case "good": return "text-blue-600 dark:text-blue-400";
      case "fair": return "text-yellow-600 dark:text-yellow-400";
      case "poor": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className={`glass-card border-white/10 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Globe className="w-5 h-5 mr-2" />
          Target Region Optimization
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Select your primary user region for optimized recommendations
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-Detection Section */}
        {showAutoDetect && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-detect" className="text-sm font-medium">
                  Auto-detect region
                </Label>
                <Switch
                  id="auto-detect"
                  checked={autoDetectEnabled}
                  onCheckedChange={setAutoDetectEnabled}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={detectUserRegion}
                disabled={autoDetecting}
                className="glass-button"
              >
                {autoDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                {autoDetecting ? "Detecting..." : "Detect"}
              </Button>
            </div>
            
            {detectedRegion && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Detected: {REGIONS.find(r => r.code === detectedRegion)?.name}
                </span>
                {!autoDetectEnabled && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => onRegionChange(detectedRegion)}
                    className="h-auto p-0 text-blue-600 hover:text-blue-800"
                  >
                    Use this region
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Region Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Primary Region</Label>
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select target region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{region.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{region.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {region.continent} • {region.latency}ms • 
                        <span className={getPerformanceColor(region.performance)}>
                          {region.performance}
                        </span>
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Region Info */}
        {selectedRegionData && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{selectedRegionData.flag}</span>
                <div>
                  <div className="font-semibold">{selectedRegionData.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedRegionData.continent}</div>
                </div>
              </div>
              <Badge variant="outline" className={getPerformanceColor(selectedRegionData.performance)}>
                {selectedRegionData.performance}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{selectedRegionData.latency}ms latency</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{(selectedRegionData.cost * 100).toFixed(0)}% cost factor</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <div className="text-xs text-muted-foreground mb-1">Compliance:</div>
              <div className="flex flex-wrap gap-1">
                {selectedRegionData.compliance.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regional Impact Preview */}
        {showImpactPreview && regionalImpact && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <Label className="text-sm font-medium">Regional Impact Analysis</Label>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm">Latency Impact:</span>
                <span className="text-sm font-medium">{regionalImpact.latency}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm">Cost Impact:</span>
                <span className="text-sm font-medium">{regionalImpact.cost}</span>
              </div>
              <div className="flex items-start space-x-2 p-2 rounded bg-gray-50 dark:bg-gray-900/50">
                {getSeverityIcon(regionalImpact.severity)}
                <div className="flex-1">
                  <div className="text-sm font-medium">Recommendation</div>
                  <div className="text-xs text-muted-foreground">{regionalImpact.recommendation}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeoRegionSelector;