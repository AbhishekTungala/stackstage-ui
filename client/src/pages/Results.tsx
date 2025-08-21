import { useState } from "react";
import { Link } from "wouter";
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
  ArrowRight
} from "lucide-react";
import MagicBento from "@/components/ui/magic-bento";
import AnimatedList from "@/components/ui/animated-list";

const Results = () => {
  const [overallScore] = useState(78);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Generate and download PDF report
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId: 'current',
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
  
  const scores = [
    {
      category: "Security",
      score: 85,
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
      status: "Good",
      issues: 2
    },
    {
      category: "Cost Optimization",
      score: 65,
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/10",
      status: "Needs Attention",
      issues: 5
    },
    {
      category: "Performance",
      score: 90,
      icon: Zap,
      color: "text-success",
      bgColor: "bg-success/10",
      status: "Excellent",
      issues: 1
    },
    {
      category: "Scalability",
      score: 72,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
      status: "Good",
      issues: 3
    },
    {
      category: "Reliability",
      score: 80,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      status: "Good",
      issues: 2
    }
  ];

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
              Your cloud infrastructure has been analyzed. Here's what we found.
            </p>
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

          {/* Animated Issues List */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Issues by Category
            </h2>
            <div className="max-w-2xl mx-auto space-y-3">
              {scores.map((score, index) => {
                const Icon = score.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-lg ${score.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${score.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{score.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {score.issues} issue{score.issues !== 1 ? 's' : ''} found - {score.status}
                      </p>
                    </div>
                    <Badge 
                      variant={score.score >= 80 ? "default" : score.score >= 60 ? "secondary" : "destructive"}
                      className={score.score >= 80 ? "bg-green-500 text-white" : score.score >= 60 ? "bg-yellow-500 text-white" : ""}
                    >
                      {score.score}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

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
              onClick={() => window.location.href = '/diagram'}
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
                Based on your analysis results, here's what we recommend focusing on first.
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
                  <Link to="/diagram">
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
                  <Download className="mr-2 w-5 h-5" />
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