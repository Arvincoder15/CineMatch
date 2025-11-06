// The Movie Database (TMDB) API integration
// TMDB is the most popular free alternative to IMDB API
// Sign up for a free API key at: https://www.themoviedb.org/settings/api

import { Movie } from '../components/MovieCard';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_API_KEY_STORAGE = 'tmdb_api_key';
const DEFAULT_API_KEY = '3ff5c79eca8ed5d1dda6b893bc66ca6e'; // Your TMDB API key

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Get API key from localStorage or use default
function getApiKey(): string | null {
  if (typeof window === 'undefined') return DEFAULT_API_KEY;
  const storedKey = localStorage.getItem(TMDB_API_KEY_STORAGE);
  return storedKey || DEFAULT_API_KEY;
}

// Save API key to localStorage
export function saveApiKey(apiKey: string): void {
  localStorage.setItem(TMDB_API_KEY_STORAGE, apiKey);
}

// Check if API key is configured
export function hasApiKey(): boolean {
  return true; // Always true since we have a default key
}

// Check if using custom API key
export function hasCustomApiKey(): boolean {
  if (typeof window === 'undefined') return false;
  const storedKey = localStorage.getItem(TMDB_API_KEY_STORAGE);
  return storedKey !== null && storedKey !== '';
}

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
}

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  imdb_id: string;
}

// Genre mapping from TMDB genre IDs to simple genre names
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Map user-friendly genre names to TMDB IDs
const GENRE_NAME_TO_ID: Record<string, number> = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'drama': 18,
  'fantasy': 14,
  'horror': 27,
  'mystery': 9648,
  'romance': 10749,
  'sci-fi': 878,
  'thriller': 53,
};

/**
 * Fetches popular movies from TMDB
 */
export async function fetchPopularMovies(page: number = 1): Promise<Movie[]> {
  const cacheKey = `popular_${page}`;
  const cached = getCached<Movie[]>(cacheKey);
  if (cached) {
    console.log('Returning cached popular movies');
    return cached;
  }

  const apiKey = getApiKey();
  
  // Use mock data if no API key is configured
  if (!apiKey) {
    console.log('No TMDB API key found. Using mock data.');
    return getMockMovies();
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}&language=en-US`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your TMDB API key.');
      }
      throw new Error('Failed to fetch movies from TMDB');
    }

    const data = await response.json();
    
    // Fetch detailed info for each movie to get runtime
    const moviesWithDetails = await Promise.all(
      data.results.slice(0, 20).map(async (movie: TMDBMovie) => {
        const details = await fetchMovieDetails(movie.id);
        return details;
      })
    );

    return moviesWithDetails;
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error);
    throw error;
  }
}

/**
 * Fetches detailed information for a specific movie
 */
async function fetchMovieDetails(movieId: number): Promise<Movie> {
  const cacheKey = `movie_${movieId}`;
  const cached = getCached<Movie>(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('No API key configured');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const movie: TMDBMovieDetails = await response.json();

    const movieData: Movie = {
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
      genre: movie.genres?.[0]?.name || 'Drama',
      rating: Math.round(movie.vote_average * 10) / 10,
      runtime: movie.runtime || 120,
      description: movie.overview || 'No description available.',
      posterUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=500',
      imdbId: movie.imdb_id,
    };

    setCache(cacheKey, movieData);
    return movieData;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Searches for movies by title
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return getMockMovies().filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data = await response.json();

    const moviesWithDetails = await Promise.all(
      data.results.slice(0, 10).map(async (movie: TMDBMovie) => {
        const details = await fetchMovieDetails(movie.id);
        return details;
      })
    );

    return moviesWithDetails;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

/**
 * Fetches movies by genre
 */
export async function fetchMoviesByGenre(genreId: number, page: number = 1): Promise<Movie[]> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    const genreName = GENRE_MAP[genreId];
    return getMockMovies().filter((m) => m.genre === genreName);
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc&language=en-US`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies by genre');
    }

    const data = await response.json();

    const moviesWithDetails = await Promise.all(
      data.results.slice(0, 15).map(async (movie: TMDBMovie) => {
        const details = await fetchMovieDetails(movie.id);
        return details;
      })
    );

    return moviesWithDetails;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
}

