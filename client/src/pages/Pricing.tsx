import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, X, Zap, Shield, Users, Building2, Crown, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Aurora from "@/components/ui/aurora";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small teams and individual developers",
    price: 29,
    period: "per month",
    icon: Zap,
    badge: null,
    features: [
      { name: "Up to 5 cloud resources", included: true },
      { name: "Basic security scans", included: true },
      { name: "Cost optimization insights", included: true },
      { name: "Email support", included: true },
      { name: "Basic reporting", included: true },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
      { name: "Priority support", included: false },
      { name: "Advanced compliance checks", included: false },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and mid-size companies",
    price: 99,
    period: "per month",
    icon: Shield,
    badge: "Most Popular",
    features: [
      { name: "Up to 100 cloud resources", included: true },
      { name: "Advanced security analysis", included: true },
      { name: "Real-time cost tracking", included: true },
      { name: "Priority email & chat support", included: true },
      { name: "Advanced reporting & analytics", included: true },
      { name: "Full API access", included: true },
      { name: "Slack/Teams integrations", included: true },
      { name: "Custom compliance frameworks", included: false },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex infrastructure",
    price: 299,
    period: "per month",
    icon: Building2,
    badge: "Advanced",
    features: [
      { name: "Unlimited cloud resources", included: true },
      { name: "Enterprise-grade security", included: true },
      { name: "Advanced cost optimization", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Custom reporting & dashboards", included: true },
      { name: "Full API & webhook access", included: true },
      { name: "All integrations included", included: true },
      { name: "Custom compliance frameworks", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Aurora Background */}
      <div className="relative">
        <Aurora intensity={0.3} speed={1.5} className="aurora-background" />
        
        <main className="relative">
          {/* Hero Section */}
          <section className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge variant="outline" className="mb-6 px-4 py-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Transparent Pricing
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent leading-tight">
                    Simple, Scalable Pricing
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Choose the perfect plan for your cloud infrastructure needs. 
                    Start with a 14-day free trial, no credit card required.
                  </p>
                </motion.div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-6">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="relative"
                  >
                    <Card className={`p-8 h-full relative overflow-hidden ${
                      plan.popular 
                        ? 'ring-2 ring-primary shadow-2xl scale-105' 
                        : 'hover:shadow-xl'
                    } transition-all duration-300`}>
                      {plan.badge && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge 
                            variant="default" 
                            className={`px-2 py-0.5 text-[10px] font-medium shadow-md ${
                              plan.badge === "Most Popular" 
                                ? 'bg-gradient-to-r from-primary to-primary-glow text-white border-none' 
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none'
                            }`}
                          >
                            {plan.badge}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4">
                          <plan.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-muted-foreground mb-4">{plan.description}</p>
                        <div className="mb-6">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.period}</span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                            )}
                            <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto">
                        {plan.name === "Enterprise" ? (
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="w-full"
                            asChild
                          >
                            <Link href="/contact">
                              {plan.cta}
                            </Link>
                          </Button>
                        ) : (
                          <Button 
                            size="lg" 
                            className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                            variant={plan.popular ? "default" : "outline"}
                            asChild
                          >
                            <Link href="/signup">
                              {plan.cta}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Section */}
              <motion.div
                className="mt-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                  <div className="glass-card">
                    <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                    <p className="text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.
                    </p>
                  </div>
                  <div className="glass-card">
                    <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                    <p className="text-muted-foreground">
                      All plans come with a 14-day free trial. No credit card required to get started.
                    </p>
                  </div>
                  <div className="glass-card">
                    <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                    <p className="text-muted-foreground">
                      We accept all major credit cards, PayPal, and wire transfers for Enterprise customers.
                    </p>
                  </div>
                  <div className="glass-card">
                    <h3 className="font-semibold mb-2">Do you offer custom enterprise solutions?</h3>
                    <p className="text-muted-foreground">
                      Yes, we provide custom solutions for large enterprises. Contact our sales team for more details.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;