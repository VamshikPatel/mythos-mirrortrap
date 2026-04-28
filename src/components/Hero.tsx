import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SecurityRadar from './SecurityRadar';

/**
 * Hero Section — Awwwards-level landing
 *
 * Layout: Left text / Right animated radar
 * Animations:
 * - Letter-by-letter staggered heading reveal
 * - Fade-in subtitle
 * - Glow button entrance
 * - Mouse parallax on radar + background elements
 * - Animated stat counters
 * - Scroll indicator
 */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Mouse parallax handler
  const handleMouse = useCallback((e: MouseEvent) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    mouseRef.current = {
      x: (e.clientX / w - 0.5) * 2,
      y: (e.clientY / h - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse);

    const animate = () => {
      setParallax((prev) => ({
        x: prev.x + (mouseRef.current.x - prev.x) * 0.05,
        y: prev.y + (mouseRef.current.y - prev.y) * 0.05,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouse]);

  // Heading text split into words for staggered reveal
  const headingWords = ['Intelligent', 'Cyber'];
  const headingAccent = ['Defense', 'Solutions'];

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '100px 48px 60px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          maxWidth: 1100,
          width: '100%',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* === LEFT: Text Content === */}
        <div style={{ zIndex: 2 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              borderRadius: 999,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginBottom: 28,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 8px #22c55e60',
            }} />
            AI-Driven Cyber Defense
          </motion.div>

          {/* Heading — word-by-word stagger */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            margin: '0 0 22px',
            color: 'var(--text-primary)',
          }}>
            {headingWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            {headingAccent.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  delay: 0.75 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: 'inline-block',
                  marginRight: '0.3em',
                  background: 'var(--gradient-accent-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 440,
              marginBottom: 36,
            }}
          >
            Detect, prevent, and respond to cyber threats
            — <span style={{ color: 'var(--text-primary)' }}>powered by predictive AI.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <a
              href="#simulator"
              className="glow-button"
              id="hero-cta"
              style={{ textDecoration: 'none', fontSize: 15, padding: '15px 32px' }}
            >
              Start Simulation
            </a>
            <span style={{
              fontSize: 13, color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--text-muted)',
              }} />
              No data stored
            </span>
          </motion.div>

          {/* Stat counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            style={{
              display: 'flex',
              gap: 36,
              marginTop: 56,
            }}
          >
            <AnimatedStat value={6} suffix="+" label="Attack Vectors" delay={1900} />
            <AnimatedStat value={100} suffix="%" label="Educational" delay={2100} />
            <AnimatedStat value={0} suffix="" label="Data Stored" delay={2300} />
          </motion.div>
        </div>

        {/* === RIGHT: Radar Visual === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${parallax.x * 15}px, ${parallax.y * 10}px)`,
            transition: 'none',
          }}
        >
          <SecurityRadar />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </motion.div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          .hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-grid > div:last-child {
            order: -1;
          }
        }
        @media (max-width: 600px) {
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Animated stat counter with count-up effect
 */
function AnimatedStat({
  value, suffix, label, delay,
}: {
  value: number; suffix: string; label: string; delay: number;
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
      if (value === 0) { setCount(0); return; }
      const duration = 1200;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.5s, transform 0.5s',
    }}>
      <div style={{
        fontSize: 28, fontWeight: 700, color: 'var(--text-primary)',
        letterSpacing: '-0.03em', lineHeight: 1,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontSize: 12, color: 'var(--text-muted)', marginTop: 6,
        letterSpacing: '0.02em',
      }}>
        {label}
      </div>
    </div>
  );
}
