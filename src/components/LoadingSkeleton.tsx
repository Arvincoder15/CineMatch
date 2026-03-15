import { Skeleton } from './ui/skeleton';
import { motion } from 'motion/react';

export function MovieCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-border/50"
    >
      <Skeleton className="w-full h-2/3" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </motion.div>
  );
}

export function MatchCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-xl rounded-lg overflow-hidden shadow-sm border border-border/50"
    >
      <Skeleton className="w-full aspect-[2/3]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </motion.div>
  );
}

export function AIInsightSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 space-y-2 bg-card/50 rounded-lg"
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}