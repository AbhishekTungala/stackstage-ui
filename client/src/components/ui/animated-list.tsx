import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface AnimatedListProps {
  items: string[] | Array<{ label: string; description?: string; icon?: React.ReactNode }>;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
  className?: string;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  className = ""
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const normalizedItems = items.map(item => 
    typeof item === 'string' ? { label: item } : item
  );

  return (
    <div className={`space-y-2 ${displayScrollbar ? 'max-h-80 overflow-y-auto' : ''} ${className}`}>
      <AnimatePresence>
        {normalizedItems.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          const isSelected = selectedIndex === index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                className={`
                  p-4 rounded-xl cursor-pointer transition-all duration-300
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                  ${showGradients ? 'glass-card hover:bg-white/10' : 'bg-card hover:bg-accent'}
                `}
                onClick={() => {
                  setSelectedIndex(isSelected ? null : index);
                  if (item.description) toggleExpanded(index);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.icon && (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        {item.icon}
                      </div>
                    )}
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                  
                  {enableArrowNavigation && item.description && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && item.description && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Gradient border effect */}
              {showGradients && isSelected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-primary-glow/20 to-primary/20 blur-sm -z-10" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedList;