import { Movie } from './MovieCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Star, Clock, Calendar, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
          <DialogDescription>Full movie details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Movie Poster */}
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden max-w-sm mx-auto">
            <ImageWithFallback
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="font-semibold">{movie.rating}/10</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Runtime</p>
                <p className="font-semibold">{movie.runtime} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Released</p>
                <p className="font-semibold">{movie.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Genre</p>
                <p className="font-semibold">{movie.genre}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-2">Overview</h4>
            <p className="text-muted-foreground leading-relaxed">
              {movie.description || 'No description available for this movie.'}
            </p>
          </div>

          {/* Additional Info */}
          {movie.imdbId && (
            <div>
              <h4 className="mb-2">Additional Information</h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.imdb.com/title/${movie.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View on IMDb
                </a>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{movie.genre}</Badge>
            <Badge variant="outline">⭐ {movie.rating}</Badge>
            {movie.rating >= 8 && <Badge variant="default">Highly Rated</Badge>}
            {movie.year >= 2020 && <Badge variant="secondary">Recent</Badge>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
