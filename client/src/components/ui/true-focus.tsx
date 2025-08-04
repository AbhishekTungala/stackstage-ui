import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = "#6366f1",
  animationDuration = 2,
  pauseBetweenAnimations = 1,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const words = sentence.split(' ');

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setFocusedIndex((prev) => {
          if (prev >= words.length - 1) {
            return -1; // Reset to show all words blurred
          }
          return prev + 1;
        });
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [words.length, manualMode, animationDuration, pauseBetweenAnimations]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 glass-subtle p-6 rounded-2xl backdrop-blur-xl">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="text-3xl md:text-4xl font-bold relative inline-block"
          style={{
            filter: focusedIndex === index ? 'none' : `blur(${blurAmount}px)`,
            transition: `filter ${animationDuration}s ease-in-out`,
            color: focusedIndex === index ? borderColor : 'inherit',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {word}
          {focusedIndex === index && (
            <motion.div
              className="absolute -inset-1 rounded-lg"
              style={{
                border: `2px solid ${borderColor}`,
                background: `linear-gradient(135deg, ${borderColor}10, transparent)`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
};

export default TrueFocus;