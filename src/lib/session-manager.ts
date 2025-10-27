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

// -------- Result types expected by App.tsx --------
export type CreateResult =
  | { ok: true; session: Session }
  | { ok: false; reason: "STORAGE_UNAVAILABLE" };

export type JoinResult =
  | { ok: true; session: Session }
  | { ok: false; reason: "INVALID_CODE" | "NOT_FOUND" };

// -------------------- Keys --------------------
const SESSIONS_KEY = "cinematch_sessions";
const CURRENT_USER_KEY = "cinematch_current_user";
const CURRENT_SESSION_KEY = "cinematch_current_session";

// -------------------- Code helpers --------------------
function normalizeCode(input: string): string {
  return (input || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function isValidCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
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
    const k = "__ping__";
    store.setItem(k, "1");
    store.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const store: Storage | MemoryStorage =
  usable(typeof window !== "undefined" ? window.localStorage : null)
    ? window.localStorage
    : usable(typeof window !== "undefined" ? window.sessionStorage : null)
    ? window.sessionStorage
    : new MemoryStorage();

// -------------------- Public API --------------------
export function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code; // uppercase
}

export function createSession(user: User): CreateResult {
  // if storage is truly unavailable, we'll still run with memory store;
  // but if even that fails (extremely rare), return a clear error.
  try {
    const code = generateSessionCode();
    const session: Session = {
      code,
      createdAt: Date.now(),
      users: [user],
      preferences: { [user.id]: [] },
    };

    const all = getSessions();
    all[code] = session;
    saveSessions(all);
    setCurrentSession(code);
    return { ok: true, session };
  } catch {
    return { ok: false, reason: "STORAGE_UNAVAILABLE" };
  }
}

export function joinSession(codeRaw: string, user: User): JoinResult {
  const code = normalizeCode(codeRaw);
  if (!isValidCode(code)) return { ok: false, reason: "INVALID_CODE" };

  const sessions = getSessions();
  const session = sessions[code];
  if (!session) return { ok: false, reason: "NOT_FOUND" };

  if (!session.users.find((u) => u.id === user.id)) {
    session.users.push(user);
    if (!session.preferences[user.id]) session.preferences[user.id] = [];
    saveSessions(sessions);
  }

  setCurrentSession(code);
  return { ok: true, session };
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
  if (!session) return;

  session.preferences[userId] = Array.from(new Set(movieIds)); // de-dupe
  saveSessions(sessions);
}

export function getSessionMatches(session: Session): Record<number, string[]> {
  const matches: Record<number, string[]> = {};
  for (const [userId, movieIds] of Object.entries(session.preferences)) {
    const user = session.users.find((u) => u.id === userId);
    if (!user) continue;
    for (const id of movieIds) {
      if (!matches[id]) matches[id] = [];
      matches[id].push(user.username);
    }
  }
  for (const [movieId, names] of Object.entries(matches)) {
    if (names.length < 2) delete matches[Number(movieId)];
  }
  return matches;
}

// -------------------- Storage helpers --------------------
function getSessions(): Record<string, Session> {
  try {
    const data = store.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveSessions(sessions: Record<string, Session>): void {
  try {
    store.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // QuotaExceeded or blocked: keep running; memory store will still work
  }
}

export function setCurrentUser(user: User): void {
  try { store.setItem(CURRENT_USER_KEY, JSON.stringify(user)); } catch {}
}

export function getCurrentUser(): User | null {
  try {
    const data = store.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setCurrentSession(codeRaw: string): void {
  try { store.setItem(CURRENT_SESSION_KEY, normalizeCode(codeRaw)); } catch {}
}

export function getCurrentSessionCode(): string | null {
  try { return store.getItem(CURRENT_SESSION_KEY); } catch { return null; }
}

export function clearCurrentSession(): void {
  try { store.removeItem(CURRENT_SESSION_KEY); } catch {}
}

export function logout(): void {
  try {
    store.removeItem(CURRENT_USER_KEY);
    store.removeItem(CURRENT_SESSION_KEY);
  } catch {}
}