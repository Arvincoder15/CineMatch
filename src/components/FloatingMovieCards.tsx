import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface MovieCard {
  title: string;
  rating: number;
  genre: string;
  color: string;
}

const movies: MovieCard[] = [
  { title: "The Shawshank Redemption", rating: 9.3, genre: "Drama", color: "from-blue-500 to-cyan-500" },
  { title: "The Dark Knight", rating: 9.0, genre: "Action", color: "from-gray-700 to-gray-900" },
  { title: "Inception", rating: 8.8, genre: "Sci-Fi", color: "from-purple-500 to-pink-500" },
  { title: "Pulp Fiction", rating: 8.9, genre: "Crime", color: "from-orange-500 to-red-500" },
  { title: "Forrest Gump", rating: 8.8, genre: "Drama", color: "from-green-500 to-teal-500" },
];

export function FloatingMovieCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
      {movies.map((movie, index) => (
        <motion.div
          key={index}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          animate={{
            y: -200,
            rotate: Math.random() * 360 + 360,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: index * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute"
        >
          <div className={`bg-gradient-to-br ${movie.color} p-4 rounded-lg shadow-2xl w-48`}>
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
              <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                {movie.title}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-xs font-semibold">
                    {movie.rating}
                  </span>
                </div>
                <span className="text-white/80 text-xs">{movie.genre}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
