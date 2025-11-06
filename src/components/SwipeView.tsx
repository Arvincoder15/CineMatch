import { useState, useEffect } from 'react';
import { X, Heart, Users, Undo, Info, RotateCcw } from 'lucide-react';
import { MovieCard, Movie } from './MovieCard';
import { SwipeableCard } from './SwipeableCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MovieDetailsModal } from './MovieDetailsModal';
import { ActivityFeed, addActivity } from './ActivityFeed';
import { QuickStats } from './QuickStats';
import { toast } from 'sonner@2.0.3';

interface SwipeViewProps {
  movies: Movie[];
  onSwipe: (movieId: number, liked: boolean) => void;
  sessionCode?: string;
  sessionMemberCount?: number;
  matchCount?: number;
}

interface SwipeHistory {
  movieId: number;
  liked: boolean;
}

export function SwipeView({ movies, onSwipe, sessionCode, sessionMemberCount, matchCount = 0 }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistory[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Calculate stats
  const likedCount = swipeHistory.filter(h => h.liked).length;
  const passedCount = swipeHistory.filter(h => !h.liked).length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentIndex >= movies.length) return;

      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          handleButtonSwipe(false);
          break;
        case 'ArrowRight':
          handleButtonSwipe(true);
          break;
        case 'u':
        case 'U':
          handleUndo();
          break;
        case 'i':
        case 'I':
          setShowDetails(true);
          break;
        case '?':
          setShowHelp(!showHelp);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, movies.length, showHelp]);

  // Show keyboard shortcuts hint on first visit
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('cinematch_keyboard_hint');
    if (!hasSeenHint) {
      setTimeout(() => {
        toast.info('💡 Tip: Use arrow keys to swipe, U to undo, I for details', {
          duration: 5000,
        });
        localStorage.setItem('cinematch_keyboard_hint', 'true');
      }, 2000);
    }
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < movies.length) {
      const movie = movies[currentIndex];
      const liked = direction === 'right';
      
      // Add to history
      setSwipeHistory(prev => [...prev, { movieId: movie.id, liked }]);
      
      // Add activity
      if (liked) {
        addActivity('like', `Liked "${movie.title}"`);
      } else {
        addActivity('pass', `Passed on "${movie.title}"`);
      }
      
      onSwipe(movie.id, liked);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    }
  };

  const handleButtonSwipe = (liked: boolean) => {
    handleSwipe(liked ? 'right' : 'left');
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0 || currentIndex === 0) {
      toast.error('Nothing to undo');
      return;
    }

    // Remove last swipe from history
    const newHistory = [...swipeHistory];
    newHistory.pop();
    setSwipeHistory(newHistory);

    // Go back one movie
    setCurrentIndex(prev => prev - 1);
    
    toast.success('Undone last swipe');
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSwipeHistory([]);
    toast.success('Restarted from the beginning');
  };

  if (currentIndex >= movies.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl mb-4">🎬</div>
          <h2>You've Seen All Movies!</h2>
          <p className="text-muted-foreground">
            Great job! You've swiped through all available movies. Check the Matches tab to see your connections!
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRestart} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Tip: New movies are added regularly. Come back later for fresh recommendations!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Session info and controls */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        {sessionCode && (
          <>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Session: {sessionCode}
            </Badge>
            {sessionMemberCount && (
              <Badge variant="outline" className="px-3 py-2">
                <Users className="w-4 h-4 mr-1" />
                {sessionMemberCount} {sessionMemberCount === 1 ? 'member' : 'members'}
              </Badge>
            )}
          </>
        )}
        <Badge variant="outline" className="px-3 py-2">
          {currentIndex + 1} / {movies.length}
        </Badge>
      </div>

      {/* Keyboard shortcuts hint */}
      {showHelp && (
        <div className="mb-4 p-4 bg-muted rounded-lg max-w-md text-sm">
          <h4 className="mb-2 text-center">⌨️ Keyboard Shortcuts</h4>
          <div className="space-y-1">
            <p><kbd className="px-2 py-1 bg-background rounded">←</kbd> Dislike movie</p>
            <p><kbd className="px-2 py-1 bg-background rounded">→</kbd> Like movie</p>
            <p><kbd className="px-2 py-1 bg-background rounded">U</kbd> Undo last swipe</p>
            <p><kbd className="px-2 py-1 bg-background rounded">I</kbd> View movie details</p>
            <p><kbd className="px-2 py-1 bg-background rounded">?</kbd> Toggle this help</p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md h-[600px] mb-6">
        {/* Stack of cards */}
        {movies.slice(currentIndex, currentIndex + 2).map((movie, index) => (
          <div
            key={movie.id}
            className="absolute w-full h-full"
            style={{
              zIndex: 2 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
              opacity: index === 0 ? 1 : 0.5,
            }}
          >
            {index === 0 ? (
              <SwipeableCard onSwipe={handleSwipe}>
                <MovieCard movie={movie} />
              </SwipeableCard>
            ) : (
              <MovieCard movie={movie} />
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setShowDetails(true)}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          title="View Details (I)"
        >
          <Info className="w-5 h-5" />
        </Button>

        <button
          onClick={() => handleButtonSwipe(false)}
          className="w-16 h-16 rounded-full bg-white border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-all hover:scale-110 shadow-lg"
          aria-label="Dislike (←)"
          title="Dislike (←)"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        
        <button
          onClick={() => handleButtonSwipe(true)}
          className="w-16 h-16 rounded-full bg-white border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-all hover:scale-110 shadow-lg"
          aria-label="Like (→)"
          title="Like (→)"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>

        <Button
          onClick={handleUndo}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          disabled={swipeHistory.length === 0}
          title="Undo (U)"
        >
          <Undo className="w-5 h-5" />
        </Button>
      </div>

      {/* Help toggle */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showHelp ? 'Hide' : 'Show'} keyboard shortcuts
      </button>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={currentMovie}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <ActivityFeed />
      
      <QuickStats liked={likedCount} passed={passedCount} matches={matchCount} />
    </div>
  );
}
