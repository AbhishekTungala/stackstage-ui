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
      <div className="min-h-screen bg-slate-950">
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
      <div className="min-h-screen bg-slate-950">
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
    <div className="min-h-screen bg-slate-950">
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
                <Card key={index} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metric.gradient} flex items-center justify-center`}>
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10">
                        {metric.change}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">{metric.title}</h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-white">{metric.value}</span>
                        <span className="text-sm text-slate-400 ml-1">{metric.suffix}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Website Visitors - Circular Progress (like reference) */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Infrastructure Health</CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    Export ↗
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Circular Progress */}
                <div className="relative">
                  <div className="w-40 h-40 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visitorsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {visitorsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{overallScore}</span>
                      <span className="text-sm text-slate-400">Score</span>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="space-y-3">
                  {visitorsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-300">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold">{item.value}</span>
                        <div className="text-xs text-slate-400">30%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Customer Type - Area Chart */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Performance Metrics</CardTitle>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">$240.8K</div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-300">Current clients</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-300">Subscribers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-slate-300">New customers</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spikesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                      />
                      <Bar dataKey="current" fill="url(#barGradient1)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="issues" fill="url(#barGradient2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Multi-Dimensional Radar Chart */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Radar className="mr-2 w-5 h-5 text-purple-400" />
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
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: '#64748b', fontSize: 10 }} 
                        tickFormatter={(value) => `${value}%`}
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
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Team Progress</CardTitle>
                  <CardTitle className="text-white">Infrastructure Status</CardTitle>
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
                          <h4 className="text-sm font-medium text-white">{member.name}</h4>
                          <span className="text-sm text-slate-400">{member.progress}%</span>
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
                          <Pie
                            data={[
                              { value: 80, fill: '#3b82f6' },
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
                        <span className="text-2xl font-bold text-white">80%</span>
                        <span className="text-xs text-slate-400">Transactions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-6 mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-300">Sell</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-300">Distribute</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="text-slate-300">Return</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Status Table */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Analysis Results</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-slate-300 border-slate-600">
                    Jan 2024 ↗
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                    Create order
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-400">Order</TableHead>
                    <TableHead className="text-slate-400">Client</TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Country</TableHead>
                    <TableHead className="text-slate-400">Total</TableHead>
                    <TableHead className="text-slate-400"></TableHead>
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