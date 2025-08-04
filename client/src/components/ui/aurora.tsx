import React from 'react';
import { motion } from 'framer-motion';

interface AuroraProps {
  colorStops?: string[];
  intensity?: number;
  speed?: number;
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = [
    "#3b82f6", // Primary Blue
    "#7c3aed", // Violet
    "#06b6d4", // Cyan
    "#6366f1", // Indigo  
    "#8b5cf6"  // Purple
  ],
  intensity = 0.4,
  speed = 1.2,
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary Aurora with professional softness */}
      <motion.div
        className="absolute inset-0 z-[-1] pointer-events-none mix-blend-screen"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.2) 0%, transparent 60%),
            radial-gradient(circle at 50% 90%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)
          `,
          filter: 'blur(100px)',
          opacity: 0.4,
        }}
        animate={{
          background: [
            `
              radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 50% 90%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)
            `,
            `
              radial-gradient(circle at 70% 20%, rgba(124, 58, 237, 0.25) 0%, transparent 60%),
              radial-gradient(circle at 30% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 90% 50%, rgba(99, 102, 241, 0.18) 0%, transparent 60%)
            `,
            `
              radial-gradient(circle at 20% 70%, rgba(6, 182, 212, 0.22) 0%, transparent 60%),
              radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.18) 0%, transparent 60%),
              radial-gradient(circle at 40% 10%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)
            `,
            `
              radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 50% 90%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)
            `,
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Subtle floating orbs with reduced intensity */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full z-[-2]"
          style={{
            background: `radial-gradient(circle, rgba(${i === 0 ? '59, 130, 246' : i === 1 ? '124, 58, 237' : '6, 182, 212'}, 0.08), transparent)`,
            filter: 'blur(80px)',
            width: '400px',
            height: '400px',
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 4,
          }}
          initial={{
            x: `${25 + i * 25}%`,
            y: `${40 + i * 15}%`,
          }}
        />
      ))}
      
      {/* Very subtle center breathing glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-[-3]"
      >
        <motion.div
          className="rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(99, 102, 241, 0.05), transparent)`,
            filter: 'blur(120px)',
            width: '800px',
            height: '800px',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Aurora;