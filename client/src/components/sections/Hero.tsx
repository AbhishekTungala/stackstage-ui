import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, ArrowRight, Shield, DollarSign, TrendingUp } from "lucide-react";
import Aurora from "@/components/ui/aurora";

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
          
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Build with
            <span className="text-gradient block">Confidence</span>
          </h1>
          
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
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">99.9%</h3>
              <p className="text-muted-foreground">Security Detection Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">30%</h3>
              <p className="text-muted-foreground">Average Cost Savings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">2x</h3>
              <p className="text-muted-foreground">Performance Improvement</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;