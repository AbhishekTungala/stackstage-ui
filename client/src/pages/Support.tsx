import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Book,
  Search,
  FileText,
  Video,
  Users,
  Zap,
  Shield,
  Star,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Headphones,
  Calendar,
  Download
} from "lucide-react";

const Support = () => {
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

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 for Enterprise customers",
      action: "Start Chat",
      priority: "high"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      availability: "Response within 24 hours",
      action: "Send Email",
      priority: "medium"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      availability: "Business hours (Enterprise only)",
      action: "Schedule Call",
      priority: "high"
    },
    {
      icon: Book,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      availability: "Available 24/7",
      action: "Browse Docs",
      priority: "low"
    }
  ];

  const commonIssues = [
    {
      category: "Getting Started",
      icon: Zap,
      issues: [
        "How to set up my first analysis",
        "Connecting cloud accounts",
        "Understanding analysis results",
        "Setting up team access"
      ]
    },
    {
      category: "Billing & Plans",
      icon: Star,
      issues: [
        "Upgrading my subscription",
        "Understanding billing cycles",
        "Downloading invoices",
        "Managing team licenses"
      ]
    },
    {
      category: "Technical Issues",
      icon: Shield,
      issues: [
        "Analysis not completing",
        "API integration problems",
        "Data export issues",
        "Performance optimization"
      ]
    },
    {
      category: "Account Management",
      icon: Users,
      issues: [
        "Resetting my password",
        "Managing team members",
        "Security settings",
        "Data retention policies"
      ]
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: "Documentation",
      description: "Comprehensive guides and API references",
      link: "/docs",
      external: false
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      link: "https://youtube.com/stackstage",
      external: true
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other StackStage users",
      link: "https://community.stackstage.com",
      external: true
    },
    {
      icon: Download,
      title: "Status Page",
      description: "Check current system status and uptime",
      link: "https://status.stackstage.com",
      external: true
    }
  ];

  const stats = [
    { value: "< 1 min", label: "Average Chat Response" },
    { value: "4.9/5", label: "Customer Satisfaction" },
    { value: "24/7", label: "Enterprise Support" },
    { value: "99.9%", label: "Resolution Rate" }
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
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 px-4 py-2">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Support Center
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    How can we
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    help you?
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Get the help you need with our comprehensive support resources, 
                  expert assistance, and active community.
                </p>
              </motion.div>

              {/* Quick Search */}
              <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for help articles, guides, or common issues..."
                    className="pl-12 h-14 text-lg glass-input"
                  />
                  <Button className="absolute right-2 top-2 h-10">
                    Search
                  </Button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Support Channels */}
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
                <h2 className="text-3xl font-bold">Get Support</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the best way to get help based on your needs and subscription plan
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supportChannels.map((channel, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className={`glass-card h-full border-primary/10 hover:border-primary/30 transition-all duration-300 ${
                      channel.priority === 'high' ? 'ring-1 ring-primary/20' : ''
                    }`}>
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <channel.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{channel.title}</CardTitle>
                        <CardDescription className="text-base">{channel.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{channel.availability}</span>
                        </div>
                        <Button className="w-full" variant={channel.priority === 'high' ? 'default' : 'outline'}>
                          {channel.action}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Common Issues */}
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
                <h2 className="text-3xl font-bold">Common Issues</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Quick answers to frequently asked questions
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {commonIssues.map((category, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                          <category.icon className="w-5 h-5 mr-3 text-primary" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {category.issues.map((issue, issueIndex) => (
                            <li key={issueIndex}>
                              <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group">
                                <HelpCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                <span className="text-sm group-hover:text-primary">{issue}</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form */}
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
                <h2 className="text-3xl font-bold">Contact Support</h2>
                <p className="text-lg text-muted-foreground">
                  Can't find what you're looking for? Send us a message and we'll get back to you.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-8">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <Input placeholder="Your full name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input type="email" placeholder="your@email.com" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Issue Type</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="billing">Billing Question</SelectItem>
                              <SelectItem value="account">Account Management</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Priority</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Brief description of your issue" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea 
                          placeholder="Please provide as much detail as possible about your issue..."
                          className="min-h-32"
                        />
                      </div>

                      <Button type="submit" className="w-full text-lg py-3">
                        <Mail className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Resources */}
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
                <h2 className="text-3xl font-bold">Self-Service Resources</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore our comprehensive resources to find answers and learn more
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.map((resource, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card h-full border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <resource.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl flex items-center">
                          {resource.title}
                          {resource.external && (
                            <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-base">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {resource.external ? (
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full group-hover:bg-primary/10">
                              Explore
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        ) : (
                          <Link to={resource.link}>
                            <Button variant="outline" className="w-full group-hover:bg-primary/10">
                              Explore
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enterprise Support CTA */}
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
                      <Headphones className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Need Priority Support?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Enterprise customers get 24/7 priority support, dedicated success managers, 
                      and guaranteed response times. Upgrade today for premium support.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="text-lg px-8 py-4">
                      <Star className="w-5 h-5 mr-2" />
                      Upgrade to Enterprise
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Demo
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

export default Support;