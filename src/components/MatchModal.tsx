import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Movie } from './MovieCard';
import { Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  friendName: string;
}

export function MatchModal({ isOpen, onClose, movie, friendName }: MatchModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            It's a Match!
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h3>{movie.title}</h3>
            <p className="text-muted-foreground">
              You and {friendName} both want to watch this!
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Keep Swiping
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
