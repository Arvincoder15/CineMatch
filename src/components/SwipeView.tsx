import { useState, useEffect } from 'react';
import { X, Heart, Users, Undo, Info, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { MovieCard, Movie } from './MovieCard';
import { SwipeableCard } from './SwipeableCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MovieDetailsModal } from './MovieDetailsModal';
import { ActivityFeed, addActivity } from './ActivityFeed';
import { QuickStats } from './QuickStats';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

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
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-background to-amber-500/5" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎬
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-teal-500 bg-clip-text text-transparent">
            You've Seen All Movies!
          </h2>
          <p className="text-muted-foreground">
            Great job! You've swiped through all available movies. Check the Matches tab to see your connections!
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleRestart} 
              variant="outline" 
              size="lg"
              className="hover:bg-cyan-500/10 hover:border-cyan-500"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-card/50 backdrop-blur-sm border rounded-xl"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              New movies are added regularly. Come back later for fresh recommendations!
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Session info and controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap items-center justify-center gap-3"
        >
          {sessionCode && (
            <>
              <Badge variant="secondary" className="text-base px-4 py-2 font-semibold shadow-md">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                {sessionCode}
              </Badge>
              {sessionMemberCount && (
                <Badge variant="outline" className="px-3 py-2">
                  <Users className="w-4 h-4 mr-1" />
                  {sessionMemberCount} {sessionMemberCount === 1 ? 'member' : 'members'}
                </Badge>
              )}
            </>
          )}
          <Badge variant="outline" className="px-3 py-2 font-medium">
            {currentIndex + 1} / {movies.length}
          </Badge>
        </motion.div>

        {/* Keyboard shortcuts hint */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <KeyboardShortcuts />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-md h-[600px] mb-6">
          {/* Stack of cards */}
          {movies.slice(currentIndex, currentIndex + 2).map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1 - index * 0.05,
                opacity: index === 0 ? 1 : 0.5,
                y: index * 10
              }}
              className="absolute w-full h-full"
              style={{
                zIndex: 2 - index,
              }}
            >
              {index === 0 ? (
                <SwipeableCard onSwipe={handleSwipe}>
                  <MovieCard movie={movie} />
                </SwipeableCard>
              ) : (
                <MovieCard movie={movie} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => setShowDetails(true)}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full hover:bg-blue-500/10 hover:border-blue-500"
              title="View Details (I)"
            >
              <Info className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe(false)}
            className="w-16 h-16 rounded-full bg-white dark:bg-card border-2 border-red-500 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-lg"
            aria-label="Dislike (←)"
            title="Dislike (←)"
          >
            <X className="w-8 h-8 text-red-500" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe(true)}
            className="w-16 h-16 rounded-full bg-white dark:bg-card border-2 border-green-500 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-500/10 transition-all shadow-lg"
            aria-label="Like (→)"
            title="Like (→)"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleUndo}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500"
              disabled={swipeHistory.length === 0}
              title="Undo (U)"
            >
              <Undo className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Help toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setShowHelp(!showHelp)}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <span>{showHelp ? 'Hide' : 'Show'} keyboard shortcuts</span>
          <span className="text-xs">(?)</span>
        </motion.button>
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={currentMovie}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <ActivityFeed />
      
      <QuickStats liked={likedCount} passed={passedCount} matches={matchCount} />
      
      {/* Keyboard Shortcuts floating button */}
      <KeyboardShortcuts />
    </div>
  );
}