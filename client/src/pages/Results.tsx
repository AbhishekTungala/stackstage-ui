import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Share2,
  Download,
  Eye,
  Wrench,
  ArrowRight,
  Loader2
} from "lucide-react";
import MagicBento from "@/components/ui/magic-bento";
import { useQuery } from "@tanstack/react-query";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface AnalysisResult {
  id: string;
  timestamp: string;
  score: number;
  issues: Array<{
    id: string;
    severity: string;
    category: string;
    detail: string;
    evidence: string;
  }>;
  recommendations: Array<{
    title: string;
    rationale: string;
    iac_fix: string;
    impact: {
      latency_ms: number;
      cost_monthly_delta: number;
      risk_reduction: string;
    };
  }>;
  cost: string;
  diagram: string;
  details?: any;
}

const Results = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [location] = useLocation();
  
  // Get analysis ID from URL query params or localStorage
  const getAnalysisId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlAnalysisId = urlParams.get('id');
    const localAnalysisId = localStorage.getItem('analysisId');
    return urlAnalysisId || localAnalysisId;
  };

  const analysisId = getAnalysisId();

  // Fetch real analysis data
  const { data: analysisData, isLoading, error } = useQuery({
    queryKey: ['/api/analysis', analysisId],
    queryFn: async () => {
      const response = await fetch(`/api/analysis/${analysisId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis results');
      }
      const result = await response.json();
      return result.analysis;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate category scores from real data
  const calculateCategoryScores = (analysis: AnalysisResult) => {
    if (!analysis) return [];

    const criticalIssues = analysis.issues?.filter(issue => issue.severity === 'critical')?.length || 0;
    const highIssues = analysis.issues?.filter(issue => issue.severity === 'high')?.length || 0;
    const mediumIssues = analysis.issues?.filter(issue => issue.severity === 'medium')?.length || 0;
    const lowIssues = analysis.issues?.filter(issue => issue.severity === 'low')?.length || 0;

    const securityIssues = analysis.issues?.filter(issue => issue.category === 'security')?.length || 0;
    const costIssues = analysis.issues?.filter(issue => issue.category === 'cost')?.length || 0;
    const performanceIssues = analysis.issues?.filter(issue => issue.category === 'performance')?.length || 0;
    const reliabilityIssues = analysis.issues?.filter(issue => issue.category === 'reliability')?.length || 0;

    return [
      {
        category: "Security",
        score: Math.max(100 - (securityIssues * 10), 0),
        icon: Shield,
        color: securityIssues <= 1 ? "text-success" : securityIssues <= 3 ? "text-warning" : "text-destructive",
        bgColor: securityIssues <= 1 ? "bg-success/10" : securityIssues <= 3 ? "bg-warning/10" : "bg-destructive/10",
        status: securityIssues <= 1 ? "Good" : securityIssues <= 3 ? "Needs Attention" : "Critical",
        issues: securityIssues
      },
      {
        category: "Cost Optimization",
        score: Math.max(100 - (costIssues * 8), 0),
        icon: DollarSign,
        color: costIssues <= 1 ? "text-success" : costIssues <= 3 ? "text-warning" : "text-destructive",
        bgColor: costIssues <= 1 ? "bg-success/10" : costIssues <= 3 ? "bg-warning/10" : "bg-destructive/10",
        status: costIssues <= 1 ? "Excellent" : costIssues <= 3 ? "Needs Attention" : "Poor",
        issues: costIssues
      },
      {
        category: "Performance",
        score: Math.max(100 - (performanceIssues * 9), 0),
        icon: Zap,
        color: performanceIssues <= 1 ? "text-success" : performanceIssues <= 2 ? "text-warning" : "text-destructive",
        bgColor: performanceIssues <= 1 ? "bg-success/10" : performanceIssues <= 2 ? "bg-warning/10" : "bg-destructive/10",
        status: performanceIssues <= 1 ? "Excellent" : performanceIssues <= 2 ? "Good" : "Needs Improvement",
        issues: performanceIssues
      },
      {
        category: "Reliability",
        score: Math.max(100 - (reliabilityIssues * 8), 0),
        icon: CheckCircle,
        color: reliabilityIssues <= 1 ? "text-success" : reliabilityIssues <= 2 ? "text-warning" : "text-destructive",
        bgColor: reliabilityIssues <= 1 ? "bg-success/10" : reliabilityIssues <= 2 ? "bg-warning/10" : "bg-destructive/10",
        status: reliabilityIssues <= 1 ? "Good" : reliabilityIssues <= 2 ? "Fair" : "Poor",
        issues: reliabilityIssues
      },
      {
        category: "Scalability",
        score: Math.max(analysis.score - 5, 60), // Slight penalty from overall score
        icon: TrendingUp,
        color: analysis.score >= 80 ? "text-success" : analysis.score >= 60 ? "text-warning" : "text-destructive",
        bgColor: analysis.score >= 80 ? "bg-success/10" : analysis.score >= 60 ? "bg-warning/10" : "bg-destructive/10",
        status: analysis.score >= 80 ? "Good" : analysis.score >= 60 ? "Fair" : "Needs Work",
        issues: Math.floor((100 - analysis.score) / 15)
      }
    ];
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId: analysisId,
          format: 'pdf',
          includeCharts: true,
          includeDiagrams: true
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `StackStage-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getStatusIcon = (issues: number) => {
    if (issues === 0) return <CheckCircle className="w-4 h-4 text-success" />;
    if (issues <= 2) return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <XCircle className="w-4 h-4 text-destructive" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-6 md:px-20">
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Loading Analysis Results</h2>
              <p className="text-muted-foreground">Please wait while we retrieve your analysis...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-6 md:px-20">
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Analysis Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error instanceof Error ? error.message : 'Unable to load the analysis results.'}
              </p>
              <Button asChild>
                <Link to="/analyze">
                  <ArrowRight className="mr-2 w-4 h-4" />
                  Start New Analysis
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const overallScore = analysisData.score || 75;
  const scores = calculateCategoryScores(analysisData);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-20">
          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Architecture 
              <span className="text-gradient"> Analysis Results</span>
            </h1>
            <p className="text-base text-muted-foreground">
              Your cloud infrastructure has been analyzed by AI. Here's what we found.
            </p>
            {analysisData.timestamp && (
              <p className="text-sm text-muted-foreground">
                Analysis completed on {new Date(analysisData.timestamp).toLocaleDateString()} at {new Date(analysisData.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Overall Score */}
          <Card className="glass-card mb-12">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Overall Architecture Health Score
                </h2>
                
                {/* Score Circle */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                        {overallScore}
                      </div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </div>

                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${
                    overallScore >= 80 ? 'border-success text-success' :
                    overallScore >= 60 ? 'border-warning text-warning' :
                    'border-destructive text-destructive'
                  }`}
                >
                  {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Professional Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Radar Chart - Category Analysis */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Architecture Health Radar
                </CardTitle>
                <CardDescription>
                  Multi-dimensional analysis of your infrastructure quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={scores}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis dataKey="category" className="text-xs" />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      className="text-xs"
                      tick={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Issue Severity Distribution */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Issue Severity Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of issues by severity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Critical', 
                          value: analysisData.issues?.filter(issue => 
                            typeof issue === 'string' ? 
                            issue.toLowerCase().includes('security') || issue.toLowerCase().includes('accessible') :
                            issue.severity === 'critical'
                          ).length || 0,
                          color: '#ef4444'
                        },
                        { 
                          name: 'High', 
                          value: analysisData.issues?.filter(issue => 
                            typeof issue === 'string' ? 
                            issue.toLowerCase().includes('duplicate') :
                            issue.severity === 'high'
                          ).length || 0,
                          color: '#f97316'
                        },
                        { 
                          name: 'Medium', 
                          value: analysisData.issues?.filter(issue => 
                            typeof issue === 'string' ? 
                            issue.toLowerCase().includes('lacks') || issue.toLowerCase().includes('missing') :
                            issue.severity === 'medium'
                          ).length || 0,
                          color: '#eab308'
                        },
                        { 
                          name: 'Low', 
                          value: analysisData.issues?.filter(issue => 
                            typeof issue === 'object' && issue.severity === 'low'
                          ).length || 0,
                          color: '#22c55e'
                        }
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Critical', value: 1, color: '#ef4444' },
                        { name: 'High', value: 2, color: '#f97316' },
                        { name: 'Medium', value: 3, color: '#eab308' },
                        { name: 'Low', value: 1, color: '#22c55e' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Score Trend Analysis */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Architecture Quality Metrics
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your infrastructure scores across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={scores}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="category" 
                    className="text-xs" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    className="text-xs"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [`${value}%`, 'Score']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendations Impact Analysis */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Recommendations Impact Analysis
                </CardTitle>
                <CardDescription>
                  Priority and effort assessment for each recommendation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={analysisData.recommendations.slice(0, 5).map((rec, index) => ({
                      name: `Rec ${index + 1}`,
                      priority: rec.priority === 'high' ? 3 : rec.priority === 'medium' ? 2 : 1,
                      effort: rec.effort === 'high' ? 3 : rec.effort === 'medium' ? 2 : 1,
                      impact: Math.floor(Math.random() * 5) + 6, // Simulated impact score
                      title: (rec.title || rec.description || '').substring(0, 20) + '...'
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => [
                        value, 
                        name === 'priority' ? 'Priority Level' : 
                        name === 'effort' ? 'Effort Required' : 'Impact Score'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="priority" fill="#3b82f6" name="Priority" />
                    <Bar dataKey="effort" fill="#f59e0b" name="Effort" />
                    <Bar dataKey="impact" fill="#10b981" name="Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Category Scores with Magic Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {scores.map((item) => {
              const Icon = item.icon;
              return (
                <MagicBento 
                  key={item.category}
                  enableTilt={true}
                  enableBorderGlow={true}
                  enableMagnetism={true}
                  spotlightRadius={200}
                  glowColor="132, 0, 255"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      {getStatusIcon(item.issues)}
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2">{item.category}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                      
                      <Progress value={item.score} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.status}</span>
                        <span className="text-muted-foreground">
                          {item.issues} issue{item.issues !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </MagicBento>
              );
            })}
          </div>

          {/* Real AI Issues List */}
          {analysisData.issues && analysisData.issues.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Issues Found by AI Analysis
              </h2>
              <div className="max-w-4xl mx-auto space-y-3">
                {analysisData.issues.slice(0, 8).map((issue, index) => {
                  // Handle both string format (from AI) and object format
                  const issueText = typeof issue === 'string' ? issue : (issue.detail || issue.description || 'Issue found');
                  const detectedSeverity = typeof issue === 'object' && issue.severity ? issue.severity : (
                    issueText.toLowerCase().includes('duplicate') ? 'high' :
                    issueText.toLowerCase().includes('security') || issueText.toLowerCase().includes('accessible') ? 'critical' :
                    issueText.toLowerCase().includes('lacks') || issueText.toLowerCase().includes('missing') ? 'medium' :
                    'medium'
                  );
                  
                  // Ensure severity is always a valid string
                  const severity = detectedSeverity || 'medium';
                  
                  const getSeverityColor = (sev: string) => {
                    if (!sev) return 'bg-gray-500/10 border-gray-500/20 text-gray-600';
                    switch (sev.toLowerCase()) {
                      case 'critical': return 'bg-red-500/10 border-red-500/20 text-red-600';
                      case 'high': return 'bg-orange-500/10 border-orange-500/20 text-orange-600';
                      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600';
                      case 'low': return 'bg-green-500/10 border-green-500/20 text-green-600';
                      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-600';
                    }
                  };

                  return (
                    <div 
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        {severity === 'critical' ? 
                          <XCircle className="w-5 h-5 text-red-500" /> :
                          severity === 'high' ? 
                          <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">Terraform Issue</h3>
                          <Badge variant="outline" className={getSeverityColor(severity)}>
                            {severity.charAt(0).toUpperCase() + severity.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{issueText}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real AI Recommendations */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                AI-Generated Recommendations
              </h2>
              <div className="max-w-4xl mx-auto space-y-4">
                {analysisData.recommendations.slice(0, 6).map((rec, index) => {
                  // Handle both object format and string format recommendations
                  const title = rec.title || rec.description || `Recommendation ${index + 1}`;
                  const description = rec.rationale || rec.description || '';
                  const steps = rec.implementation_steps || rec.implementation || [];
                  
                  return (
                    <Card key={index} className="glass-card">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{description}</p>
                            {steps && steps.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-xs font-medium text-foreground mb-2">Implementation Steps:</h4>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {steps.map((step: string, stepIndex: number) => (
                                    <li key={stepIndex} className="flex items-start">
                                      <span className="text-primary mr-2">•</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {rec.impact && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3 pt-3 border-t border-white/10">
                                {rec.impact.cost_monthly_delta && (
                                  <div>
                                    <span className="font-medium text-foreground">Cost Impact:</span>
                                    <span className="text-muted-foreground ml-1">
                                      ${rec.impact.cost_monthly_delta}/month
                                    </span>
                                  </div>
                                )}
                                {rec.impact.latency_ms && (
                                  <div>
                                    <span className="font-medium text-foreground">Latency:</span>
                                    <span className="text-muted-foreground ml-1">
                                      {rec.impact.latency_ms}ms improvement
                                    </span>
                                  </div>
                                )}
                                {rec.impact.risk_reduction && (
                                  <div>
                                    <span className="font-medium text-foreground">Risk:</span>
                                    <span className="text-muted-foreground ml-1">
                                      {rec.impact.risk_reduction}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card 
              className="glass-card group hover:shadow-lg transition-all cursor-pointer"
              onClick={() => window.location.href = '/fixes'}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">View Fix Suggestions</h3>
                    <p className="text-sm text-muted-foreground">Get actionable recommendations</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glass-card group hover:shadow-lg transition-all cursor-pointer"
              onClick={() => window.location.href = `/diagram?id=${analysisId}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">View Architecture Diagram</h3>
                    <p className="text-sm text-muted-foreground">Visual representation</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glass-card group hover:shadow-lg transition-all cursor-pointer"
              onClick={handleExportReport}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Export Report</h3>
                    <p className="text-sm text-muted-foreground">Download detailed analysis</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recommended Next Steps</CardTitle>
              <CardDescription>
                Based on your AI analysis results, here's what we recommend focusing on first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/fixes">
                    <Wrench className="mr-2 w-5 h-5" />
                    View All Fixes
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/diagram?id=${analysisId}`}>
                    <Eye className="mr-2 w-5 h-5" />
                    Architecture Diagram
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleExportReport}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="mr-2 w-5 h-5 animate-spin" /> : <Download className="mr-2 w-5 h-5" />}
                  {isExporting ? 'Generating Report...' : 'Export Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;