/**
 * Fetches movies based on user genre preferences
 */
export async function fetchMoviesByUserPreferences(
  genreNames: string[],
  page: number = 1
): Promise<Movie[]> {
  const cacheKey = `preferences_${genreNames.sort().join('_')}_${page}`;
  const cached = getCached<Movie[]>(cacheKey);
  if (cached) {
    console.log('Returning cached preference movies');
    return cached;
  }

  const apiKey = getApiKey();
  
  if (!apiKey || genreNames.length === 0) {
    return fetchPopularMovies(page);
  }

  // Convert genre names to TMDB genre IDs
  const genreIds = genreNames
    .map((name) => GENRE_NAME_TO_ID[name.toLowerCase()])
    .filter((id) => id !== undefined);

  if (genreIds.length === 0) {
    return fetchPopularMovies(page);
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genreIds.join(
        ','
      )}&page=${page}&sort_by=popularity.desc&language=en-US&vote_count.gte=100`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies by preferences');
    }

    const data = await response.json();

    const moviesWithDetails = await Promise.all(
      data.results.slice(0, 20).map(async (movie: TMDBMovie) => {
        const details = await fetchMovieDetails(movie.id);
        return details;
      })
    );

    setCache(cacheKey, moviesWithDetails);
    return moviesWithDetails;
  } catch (error) {
    console.error('Error fetching movies by preferences:', error);
    return fetchPopularMovies(page);
  }
}

/**
 * Mock movies data for development (used when API key is not configured)
 * Based on real TMDB movie data
 */
function getMockMovies(): Movie[] {
  return [
    {
      id: 533535,
      title: 'Deadpool & Wolverine',
      year: 2024,
      genre: 'Action',
      rating: 7.8,
      runtime: 128,
      description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again.',
      posterUrl: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTk3MzkzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt6263850',
    },
    {
      id: 558449,
      title: 'Gladiator II',
      year: 2024,
      genre: 'Action',
      rating: 6.8,
      runtime: 148,
      description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors.',
      posterUrl: 'https://images.unsplash.com/photo-1695037642839-ad92d088ce98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGZpbG0lMjBub2lyfGVufDF8fHx8MTc1OTc4MDE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt9218128',
    },
    {
      id: 1184918,
      title: 'The Wild Robot',
      year: 2024,
      genre: 'Animation',
      rating: 8.5,
      runtime: 102,
      description: 'A robot — ROZZUM unit 7134, "Roz" for short — is shipwrecked on an uninhabited island and must learn to adapt to the harsh surroundings.',
      posterUrl: 'https://images.unsplash.com/photo-1758726942669-92f7e499018c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjB0aGVhdGVyfGVufDF8fHx8MTc1OTc4MDE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt29623480',
    },
    {
      id: 912649,
      title: 'Venom: The Last Dance',
      year: 2024,
      genre: 'Sci-Fi',
      rating: 6.5,
      runtime: 109,
      description: 'Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision.',
      posterUrl: 'https://images.unsplash.com/photo-1687985826611-80b714011d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMHNwYWNlfGVufDF8fHx8MTc1OTc4MDE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt16366836',
    },
    {
      id: 762441,
      title: 'A Quiet Place: Day One',
      year: 2024,
      genre: 'Horror',
      rating: 6.9,
      runtime: 99,
      description: 'As New York City is invaded by alien creatures who hunt by sound, a woman must fight to survive.',
      posterUrl: 'https://images.unsplash.com/photo-1662414712336-12cb34792ad5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBkYXJrJTIwc2Nhcnl8ZW58MXx8fHwxNzU5NzgwMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt13433802',
    },
    {
      id: 1034062,
      title: 'Moana 2',
      year: 2024,
      genre: 'Adventure',
      rating: 7.0,
      runtime: 100,
      description: 'After receiving an unexpected call from her wayfinding ancestors, Moana journeys to the far seas of Oceania and into dangerous waters.',
      posterUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzU5Nzc0MTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt13622970',
    },
    {
      id: 519182,
      title: 'Despicable Me 4',
      year: 2024,
      genre: 'Comedy',
      rating: 7.2,
      runtime: 95,
      description: 'Gru and Lucy and their girls welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad.',
      posterUrl: 'https://images.unsplash.com/photo-1758726942669-92f7e499018c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjB0aGVhdGVyfGVufDF8fHx8MTc1OTc4MDE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt7510222',
    },
    {
      id: 698687,
      title: 'Transformers One',
      year: 2024,
      genre: 'Sci-Fi',
      rating: 8.1,
      runtime: 104,
      description: 'The untold origin story of Optimus Prime and Megatron, better known as sworn enemies, but who once were friends bonded like brothers.',
      posterUrl: 'https://images.unsplash.com/photo-1687985826611-80b714011d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMHNwYWNlfGVufDF8fHx8MTc1OTc4MDE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt5090568',
    },
    {
      id: 1241982,
      title: 'Wicked',
      year: 2024,
      genre: 'Drama',
      rating: 7.7,
      runtime: 160,
      description: 'Elphaba, a misunderstood young woman because of her green skin, and Glinda, a popular girl, become friends at Shiz University in the Land of Oz.',
      posterUrl: 'https://images.unsplash.com/photo-1695037642839-ad92d088ce98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGZpbG0lMjBub2lyfGVufDF8fHx8MTc1OTc4MDE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt1262426',
    },
    {
      id: 945961,
      title: 'Alien: Romulus',
      year: 2024,
      genre: 'Horror',
      rating: 7.3,
      runtime: 119,
      description: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
      posterUrl: 'https://images.unsplash.com/photo-1662414712336-12cb34792ad5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBkYXJrJTIwc2Nhcnl8ZW58MXx8fHwxNzU5NzgwMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt18412256',
    },
    {
      id: 1022789,
      title: 'Inside Out 2',
      year: 2024,
      genre: 'Animation',
      rating: 7.6,
      runtime: 96,
      description: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!',
      posterUrl: 'https://images.unsplash.com/photo-1758726942669-92f7e499018c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjB0aGVhdGVyfGVufDF8fHx8MTc1OTc4MDE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt22022452',
    },
    {
      id: 1159311,
      title: 'My Hero Academia: You\'re Next',
      year: 2024,
      genre: 'Action',
      rating: 6.7,
      runtime: 110,
      description: 'In a society where heroes and villains continuously battle in the name of peace, Deku encounters the greatest villain of all time.',
      posterUrl: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTk3MzkzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt23177694',
    },
    {
      id: 573435,
      title: 'Bad Boys: Ride or Die',
      year: 2024,
      genre: 'Action',
      rating: 7.6,
      runtime: 115,
      description: 'After their late former Captain is framed, Miami cops Mike Lowrey and Marcus Burnett aim to clear his name.',
      posterUrl: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTk3MzkzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt4919268',
    },
    {
      id: 1051896,
      title: 'Sonic the Hedgehog 3',
      year: 2024,
      genre: 'Adventure',
      rating: 7.8,
      runtime: 110,
      description: 'Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before.',
      posterUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzU5Nzc0MTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt12412888',
    },
    {
      id: 1064028,
      title: 'Subservience',
      year: 2024,
      genre: 'Sci-Fi',
      rating: 6.4,
      runtime: 105,
      description: 'A struggling father purchases a domestic SIM to help care for his house and family, but the android begins to want everything her new family has.',
      posterUrl: 'https://images.unsplash.com/photo-1687985826611-80b714011d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMHNwYWNlfGVufDF8fHx8MTc1OTc4MDE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      imdbId: 'tt13933388',
    },
  ];
}

export { GENRE_MAP };
