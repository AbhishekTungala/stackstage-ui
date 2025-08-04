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
  Users,
  MessageCircle,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  ExternalLink,
  Star,
  Code,
  Lightbulb,
  Coffee,
  Globe,
  Zap,
  Target,
  ArrowRight,
  Download,
  Play
} from "lucide-react";

const Community = () => {
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
    { value: "12K+", label: "Community Members" },
    { value: "2.5K", label: "Monthly Active Users" },
    { value: "450+", label: "Discussions" },
    { value: "89%", label: "Questions Answered" }
  ];

  const platforms = [
    {
      name: "Discord",
      description: "Real-time chat with the community and team",
      members: "8,200+",
      icon: MessageCircle,
      color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
      link: "https://discord.gg/stackstage",
      features: ["Live discussions", "Technical support", "Feature announcements"]
    },
    {
      name: "GitHub",
      description: "Contribute code, report issues, and collaborate",
      members: "3,400+",
      icon: Github,
      color: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20",
      link: "https://github.com/stackstage",
      features: ["Open source projects", "Bug reports", "Feature requests"]
    },
    {
      name: "Forum",
      description: "In-depth discussions and knowledge sharing",
      members: "5,600+",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
      link: "https://forum.stackstage.com",
      features: ["Q&A discussions", "Best practices", "Use case sharing"]
    },
    {
      name: "LinkedIn",
      description: "Professional networking and industry insights",
      members: "2,800+",
      icon: Linkedin,
      color: "bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/20",
      link: "https://linkedin.com/company/stackstage",
      features: ["Industry updates", "Professional network", "Job opportunities"]
    }
  ];

  const events = [
    {
      title: "StackStage Monthly Meetup",
      date: "Jan 15, 2025",
      time: "3:00 PM PST",
      type: "Virtual",
      description: "Monthly community meetup featuring user presentations and Q&A",
      attendees: 150,
      status: "upcoming"
    },
    {
      title: "Cloud Security Workshop",
      date: "Jan 28, 2025", 
      time: "2:00 PM EST",
      type: "Workshop",
      description: "Hands-on workshop covering advanced cloud security best practices",
      attendees: 75,
      status: "upcoming"
    },
    {
      title: "User Conference 2025",
      date: "Mar 12-14, 2025",
      time: "All Day",
      type: "Conference",
      description: "Annual user conference with talks, workshops, and networking",
      attendees: 500,
      status: "early-bird"
    }
  ];

  const contributors = [
    {
      name: "Alex Thompson",
      role: "Community Leader",
      contributions: "120+ answers",
      avatar: "/api/placeholder/150/150",
      badge: "Top Contributor",
      badgeColor: "bg-gold-500/10 text-yellow-700 dark:text-yellow-300"
    },
    {
      name: "Maria Rodriguez",
      role: "Technical Writer",
      contributions: "85+ tutorials",
      avatar: "/api/placeholder/150/150",
      badge: "Content Creator",
      badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300"
    },
    {
      name: "David Chen",
      role: "Open Source Maintainer",
      contributions: "200+ commits",
      avatar: "/api/placeholder/150/150",
      badge: "Code Contributor",
      badgeColor: "bg-green-500/10 text-green-700 dark:text-green-300"
    },
    {
      name: "Sarah Kim",
      role: "Community Moderator",
      contributions: "300+ moderated posts",
      avatar: "/api/placeholder/150/150",
      badge: "Moderator",
      badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300"
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Complete guide for new community members",
      type: "Guide",
      icon: BookOpen,
      link: "/docs/community/getting-started"
    },
    {
      title: "Community Guidelines",
      description: "Rules and best practices for participation",
      type: "Guidelines",
      icon: Target,
      link: "/docs/community/guidelines"
    },
    {
      title: "Contribution Guide",
      description: "How to contribute to StackStage projects",
      type: "Guide",
      icon: Code,
      link: "/docs/community/contributing"
    },
    {
      title: "Event Calendar",
      description: "Upcoming community events and meetups",
      type: "Calendar",
      icon: Calendar,
      link: "/community/events"
    }
  ];

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
      case 'early-bird': return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20';
      case 'sold-out': return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20';
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
                <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Join Our Community
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Connect, Learn &
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                    Grow Together
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Join thousands of cloud professionals sharing knowledge, solving problems, 
                  and building the future of cloud infrastructure together.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-lg px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Join Discord
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Community Platforms */}
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
                <h2 className="text-3xl font-bold">Where We Connect</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose your preferred platform to engage with the StackStage community
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {platforms.map((platform, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card h-full border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <platform.icon className="w-6 h-6 text-primary" />
                          </div>
                          <Badge className={platform.color}>
                            {platform.members} members
                          </Badge>
                        </div>
                        <CardTitle className="text-xl flex items-center">
                          {platform.name}
                          <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                        </CardTitle>
                        <CardDescription className="text-base">{platform.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {platform.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <a href={platform.link} target="_blank" rel="noopener noreferrer" className="block">
                          <Button variant="outline" className="w-full group-hover:bg-primary/10">
                            Join {platform.name}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Upcoming Events */}
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
                <h2 className="text-3xl font-bold">Upcoming Events</h2>
                <p className="text-lg text-muted-foreground">
                  Join us for meetups, workshops, and conferences
                </p>
              </motion.div>

              <div className="space-y-6">
                {events.map((event, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Badge className={getEventStatusColor(event.status)}>
                                {event.status === 'early-bird' ? 'Early Bird' : event.status}
                              </Badge>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                              <p className="text-muted-foreground">{event.description}</p>
                            </div>
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{event.date} at {event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{event.attendees} expected attendees</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button size="sm">
                              Register
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              Add to Calendar
                            </Button>
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

        {/* Community Contributors */}
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
                <h2 className="text-3xl font-bold">Community Heroes</h2>
                <p className="text-lg text-muted-foreground">
                  Meet the amazing contributors who make our community thrive
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contributors.map((contributor, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="glass-card text-center border-primary/10 hover:border-primary/30 transition-all duration-300">
                      <CardHeader>
                        <Avatar className="w-20 h-20 mx-auto mb-4">
                          <AvatarImage src={contributor.avatar} alt={contributor.name} />
                          <AvatarFallback className="text-lg">
                            {contributor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg mb-1">{contributor.name}</CardTitle>
                          <CardDescription className="text-sm">{contributor.role}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge className={contributor.badgeColor}>
                          <Star className="w-3 h-3 mr-1" />
                          {contributor.badge}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{contributor.contributions}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Community Resources */}
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
                <h2 className="text-3xl font-bold">Community Resources</h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to get started and contribute effectively
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
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to={resource.link}>
                          <Button variant="outline" className="w-full group-hover:bg-primary/10">
                            {resource.type}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
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
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Ready to Join?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Become part of our growing community of cloud professionals. 
                      Share knowledge, get help, and help others succeed.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="text-lg px-8 py-4">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Join Discord Today
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Browse Forum
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

export default Community;