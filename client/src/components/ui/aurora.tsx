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
      {/* Primary Aurora with motion blur */}
      <motion.div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, #7c3aed 0%, transparent 60%),
            radial-gradient(circle at 50% 90%, #06b6d4 0%, transparent 60%)
          `,
          filter: 'blur(120px)',
          zIndex: -10,
        }}
        animate={{
          background: [
            `
              radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 60%),
              radial-gradient(circle at 70% 70%, #7c3aed 0%, transparent 60%),
              radial-gradient(circle at 50% 90%, #06b6d4 0%, transparent 60%)
            `,
            `
              radial-gradient(circle at 70% 20%, #7c3aed 0%, transparent 60%),
              radial-gradient(circle at 30% 80%, #06b6d4 0%, transparent 60%),
              radial-gradient(circle at 90% 50%, #6366f1 0%, transparent 60%)
            `,
            `
              radial-gradient(circle at 20% 70%, #06b6d4 0%, transparent 60%),
              radial-gradient(circle at 80% 30%, #8b5cf6 0%, transparent 60%),
              radial-gradient(circle at 40% 10%, #3b82f6 0%, transparent 60%)
            `,
            `
              radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 60%),
              radial-gradient(circle at 70% 70%, #7c3aed 0%, transparent 60%),
              radial-gradient(circle at 50% 90%, #06b6d4 0%, transparent 60%)
            `,
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Additional subtle floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${colorStops[i % colorStops.length]}40, transparent)`,
            filter: 'blur(60px)',
            width: '300px',
            height: '300px',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          initial={{
            x: `${20 + i * 30}%`,
            y: `${30 + i * 20}%`,
          }}
        />
      ))}
      
      {/* Pulsing center glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: -5 }}
      >
        <motion.div
          className="rounded-full"
          style={{
            background: `radial-gradient(circle, #6366f130, transparent)`,
            filter: 'blur(100px)',
            width: '600px',
            height: '600px',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Aurora;