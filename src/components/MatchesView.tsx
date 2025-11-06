import { useState } from 'react';
import { Movie } from './MovieCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Users, Search, Filter, SlidersHorizontal, Info } from 'lucide-react';
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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl mb-4">🎭</div>
          <h2>No Matches Yet</h2>
          <p className="text-muted-foreground">
            Start swiping to find movies you and your friends want to watch together!
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 When you and a friend both like the same movie, it'll appear here as a match!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="mb-4">Your Matches</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies or friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                <Button variant="outline">
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
            <p className="text-sm text-muted-foreground">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>
        
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No matches found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.movie.id}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedMovie(match.movie)}
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={match.movie.posterUrl}
                  alt={match.movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMovie(match.movie);
                  }}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="mb-1 line-clamp-1">{match.movie.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {match.movie.genre}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{match.movie.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{match.movie.year}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {match.friends.length === 1 
                      ? `With ${match.friends[0]}`
                      : `With ${match.friends.length} friends`}
                  </span>
                </div>
              </div>
            </div>
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
