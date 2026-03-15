import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Movie } from './MovieCard';
import { Sparkles, Heart, Star, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Confetti } from './Confetti';
import { motion } from 'motion/react';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  friendName: string;
  matchCount?: number;
}

export function MatchModal({ isOpen, onClose, movie, friendName, matchCount = 1 }: MatchModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!movie) return null;

  // Generate a fun match percentage
  const matchPercentage = Math.min(95, 75 + Math.random() * 20);

  return (
    <>
      <Confetti active={showConfetti} />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md overflow-hidden">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 justify-center text-2xl">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                It's a Match!
                <motion.div
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              {/* Match percentage */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30"
                >
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <span className="font-bold text-xl">{matchPercentage.toFixed(0)}% Match!</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-2xl"
              >
                <ImageWithFallback
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{movie.rating.toFixed(1)}/10</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-3"
              >
                <h3 className="text-xl">{movie.title}</h3>
                <p className="text-muted-foreground">
                  You and <span className="text-primary font-semibold">{friendName}</span> both want to watch this!
                </p>
                
                {matchCount > 1 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Match #{matchCount} - You're on a roll!</span>
                  </div>
                )}

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Perfect for your next movie night! Share the plan in your session.
                  </p>
                </div>
              </motion.div>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Keep Swiping 🎬
              </motion.button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
