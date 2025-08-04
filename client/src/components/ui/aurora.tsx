import React, { useEffect, useRef } from 'react';

interface AuroraProps {
  colorStops?: string[];
  intensity?: number;
  speed?: number;
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = [
    "#6366f1", // Indigo
    "#9333ea", // Purple  
    "#14b8a6", // Teal
    "#ec4899", // Pink
    "#f59e0b"  // Amber
  ],
  intensity = 0.4,
  speed = 0.8,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    const createGradientBlob = (centerX: number, centerY: number, radius: number, color: string, alpha: number) => {
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${color}${Math.round(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`);
      return gradient;
    };

    const animate = () => {
      time += speed * 0.01;
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      // Create multiple flowing gradient blobs
      colorStops.forEach((color, index) => {
        const baseX = width * (0.2 + (index * 0.15));
        const baseY = height * 0.5;
        
        // Primary blob with slow, large movement
        const primaryX = baseX + Math.sin(time + index * 2) * width * 0.15;
        const primaryY = baseY + Math.cos(time * 0.7 + index * 1.5) * height * 0.1;
        const primaryRadius = Math.min(width, height) * (0.25 + Math.sin(time * 0.5 + index) * 0.05);
        
        ctx.fillStyle = createGradientBlob(primaryX, primaryY, primaryRadius, color, intensity * 0.7);
        ctx.fillRect(0, 0, width, height);
        
        // Secondary blob with different movement pattern
        const secondaryX = baseX + Math.sin(time * 1.3 + index * 2.5) * width * 0.1;
        const secondaryY = baseY + Math.cos(time * 0.9 + index * 1.8) * height * 0.15;
        const secondaryRadius = Math.min(width, height) * (0.15 + Math.sin(time * 0.8 + index * 1.2) * 0.03);
        
        ctx.fillStyle = createGradientBlob(secondaryX, secondaryY, secondaryRadius, color, intensity * 0.5);
        ctx.fillRect(0, 0, width, height);
        
        // Tertiary blob for extra depth
        const tertiaryX = baseX + Math.sin(time * 0.6 + index * 3) * width * 0.2;
        const tertiaryY = baseY + Math.cos(time * 1.1 + index * 2.2) * height * 0.08;
        const tertiaryRadius = Math.min(width, height) * (0.3 + Math.sin(time * 0.4 + index * 0.8) * 0.07);
        
        ctx.fillStyle = createGradientBlob(tertiaryX, tertiaryY, tertiaryRadius, color, intensity * 0.3);
        ctx.fillRect(0, 0, width, height);
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [colorStops, intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`aurora-bg ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -10,
        filter: 'blur(120px)',
        opacity: 0.4,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default Aurora;