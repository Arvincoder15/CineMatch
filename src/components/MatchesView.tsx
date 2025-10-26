import { Movie } from './MovieCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Users } from 'lucide-react';

interface Match {
  movie: Movie;
  friends: string[];
}

interface MatchesViewProps {
  matches: Match[];
}

export function MatchesView({ matches }: MatchesViewProps) {
  if (matches.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <Users className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2>No Matches Yet</h2>
          <p className="text-muted-foreground">
            Start swiping to find movies you and your friends want to watch together!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-6">Your Matches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.movie.id}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <ImageWithFallback
                  src={match.movie.posterUrl}
                  alt={match.movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4 space-y-3">
                <h3>{match.movie.title}</h3>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{match.movie.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{match.movie.year}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Matched with {match.friends.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
