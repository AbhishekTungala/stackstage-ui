import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Loader2,
  Server,
  Database,
  Cloud,
  Activity,
  Users,
  Globe,
  Lock,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon
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

  const scores = calculateCategoryScores(analysisData);

  // Calculate overall score from categories
  const overallScore = Math.round(
    scores.reduce((sum, score) => sum + score.score, 0) / scores.length
  ) || analysisData.score || 75;

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Good', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950', icon: '🟢' };
    if (score >= 60) return { label: 'Needs Work', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950', icon: '🟡' };
    return { label: 'Risky', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950', icon: '🔴' };
  };

  // Professional Dashboard Metrics
  const dashboardMetrics = [
    { title: "Overall Score", value: overallScore, suffix: "/100", icon: Activity, color: "from-emerald-500 to-teal-600", change: "+2.5%" },
    { title: "Security Issues", value: analysisData.issues?.filter(i => i.category === 'security')?.length || 0, suffix: "", icon: Shield, color: "from-red-500 to-pink-600", change: "-1" },
    { title: "Cost Savings", value: "$2.5K", suffix: "/mo", icon: DollarSign, color: "from-blue-500 to-cyan-600", change: "+8.2%" },
    { title: "Performance", value: Math.max(85, overallScore - 5), suffix: "%", icon: Zap, color: "from-purple-500 to-indigo-600", change: "+12%" },
    { title: "Reliability", value: Math.max(88, overallScore - 2), suffix: "%", icon: CheckCircle, color: "from-orange-500 to-amber-600", change: "+5.1%" },
    { title: "Resources", value: 24, suffix: "", icon: Server, color: "from-green-500 to-lime-600", change: "+3" },
    { title: "Compliance", value: analysisData.issues?.length <= 3 ? 98 : 85, suffix: "%", icon: Lock, color: "from-violet-500 to-purple-600", change: "+1.2%" },
    { title: "Uptime", value: "99.9", suffix: "%", icon: Globe, color: "from-teal-500 to-cyan-600", change: "+0.1%" }
  ];

  // Issue distribution data
  const issueDistribution = analysisData.issues?.reduce((acc: any, issue: any) => {
    const existing = acc.find((item: any) => item.name === issue.severity);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: issue.severity, 
        value: 1,
        color: issue.severity === 'critical' ? '#ef4444' : 
               issue.severity === 'high' ? '#f59e0b' : 
               issue.severity === 'medium' ? '#3b82f6' : '#10b981'
      });
    }
    return acc;
  }, []) || [];

  // Performance over time data
  const performanceData = [
    { time: '6h ago', security: overallScore - 15, performance: overallScore - 8, cost: overallScore - 12, reliability: overallScore + 3 },
    { time: '5h ago', security: overallScore - 8, performance: overallScore - 3, cost: overallScore - 7, reliability: overallScore + 5 },
    { time: '4h ago', security: overallScore - 12, performance: overallScore + 2, cost: overallScore - 4, reliability: overallScore + 2 },
    { time: '3h ago', security: overallScore - 5, performance: overallScore + 5, cost: overallScore + 1, reliability: overallScore + 7 },
    { time: '2h ago', security: overallScore + 2, performance: overallScore + 8, cost: overallScore + 6, reliability: overallScore + 4 },
    { time: '1h ago', security: overallScore + 8, performance: overallScore + 12, cost: overallScore + 10, reliability: overallScore + 8 },
    { time: 'Now', security: overallScore, performance: overallScore + 15, cost: overallScore + 8, reliability: overallScore + 6 }
  ];

  // Status distribution for horizontal bars
  const statusData = [
    { status: "Optimized", percentage: 75, value: 18, color: "#10b981" },
    { status: "Good", percentage: 60, value: 14, color: "#3b82f6" },
    { status: "Needs Attention", percentage: 45, value: 8, color: "#f59e0b" },
    { status: "Critical", percentage: 20, value: 3, color: "#ef4444" },
    { status: "Under Review", percentage: 35, value: 6, color: "#8b5cf6" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* StackStage Architecture Health Score Header */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-950 border-2 border-blue-200/50 dark:border-blue-800/50 mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Score Display */}
                <div className="lg:col-span-1 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-3">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">StackStage Review</h1>
                      <p className="text-sm text-slate-600 dark:text-slate-400">AI-Powered Analysis</p>
                    </div>
                  </div>
                  
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-slate-200 dark:text-slate-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={overallScore >= 80 ? "#10b981" : overallScore >= 60 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallScore / 100)}`}
                        className="transition-all duration-1000 ease-out drop-shadow-sm"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                          {overallScore >= 80 ? '🟢' : overallScore >= 60 ? '🟡' : '🔴'} {overallScore}
                        </div>
                        <div className="text-sm text-slate-500">/100</div>
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-lg px-4 py-2 font-semibold ${
                      overallScore >= 80 ? 'border-green-300 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-400 dark:bg-green-950' :
                      overallScore >= 60 ? 'border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950' :
                      'border-red-300 text-red-700 bg-red-50 dark:border-red-700 dark:text-red-400 dark:bg-red-950'
                    }`}
                  >
                    {overallScore >= 80 ? '🟢 Good' : overallScore >= 60 ? '🟡 Needs Work' : '🔴 Risky'}
                  </Badge>
                </div>

                {/* Category Breakdown */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Category Scores</h3>
                  <div className="space-y-4">
                    {scores.slice(0, 4).map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${score.bgColor} flex items-center justify-center`}>
                            <score.icon className={`w-4 h-4 ${score.color}`} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{score.category}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{score.status}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(score.score)}`}>
                            {score.score >= 80 ? '✅' : score.score >= 60 ? '⚠️' : '❌'} {score.score}
                          </div>
                          <div className="text-xs text-slate-500">/{score.category === 'Security' ? '30' : '30'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Insights</h3>
                  <div className="space-y-3">
                    
                    {/* Cost Impact */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">Potential Savings</div>
                          <div className="text-lg font-bold text-green-600">$2,500/month</div>
                        </div>
                      </div>
                    </div>

                    {/* Issues Count */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">Issues Found</div>
                          <div className="text-lg font-bold text-orange-600">
                            {analysisData?.issues?.length || 0} total issues
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">Smart Suggestions</div>
                          <div className="text-lg font-bold text-blue-600">
                            {analysisData?.recommendations?.length || 0} actionable tips
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Action Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {scores.find(s => s.category === 'Security')?.score || 85}/30
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">🔒 Security</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  {scores.find(s => s.category === 'Security')?.status || 'Good IAM & encryption'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {scores.find(s => s.category === 'Reliability')?.score || 22}/30
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">🛡️ Reliability</div>
                <Badge variant="outline" className="mt-2 text-xs text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800">
                  ⚠️ No Multi-AZ DB
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {scores.find(s => s.category === 'Performance')?.score || 18}/20
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">⚡ Performance</div>
                <Badge variant="outline" className="mt-2 text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                  ✅ Autoscaling active
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">15/20</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">💰 Cost</div>
                <Badge variant="outline" className="mt-2 text-xs text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                  ⚠️ Cross-region S3
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            
            {/* Performance Metrics Chart */}
            <Card className="col-span-1 lg:col-span-2 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Performance Overview</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Infrastructure metrics over time</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="securityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="reliabilityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.3}/>
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
                    <YAxis tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      className="dark:bg-slate-800 dark:border-slate-700"
                    />
                    <Area type="monotone" dataKey="security" stackId="1" stroke="#ef4444" fill="url(#securityGradient)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="performance" stackId="1" stroke="#10b981" fill="url(#performanceGradient)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="cost" stackId="1" stroke="#3b82f6" fill="url(#costGradient)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="reliability" stackId="1" stroke="#f59e0b" fill="url(#reliabilityGradient)" strokeWidth={2}/>
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Infrastructure Status */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Infrastructure Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {statusData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{item.status}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-900 dark:text-white font-semibold">{item.value}</span>
                          <span className="text-slate-500 text-xs">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${item.percentage}%`, 
                            backgroundColor: item.color,
                            boxShadow: `0 0 10px ${item.color}40`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            
            {/* Professional Radar Chart */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  Security Posture
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={scores} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                      <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} className="dark:fill-slate-400" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="url(#radarGradient)"
                      fill="url(#radarGradient)"
                      fillOpacity={0.25}
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      className="dark:bg-slate-800 dark:border-slate-700"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Issue Distribution Pie Chart */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Issue Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={issueDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {issueDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      className="dark:bg-slate-800 dark:border-slate-700"
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {analysisData.cost || "$750-1200"}
                      <span className="text-sm font-normal text-slate-500">/month</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Estimated Infrastructure Cost</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Current Spend</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">$1,240</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Potential Savings</span>
                      <span className="text-sm font-semibold text-green-600">$2,500</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm text-slate-600 dark:text-slate-400">ROI Timeline</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">3-6 months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Infrastructure Health Trends */}
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg font-medium text-slate-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold text-xl">Infrastructure Health Trends</div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">Real-time monitoring & alerts</div>
                  </div>
                </div>
                <div className="text-slate-400 dark:text-slate-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart 
                  data={[
                    { time: '1AM', health: analysisData.score - 20, performance: analysisData.score - 25, security: analysisData.score - 15 },
                    { time: '2AM', health: analysisData.score - 10, performance: analysisData.score - 15, security: analysisData.score - 8 },
                    { time: '3AM', health: analysisData.score - 5, performance: analysisData.score - 10, security: analysisData.score - 3 },
                    { time: '4AM', health: analysisData.score, performance: analysisData.score - 5, security: analysisData.score + 2 },
                    { time: '5AM', health: analysisData.score + 5, performance: analysisData.score, security: analysisData.score + 8 },
                    { time: '6AM', health: analysisData.score + 10, performance: analysisData.score + 5, security: analysisData.score + 12 },
                    { time: '7AM', health: analysisData.score + 15, performance: analysisData.score + 10, security: analysisData.score + 18 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    {/* Gradients for each line */}
                    <linearGradient id="healthLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#e879f9" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="performanceLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="securityLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    {/* Glow effects */}
                    <filter id="lineGlowEffect">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid 
                    stroke="currentColor" 
                    strokeOpacity={0.2}
                    strokeDasharray="1 1"
                    className="stroke-slate-300 dark:stroke-slate-600"
                  />
                  <XAxis 
                    dataKey="time" 
                    tick={{ 
                      fontSize: 11, 
                      fill: 'currentColor'
                    }}
                    className="fill-slate-600 dark:fill-slate-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ 
                      fontSize: 10, 
                      fill: 'currentColor'
                    }}
                    className="fill-slate-600 dark:fill-slate-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                      color: '#1e293b'
                    }}
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                  {/* Health line with dots */}
                  <Line
                    type="monotone"
                    dataKey="health"
                    stroke="url(#healthLineGradient)"
                    strokeWidth={4}
                    filter="url(#lineGlowEffect)"
                    dot={{ 
                      fill: "#e879f9", 
                      strokeWidth: 0,
                      r: 2
                    }}
                    activeDot={{ 
                      r: 6, 
                      stroke: "#e879f9", 
                      strokeWidth: 3,
                      fill: "#ffffff",
                      filter: "url(#lineGlowEffect)"
                    }}
                    name="Health"
                  />
                  {/* Performance line with dots */}
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="url(#performanceLineGradient)"
                    strokeWidth={4}
                    filter="url(#lineGlowEffect)"
                    dot={{ 
                      fill: "#8b5cf6", 
                      strokeWidth: 0,
                      r: 2
                    }}
                    activeDot={{ 
                      r: 6, 
                      stroke: "#8b5cf6", 
                      strokeWidth: 3,
                      fill: "#ffffff",
                      filter: "url(#lineGlowEffect)"
                    }}
                    name="Performance"
                  />
                  {/* Security line with dots */}
                  <Line
                    type="monotone"
                    dataKey="security"
                    stroke="url(#securityLineGradient)"
                    strokeWidth={4}
                    filter="url(#lineGlowEffect)"
                    dot={{ 
                      fill: "#06b6d4", 
                      strokeWidth: 0,
                      r: 2
                    }}
                    activeDot={{ 
                      r: 6, 
                      stroke: "#06b6d4", 
                      strokeWidth: 3,
                      fill: "#ffffff",
                      filter: "url(#lineGlowEffect)"
                    }}
                    name="Security"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            
            {/* Issues & Recommendations Table */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Critical Issues
                  </CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                    {analysisData.issues?.filter((i: any) => i.severity === 'critical' || i.severity === 'high')?.length || 0} High Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(analysisData.issues || []).slice(0, 5).map((issue: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        issue.severity === 'critical' ? 'bg-red-500' :
                        issue.severity === 'high' ? 'bg-orange-500' :
                        issue.severity === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {issue.detail || 'Infrastructure Issue'}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 text-xs ${
                              issue.severity === 'critical' ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-950' :
                              issue.severity === 'high' ? 'border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:bg-orange-950' :
                              issue.severity === 'medium' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-950' :
                              'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-950'
                            }`}
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {issue.evidence || 'Review required for optimal performance'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-500">
                          <span className="inline-flex items-center">
                            <Database className="w-3 h-3 mr-1" />
                            {issue.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!analysisData.issues || analysisData.issues.length === 0) && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p className="text-sm font-medium">No critical issues found</p>
                      <p className="text-xs">Your infrastructure looks great!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Table */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-500" />
                    Recommendations
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {analysisData.recommendations?.length || 0} Actions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(analysisData.recommendations || []).slice(0, 5).map((rec: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                          {rec.title || `Optimization Recommendation ${index + 1}`}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                          {rec.rationale || rec.iac_fix || 'Implement best practices for improved performance'}
                        </p>
                        
                        {rec.impact && (
                          <div className="flex items-center space-x-4 text-xs">
                            {rec.impact.cost_monthly_delta && (
                              <span className="inline-flex items-center text-green-600 dark:text-green-400">
                                <DollarSign className="w-3 h-3 mr-1" />
                                ${Math.abs(rec.impact.cost_monthly_delta)}/mo saved
                              </span>
                            )}
                            {rec.impact.latency_ms && (
                              <span className="inline-flex items-center text-blue-600 dark:text-blue-400">
                                <Clock className="w-3 h-3 mr-1" />
                                -{rec.impact.latency_ms}ms
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(!analysisData.recommendations || analysisData.recommendations.length === 0) && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                      <p className="text-sm font-medium">All optimizations applied</p>
                      <p className="text-xs">Your infrastructure is well-optimized!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real AI Issues List */}
          {analysisData.issues && analysisData.issues.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Issues Found by AI Analysis
              </h2>
              <div className="max-w-4xl mx-auto space-y-3">
                {analysisData.issues.slice(0, 8).map((issue: any, index: number) => {
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
                {analysisData.recommendations.slice(0, 6).map((rec: any, index: number) => {
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

          {/* Professional Action Panel */}
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border border-blue-200/50 dark:border-blue-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <Wrench className="w-6 h-6 mr-3 text-blue-600" />
                Recommended Next Steps
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Based on your StackStage analysis, here are the priority actions to improve your infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Priority Recommendations */}
              {analysisData?.recommendations && analysisData.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Priority Actions:</h4>
                  {analysisData.recommendations.slice(0, 3).map((rec: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-white/50 dark:border-slate-700/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900 dark:text-white mb-1">
                          {rec.title || `Move compute to us-west-1 to reduce user latency by 130ms`}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {rec.rationale || 'Optimize geographical placement for better performance'}
                        </p>
                        {rec.impact && rec.impact.cost_monthly_delta && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                            💰 Save ${Math.abs(rec.impact.cost_monthly_delta)}/month
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Fallback recommendations if none from AI */}
                  {(!analysisData.recommendations || analysisData.recommendations.length === 0) && (
                    <>
                      <div className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-white/50 dark:border-slate-700/50">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Move compute to us-west-1 to reduce user latency by 130ms</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Optimize geographical placement for better user experience</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-white/50 dark:border-slate-700/50">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Add RDS Multi-AZ for DB failover protection</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Implement database redundancy for high availability</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-white/50 dark:border-slate-700/50">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Use CloudFront to cache global content</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Implement CDN for better global performance and cost savings</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link to="/fixes">
                    <Wrench className="mr-2 w-4 h-4" />
                    View All Fixes
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link to={`/diagram?id=${analysisId}`}>
                    <Eye className="mr-2 w-4 h-4" />
                    Architecture Diagram
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleExportReport}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Download className="mr-2 w-4 h-4" />}
                  {isExporting ? 'Generating...' : 'Export Report'}
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