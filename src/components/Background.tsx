import { useEffect, useRef, useState } from 'react';

/**
 * Minimalist GitHub-style background
 * - Subtle monochromatic grid
 * - Soft top-lighting radial gradient
 * - Interactive mouse follow glow
 */
export default function Background() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}
    >
      {/* Top ambient lighting (GitHub style) */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '60vh',
          background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* GitHub-style fine grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 80%)',
        }}
      />

      {/* Interactive soft mouse glow */}
      <div
        style={{
          position: 'absolute',
          top: mousePos.y,
          left: mousePos.x,
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          filter: 'blur(30px)',
          transition: 'top 0.1s ease-out, left 0.1s ease-out',
        }}
      />
    </div>
  );
}
