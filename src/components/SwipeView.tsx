import { useState } from 'react';
import { X, Heart, Users } from 'lucide-react';
import { MovieCard, Movie } from './MovieCard';
import { SwipeableCard } from './SwipeableCard';
import { Badge } from './ui/badge';

interface SwipeViewProps {
  movies: Movie[];
  onSwipe: (movieId: number, liked: boolean) => void;
  sessionCode?: string;
  sessionMemberCount?: number;
}

export function SwipeView({ movies, onSwipe, sessionCode, sessionMemberCount }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < movies.length) {
      onSwipe(movies[currentIndex].id, direction === 'right');
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    }
  };

  const handleButtonSwipe = (liked: boolean) => {
    handleSwipe(liked ? 'right' : 'left');
  };

  if (currentIndex >= movies.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2>No More Movies</h2>
          <p className="text-muted-foreground">Check back later for more recommendations!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {sessionCode && (
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Session: {sessionCode}
          </Badge>
          {sessionMemberCount && (
            <Badge variant="outline" className="px-3 py-2">
              <Users className="w-4 h-4 mr-1" />
              {sessionMemberCount} {sessionMemberCount === 1 ? 'member' : 'members'}
            </Badge>
          )}
        </div>
      )}
      <div className="relative w-full max-w-md h-[600px] mb-8">
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
      <div className="flex items-center gap-6">
        <button
          onClick={() => handleButtonSwipe(false)}
          className="w-16 h-16 rounded-full bg-white border-2 border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
          aria-label="Dislike"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        
        <button
          onClick={() => handleButtonSwipe(true)}
          className="w-16 h-16 rounded-full bg-white border-2 border-green-500 flex items-center justify-center hover:bg-green-50 transition-colors shadow-lg"
          aria-label="Like"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  );
}
