import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Zap, 
  FileText, 
  GitBranch,
  Cloud,
  MessageSquare,
  BarChart3,
  CheckCircle
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your infrastructure patterns and identify optimization opportunities."
    },
    {
      icon: Shield,
      title: "Security Scoring",
      description: "Comprehensive security assessment with actionable recommendations to strengthen your cloud posture."
    },
    {
      icon: TrendingUp,
      title: "Cost Optimization", 
      description: "Identify cost-saving opportunities and right-size your resources for maximum efficiency."
    },
    {
      icon: Zap,
      title: "Performance Insights",
      description: "Get detailed performance metrics and optimization suggestions to improve application speed."
    },
    {
      icon: FileText,
      title: "Infrastructure as Code",
      description: "Receive ready-to-use Terraform and CloudFormation templates for implementing fixes."
    },
    {
      icon: GitBranch,
      title: "Architecture Diagrams",
      description: "Auto-generated visual diagrams help you understand your infrastructure topology and dependencies."
    },
    {
      icon: Cloud,
      title: "Multi-Cloud Support",
      description: "Works with AWS, Google Cloud, Azure, and hybrid cloud environments seamlessly."
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Chat with your infrastructure using natural language to get instant insights and recommendations."
    },
    {
      icon: BarChart3,
      title: "Real-time Monitoring",
      description: "Continuous monitoring and drift detection to keep your architecture optimized over time."
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 glass-card mb-6">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Everything you need to
            <span className="block text-gradient">optimize your cloud</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From architecture analysis to automated fixes, StackStage provides comprehensive 
            tools to ensure your cloud infrastructure is secure, efficient, and scalable.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="glass-card group hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass-card inline-block p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to optimize your infrastructure?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started with a free analysis of your cloud architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Start Free Analysis
              </button>
              <button className="border border-border px-6 py-3 rounded-xl font-medium hover:bg-accent transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;