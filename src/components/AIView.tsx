import { AIRecommendations } from './AIRecommendations';
import { AIChat } from './AIChat';
import { Movie } from './MovieCard';

interface AIViewProps {
  likedMovies: Movie[];
  allMovies: Movie[];
}

export function AIView({ likedMovies, allMovies }: AIViewProps) {
  return (
    <main className="flex-1 w-full overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="mb-2">AI-Powered Insights</h2>
          <p className="text-muted-foreground">
            Get personalized recommendations and chat with our AI movie assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <AIRecommendations 
              likedMovies={likedMovies} 
              allMovies={allMovies}
            />
          </div>
          <div>
            <AIChat likedMovies={likedMovies} />
          </div>
        </div>
      </div>
    </main>
  );
}
