import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw, Zap, ArrowRight } from 'lucide-react';

/**
 * Phishing Awareness Training — Interactive quiz game
 * Users identify if messages are phishing or legitimate.
 * Gamified with score, streaks, and detailed explanations.
 */

interface Scenario {
  id: number;
  channel: string;
  sender: string;
  subject?: string;
  message: string;
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SCENARIOS: Scenario[] = [
  {
    id: 1, channel: 'Email', sender: 'it-support@company-secure.net',
    subject: 'Urgent: Your Password Expires in 24 Hours',
    message: 'Dear Employee,\n\nYour corporate password will expire today. Click the link below immediately to reset your credentials and maintain access to all systems.\n\nhttps://company-secure.net/reset-password\n\nFailure to act within 24 hours will result in account suspension.\n\n— IT Support Team',
    isPhishing: true,
    redFlags: ['Urgency pressure', 'Suspicious domain (company-secure.net ≠ company.com)', 'Generic greeting', 'Threat of account suspension'],
    explanation: 'Legitimate IT departments use your actual company domain and never threaten immediate account suspension. The domain "company-secure.net" mimics but isn\'t your real corporate domain.',
    difficulty: 'easy',
  },
  {
    id: 2, channel: 'WhatsApp', sender: 'HR Department',
    message: 'Hi! This is from HR. We\'re updating employee records for the new financial year. Please fill this form with your bank details for salary processing: https://forms.company.com/salary-update\n\nDeadline: End of day today.',
    isPhishing: true,
    redFlags: ['Requesting bank details via WhatsApp', 'Artificial deadline', 'HR would use official email channels', 'Unusual URL for internal forms'],
    explanation: 'HR departments never request sensitive bank details via WhatsApp. Salary changes go through official HRMS portals, not external links.',
    difficulty: 'easy',
  },
  {
    id: 3, channel: 'Email', sender: 'noreply@github.com',
    subject: 'You have a new follower on GitHub',
    message: 'Hey there!\n\n@devuser123 is now following you on GitHub.\n\nView their profile: https://github.com/devuser123\n\nYou\'re receiving this because you\'re subscribed to activity notifications.\nManage notification settings: https://github.com/settings/notifications\n\n— GitHub',
    isPhishing: false,
    redFlags: [],
    explanation: 'This is a legitimate GitHub notification. The links point to github.com (the real domain), the sender is noreply@github.com, and there\'s no urgency or request for sensitive information.',
    difficulty: 'easy',
  },
  {
    id: 4, channel: 'SMS', sender: '+91 98765 43210',
    message: 'Your SBI account has been blocked due to incomplete KYC. Update now to avoid permanent closure: http://sbi-kyc-update.in/verify',
    isPhishing: true,
    redFlags: ['Banks don\'t send KYC updates via SMS links', 'Fake domain (sbi-kyc-update.in ≠ onlinesbi.sbi)', 'Threat of account closure', 'Personal number, not official short code'],
    explanation: 'Banks never send KYC links via SMS from personal numbers. SBI uses the domain onlinesbi.sbi and communicates via official short codes, not regular phone numbers.',
    difficulty: 'medium',
  },
  {
    id: 5, channel: 'LinkedIn', sender: 'Sarah Chen — Talent Acquisition, Google',
    message: 'Hi! I came across your profile and I\'m impressed by your experience. We have an exciting opening at Google that matches your skillset. I\'d love to schedule a quick call to discuss.\n\nAre you available this week? You can book a slot here: https://calendly.com/sarah-chen-google/intro',
    isPhishing: false,
    redFlags: [],
    explanation: 'This is a typical legitimate recruiter outreach on LinkedIn. Using Calendly is common practice for recruiters. No sensitive info is requested, and the approach is professional and non-urgent.',
    difficulty: 'medium',
  },
  {
    id: 6, channel: 'Email', sender: 'ceo@company.com',
    subject: 'Confidential — Need Your Help Urgently',
    message: 'Hi,\n\nI\'m in a board meeting and can\'t talk. I need you to purchase 5 Amazon gift cards worth ₹10,000 each for a client appreciation event. Buy them now and send me the codes.\n\nDon\'t tell anyone — it\'s a surprise.\n\nThanks,\nRajesh (CEO)',
    isPhishing: true,
    redFlags: ['CEO requesting gift cards', '"Don\'t tell anyone" — isolation tactic', 'Urgency + unavailability', 'Gift card scam is #1 business email compromise'],
    explanation: 'This is a classic CEO fraud / Business Email Compromise (BEC). Real CEOs don\'t ask employees to secretly buy gift cards. The "don\'t tell anyone" is a major red flag designed to prevent verification.',
    difficulty: 'medium',
  },
  {
    id: 7, channel: 'Email', sender: 'no-reply@amazonn.co.in',
    subject: 'Your order #402-8891234 has been shipped',
    message: 'Your package is on its way!\n\nOrder #402-8891234\nEstimated delivery: Tomorrow by 9 PM\n\nTrack your package: https://amazonn.co.in/track/402-8891234\n\nThank you for shopping with us.\n— Amazon.in',
    isPhishing: true,
    redFlags: ['Typo in domain: "amazonn.co.in" (double n)', 'You may not have placed this order', 'Designed to make you click to "verify"'],
    explanation: 'The domain has a subtle typo — "amazonn" with double \'n\'. Attackers register look-alike domains to trick users. Always verify the exact domain spelling before clicking.',
    difficulty: 'hard',
  },
  {
    id: 8, channel: 'WhatsApp', sender: 'College Group',
    message: 'Hey everyone! Prof. Sharma just shared the updated syllabus PDF for the mid-semester exam. Download it here before he takes it down: https://drive.google.com/file/d/1xABCDEF/view\n\n— Sent by Ananya',
    isPhishing: false,
    redFlags: [],
    explanation: 'This is a typical legitimate college group message. The link points to Google Drive (a trusted platform), it references a known professor, and there\'s no request for personal information.',
    difficulty: 'hard',
  },
  {
    id: 9, channel: 'Email', sender: 'security@microsoft.com',
    subject: 'Unusual sign-in activity on your Microsoft account',
    message: 'We detected something unusual about a recent sign-in to your Microsoft account.\n\nSign-in details:\nCountry/region: Russia\nIP address: 185.220.101.34\nDate: Today at 3:42 AM\n\nIf this wasn\'t you, please secure your account:\nhttps://account.microsoft.com/security\n\n— Microsoft Account Team',
    isPhishing: false,
    redFlags: [],
    explanation: 'This appears to be a legitimate Microsoft security alert. The link points to the real Microsoft domain (account.microsoft.com). However, always navigate directly to the site instead of clicking email links as a best practice.',
    difficulty: 'hard',
  },
  {
    id: 10, channel: 'SMS', sender: 'FEDEX',
    message: 'FedEx: Your package is waiting for delivery. A shipping fee of ₹49 is required. Pay now to schedule delivery: https://fedex-delivery.pay.in/schedule',
    isPhishing: true,
    redFlags: ['FedEx doesn\'t charge via SMS links', 'Fake domain (fedex-delivery.pay.in)', 'Small amount to lower guard', 'Creates urgency about package'],
    explanation: 'FedEx never requests payments via SMS links. The domain "fedex-delivery.pay.in" is not FedEx\'s real domain (fedex.com). The small ₹49 amount is designed to make you think "it\'s just ₹49, let me pay" — but it captures your card details.',
    difficulty: 'medium',
  },
];

export default function PhishingTrainer() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState<'correct' | 'wrong' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shuffled, setShuffled] = useState<Scenario[]>([]);

  const startQuiz = useCallback(() => {
    const s = [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffled(s);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswered(null);
    setShowExplanation(false);
    setFinished(false);
    setStarted(true);
  }, []);

  const scenario = shuffled[currentIndex];

  const handleAnswer = (userSaysPhishing: boolean) => {
    if (answered) return;
    const correct = userSaysPhishing === scenario.isPhishing;
    setAnswered(correct ? 'correct' : 'wrong');
    if (correct) {
      const pts = scenario.difficulty === 'hard' ? 30 : scenario.difficulty === 'medium' ? 20 : 10;
      setScore((s) => s + pts + streak * 5);
      setStreak((s) => { const n = s + 1; setBestStreak((b) => Math.max(b, n)); return n; });
    } else {
      setStreak(0);
    }
    setTimeout(() => setShowExplanation(true), 400);
  };

  const nextScenario = () => {
    if (currentIndex + 1 >= shuffled.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(null);
      setShowExplanation(false);
    }
  };

  const getGrade = () => {
    const pct = (score / (shuffled.length * 25)) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'var(--text-primary)', msg: 'Security Expert! You\'re nearly untouchable.' };
    if (pct >= 70) return { grade: 'B', color: 'var(--text-secondary)', msg: 'Good awareness. A few gaps to close.' };
    if (pct >= 50) return { grade: 'C', color: 'var(--text-muted)', msg: 'Moderate risk. Review the explanations carefully.' };
    return { grade: 'D', color: 'var(--border-accent)', msg: 'High vulnerability. Regular training recommended.' };
  };

  if (!started) {
    return (
      <section id="training" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Brain size={28} style={{ color: 'var(--text-primary)' }} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Phishing <span className="gradient-text">Training</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
              Can you spot the difference between a real message and a phishing attack? Test your skills with 5 real-world scenarios.
            </p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
              {[['5', 'Scenarios'], ['3', 'Difficulty Levels'], ['5', 'Channels']].map(([v, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{v}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={startQuiz} className="glow-button" style={{ fontSize: 15, padding: '14px 32px' }}>
              <Brain size={17} /> Start Training
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  if (finished) {
    const g = getGrade();
    return (
      <section id="training" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <Trophy size={48} style={{ color: g.color, marginBottom: 16 }} />
            <h2 style={{ marginBottom: 4 }}>Training Complete</h2>
            <div style={{ fontSize: 64, fontWeight: 800, color: g.color, lineHeight: 1.1, margin: '16px 0 8px', fontFamily: 'var(--font-mono)' }}>{g.grade}</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{g.msg}</p>
            <div className="glass-card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
              <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{score}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Points</div></div>
              <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{bestStreak}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Best Streak</div></div>
              <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round((score / (shuffled.length * 25)) * 100)}%</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Accuracy</div></div>
            </div>
            <button onClick={startQuiz} className="glow-button" style={{ fontSize: 14, padding: '12px 28px' }}>
              <RotateCcw size={15} /> Try Again
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const diffColor = { easy: 'var(--text-secondary)', medium: 'var(--text-secondary)', hard: 'var(--text-primary)' };

  return (
    <section id="training" style={{ padding: '80px 24px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{currentIndex + 1}/{shuffled.length}</span>
            <div style={{ width: 120, height: 3, borderRadius: 2, background: 'var(--border-subtle)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${((currentIndex + 1) / shuffled.length) * 100}%` }} style={{ height: '100%', background: 'var(--gradient-accent)', borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {streak > 0 && <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>🔥 {streak} streak</span>}
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{score} pts</span>
          </div>
        </div>

        {/* Scenario card */}
        <AnimatePresence mode="wait">
          <motion.div key={scenario.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
              {/* Channel + difficulty badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {scenario.channel}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${diffColor[scenario.difficulty]}15`, border: `1px solid ${diffColor[scenario.difficulty]}30`, color: diffColor[scenario.difficulty], letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {scenario.difficulty}
                </span>
              </div>

              {/* Sender */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
                  {scenario.sender.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{scenario.sender}</div>
                  {scenario.subject && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Subject: {scenario.subject}</div>}
                </div>
              </div>

              {/* Message body */}
              <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)' }}>
                {scenario.message}
              </div>
            </div>

            {/* Answer buttons */}
            {!answered && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button onClick={() => handleAnswer(false)} style={{ padding: 16, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <CheckCircle size={18} /> Legitimate
                </button>
                <button onClick={() => handleAnswer(true)} style={{ padding: 16, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <Zap size={18} /> Phishing
                </button>
              </div>
            )}

            {/* Result feedback */}
            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ padding: 16, borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      {answered === 'correct' ? <CheckCircle size={18} style={{ color: 'var(--text-primary)' }} /> : <XCircle size={18} style={{ color: 'var(--text-primary)' }} />}
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {answered === 'correct' ? 'Correct!' : 'Incorrect'}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        This was {scenario.isPhishing ? '🎣 Phishing' : '✅ Legitimate'}
                      </span>
                    </div>
                    {showExplanation && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        <p style={{ marginBottom: 8 }}>{scenario.explanation}</p>
                        {scenario.redFlags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {scenario.redFlags.map((flag, i) => (
                              <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                                🚩 {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  <button onClick={nextScenario} className="glow-button" style={{ width: '100%', fontSize: 14, padding: '12px 0' }}>
                    {currentIndex + 1 >= shuffled.length ? 'View Results' : 'Next Scenario'} <ArrowRight size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
