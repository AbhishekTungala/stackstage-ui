import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TiltedCardProps {
  imageSrc?: string;
  captionText?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  captionText,
  rotateAmplitude = 12,
  scaleOnHover = 1.2,
  displayOverlayContent = true,
  overlayContent,
  children,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = ((mouseY - centerY) / centerY) * rotateAmplitude;
    const rotateY = ((mouseX - centerX) / centerX) * rotateAmplitude;

    setMousePosition({ x: rotateY, y: -rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`tilted-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{
        rotateX: mousePosition.y,
        rotateY: mousePosition.x,
        scale: isHovered ? scaleOnHover : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="card-inner relative rounded-2xl overflow-hidden glass-card">
        {imageSrc && (
          <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl overflow-hidden">
            <img 
              src={imageSrc} 
              alt={captionText || "Card image"} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {children && (
          <div className="p-6">
            {children}
          </div>
        )}

        {/* Overlay Content */}
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center text-white p-6">
              {overlayContent}
            </div>
          </motion.div>
        )}

        {captionText && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass-card">
              <p className="text-sm font-medium text-foreground">{captionText}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TiltedCard;