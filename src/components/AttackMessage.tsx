import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks';

interface AttackMessageProps {
  message: string;
  sender: string;
  goal: string;
}

export default function AttackMessage({ message, sender, goal }: AttackMessageProps) {
  const typed = useTypewriter(message, 20, 500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card"
      style={{ padding: 24 }}
    >
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginBottom: 16,
      }}>
        Simulated Attack Message
      </div>

      {/* Sender info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--gradient-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: 'white',
        }}>
          {sender.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{sender}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>via WhatsApp · just now</div>
        </div>
      </div>

      {/* Message bubble */}
      <div className="message-bubble">
        {typed.displayed}
        {!typed.isComplete && (
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
            style={{ color: 'var(--text-primary)' }}>▌</motion.span>
        )}
      </div>

      <div style={{
        marginTop: 16, padding: 12, borderRadius: 'var(--radius)',
        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>🎯 Attacker Goal:</strong> {goal}
      </div>
    </motion.div>
  );
}
