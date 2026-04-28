import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Brain, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onHistoryClick: () => void;
  historyCount: number;
  view: 'home' | 'training';
  onViewChange: (view: 'home' | 'training') => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export default function Navbar({ onHistoryClick, historyCount, view, onViewChange, theme, onThemeToggle }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 24px',
        background: theme === 'dark' ? 'rgba(9, 9, 11, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.05em' }}>
            MirrorTrap
          </span>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          <NavTab active={view === 'home'} onClick={() => onViewChange('home')} href="#simulator">Simulator</NavTab>
          <NavTab active={view === 'training'} onClick={() => onViewChange('training')} href="#training" icon={<Brain size={14} />}>Training</NavTab>
          <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 6px' }} />
          <button onClick={onHistoryClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 14, fontWeight: 500,
              color: 'var(--text-secondary)', background: 'none', border: 'none', borderRadius: 'var(--radius)',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(128,128,128,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none'; }}
          >
            <History size={14} /> History
            {historyCount > 0 && (
              <span style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: 'var(--gradient-accent)', color: 'white', borderRadius: 999, padding: '0 5px' }}>
                {historyCount}
              </span>
            )}
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 6px' }} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn"
          style={{ display: 'none', padding: 8, background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} style={{ overflow: 'hidden', borderTop: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 8 }}>
              <a href="#simulator" onClick={() => { onViewChange('home'); setMobileOpen(false); }}
                style={{ padding: '10px 0', color: view === 'home' ? 'var(--text-accent)' : 'var(--text-secondary)', fontSize: 15 }}>Simulator</a>
              <a href="#training" onClick={() => { onViewChange('training'); setMobileOpen(false); }}
                style={{ padding: '10px 0', color: view === 'training' ? 'var(--text-accent)' : 'var(--text-secondary)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={15} /> Training
              </a>
              <button onClick={() => { onHistoryClick(); setMobileOpen(false); }}
                style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 15, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={15} /> History {historyCount > 0 && <span style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: 'var(--gradient-accent)', color: 'white', borderRadius: 999, padding: '0 5px' }}>{historyCount}</span>}
              </button>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
}

function NavTab({ active, onClick, href, icon, children }: {
  active: boolean; onClick: () => void; href: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <a href={href} onClick={(e) => { e.preventDefault(); onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 14, fontWeight: 500,
        color: active ? 'var(--text-accent)' : 'var(--text-secondary)', textDecoration: 'none',
        background: active ? 'rgba(255,255,255,0.06)' : 'none',
        border: `1px solid ${active ? 'var(--border-subtle)' : 'transparent'}`,
        borderRadius: 'var(--radius)', transition: 'all 0.2s',
        letterSpacing: '-0.02em',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(128,128,128,0.06)'; }}}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none'; }}}
    >
      {icon} {children}
    </a>
  );
}
