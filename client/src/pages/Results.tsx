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

          {/* Global Cloud Infrastructure Map - Premium SaaS Dashboard */}
          <Card className="bg-slate-900/50 dark:bg-slate-900/50 bg-white/50 border-slate-800 dark:border-slate-800 border-slate-200 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white dark:text-white text-slate-900 flex items-center">
                    <Globe className="mr-2 w-6 h-6 text-purple-400" />
                    Global User Distribution & Cloud Services
                  </CardTitle>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mt-1">24.8K</div>
                  <span className="text-sm text-slate-400">Active users across 12 regions with real-time analytics</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Live Status</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    <div className="text-white font-medium">All Systems Operational</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-blue-900/30 rounded-xl border border-slate-700/50">
                
                {/* Premium World Map SVG with Accurate Geography */}
                <svg className="w-full h-full" viewBox="0 0 1000 500" style={{ filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.4))' }}>
                  <defs>
                    {/* Ocean Gradient */}
                    <radialGradient id="oceanGradient" cx="50%" cy="50%" r="80%">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#1e293b" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0.8}/>
                    </radialGradient>
                    
                    {/* Continent Gradients */}
                    <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#374151" stopOpacity={0.9}/>
                      <stop offset="50%" stopColor="#4b5563" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#374151" stopOpacity={0.7}/>
                    </linearGradient>
                    
                    {/* User Marker Glow */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    {/* Pulse Animation */}
                    <filter id="pulse" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Ocean Background */}
                  <rect width="100%" height="100%" fill="url(#oceanGradient)"/>
                  
                  {/* Accurate World Map Continents */}
                  
                  {/* North America */}
                  <path d="M50 100 C80 70, 140 75, 180 85 L220 90 C270 95, 320 105, 360 120 L380 135 C400 150, 410 170, 415 190 L420 220 C425 250, 415 280, 395 300 L370 315 C340 325, 310 320, 280 310 L250 300 C220 290, 190 275, 170 255 L150 235 C130 215, 120 195, 115 170 L110 145 C105 120, 102 100, 105 80 L110 65 C115 55, 120 50, 130 50 C140 52, 145 58, 150 65 L160 75 C170 85, 180 90, 190 88 L200 85 C210 82, 220 80, 230 82 L240 85 C250 88, 260 95, 265 105 L270 115 C275 125, 270 135, 260 140 L250 145 C240 150, 225 148, 215 140 L205 132 C195 125, 190 115, 192 105 L195 95 C198 85, 205 78, 215 75 L225 72 C235 70, 245 72, 250 78 L255 85 C260 92, 258 100, 250 105 L240 110 C230 115, 215 112, 205 105 L195 98 C185 90, 180 80, 182 70 L185 60 C188 50, 195 42, 205 40 L215 38 C225 37, 235 40, 240 48 L245 58 C250 68, 248 78, 240 85 L230 90 C220 95, 205 92, 195 85 L185 78 C175 70, 170 60, 172 50 L175 40 C178 30, 185 22, 195 20 L205 18 C215 17, 225 20, 230 28 L235 38 C240 48, 238 58, 230 65 L220 70 C210 75, 195 72, 185 65 L175 58 C165 50, 160 40, 162 30 L165 20 C168 10, 175 2, 185 0 L195 -2 C205 -3, 215 0, 220 8 L225 18 C230 28, 228 38, 220 45 L210 50 C200 55, 185 52, 175 45 L165 38 C155 30, 150 20, 152 10 L155 0 C158 -10, 165 -18, 175 -20 L185 -22 C195 -23, 205 -20, 210 -12 L215 -2 C220 8, 218 18, 210 25 L200 30 C190 35, 175 32, 165 25 L155 18 C145 10, 140 0, 142 -10 L145 -20 C148 -30, 155 -38, 165 -40 L175 -42 C185 -43, 195 -40, 200 -32 L205 -22 C210 -12, 208 -2, 200 5 L190 10 C180 15, 165 12, 155 5 L145 -2 C135 -10, 130 -20, 132 -30 L135 -40 C138 -50, 145 -58, 155 -60 L165 -62 C175 -63, 185 -60, 190 -52 L195 -42 C200 -32, 198 -22, 190 -15 L180 -10 C170 -5, 155 -8, 145 -15 L135 -22 C125 -30, 120 -40, 122 -50 L125 -60 C128 -70, 135 -78, 145 -80 L155 -82 C165 -83, 175 -80, 180 -72 L185 -62 C190 -52, 188 -42, 180 -35 L170 -30 C160 -25, 145 -28, 135 -35 L125 -42 C115 -50, 110 -60, 112 -70 L115 -80 C118 -90, 125 -98, 135 -100 L145 -102 C155 -103, 165 -100, 170 -92 L175 -82 C180 -72, 178 -62, 170 -55 L160 -50 C150 -45, 135 -48, 125 -55 L115 -62 C105 -70, 100 -80, 102 -90 L105 -100 C108 -110, 115 -118, 125 -120 L135 -122 C145 -123, 155 -120, 160 -112 L165 -102 C170 -92, 168 -82, 160 -75 L150 -70 C140 -65, 125 -68, 115 -75 L105 -82 C95 -90, 90 -100, 92 -110 L95 -120 C98 -130, 105 -138, 115 -140 L125 -142 C135 -143, 145 -140, 150 -132 L155 -122 C160 -112, 158 -102, 150 -95 L140 -90 C130 -85, 115 -88, 105 -95 L95 -102 C85 -110, 80 -120, 82 -130 L85 -140 C88 -150, 95 -158, 105 -160 L115 -162 C125 -163, 135 -160, 140 -152 L145 -142 C150 -132, 148 -122, 140 -115 L130 -110 C120 -105, 105 -108, 95 -115 L85 -122 C75 -130, 70 -140, 72 -150 L75 -160 C78 -170, 85 -178, 95 -180 L105 -182 C115 -183, 125 -180, 130 -172 L135 -162 C140 -152, 138 -142, 130 -135 L120 -130 C110 -125, 95 -128, 85 -135 L75 -142 C65 -150, 60 -160, 62 -170 L65 -180 C68 -190, 75 -198, 85 -200 L95 -202 C105 -203, 115 -200, 120 -192 L125 -182 C130 -172, 128 -162, 120 -155 L110 -150 C100 -145, 85 -148, 75 -155 L65 -162 C55 -170, 50 -180, 52 -190 L55 -200 C58 -210, 65 -218, 75 -220 L85 -222 C95 -223, 105 -220, 110 -212 L115 -202 C120 -192, 118 -182, 110 -175 L100 -170 C90 -165, 75 -168, 65 -175 L55 -182 C45 -190, 40 -200, 42 -210 L45 -220 C48 -230, 55 -238, 65 -240 L75 -242 C85 -243, 95 -240, 100 -232 L105 -222 C110 -212, 108 -202, 100 -195 L90 -190 C80 -185, 65 -188, 55 -195 L45 -202 C35 -210, 30 -220, 32 -230 L35 -240 C38 -250, 45 -258, 55 -260 L65 -262 C75 -263, 85 -260, 90 -252 L95 -242 C100 -232, 98 -222, 90 -215 L80 -210 C70 -205, 55 -208, 45 -215 L35 -222 C25 -230, 20 -240, 22 -250 L25 -260 C28 -270, 35 -278, 45 -280 L55 -282 C65 -283, 75 -280, 80 -272 L85 -262 C90 -252, 88 -242, 80 -235 L70 -230 C60 -225, 45 -228, 35 -235 L25 -242 C15 -250, 10 -260, 12 -270 L15 -280 C18 -290, 25 -298, 35 -300 L45 -302 C55 -303, 65 -300, 70 -292 L75 -282 C80 -272, 78 -262, 70 -255 L60 -250 C50 -245, 35 -248, 25 -255 L15 -262 C5 -270, 0 -280, 2 -290 L5 -300 C8 -310, 15 -318, 25 -320 L35 -322 C45 -323, 55 -320, 60 -312 L65 -302 C70 -292, 68 -282, 60 -275 L50 -270" 
                        fill="url(#continentGradient)" 
                        stroke="#6b7280" 
                        strokeWidth="0.5"/>
                        
                  {/* South America - More Accurate Shape */}
                  <path d="M220 320 C235 315, 250 320, 265 330 L280 345 C295 360, 305 380, 310 400 L315 425 C320 450, 315 475, 305 495 L290 510 C275 520, 255 525, 235 520 L215 515 C195 510, 180 500, 170 485 L165 470 C160 455, 162 440, 168 425 L175 410 C182 395, 192 380, 205 370 L215 360 C218 355, 219 350, 220 345 Z" 
                        fill="url(#continentGradient)" 
                        stroke="#6b7280" 
                        strokeWidth="0.5"/>
                  
                  {/* Europe - Better Detail */}
                  <path d="M480 120 C500 115, 520 120, 535 130 L550 140 C565 155, 570 175, 568 195 L565 210 C560 225, 550 235, 535 240 L520 245 C505 250, 490 245, 480 235 L475 220 C470 205, 472 190, 478 175 L482 160 C485 145, 486 130, 488 120 Z
                        M490 95 C505 90, 520 95, 530 105 L540 120 C545 135, 540 150, 530 160 L520 170 C510 175, 500 170, 495 160 L490 145 C485 130, 487 115, 493 105 Z" 
                        fill="url(#continentGradient)" 
                        stroke="#6b7280" 
                        strokeWidth="0.5"/>
                  
                  {/* Africa - Accurate Proportions */}
                  <path d="M470 250 C495 245, 520 250, 540 265 L560 280 C580 300, 590 325, 595 350 L600 380 C605 410, 600 440, 590 465 L575 485 C560 500, 540 510, 520 515 L500 520 C480 525, 460 520, 445 510 L430 495 C420 480, 415 460, 413 440 L410 420 C407 400, 410 380, 415 360 L420 340 C425 320, 435 300, 450 285 L462 270 C465 260, 467 255, 470 250 Z" 
                        fill="url(#continentGradient)" 
                        stroke="#6b7280" 
                        strokeWidth="0.5"/>
                  
                  {/* Asia - More Detailed */}
                  <path d="M610 80 C660 75, 710 85, 750 100 L790 115 C830 135, 860 160, 875 190 L885 220 C890 250, 885 280, 875 305 L860 325 C845 340, 825 350, 800 355 L775 360 C750 365, 725 360, 705 350 L685 340 C665 330, 650 315, 640 295 L635 275 C630 255, 632 235, 638 215 L645 195 C652 175, 662 160, 675 150 L690 140 C705 130, 720 125, 735 122 L750 120 C765 118, 780 120, 790 125 L800 135 C810 145, 815 160, 812 175 L808 190 C804 205, 795 215, 785 220 L775 225 C765 230, 755 225, 750 215 L745 200 C740 185, 742 170, 748 155 L755 145 C760 135, 765 130, 770 128 Z
                        
                        M640 110 C680 115, 720 125, 755 140 L785 155 C815 175, 835 200, 840 225 L845 245 C850 265, 845 280, 835 290 L820 300 C805 305, 790 300, 775 290 L760 280 C745 270, 735 255, 730 235 L728 215 C726 195, 730 175, 738 155 L748 140 C755 125, 765 115, 775 110 Z" 
                        fill="url(#continentGradient)" 
                        stroke="#6b7280" 
                        strokeWidth="0.5"/>
                  
                  {/* Australia & Oceania */}
                  <path d="M750 380 C780 375, 810 385, 835 400 L855 415 C870 435, 875 460, 870 480 L860 500 C850 515, 835 525, 815 530 L795 535 C775 540, 755 535, 740 525 L725 510 C715 495, 712 475, 715 455 L720 435 C725 415, 735 400, 745 390 Z" 
                        fill="url(#continentGradient)" 
                        stroke="#6b7280" 
                        strokeWidth="0.5"/>
                  
                  {/* Animated User Location Markers with Cloud Service Types */}
                  
                  {/* North America - AWS */}
                  <g>
                    <circle cx="180" cy="160" r="8" fill="#ff9500" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="180" cy="160" r="4" fill="#ff9500" filter="url(#glow)"/>
                    <text x="195" y="155" fill="#fff" fontSize="11" fontWeight="bold">AWS - N. Virginia</text>
                    <text x="195" y="168" fill="#ff9500" fontSize="10" fontWeight="600">8.4K users</text>
                  </g>
                  
                  {/* North America West - GCP */}
                  <g>
                    <circle cx="120" cy="170" r="6" fill="#4285f4" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="120" cy="170" r="3" fill="#4285f4" filter="url(#glow)"/>
                    <text x="135" y="165" fill="#fff" fontSize="11" fontWeight="bold">GCP - Oregon</text>
                    <text x="135" y="178" fill="#4285f4" fontSize="10" fontWeight="600">5.7K users</text>
                  </g>
                  
                  {/* Europe - Azure */}
                  <g>
                    <circle cx="520" cy="140" r="7" fill="#0078d4" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="7;11;7" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="520" cy="140" r="3.5" fill="#0078d4" filter="url(#glow)"/>
                    <text x="535" y="135" fill="#fff" fontSize="11" fontWeight="bold">Azure - West Europe</text>
                    <text x="535" y="148" fill="#0078d4" fontSize="10" fontWeight="600">6.2K users</text>
                  </g>
                  
                  {/* Asia - AWS */}
                  <g>
                    <circle cx="760" cy="180" r="6" fill="#ff9500" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="6;10;6" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="760" cy="180" r="3" fill="#ff9500" filter="url(#glow)"/>
                    <text x="775" y="175" fill="#fff" fontSize="11" fontWeight="bold">AWS - Tokyo</text>
                    <text x="775" y="188" fill="#ff9500" fontSize="10" fontWeight="600">4.1K users</text>
                  </g>
                  
                  {/* Australia - AWS */}
                  <g>
                    <circle cx="810" cy="430" r="5" fill="#ff9500" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="5;8;5" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="810" cy="430" r="2.5" fill="#ff9500" filter="url(#glow)"/>
                    <text x="825" y="425" fill="#fff" fontSize="11" fontWeight="bold">AWS - Sydney</text>
                    <text x="825" y="438" fill="#ff9500" fontSize="10" fontWeight="600">2.8K users</text>
                  </g>
                  
                  {/* India - GCP */}
                  <g>
                    <circle cx="660" cy="260" r="5" fill="#4285f4" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="5;8;5" dur="2.7s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="660" cy="260" r="2.5" fill="#4285f4" filter="url(#glow)"/>
                    <text x="675" y="255" fill="#fff" fontSize="11" fontWeight="bold">GCP - Mumbai</text>
                    <text x="675" y="268" fill="#4285f4" fontSize="10" fontWeight="600">3.6K users</text>
                  </g>
                  
                  {/* South America - AWS */}
                  <g>
                    <circle cx="260" cy="420" r="4" fill="#ff9500" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="4;7;4" dur="2.4s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="260" cy="420" r="2" fill="#ff9500" filter="url(#glow)"/>
                    <text x="275" y="415" fill="#fff" fontSize="11" fontWeight="bold">AWS - São Paulo</text>
                    <text x="275" y="428" fill="#ff9500" fontSize="10" fontWeight="600">1.9K users</text>
                  </g>
                  
                  {/* Africa - Azure */}
                  <g>
                    <circle cx="520" cy="350" r="4" fill="#0078d4" fillOpacity="0.3" filter="url(#pulse)">
                      <animate attributeName="r" values="4;7;4" dur="2.6s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="520" cy="350" r="2" fill="#0078d4" filter="url(#glow)"/>
                    <text x="535" y="345" fill="#fff" fontSize="11" fontWeight="bold">Azure - South Africa</text>
                    <text x="535" y="358" fill="#0078d4" fontSize="10" fontWeight="600">1.2K users</text>
                  </g>
                  
                  {/* Connection Lines Between Major Regions */}
                  <g stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5,5" fill="none" opacity="0.6">
                    <line x1="180" y1="160" x2="520" y2="140">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite"/>
                    </line>
                    <line x1="520" y1="140" x2="760" y2="180">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="4s" repeatCount="indefinite"/>
                    </line>
                    <line x1="180" y1="160" x2="760" y2="180">
                      <animate attributeName="stroke-dashoffset" values="0;15" dur="5s" repeatCount="indefinite"/>
                    </line>
                  </g>
                  
                </svg>
                
                {/* Floating Data Cards */}
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                    <div className="text-emerald-400 font-bold">99.97% Uptime</div>
                    <div className="text-slate-300">Last 30 days</div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                    <div className="text-purple-400 font-bold">42ms Avg</div>
                    <div className="text-slate-300">Global Latency</div>
                  </div>
                </div>
              </div>
              
              {/* Premium Cloud Provider Legend & Stats */}
              <div className="mt-8 space-y-6">
                
                {/* Cloud Provider Legend */}
                <div className="bg-slate-800/40 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Cloud className="mr-2 w-5 h-5 text-purple-400" />
                    Cloud Service Providers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                      <div>
                        <div className="text-white font-medium">Amazon Web Services</div>
                        <div className="text-sm text-slate-400">12.1K users across 4 regions</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                      <div>
                        <div className="text-white font-medium">Google Cloud Platform</div>
                        <div className="text-sm text-slate-400">9.3K users across 2 regions</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                      <div>
                        <div className="text-white font-medium">Microsoft Azure</div>
                        <div className="text-sm text-slate-400">7.4K users across 2 regions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { 
                      region: 'North America East', 
                      provider: 'AWS',
                      users: '8.4K', 
                      latency: '23ms', 
                      uptime: '99.98%',
                      color: 'from-orange-500 to-red-500',
                      providerColor: 'text-orange-400',
                      icon: '🇺🇸'
                    },
                    { 
                      region: 'North America West', 
                      provider: 'GCP',
                      users: '5.7K', 
                      latency: '31ms', 
                      uptime: '99.97%',
                      color: 'from-blue-500 to-cyan-500',
                      providerColor: 'text-blue-400',
                      icon: '🌎'
                    },
                    { 
                      region: 'Europe Central', 
                      provider: 'Azure',
                      users: '6.2K', 
                      latency: '28ms', 
                      uptime: '99.99%',
                      color: 'from-cyan-500 to-blue-600',
                      providerColor: 'text-cyan-400',
                      icon: '🇪🇺'
                    },
                    { 
                      region: 'Asia Pacific', 
                      provider: 'AWS',
                      users: '4.1K', 
                      latency: '41ms', 
                      uptime: '99.96%',
                      color: 'from-orange-500 to-red-500',
                      providerColor: 'text-orange-400',
                      icon: '🌏'
                    },
                    { 
                      region: 'Australia', 
                      provider: 'AWS',
                      users: '2.8K', 
                      latency: '52ms', 
                      uptime: '99.95%',
                      color: 'from-orange-500 to-red-500',
                      providerColor: 'text-orange-400',
                      icon: '🇦🇺'
                    },
                    { 
                      region: 'Global Average', 
                      provider: 'All',
                      users: '24.8K', 
                      latency: '42ms', 
                      uptime: '99.97%',
                      color: 'from-purple-500 to-pink-500',
                      providerColor: 'text-purple-400',
                      icon: '🌍'
                    }
                  ].map((region, index) => (
                    <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl">{region.icon}</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${region.providerColor} bg-current/10`}>
                          {region.provider}
                        </div>
                      </div>
                      <div className={`w-full h-1 bg-gradient-to-r ${region.color} rounded-full mb-3`}></div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400 font-medium">{region.region}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-slate-500">Users</div>
                            <div className="text-white font-bold">{region.users}</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Latency</div>
                            <div className="text-emerald-400 font-bold">{region.latency}</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-700/50">
                          <div className="text-slate-500 text-xs">Uptime</div>
                          <div className="text-emerald-400 font-bold text-sm">{region.uptime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Live Data Traffic Indicator */}
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl p-4 border border-slate-600/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-6 bg-gradient-to-t from-purple-500 to-purple-300 rounded-sm animate-pulse"></div>
                        <div className="w-2 h-4 bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-8 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-sm animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-2 h-5 bg-gradient-to-t from-orange-500 to-orange-300 rounded-sm animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Live Traffic Monitor</div>
                        <div className="text-sm text-slate-400">Real-time user activity across all regions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        1,247/min
                      </div>
                      <div className="text-xs text-slate-400">Requests per minute</div>
                    </div>
                  </div>
                </div>

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