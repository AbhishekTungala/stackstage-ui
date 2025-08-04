import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Globe,
  Server,
  Database,
  Shield,
  Zap,
  Cloud,
  BarChart3,
  Calendar,
  ExternalLink,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const Status = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const overallStatus = {
    status: "operational",
    uptime: "99.98%",
    responseTime: "142ms",
    lastIncident: "12 days ago"
  };

  const services = [
    {
      name: "API Services",
      status: "operational",
      uptime: "99.99%",
      responseTime: "89ms",
      description: "Core API endpoints and authentication",
      icon: Zap
    },
    {
      name: "Analysis Engine",
      status: "operational", 
      uptime: "99.97%",
      responseTime: "1.2s",
      description: "Cloud architecture analysis and processing",
      icon: BarChart3
    },
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.98%",
      responseTime: "156ms",
      description: "Main application interface and dashboard",
      icon: Globe
    },
    {
      name: "Database",
      status: "operational",
      uptime: "100%",
      responseTime: "23ms",
      description: "Primary database and data storage",
      icon: Database
    },
    {
      name: "Authentication",
      status: "operational",
      uptime: "99.96%",
      responseTime: "78ms",
      description: "User authentication and authorization",
      icon: Shield
    },
    {
      name: "File Processing",
      status: "degraded",
      uptime: "98.5%",
      responseTime: "2.8s",
      description: "File upload and processing services",
      icon: Cloud
    }
  ];

  const recentIncidents = [
    {
      id: "INC-2025-001",
      title: "Intermittent API Response Delays",
      status: "resolved",
      severity: "minor",
      startTime: "Jan 2, 2025 14:30 UTC",
      resolvedTime: "Jan 2, 2025 15:45 UTC",
      description: "Some users experienced slower than normal API response times due to increased traffic during peak hours.",
      impact: "Minimal impact to service functionality"
    },
    {
      id: "INC-2024-089",
      title: "Scheduled Database Maintenance",
      status: "resolved",
      severity: "maintenance",
      startTime: "Dec 28, 2024 02:00 UTC",
      resolvedTime: "Dec 28, 2024 04:30 UTC",
      description: "Planned database maintenance to improve performance and apply security updates.",
      impact: "Brief service interruption during maintenance window"
    },
    {
      id: "INC-2024-088",
      title: "File Upload Service Degradation",
      status: "resolved",
      severity: "major",
      startTime: "Dec 22, 2024 09:15 UTC", 
      resolvedTime: "Dec 22, 2024 12:30 UTC",
      description: "File upload service experienced significant delays due to storage infrastructure issues.",
      impact: "File uploads were delayed or failed intermittently"
    }
  ];

  const metrics = [
    {
      title: "API Requests",
      value: "2.3M",
      change: "+12%",
      period: "Last 24h",
      icon: TrendingUp
    },
    {
      title: "Active Users",
      value: "8,542",
      change: "+5%",
      period: "Currently",
      icon: Activity
    },
    {
      title: "Analyses Run",
      value: "15,230",
      change: "+18%",
      period: "Last 7d",
      icon: BarChart3
    },
    {
      title: "Data Processed",
      value: "1.2TB",
      change: "+8%",
      period: "Last 24h",
      icon: Database
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'degraded': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'outage': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'maintenance': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      case 'maintenance': return Clock;
      default: return AlertCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20';
      case 'major': return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20';
      case 'critical': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
      case 'maintenance': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <Aurora intensity={0.2} speed={2} className="aurora-background" />
      </div>

      <main className="relative flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <Badge className={`px-4 py-2 ${getStatusColor(overallStatus.status)}`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  All Systems Operational
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    System
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    Status
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Real-time status and performance metrics for all StackStage services. 
                  Stay informed about service availability and planned maintenance.
                </p>
              </motion.div>

              {/* Overall Metrics */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">{overallStatus.uptime}</div>
                  <div className="text-sm text-muted-foreground">Uptime (30d)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-1">{overallStatus.responseTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-1">{overallStatus.lastIncident}</div>
                  <div className="text-sm text-muted-foreground">Last Incident</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">6</div>
                  <div className="text-sm text-muted-foreground">Services</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Current Status */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Current Status</h2>
                <p className="text-lg text-muted-foreground">
                  Live status of all StackStage services and infrastructure
                </p>
              </motion.div>

              <div className="space-y-4">
                {services.map((service, index) => {
                  const StatusIcon = getStatusIcon(service.status);
                  return (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="glass-card border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <service.icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="text-center">
                                <div className="font-medium">{service.uptime}</div>
                                <div className="text-muted-foreground">Uptime</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{service.responseTime}</div>
                                <div className="text-muted-foreground">Response</div>
                              </div>
                              <Badge className={`${getStatusColor(service.status)} capitalize`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {service.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Performance Metrics</h2>
                <p className="text-lg text-muted-foreground">
                  Key performance indicators and usage statistics
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card border-primary/10">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <metric.icon className="w-8 h-8 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {metric.period}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{metric.title}</span>
                          <span className="text-sm text-green-500 font-medium">{metric.change}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Recent Incidents</h2>
                <p className="text-lg text-muted-foreground">
                  Latest incidents and maintenance activities
                </p>
              </motion.div>

              <div className="space-y-6">
                {recentIncidents.map((incident, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <Badge className={getSeverityColor(incident.severity)}>
                                {incident.severity}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {incident.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">#{incident.id}</span>
                            </div>
                            <CardTitle className="text-xl">{incident.title}</CardTitle>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{incident.startTime}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{incident.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Impact:</span>
                            <p className="text-muted-foreground mt-1">{incident.impact}</p>
                          </div>
                          <div>
                            <span className="font-medium">Resolution:</span>
                            <p className="text-muted-foreground mt-1">{incident.resolvedTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="p-12 text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Stay Updated</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Subscribe to status updates and be the first to know about incidents, 
                      maintenance, and service improvements.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="https://status.stackstage.com/subscribe" target="_blank" rel="noopener noreferrer">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Card className="glass-card border-primary/20 p-6 cursor-pointer hover:border-primary/40 transition-all duration-300">
                          <div className="text-center space-y-2">
                            <Server className="w-8 h-8 text-primary mx-auto" />
                            <div className="font-semibold">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">Get updates via email</div>
                          </div>
                        </Card>
                      </motion.div>
                    </a>
                    <a href="https://status.stackstage.com/rss" target="_blank" rel="noopener noreferrer">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Card className="glass-card border-primary/20 p-6 cursor-pointer hover:border-primary/40 transition-all duration-300">
                          <div className="text-center space-y-2">
                            <Globe className="w-8 h-8 text-primary mx-auto" />
                            <div className="font-semibold">RSS Feed</div>
                            <div className="text-sm text-muted-foreground">Subscribe to RSS</div>
                          </div>
                        </Card>
                      </motion.div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Status;