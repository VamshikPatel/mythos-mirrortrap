import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks';

interface ScoreGaugeProps {
  score: number;
  verdict: string;
}

export default function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const animatedScore = useCountUp(score, 1800, 300);
  const circleRef = useRef<SVGCircleElement>(null);

  const size = 200;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;



  const getLabel = () => {
    if (score >= 70) return 'High Exposure';
    if (score >= 40) return 'Moderate Exposure';
    return 'Low Exposure';
  };

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)';
      circleRef.current.style.strokeDashoffset = String(circumference - progress);
    }
  }, [circumference, progress]);

  const gradientId = `score-gradient-${score}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--text-primary)" />
              <stop offset="100%" stopColor="var(--text-muted)" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--border-subtle)" strokeWidth={stroke} />
          <circle ref={circleRef} cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {animatedScore}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>/ 100</div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          {getLabel()}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          Verdict: {verdict}
        </div>
      </div>
    </motion.div>
  );
}
