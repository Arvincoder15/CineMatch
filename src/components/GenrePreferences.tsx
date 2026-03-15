import { useState } from 'react';
import { Check, Sparkles, ArrowRight, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ParticleField } from './ParticleField';

const GENRES = [
  { id: 'action', name: 'Action', emoji: '💥' },
  { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
  { id: 'animation', name: 'Animation', emoji: '🎨' },
  { id: 'comedy', name: 'Comedy', emoji: '😂' },
  { id: 'crime', name: 'Crime', emoji: '🔍' },
  { id: 'drama', name: 'Drama', emoji: '🎭' },
  { id: 'fantasy', name: 'Fantasy', emoji: '🧙' },
  { id: 'horror', name: 'Horror', emoji: '👻' },
  { id: 'mystery', name: 'Mystery', emoji: '🔮' },
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'sci-fi', name: 'Sci-Fi', emoji: '🚀' },
  { id: 'thriller', name: 'Thriller', emoji: '😱' },
];

const VIBES = [
  { id: 'chill', name: 'Chill & Relaxed', description: 'Easy-going movies', color: 'from-blue-500 to-cyan-500' },
  { id: 'intense', name: 'Intense & Gripping', description: 'Edge-of-your-seat action', color: 'from-red-500 to-orange-500' },
  { id: 'emotional', name: 'Emotional & Deep', description: 'Stories that move you', color: 'from-cyan-500 to-teal-500' },
  { id: 'fun', name: 'Fun & Lighthearted', description: 'Pure entertainment', color: 'from-yellow-500 to-orange-500' },
  { id: 'thoughtful', name: 'Thoughtful & Artsy', description: 'Films that make you think', color: 'from-slate-600 to-cyan-500' },
];

interface GenrePreferencesProps {
  onComplete: (genres: string[], vibe: string) => void;
  sessionCode?: string;
}

export function GenrePreferences({ onComplete, sessionCode }: GenrePreferencesProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
  };

  const handleComplete = () => {
    if (selectedGenres.length > 0 && selectedVibe) {
      onComplete(selectedGenres, selectedVibe);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
      {/* Particle field background */}
      <ParticleField />

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-muted/30 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 border border-cyan-200 mb-4"
              >
                <Sparkles className="w-8 h-8 text-cyan-700 dark:text-cyan-300" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 text-foreground">
                What's Your Movie Taste?
              </h2>
              <p className="text-muted-foreground">
                Select your favorite genres and vibe to get better matches
              </p>
              {sessionCode && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="mt-4"
                >
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                    <Film className="w-3 h-3 mr-2" />
                    Session: {sessionCode}
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            <div className="space-y-8">
              {/* Genres */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  Favorite Genres
                  <span className="text-sm font-normal text-muted-foreground">(Pick at least one)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GENRES.map((genre, index) => (
                    <motion.button
                      key={genre.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleGenre(genre.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedGenres.includes(genre.id)
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg'
                          : 'border-border hover:border-cyan-500/50 hover:bg-cyan-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={selectedGenres.includes(genre.id) ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                            className="text-2xl"
                          >
                            {genre.emoji}
                          </motion.span>
                          <span className="font-medium">{genre.name}</span>
                        </div>
                        {selectedGenres.includes(genre.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <Check className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Vibes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="mb-4 font-semibold">Your Vibe</h3>
                <div className="space-y-3">
                  {VIBES.map((vibe, index) => (
                    <motion.button
                      key={vibe.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                        selectedVibe === vibe.id
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg'
                          : 'border-border hover:border-cyan-500/50 hover:bg-cyan-500/5'
                      }`}
                    >
                      {selectedVibe === vibe.id && (
                        <motion.div
                          layoutId="vibe-highlight"
                          className={`absolute left-0 top-0 bottom-0 w-1 bg-cyan-400`}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{vibe.name}</span>
                            {selectedVibe === vibe.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                <Check className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{vibe.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleComplete}
                  className="w-full h-12 font-semibold bg-primary hover:bg-primary/90 shadow-lg transition-all"
                  size="lg"
                  disabled={selectedGenres.length === 0 || !selectedVibe}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span>Continue to Movies</span>
                  <motion.div
                    animate={{ x: isHovered && selectedGenres.length > 0 && selectedVibe ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>
            {selectedGenres.length > 0 && selectedVibe
              ? '✅ Ready to find your perfect match!'
              : `${selectedGenres.length > 0 ? '✅ Genres selected' : '⭕ Select genres'} • ${selectedVibe ? '✅ Vibe selected' : '⭕ Select vibe'}`}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
