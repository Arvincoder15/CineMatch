// AI Service for movie recommendations and insights.
// Uses Google Gemini when available and falls back to local logic if needed.

const GEMINI_API_KEY_STORAGE = 'cinematch_gemini_api_key';
const ENV_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim() || '';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_CONVERSATION_TURNS = 12;

function getGeminiApiKey(): string {
  if (typeof window === 'undefined') {
    return ENV_GEMINI_API_KEY;
  }

  const savedKey = window.localStorage.getItem(GEMINI_API_KEY_STORAGE)?.trim();
  return savedKey || ENV_GEMINI_API_KEY;
}

export function saveGeminiApiKey(apiKey: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    window.localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    return;
  }

  window.localStorage.setItem(GEMINI_API_KEY_STORAGE, trimmedKey);
}

export function hasGeminiApiKey(): boolean {
  return Boolean(getGeminiApiKey());
}

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

type ConversationRole = 'user' | 'ai';

interface ConversationMessage {
  role: ConversationRole;
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

function buildTasteSummary(
  likedMovies: Array<{ title?: string; genre: string; rating?: number; runtime?: number }>
): string {
  if (likedMovies.length === 0) {
    return 'The user has not liked any movies yet.';
  }

  const genres = [...new Set(likedMovies.map((movie) => movie.genre))];
  const titles = likedMovies
    .map((movie) => movie.title)
    .filter(Boolean)
    .slice(0, 8)
    .join(', ');
  const averageRating = likedMovies.some((movie) => typeof movie.rating === 'number')
    ? (
        likedMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) / likedMovies.length
      ).toFixed(1)
    : 'unknown';

  return [
    `Liked movie count: ${likedMovies.length}.`,
    titles ? `Liked titles: ${titles}.` : '',
    `Top genres: ${genres.join(', ')}.`,
    `Average liked rating: ${averageRating}.`,
  ]
    .filter(Boolean)
    .join(' ');
}

