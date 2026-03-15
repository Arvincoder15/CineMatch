import { useEffect, useState } from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from './MovieCard';

interface TrendingBannerProps {
  movies: Movie[];
}

export function TrendingBanner({ movies }: TrendingBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter to highly-rated movies
  const trendingMovies = movies
    .filter(m => m.rating >= 7.5)
    .slice(0, 5);

  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [trendingMovies.length]);

  if (trendingMovies.length === 0) return null;

  const currentMovie = trendingMovies[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-b">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Trending:</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center gap-3"
            >
              <span className="font-medium truncate">{currentMovie.title}</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{currentMovie.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground hidden md:inline">
                {currentMovie.genre} • {currentMovie.year}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-1">
            {trendingMovies.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-1 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-4'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
