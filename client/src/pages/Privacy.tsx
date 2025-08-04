import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  FileText,
  Mail,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  UserX,
  Download,
  Trash2
} from "lucide-react";

const Privacy = () => {
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

  const principles = [
    {
      icon: Shield,
      title: "Data Minimization",
      description: "We only collect data that's necessary for our services"
    },
    {
      icon: Lock,
      title: "Encryption",
      description: "All data is encrypted in transit and at rest"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear information about how we use your data"
    },
    {
      icon: Settings,
      title: "Control",
      description: "You have full control over your personal information"
    }
  ];

  const dataTypes = [
    {
      category: "Account Information",
      description: "Name, email address, company information, and billing details",
      purpose: "Account management and service delivery",
      retention: "As long as your account is active"
    },
    {
      category: "Usage Data",
      description: "How you interact with our platform and features used",
      purpose: "Service improvement and analytics",
      retention: "Up to 2 years"
    },
    {
      category: "Infrastructure Data",
      description: "Cloud architecture configurations and analysis results",
      purpose: "Providing analysis and recommendations",
      retention: "As specified in your data retention settings"
    },
    {
      category: "Technical Data",
      description: "IP addresses, browser information, and device identifiers",
      purpose: "Security, troubleshooting, and service optimization",
      retention: "Up to 1 year"
    }
  ];

  const rights = [
    {
      icon: Eye,
      title: "Access",
      description: "Request access to your personal data"
    },
    {
      icon: Settings,
      title: "Rectification",
      description: "Correct inaccurate personal data"
    },
    {
      icon: UserX,
      title: "Erasure",
      description: "Request deletion of your personal data"
    },
    {
      icon: Download,
      title: "Portability",
      description: "Export your data in a portable format"
    },
    {
      icon: AlertTriangle,
      title: "Object",
      description: "Object to processing of your personal data"
    },
    {
      icon: Trash2,
      title: "Restriction",
      description: "Restrict processing of your personal data"
    }
  ];

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
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Your Privacy
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    Matters
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  We're committed to protecting your privacy and being transparent about how we collect, 
                  use, and protect your personal information.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: January 4, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Version 2.1</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Our Privacy Principles</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  These core principles guide how we handle your personal information
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {principles.map((principle, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card h-full text-center border-primary/10">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <principle.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{principle.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{principle.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16"
            >
              {/* Data Collection */}
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold flex items-center">
                    <Database className="w-8 h-8 mr-3 text-primary" />
                    Information We Collect
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    We collect information to provide you with the best possible service while respecting your privacy.
                  </p>
                </div>

                <div className="space-y-6">
                  {dataTypes.map((type, index) => (
                    <Card key={index} className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle className="text-xl">{type.category}</CardTitle>
                        <CardDescription className="text-base">{type.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-foreground">Purpose:</span>
                            <p className="text-muted-foreground">{type.purpose}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Retention:</span>
                            <p className="text-muted-foreground">{type.retention}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* How We Use Data */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center">
                  <Settings className="w-8 h-8 mr-3 text-primary" />
                  How We Use Your Information
                </h2>
                
                <Card className="glass-card border-border/50">
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Service Delivery</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            Provide cloud architecture analysis
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            Generate security recommendations
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            Process billing and payments
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Service Improvement</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            Analyze usage patterns
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            Improve our algorithms
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            Enhance user experience
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Your Rights */}
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold flex items-center">
                    <Lock className="w-8 h-8 mr-3 text-primary" />
                    Your Rights & Controls
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    You have comprehensive rights over your personal data under GDPR and other privacy laws.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rights.map((right, index) => (
                    <Card key={index} className="glass-card border-border/50">
                      <CardHeader>
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                          <right.icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{right.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{right.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          How to Exercise Your Rights
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          To exercise any of these rights, please contact us at{" "}
                          <a href="mailto:privacy@stackstage.com" className="underline font-medium">
                            privacy@stackstage.com
                          </a>
                          {" "}or use the data controls in your account settings. We'll respond within 30 days.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center">
                  <Shield className="w-8 h-8 mr-3 text-primary" />
                  Data Security
                </h2>
                
                <Card className="glass-card border-border/50">
                  <CardContent className="p-8 space-y-6">
                    <p className="text-lg text-muted-foreground">
                      We implement industry-leading security measures to protect your information:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Technical Safeguards</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• AES-256 encryption at rest</li>
                          <li>• TLS 1.3 for data in transit</li>
                          <li>• Multi-factor authentication</li>
                          <li>• Regular security audits</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Organizational Measures</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• SOC 2 Type II compliance</li>
                          <li>• Employee background checks</li>
                          <li>• Incident response procedures</li>
                          <li>• Regular staff training</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center">
                  <Mail className="w-8 h-8 mr-3 text-primary" />
                  Contact Us
                </h2>
                
                <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <p className="text-lg">
                        If you have any questions about this Privacy Policy or our data practices, 
                        please don't hesitate to contact us.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">Privacy Officer</h3>
                          <p className="text-muted-foreground">
                            <a href="mailto:privacy@stackstage.com" className="hover:text-primary transition-colors">
                              privacy@stackstage.com
                            </a>
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                          <p className="text-muted-foreground">
                            <a href="mailto:dpo@stackstage.com" className="hover:text-primary transition-colors">
                              dpo@stackstage.com
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;