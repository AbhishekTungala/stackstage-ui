import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedList from "@/components/ui/animated-list";
import { 
  Shield, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  FileText, 
  Share2,
  Eye,
  Wrench,
  AlertTriangle,
  BarChart3,
  Lock,
  Cloud,
  X,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  
  const features = [
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Identify vulnerabilities, compliance issues, and security misconfigurations across your cloud infrastructure.",
      features: ["Vulnerability scanning", "Compliance checks", "Risk assessment", "Security recommendations"],
      detailedContent: {
        title: "Security Analysis Dashboard",
        description: "Comprehensive security analysis with real-time vulnerability detection and compliance monitoring.",
        items: [
          "CVE vulnerability scanning",
          "OWASP Top 10 compliance",
          "IAM permissions audit",
          "Network security analysis",
          "Data encryption validation",
          "SSL/TLS certificate monitoring"
        ],
        stats: [
          { label: "Vulnerabilities Detected", value: "127", status: "critical" },
          { label: "Compliance Score", value: "78%", status: "warning" },
          { label: "Security Recommendations", value: "23", status: "info" },
          { label: "Critical Issues", value: "5", status: "critical" }
        ]
      }
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      description: "Discover opportunities to reduce cloud spending without compromising performance or reliability.",
      features: ["Resource rightsizing", "Unused resource detection", "Reserved instance recommendations", "Billing optimization"],
      detailedContent: {
        title: "Cost Optimization Insights",
        description: "Analyze spending patterns and identify cost-saving opportunities across your infrastructure.",
        items: [
          "Underutilized EC2 instances",
          "Idle load balancers",
          "Oversized storage volumes",
          "Reserved instance opportunities",
          "Savings plan recommendations",
          "Resource scheduling automation"
        ],
        stats: [
          { label: "Monthly Savings", value: "$12,450", status: "success" },
          { label: "Underutilized Resources", value: "34", status: "warning" },
          { label: "RI Coverage", value: "67%", status: "info" },
          { label: "Potential Savings", value: "28%", status: "success" }
        ]
      }
    },
    {
      icon: Zap,
      title: "Performance Insights",
      description: "Analyze your infrastructure performance and get actionable recommendations for improvements.",
      features: ["Performance bottlenecks", "Scaling recommendations", "Load balancing optimization", "Network analysis"],
      detailedContent: {
        title: "Performance Analytics",
        description: "Deep dive into performance metrics with bottleneck identification and optimization recommendations.",
        items: [
          "CPU utilization monitoring",
          "Memory usage analysis",
          "Network latency tracking",
          "Database query optimization",
          "CDN performance analysis",
          "Auto-scaling triggers"
        ],
        stats: [
          { label: "Avg Response Time", value: "245ms", status: "success" },
          { label: "CPU Utilization", value: "73%", status: "warning" },
          { label: "Memory Usage", value: "58%", status: "info" },
          { label: "Network Latency", value: "12ms", status: "success" }
        ]
      }
    },
    {
      icon: TrendingUp,
      title: "Scalability Planning",
      description: "Plan for future growth with intelligent scaling recommendations and capacity planning.",
      features: ["Auto-scaling setup", "Capacity planning", "Growth projections", "Architecture recommendations"],
      detailedContent: {
        title: "Scalability Roadmap",
        description: "Future-ready scaling strategies with intelligent capacity planning and growth projections.",
        items: [
          "Auto-scaling group configuration",
          "Load balancer distribution",
          "Database sharding strategy",
          "CDN edge location planning",
          "Microservices decomposition",
          "Traffic pattern analysis"
        ],
        stats: [
          { label: "Traffic Growth", value: "+145%", status: "success" },
          { label: "Scaling Events", value: "23", status: "info" },
          { label: "Capacity Utilization", value: "82%", status: "warning" },
          { label: "Growth Projection", value: "+67%", status: "info" }
        ]
      }
    },
    {
      icon: Eye,
      title: "Visual Architecture",
      description: "Generate interactive diagrams of your cloud infrastructure with highlighted issues and improvements.",
      features: ["Interactive diagrams", "Architecture visualization", "Dependency mapping", "Issue highlighting"],
      detailedContent: {
        title: "Architecture Visualization",
        description: "Interactive infrastructure diagrams with real-time dependency mapping and issue visualization.",
        items: [
          "Mermaid diagram generation",
          "Service dependency graph",
          "Data flow visualization",
          "Security boundary mapping",
          "Cost allocation view",
          "Performance hotspot overlay"
        ],
        stats: [
          { label: "Services Mapped", value: "47", status: "info" },
          { label: "Dependencies", value: "128", status: "info" },
          { label: "Critical Paths", value: "8", status: "warning" },
          { label: "Diagram Accuracy", value: "94%", status: "success" }
        ]
      }
    },
    {
      icon: Share2,
      title: "Team Collaboration",
      description: "Share reports and collaborate with your team on infrastructure improvements and decisions.",
      features: ["Report sharing", "Team collaboration", "Export capabilities", "Integration support"],
      detailedContent: {
        title: "Collaboration Hub",
        description: "Streamlined team collaboration with advanced sharing, export, and integration capabilities.",
        items: [
          "Real-time report sharing",
          "Team workspace management",
          "PDF/CSV export options",
          "Slack/Teams integration",
          "JIRA ticket creation",
          "Role-based access control"
        ],
        stats: [
          { label: "Team Members", value: "12", status: "info" },
          { label: "Shared Reports", value: "156", status: "success" },
          { label: "Integrations Active", value: "5", status: "info" },
          { label: "Export Downloads", value: "89", status: "success" }
        ]
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className="py-24 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive
            <span className="text-gradient"> Cloud Analysis</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to optimize, secure, and scale your cloud infrastructure
            with confidence and precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="glass-card group h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary/20"
                onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
                data-testid={`feature-card-${index}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full group-hover:bg-primary/10"
                    data-testid={`button-explore-${index}`}
                  >
                    <span>Explore Details</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Feature Modal */}
        <AnimatePresence>
          {selectedFeature !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
                        {React.createElement(features[selectedFeature].icon, { className: "w-8 h-8 text-primary" })}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {features[selectedFeature].detailedContent.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {features[selectedFeature].detailedContent.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFeature(null)}
                      className="rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Feature List */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-foreground">Key Features</h4>
                      <AnimatedList
                        items={features[selectedFeature].detailedContent.items}
                        onItemSelect={(item, index) => console.log(`Selected: ${item}`)}
                        showGradients={true}
                        enableArrowNavigation={false}
                        displayScrollbar={false}
                      />
                    </div>

                    {/* Stats */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-foreground">Analytics Overview</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {features[selectedFeature].detailedContent.stats.map((stat, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-subtle p-4 rounded-xl"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                <p className={`text-xl font-bold ${getStatusColor(stat.status)}`}>
                                  {stat.value}
                                </p>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${
                                stat.status === 'critical' ? 'bg-destructive' :
                                stat.status === 'warning' ? 'bg-warning' :
                                stat.status === 'success' ? 'bg-success' :
                                'bg-muted-foreground'
                              }`} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-glass-border">
                    <Button className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedFeature(null)}>
                      Close Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-8">
            Ready to optimize your cloud infrastructure?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/analyze" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Start Free Analysis
            </a>
            <a href="/login" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;