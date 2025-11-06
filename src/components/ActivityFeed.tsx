import { useEffect, useState } from 'react';
import { Heart, X, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Activity {
  id: string;
  type: 'like' | 'pass' | 'match' | 'join';
  message: string;
  timestamp: number;
}

let activityQueue: Activity[] = [];
let activityCounter = 0;

export function addActivity(type: Activity['type'], message: string) {
  const activity: Activity = {
    id: `activity-${activityCounter++}`,
    type,
    message,
    timestamp: Date.now(),
  };
  activityQueue.push(activity);
  if (activityQueue.length > 5) {
    activityQueue = activityQueue.slice(-5);
  }
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activityQueue.length > 0) {
        setActivities([...activityQueue]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-green-500" />;
      case 'pass':
        return <X className="w-4 h-4 text-red-500" />;
      case 'match':
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'join':
        return <Users className="w-4 h-4 text-blue-500" />;
    }
  };

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {activities.slice(-3).map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg"
          >
            {getIcon(activity.type)}
            <span className="text-sm">{activity.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
