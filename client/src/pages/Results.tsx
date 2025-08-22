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
                  
                  {/* NORTH AMERICA - Large, Detailed Realistic Shape */}
                  <path d="M50 60 L80 50 L120 55 L160 50 L200 60 L240 70 L280 80 Q300 90 320 110 L340 130 Q350 150 345 170 L340 190 Q330 210 315 230 L300 240 Q280 250 260 245 L240 240 Q220 235 200 230 L180 225 Q160 220 140 215 L120 210 Q100 200 85 185 L70 170 Q55 150 58 130 L60 110 Q65 90 50 60 Z
                        
                        M120 80 Q140 75 160 80 L180 85 Q200 90 220 100 L240 110 Q260 125 270 145 L275 165 Q280 185 275 200 L270 215 Q260 225 240 220 L220 215 Q200 210 180 205 L160 200 Q140 195 125 185 L115 170 Q110 150 115 135 L120 120 Q118 100 120 80 Z
                        
                        M90 90 Q110 85 130 90 L150 95 Q170 100 185 115 L195 130 Q200 145 195 160 L190 175 Q180 185 165 180 L150 175 Q135 170 125 160 L115 145 Q110 130 115 115 L90 100 Q88 95 90 90 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1.2" opacity="0.8"/>
                  
                  {/* SOUTH AMERICA - Large, Distinctive Shape */}
                  <path d="M200 260 Q220 250 240 260 L260 270 Q280 285 290 305 L300 330 Q310 355 305 380 L300 405 Q295 430 285 450 L275 470 Q265 485 250 490 L235 495 Q220 500 205 495 L190 490 Q175 485 165 470 L155 450 Q145 430 150 405 L155 380 Q160 355 170 330 L180 305 Q190 285 200 260 Z
                        
                        M230 290 Q250 295 265 310 L275 330 Q285 350 280 370 L275 390 Q265 405 250 400 L235 395 Q220 390 210 375 L205 355 Q200 335 210 315 L220 300 Q225 285 230 290 Z
                        
                        M210 320 Q225 325 235 340 L245 360 Q250 380 245 395 L235 405 Q225 415 210 410 L195 405 Q185 395 190 380 L195 360 Q200 340 210 320 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1.2" opacity="0.8"/>
                  
                  {/* EUROPE - Detailed with Scandinavia */}
                  <path d="M380 50 Q400 45 420 50 L440 55 Q460 60 475 70 L485 85 Q495 100 490 115 L485 130 Q475 145 460 150 L440 155 Q420 160 400 155 L380 150 Q365 145 360 130 L358 115 Q356 100 365 85 L375 70 Q380 55 380 50 Z
                        
                        M420 30 Q440 25 460 30 L475 35 Q485 45 480 60 L475 75 Q465 85 450 80 L435 75 Q425 65 430 50 L420 35 Q418 30 420 30 Z
                        
                        M400 75 Q420 70 435 75 L450 80 Q460 90 455 105 L450 120 Q440 130 425 125 L410 120 Q400 110 405 95 L400 80 Q398 75 400 75 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1.2" opacity="0.8"/>
                  
                  {/* AFRICA - Large, Realistic African Shape */}
                  <path d="M350 170 Q375 160 400 170 L425 180 Q450 195 460 220 L470 250 Q480 280 475 310 L470 340 Q465 370 455 395 L445 415 Q430 435 410 440 L390 445 Q370 450 350 445 L330 440 Q315 430 310 410 L305 385 Q300 360 305 335 L310 310 Q315 285 325 260 L335 235 Q345 210 350 185 L350 170 Z
                        
                        M380 200 Q405 205 425 220 L440 240 Q450 265 445 290 L440 315 Q430 335 415 340 L400 345 Q385 350 370 345 L355 340 Q345 330 350 315 L355 290 Q360 265 370 240 L380 220 Q378 210 380 200 Z
                        
                        M390 230 Q410 235 425 250 L435 270 Q440 290 435 305 L425 320 Q415 330 400 325 L385 320 Q375 310 380 295 L385 275 Q390 255 390 235 L390 230 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1.2" opacity="0.8"/>
                  
                  {/* ASIA - Massive Detailed Continent */}
                  <path d="M480 40 Q520 35 560 45 L600 55 Q640 65 680 75 L720 85 Q750 100 760 125 L770 150 Q775 175 770 200 L765 225 Q755 245 740 255 L720 265 Q700 275 680 270 L660 265 Q640 260 620 255 L600 250 Q580 245 560 240 L540 235 Q520 230 505 215 L490 200 Q480 180 485 160 L490 140 Q495 120 480 100 L478 80 Q476 60 480 40 Z
                        
                        M530 70 Q570 75 610 85 L650 95 Q690 105 720 120 L740 140 Q750 165 745 190 L740 210 Q725 225 700 220 L675 215 Q650 210 625 205 L600 200 Q575 195 555 185 L535 175 Q520 160 525 140 L530 120 Q528 95 530 70 Z
                        
                        M570 100 Q610 105 645 115 L675 125 Q700 140 705 165 L710 185 Q700 200 680 195 L660 190 Q640 185 620 180 L600 175 Q580 170 565 160 L555 145 Q550 125 560 110 L570 100 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1.2" opacity="0.8"/>
                  
                  {/* AUSTRALIA - Large, Realistic Shape */}
                  <path d="M550 300 Q590 295 630 305 L670 315 Q700 330 715 350 L725 375 Q730 400 725 420 L715 440 Q700 455 680 460 L660 465 Q640 470 620 465 L600 460 Q580 455 565 440 L555 420 Q545 400 550 380 L555 360 Q560 340 570 320 L550 300 Z
                        
                        M580 325 Q620 330 655 345 L685 360 Q705 380 710 400 L715 420 Q705 435 690 430 L670 425 Q650 420 630 415 L610 410 Q590 405 575 390 L570 370 Q565 350 575 335 L580 325 Z
                        
                        M600 350 Q630 355 655 370 L675 385 Q690 400 685 415 L675 425 Q660 430 645 425 L630 420 Q615 415 605 400 L600 385 Q595 370 600 355 L600 350 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1.2" opacity="0.8"/>
                  
                  {/* Additional Geographic Features */}
                  {/* Greenland */}
                  <path d="M280 30 Q300 25 320 30 L335 40 Q345 55 340 70 L330 80 Q315 90 300 85 L285 80 Q275 70 280 55 L280 40 Q278 30 280 30 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1" opacity="0.7"/>
                  
                  {/* UK and Ireland */}
                  <path d="M340 90 Q350 85 360 90 L370 95 Q380 105 375 120 L365 130 Q355 135 345 130 L335 125 Q330 115 335 100 L340 90 Z
                        M320 95 Q330 90 340 95 L350 100 Q360 110 355 125 L345 135 Q335 140 325 135 L315 130 Q310 120 315 105 L320 95 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1" opacity="0.7"/>
                  
                  {/* Japan */}
                  <path d="M710 130 Q720 125 730 130 L740 140 Q745 155 740 170 L730 180 Q720 185 710 180 L700 175 Q695 165 700 150 L710 130 Z
                        M715 110 Q725 105 735 110 L745 120 Q750 135 745 150 L735 160 Q725 165 715 160 L705 155 Q700 145 705 130 L715 110 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1" opacity="0.7"/>
                  
                  {/* New Zealand */}
                  <path d="M720 450 Q730 445 740 450 L750 460 Q755 475 750 490 L740 500 Q730 505 720 500 L710 495 Q705 485 710 470 L720 450 Z
                        M725 510 Q735 505 745 510 L755 520 Q760 535 755 550 L745 560 Q735 565 725 560 L715 555 Q710 545 715 530 L725 510 Z" 
                        fill="url(#continentDots)" stroke="#64748b" strokeWidth="1" opacity="0.7"/>
                  
                  {/* Cloud Region Markers with Glow Effect */}
                  
                  {/* US East (N. Virginia) */}
                  <g>
                    <circle cx="220" cy="140" r="10" fill="none" stroke="#8b5cf6" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="220" cy="140" r="6" fill="#8b5cf6" opacity="1"/>
                    <text x="220" y="115" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">us-east-1</text>
                    <text x="220" y="128" textAnchor="middle" fill="#8b5cf6" fontSize="16" fontWeight="bold">5.2K</text>
                  </g>
                  
                  {/* US West (Oregon) */}
                  <g>
                    <circle cx="140" cy="130" r="10" fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="140" cy="130" r="6" fill="#06b6d4" opacity="1"/>
                    <text x="140" y="105" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">us-west-2</text>
                    <text x="140" y="118" textAnchor="middle" fill="#06b6d4" fontSize="16" fontWeight="bold">3.1K</text>
                  </g>
                  
                  {/* Europe (Ireland) */}
                  <g>
                    <circle cx="340" cy="110" r="10" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="340" cy="110" r="6" fill="#10b981" opacity="1"/>
                    <text x="340" y="85" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">eu-west-1</text>
                    <text x="340" y="98" textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="bold">4.8K</text>
                  </g>
                  
                  {/* Asia Pacific (Tokyo) */}
                  <g>
                    <circle cx="720" cy="150" r="10" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="2.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="720" cy="150" r="6" fill="#f59e0b" opacity="1"/>
                    <text x="720" y="125" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">ap-northeast-1</text>
                    <text x="720" y="138" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">2.9K</text>
                  </g>
                  
                  {/* Asia Pacific (Sydney) */}
                  <g>
                    <circle cx="650" cy="390" r="10" fill="none" stroke="#8b5cf6" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="2.8s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="650" cy="390" r="6" fill="#8b5cf6" opacity="1"/>
                    <text x="650" y="365" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">ap-southeast-2</text>
                    <text x="650" y="378" textAnchor="middle" fill="#8b5cf6" fontSize="16" fontWeight="bold">2.6K</text>
                  </g>
                  
                  {/* Europe Central (Frankfurt) */}
                  <g>
                    <circle cx="430" cy="100" r="10" fill="none" stroke="#ec4899" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="2.7s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.7s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="430" cy="100" r="6" fill="#ec4899" opacity="1"/>
                    <text x="430" y="75" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">eu-central-1</text>
                    <text x="430" y="88" textAnchor="middle" fill="#ec4899" fontSize="16" fontWeight="bold">3.7K</text>
                  </g>
                  
                  {/* South America (São Paulo) */}
                  <g>
                    <circle cx="250" cy="380" r="10" fill="none" stroke="#14b8a6" strokeWidth="3" opacity="0.6">
                      <animate attributeName="r" values="10;16;10" dur="3.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="250" cy="380" r="6" fill="#14b8a6" opacity="1"/>
                    <text x="250" y="355" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">sa-east-1</text>
                    <text x="250" y="368" textAnchor="middle" fill="#14b8a6" fontSize="16" fontWeight="bold">1.4K</text>
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