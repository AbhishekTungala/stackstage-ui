import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Zap, Github, Mail, Eye, EyeOff, Shield, Users, Star, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import Aurora from "@/components/ui/aurora";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Aurora Background */}
      <Aurora
        className="absolute inset-0 z-0"
      />
      
      {/* Left Side - Branding & Features */}
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
                Welcome back to the
                <span className="block bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
                  future of cloud architecture
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Continue optimizing your infrastructure with AI-powered insights and enterprise-grade security.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Trusted by 10,000+ developers worldwide</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center space-x-2 bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                  <Shield className="w-3 h-3" />
                  <span>SOC 2 Compliant</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                  <Users className="w-3 h-3" />
                  <span>Enterprise Ready</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                  <Star className="w-3 h-3" />
                  <span>99.9% Uptime</span>
                </Badge>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              {[
                "AI-powered architecture analysis",
                "Real-time security vulnerability detection",
                "Cost optimization recommendations",
                "Enterprise-grade compliance reporting"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
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

            {/* Sign Up Link */}
            <Link to="/signup" className="group">
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-subtle border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                Create account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="w-full max-w-md space-y-8 mt-16">

          {/* Login Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="glass-card border-border/50 shadow-2xl backdrop-blur-xl bg-background/90">
              <CardHeader className="text-center space-y-4">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-3xl font-bold">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to your StackStage account
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
                      Or continue with email
                    </span>
                  </div>
                </motion.div>

                {/* Email & Password Form */}
                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 glass-subtle border-border/50 focus:border-primary/50 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Link
                        to="/auth/reset"
                        className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 glass-subtle border-border/50 focus:border-primary/50 pr-12 transition-all duration-300"
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
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary via-primary-glow to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg transition-all duration-300"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign in to StackStage</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.form>

                {/* Sign Up Link */}
                <motion.div variants={itemVariants} className="text-center">
                  <span className="text-sm text-muted-foreground">Don't have an account? </span>
                  <Link to="/signup" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors duration-200">
                    Sign up for free
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
              By signing in, you agree to our{" "}
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

export default Login;