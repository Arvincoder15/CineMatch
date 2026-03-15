import { useState } from 'react';
import { Film, User, Sparkles } from 'lucide-react';
import { UserStatsModal } from './UserStatsModal';
import { ThemeToggle } from './ThemeToggle';
import { Movie } from './MovieCard';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface HeaderProps {
  onNavigate: (view: 'swipe' | 'matches' | 'ai') => void;
  currentView: 'swipe' | 'matches' | 'ai';
  username?: string;
  likedMovies?: Movie[];
}

export function Header({ onNavigate, currentView, username, likedMovies = [] }: HeaderProps) {
  const [showStats, setShowStats] = useState(false);
  
  return (
    <header className="w-full border-b bg-card px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="relative bg-primary p-2 rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold text-xl text-foreground">
            CineMatch
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-2">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('swipe')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'swipe'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-accent'
              }`}
            >
              Discover
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('ai')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                currentView === 'ai'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-accent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('matches')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'matches'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-accent'
              }`}
            >
              Matches
            </motion.button>
          </motion.nav>
          
          {username && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowStats(true)}
                title="View your stats"
                className="hover:bg-accent"
              >
                <User className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>

      <UserStatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        likedMovies={likedMovies}
        username={username || 'User'}
      />
    </header>
  );
}