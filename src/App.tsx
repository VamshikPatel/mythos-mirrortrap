import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AttackWizard from './components/AttackWizard';
import ScoreGauge from './components/ScoreGauge';
import AttackMessage from './components/AttackMessage';
import MultiChannelView from './components/MultiChannelView';
import AttackChain from './components/AttackChain';
import VulnerabilityCards from './components/VulnerabilityCards';
import DefensePlaybook from './components/DefensePlaybook';
import ReportExport from './components/ReportExport';
import AttackHistory from './components/AttackHistory';
import PhishingTrainer from './components/PhishingTrainer';

import {
  forgeAttack,
  saveToHistory,
  getHistory,
  clearHistory as clearHistoryStorage,
} from './api';
import type { Profile, AttackResult, HistoryEntry } from './api';

export default function MirrorTrap() {
  const [view, setView] = useState<'home' | 'training'>('home');
  const [result, setResult] = useState<AttackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory);
  const [lastProfile, setLastProfile] = useState<Profile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('mirrortrap-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mirrortrap-theme', theme);
  }, [theme]);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const handleLaunch = useCallback(async (profile: Profile) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await forgeAttack(profile);
      setResult(data);
      setLastProfile(profile);
      const entry = saveToHistory(profile, data);
      setHistory((prev) => [entry, ...prev].slice(0, 50));
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResult(null);
      console.error('Attack simulation failed:', message);
    }
    setLoading(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistoryStorage();
    setHistory([]);
  }, []);

  const handleSelectHistory = useCallback((r: AttackResult) => {
    setResult(r);
    setView('home');
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleViewChange = useCallback((v: 'home' | 'training') => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Navbar
        onHistoryClick={() => setHistoryOpen(true)}
        historyCount={history.length}
        view={view}
        onViewChange={handleViewChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Hero />
              <AttackWizard onLaunch={handleLaunch} loading={loading} />

              {/* Loading state */}
              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ padding: '60px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: 48, height: 48, margin: '0 auto 20px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>AI is analyzing the digital footprint...</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Crafting a hyper-realistic attack scenario</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {!loading && result && (
                  <motion.section id="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                    style={{ padding: '20px 24px 120px', position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: 640, margin: '0 auto' }}>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: 40 }}>
                        <h2 style={{ marginBottom: 8 }}>Analysis <span className="gradient-text">Results</span></h2>
                        {lastProfile && (
                          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                            Target: {lastProfile.name} · {lastProfile.role} at {lastProfile.organization}
                          </p>
                        )}
                      </motion.div>

                      {/* Score gauge */}
                      <div style={{ marginBottom: 40 }}>
                        <ScoreGauge score={result.exposure_score} verdict={result.overall_verdict} />
                      </div>

                      {/* Attack Kill Chain */}
                      {lastProfile && <AttackChain profile={lastProfile} result={result} />}

                      {/* Attack message */}
                      <div style={{ marginBottom: 24 }}>
                        <AttackMessage message={result.attack_message} sender={result.sender_identity} goal={result.attacker_goal} />
                      </div>

                      {/* Multi-channel view */}
                      <MultiChannelView result={result} />

                      {/* Vulnerability cards */}
                      {result.exploited_details && result.exploited_details.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                          <VulnerabilityCards details={result.exploited_details} />
                        </div>
                      )}

                      {/* Defense playbook */}
                      <DefensePlaybook senderIdentity={result.sender_identity} />

                      {/* Report export */}
                      {lastProfile && <ReportExport profile={lastProfile} result={result} />}

                      {/* Run another */}
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        style={{ textAlign: 'center', marginTop: 40 }}>
                        <a href="#simulator" className="glow-button"
                          style={{ textDecoration: 'none', fontSize: 14, padding: '12px 24px' }}
                          onClick={() => setResult(null)}>
                          Run Another Simulation
                        </a>
                      </motion.div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="training" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ paddingTop: 64 }}>
              <PhishingTrainer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>MirrorTrap — AI-Driven Cyber Defense Platform</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.5, marginTop: 4 }}>Securing the next digital era.</p>
      </footer>

      <AttackHistory open={historyOpen} onClose={() => setHistoryOpen(false)} entries={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />
    </>
  );
}