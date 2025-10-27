// Session management for collaborative movie matching
// Local-first with resilient storage (localStorage -> sessionStorage -> in-memory).
// In production, swap to a real backend (e.g., Supabase).

export interface User {
  id: string;
  username: string;
  genres: string[];
  vibe: string;
}

export interface Session {
  code: string;
  createdAt: number;
  users: User[];
  preferences: Record<string, number[]>; // userId -> liked movie IDs
}

// -------------------- Keys --------------------
const SESSIONS_KEY = 'cinematch_sessions';
const CURRENT_USER_KEY = 'cinematch_current_user';
const CURRENT_SESSION_KEY = 'cinematch_current_session';

// -------------------- Code helpers --------------------
function normalizeCode(input: string): string {
  return (input || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// -------------------- Safe storage adapter --------------------
type KV = { [k: string]: string };

class MemoryStorage {
  private m: KV = {};
  getItem(k: string) { return Object.prototype.hasOwnProperty.call(this.m, k) ? this.m[k] : null; }
  setItem(k: string, v: string) { this.m[k] = v; }
  removeItem(k: string) { delete this.m[k]; }
}

function usable(store: Storage | null): boolean {
  try {
    if (!store) return false;
    const k = '__ping__';
    store.setItem(k, '1');
    store.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

// One shared store instance for this module
const store: Storage | MemoryStorage =
  usable(typeof window !== 'undefined' ? window.localStorage : null)
    ? window.localStorage
    : usable(typeof window !== 'undefined' ? window.sessionStorage : null)
    ? window.sessionStorage
    : new MemoryStorage();

// -------------------- Public API --------------------
export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid ambiguous chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code; // already uppercase
}

export function createSession(user: User): Session {
  const code = generateSessionCode();
  const session: Session = {
    code,
    createdAt: Date.now(),
    users: [user],
    preferences: { [user.id]: [] }, // initialize user bucket
  };

  const all = getSessions();
  all[code] = session;
  saveSessions(all);
  setCurrentSession(code);
  return session;
}

export function joinSession(codeRaw: string, user: User): Session | null {
  const code = normalizeCode(codeRaw);
  const sessions = getSessions();
  const session = sessions[code];

  if (!session) {
    return null;
  }

  // Add user if not present; ensure preference bucket exists
  if (!session.users.find((u) => u.id === user.id)) {
    session.users.push(user);
    if (!session.preferences[user.id]) session.preferences[user.id] = [];
    saveSessions(sessions);
  }

  setCurrentSession(code);
  return session;
}

export function getSession(codeRaw: string): Session | null {
  const code = normalizeCode(codeRaw);
  const sessions = getSessions();
  return sessions[code] || null;
}

export function updateSessionPreferences(
  codeRaw: string,
  userId: string,
  movieIds: number[]
): void {
  const code = normalizeCode(codeRaw);
  const sessions = getSessions();
  const session = sessions[code];

  if (session) {
    // de-dupe likes
    session.preferences[userId] = Array.from(new Set(movieIds));
    saveSessions(sessions);
  }
}

export function getSessionMatches(session: Session): Record<number, string[]> {
  const matches: Record<number, string[]> = {};

  // Find movies liked by multiple users
  Object.entries(session.preferences).forEach(([userId, movieIds]) => {
    const user = session.users.find((u) => u.id === userId);
    if (!user) return;

    movieIds.forEach((movieId) => {
      if (!matches[movieId]) matches[movieId] = [];
      matches[movieId].push(user.username);
    });
  });

  // Keep only movies with 2+ likes
  Object.keys(matches).forEach((movieId) => {
    if (matches[Number(movieId)].length < 2) {
      delete matches[Number(movieId)];
    }
  });

  return matches;
}

// -------------------- Storage helpers --------------------
function getSessions(): Record<string, Session> {
  try {
    const data = store.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    // If parsing fails (corrupted), reset to empty
    return {};
  }
}

function saveSessions(sessions: Record<string, Session>): void {
  try {
    store.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // QuotaExceeded or blocked; ignore to keep app running (memory store keeps state)
  }
}

export function setCurrentUser(user: User): void {
  try {
    store.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
}

export function getCurrentUser(): User | null {
  try {
    const data = store.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentSession(codeRaw: string): void {
  try {
    store.setItem(CURRENT_SESSION_KEY, normalizeCode(codeRaw));
  } catch {
    // ignore
  }
}

export function getCurrentSessionCode(): string | null {
  try {
    return store.getItem(CURRENT_SESSION_KEY);
  } catch {
    return null;
  }
}

export function clearCurrentSession(): void {
  try {
    store.removeItem(CURRENT_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function logout(): void {
  try {
    store.removeItem(CURRENT_USER_KEY);
    store.removeItem(CURRENT_SESSION_KEY);
  } catch {
    // ignore
  }
}