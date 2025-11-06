import { AIRecommendations } from './AIRecommendations';
import { AIChat } from './AIChat';
import { Movie } from './MovieCard';
import { Sparkles, TrendingUp, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AIViewProps {
  likedMovies: Movie[];
  allMovies: Movie[];
}

export function AIView({ likedMovies, allMovies }: AIViewProps) {
  return (
    <main className="flex-1 w-full overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="mb-0">AI-Powered Insights</h2>
          </div>
          <p className="text-muted-foreground">
            Get personalized recommendations and chat with our AI movie assistant
          </p>
        </div>

        {likedMovies.length === 0 && (
          <Alert className="mb-6">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Start swiping on movies to unlock personalized AI recommendations and insights about your taste!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="mb-0">Your Recommendations</h3>
            </div>
            <AIRecommendations 
              likedMovies={likedMovies} 
              allMovies={allMovies}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="mb-0">AI Assistant</h3>
            </div>
            <AIChat likedMovies={likedMovies} />
          </div>
        </div>
      </div>
    </main>
  );
}
