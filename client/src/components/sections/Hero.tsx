import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Shield, DollarSign, TrendingUp } from "lucide-react";
import Aurora from "@/components/ui/aurora";
import TrueFocus from "@/components/ui/true-focus";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Aurora Background */}
      <Aurora 
        intensity={0.3}
        speed={1.2}
        className="aurora-background"
      />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Cloud Architecture Analysis Platform
          </div>
          
          {/* Animated Heading */}
          <div className="mb-8">
            <TrueFocus 
              sentence="Build with Confidence"
              manualMode={false}
              blurAmount={5}
              borderColor="#6366f1"
              glowColor="rgba(99, 102, 241, 0.6)"
              animationDuration={1.2}
              pauseBetweenAnimations={1.5}
            />
          </div>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Analyze your cloud infrastructure for security vulnerabilities, 
            cost optimization opportunities, and performance improvements.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/analyze">
              <Button size="lg" className="px-8 py-6 text-lg" variant="hero">
                Start Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Animated Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { icon: Shield, value: "99.9%", label: "Security Detection Rate", delay: 0.9 },
              { icon: DollarSign, value: "30%", label: "Average Cost Savings", delay: 1.0 },
              { icon: TrendingUp, value: "2x", label: "Performance Improvement", delay: 1.1 }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: stat.delay, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;