import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Smartphone, Globe, Phone } from 'lucide-react';
import type { AttackResult } from '../api';

/**
 * Multi-Channel Attack View
 * Shows how the same attack could be delivered across different channels:
 * WhatsApp, Email, SMS, LinkedIn DM, Phone Call script
 */

interface MultiChannelViewProps {
  result: AttackResult;
}

interface ChannelTab {
  id: string;
  label: string;
  icon: typeof Mail;
  color: string;
}

const CHANNELS: ChannelTab[] = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'var(--text-primary)' },
  { id: 'email', label: 'Email', icon: Mail, color: 'var(--text-primary)' },
  { id: 'sms', label: 'SMS', icon: Smartphone, color: 'var(--text-primary)' },
  { id: 'linkedin', label: 'LinkedIn', icon: Globe, color: 'var(--text-primary)' },
  { id: 'call', label: 'Phone Call', icon: Phone, color: 'var(--text-primary)' },
];

function adaptMessage(result: AttackResult, channel: string): { subject?: string; body: string; meta: string } {
  const msg = result.attack_message;
  const sender = result.sender_identity;

  switch (channel) {
    case 'email':
      return {
        subject: `Important: Action Required — ${sender}`,
        body: `Dear colleague,\n\n${msg}\n\nPlease respond at your earliest convenience.\n\nBest regards,\n${sender}`,
        meta: `From: ${sender.toLowerCase().replace(/\s/g, '.')}@trusted-domain.com`,
      };
    case 'sms':
      return {
        body: msg.length > 160 ? msg.slice(0, 155) + '...' : msg,
        meta: `From: +91 98XXX XXXXX`,
      };
    case 'linkedin': {
      const short = msg.length > 200 ? msg.slice(0, 195) + '...' : msg;
      return {
        body: `Hi, I noticed your profile and wanted to reach out.\n\n${short}\n\nLooking forward to connecting!`,
        meta: `${sender} · 2nd degree connection`,
      };
    }
    case 'call':
      return {
        body: `[Phone rings]\n\nCaller: "Hello, this is ${sender}. Am I speaking with the right person?"\n\n[Target confirms]\n\nCaller: "${msg}"\n\nCaller: "I need you to act on this right away. Can you do that for me?"\n\n[Pause for compliance]`,
        meta: `Incoming call · Unknown number`,
      };
    default:
      return { body: msg, meta: `via WhatsApp · ${sender}` };
  }
}

export default function MultiChannelView({ result }: MultiChannelViewProps) {
  const [activeChannel, setActiveChannel] = useState('whatsapp');
  const adapted = adaptMessage(result, activeChannel);
  const activeTab = CHANNELS.find((c) => c.id === activeChannel)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="glass-card"
      style={{ padding: 24, marginBottom: 24 }}
    >
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginBottom: 16,
      }}>
        Multi-Channel Attack Preview
      </div>

      {/* Channel tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const isActive = ch.id === activeChannel;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', fontSize: 12, fontWeight: 600,
                color: isActive ? ch.color : 'var(--text-muted)',
                background: isActive ? `${ch.color}10` : 'transparent',
                border: `1px solid ${isActive ? `${ch.color}30` : 'transparent'}`,
                borderRadius: 8, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              <Icon size={13} /> {ch.label}
            </button>
          );
        })}
      </div>

      {/* Channel content */}
      <motion.div
        key={activeChannel}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Meta info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          fontSize: 12, color: 'var(--text-muted)',
        }}>
          <activeTab.icon size={14} style={{ color: activeTab.color }} />
          <span>{adapted.meta}</span>
        </div>

        {/* Subject line for email */}
        {adapted.subject && (
          <div style={{
            padding: '8px 12px', marginBottom: 8, borderRadius: 6,
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
            fontSize: 13, color: 'var(--text-primary)', fontWeight: 600,
          }}>
            Subject: {adapted.subject}
          </div>
        )}

        {/* Message body */}
        <div style={{
          padding: 16, borderRadius: 10,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap', fontFamily: activeChannel === 'call' ? 'var(--font-mono)' : 'var(--font-sans)',
        }}>
          {adapted.body}
        </div>

        {/* Channel-specific warning */}
        <div style={{
          marginTop: 12, padding: 10, borderRadius: 6,
          background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
          ⚠️ {activeChannel === 'email' && 'Always verify the sender\'s email domain matches the official company domain.'}
          {activeChannel === 'whatsapp' && 'Be wary of messages from unknown numbers claiming authority. Verify through official channels.'}
          {activeChannel === 'sms' && 'Legitimate organizations rarely send action-required SMS with links. Go to the official website directly.'}
          {activeChannel === 'linkedin' && 'Connection requests with urgent asks are a red flag. Check the profile age, connections, and activity.'}
          {activeChannel === 'call' && 'Never share sensitive information over phone calls you didn\'t initiate. Hang up and call back on the official number.'}
        </div>
      </motion.div>
    </motion.div>
  );
}
