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
import { toast } from 'sonner@2.0.3';
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

  // Check for existing user session on mount
  useEffect(() => {
    const user = getCurrentUser();
    const sessionCode = getCurrentSessionCode();

    if (user) {
      setCurrentUserState(user);
      if (sessionCode) {
        const session = getSession(sessionCode);
        if (session) {
          setCurrentSession(session);
          setAppState('app');
        } else {
          setAppState('session-setup');
        }
      } else {
        setAppState('session-setup');
      }
    } else {
      setAppState('auth');
    }
  }, []);

  // Load movies from TMDB API
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        // Fetch movies based on user preferences if available
        let movieData: Movie[];
        if (currentUser && currentUser.genres && currentUser.genres.length > 0) {
          movieData = await fetchMoviesByUserPreferences(currentUser.genres, 1);
        } else {
          movieData = await fetchPopularMovies(1);
        }
        setMovies(movieData);
      } catch (error) {
        console.error('Error loading movies:', error);
        toast.error('Failed to load movies. Using mock data instead.');
        // Fallback is handled in fetchPopularMovies
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

  // Update matches when session changes
  useEffect(() => {
    if (currentSession) {
      const sessionMatches = getSessionMatches(currentSession);
      const matchArray: Match[] = [];

      Object.entries(sessionMatches).forEach(([movieId, usernames]) => {
        const movie = movies.find((m) => m.id === Number(movieId));
        if (movie) {
          matchArray.push({ movie, friends: usernames });
        }
      });

      setMatches(matchArray);
    }
  }, [currentSession, movies]);

  const likedMovieObjects = movies.filter((m) => likedMovies.includes(m.id));

  const handleLogin = (username: string) => {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      genres: [],
      vibe: '',
    };
    setCurrentUser(user);
    setCurrentUserState(user);
    setAppState('session-setup');
  };

  const handleCreateSession = () => {
    setAppState('preferences');
  };

  const handleJoinSession = (code: string) => {
    if (!currentUser) return;

    const session = getSession(code);
    if (!session) {
      toast.error('Session not found. Please check the code and try again.');
      return;
    }

    setCurrentSession(session);
    setAppState('preferences');
  };

  const handlePreferencesComplete = (genres: string[], vibe: string) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, genres, vibe };
    setCurrentUser(updatedUser);
    setCurrentUserState(updatedUser);

    // Create or join session
    if (currentSession) {
      const session = joinSession(currentSession.code, updatedUser);
      if (session) {
        setCurrentSession(session);
        setAppState('session-view');
      }
    } else {
      const newSession = createSession(updatedUser);
      setCurrentSession(newSession);
      setAppState('session-view');
    }
  };

  const handleStartSwiping = () => {
    setAppState('app');
  };

  const handleSwipe = (movieId: number, liked: boolean) => {
    if (!liked || !currentUser || !currentSession) return;

    const newLikedMovies = [...likedMovies, movieId];
    setLikedMovies(newLikedMovies);

    // Update session preferences
    updateSessionPreferences(currentSession.code, currentUser.id, newLikedMovies);

    // Refresh session to get updated preferences
    const updatedSession = getSession(currentSession.code);
    if (updatedSession) {
      setCurrentSession(updatedSession);

      // Check for new matches
      const sessionMatches = getSessionMatches(updatedSession);
      const matchedUsers = sessionMatches[movieId];

      if (matchedUsers && matchedUsers.length > 1) {
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          const otherUsers = matchedUsers.filter((u) => u !== currentUser.username);
          if (otherUsers.length > 0) {
            setMatchModal({ movie, friend: otherUsers[0] });
            toast.success(`You matched with ${otherUsers.join(', ')}!`);
          }
        }
      }
    }
  };

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

  if (loading && appState === 'auth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading movies...</p>
      </div>
    );
  }

  // Auth flow
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
        <GenrePreferences
          onComplete={handlePreferencesComplete}
          sessionCode={currentSession?.code}
        />
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
