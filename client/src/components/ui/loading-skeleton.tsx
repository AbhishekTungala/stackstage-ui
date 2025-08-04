import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, Zap, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisLoadingProps {
  currentStep: string;
  progress: number;
  isAnalyzing: boolean;
  className?: string;
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({
  currentStep,
  progress,
  isAnalyzing,
  className
}) => {
  const steps = [
    { id: 'validating', label: 'Validating Configuration', icon: CheckCircle },
    { id: 'parsing', label: 'Parsing Infrastructure', icon: Brain },
    { id: 'analyzing', label: 'AI Analysis in Progress', icon: Zap },
    { id: 'optimizing', label: 'Generating Recommendations', icon: Loader2 },
    { id: 'complete', label: 'Analysis Complete', icon: CheckCircle },
    { id: 'error', label: 'Analysis Failed', icon: AlertCircle }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const getStepStatus = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex();
    if (currentStep === 'error') return stepIndex === steps.length - 1 ? 'error' : 'pending';
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  if (!isAnalyzing && currentStep !== 'error') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card p-6 space-y-6 border border-white/10",
        className
      )}
    >
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {currentStep !== 'error' && (
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentStep === 'error' ? 'Analysis Failed' : 'AI Analysis Running'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.label || 'Processing...'}
            </p>
          </div>
        </div>
        
        {currentStep === 'error' && (
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {currentStep !== 'error' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Step Indicators */}
      <div className="space-y-3">
        {steps.slice(0, -1).map((step, index) => {
          const status = getStepStatus(index);
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                status === 'active' && "bg-blue-500/10 border border-blue-500/20",
                status === 'complete' && "bg-green-500/10 border border-green-500/20",
                status === 'pending' && "bg-white/5 border border-white/10"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                status === 'active' && "bg-blue-500 text-white",
                status === 'complete' && "bg-green-500 text-white",
                status === 'pending' && "bg-white/10 text-muted-foreground"
              )}>
                {status === 'active' && step.id === 'analyzing' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === 'active' && step.id === 'optimizing' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  status === 'active' && "text-blue-400",
                  status === 'complete' && "text-green-400",
                  status === 'pending' && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>
              {status === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Error State */}
      {currentStep === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Analysis Failed</p>
              <p className="text-xs text-red-300/80">Please check your configuration and try again</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Real-time Stats */}
      {currentStep !== 'error' && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Resources Scanned</p>
            <p className="text-lg font-semibold text-foreground">{Math.round(progress * 0.15)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Issues Found</p>
            <p className="text-lg font-semibold text-foreground">{Math.round(progress * 0.08)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Time Elapsed</p>
            <p className="text-lg font-semibold text-foreground">{Math.round(progress * 0.05)}s</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface ChatLoadingProps {
  className?: string;
}

export const ChatLoading: React.FC<ChatLoadingProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg",
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">AI is thinking</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};