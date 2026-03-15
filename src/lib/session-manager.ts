// Session management for collaborative movie matching.
// Uses the deployed Supabase Edge Function for remote sessions and a local fallback when needed.

import { createClient } from '@jsr/supabase__supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface User {
  id: string;
  username: string;
  genres: string[];
  vibe: string;
}

export interface Session {
  code: string;
  createdAt: number;
  updatedAt?: number;
  users: User[];
  preferences: Record<string, number[]>;
  isLocal?: boolean;
}

const CURRENT_USER_KEY = 'cinematch_current_user';
const CURRENT_SESSION_KEY = 'cinematch_current_session';
const LOCAL_SESSIONS_KEY = 'cinematch_local_sessions';
const SYNC_INTERVAL_MS = 2000;
const hasRemoteConfig = Boolean(projectId && publicAnonKey);
const SUPABASE_URL = hasRemoteConfig ? `https://${projectId}.supabase.co` : '';
const API_URL = hasRemoteConfig ? `${SUPABASE_URL}/functions/v1/make-server-ec9c6d6c` : '';

const supabase = hasRemoteConfig
  ? createClient(SUPABASE_URL, publicAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

let backendAvailable: boolean | null = null;

async function requestJson<T>(path: string, init?: RequestInit, timeoutMs: number = 10000): Promise<T> {
  if (!hasRemoteConfig) {
    throw new Error('Remote session backend is not configured.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
      ...(init?.headers || {}),
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function getRemoteSession(code: string): Promise<Session | null> {
  const data = await requestJson<{ success: boolean; session?: Session }>(`/sessions/${code.toUpperCase()}`);
  return data.success ? data.session || null : null;
}

export async function checkBackendAvailability(): Promise<boolean> {
  if (!hasRemoteConfig) {
    backendAvailable = false;
    return false;
  }

  if (backendAvailable !== null) {
    return backendAvailable;
  }

  try {
    await requestJson('/health', { method: 'GET' }, 5000);
    backendAvailable = true;
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    backendAvailable = false;
    return false;
  }
}

export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let index = 0; index < 6; index += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createSession(user: User): Promise<Session> {
  const code = generateSessionCode();

  try {
    const data = await requestJson<{ success: boolean; session: Session }>('/sessions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, user }),
    });

    setCurrentSession(code);
    backendAvailable = true;
    return data.session;
  } catch (error) {
    console.error('Error creating session with backend, falling back to local mode:', error);
    backendAvailable = false;

    const localSession: Session = {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      users: [user],
      preferences: {},
      isLocal: true,
    };

    saveLocalSession(localSession);
    setCurrentSession(code);
    return localSession;
  }
}

export async function joinSession(code: string, user: User): Promise<Session | null> {
  const normalizedCode = code.toUpperCase();
  const localSession = getLocalSession(normalizedCode);

  if (localSession) {
    const alreadyJoined = localSession.users.some((existingUser) => existingUser.id === user.id);
    const updatedSession: Session = alreadyJoined
      ? localSession
      : {
          ...localSession,
          updatedAt: Date.now(),
          users: [...localSession.users, user],
        };

    saveLocalSession(updatedSession);
    setCurrentSession(normalizedCode);
    return updatedSession;
  }

  try {
    const data = await requestJson<{ success: boolean; session?: Session }>('/sessions/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: normalizedCode, user }),
    });

    backendAvailable = true;
    setCurrentSession(normalizedCode);
    return data.success ? data.session || null : null;
  } catch (error) {
    console.error('Error joining session:', error);
    backendAvailable = false;
    return null;
  }
}

export async function getSession(code: string): Promise<Session | null> {
  const normalizedCode = code.toUpperCase();
  const localSession = getLocalSession(normalizedCode);
  if (localSession) {
    return localSession;
  }

  try {
    const session = await getRemoteSession(normalizedCode);
    backendAvailable = true;
    return session;
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      return null;
    }

    console.error('Error getting session:', error);
    backendAvailable = false;
    return null;
  }
}

export async function updateSessionPreferences(code: string, userId: string, movieIds: number[]): Promise<void> {
  const normalizedCode = code.toUpperCase();
  const localSession = getLocalSession(normalizedCode);

  if (localSession) {
    const updatedSession: Session = {
      ...localSession,
      updatedAt: Date.now(),
      preferences: {
        ...localSession.preferences,
        [userId]: movieIds,
      },
    };
    saveLocalSession(updatedSession);
    return;
  }

  try {
    await requestJson<{ success: boolean }>(`/sessions/${normalizedCode}/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, movieIds }),
    });

    backendAvailable = true;
  } catch (error) {
    console.error('Error updating session preferences:', error);
    backendAvailable = false;
  }
}

export function getSessionMatches(session: Session): Record<number, string[]> {
  const matches: Record<number, string[]> = {};

  Object.entries(session.preferences).forEach(([userId, movieIds]) => {
    const user = session.users.find((sessionUser) => sessionUser.id === userId);
    if (!user) {
      return;
    }

    movieIds.forEach((movieId) => {
      if (!matches[movieId]) {
        matches[movieId] = [];
      }
      matches[movieId].push(user.username);
    });
  });

  Object.keys(matches).forEach((movieId) => {
    if (matches[Number(movieId)].length < 2) {
      delete matches[Number(movieId)];
    }
  });

  return matches;
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
  localStorage.setItem(CURRENT_SESSION_KEY, code.toUpperCase());
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

function saveLocalSession(session: Session): void {
  const localSessions = getLocalSessions();
  localSessions[session.code] = session;
  localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(localSessions));
}

function getLocalSessions(): Record<string, Session> {
  try {
    const data = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function getLocalSession(code: string): Session | null {
  const localSessions = getLocalSessions();
  return localSessions[code] || null;
}

export function isBackendAvailable(): boolean | null {
  return backendAvailable;
}

export function clearAllLocalSessions(): void {
  localStorage.removeItem(LOCAL_SESSIONS_KEY);
}

export function subscribeToSession(
  code: string,
  onSessionUpdate: (session: Session) => void,
  onError?: (error: Error) => void
): () => void {
  const normalizedCode = code.toUpperCase();
  let isActive = true;

  const syncLocalSession = () => {
    if (!isActive) {
      return;
    }

    const updatedLocalSession = getLocalSession(normalizedCode);
    if (updatedLocalSession) {
      onSessionUpdate(updatedLocalSession);
    }
  };

  const refreshRemoteSession = async () => {
    try {
      const session = await getRemoteSession(normalizedCode);
      if (isActive && session) {
        onSessionUpdate(session);
      }
    } catch (error) {
      console.error('Live session sync failed:', error);
      if (isActive && error instanceof Error) {
        onError?.(error);
      }
    }
  };

  const localSession = getLocalSession(normalizedCode);
  if (localSession) {
    const intervalId = window.setInterval(syncLocalSession, SYNC_INTERVAL_MS);
    const storageHandler = (event: StorageEvent) => {
      if (event.key === LOCAL_SESSIONS_KEY) {
        syncLocalSession();
      }
    };

    window.addEventListener('storage', storageHandler);
    syncLocalSession();

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener('storage', storageHandler);
    };
  }

  void refreshRemoteSession();

  const fallbackIntervalId = window.setInterval(() => {
    if (!document.hidden) {
      void refreshRemoteSession();
    }
  }, SYNC_INTERVAL_MS);

  const wakeHandler = () => {
    void refreshRemoteSession();
  };

  window.addEventListener('focus', wakeHandler);
  window.addEventListener('online', wakeHandler);
  document.addEventListener('visibilitychange', wakeHandler);

  if (!supabase) {
    return () => {
      isActive = false;
      window.clearInterval(fallbackIntervalId);
      window.removeEventListener('focus', wakeHandler);
      window.removeEventListener('online', wakeHandler);
      document.removeEventListener('visibilitychange', wakeHandler);
    };
  }

  const channel = supabase
    .channel(`cinematch-session-${normalizedCode}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'kv_store_ec9c6d6c',
        filter: `key=eq.session:${normalizedCode}`,
      },
      () => {
        void refreshRemoteSession();
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        backendAvailable = true;
      }

      if (status === 'CHANNEL_ERROR') {
        onError?.(new Error('Realtime subscription failed; continuing with automatic polling.'));
      }
    });

  return () => {
    isActive = false;
    window.clearInterval(fallbackIntervalId);
    window.removeEventListener('focus', wakeHandler);
    window.removeEventListener('online', wakeHandler);
    document.removeEventListener('visibilitychange', wakeHandler);
    void supabase.removeChannel(channel);
  };
}