import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Zap, Github, Mail, Eye, EyeOff, CheckCircle2, Shield, Users, Star, ArrowRight, Sparkles, TrendingUp, Award, ArrowLeft } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import Aurora from "@/components/ui/aurora";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Aurora Background */}
      <Aurora
        className="absolute inset-0 z-0"
      />
      
      {/* Left Side - Benefits & Social Proof */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-background/95 via-background/90 to-background/80 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-12">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary-glow to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-lg opacity-50" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              StackStage
            </span>
          </Link>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Start building the
                <span className="block bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                  next generation
                </span>
                of cloud architecture
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Join thousands of developers and enterprises who trust StackStage for their cloud infrastructure optimization.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered Analysis",
                  description: "Get intelligent insights from our advanced AI algorithms"
                },
                {
                  icon: TrendingUp,
                  title: "Cost Optimization",
                  description: "Reduce cloud costs by up to 40% with smart recommendations"
                },
                {
                  icon: Award,
                  title: "Enterprise Security",
                  description: "SOC 2 compliant with enterprise-grade security features"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-background/20 backdrop-blur-sm border border-border/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Free 14-day trial • No credit card required</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center space-x-2 bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                  <Shield className="w-3 h-3" />
                  <span>SOC 2 Type II</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                  <Users className="w-3 h-3" />
                  <span>10K+ Users</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                  <Star className="w-3 h-3" />
                  <span>4.9/5 Rating</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Navigation Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 p-6 z-10"
        >
          <div className="flex items-center justify-between">
            {/* Back to Home Button */}
            <Link to="/" className="group">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
                Back to Home
              </Button>
            </Link>

            {/* Mobile Logo - Centered */}
            <div className="lg:hidden">
              <Link to="/" className="inline-flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  StackStage
                </span>
              </Link>
            </div>

            {/* Sign In Link */}
            <Link to="/login" className="group">
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-subtle border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                Sign in
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="w-full max-w-md space-y-8 mt-16">

          {/* Signup Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="glass-card border-border/50 shadow-2xl backdrop-blur-xl bg-background/90">
              <CardHeader className="text-center space-y-4">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-3xl font-bold">
                    Create your account
                  </CardTitle>
                  <CardDescription className="text-base">
                    Start your cloud optimization journey today
                  </CardDescription>
                </motion.div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* OAuth Buttons */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 glass-subtle border-border/50 hover:border-primary/30 transition-all duration-300" 
                    size="lg"
                  >
                    <Github className="mr-3 w-5 h-5" />
                    Continue with GitHub
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 glass-subtle border-border/50 hover:border-primary/30 transition-all duration-300" 
                    size="lg"
                  >
                    <SiGoogle className="mr-3 w-5 h-5" />
                    Continue with Google
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="opacity-30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background/90 px-4 text-muted-foreground font-medium">
                      Or create with email
                    </span>
                  </div>
                </motion.div>

                {/* Signup Form */}
                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="h-11 glass-subtle border-border/50 focus:border-primary/50 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-11 glass-subtle border-border/50 focus:border-primary/50 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-11 glass-subtle border-border/50 focus:border-primary/50 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-11 glass-subtle border-border/50 focus:border-primary/50 pr-12 transition-all duration-300"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="space-y-2 mt-3">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${
                                req.met ? "text-green-500" : "text-muted-foreground/40"
                              }`}
                            />
                            <span
                              className={`text-xs ${
                                req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              }`}
                            >
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreeToTerms: checked as boolean })
                      }
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:text-primary/80 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary via-primary-glow to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg transition-all duration-300"
                    size="lg"
                    disabled={!formData.agreeToTerms || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Create your account</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.form>

                {/* Login Link */}
                <motion.div variants={itemVariants} className="text-center">
                  <span className="text-sm text-muted-foreground">Already have an account? </span>
                  <Link to="/login" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors duration-200">
                    Sign in instead
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;