// Session management for collaborative movie matching
// In production, replace with real backend (Supabase recommended)

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

const SESSIONS_KEY = 'cinematch_sessions';
const CURRENT_USER_KEY = 'cinematch_current_user';
const CURRENT_SESSION_KEY = 'cinematch_current_session';

export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createSession(user: User): Session {
  const code = generateSessionCode();
  const session: Session = {
    code,
    createdAt: Date.now(),
    users: [user],
    preferences: {},
  };

  saveSessions({ ...getSessions(), [code]: session });
  setCurrentSession(code);
  return session;
}

export function joinSession(code: string, user: User): Session | null {
  const sessions = getSessions();
  const session = sessions[code.toUpperCase()];

  if (!session) {
    return null;
  }

  // Check if user already in session
  if (!session.users.find((u) => u.id === user.id)) {
    session.users.push(user);
    saveSessions(sessions);
  }

  setCurrentSession(code);
  return session;
}

export function getSession(code: string): Session | null {
  const sessions = getSessions();
  return sessions[code.toUpperCase()] || null;
}

export function updateSessionPreferences(
  code: string,
  userId: string,
  movieIds: number[]
): void {
  const sessions = getSessions();
  const session = sessions[code.toUpperCase()];

  if (session) {
    session.preferences[userId] = movieIds;
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
      if (!matches[movieId]) {
        matches[movieId] = [];
      }
      matches[movieId].push(user.username);
    });
  });

  // Filter to only movies with 2+ likes
  Object.keys(matches).forEach((movieId) => {
    if (matches[Number(movieId)].length < 2) {
      delete matches[Number(movieId)];
    }
  });

  return matches;
}

// Local storage helpers
function getSessions(): Record<string, Session> {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveSessions(sessions: Record<string, Session>): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentSession(code: string): void {
  localStorage.setItem(CURRENT_SESSION_KEY, code);
}

export function getCurrentSessionCode(): string | null {
  return localStorage.getItem(CURRENT_SESSION_KEY);
}

export function clearCurrentSession(): void {
  localStorage.removeItem(CURRENT_SESSION_KEY);
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(CURRENT_SESSION_KEY);
}
