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
import { OnboardingTips, useOnboarding } from './components/OnboardingTips';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './lib/theme-provider';
import { TrendingBanner } from './components/TrendingBanner';
import { Movie } from './components/MovieCard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { fetchPopularMovies, fetchMoviesByUserPreferences } from './lib/tmdb-api';
import { Loader2, LogOut, Film } from 'lucide-react';
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
  subscribeToSession,
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
  const [matchModal, setMatchModal] = useState<{ movie: Movie; friend: string; count: number } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const { showOnboarding, closeOnboarding } = useOnboarding();

  // Check for existing user session on mount
  useEffect(() => {
    const loadInitialState = async () => {
      const user = getCurrentUser();
      const sessionCode = getCurrentSessionCode();

      if (user) {
        setCurrentUserState(user);
        if (sessionCode) {
          const session = await getSession(sessionCode);
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
    };

    loadInitialState();
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

  // Keep sessions synced across devices without requiring refreshes.
  useEffect(() => {
    if (!currentSession?.code) {
      return;
    }

    return subscribeToSession(
      currentSession.code,
      (updatedSession) => {
        setCurrentSession(updatedSession);
      },
      (error) => {
        console.error('Session sync warning:', error);
      }
    );
  }, [currentSession?.code]);

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

  const handleJoinSession = async (code: string) => {
    if (!currentUser) return;

    try {
      const session = await getSession(code);
      if (!session) {
        toast.error('Session not found. Please check the code and try again.');
        return;
      }

      setCurrentSession(session);
      setAppState('preferences');
      setBackendError(false);
    } catch (error) {
      console.error('Error joining session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to join session. Please try again.';
      if (errorMessage.includes('Cannot connect to server')) {
        setBackendError(true);
      }
      toast.error(errorMessage, { duration: 8000 });
    }
  };

  const handlePreferencesComplete = async (genres: string[], vibe: string) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, genres, vibe };
    setCurrentUser(updatedUser);
    setCurrentUserState(updatedUser);

    try {
      // Create or join session
      if (currentSession) {
        const session = await joinSession(currentSession.code, updatedUser);
        if (session) {
          setCurrentSession(session);
          setAppState('session-view');
          setBackendError(false);
          
          // Show message if running in local mode
          if (session.isLocal) {
            toast.info('Running in local mode. Sessions won\'t sync across devices.', { duration: 5000 });
          }
        } else {
          toast.error('Failed to join session');
        }
      } else {
        const newSession = await createSession(updatedUser);
        setCurrentSession(newSession);
        setAppState('session-view');
        setBackendError(false);
        
        // Show message if running in local mode
        if (newSession.isLocal) {
          toast.info('Running in local mode. Share the session code with friends on the same device.', { duration: 5000 });
        }
      }
    } catch (error) {
      console.error('Error completing preferences:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to set up session. Please try again.';
      toast.error(errorMessage, { duration: 8000 });
    }
  };

  const handleStartSwiping = () => {
    setAppState('app');
  };

  const handleSwipe = async (movieId: number, liked: boolean) => {
    if (!liked || !currentUser || !currentSession) return;

    const newLikedMovies = [...likedMovies, movieId];
    setLikedMovies(newLikedMovies);

    try {
      // Update session preferences
      await updateSessionPreferences(currentSession.code, currentUser.id, newLikedMovies);

      // Refresh session to get updated preferences
      const updatedSession = await getSession(currentSession.code);
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
              const newMatchCount = totalMatches + 1;
              setTotalMatches(newMatchCount);
              setMatchModal({ movie, friend: otherUsers[0], count: newMatchCount });
              toast.success(`🎉 Match #${newMatchCount} with ${otherUsers.join(', ')}!`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
      // Don't show error to user, just log it
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

  let content: React.ReactNode;

  if (loading && appState === 'auth') {
    content = (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500/5 via-background to-amber-500/5">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-cyan-600 to-teal-500 p-6 rounded-full">
              <Film className="w-12 h-12 text-white" />
            </div>
          </div>
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Loading CineMatch</h3>
          <p className="text-muted-foreground">Fetching the best movies for you...</p>
        </div>
      </div>
    );
  } else if (appState === 'auth') {
    content = <AuthView onLogin={handleLogin} />;
  } else if (appState === 'session-setup' && currentUser) {
    content = (
      <SessionSetup
        username={currentUser.username}
        onCreateSession={handleCreateSession}
        onJoinSession={handleJoinSession}
        backendError={backendError}
      />
    );
  } else if (appState === 'preferences' && currentUser) {
    content = (
      <GenrePreferences
        onComplete={handlePreferencesComplete}
        sessionCode={currentSession?.code}
      />
    );
  } else if (appState === 'session-view' && currentSession && currentUser) {
    content = (
      <SessionView
        session={currentSession}
        currentUserId={currentUser.id}
        onStartSwiping={handleStartSwiping}
      />
    );
  } else {
    content = (
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          onNavigate={setCurrentView} 
          currentView={currentView}
          username={currentUser?.username}
          likedMovies={likedMovieObjects}
        />

        {appState === 'app' && <TrendingBanner movies={movies} />}

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
              matchCount={totalMatches}
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
        matchCount={matchModal?.count}
      />

      <OnboardingTips
        isOpen={showOnboarding && appState === 'app'}
        onClose={closeOnboarding}
      />

      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary>
        {content}
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}