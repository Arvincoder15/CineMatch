import { Star, Calendar, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  runtime: number;
  description: string;
  posterUrl: string;
  imdbId?: string;
}

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-card shadow-2xl transition-transform hover:shadow-3xl">
      <div className="relative h-3/5 overflow-hidden">
        <ImageWithFallback
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-sm font-semibold">{movie.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="h-2/5 p-6 flex flex-col justify-between">
        <div>
          <h2 className="mb-2 line-clamp-2">{movie.title}</h2>
          
          <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movie.runtime}m</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {movie.genre}
          </span>
          {movie.rating >= 8 && (
            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-medium">
              ⭐ Highly Rated
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
