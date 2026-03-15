import { Movie } from '../components/MovieCard';

export interface MatchAnalysis {
  compatibility: number; // 0-100
  sharedGenres: string[];
  averageRatingDiff: number;
  commonMovies: number;
  message: string;
}

export function calculateMatchCompatibility(
  userLikedMovies: Movie[],
  friendLikedMovies: Movie[]
): MatchAnalysis {
  if (userLikedMovies.length === 0 || friendLikedMovies.length === 0) {
    return {
      compatibility: 0,
      sharedGenres: [],
      averageRatingDiff: 0,
      commonMovies: 0,
      message: "Not enough data to calculate compatibility",
    };
  }

  // Find common movies
  const userMovieIds = new Set(userLikedMovies.map(m => m.id));
  const commonMovies = friendLikedMovies.filter(m => userMovieIds.has(m.id));
  const commonMovieCount = commonMovies.length;

  // Calculate shared genres
  const userGenres = new Set(userLikedMovies.map(m => m.genre));
  const friendGenres = new Set(friendLikedMovies.map(m => m.genre));
  const sharedGenres = Array.from(userGenres).filter(g => friendGenres.has(g));

  // Calculate average rating preferences
  const userAvgRating = userLikedMovies.reduce((sum, m) => sum + m.rating, 0) / userLikedMovies.length;
  const friendAvgRating = friendLikedMovies.reduce((sum, m) => sum + m.rating, 0) / friendLikedMovies.length;
  const ratingDiff = Math.abs(userAvgRating - friendAvgRating);

  // Calculate compatibility score (0-100)
  let compatibility = 0;

  // Common movies (40% weight)
  const totalMovies = Math.max(userLikedMovies.length, friendLikedMovies.length);
  const commonMovieScore = (commonMovieCount / totalMovies) * 40;
  compatibility += commonMovieScore;

  // Shared genres (35% weight)
  const totalGenres = new Set([...userGenres, ...friendGenres]).size;
  const sharedGenreScore = (sharedGenres.length / totalGenres) * 35;
  compatibility += sharedGenreScore;

  // Rating similarity (25% weight)
  const ratingSimilarity = Math.max(0, (10 - ratingDiff) / 10) * 25;
  compatibility += ratingSimilarity;

  compatibility = Math.round(Math.min(100, compatibility));

  // Generate message based on compatibility
  let message: string;
  if (compatibility >= 80) {
    message = "You're movie soulmates! Perfect taste alignment! 🎬✨";
  } else if (compatibility >= 60) {
    message = "Great match! You'll have awesome movie nights together! 🍿";
  } else if (compatibility >= 40) {
    message = "Good compatibility! Some overlap in your movie tastes.";
  } else if (compatibility >= 20) {
    message = "You have different tastes, but that's what makes it interesting!";
  } else {
    message = "Very different preferences - time to introduce each other to new genres!";
  }

  return {
    compatibility,
    sharedGenres,
    averageRatingDiff: ratingDiff,
    commonMovies: commonMovieCount,
    message,
  };
}

export function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-yellow-500';
  if (score >= 20) return 'text-orange-500';
  return 'text-red-500';
}

export function getCompatibilityGradient(score: number): string {
  if (score >= 80) return 'from-green-500/20 to-emerald-500/5';
  if (score >= 60) return 'from-blue-500/20 to-cyan-500/5';
  if (score >= 40) return 'from-yellow-500/20 to-amber-500/5';
  if (score >= 20) return 'from-orange-500/20 to-red-500/5';
  return 'from-red-500/20 to-pink-500/5';
}
