import { useState } from 'react';
import { Film, User } from 'lucide-react';
import { UserStatsModal } from './UserStatsModal';
import { ThemeToggle } from './ThemeToggle';
import { Movie } from './MovieCard';
import { Button } from './ui/button';

interface HeaderProps {
  onNavigate: (view: 'swipe' | 'matches' | 'ai') => void;
  currentView: 'swipe' | 'matches' | 'ai';
  username?: string;
  likedMovies?: Movie[];
}

export function Header({ onNavigate, currentView, username, likedMovies = [] }: HeaderProps) {
  const [showStats, setShowStats] = useState(false);
  return (
    <header className="w-full border-b bg-card px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-8 h-8 text-primary" />
          <h1>CineMatch</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-2">
            <button
              onClick={() => onNavigate('swipe')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'swipe'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onNavigate('ai')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'ai'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => onNavigate('matches')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'matches'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Matches
            </button>
          </nav>
          {username && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowStats(true)}
              title="View your stats"
            >
              <User className="w-4 h-4" />
            </Button>
          )}
          <ThemeToggle />
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
