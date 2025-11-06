// AI Service for movie recommendations and insights
// Using Google Gemini API for real AI responses

const GEMINI_API_KEY_STORAGE = 'cinematch_gemini_api_key';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Get Gemini API key from localStorage
function getGeminiApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GEMINI_API_KEY_STORAGE);
}

// Save Gemini API key to localStorage
export function saveGeminiApiKey(apiKey: string): void {
  localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey);
}

// Check if Gemini API key is configured
export function hasGeminiApiKey(): boolean {
  const key = getGeminiApiKey();
  return key !== null && key !== '';
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
  const apiKey = getGeminiApiKey();

  // Use mock responses if no API key
  if (!apiKey) {
    return getMockChatResponse(message, context);
  }

  try {
    // Build context about user's movie preferences
    let movieContext = '';
    if (context.likedMovies.length > 0) {
      const movieList = context.likedMovies
        .map((m) => `${m.title} (${m.genre})`)
        .join(', ');
      movieContext = `The user has liked these movies: ${movieList}. `;
    }

    const systemPrompt = `You are a friendly and knowledgeable AI movie assistant for CineMatch, a Tinder-style movie discovery app. ${movieContext}

Be conversational and natural - respond to greetings warmly, answer questions directly, and maintain context throughout the conversation. Keep responses concise (2-3 sentences) but informative. Be enthusiastic about movies and personalize your recommendations based on the user's taste. If asked about incomplete topics or unclear questions, politely ask for clarification.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      console.error('Invalid Gemini response format:', data);
      throw new Error('Invalid response format');
    }

    return aiResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to mock responses
    return getMockChatResponse(message, context);
  }
}

// Conversation history to avoid repetition
let conversationHistory: Array<{ message: string; response: string }> = [];

// Mock AI responses fallback - More conversational and context-aware
function getMockChatResponse(
  message: string,
  context: { likedMovies: Array<{ title: string; genre: string }> }
): string {
  const lowerMessage = message.toLowerCase().trim();
  const hasLikedMovies = context.likedMovies.length > 0;

  // Check if we've answered this exact question recently
  const recentSimilar = conversationHistory
    .slice(-5)
    .find(h => h.message.toLowerCase() === lowerMessage);
  
  if (recentSimilar && conversationHistory.length > 2) {
    const variations = [
      "I just answered that! Anything else you'd like to know?",
      "We covered that already. What else can I help with?",
      "I think I mentioned that earlier. Try asking something different!",
    ];
    const response = variations[Math.floor(Math.random() * variations.length)];
    conversationHistory.push({ message, response });
    return response;
  }

  // Greetings (including variations like "hi gemini", "hello there", etc.)
  if (/^(hi|hello|hey|sup|yo|greetings|howdy)\b/i.test(lowerMessage)) {
    if (hasLikedMovies) {
      return `Hey! I see you've been swiping on some movies. Want to chat about your taste, or need some recommendations?`;
    }
    return "Hi there! I'm your AI movie assistant. Ask me anything about movies, or start swiping to build your taste profile!";
  }

  // Questions about the AI itself
  if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || lowerMessage.includes('gemini')) {
    return "I'm your AI movie assistant, here to help you discover films you'll love! I can analyze your taste, suggest movies, and chat about cinema. What would you like to know?";
  }

  // How are you / thanks / goodbye
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u')) {
    return "I'm doing great! Ready to talk movies. What's on your mind?";
  }

  if (lowerMessage.includes('thank') || lowerMessage.includes('thx') || lowerMessage.includes('ty')) {
    return "You're very welcome! Let me know if you need anything else!";
  }

  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
    return "Happy watching! Come back anytime you need movie recommendations! 🎬";
  }

  // Questions about favorite movies
  if ((lowerMessage.includes('favorite') || lowerMessage.includes('fav') || lowerMessage.includes('best')) && 
      (lowerMessage.includes('movie') || lowerMessage.includes('film'))) {
    if (hasLikedMovies) {
      const topMovie = context.likedMovies[0];
      if (context.likedMovies.length === 1) {
        return `So far, you've liked ${topMovie.title}! Keep swiping to build up your favorites list.`;
      }
      const movieList = context.likedMovies.slice(0, 3).map(m => m.title).join(', ');
      return `Based on your swipes, you've loved ${movieList}${context.likedMovies.length > 3 ? `, and ${context.likedMovies.length - 3} more` : ''}! Great taste!`;
    }
    return "You haven't liked any movies yet! Start swiping to build your favorites list, then I can tell you all about your taste.";
  }

  // Recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('what should i watch')) {
    if (hasLikedMovies) {
      const genres = [...new Set(context.likedMovies.map((m) => m.genre))];
      const genreText = genres.slice(0, 2).join(' and ');
      return `Based on your love for ${genreText}, I'd suggest exploring more highly-rated films in those genres. Keep swiping and I'll help you discover hidden gems!`;
    }
    return "I'd love to recommend movies! Swipe on a few films first so I can understand your taste, then I'll give you personalized suggestions.";
  }

  // Taste and preferences
  if (lowerMessage.includes('taste') || lowerMessage.includes('preference') || lowerMessage.includes('what do i like')) {
    if (hasLikedMovies) {
      const genres = [...new Set(context.likedMovies.map((m) => m.genre))];
      const genreList = genres.join(', ');
      return `You're into ${genreList} films! ${genres.length > 2 ? "You have diverse taste!" : "That's a solid preference!"} Want me to analyze your viewing style more?`;
    }
    return "I'm still learning about your preferences. Like a few movies and I'll give you detailed insights about your taste!";
  }

  // Matches and friends
  if (lowerMessage.includes('match') || lowerMessage.includes('friend')) {
    return "Matches are awesome! When you and your friends both like the same movie, you'll get notified. The more you swipe, the more matches you'll find!";
  }

  // Help
  if (lowerMessage.includes('help') || lowerMessage === '?') {
    return "I can help you with: movie recommendations based on your taste, insights about what you like, general movie questions, and more! What interests you?";
  }

  // Specific genres
  if (lowerMessage.includes('action') || lowerMessage.includes('thriller')) {
    return "Action and thrillers are intense! Look for high-octane films with great pacing. Swipe right on some action movies and I'll learn what style you prefer!";
  }

  if (lowerMessage.includes('comedy') || lowerMessage.includes('funny')) {
    return "Comedy is great! From slapstick to dark humor, there's so much variety. Keep swiping to find what makes you laugh!";
  }

  if (lowerMessage.includes('drama')) {
    return "Drama films have the best character development and emotional depth. Check out critically acclaimed dramas and see what resonates!";
  }

  if (lowerMessage.includes('horror') || lowerMessage.includes('scary')) {
    return "Horror fan! Whether you like psychological thrillers or jump scares, there's something for everyone. What kind of scares do you enjoy?";
  }

  if (lowerMessage.includes('sci-fi') || lowerMessage.includes('science fiction') || lowerMessage.includes('scifi')) {
    return "Sci-fi is amazing! From space exploration to dystopian futures, the genre is incredibly diverse. Keep exploring!";
  }

  // Very short or incomplete messages
  if (lowerMessage.length < 3) {
    return "I didn't quite catch that. Could you tell me more about what you're looking for?";
  }

  // Tell me about...
  if (lowerMessage.startsWith('tell me about') || lowerMessage.startsWith('what about')) {
    const topic = lowerMessage.replace(/^(tell me about|what about)\s+/, '').trim();
    if (topic.length < 2) {
      return "Tell you about what? I can discuss your movie preferences, recommend films, or answer questions about cinema!";
    }
    // Try to match a movie in their liked list
    const matchedMovie = context.likedMovies.find(m => 
      m.title.toLowerCase().includes(topic) || topic.includes(m.title.toLowerCase())
    );
    if (matchedMovie) {
      return `${matchedMovie.title} is a great ${matchedMovie.genre} film! You liked it, which tells me you appreciate that genre. Want similar recommendations?`;
    }
    return `I'm not sure about "${topic}" specifically, but I can help you find great movies! What genre are you interested in?`;
  }

  // Questions about the app
  if (lowerMessage.includes('how does this work') || lowerMessage.includes('how do i')) {
    return "Swipe right to like movies, left to pass. When you and your friends both like the same movie, you'll get a match! I'm here to help you find films based on your taste.";
  }

  // Generic question words - be more helpful
  if (lowerMessage.includes('what') || lowerMessage.includes('why') || lowerMessage.includes('how')) {
    if (hasLikedMovies) {
      return "Interesting question! Based on your viewing history, I can help with recommendations or insights. What specifically would you like to know?";
    }
    return "I can answer movie-related questions! Try asking me for recommendations, or start swiping to build your profile.";
  }

  // Default response - more helpful
  let response: string;
  if (hasLikedMovies) {
    response = `I'm not quite sure what you're asking, but I'm here to help! You've liked ${context.likedMovies.length} movie${context.likedMovies.length > 1 ? 's' : ''} so far. Want insights or recommendations based on your taste?`;
  } else {
    response = "I'm here to help you discover movies! Try asking me for recommendations, insights about genres, or start swiping to build your taste profile. What interests you?";
  }
  
  conversationHistory.push({ message, response });
  
  // Keep history manageable
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }
  
  return response;
}

// Reset conversation history when needed
export function resetConversationHistory() {
  conversationHistory = [];
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
