// ===== TYPES =====

export interface Profile {
  name: string;
  role: string;
  organization: string;
  recentActivity: string;
  connection: string;
}

export interface ExploitedDetail {
  detail_type: string;
  phrase: string;
  trigger: 'URGENCY' | 'FAKE_AUTHORITY' | 'SCARCITY' | 'FEAR' | 'RECIPROCITY' | 'SOCIAL_PROOF';
  why_it_works: string;
  counter: string;
}

export interface AttackResult {
  attack_message: string;
  message_type: string;
  sender_identity: string;
  exploited_details: ExploitedDetail[];
  exposure_score: number;
  attacker_goal: string;
  overall_verdict: 'safe' | 'Suspicious' | 'Dangerous';
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  profile: Profile;
  result: AttackResult;
}

// ===== PRESETS =====

export const PRESETS: Profile[] = [
  {
    name: 'Suresh Kumar',
    role: 'CS Student',
    organization: 'NMIT Bengaluru',
    recentActivity: 'TechFusion hackathon',
    connection: 'Prof Sharma',
  },
  {
    name: 'Rajesh Kumar',
    role: 'CTO',
    organization: 'Infosys',
    recentActivity: 'IPO announcement',
    connection: 'Board Member',
  },
  {
    name: 'Priya Nair',
    role: 'Product Manager',
    organization: 'Swiggy',
    recentActivity: 'Series F funding',
    connection: 'LinkedIn recruiter',
  },
];

// ===== API =====

const API_URL = ''; // Changed to relative path for Vercel deployment

export async function forgeAttack(profile: Profile): Promise<AttackResult> {
  const res = await fetch(`${API_URL}/api/forge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'API request failed');
  }
  return res.json();
}

// ===== HISTORY HELPERS =====

const HISTORY_KEY = 'mirrortrap_history';

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(profile: Profile, result: AttackResult): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    profile,
    result,
  };
  const history = getHistory();
  history.unshift(entry);
  // Keep last 50 entries
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  return entry;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}