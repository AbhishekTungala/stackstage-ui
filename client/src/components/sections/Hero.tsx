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
              <DialogContent className="max-w-6xl max-h-[90vh] p-0 border-none shadow-none overflow-y-auto bg-black">
                {/* Cool Profile Dialog Background with Moving Blurred Spots */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Full black background */}
                  <div className="absolute inset-0 bg-black" />
                  
                  {/* Ultra bright animated gradient spots covering entire dialog */}
                  <div 
                    className="absolute w-96 h-96 rounded-full opacity-80 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(147, 51, 234, 1) 0%, transparent 50%)',
                      top: '5%',
                      left: '15%',
                      animation: 'float-1 8s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute w-80 h-80 rounded-full opacity-75 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 1) 0%, transparent 50%)',
                      top: '60%',
                      right: '10%',
                      animation: 'float-2 10s ease-in-out infinite reverse'
                    }}
                  />
                  <div 
                    className="absolute w-72 h-72 rounded-full opacity-70 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.9) 0%, transparent 50%)',
                      bottom: '15%',
                      left: '5%',
                      animation: 'float-3 12s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute w-64 h-64 rounded-full opacity-65 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.9) 0%, transparent 50%)',
                      top: '25%',
                      right: '35%',
                      animation: 'float-4 9s ease-in-out infinite reverse'
                    }}
                  />
                  <div 
                    className="absolute w-88 h-88 rounded-full opacity-60 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, transparent 50%)',
                      top: '45%',
                      left: '60%',
                      animation: 'float-5 11s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute w-56 h-56 rounded-full opacity-55 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, transparent 50%)',
                      bottom: '45%',
                      right: '5%',
                      animation: 'float-6 7s ease-in-out infinite reverse'
                    }}
                  />
                  <div 
                    className="absolute w-68 h-68 rounded-full opacity-50 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.7) 0%, transparent 50%)',
                      top: '75%',
                      left: '40%',
                      animation: 'float-7 13s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute w-52 h-52 rounded-full opacity-45 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(251, 146, 60, 0.7) 0%, transparent 50%)',
                      top: '15%',
                      left: '75%',
                      animation: 'float-8 6s ease-in-out infinite reverse'
                    }}
                  />
                  {/* Additional bright spots for full coverage */}
                  <div 
                    className="absolute w-60 h-60 rounded-full opacity-40 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(217, 70, 239, 0.6) 0%, transparent 50%)',
                      top: '35%',
                      left: '2%',
                      animation: 'float-9 14s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute w-75 h-75 rounded-full opacity-35 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(14, 165, 233, 0.6) 0%, transparent 50%)',
                      bottom: '5%',
                      right: '30%',
                      animation: 'float-10 8s ease-in-out infinite reverse'
                    }}
                  />
                  <div 
                    className="absolute w-48 h-48 rounded-full opacity-30 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 50%)',
                      top: '50%',
                      left: '85%',
                      animation: 'float-11 15s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute w-84 h-84 rounded-full opacity-25 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(245, 101, 101, 0.5) 0%, transparent 50%)',
                      bottom: '60%',
                      left: '30%',
                      animation: 'float-12 9s ease-in-out infinite reverse'
                    }}
                  />
                </div>
                
                {/* CSS animations for floating spots */}
                <style jsx>{`
                  @keyframes float-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(40px, -30px) scale(1.2); }
                    50% { transform: translate(-30px, 40px) scale(0.8); }
                    75% { transform: translate(30px, 30px) scale(1.1); }
                  }
                  @keyframes float-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-35px, 35px) scale(1.25); }
                    66% { transform: translate(35px, -25px) scale(0.75); }
                  }
                  @keyframes float-3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    20% { transform: translate(25px, 35px) scale(1.3); }
                    40% { transform: translate(-40px, -20px) scale(0.7); }
                    60% { transform: translate(30px, -35px) scale(1.15); }
                    80% { transform: translate(-25px, 25px) scale(0.85); }
                  }
                  @keyframes float-4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-30px, -40px) scale(1.4); }
                  }
                  @keyframes float-5 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    30% { transform: translate(-25px, -25px) scale(1.1); }
                    60% { transform: translate(35px, 20px) scale(0.9); }
                  }
                  @keyframes float-6 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    40% { transform: translate(20px, -35px) scale(1.2); }
                    80% { transform: translate(-30px, 25px) scale(0.8); }
                  }
                  @keyframes float-7 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(-40px, 20px) scale(1.15); }
                    75% { transform: translate(25px, -30px) scale(0.85); }
                  }
                  @keyframes float-8 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, 35px) scale(1.3); }
                  }
                  @keyframes float-9 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(45px, -20px) scale(1.2); }
                    66% { transform: translate(-25px, 40px) scale(0.8); }
                  }
                  @keyframes float-10 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-35px, -25px) scale(1.4); }
                  }
                  @keyframes float-11 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(-30px, 30px) scale(1.1); }
                    75% { transform: translate(20px, -40px) scale(0.9); }
                  }
                  @keyframes float-12 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    40% { transform: translate(35px, 25px) scale(1.25); }
                    80% { transform: translate(-40px, -30px) scale(0.75); }
                  }
                `}</style>
                
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