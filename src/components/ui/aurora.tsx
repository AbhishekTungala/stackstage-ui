import React, { useEffect, useRef } from 'react';

interface AuroraProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ["#3A29FF", "#FF94B4", "#FF3232"],
  blend = 0.5,
  amplitude = 1.0,
  speed = 0.5,
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += speed;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      colorStops.forEach((color, index) => {
        const offset = (index / (colorStops.length - 1)) + Math.sin(time * 0.01) * 0.1;
        gradient.addColorStop(Math.max(0, Math.min(1, offset)), color);
      });
      
      ctx.globalAlpha = blend;
      ctx.fillStyle = gradient;
      
      // Draw flowing shapes
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = canvas.height * 0.5 + 
                 Math.sin((x * 0.01) + (time * 0.02)) * amplitude * 100 +
                 Math.sin((x * 0.02) + (time * 0.01)) * amplitude * 50;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [colorStops, blend, amplitude, speed]);

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
        zIndex: 0,
      }}
    />
  );
};

export default Aurora;