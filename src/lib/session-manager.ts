// Session management for collaborative movie matching
// Now using Supabase backend for real-time session sharing

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
  users: User[];
  preferences: Record<string, number[]>; // userId -> liked movie IDs
}

const CURRENT_USER_KEY = 'cinematch_current_user';
const CURRENT_SESSION_KEY = 'cinematch_current_session';
const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ec9c6d6c`;

export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createSession(user: User): Promise<Session> {
  const code = generateSessionCode();
  
  try {
    const response = await fetch(`${API_URL}/sessions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ code, user }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create session');
    }

    setCurrentSession(code);
    return data.session;
  } catch (error) {
    console.error('Error creating session:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the Supabase Edge Function is deployed. See QUICK_START.md for deployment instructions.');
    }
    throw error;
  }
}

export async function joinSession(code: string, user: User): Promise<Session | null> {
  try {
    const response = await fetch(`${API_URL}/sessions/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ code: code.toUpperCase(), user }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('Failed to join session:', data.error);
      return null;
    }

    setCurrentSession(code.toUpperCase());
    return data.session;
  } catch (error) {
    console.error('Error joining session:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the Supabase Edge Function is deployed.');
    }
    throw error;
  }
}

export async function getSession(code: string): Promise<Session | null> {
  try {
    const response = await fetch(`${API_URL}/sessions/${code.toUpperCase()}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the Supabase Edge Function is deployed.');
    }
    return null;
  }
}

export async function updateSessionPreferences(
  code: string,
  userId: string,
  movieIds: number[]
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sessions/${code.toUpperCase()}/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, movieIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update preferences');
    }
  } catch (error) {
    console.error('Error updating session preferences:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the Supabase Edge Function is deployed.');
    }
    throw error;
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

// Local storage helpers for current user and session
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