async function callGemini(
  systemInstruction: string,
  conversationHistory: ConversationMessage[],
  latestUserMessage: string
): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const normalizedHistory = conversationHistory
    .slice(-MAX_CONVERSATION_TURNS)
    .map((message) => ({
      role: message.role === 'ai' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        ...normalizedHistory,
        {
          role: 'user',
          parts: [{ text: latestUserMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.75,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  return text || null;
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
  context: { likedMovies: Array<{ title: string; genre: string }> },
  conversationHistory: ConversationMessage[] = []
): Promise<string> {
  const systemInstruction = [
    'You are CineMatch, a sharp, conversational movie assistant inside a collaborative movie-matching app.',
    'Your job is to hold an actual back-and-forth conversation, not dump generic advice.',
    'Be specific, grounded, and natural. Reference the user\'s liked movies and genres when relevant.',
    'If the user asks for a recommendation, explain why it fits their taste and keep the answer practical.',
    'If the request is ambiguous, ask one concise follow-up question instead of guessing wildly.',
    'Avoid saying you are powered by AI or listing generic capabilities unless directly asked.',
    'Keep most answers between 2 and 5 sentences unless the user explicitly asks for a deeper answer.',
    `Current taste profile: ${buildTasteSummary(context.likedMovies)}`,
  ].join(' ');

  try {
    const aiResponse = await callGemini(systemInstruction, conversationHistory, message);
    if (aiResponse) {
      return aiResponse;
    }
  } catch (error) {
    console.error('Gemini chat failed, falling back to local response:', error);
  }

  return getMockChatResponse(message, context);
}

// Mock AI responses fallback - More conversational and context-aware
function getMockChatResponse(
  message: string,
  context: { likedMovies: Array<{ title: string; genre: string }> }
): string {
  const lowerMessage = message.toLowerCase().trim();
  const hasLikedMovies = context.likedMovies.length > 0;

  // Greetings
  if (/^(hi|hello|hey|sup|yo|greetings|howdy|what's up|whats up|wassup)$/i.test(lowerMessage)) {
    if (hasLikedMovies) {
      return `Hey! I see you've liked ${context.likedMovies.length} movie${context.likedMovies.length > 1 ? 's' : ''}. Want to chat about your taste or get recommendations?`;
    }
    return "Hi there! I'm your AI movie assistant. Start swiping on some movies, then I can give you personalized recommendations!";
  }

  // Thanks
  if (/thank|thanks|thx|ty|appreciate/i.test(lowerMessage)) {
    return "You're welcome! Let me know if you need anything else! 🎬";
  }

  // Goodbye
  if (/bye|goodbye|see you|later|cya/i.test(lowerMessage)) {
    return "Happy watching! Come back anytime! 🍿";
  }

  // How are you
  if (/how are you|how r u/i.test(lowerMessage)) {
    return "I'm doing great! Ready to help you discover awesome movies. What's on your mind?";
  }

  // Help
  if (/help|what can you do/i.test(lowerMessage)) {
    return "I can help you with:\n• Movie recommendations based on your taste\n• Insights about what genres you like\n• General movie questions\n• Suggestions for what to watch next!\n\nJust ask me anything!";
  }

  // Recommendations
  if (/recommend|suggest|what should i watch|what to watch/i.test(lowerMessage)) {
    if (hasLikedMovies) {
      const genres = [...new Set(context.likedMovies.map(m => m.genre))];
      const genreText = genres.slice(0, 2).join(' and ');
      return `Based on your love for ${genreText} movies, I'd suggest continuing to swipe! You'll find more great ${genreText} films in the deck. Keep going!`;
    }
    return "I'd love to recommend movies! Start swiping to like a few films first, then I can understand your taste and give you personalized suggestions.";
  }

  // Taste/preferences
  if (/my taste|my preference|what do i like|taste profile|my style/i.test(lowerMessage)) {
    if (hasLikedMovies) {
      const genres = [...new Set(context.likedMovies.map(m => m.genre))];
      const movieList = context.likedMovies.slice(0, 3).map(m => m.title).join(', ');
      return `You've liked ${movieList}${context.likedMovies.length > 3 ? ` and ${context.likedMovies.length - 3} more` : ''}! You're into ${genres.join(', ')} films. ${genres.length > 2 ? "You have diverse taste!" : "That's a solid preference!"}`;
    }
    return "Like a few movies first by swiping, then I'll analyze your taste and tell you all about your preferences!";
  }

  // Favorite movies
  if (/favorite|favourite|fav|best.*movie/i.test(lowerMessage)) {
    if (hasLikedMovies) {
      const topMovies = context.likedMovies.slice(0, 3).map(m => m.title).join(', ');
      return `Based on your swipes, you've loved ${topMovies}${context.likedMovies.length > 3 ? ` and ${context.likedMovies.length - 3} more` : ''}! Great taste!`;
    }
    return "You haven't liked any movies yet! Start swiping to build your favorites list.";
  }

  // Matches and friends
  if (/match|friend|share|session|code/i.test(lowerMessage)) {
    return "When you and your friends both like the same movie, you'll get a match! Share your session code so friends can join and swipe together.";
  }

  // How the app works
  if (/how does|how do i|how to use|how it works/i.test(lowerMessage)) {
    return "Swipe right (❤️) to like movies, left (✕) to pass. When you and friends both like the same movie, you get a match! I'm here to help you discover films. Simple!";
  }

  // Specific genres
  if (/action|thriller/i.test(lowerMessage)) {
    return "Action and thrillers are intense! Keep swiping to find high-octane films like Mission Impossible, John Wick, or Christopher Nolan movies.";
  }

  if (/comedy|funny/i.test(lowerMessage)) {
    return "Comedy is great! From witty dialogue to slapstick, there's huge variety. Keep swiping to find what makes you laugh!";
  }

  if (/drama|emotional/i.test(lowerMessage)) {
    return "Drama films have incredible character depth! Check out critically acclaimed films like The Shawshank Redemption or Parasite.";
  }

  if (/horror|scary/i.test(lowerMessage)) {
    return "Horror fan! Whether you like psychological thrillers or jump scares, keep swiping to find your perfect scary movie!";
  }

  if (/sci-fi|science fiction|scifi/i.test(lowerMessage)) {
    return "Sci-fi is amazing! From space exploration to dystopian futures, the genre is incredibly diverse. Keep exploring!";
  }

  if (/romance|romantic/i.test(lowerMessage)) {
    return "Romance movies can be heartwarming! From classics to modern gems, there's a lot to love. Keep swiping!";
  }

  if (/animation|animated|pixar|disney/i.test(lowerMessage)) {
    return "Animated films aren't just for kids! Pixar and Studio Ghibli create masterpieces. Try Spirited Away or Inside Out!";
  }

  // Default response
  if (hasLikedMovies) {
    const genres = [...new Set(context.likedMovies.map(m => m.genre))];
    return `I'm here to help! You've liked ${context.likedMovies.length} ${genres.join(', ')} movie${context.likedMovies.length > 1 ? 's' : ''}. Ask me for recommendations, insights, or questions about specific genres!`;
  }
  
  return "I'm here to help you discover movies! Ask me for recommendations, insights about genres, or start swiping to build your taste profile!";
}

// Reset conversation history when needed
export function resetConversationHistory() {
  // No conversation history to reset
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