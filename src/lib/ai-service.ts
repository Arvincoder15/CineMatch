// AI Service for movie recommendations and insights
// In production, replace with real AI API calls (OpenAI, Anthropic, etc.)

interface MoviePreference {
  likedGenres: string[];
  averageRating: number;
  preferredRuntime: string;
}

export interface AIRecommendation {
  movieId: number;
  reason: string;
  confidence: number;
}

export interface AIInsight {
  personality: string;
  topGenres: string[];
  watchingStyle: string;
  suggestion: string;
}

// Mock AI responses - In production, replace with actual AI API calls
export async function generateRecommendations(
  likedMovies: Array<{ genre: string; rating: number; runtime: number }>,
  availableMovieIds: number[]
): Promise<AIRecommendation[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  /*
   * PRODUCTION IMPLEMENTATION:
   * 
   * const response = await fetch('https://api.openai.com/v1/chat/completions', {
   *   method: 'POST',
   *   headers: {
   *     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
   *     'Content-Type': 'application/json',
   *   },
   *   body: JSON.stringify({
   *     model: 'gpt-4',
   *     messages: [{
   *       role: 'system',
   *       content: 'You are a movie recommendation expert.'
   *     }, {
   *       role: 'user',
   *       content: `Based on these liked movies: ${JSON.stringify(likedMovies)}, 
   *                 recommend from these IDs: ${availableMovieIds}`
   *     }]
   *   })
   * });
   */

  // Mock recommendations based on genre preferences
  const genreCounts: Record<string, number> = {};
  likedMovies.forEach((movie) => {
    genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
  });

  const recommendations: AIRecommendation[] = availableMovieIds.slice(0, 3).map((id, index) => ({
    movieId: id,
    reason: getSmartReason(genreCounts, index),
    confidence: 0.85 - index * 0.1,
  }));

  return recommendations;
}

export async function generateInsights(
  likedMovies: Array<{ genre: string; rating: number; runtime: number }>
): Promise<AIInsight> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (likedMovies.length === 0) {
    return {
      personality: "New Explorer",
      topGenres: [],
      watchingStyle: "Just getting started",
      suggestion: "Start swiping to discover your taste!",
    };
  }

  // Analyze preferences
  const genreCounts: Record<string, number> = {};
  let totalRating = 0;
  let totalRuntime = 0;

  likedMovies.forEach((movie) => {
    genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
    totalRating += movie.rating;
    totalRuntime += movie.runtime;
  });

  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);

  const avgRating = totalRating / likedMovies.length;
  const avgRuntime = totalRuntime / likedMovies.length;

  const personality = getPersonality(topGenres, avgRating);
  const watchingStyle = getWatchingStyle(avgRuntime);
  const suggestion = getSuggestion(topGenres, avgRating);

  return {
    personality,
    topGenres,
    watchingStyle,
    suggestion,
  };
}

export async function chatWithAI(
  message: string,
  context: { likedMovies: Array<{ title: string; genre: string }> }
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  /*
   * PRODUCTION IMPLEMENTATION:
   * 
   * const response = await fetch('https://api.openai.com/v1/chat/completions', {
   *   method: 'POST',
   *   headers: {
   *     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
   *     'Content-Type': 'application/json',
   *   },
   *   body: JSON.stringify({
   *     model: 'gpt-4',
   *     messages: [{
   *       role: 'system',
   *       content: `You are a helpful movie recommendation assistant. 
   *                 User has liked: ${JSON.stringify(context.likedMovies)}`
   *     }, {
   *       role: 'user',
   *       content: message
   *     }]
   *   })
   * });
   */

  // Mock AI responses
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    if (context.likedMovies.length > 0) {
      const genre = context.likedMovies[0].genre;
      return `Based on your love for ${genre} movies, I'd recommend checking out "Quantum Shift" - it's a mind-bending sci-fi thriller that pushes the boundaries of reality. You might also enjoy "Ocean's Depth" for its epic adventure elements!`;
    }
    return "I'd love to recommend movies! Start swiping to help me understand your taste better.";
  }

  if (lowerMessage.includes('taste') || lowerMessage.includes('preference')) {
    if (context.likedMovies.length > 0) {
      const genres = [...new Set(context.likedMovies.map((m) => m.genre))].join(', ');
      return `You seem to enjoy ${genres} films! You appreciate stories with depth and visual spectacle. Keep exploring - there's so much more to discover!`;
    }
    return "I'm still learning about your preferences. Swipe on a few movies and I'll give you personalized insights!";
  }

  if (lowerMessage.includes('match') || lowerMessage.includes('friend')) {
    return "Your matches show you and your friends have great taste! Consider organizing a movie night for your shared favorites. The more you swipe, the more matches you'll discover!";
  }

  return `That's a great question! I'm here to help you discover amazing movies. Based on your activity, I think you'd love exploring more films. Keep swiping and let me know if you need specific recommendations!`;
}

// Helper functions for generating insights
function getPersonality(genres: string[], avgRating: number): string {
  if (avgRating > 8.5) return "The Critic";
  if (genres.includes("Sci-Fi")) return "The Visionary";
  if (genres.includes("Drama")) return "The Intellectual";
  if (genres.includes("Comedy")) return "The Fun-Seeker";
  if (genres.includes("Action")) return "The Thrill-Seeker";
  return "The Explorer";
}

function getWatchingStyle(avgRuntime: number): string {
  if (avgRuntime > 140) return "Epic Marathon Watcher";
  if (avgRuntime > 120) return "Feature Film Enthusiast";
  return "Quick & Engaging Viewer";
}

function getSuggestion(genres: string[], avgRating: number): string {
  if (genres.length === 1) {
    return `Try branching out from ${genres[0]} to discover new favorites!`;
  }
  if (avgRating > 8.5) {
    return "You have excellent taste! Explore critically acclaimed films outside your comfort zone.";
  }
  return "Keep exploring different genres to find hidden gems that match your taste!";
}

function getSmartReason(genreCounts: Record<string, number>, index: number): string {
  const reasons = [
    "Perfect match for your taste profile",
    "Highly rated and trending in your preferred genres",
    "Similar themes to your recent likes",
  ];
  return reasons[index] || "Recommended for you";
}
