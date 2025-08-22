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
  PieChart as PieChartIcon,
  Radar,
  Target,
  Cpu,
  HardDrive,
  Network,
  Gauge
} from "lucide-react";
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
  Radar as RadarData, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-6 md:px-20">
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-purple-500" />
              <h2 className="text-2xl font-semibold text-white mb-2">Loading Analysis Results</h2>
              <p className="text-slate-400">Please wait while we retrieve your analysis...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-6 md:px-20">
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-white mb-2">Analysis Not Found</h2>
              <p className="text-slate-400 mb-6">
                {error instanceof Error ? error.message : 'Unable to load the analysis results.'}
              </p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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

  // Calculate overall score
  const overallScore = analysisData?.overallScore || analysisData?.score || 73;
  const securityScore = analysisData?.securityScore || 74;
  const costScore = analysisData?.costScore || 65;
  const performanceScore = analysisData?.performanceScore || 82;
  const reliabilityScore = Math.max(85, overallScore - 5);

  // Premium dashboard metrics with gradients
  const dashboardMetrics = [
    { 
      title: "Overall Score", 
      value: overallScore, 
      suffix: "/100", 
      icon: Activity, 
      gradient: "from-emerald-500 to-teal-500",
      change: "+2.5%",
      trend: "up"
    },
    { 
      title: "Security Rating", 
      value: securityScore, 
      suffix: "/100", 
      icon: Shield, 
      gradient: "from-blue-500 to-cyan-500",
      change: "+5.2%",
      trend: "up"
    },
    { 
      title: "Cost Optimization", 
      value: costScore, 
      suffix: "/100", 
      icon: DollarSign, 
      gradient: "from-purple-500 to-pink-500",
      change: "+8.1%",
      trend: "up"
    },
    { 
      title: "Performance", 
      value: performanceScore, 
      suffix: "/100", 
      icon: Zap, 
      gradient: "from-orange-500 to-red-500",
      change: "+12.3%",
      trend: "up"
    }
  ];

  // Multi-dimensional radar chart data
  const radarData = [
    { subject: 'Security', A: securityScore, B: 90, fullMark: 100 },
    { subject: 'Performance', A: performanceScore, B: 85, fullMark: 100 },
    { subject: 'Cost', A: costScore, B: 70, fullMark: 100 },
    { subject: 'Reliability', A: reliabilityScore, B: 88, fullMark: 100 },
    { subject: 'Scalability', A: Math.max(75, overallScore - 10), B: 82, fullMark: 100 },
    { subject: 'Compliance', A: Math.min(95, overallScore + 15), B: 78, fullMark: 100 }
  ];

  // Spikes chart data (bar chart with gradients)
  const spikesData = [
    { name: 'Jan', current: 65, target: 80, issues: 12 },
    { name: 'Feb', current: 72, target: 80, issues: 8 },
    { name: 'Mar', current: 68, target: 80, issues: 15 },
    { name: 'Apr', current: 78, target: 80, issues: 6 },
    { name: 'May', current: 85, target: 80, issues: 4 },
    { name: 'Jun', current: overallScore, target: 80, issues: analysisData.issues?.length || 3 }
  ];

  // Website visitors data (like reference image)
  const visitorsData = [
    { name: 'Resources', value: 24, color: '#8b5cf6' },
    { name: 'Issues', value: analysisData.issues?.length || 8, color: '#ef4444' },
    { name: 'Optimized', value: 18, color: '#10b981' }
  ];

  // Revenue data for area chart
  const revenueData = [
    { month: 'Jan', revenue: 240.8, expenses: 180.2 },
    { month: 'Feb', revenue: 280.5, expenses: 195.8 },
    { month: 'Mar', revenue: 320.1, expenses: 210.3 },
    { month: 'Apr', revenue: 380.7, expenses: 225.9 },
    { month: 'May', revenue: 420.3, expenses: 240.1 },
    { month: 'Jun', revenue: 480.9, expenses: 255.7 }
  ];

  // Team progress data
  const teamProgressData = [
    { name: 'Security Analyst', email: 'security@stackstage.com', progress: 85, avatar: '🛡️' },
    { name: 'Cloud Architect', email: 'architect@stackstage.com', progress: 92, avatar: '☁️' },
    { name: 'DevOps Engineer', email: 'devops@stackstage.com', progress: 78, avatar: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-slate-400">Cloud Architecture Analysis Dashboard</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isExporting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Download className="mr-2 w-4 h-4" />}
                  Export data
                </Button>
              </div>
            </div>

            {/* Premium Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardMetrics.map((metric, index) => (
                <Card key={index} className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metric.gradient} flex items-center justify-center`}>
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-400/10">
                        {metric.change}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{metric.title}</h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">{metric.suffix}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Infrastructure Health - Attractive Area Chart */}
            <Card className="bg-slate-900/50 dark:bg-slate-900/50 bg-white/50 border-slate-800 dark:border-slate-800 border-slate-200 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white dark:text-white text-slate-900">Infrastructure Health</CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-400 dark:text-slate-400 text-slate-600 hover:text-white dark:hover:text-white hover:text-slate-900">
                    Export ↗
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gradient Area Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: 'Mon', security: 85, performance: 92, cost: 78 },
                        { name: 'Tue', security: 88, performance: 94, cost: 82 },
                        { name: 'Wed', security: 92, performance: 89, cost: 85 },
                        { name: 'Thu', security: 89, performance: 96, cost: 88 },
                        { name: 'Fri', security: 94, performance: 98, cost: 90 },
                        { name: 'Sat', security: 96, performance: 95, cost: 93 },
                        { name: 'Sun', security: securityScore, performance: performanceScore, cost: costScore }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="securityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="dark:stroke-slate-700 stroke-slate-300" />
                      <XAxis dataKey="name" stroke="#94a3b8" className="dark:stroke-slate-400 stroke-slate-600" />
                      <YAxis stroke="#94a3b8" className="dark:stroke-slate-400 stroke-slate-600" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#0f172a'
                        }}
                        className="dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 dark:text-white text-slate-900"
                      />
                      <Area
                        type="monotone"
                        dataKey="security"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="url(#securityGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="performance"
                        stackId="1"
                        stroke="#06b6d4"
                        fill="url(#performanceGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="url(#costGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Security', value: securityScore, color: '#8b5cf6', icon: '🛡️' },
                    { name: 'Performance', value: performanceScore, color: '#06b6d4', icon: '⚡' },
                    { name: 'Cost Optimization', value: costScore, color: '#f59e0b', icon: '💰' }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="text-sm text-slate-300 dark:text-slate-300 text-slate-700">{item.name}</div>
                      <div className="text-lg font-bold text-white dark:text-white text-slate-900">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics - Enhanced Spike Charts */}
            <Card className="lg:col-span-2 bg-slate-900/50 dark:bg-slate-900/50 bg-white/50 border-slate-800 dark:border-slate-800 border-slate-200 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white dark:text-white text-slate-900">Performance Metrics</CardTitle>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">$240.8K</div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      <span className="text-slate-300 dark:text-slate-300 text-slate-700">Response Time</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-slate-300 dark:text-slate-300 text-slate-700">Throughput</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                      <span className="text-slate-300 dark:text-slate-300 text-slate-700">Error Rate</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Jan', response: 120, throughput: 850, errors: 12 },
                        { name: 'Feb', response: 95, throughput: 920, errors: 8 },
                        { name: 'Mar', response: 110, throughput: 880, errors: 15 },
                        { name: 'Apr', response: 85, throughput: 980, errors: 6 },
                        { name: 'May', response: 75, throughput: 1100, errors: 4 },
                        { name: 'Jun', response: 65, throughput: 1200, errors: 3 }
                      ]} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                          <stop offset="50%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#1e40af" stopOpacity={0.7}/>
                        </linearGradient>
                        <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                          <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.7}/>
                        </linearGradient>
                        <linearGradient id="errorsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                          <stop offset="50%" stopColor="#ea580c" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="dark:stroke-slate-700 stroke-slate-300" />
                      <XAxis dataKey="name" stroke="#94a3b8" className="dark:stroke-slate-400 stroke-slate-600" />
                      <YAxis stroke="#94a3b8" className="dark:stroke-slate-400 stroke-slate-600" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#0f172a'
                        }}
                        className="dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 dark:text-white text-slate-900"
                      />
                      <Bar dataKey="response" fill="url(#responseGradient)" radius={[6, 6, 0, 0]} maxBarSize={25} />
                      <Bar dataKey="throughput" fill="url(#throughputGradient)" radius={[6, 6, 0, 0]} maxBarSize={25} />
                      <Bar dataKey="errors" fill="url(#errorsGradient)" radius={[6, 6, 0, 0]} maxBarSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Multi-Dimensional Radar Chart */}
            <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <Radar className="mr-2 w-5 h-5 text-purple-500 dark:text-purple-400" />
                  Multi-Dimensional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <defs>
                        <linearGradient id="radarGradient1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="radarGradient2" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 14 }} tickFormatter={(value) => value} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={false}
                        tickCount={5}
                      />
                      <RadarData
                        name="Current"
                        dataKey="A"
                        stroke="#8b5cf6"
                        fill="url(#radarGradient1)"
                        strokeWidth={2}
                      />
                      <RadarData
                        name="Target"
                        dataKey="B"
                        stroke="#10b981"
                        fill="url(#radarGradient2)"
                        strokeWidth={2}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#f1f5f9' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Team Progress */}
            <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900 dark:text-white">Team Progress</CardTitle>
                  <CardTitle className="text-slate-900 dark:text-white">Infrastructure Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Team Members */}
                <div className="space-y-4">
                  {teamProgressData.map((member, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</h4>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{member.progress}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                              style={{ width: `${member.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Website Visitors Gauge */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            <linearGradient id="halfPieGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                              <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.9}/>
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <Pie
                            data={[
                              { value: 80, fill: 'url(#halfPieGradient)' },
                              { value: 20, fill: '#1e293b' }
                            ]}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={40}
                            outerRadius={60}
                            dataKey="value"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">80%</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Transactions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-6 mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-300 dark:text-slate-300 text-slate-700">Sell</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-slate-300 dark:text-slate-300 text-slate-700">Distribute</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                      <span className="text-slate-300 dark:text-slate-300 text-slate-700">Return</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Cost Trends Line Chart */}
            <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <TrendingUp className="mr-2 w-5 h-5 text-green-500" />
                  Cost Trends
                </CardTitle>
                <div className="text-lg font-bold text-emerald-400">-$1.2K</div>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', current: 8200, optimized: 7500 },
                        { month: 'Feb', current: 8500, optimized: 7600 },
                        { month: 'Mar', current: 8800, optimized: 7400 },
                        { month: 'Apr', current: 9100, optimized: 7200 },
                        { month: 'May', current: 8900, optimized: 6900 },
                        { month: 'Jun', current: 9200, optimized: 6800 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="currentCostGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="optimizedCostGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="dark:stroke-slate-700 stroke-slate-300" />
                      <XAxis dataKey="month" stroke="#94a3b8" className="dark:stroke-slate-400 stroke-slate-600" />
                      <YAxis stroke="#94a3b8" className="dark:stroke-slate-400 stroke-slate-600" tickFormatter={(value) => `$${value/1000}K`} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#0f172a'
                        }}
                        className="dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 dark:text-white text-slate-900"
                        formatter={(value) => [`$${value}`, '']}
                      />
                      <Area
                        type="monotone"
                        dataKey="current"
                        stroke="#ef4444"
                        fill="url(#currentCostGradient)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="optimized"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-slate-700 dark:text-slate-300">Current Costs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-slate-700 dark:text-slate-300">Optimized</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Trends */}
            <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <Activity className="mr-2 w-5 h-5 text-blue-500" />
                  Response Time Trends
                </CardTitle>
                <div className="text-lg font-bold text-blue-500">125ms avg</div>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { time: '00:00', response: 150, target: 100 },
                        { time: '04:00', response: 120, target: 100 },
                        { time: '08:00', response: 180, target: 100 },
                        { time: '12:00', response: 95, target: 100 },
                        { time: '16:00', response: 110, target: 100 },
                        { time: '20:00', response: 85, target: 100 },
                        { time: '24:00', response: 125, target: 100 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                      <XAxis dataKey="time" stroke="#64748b" className="dark:stroke-slate-400" />
                      <YAxis stroke="#64748b" className="dark:stroke-slate-400" tickFormatter={(value) => `${value}ms`} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#0f172a'
                        }}
                        formatter={(value) => [`${value}ms`, '']}
                      />
                      <Area
                        type="monotone"
                        dataKey="response"
                        stroke="#3b82f6"
                        fill="url(#responseTimeGradient)"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    { label: 'Current', value: '125ms', color: 'bg-blue-500', trend: '↓ 15ms' },
                    { label: 'Target', value: '100ms', color: 'bg-green-500', trend: 'Goal' },
                    { label: 'Peak', value: '180ms', color: 'bg-orange-500', trend: '↑ 12%' },
                    { label: 'Best', value: '85ms', color: 'bg-emerald-500', trend: '✓ Low' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Infrastructure Map - Full Width */}
          <Card className="bg-slate-900/50 dark:bg-slate-900/50 bg-white/50 border-slate-800 dark:border-slate-800 border-slate-200 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white dark:text-white text-slate-900 flex items-center">
                    <Globe className="mr-2 w-6 h-6 text-purple-400" />
                    Global Infrastructure Distribution
                  </CardTitle>
                  <div className="text-2xl font-bold text-purple-400 mt-1">18.6K</div>
                  <span className="text-sm text-slate-400">Active resources across 5 regions</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Last updated</div>
                  <div className="text-white font-medium">2 minutes ago</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 relative overflow-hidden bg-gradient-to-br from-slate-800/20 to-slate-900/40 rounded-xl">
                {/* Professional World Map */}
                <svg className="w-full h-full" viewBox="0 0 800 400" style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))' }}>
                  <defs>
                    <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0.6}/>
                    </radialGradient>
                    <pattern id="continentDots" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                      <circle cx="1.5" cy="1.5" r="0.4" fill="#475569" opacity="0.6"/>
                    </pattern>
                  </defs>
                  
                  {/* Ocean Background */}
                  <rect width="100%" height="100%" fill="url(#oceanGradient)"/>
                  
                  {/* North America - Realistic Shape */}
                  <path d="M80 120 L90 100 L110 95 L130 100 L150 90 L170 95 L190 100 Q200 105 210 115 L220 125 Q230 140 235 155 L240 170 Q245 185 240 200 L235 215 Q225 225 210 230 L190 235 Q170 240 150 235 L130 230 Q110 225 95 215 L85 200 Q75 185 78 170 L80 155 Q82 140 80 120 Z M100 130 Q120 125 140 130 L160 135 Q180 140 190 155 L185 170 Q175 180 160 175 L140 170 Q120 165 105 155 L100 145 Q98 137 100 130 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Greenland */}
                  <path d="M180 70 Q190 65 200 70 L210 75 Q215 85 210 95 L200 100 Q190 105 180 100 L170 95 Q165 85 170 75 L180 70 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* South America - Distinctive Shape */}
                  <path d="M180 250 Q190 245 200 250 L210 255 Q220 265 225 280 L230 300 Q235 320 230 340 L225 360 Q220 375 210 385 L200 390 Q185 395 175 390 L165 385 Q155 375 152 360 L150 340 Q148 320 152 300 L155 280 Q160 265 170 255 L180 250 Z M195 270 Q205 275 210 285 L215 300 Q220 315 215 330 L210 345 Q200 355 190 350 L180 345 Q170 335 175 320 L180 305 Q185 290 195 270 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Europe - Detailed with Scandinavia */}
                  <path d="M380 90 Q390 85 400 90 L410 95 Q420 100 425 110 L430 120 Q435 135 430 145 L425 155 Q415 165 405 160 L395 155 Q385 150 382 140 L380 125 Q378 110 380 90 Z M395 75 Q405 70 415 75 L425 80 Q430 90 425 100 L420 105 Q410 110 400 105 L395 100 Q390 90 395 75 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Africa - Realistic African Shape */}
                  <path d="M370 170 Q385 165 400 170 L415 175 Q430 185 435 200 L440 220 Q445 245 440 270 L435 295 Q430 315 425 330 L420 345 Q410 360 395 365 L380 370 Q365 375 355 370 L345 365 Q335 355 332 340 L330 320 Q328 300 332 280 L335 260 Q340 240 350 220 L355 200 Q360 185 370 170 Z M380 190 Q395 195 405 205 L415 220 Q420 240 415 260 L410 280 Q400 295 385 290 L370 285 Q360 275 365 255 L370 235 Q375 215 380 190 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* Asia - Large Realistic Continent */}
                  <path d="M450 80 Q480 75 510 80 L540 85 Q570 90 600 95 L630 100 Q660 105 685 115 L700 125 Q715 140 710 155 L705 170 Q695 180 680 185 L650 190 Q620 195 590 190 L560 185 Q530 180 505 175 L480 170 Q460 165 450 150 L448 135 Q446 120 450 105 L452 90 Q451 85 450 80 Z M500 100 Q530 105 560 110 L590 115 Q620 120 645 130 L665 140 Q680 155 675 170 L670 180 Q655 185 630 180 L600 175 Q570 170 540 165 L510 160 Q485 155 475 140 L473 125 Q475 110 485 105 L500 100 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* India Subcontinent */}
                  <path d="M520 190 Q535 185 545 195 L555 205 Q560 220 555 235 L550 245 Q540 255 525 250 L515 245 Q505 235 510 220 L515 205 Q520 190 520 190 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* Japan Islands */}
                  <path d="M650 150 Q655 145 660 150 L665 155 Q670 165 665 175 L660 180 Q655 185 650 180 L645 175 Q640 165 645 155 L650 150 Z M655 140 Q660 135 665 140 L670 145 Q675 155 670 165 L665 170 Q660 175 655 170 L650 165 Q645 155 650 145 L655 140 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* Australia - Realistic Shape */}
                  <path d="M580 290 Q600 285 620 290 L640 295 Q655 305 660 320 L665 335 Q670 350 665 365 L660 375 Q645 385 625 380 L605 375 Q585 370 570 365 L560 355 Q550 340 555 325 L560 310 Q565 300 580 290 Z M595 305 Q615 310 630 320 L640 335 Q645 350 640 360 L630 370 Q615 375 600 370 L585 365 Q575 355 580 340 L585 325 Q590 315 595 305 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.7"/>
                  
                  {/* New Zealand */}
                  <path d="M680 340 Q685 335 690 340 L695 345 Q700 355 695 365 L690 370 Q685 375 680 370 L675 365 Q670 355 675 345 L680 340 Z M685 375 Q690 370 695 375 L700 380 Q705 390 700 400 L695 405 Q690 410 685 405 L680 400 Q675 390 680 380 L685 375 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* UK and Ireland */}
                  <path d="M355 110 Q360 105 365 110 L370 115 Q375 125 370 135 L365 140 Q360 145 355 140 L350 135 Q345 125 350 115 L355 110 Z M340 115 Q345 110 350 115 L355 120 Q360 130 355 140 L350 145 Q345 150 340 145 L335 140 Q330 130 335 120 L340 115 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* Madagascar */}
                  <path d="M450 320 Q455 315 460 320 L465 325 Q470 335 465 345 L460 355 Q455 365 450 360 L445 355 Q440 345 445 335 L450 320 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="0.8" opacity="0.6"/>
                  
                  {/* Cloud Region Markers with Glow Effect */}
                  
                  {/* US East (N. Virginia) */}
                  <g>
                    <circle cx="185" cy="160" r="8" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="185" cy="160" r="5" fill="#8b5cf6" opacity="0.9"/>
                    <text x="185" y="135" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">us-east-1</text>
                    <text x="185" y="148" textAnchor="middle" fill="#8b5cf6" fontSize="14" fontWeight="bold">5.2K</text>
                  </g>
                  
                  {/* US West (Oregon) */}
                  <g>
                    <circle cx="125" cy="155" r="8" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="125" cy="155" r="5" fill="#06b6d4" opacity="0.9"/>
                    <text x="125" y="130" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">us-west-2</text>
                    <text x="125" y="143" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">3.1K</text>
                  </g>
                  
                  {/* Europe (Ireland) */}
                  <g>
                    <circle cx="355" cy="125" r="8" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="355" cy="125" r="5" fill="#10b981" opacity="0.9"/>
                    <text x="355" y="100" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">eu-west-1</text>
                    <text x="355" y="113" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold">4.8K</text>
                  </g>
                  
                  {/* Asia Pacific (Tokyo) */}
                  <g>
                    <circle cx="660" cy="160" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="2.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="660" cy="160" r="5" fill="#f59e0b" opacity="0.9"/>
                    <text x="660" y="135" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">ap-northeast-1</text>
                    <text x="660" y="148" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold">2.9K</text>
                  </g>
                  
                  {/* Asia Pacific (Sydney) */}
                  <g>
                    <circle cx="620" cy="340" r="8" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="2.8s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="620" cy="340" r="5" fill="#8b5cf6" opacity="0.9"/>
                    <text x="620" y="315" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">ap-southeast-2</text>
                    <text x="620" y="328" textAnchor="middle" fill="#8b5cf6" fontSize="14" fontWeight="bold">2.6K</text>
                  </g>
                  
                  {/* Europe Central (Frankfurt) */}
                  <g>
                    <circle cx="410" cy="130" r="8" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="2.7s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.7s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="410" cy="130" r="5" fill="#ec4899" opacity="0.9"/>
                    <text x="410" y="105" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">eu-central-1</text>
                    <text x="410" y="118" textAnchor="middle" fill="#ec4899" fontSize="14" fontWeight="bold">3.7K</text>
                  </g>
                  
                  {/* South America (São Paulo) */}
                  <g>
                    <circle cx="205" cy="320" r="8" fill="none" stroke="#14b8a6" strokeWidth="2" opacity="0.5">
                      <animate attributeName="r" values="8;12;8" dur="3.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="205" cy="320" r="5" fill="#14b8a6" opacity="0.9"/>
                    <text x="205" y="295" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">sa-east-1</text>
                    <text x="205" y="308" textAnchor="middle" fill="#14b8a6" fontSize="14" fontWeight="bold">1.4K</text>
                  </g>
                </svg>
              </div>
              
              {/* Enhanced Region Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                {[
                  { region: 'North America', count: '8.3K', percentage: '45%', color: 'from-purple-500 to-pink-500', icon: '🇺🇸' },
                  { region: 'Europe', count: '4.8K', percentage: '26%', color: 'from-emerald-500 to-teal-500', icon: '🇪🇺' },
                  { region: 'Asia Pacific', count: '5.5K', percentage: '29%', color: 'from-orange-500 to-red-500', icon: '🌏' },
                  { region: 'Total Regions', count: '5', percentage: '100%', color: 'from-blue-500 to-cyan-500', icon: '🌍' },
                  { region: 'Latency Avg', count: '45ms', percentage: 'Global', color: 'from-violet-500 to-purple-500', icon: '⚡' }
                ].map((item, index) => (
                  <div key={index} className="text-center bg-slate-800/30 rounded-lg p-4">
                    <div className={`w-full h-2 bg-gradient-to-r ${item.color} rounded-full mb-3`}></div>
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs text-slate-400 mb-1">{item.region}</div>
                    <div className="text-lg font-bold text-white">{item.count}</div>
                    <div className="text-xs text-purple-400">{item.percentage}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders Status Table */}
          <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Analysis Results</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600">
                    Jan 2024 ↗
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                    Create order
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-600 dark:text-slate-400">Order</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">Client</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">Country</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400">Total</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-400"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Analysis Issues as Table Rows */}
                  {analysisData?.issues?.slice(0, 6).map((issue: any, index: number) => (
                    <TableRow key={index} className="border-slate-800">
                      <TableCell>
                        <div className="w-3 h-3 rounded-full bg-purple-500 inline-block mr-2"></div>
                        <span className="text-white font-medium">#IS{String(index + 1).padStart(3, '0')}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-white font-medium">
                            {issue.category === 'security' ? 'Security Analyst' :
                             issue.category === 'cost' ? 'Cost Optimizer' :
                             issue.category === 'performance' ? 'Performance Team' : 'Cloud Architect'}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {issue.category === 'security' ? 'security@stackstage.com' :
                             issue.category === 'cost' ? 'costs@stackstage.com' :
                             issue.category === 'performance' ? 'perf@stackstage.com' : 'architect@stackstage.com'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            issue.severity === 'critical' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                            issue.severity === 'high' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                            issue.severity === 'medium' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                            'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                          }
                        >
                          {issue.severity === 'critical' ? '⚠ Critical' :
                           issue.severity === 'high' ? '🔶 High' :
                           issue.severity === 'medium' ? '🟡 Medium' : '✅ Resolved'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {['United States', 'United Kingdom', 'Australia', 'India', 'Canada'][index % 5]}
                      </TableCell>
                      <TableCell className="text-white font-semibold">
                        ${(Math.random() * 5000 + 1000).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          <Wrench className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) || []}
                  
                  {/* Fallback rows if no issues */}
                  {(!analysisData?.issues || analysisData.issues.length === 0) && [1,2,3,4,5].map((_, index) => (
                    <TableRow key={index} className="border-slate-800">
                      <TableCell>
                        <div className="w-3 h-3 rounded-full bg-purple-500 inline-block mr-2"></div>
                        <span className="text-white font-medium">#IS{String(index + 1).padStart(3, '0')}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-white font-medium">Cloud Architect</div>
                          <div className="text-slate-400 text-sm">architect@stackstage.com</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10">
                          ✅ Optimized
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">United States</TableCell>
                      <TableCell className="text-white font-semibold">
                        ${(Math.random() * 3000 + 1500).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          <Wrench className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link to="/fixes">
                <Wrench className="mr-2 w-4 h-4" />
                View All Fixes
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Link to={`/diagram?id=${analysisId}`}>
                <Eye className="mr-2 w-4 h-4" />
                Architecture Diagram
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;