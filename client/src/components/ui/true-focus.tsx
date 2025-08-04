import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = "#6366f1",
  glowColor = "rgba(99, 102, 241, 0.6)",
  animationDuration = 0.7,
  pauseBetweenAnimations = 1,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const words = sentence.split(' ');

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setFocusedIndex((prev) => {
          return (prev + 1) % words.length;
        });
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [words.length, manualMode, animationDuration, pauseBetweenAnimations]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setFocusedIndex(index);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {words.map((word, index) => (
        <motion.div
          key={index}
          className="relative inline-block"
          onMouseEnter={() => handleMouseEnter(index)}
          whileHover={manualMode ? { scale: 1.05 } : {}}
        >
          <motion.span
            className="font-black text-4xl md:text-6xl leading-tight relative z-10 cursor-default select-none"
            style={{
              filter: focusedIndex === index ? 'none' : `blur(${blurAmount}px)`,
              transition: `all ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
              color: focusedIndex === index ? 'transparent' : 'currentColor',
              backgroundImage: focusedIndex === index 
                ? `linear-gradient(135deg, ${borderColor}, ${borderColor}dd)` 
                : 'none',
              backgroundClip: focusedIndex === index ? 'text' : 'unset',
              WebkitBackgroundClip: focusedIndex === index ? 'text' : 'unset',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {word}
          </motion.span>
          
          {/* Glow border box around active word */}
          {focusedIndex === index && (
            <motion.div
              className="absolute -inset-2 rounded-xl pointer-events-none z-0"
              style={{
                border: `2px solid ${borderColor}`,
                background: `linear-gradient(135deg, ${glowColor}, transparent)`,
                boxShadow: `
                  0 0 20px ${glowColor},
                  0 0 40px ${glowColor}40,
                  inset 0 1px 0 rgba(255,255,255,0.1)
                `,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: animationDuration, ease: "easeOut" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TrueFocus;