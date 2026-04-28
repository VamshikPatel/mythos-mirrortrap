import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check } from 'lucide-react';

interface DefensePlaybookProps {
  senderIdentity: string;
}

const ACTIONS = [
  { text: 'Verify sender through official channels before responding', priority: 'high' },
  { text: 'Never click links in unsolicited messages', priority: 'high' },
  { text: 'Confirm deadlines and offers on official websites', priority: 'medium' },
  { text: 'Report suspicious patterns to your IT security team', priority: 'medium' },
  { text: 'Enable two-factor authentication on all accounts', priority: 'low' },
  { text: 'Review and minimize your public digital footprint', priority: 'low' },
];

export default function DefensePlaybook({ senderIdentity }: DefensePlaybookProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const progress = Math.round((checked.size / ACTIONS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card"
      style={{ padding: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} style={{ color: 'var(--text-primary)' }} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Defense Playbook
          </span>
        </div>
        <span style={{ fontSize: 12, color: progress === 100 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {checked.size}/{ACTIONS.length} complete
        </span>
      </div>

      {/* Progress */}
      <div style={{
        height: 3, borderRadius: 2, background: 'var(--border-subtle)', marginBottom: 16, overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'var(--text-primary)', borderRadius: 2 }}
        />
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Verify <strong style={{ color: 'var(--text-primary)' }}>{senderIdentity}</strong> and complete these actions:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ACTIONS.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            onClick={() => toggle(i)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 12px', fontSize: 13, lineHeight: 1.5,
              color: checked.has(i) ? 'var(--text-muted)' : 'var(--text-secondary)',
              background: checked.has(i) ? 'var(--bg-secondary)' : 'transparent',
              border: '1px solid',
              borderColor: checked.has(i) ? 'var(--border-default)' : 'transparent',
              borderRadius: 8, cursor: 'pointer',
              textDecoration: checked.has(i) ? 'line-through' : 'none',
              textAlign: 'left', fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
              width: '100%',
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
              border: checked.has(i) ? 'none' : '1.5px solid var(--border-default)',
              background: checked.has(i) ? 'var(--text-primary)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {checked.has(i) && <Check size={12} style={{ color: 'white' }} />}
            </div>
            {action.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
