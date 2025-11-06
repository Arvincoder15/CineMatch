import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const moviePosters = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
  'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
];

export function MovieReelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
      
      {/* Left reel */}
      <motion.div
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 top-0 bottom-0 w-32 space-y-4 opacity-20"
      >
        {[...moviePosters, ...moviePosters].map((poster, i) => (
          <motion.div
            key={`left-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg"
          >
            <img 
              src={poster} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-semibold">
                {(Math.random() * 3 + 7).toFixed(1)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Right reel */}
      <motion.div
        animate={{ y: [-50, 0, -50] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute right-0 top-0 bottom-0 w-32 space-y-4 opacity-20"
      >
        {[...moviePosters.reverse(), ...moviePosters].map((poster, i) => (
          <motion.div
            key={`right-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg"
          >
            <img 
              src={poster} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-semibold">
                {(Math.random() * 3 + 7).toFixed(1)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
