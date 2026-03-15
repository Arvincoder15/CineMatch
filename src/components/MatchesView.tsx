import { useState } from 'react';
import { Movie } from './MovieCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Users, Search, Filter, SlidersHorizontal, Info, Sparkles, Heart } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MovieDetailsModal } from './MovieDetailsModal';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface Match {
  movie: Movie;
  friends: string[];
}

interface MatchesViewProps {
  matches: Match[];
}

export function MatchesView({ matches }: MatchesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'friends'>('recent');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Get unique genres from matches
  const genres = ['all', ...new Set(matches.map(m => m.movie.genre))];

  // Filter and sort matches
  let filteredMatches = matches.filter(match => {
    const matchesSearch = match.movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.friends.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = filterGenre === 'all' || match.movie.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  // Sort matches
  filteredMatches = [...filteredMatches].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.movie.rating - a.movie.rating;
      case 'friends':
        return b.friends.length - a.friends.length;
      case 'recent':
      default:
        return b.movie.year - a.movie.year;
    }
  });

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-background to-amber-500/5" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎭
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-teal-500 bg-clip-text text-transparent">
            No Matches Yet
          </h2>
          <p className="text-muted-foreground">
            Start swiping to find movies you and your friends want to watch together!
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-card/50 backdrop-blur-sm border rounded-xl"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-amber-500" />
              When you and a friend both like the same movie, it'll appear here as a match!
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
              <Sparkles className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-teal-500 bg-clip-text text-transparent">
              Your Matches
            </h2>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies or friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'rating' ? 'Rating' : 'Friends'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <DropdownMenuRadioItem value="recent">Recent</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rating">Highest Rating</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="friends">Most Friends</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterGenre === 'all' ? 'All Genres' : filterGenre}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by genre</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterGenre} onValueChange={setFilterGenre}>
                  {genres.map(genre => (
                    <DropdownMenuRadioItem key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </motion.div>
        
        {filteredMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No matches found. Try adjusting your filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match, index) => (
              <motion.div
                key={match.movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-card/80 backdrop-blur-sm border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                onClick={() => setSelectedMovie(match.movie)}
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={match.movie.posterUrl}
                    alt={match.movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Match badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 + index * 0.05 }}
                    className="absolute top-3 left-3"
                  >
                    <Badge className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white border-0 shadow-lg">
                      <Heart className="w-3 h-3 mr-1 fill-white" />
                      Match
                    </Badge>
                  </motion.div>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMovie(match.movie);
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </Button>

                  {/* Rating overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm font-semibold">{match.movie.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1 line-clamp-1">{match.movie.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {match.movie.genre}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{match.movie.year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Users className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
                    <span className="text-sm font-medium line-clamp-1">
                      {match.friends.length === 1 
                        ? `With ${match.friends[0]}`
                        : `With ${match.friends.length} friends`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={selectedMovie !== null}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
