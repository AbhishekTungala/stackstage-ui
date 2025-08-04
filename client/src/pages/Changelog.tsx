import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Calendar,
  Star,
  Zap,
  Bug,
  Shield,
  Plus,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Rss,
  Bell,
  ArrowRight,
  Github,
  ExternalLink
} from "lucide-react";

const Changelog = () => {
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

  const releases = [
    {
      version: "v2.4.0",
      date: "January 4, 2025",
      type: "feature",
      title: "Enhanced AI Analysis Engine",
      description: "Major improvements to our AI-powered analysis capabilities with better accuracy and performance.",
      changes: [
        {
          type: "feature",
          title: "Advanced ML Models",
          description: "Deployed new machine learning models for improved cost optimization recommendations"
        },
        {
          type: "feature", 
          title: "Real-time Analysis",
          description: "Added support for real-time infrastructure monitoring and instant alerts"
        },
        {
          type: "improvement",
          title: "Performance Boost",
          description: "Analysis speed improved by 40% through optimization of processing algorithms"
        },
        {
          type: "fix",
          title: "Memory Leak Fix",
          description: "Resolved memory leak in the analysis engine affecting long-running processes"
        }
      ],
      breaking: false,
      stats: {
        commits: 47,
        contributors: 8,
        linesChanged: 12500
      }
    },
    {
      version: "v2.3.2",
      date: "December 28, 2024",
      type: "fix",
      title: "Security Updates & Bug Fixes",
      description: "Critical security patches and various bug fixes to improve stability.",
      changes: [
        {
          type: "security",
          title: "Authentication Security",
          description: "Enhanced authentication system with improved session management"
        },
        {
          type: "fix",
          title: "API Rate Limiting",
          description: "Fixed issues with API rate limiting causing unexpected errors"
        },
        {
          type: "fix",
          title: "Dashboard Loading",
          description: "Resolved dashboard loading issues for users with large datasets"
        }
      ],
      breaking: false,
      stats: {
        commits: 23,
        contributors: 5,
        linesChanged: 3200
      }
    },
    {
      version: "v2.3.0",
      date: "December 15, 2024",
      type: "feature",
      title: "Enterprise Features & Integrations",
      description: "New enterprise-grade features including SSO, advanced integrations, and compliance tools.",
      changes: [
        {
          type: "feature",
          title: "Single Sign-On (SSO)",
          description: "Added support for SAML and OAuth SSO providers for enterprise customers"
        },
        {
          type: "feature",
          title: "Kubernetes Integration",
          description: "Native Kubernetes cluster analysis and optimization recommendations"
        },
        {
          type: "feature",
          title: "Compliance Dashboard",
          description: "New dashboard for tracking SOC 2, GDPR, and other compliance requirements"
        },
        {
          type: "improvement",
          title: "API Documentation",
          description: "Completely redesigned API documentation with interactive examples"
        }
      ],
      breaking: true,
      stats: {
        commits: 89,
        contributors: 12,
        linesChanged: 25600
      }
    },
    {
      version: "v2.2.1",
      date: "November 30, 2024",
      type: "fix",
      title: "Performance Optimizations",
      description: "Various performance improvements and bug fixes based on user feedback.",
      changes: [
        {
          type: "improvement",
          title: "Database Optimization",
          description: "Optimized database queries reducing average response time by 25%"
        },
        {
          type: "fix",
          title: "Export Functionality",
          description: "Fixed issues with PDF and CSV export for large reports"
        },
        {
          type: "improvement",
          title: "Mobile Experience",
          description: "Improved mobile responsiveness across all dashboard views"
        }
      ],
      breaking: false,
      stats: {
        commits: 31,
        contributors: 6,
        linesChanged: 5800
      }
    },
    {
      version: "v2.2.0",
      date: "November 15, 2024",
      type: "feature",
      title: "Advanced Security Scanning",
      description: "Comprehensive security analysis with vulnerability detection and remediation suggestions.",
      changes: [
        {
          type: "feature",
          title: "Vulnerability Scanner",
          description: "Added comprehensive vulnerability scanning for cloud infrastructure"
        },
        {
          type: "feature",
          title: "Security Recommendations",
          description: "AI-powered security recommendations with prioritized action items"
        },
        {
          type: "feature",
          title: "Compliance Checks",
          description: "Automated compliance checking against industry standards"
        },
        {
          type: "improvement",
          title: "Reporting Engine",
          description: "Enhanced reporting with security-focused dashboards and metrics"
        }
      ],
      breaking: false,
      stats: {
        commits: 67,
        contributors: 10,
        linesChanged: 18900
      }
    }
  ];

  const changeTypeConfig = {
    feature: {
      icon: Plus,
      color: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
      label: "New Feature"
    },
    improvement: {
      icon: Zap,
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
      label: "Improvement"
    },
    fix: {
      icon: Bug,
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
      label: "Bug Fix"
    },
    security: {
      icon: Shield,
      color: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
      label: "Security"
    },
    breaking: {
      icon: AlertTriangle,
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
      label: "Breaking Change"
    }
  };

  const releaseTypeConfig = {
    feature: {
      color: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
      label: "Feature Release"
    },
    fix: {
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
      label: "Bug Fix Release"
    },
    security: {
      color: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
      label: "Security Release"
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
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 px-4 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Changelog
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    What's
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    New
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Stay up to date with the latest features, improvements, and fixes in StackStage. 
                  We're constantly evolving to serve you better.
                </p>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search releases..."
                    className="pl-10 glass-input"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Rss className="w-4 h-4 mr-2" />
                  RSS Feed
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Latest Release Highlight */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Star className="w-3 h-3 mr-1" />
                        Latest Release
                      </Badge>
                      <Badge className={releaseTypeConfig[releases[0].type].color}>
                        {releaseTypeConfig[releases[0].type].label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{releases[0].date}</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{releases[0].version}: {releases[0].title}</h2>
                      <p className="text-muted-foreground">{releases[0].description}</p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Github className="w-4 h-4 text-muted-foreground" />
                        <span>{releases[0].stats.commits} commits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{releases[0].stats.linesChanged.toLocaleString()} lines changed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                        <span>{releases[0].stats.contributors} contributors</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        View Release
                      </Button>
                      <Button variant="outline">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Release
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Release History */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Release History</h2>
                <p className="text-lg text-muted-foreground">
                  Complete history of all StackStage releases
                </p>
              </motion.div>

              <div className="space-y-8">
                {releases.map((release, index) => (
                  <motion.div key={index} variants={itemVariants} id={`release-${release.version}`}>
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Badge className={releaseTypeConfig[release.type].color}>
                                {releaseTypeConfig[release.type].label}
                              </Badge>
                              {release.breaking && (
                                <Badge className={changeTypeConfig.breaking.color}>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Breaking Changes
                                </Badge>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{release.date}</span>
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-2xl mb-2">{release.version}: {release.title}</CardTitle>
                              <CardDescription className="text-base">{release.description}</CardDescription>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on GitHub
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Changes List */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">What's Changed</h4>
                          <div className="space-y-3">
                            {release.changes.map((change, changeIndex) => {
                              const config = changeTypeConfig[change.type];
                              const IconComponent = config.icon;
                              return (
                                <div key={changeIndex} className="flex items-start space-x-3">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                                    <IconComponent className="w-3 h-3" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{change.title}</div>
                                    <div className="text-sm text-muted-foreground">{change.description}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Release Stats */}
                        <div className="flex items-center space-x-6 text-sm border-t border-border/50 pt-4">
                          <div className="flex items-center space-x-2">
                            <Github className="w-4 h-4 text-muted-foreground" />
                            <span>{release.stats.commits} commits</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{release.stats.linesChanged.toLocaleString()} lines changed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-muted-foreground" />
                            <span>{release.stats.contributors} contributors</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < releases.length - 1 && <Separator className="opacity-30" />}
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
                      <Bell className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Stay Updated</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Never miss a release! Subscribe to our changelog to get notified about 
                      new features, improvements, and important updates.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="text-lg px-8 py-4">
                      <Bell className="w-5 h-5 mr-2" />
                      Subscribe to Updates
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                      <Rss className="w-5 h-5 mr-2" />
                      RSS Feed
                    </Button>
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

export default Changelog;