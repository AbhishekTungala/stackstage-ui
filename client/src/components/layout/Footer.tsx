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
        {/* Main Footer Content - Further reduced padding */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Brand Section - More compact */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-3">
              <Link to="/" className="group flex items-center space-x-2 w-fit">
                <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary-glow to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-primary/25 transition-all duration-300">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  StackStage
                </span>
              </Link>
              
              <div className="space-y-2">
                <p className="text-muted-foreground leading-snug max-w-sm text-xs">
                  AI-powered cloud architecture analysis platform. Build with confidence using intelligent insights and enterprise-grade security.
                </p>
                
                {/* Trust Indicators - More compact */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 text-[10px] px-1.5 py-0.5">
                    <Shield className="w-2 h-2" />
                    <span>SOC 2</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[10px] px-1.5 py-0.5">
                    <Users className="w-2 h-2" />
                    <span>10K+ Users</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 text-[10px] px-1.5 py-0.5">
                    <Star className="w-2 h-2" />
                    <span>99.9% Uptime</span>
                  </Badge>
                </div>
              </div>

              {/* Social Links - More compact */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  {[
                    { icon: Github, href: "https://github.com", label: "GitHub" },
                    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-7 h-7 rounded-lg bg-muted/80 hover:bg-primary/10 border border-border/50 hover:border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 group"
                      aria-label={label}
                    >
                      <Icon className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation Sections - More compact */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Product */}
              <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground flex items-center">
                  <Zap className="w-3 h-3 mr-1.5 text-primary" />
                  Product
                </h3>
                <ul className="space-y-1">
                  {[
                    { to: "/analyze", label: "Analysis", icon: Building2 },
                    { to: "/assistant", label: "AI Assistant", icon: Star },
                    { to: "/pricing", label: "Pricing", icon: Award },
                    { to: "/enterprise", label: "Enterprise", icon: Shield }
                  ].map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <Link to={to}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center space-x-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                        >
                          <Icon className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:underline underline-offset-4 text-xs">{label}</span>
                        </motion.div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground flex items-center">
                  <Building2 className="w-3 h-3 mr-1.5 text-primary" />
                  Company
                </h3>
                <ul className="space-y-1">
                  {[
                    { to: "/about", label: "About", icon: Users },
                    { to: "/docs", label: "Docs", icon: FileText },
                    { to: "/privacy", label: "Privacy", icon: Shield },
                    { to: "/terms", label: "Terms", icon: Scale }
                  ].map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <Link to={to}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center space-x-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                        >
                          <Icon className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:underline underline-offset-4 text-xs">{label}</span>
                        </motion.div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources & Support */}
              <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground flex items-center">
                  <Globe className="w-3 h-3 mr-1.5 text-primary" />
                  Resources
                </h3>
                <ul className="space-y-1">
                  {[
                    { href: "mailto:support@stackstage.com", label: "Support", icon: Mail },
                    { href: "https://status.stackstage.com", label: "Status", icon: Heart, external: true },
                    { href: "https://community.stackstage.com", label: "Community", icon: Users, external: true },
                    { to: "/changelog", label: "Changelog", icon: FileText }
                  ].map((item) => {
                    const { href, to, label, icon: Icon, external } = item;
                    const content = (
                      <motion.div
                        whileHover={{ x: 2 }}
                        className="flex items-center space-x-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                      >
                        <Icon className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:underline underline-offset-4 text-xs">{label}</span>
                        {external && <ExternalLink className="w-2 h-2 opacity-50" />}
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

        {/* Bottom Section - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-3"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3 text-[10px] text-muted-foreground">
              <span>© 2025 StackStage</span>
              <div className="w-0.5 h-0.5 bg-muted-foreground/50 rounded-full" />
              <span>Made with <Heart className="w-2 h-2 inline mx-0.5 text-red-500" /> for developers</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-medium text-muted-foreground">Operational</span>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-6 px-2 text-[10px]">
                Build with confidence
                <ArrowRight className="w-2 h-2 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;