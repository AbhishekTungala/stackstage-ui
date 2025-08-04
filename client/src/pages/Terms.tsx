import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Scale,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Building2,
  CreditCard,
  RefreshCw,
  UserX,
  Globe,
  Lock,
  Info
} from "lucide-react";

const Terms = () => {
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

  const keyTerms = [
    {
      icon: Building2,
      title: "Service Definition",
      description: "StackStage provides cloud architecture analysis and optimization services"
    },
    {
      icon: CreditCard,
      title: "Billing & Payment",
      description: "Subscription fees, billing cycles, and payment processing terms"
    },
    {
      icon: Shield,
      title: "Data & Privacy",
      description: "How we handle your data in accordance with our Privacy Policy"
    },
    {
      icon: RefreshCw,
      title: "Service Availability",
      description: "99.9% uptime SLA with scheduled maintenance windows"
    }
  ];

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using StackStage services, you agree to be bound by these Terms of Service and our Privacy Policy.",
        "If you disagree with any part of these terms, you may not access or use our services.",
        "We may modify these terms at any time, and such modifications will be effective immediately upon posting."
      ]
    },
    {
      id: "description",
      title: "2. Description of Service",
      content: [
        "StackStage provides cloud architecture analysis, security scanning, cost optimization recommendations, and related services.",
        "Our services are provided on a subscription basis with different tiers offering varying levels of functionality.",
        "We reserve the right to modify, suspend, or discontinue any part of our service at any time with reasonable notice."
      ]
    },
    {
      id: "accounts",
      title: "3. User Accounts and Registration",
      content: [
        "You must create an account to access our services and provide accurate, complete registration information.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must immediately notify us of any unauthorized use of your account.",
        "One person or legal entity may not maintain more than one free account."
      ]
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable Use Policy",
      content: [
        "You may not use our services for any unlawful purpose or in violation of any local, state, national, or international law.",
        "You may not attempt to gain unauthorized access to our systems or other users' accounts.",
        "You may not use our services to transmit malware, spam, or other harmful content.",
        "You may not reverse engineer, decompile, or attempt to extract source code from our services."
      ]
    },
    {
      id: "billing",
      title: "5. Billing and Payment",
      content: [
        "Subscription fees are billed in advance on a monthly or annual basis depending on your selected plan.",
        "All fees are non-refundable except as required by law or as specifically provided in these terms.",
        "We may change our pricing with 30 days' notice to existing subscribers.",
        "Failure to pay fees may result in suspension or termination of your account."
      ]
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property Rights",
      content: [
        "StackStage and our licensors own all rights, title, and interest in our services and technology.",
        "You retain ownership of your data and content, subject to our rights to use such data to provide services.",
        "You grant us a license to use your data solely for the purpose of providing and improving our services.",
        "You may not use our trademarks, logos, or branding without prior written consent."
      ]
    },
    {
      id: "data-security",
      title: "7. Data Security and Privacy",
      content: [
        "We implement industry-standard security measures to protect your data as described in our Privacy Policy.",
        "You acknowledge that no method of transmission over the internet is 100% secure.",
        "We are not responsible for data breaches resulting from your failure to secure your account credentials.",
        "You may export your data at any time through our data export functionality."
      ]
    },
    {
      id: "limitation",
      title: "8. Limitation of Liability",
      content: [
        "Our total liability for any claims arising from these terms or our services shall not exceed the amount you paid us in the 12 months preceding the claim.",
        "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
        "We provide our services 'as is' without warranties of any kind, either express or implied.",
        "Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you."
      ]
    },
    {
      id: "termination",
      title: "9. Termination",
      content: [
        "You may terminate your account at any time through your account settings.",
        "We may terminate or suspend your account immediately for violation of these terms.",
        "Upon termination, your right to use our services ceases immediately.",
        "We will provide you with reasonable access to export your data following termination."
      ]
    },
    {
      id: "governing-law",
      title: "10. Governing Law and Disputes",
      content: [
        "These terms are governed by the laws of Delaware, United States, without regard to conflict of law principles.",
        "Any disputes arising from these terms or our services shall be resolved through binding arbitration.",
        "You waive any right to participate in class action lawsuits or class-wide arbitration.",
        "The arbitration shall be conducted in English in Delaware, United States."
      ]
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
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 px-4 py-2">
                  <Scale className="w-4 h-4 mr-2" />
                  Terms of Service
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Terms of
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    Service
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Please read these terms carefully before using StackStage. 
                  They govern your use of our services and outline our mutual responsibilities.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: January 4, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Version 3.0</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Key Terms Overview */}
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
                <h2 className="text-3xl font-bold">Key Terms Overview</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A quick overview of the most important aspects of our terms
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyTerms.map((term, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card h-full text-center border-primary/10">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <term.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{term.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{term.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card border-orange-500/20 bg-orange-500/5">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-orange-800 dark:text-orange-200 text-sm">
                        These terms include important provisions such as a binding arbitration clause and class action waiver 
                        that affect your legal rights. Please read them carefully before using our services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              {sections.map((section, index) => (
                <motion.div key={section.id} variants={itemVariants} id={section.id}>
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                  {index < sections.length - 1 && <Separator className="opacity-30" />}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold flex items-center justify-center">
                        <Mail className="w-8 h-8 mr-3 text-primary" />
                        Questions About These Terms?
                      </h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        If you have any questions about these Terms of Service, please contact our legal team.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Legal Team</h3>
                        <p className="text-muted-foreground">
                          <a href="mailto:legal@stackstage.com" className="hover:text-primary transition-colors">
                            legal@stackstage.com
                          </a>
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">General Support</h3>
                        <p className="text-muted-foreground">
                          <a href="mailto:support@stackstage.com" className="hover:text-primary transition-colors">
                            support@stackstage.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card border-green-500/20 bg-green-500/5">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Acknowledgment
                      </h3>
                      <p className="text-green-800 dark:text-green-200 text-sm">
                        By using StackStage, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                      </p>
                    </div>
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

export default Terms;