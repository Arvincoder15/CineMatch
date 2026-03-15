import { AIRecommendations } from './AIRecommendations';
import { AIChat } from './AIChat';
import { MovieComparison } from './MovieComparison';
import { Movie } from './MovieCard';
import { Sparkles, TrendingUp, MessageSquare, Zap } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';

interface AIViewProps {
  likedMovies: Movie[];
  allMovies: Movie[];
}

export function AIView({ likedMovies, allMovies }: AIViewProps) {
  return (
    <main className="flex-1 w-full overflow-auto relative">
      {/* Subtle background */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 rounded-xl bg-cyan-100 border border-cyan-200"
            >
              <Sparkles className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
            </motion.div>
            <div>
              <h2 className="mb-0 text-3xl font-bold text-foreground">
                AI-Powered Insights
              </h2>
              <p className="text-muted-foreground mt-1">
                Get personalized recommendations and chat with our AI movie assistant
              </p>
            </div>
          </div>
        </motion.div>

        {likedMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Alert className="mb-6 border-cyan-300 bg-cyan-50">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="h-4 w-4 text-cyan-700" />
              </motion.div>
              <AlertDescription className="text-sm">
                Start swiping on movies to unlock personalized AI recommendations and insights about your taste!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Taste Profile */}
        {likedMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <MovieComparison likedMovies={likedMovies} />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-cyan-100 border border-cyan-200">
                <TrendingUp className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />
              </div>
              <h3 className="mb-0 font-semibold text-xl">Your Recommendations</h3>
            </div>
            <AIRecommendations 
              likedMovies={likedMovies} 
              allMovies={allMovies}
            />
          </motion.div>

          {/* AI Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-lg bg-sky-100 border border-sky-200"
              >
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h3 className="mb-0 font-semibold text-xl flex items-center gap-2">
                AI Assistant
                <Zap className="w-4 h-4 text-yellow-500" />
              </h3>
            </div>
            <AIChat likedMovies={likedMovies} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}