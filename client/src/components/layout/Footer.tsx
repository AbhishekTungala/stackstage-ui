import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Zap, 
  ArrowUpRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/20 bg-background/80 backdrop-blur-xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            
            {/* Left: Brand & Copyright */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/" className="group flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-foreground">StackStage</span>
              </Link>
              
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>© 2025</span>
                <Separator orientation="vertical" className="h-3 mx-2" />
                <span>Build with confidence</span>
              </div>
            </div>

            {/* Center: Navigation Links */}
            <nav className="flex items-center space-x-8">
              {[
                { to: "/pricing", label: "Pricing" },
                { to: "/docs", label: "Docs" },
                { to: "/about", label: "About" },
                { to: "/support", label: "Support" }
              ].map(({ to, label }) => (
                <Link key={to} to={to}>
                  <motion.span
                    whileHover={{ y: -1 }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </motion.span>
                </Link>
              ))}
            </nav>

            {/* Right: Social Links & Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                {[
                  { icon: Github, href: "https://github.com", label: "GitHub" },
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;