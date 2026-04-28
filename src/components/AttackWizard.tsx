import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Zap, ArrowRight, ArrowLeft, Crosshair } from 'lucide-react';
import type { Profile } from '../api';
import { PRESETS } from '../api';

interface WizardProps {
  onLaunch: (profile: Profile) => void;
  loading: boolean;
}

const STEPS = [
  { title: 'Identity', desc: 'Who is the target?', icon: User },
  { title: 'Context', desc: 'Where do they operate?', icon: Building2 },
  { title: 'Connection', desc: 'Social links & launch', icon: Zap },
];

export default function AttackWizard({ onLaunch, loading }: WizardProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(PRESETS[0]);
  const [direction, setDirection] = useState(1);

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, 2)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };
  const update = (field: keyof Profile, value: string) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section id="simulator" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ marginBottom: 8 }}>
            Attack <span className="gradient-text">Simulator</span>
            <ShieldCheck size={18} style={{ color: 'var(--text-primary)', marginLeft: 8 }} />
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            Build a target profile and watch AI craft a hyper-realistic attack
          </p>
        </motion.div>

        {/* Preset selector */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ marginBottom: 24 }}
        >
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8, letterSpacing: '0.03em', textTransform: 'uppercase', fontWeight: 600 }}>
            Quick Profile
          </label>
          <select
            onChange={(e) => { const p = PRESETS[parseInt(e.target.value)]; if (p) setProfile(p); }}
            className="input-field"
            style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <option value="">— Select a preset —</option>
            {PRESETS.map((p, i) => (
              <option key={i} value={i}>{p.name} — {p.role}, {p.organization}</option>
            ))}
          </select>
        </motion.div>

        {/* Progress bar */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 32,
        }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{
                height: 3, borderRadius: 2, overflow: 'hidden',
                background: 'var(--border-subtle)',
              }}>
                <motion.div
                  animate={{ width: i <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--text-primary)', borderRadius: 2 }}
                />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: i === step ? 600 : 400, transition: 'color 0.3s',
              }}>
                <s.icon size={13} />
                {s.title}
              </div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="glass-card" style={{ padding: 32, minHeight: 220, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <InputField label="Full Name" value={profile.name} placeholder="e.g., John Doe"
                    onChange={(v) => update('name', v)} />
                  <InputField label="Role / Title" value={profile.role} placeholder="e.g., Senior Engineer"
                    onChange={(v) => update('role', v)} />
                </div>
              )}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <InputField label="Organization" value={profile.organization} placeholder="e.g., Google"
                    onChange={(v) => update('organization', v)} />
                  <InputField label="Recent Activity" value={profile.recentActivity} placeholder="e.g., Conference talk, product launch"
                    onChange={(v) => update('recentActivity', v)} />
                </div>
              )}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <InputField label="Known Connection" value={profile.connection} placeholder="e.g., Manager name, mentor"
                    onChange={(v) => update('connection', v)} />
                  <div style={{
                    padding: 16, borderRadius: 'var(--radius)',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>⚡ Ready to launch.</strong>{' '}
                    The AI will craft a realistic spear-phishing attack using these details to show you exactly how vulnerable this profile is.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12,
        }}>
          <button
            onClick={prev}
            disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 20px', fontSize: 14, fontWeight: 500,
              color: step === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius)', cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {step < 2 ? (
            <button onClick={next} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 24px', fontSize: 14, fontWeight: 600,
              color: 'white', background: 'var(--gradient-accent)', border: 'none',
              borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
            }}>
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={() => onLaunch(profile)}
              disabled={loading}
              className="glow-button"
              style={{ padding: '12px 28px', fontSize: 14 }}
            >
              {loading ? (
                <><div className="spinner" style={{ width: 16, height: 16, margin: 0, borderWidth: 2 }} /> Analyzing...</>
              ) : (
                <><Crosshair size={16} /> Launch Attack</>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function InputField({ label, value, placeholder, onChange }: {
  label: string; value: string; placeholder: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
        marginBottom: 6, letterSpacing: '0.02em',
      }}>
        {label}
      </label>
      <input
        className="input-field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
