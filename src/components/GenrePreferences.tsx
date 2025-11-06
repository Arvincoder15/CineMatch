import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

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
  { id: 'chill', name: 'Chill & Relaxed', description: 'Easy-going movies' },
  { id: 'intense', name: 'Intense & Gripping', description: 'Edge-of-your-seat action' },
  { id: 'emotional', name: 'Emotional & Deep', description: 'Stories that move you' },
  { id: 'fun', name: 'Fun & Lighthearted', description: 'Pure entertainment' },
  { id: 'thoughtful', name: 'Thoughtful & Artsy', description: 'Films that make you think' },
];

interface GenrePreferencesProps {
  onComplete: (genres: string[], vibe: string) => void;
  sessionCode?: string;
}

export function GenrePreferences({ onComplete, sessionCode }: GenrePreferencesProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string>('');

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="mb-2">What's Your Movie Taste?</h2>
          <p className="text-muted-foreground">
            Select your favorite genres and vibe to get better matches
          </p>
          {sessionCode && (
            <Badge variant="secondary" className="mt-2">
              Session: {sessionCode}
            </Badge>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4">Favorite Genres (Pick at least one)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGenres.includes(genre.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{genre.emoji}</span>
                      <span>{genre.name}</span>
                    </div>
                    {selectedGenres.includes(genre.id) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4">Your Vibe</h3>
            <div className="space-y-2">
              {VIBES.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedVibe === vibe.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{vibe.name}</span>
                        {selectedVibe === vibe.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{vibe.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full"
            size="lg"
            disabled={selectedGenres.length === 0 || !selectedVibe}
          >
            Continue to Movies
          </Button>
        </div>
      </Card>
    </div>
  );
}
