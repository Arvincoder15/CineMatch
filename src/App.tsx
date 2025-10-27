import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SwipeView } from './components/SwipeView';
import { MatchesView } from './components/MatchesView';
import { AIView } from './components/AIView';
import { AuthView } from './components/AuthView';
import { SessionSetup } from './components/SessionSetup';
import { GenrePreferences } from './components/GenrePreferences';
import { SessionView } from './components/SessionView';
import { MatchModal } from './components/MatchModal';
import { Movie } from './components/MovieCard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3'; // if you removed versioned aliases, change to: 'sonner'
import { fetchPopularMovies, fetchMoviesByUserPreferences } from './lib/tmdb-api';
import { Loader2, LogOut } from 'lucide-react';
import {
  User,
  Session,
  createSession,
  joinSession,
  getSession,
  getCurrentUser,
  setCurrentUser,
  getCurrentSessionCode,
  updateSessionPreferences,
  getSessionMatches,
  logout as sessionLogout,
  clearCurrentSession,
} from './lib/session-manager';

type AppState = 'auth' | 'session-setup' | 'preferences' | 'session-view' | 'app';

interface Match {
  movie: Movie;
  friends: string[];
}

// helpers for code UX
const normalizeCode = (s: string) => (s || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
const isValidCode = (s: string) => /^[A-Z0-9]{6}$/.test(s);

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentView, setCurrentView] = useState<'swipe' | 'matches' | 'ai'>('swipe');
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchModal, setMatchModal] = useState<{ movie: Movie; friend: string } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for existing user/session on mount
  useEffect(() => {
    const user = getCurrentUser();
    const sessionCodeRaw = getCurrentSessionCode();

    if (user) {
      setCurrentUserState(user);
      if (sessionCodeRaw) {
        const code = normalizeCode(sessionCodeRaw);
        const session = getSession(code);
        if (session) {
          setCurrentSession(session);
          setAppState('app');
        } else {
          // stale code in storage — clear it so join won’t say "incorrect"
          clearCurrentSession();
          setAppState('session-setup');
        }
      } else {
        setAppState('session-setup');
      }
    } else {
      setAppState('auth');
    }
  }, []);

  // Load movies (popular or per-user)
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        let movieData: Movie[];
        if (currentUser && currentUser.genres?.length) {
          movieData = await fetchMoviesByUserPreferences(currentUser.genres, 1);
        } else {
          movieData = await fetchPopularMovies(1);
        }
        setMovies(movieData);
      } catch (error) {
        console.error('Error loading movies:', error);
        toast.error('Failed to load movies. Using mock data instead.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [currentUser]);

  const handleApiKeyChange = async () => {
    setLoading(true);
    try {
      const popularMovies = await fetchPopularMovies(1);
      setMovies(popularMovies);
      toast.success('Successfully loaded movies from TMDB!');
    } catch (error) {
      console.error('Error loading movies:', error);
      toast.error('Failed to load movies. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  // Recompute matches when session or movies change
  useEffect(() => {
    if (currentSession) {
      const sessionMatches = getSessionMatches(currentSession);
      const list: Match[] = [];
      Object.entries(sessionMatches).forEach(([movieId, usernames]) => {
        const movie = movies.find((m) => m.id === Number(movieId));
        if (movie) list.push({ movie, friends: usernames });
      });
      setMatches(list);
    }
  }, [currentSession, movies]);

  const likedMovieObjects = movies.filter((m) => likedMovies.includes(m.id));

  // -------- Auth --------
  const handleLogin = (username: string) => {
    const user: User = {
      id: crypto.randomUUID(),
      username,
      genres: [],
      vibe: '',
    };
    setCurrentUser(user);
    setCurrentUserState(user);
    setAppState('session-setup');
  };

  // -------- Session Setup --------
  const handleCreateSession = () => {
    // Your flow: collect prefs first, then actually create the room in onComplete
    setAppState('preferences');
  };

  const handleJoinSession = (codeInput: string) => {
    if (!currentUser) return;

    const code = normalizeCode(codeInput);
    if (!isValidCode(code)) {
      toast.error('Session code must be 6 letters/numbers.');
      return;
    }

    // Just verify it exists; we add the user after prefs
    const session = getSession(code);
    if (!session) {
      toast.error(`Session not found for ${code}.`);
      return;
    }

    setCurrentSession(session);
    setAppState('preferences');
  };

  // -------- Preferences Complete (create/join for real) --------
  const handlePreferencesComplete = (genres: string[], vibe: string) => {
    if (!currentUser) return;

    const updatedUser: User = { ...currentUser, genres, vibe };
    setCurrentUser(updatedUser);
    setCurrentUserState(updatedUser);

    if (currentSession) {
      // user chose to join existing room; now actually join it
      const res = joinSession(currentSession.code, updatedUser);
      if (!res.ok) {
        toast.error(res.reason === 'NOT_FOUND' ? 'Session not found.' : 'Invalid session code.');
        // clear bad state and send back to setup
        setCurrentSession(null);
        clearCurrentSession();
        setAppState('session-setup');
        return;
      }
      setCurrentSession(res.session);
      setAppState('session-view');
    } else {
      // create a new room with the updated user profile
      const res = createSession(updatedUser);
      if (!res.ok) {
        toast.error('Storage is unavailable. Please enable it and retry.');
        setAppState('session-setup');
        return;
      }
      setCurrentSession(res.session);
      setAppState('session-view');
    }
  };

  const handleStartSwiping = () => {
    setAppState('app');
  };

  // -------- Swiping --------
  const handleSwipe = (movieId: number, liked: boolean) => {
    if (!currentUser || !currentSession) return;

    if (!liked) {
      // you can handle dislikes later if you want
      return;
    }

    const newLiked = Array.from(new Set([...likedMovies, movieId]));
    setLikedMovies(newLiked);

    // Persist likes to session store
    updateSessionPreferences(currentSession.code, currentUser.id, newLiked);

    // Refresh session and check for new matches
    const refreshed = getSession(currentSession.code);
    if (refreshed) {
      setCurrentSession(refreshed);
      const sessionMatches = getSessionMatches(refreshed);
      const matchedUsers = sessionMatches[movieId];

      if (matchedUsers && matchedUsers.length > 1) {
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          const others = matchedUsers.filter((u) => u !== currentUser.username);
          if (others.length > 0) {
            setMatchModal({ movie, friend: others[0] });
            toast.success(`You matched with ${others.join(', ')}!`);
          }
        }
      }
    }
  };

  // -------- Logout --------
  const handleLogout = () => {
    sessionLogout();
    clearCurrentSession();
    setCurrentUserState(null);
    setCurrentSession(null);
    setLikedMovies([]);
    setMatches([]);
    setAppState('auth');
    setCurrentView('swipe');
  };

  // -------- Render states --------
  if (loading && appState === 'auth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading movies...</p>
      </div>
    );
  }

  if (appState === 'auth') {
    return (
      <>
        <AuthView onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (appState === 'session-setup' && currentUser) {
    return (
      <>
        <SessionSetup
          username={currentUser.username}
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
        />
        <Toaster />
      </>
    );
  }

  if (appState === 'preferences' && currentUser) {
    return (
      <>
        <GenrePreferences onComplete={handlePreferencesComplete} sessionCode={currentSession?.code} />
        <Toaster />
      </>
    );
  }

  if (appState === 'session-view' && currentSession && currentUser) {
    return (
      <>
        <SessionView
          session={currentSession}
          currentUserId={currentUser.id}
          onStartSwiping={handleStartSwiping}
        />
        <Toaster />
      </>
    );
  }

  // Main app
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onNavigate={setCurrentView}
        currentView={currentView}
        onApiKeyChange={handleApiKeyChange}
      />

      {/* Logout button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Logout"
        >
        <LogOut className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading movies from TMDB...</p>
          </div>
        </div>
      ) : (
        <>
          {currentView === 'swipe' && (
            <SwipeView
              movies={movies}
              onSwipe={handleSwipe}
              sessionCode={currentSession?.code}
              sessionMemberCount={currentSession?.users.length}
            />
          )}
          {currentView === 'ai' && <AIView likedMovies={likedMovieObjects} allMovies={movies} />}
          {currentView === 'matches' && <MatchesView matches={matches} />}
        </>
      )}

      <MatchModal
        isOpen={matchModal !== null}
        onClose={() => setMatchModal(null)}
        movie={matchModal?.movie || null}
        friendName={matchModal?.friend || ''}
      />

      <Toaster />
    </div>
  );
}
