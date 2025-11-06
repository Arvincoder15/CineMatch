import { Movie } from './MovieCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { TrendingUp, Heart, Film, Award, Clock, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';

interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  likedMovies: Movie[];
  username: string;
}

export function UserStatsModal({ isOpen, onClose, likedMovies, username }: UserStatsModalProps) {
  // Calculate statistics
  const totalLiked = likedMovies.length;
  const averageRating = totalLiked > 0
    ? (likedMovies.reduce((sum, m) => sum + m.rating, 0) / totalLiked).toFixed(1)
    : '0';
  
  const averageRuntime = totalLiked > 0
    ? Math.round(likedMovies.reduce((sum, m) => sum + m.runtime, 0) / totalLiked)
    : 0;

  const totalWatchTime = likedMovies.reduce((sum, m) => sum + m.runtime, 0);
  const totalHours = Math.floor(totalWatchTime / 60);
  const totalMinutes = totalWatchTime % 60;

  // Genre distribution
  const genreCounts: Record<string, number> = {};
  likedMovies.forEach(movie => {
    genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
  });

  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Decade distribution
  const decadeCounts: Record<string, number> = {};
  likedMovies.forEach(movie => {
    const decade = Math.floor(movie.year / 10) * 10;
    const decadeLabel = `${decade}s`;
    decadeCounts[decadeLabel] = (decadeCounts[decadeLabel] || 0) + 1;
  });

  const topDecade = Object.entries(decadeCounts)
    .sort(([, a], [, b]) => b - a)[0];

  // Quality preference
  const highlyRated = likedMovies.filter(m => m.rating >= 8).length;
  const qualityPercentage = totalLiked > 0 ? Math.round((highlyRated / totalLiked) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Movie Stats</DialogTitle>
          <DialogDescription>
            Insights about {username}'s movie preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <p className="text-sm text-muted-foreground">Movies Liked</p>
              </div>
              <p className="text-2xl">{totalLiked}</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <p className="text-2xl">{averageRating}/10</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-muted-foreground">Watch Time</p>
              </div>
              <p className="text-2xl">{totalHours}h {totalMinutes}m</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-muted-foreground">Avg Runtime</p>
              </div>
              <p className="text-2xl">{averageRuntime}m</p>
            </div>
          </div>

          {/* Quality Preference */}
          {totalLiked > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h4 className="mb-0">Quality Preference</h4>
                </div>
                <Badge variant="secondary">{qualityPercentage}% highly rated</Badge>
              </div>
              <Progress value={qualityPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {qualityPercentage >= 70
                  ? "You have excellent taste! You prefer critically acclaimed films."
                  : qualityPercentage >= 40
                  ? "You appreciate quality but also enjoy a variety of films."
                  : "You're open-minded and enjoy films across all ratings!"}
              </p>
            </div>
          )}

          {/* Top Genres */}
          {topGenres.length > 0 && (
            <div className="space-y-3">
              <h4 className="mb-0">Favorite Genres</h4>
              <div className="space-y-2">
                {topGenres.map(([genre, count]) => {
                  const percentage = Math.round((count / totalLiked) * 100);
                  return (
                    <div key={genre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{genre}</span>
                        <Badge variant="outline">{count} movies ({percentage}%)</Badge>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Era Preference */}
          {topDecade && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h4 className="mb-0">Era Preference</h4>
              </div>
              <p className="text-muted-foreground">
                You gravitate towards {topDecade[0]} films, with {topDecade[1]} {topDecade[1] === 1 ? 'movie' : 'movies'} from that era.
              </p>
            </div>
          )}

          {/* Personality Insight */}
          {totalLiked > 0 && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h4 className="mb-2">Your Movie Personality</h4>
              <p className="text-muted-foreground">
                {getPersonalityInsight(likedMovies, topGenres, parseFloat(averageRating))}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getPersonalityInsight(movies: Movie[], topGenres: [string, number][], avgRating: number): string {
  if (movies.length < 3) {
    return "Just getting started! Keep swiping to build your unique movie profile.";
  }

  const primaryGenre = topGenres[0]?.[0] || '';
  const diversity = topGenres.length;

  if (avgRating >= 8) {
    return `You're a quality-focused cinephile with a refined taste. ${primaryGenre} films are your sweet spot, and you appreciate excellence in storytelling.`;
  }

  if (diversity >= 4) {
    return `You're an eclectic movie lover! From ${topGenres.slice(0, 3).map(([g]) => g).join(' to ')}, you appreciate diverse storytelling styles and genres.`;
  }

  if (primaryGenre === 'Action') {
    return "You're an adrenaline junkie! Fast-paced, high-energy films keep you on the edge of your seat.";
  }

  if (primaryGenre === 'Drama') {
    return "You're a thoughtful viewer who appreciates deep, character-driven narratives and emotional storytelling.";
  }

  if (primaryGenre === 'Comedy') {
    return "You're a fun-seeker! Laughter is your favorite medicine, and you know how to appreciate great comedic timing.";
  }

  if (primaryGenre === 'Sci-Fi') {
    return "You're a visionary! You love exploring imaginative worlds and thought-provoking concepts about our future.";
  }

  return `You have great taste in ${primaryGenre} films! Your preferences show you know what you enjoy.`;
}
