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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Top Left Corner */}
              <motion.div
                className="absolute top-0 left-0 w-5 h-5"
                style={{
                  borderTop: `2px solid ${borderColor}`,
                  borderLeft: `2px solid ${borderColor}`,
                }}
                initial={{ x: -3, y: -3 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Top Right Corner */}
              <motion.div
                className="absolute top-0 right-0 w-5 h-5"
                style={{
                  borderTop: `2px solid ${borderColor}`,
                  borderRight: `2px solid ${borderColor}`,
                }}
                initial={{ x: 3, y: -3 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Bottom Left Corner */}
              <motion.div
                className="absolute bottom-0 left-0 w-5 h-5"
                style={{
                  borderBottom: `2px solid ${borderColor}`,
                  borderLeft: `2px solid ${borderColor}`,
                }}
                initial={{ x: -3, y: 3 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Bottom Right Corner */}
              <motion.div
                className="absolute bottom-0 right-0 w-5 h-5"
                style={{
                  borderBottom: `2px solid ${borderColor}`,
                  borderRight: `2px solid ${borderColor}`,
                }}
                initial={{ x: 3, y: 3 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TrueFocus;