import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  className?: string;
}

const Dock: React.FC<DockProps> = ({
  items,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
  className = ""
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getItemSize = (index: number) => {
    if (hoveredIndex === null) return baseItemSize;
    
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return magnification;
    if (distance === 1) return baseItemSize + (magnification - baseItemSize) * 0.5;
    if (distance === 2) return baseItemSize + (magnification - baseItemSize) * 0.25;
    
    return baseItemSize;
  };

  return (
    <div className={`dock-container ${className}`}>
      <motion.div
        className="dock"
        style={{ height: panelHeight }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {items.map((item, index) => {
          const size = getItemSize(index);
          
          return (
            <motion.div
              key={index}
              className="dock-item group relative"
              style={{
                width: size,
                height: size,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={item.onClick}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                width: size,
                height: size,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="w-full h-full flex items-center justify-center text-foreground hover:text-primary transition-colors">
                {item.icon}
              </div>

              {/* Tooltip */}
              <motion.div
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                whileHover={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card py-1 px-2 text-xs text-foreground whitespace-nowrap">
                  {item.label}
                </div>
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-primary/20 blur-md"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Dock;