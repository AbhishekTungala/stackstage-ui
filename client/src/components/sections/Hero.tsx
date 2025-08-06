import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Shield, DollarSign, TrendingUp, User } from "lucide-react";
import Aurora from "@/components/ui/aurora";
import TrueFocus from "@/components/ui/true-focus";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ProfileCard from "@/components/ui/profile-card";
import ProfileManagementPanel from "@/components/ui/profile-management-panel";

const Hero = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Demo user data for the profile card
  const demoUser = {
    id: "demo_user_123",
    email: "demo@stackstage.dev",
    firstName: "Alex",
    lastName: "Developer", 
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    jobTitle: "Senior Cloud Architect",
    company: "TechCorp Inc.",
    location: "San Francisco, CA"
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Aurora Background with smooth fade */}
      <Aurora 
        className="aurora-background"
        fadeHeight={300}
        fadeDirection="bottom"
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/analyze">
              <Button size="lg" className="px-8 py-6 text-lg" variant="hero">
                Start Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  <User className="mr-2 w-5 h-5" />
                  View Profile Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] p-0 border-none shadow-none overflow-y-auto bg-slate-950 dark:bg-black">
                {/* Custom Profile Dialog Aurora Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Dark base with profile-specific aurora gradients */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
                  
                  {/* Profile Aurora Effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-blue-900/25" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-900/20 to-cyan-900/15" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-800/10 to-transparent" />
                  
                  {/* Smooth bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>
                
                <div className="relative flex flex-col items-center justify-center min-h-[80vh] py-8">
                  {/* Centered Profile Card */}
                  <div className="mb-12 z-10">
                    <ProfileCard 
                      avatarUrl={demoUser.profileImageUrl}
                      name={`${demoUser.firstName} ${demoUser.lastName}`}
                      title={demoUser.jobTitle}
                      handle={demoUser.email.split('@')[0]}
                      status="Online"
                      contactText="Edit Profile"
                      onContactClick={() => {}}
                      showUserInfo={true}
                      enableTilt={true}
                    />
                  </div>
                  
                  {/* Premium Profile Management Panel */}
                  <div className="w-full max-w-4xl mx-auto z-10">
                    <ProfileManagementPanel demoUser={demoUser} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Demo Info */}
          <p className="text-sm text-muted-foreground mb-8">
            ✨ Click "View Profile Demo" to see the premium 3D profile card with tilt effects
          </p>
          
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