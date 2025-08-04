import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Target,
  Users,
  Globe,
  Award,
  Rocket,
  Heart,
  Zap,
  Building2,
  TrendingUp,
  Shield,
  Star,
  Linkedin,
  Twitter,
  Github,
  MapPin,
  Calendar,
  Coffee,
  BookOpen,
  Lightbulb,
  ArrowRight
} from "lucide-react";

const About = () => {
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

  const stats = [
    { value: "2021", label: "Founded" },
    { value: "50+", label: "Team Members" },
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" }
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We push the boundaries of what's possible in cloud architecture analysis"
    },
    {
      icon: Users,
      title: "Customer Success",
      description: "Your success is our success. We're committed to delivering exceptional value"
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "Enterprise-grade security and transparency in everything we do"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Helping organizations worldwide build better, more secure infrastructure"
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former AWS architect with 10+ years in cloud infrastructure",
      avatar: "/api/placeholder/150/150",
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder", 
      bio: "Ex-Google engineer specializing in AI and machine learning",
      avatar: "/api/placeholder/150/150",
      socials: {
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      name: "Emily Watson",
      role: "VP of Engineering",
      bio: "Cloud security expert with extensive enterprise experience",
      avatar: "/api/placeholder/150/150", 
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "David Kim",
      role: "Head of Product",
      bio: "Product leader focused on developer experience and usability",
      avatar: "/api/placeholder/150/150",
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "StackStage was born from the need for better cloud architecture analysis"
    },
    {
      year: "2022", 
      title: "Series A Funding",
      description: "Raised $10M to accelerate product development and team growth"
    },
    {
      year: "2023",
      title: "Enterprise Launch", 
      description: "Launched enterprise features and achieved SOC 2 Type II compliance"
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Introduced AI-powered analysis and optimization recommendations"
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanding to serve customers across all major cloud platforms"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <Aurora 
          intensity={0.2} 
          speed={2} 
          className="aurora-background"
          fadeHeight={250}
          fadeDirection="bottom"
        />
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
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Heart className="w-4 h-4 mr-2" />
                  Our Story
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Building the Future of
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    Cloud Intelligence
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  We're on a mission to help organizations build secure, optimized, and cost-effective 
                  cloud infrastructures through the power of AI and automation.
                </p>
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

        {/* Mission Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We believe that every organization should have access to enterprise-grade cloud intelligence. 
                    Our platform democratizes advanced cloud architecture analysis, making it accessible to teams 
                    of all sizes.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Through AI-powered insights, automated optimization recommendations, and comprehensive security 
                    analysis, we help teams build with confidence and scale efficiently.
                  </p>
                </div>
                <Button className="text-lg px-6 py-3">
                  <Rocket className="w-5 h-5 mr-2" />
                  Join Our Mission
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-2xl font-bold mb-1">500%</div>
                        <div className="text-sm text-muted-foreground">Cost Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-2xl font-bold mb-1">1000+</div>
                        <div className="text-sm text-muted-foreground">Vulnerabilities Fixed</div>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-2xl font-bold mb-1">10x</div>
                        <div className="text-sm text-muted-foreground">Faster Analysis</div>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Users className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-2xl font-bold mb-1">10K+</div>
                        <div className="text-sm text-muted-foreground">Happy Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
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
                <h2 className="text-4xl font-bold">Our Values</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  The principles that guide everything we do
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card h-full text-center border-primary/10 hover:border-primary/30 transition-all duration-300">
                      <CardHeader>
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <value.icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {value.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
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
                <h2 className="text-4xl font-bold">Meet Our Team</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Passionate experts dedicated to revolutionizing cloud infrastructure
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card text-center border-primary/10 hover:border-primary/30 transition-all duration-300">
                      <CardHeader>
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {member.role}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{member.bio}</p>
                        <div className="flex justify-center space-x-3">
                          {member.socials.linkedin && (
                            <a href={member.socials.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {member.socials.twitter && (
                            <a href={member.socials.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {member.socials.github && (
                            <a href={member.socials.github} className="text-muted-foreground hover:text-primary transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16"
            >
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Our Journey</h2>
                <p className="text-xl text-muted-foreground">
                  Key milestones in our mission to transform cloud infrastructure
                </p>
              </motion.div>

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="font-mono">
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl font-semibold">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="ml-6 mt-4 w-px h-8 bg-border/50" />
                    )}
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
                    <h2 className="text-3xl font-bold">Join Our Journey</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We're always looking for talented individuals who share our passion for 
                      innovation and excellence. Join us in building the future of cloud intelligence.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="text-lg px-8 py-4">
                      <Users className="w-5 h-5 mr-2" />
                      View Open Positions
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                      <Coffee className="w-5 h-5 mr-2" />
                      Contact Us
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

export default About;