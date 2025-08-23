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
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
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
          <Card className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Globe className="mr-2 w-6 h-6 text-purple-400" />
                    Global User Distribution & Cloud Services
                  </CardTitle>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mt-1">24.8K</div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Active users across 12 regions with real-time analytics</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Live Status</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    <div className="text-slate-900 dark:text-white font-medium">All Systems Operational</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] relative overflow-hidden bg-gradient-to-br from-slate-100/80 via-purple-100/20 to-blue-100/30 dark:from-slate-900/80 dark:via-purple-900/20 dark:to-blue-900/30 rounded-xl border border-slate-300/50 dark:border-slate-700/50">
                
                {/* Professional World Map using React Simple Maps */}
                <ComposableMap
                  projectionConfig={{
                    scale: 120,
                    center: [0, 20]
                  }}
                  width={800}
                  height={400}
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.4))' }}
                >
                  <defs>
                    <linearGradient id="geographyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.7"/>
                    </linearGradient>
                    <linearGradient id="geographyGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#374151" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="#4b5563" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#374151" stopOpacity="0.7"/>
                    </linearGradient>
                  </defs>
                  
                  <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas/countries-110m.json">
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="url(#geographyGradient)"
                          stroke="#6b7280"
                          strokeWidth={0.3}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#9ca3af" },
                            pressed: { outline: "none" },
                          }}
                          className="dark:fill-[url(#geographyGradientDark)] dark:hover:fill-[#4b5563]"
                        />
                      ))
                    }
                  </Geographies>

                  {/* Cloud Service Location Markers */}
                  
                  {/* North America East - AWS N. Virginia */}
                  <Marker coordinates={[-77.4, 39.0]}>
                    <g>
                      <circle r={8} fill="#ff9500" fillOpacity={0.3}>
                        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={4} fill="#ff9500" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[-60, 42]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      AWS - N. Virginia
                    </text>
                  </Marker>
                  <Marker coordinates={[-60, 36]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#ff9500">
                      8.4K users
                    </text>
                  </Marker>

                  {/* North America West - GCP Oregon */}
                  <Marker coordinates={[-123.0, 45.5]}>
                    <g>
                      <circle r={6} fill="#4285f4" fillOpacity={0.3}>
                        <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={3} fill="#4285f4" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[-105, 48]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      GCP - Oregon
                    </text>
                  </Marker>
                  <Marker coordinates={[-105, 42]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#4285f4">
                      5.7K users
                    </text>
                  </Marker>

                  {/* Europe - Azure West Europe (Netherlands) */}
                  <Marker coordinates={[4.9, 52.3]}>
                    <g>
                      <circle r={7} fill="#0078d4" fillOpacity={0.3}>
                        <animate attributeName="r" values="7;11;7" dur="3s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={3.5} fill="#0078d4" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[20, 58]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      Azure - West Europe
                    </text>
                  </Marker>
                  <Marker coordinates={[20, 52]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#0078d4">
                      6.2K users
                    </text>
                  </Marker>

                  {/* Asia Pacific - AWS Tokyo */}
                  <Marker coordinates={[139.7, 35.7]}>
                    <g>
                      <circle r={6} fill="#ff9500" fillOpacity={0.3}>
                        <animate attributeName="r" values="6;10;6" dur="1.8s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={3} fill="#ff9500" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[155, 40]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      AWS - Tokyo
                    </text>
                  </Marker>
                  <Marker coordinates={[155, 34]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#ff9500">
                      4.1K users
                    </text>
                  </Marker>

                  {/* Australia - AWS Sydney */}
                  <Marker coordinates={[151.2, -33.9]}>
                    <g>
                      <circle r={5} fill="#ff9500" fillOpacity={0.3}>
                        <animate attributeName="r" values="5;8;5" dur="2.2s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={2.5} fill="#ff9500" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[165, -30]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      AWS - Sydney
                    </text>
                  </Marker>
                  <Marker coordinates={[165, -36]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#ff9500">
                      2.8K users
                    </text>
                  </Marker>

                  {/* India - GCP Mumbai */}
                  <Marker coordinates={[72.8, 19.1]}>
                    <g>
                      <circle r={5} fill="#4285f4" fillOpacity={0.3}>
                        <animate attributeName="r" values="5;8;5" dur="2.7s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={2.5} fill="#4285f4" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[85, 25]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      GCP - Mumbai
                    </text>
                  </Marker>
                  <Marker coordinates={[85, 19]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#4285f4">
                      3.6K users
                    </text>
                  </Marker>

                  {/* South America - AWS São Paulo */}
                  <Marker coordinates={[-46.6, -23.5]}>
                    <g>
                      <circle r={4} fill="#ff9500" fillOpacity={0.3}>
                        <animate attributeName="r" values="4;7;4" dur="2.4s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={2} fill="#ff9500" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[-25, -20]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      AWS - São Paulo
                    </text>
                  </Marker>
                  <Marker coordinates={[-25, -26]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#ff9500">
                      1.9K users
                    </text>
                  </Marker>

                  {/* Africa - Azure South Africa */}
                  <Marker coordinates={[28.0, -26.2]}>
                    <g>
                      <circle r={4} fill="#0078d4" fillOpacity={0.3}>
                        <animate attributeName="r" values="4;7;4" dur="2.6s" repeatCount="indefinite"/>
                      </circle>
                      <circle r={2} fill="#0078d4" opacity={0.9}/>
                    </g>
                  </Marker>
                  <Marker coordinates={[45, -22]}>
                    <text textAnchor="start" fontSize={11} fontWeight="bold" fill="#1f2937" className="dark:fill-white">
                      Azure - South Africa
                    </text>
                  </Marker>
                  <Marker coordinates={[45, -28]}>
                    <text textAnchor="start" fontSize={10} fontWeight="600" fill="#0078d4">
                      1.2K users
                    </text>
                  </Marker>


                </ComposableMap>
                
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
              
              {/* Simple Legend */}
              <div className="mt-6 space-y-4">
                
                {/* Cloud Providers - Simple */}
                <div className="bg-white/70 dark:bg-slate-800/30 rounded-lg p-4 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Cloud Providers</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-slate-900 dark:text-white">AWS</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">12.1K users</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-900 dark:text-white">GCP</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">9.3K users</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                        <span className="text-sm text-slate-900 dark:text-white">Azure</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">7.4K users</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">99.97%</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Global Uptime</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/70 dark:bg-slate-800/30 rounded-lg p-3 text-center border border-slate-200/50 dark:border-slate-700/50">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">24.8K</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Total Users</div>
                  </div>
                  <div className="bg-white/70 dark:bg-slate-800/30 rounded-lg p-3 text-center border border-slate-200/50 dark:border-slate-700/50">
                    <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400">8</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Regions</div>
                  </div>
                  <div className="bg-white/70 dark:bg-slate-800/30 rounded-lg p-3 text-center border border-slate-200/50 dark:border-slate-700/50">
                    <div className="text-lg font-bold text-purple-500 dark:text-purple-400">42ms</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Avg Latency</div>
                  </div>
                  <div className="bg-white/70 dark:bg-slate-800/30 rounded-lg p-3 text-center border border-slate-200/50 dark:border-slate-700/50">
                    <div className="text-lg font-bold text-cyan-500 dark:text-cyan-400">1.2K</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Requests/min</div>
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