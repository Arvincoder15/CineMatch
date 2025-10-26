import { Film } from 'lucide-react';
import { ApiSettings } from './ApiSettings';

interface HeaderProps {
  onNavigate: (view: 'swipe' | 'matches' | 'ai') => void;
  currentView: 'swipe' | 'matches' | 'ai';
  onApiKeyChange?: () => void;
}

export function Header({ onNavigate, currentView, onApiKeyChange }: HeaderProps) {
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
          <ApiSettings onApiKeyChange={onApiKeyChange} />
        </div>
      </div>
    </header>
  );
}
