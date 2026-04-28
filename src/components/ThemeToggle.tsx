import { motion } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

/**
 * Shadcn-style theme toggle button with animated sun/moon icons.
 * Smooth rotation + scale transition between dark and light modes.
 */
export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        padding: 0,
        background: 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(128,128,128,0.1)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'none';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <circle cx="12" cy="12" r="10" />
        <path 
          d="M12 2v20c5.522 0 10-4.478 10-10S17.522 2 12 2z" 
          fill={isDark ? 'currentColor' : 'none'} 
          style={{ transition: 'fill 0.4s ease' }}
        />
      </motion.svg>
    </button>
  );
}
