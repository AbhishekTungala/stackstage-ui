import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Zap, 
  Building2,
  FileText,
  Shield,
  Scale,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Award,
  Globe,
  Heart,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  return (
    <footer className="relative border-t border-border/50 bg-background/95 backdrop-blur-md">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/90 pointer-events-none" />
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Brand Section - Enhanced */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
              <Link to="/" className="group flex items-center space-x-3 w-fit">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary-glow to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  StackStage
                </span>
              </Link>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed max-w-md text-base">
                  AI-powered cloud architecture analysis platform. Build with confidence using intelligent insights, 
                  automated optimization recommendations, and enterprise-grade security.
                </p>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                    <Shield className="w-3 h-3" />
                    <span>SOC 2 Compliant</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                    <Users className="w-3 h-3" />
                    <span>10K+ Users</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                    <Star className="w-3 h-3" />
                    <span>99.9% Uptime</span>
                  </Badge>
                </div>
              </div>

              {/* Social Links - Enhanced */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-muted-foreground">Follow us:</span>
                <div className="flex space-x-3">
                  {[
                    { icon: Github, href: "https://github.com", label: "GitHub" },
                    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-muted/80 hover:bg-primary/10 border border-border/50 hover:border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 group"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation Sections */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Product */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-bold text-lg text-foreground flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-primary" />
                  Product
                </h3>
                <ul className="space-y-3">
                  {[
                    { to: "/analyze", label: "Architecture Analysis", icon: Building2 },
                    { to: "/assistant", label: "AI Assistant", icon: Star },
                    { to: "/pricing", label: "Pricing", icon: Award },
                    { to: "/enterprise", label: "Enterprise", icon: Shield }
                  ].map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <Link to={to}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                        >
                          <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:underline underline-offset-4">{label}</span>
                        </motion.div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-bold text-lg text-foreground flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-primary" />
                  Company
                </h3>
                <ul className="space-y-3">
                  {[
                    { to: "/about", label: "About", icon: Users },
                    { to: "/docs", label: "Documentation", icon: FileText },
                    { to: "/privacy", label: "Privacy", icon: Shield },
                    { to: "/terms", label: "Terms", icon: Scale }
                  ].map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <Link to={to}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                        >
                          <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:underline underline-offset-4">{label}</span>
                        </motion.div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources & Support */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-bold text-lg text-foreground flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  Resources
                </h3>
                <ul className="space-y-3">
                  {[
                    { href: "mailto:support@stackstage.com", label: "Support", icon: Mail },
                    { href: "https://status.stackstage.com", label: "Status", icon: Heart, external: true },
                    { href: "https://community.stackstage.com", label: "Community", icon: Users, external: true },
                    { to: "/changelog", label: "Changelog", icon: FileText }
                  ].map((item) => {
                    const { href, to, label, icon: Icon, external } = item;
                    const content = (
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                      >
                        <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:underline underline-offset-4">{label}</span>
                        {external && <ExternalLink className="w-3 h-3 opacity-50" />}
                      </motion.div>
                    );

                    return (
                      <li key={label}>
                        {href ? (
                          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                            {content}
                          </a>
                        ) : (
                          <Link to={to!}>{content}</Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <Separator className="opacity-50" />

        {/* Bottom Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-muted-foreground text-sm">
                © 2025 StackStage. All rights reserved.
              </p>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground/50 rounded-full" />
              <p className="text-muted-foreground text-sm">
                Made with <Heart className="w-3 h-3 inline mx-1 text-red-500" /> for developers
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">All systems operational</span>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                Build with confidence
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;