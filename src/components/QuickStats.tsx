import { Heart, X, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickStatsProps {
  liked: number;
  passed: number;
  matches: number;
}

export function QuickStats({ liked, passed, matches }: QuickStatsProps) {
  const total = liked + passed;
  const likeRate = total > 0 ? Math.round((liked / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-30 hidden md:block"
    >
      <div className="bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg p-4 space-y-3 min-w-[200px]">
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          Session Stats
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-green-500" />
            <span className="text-sm">Liked</span>
          </div>
          <span className="font-semibold">{liked}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-sm">Passed</span>
          </div>
          <span className="font-semibold">{passed}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Matches</span>
          </div>
          <span className="font-semibold">{matches}</span>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Like Rate</span>
            <span className="font-semibold text-primary">{likeRate}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
