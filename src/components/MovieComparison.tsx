import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Users, Zap, Heart, Star, Clock, Film, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Movie } from './MovieCard';

interface MovieComparisonProps {
  likedMovies: Movie[];
  sessionUsers?: string[];
}

export function MovieComparison({ likedMovies, sessionUsers = [] }: MovieComparisonProps) {
  if (likedMovies.length === 0) {
    return null;
  }

  // Calculate statistics
  const genreCount: Record<string, number> = {};
  let totalRating = 0;
  let totalRuntime = 0;

  likedMovies.forEach((movie) => {
    genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
    totalRating += movie.rating;
    totalRuntime += movie.runtime;
  });

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const avgRating = (totalRating / likedMovies.length).toFixed(1);
  const avgRuntime = Math.round(totalRuntime / likedMovies.length);

  const stats = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Movies Liked',
      value: likedMovies.length,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Avg Rating',
      value: avgRating,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Avg Runtime',
      value: `${avgRuntime}m`,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: <Film className="w-5 h-5" />,
      label: 'Top Genre',
      value: topGenres[0]?.[0] || 'None',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
        >
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-lg mb-0">Your Taste Profile</h3>
          <p className="text-sm text-muted-foreground">
            Insights from {likedMovies.length} liked {likedMovies.length === 1 ? 'movie' : 'movies'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-muted/50 rounded-xl p-4 text-center"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.bg} mb-2`}>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Genre Distribution */}
      {topGenres.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Genre Distribution
          </h4>
          <div className="space-y-3">
            {topGenres.map(([genre, count], index) => {
              const percentage = Math.round((count / likedMovies.length) * 100);
              return (
                <div key={genre}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{genre}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count} {count === 1 ? 'movie' : 'movies'}
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${
                        index === 0
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : index === 1
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Users Info */}
      {sessionUsers.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="font-medium">
              {sessionUsers.length} users in session
            </span>
            <Zap className="w-4 h-4 text-yellow-500 ml-auto" />
          </div>
        </motion.div>
      )}
    </Card>
  );
}
