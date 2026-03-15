import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Brain } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Movie } from './MovieCard';
import { generateRecommendations, generateInsights, AIRecommendation, AIInsight } from '../lib/ai-service';

interface AIRecommendationsProps {
  likedMovies: Movie[];
  allMovies: Movie[];
  onMovieClick?: (movieId: number) => void;
}

export function AIRecommendations({ likedMovies, allMovies, onMovieClick }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (likedMovies.length > 0) {
      loadAIData();
    }
  }, [likedMovies.length]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      const likedMovieIds = likedMovies.map((m) => m.id);
      const availableMovies = allMovies.filter((m) => !likedMovieIds.includes(m.id));
      const availableIds = availableMovies.map((m) => m.id);

      const movieData = likedMovies.map((m) => ({
        genre: m.genre,
        rating: m.rating,
        runtime: m.runtime,
      }));

      const [recs, insightsData] = await Promise.all([
        generateRecommendations(movieData, availableIds),
        generateInsights(movieData),
      ]);

      setRecommendations(recs);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (likedMovies.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="mb-2">AI Recommendations</h3>
        <p className="text-muted-foreground">
          Start swiping to get personalized AI-powered movie recommendations!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="w-6 h-6 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="mb-1">Your AI Movie Profile</h3>
            {loading || !insights ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-1">Personality</p>
                  <Badge variant="secondary" className="text-sm">
                    {insights.personality}
                  </Badge>
                </div>
                {insights.topGenres.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1">Favorite Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.topGenres.map((genre) => (
                        <Badge key={genre} variant="outline">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Watching Style</p>
                  <p>{insights.watchingStyle}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground italic">{insights.suggestion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Recommendations Card */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="mb-1">AI Picks For You</h3>
            <p className="text-muted-foreground">
              Personalized recommendations based on your taste
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-16 h-24 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const movie = allMovies.find((m) => m.id === rec.movieId);
              if (!movie) return null;

              return (
                <div
                  key={rec.movieId}
                  className="flex gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onMovieClick?.(rec.movieId)}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="truncate">{movie.title}</h4>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {Math.round(rec.confidence * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {movie.genre} • {movie.year}
                    </p>
                    <p className="text-sm italic text-muted-foreground">{rec.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
