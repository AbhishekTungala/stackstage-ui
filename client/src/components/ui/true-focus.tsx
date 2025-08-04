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
          
          {/* Camera focus corners around active word */}
          {focusedIndex === index && (
            <motion.div
              className="absolute -inset-3 pointer-events-none z-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: animationDuration, ease: "easeOut" }}
            >
              {/* Top Left Corner */}
              <motion.div
                className="absolute top-0 left-0 w-6 h-6"
                style={{
                  borderTop: `3px solid ${borderColor}`,
                  borderLeft: `3px solid ${borderColor}`,
                  borderTopLeftRadius: '4px',
                  boxShadow: `0 0 10px ${glowColor}`,
                }}
                initial={{ x: -5, y: -5 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Top Right Corner */}
              <motion.div
                className="absolute top-0 right-0 w-6 h-6"
                style={{
                  borderTop: `3px solid ${borderColor}`,
                  borderRight: `3px solid ${borderColor}`,
                  borderTopRightRadius: '4px',
                  boxShadow: `0 0 10px ${glowColor}`,
                }}
                initial={{ x: 5, y: -5 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Bottom Left Corner */}
              <motion.div
                className="absolute bottom-0 left-0 w-6 h-6"
                style={{
                  borderBottom: `3px solid ${borderColor}`,
                  borderLeft: `3px solid ${borderColor}`,
                  borderBottomLeftRadius: '4px',
                  boxShadow: `0 0 10px ${glowColor}`,
                }}
                initial={{ x: -5, y: 5 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Bottom Right Corner */}
              <motion.div
                className="absolute bottom-0 right-0 w-6 h-6"
                style={{
                  borderBottom: `3px solid ${borderColor}`,
                  borderRight: `3px solid ${borderColor}`,
                  borderBottomRightRadius: '4px',
                  boxShadow: `0 0 10px ${glowColor}`,
                }}
                initial={{ x: 5, y: 5 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Subtle background glow */}
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${glowColor}20, transparent)`,
                  boxShadow: `inset 0 0 20px ${glowColor}30`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TrueFocus;