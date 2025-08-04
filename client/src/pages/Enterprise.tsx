import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Building2,
  Users,
  Lock,
  Globe,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Star,
  Database,
  Cloud,
  Settings,
  BarChart3,
  FileText,
  Key,
  UserCheck,
  Briefcase,
  Target,
  Layers
} from "lucide-react";

const Enterprise = () => {
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

  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "SOC 2 Type II, GDPR compliance, and enterprise-grade encryption"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Role-based access control, team analytics, and user provisioning"
    },
    {
      icon: Database,
      title: "Data Governance",
      description: "Data residency controls, audit trails, and compliance reporting"
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Multi-region deployment with 99.99% uptime SLA"
    },
    {
      icon: Settings,
      title: "Custom Integrations",
      description: "Dedicated API access and custom webhook configurations"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Custom dashboards, detailed reporting, and usage insights"
    }
  ];

  const plans = [
    {
      name: "Team",
      price: "$99",
      period: "per month",
      description: "Perfect for growing teams",
      features: [
        "Up to 25 team members",
        "Advanced security features",
        "Priority support",
        "Custom integrations",
        "Advanced analytics"
      ],
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Unlimited team members",
        "SOC 2 Type II compliance",
        "Dedicated success manager",
        "Custom deployment options",
        "24/7 premium support",
        "Advanced data governance"
      ],
      popular: true
    }
  ];

  const stats = [
    { value: "500+", label: "Enterprise Customers" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "24/7", label: "Premium Support" },
    { value: "50+", label: "Integrations" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <Aurora intensity={0.3} speed={1.5} className="aurora-background" />
      </div>

      <main className="relative flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  Enterprise Solutions
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Scale with
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    Confidence
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Enterprise-grade cloud architecture analysis with advanced security, 
                  compliance, and dedicated support for organizations at scale.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Sales
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Enterprise Features</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Built for enterprise requirements with advanced security, compliance, and scalability
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card h-full border-primary/10 hover:border-primary/30 transition-all duration-300">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Enterprise Pricing</h2>
                <p className="text-xl text-muted-foreground">
                  Flexible pricing for teams and enterprises
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className={`glass-card relative h-full ${
                      plan.popular ? 'border-primary/30 ring-1 ring-primary/20' : 'border-border/50'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground px-4 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-8">
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <div className="space-y-2">
                          <div className="text-4xl font-bold">
                            {plan.price}
                            <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                          </div>
                          <CardDescription className="text-base">{plan.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
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
                    <h2 className="text-3xl font-bold">Ready to Scale?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Join hundreds of enterprises already using StackStage to optimize their cloud infrastructure. 
                      Get started with a personalized demo today.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="text-lg px-8 py-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Demo
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                      <FileText className="w-5 h-5 mr-2" />
                      Download Brochure
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

export default Enterprise;