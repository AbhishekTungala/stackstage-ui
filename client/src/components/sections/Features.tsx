import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  FileText, 
  Share2,
  Eye,
  Wrench,
  AlertTriangle,
  BarChart3,
  Lock,
  Cloud
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Identify vulnerabilities, compliance issues, and security misconfigurations across your cloud infrastructure.",
      features: ["Vulnerability scanning", "Compliance checks", "Risk assessment", "Security recommendations"]
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      description: "Discover opportunities to reduce cloud spending without compromising performance or reliability.",
      features: ["Resource rightsizing", "Unused resource detection", "Reserved instance recommendations", "Billing optimization"]
    },
    {
      icon: Zap,
      title: "Performance Insights",
      description: "Analyze your infrastructure performance and get actionable recommendations for improvements.",
      features: ["Performance bottlenecks", "Scaling recommendations", "Load balancing optimization", "Network analysis"]
    },
    {
      icon: TrendingUp,
      title: "Scalability Planning",
      description: "Plan for future growth with intelligent scaling recommendations and capacity planning.",
      features: ["Auto-scaling setup", "Capacity planning", "Growth projections", "Architecture recommendations"]
    },
    {
      icon: Eye,
      title: "Visual Architecture",
      description: "Generate interactive diagrams of your cloud infrastructure with highlighted issues and improvements.",
      features: ["Interactive diagrams", "Architecture visualization", "Dependency mapping", "Issue highlighting"]
    },
    {
      icon: Share2,
      title: "Team Collaboration",
      description: "Share reports and collaborate with your team on infrastructure improvements and decisions.",
      features: ["Report sharing", "Team collaboration", "Export capabilities", "Integration support"]
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive
            <span className="text-gradient"> Cloud Analysis</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to optimize, secure, and scale your cloud infrastructure
            with confidence and precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover-scale group h-full">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-8">
            Ready to optimize your cloud infrastructure?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/analyze" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Start Free Analysis
            </a>
            <a href="/login" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;