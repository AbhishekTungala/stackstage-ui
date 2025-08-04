import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface AnimatedListProps {
  items: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    if (enableArrowNavigation) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % items.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          onItemSelect?.(items[selectedIndex], selectedIndex);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enableArrowNavigation, items, selectedIndex, onItemSelect]);

  const handleItemClick = (item: string, index: number) => {
    setSelectedIndex(index);
    onItemSelect?.(item, index);
  };

  return (
    <div className={`space-y-2 ${displayScrollbar ? 'max-h-96 overflow-y-auto' : ''}`}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`
              relative p-4 rounded-xl cursor-pointer transition-all duration-200
              ${showGradients ? 'glass-subtle' : 'bg-muted/50'}
              ${selectedIndex === index ? 'ring-2 ring-primary' : ''}
              ${hoveredIndex === index ? 'scale-[1.02] shadow-lg' : ''}
            `}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
            onClick={() => handleItemClick(item, index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`
                    w-2 h-2 rounded-full transition-colors duration-200
                    ${selectedIndex === index ? 'bg-primary' : 'bg-muted-foreground/40'}
                  `}
                  animate={{
                    scale: selectedIndex === index ? 1.2 : 1,
                  }}
                />
                <span className={`
                  font-medium transition-colors duration-200
                  ${selectedIndex === index ? 'text-primary' : 'text-foreground'}
                `}>
                  {item}
                </span>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: selectedIndex === index ? 1 : hoveredIndex === index ? 0.7 : 0,
                  scale: selectedIndex === index ? 1 : hoveredIndex === index ? 0.8 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {selectedIndex === index ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.div>
            </div>

            {showGradients && (selectedIndex === index || hoveredIndex === index) && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedList;