import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'motion/react';
import { ReactNode, useState } from 'react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipe: (direction: 'left' | 'right') => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeableCard({ children, onSwipe, onSwipeLeft, onSwipeRight }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;
    
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      
      // Animate card flying off screen
      setExitX(direction === 'right' ? 1000 : -1000);
      await controls.start({
        x: direction === 'right' ? 1000 : -1000,
        y: info.offset.y,
        opacity: 0,
        transition: { duration: 0.3 },
      });
      
      onSwipe(direction);
      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      // Spring back to center
      controls.start({
        x: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      });
    }
  };

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
      }}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing touch-none"
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
    >
      {children}
      
      {/* Swipe indicators */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg rotate-12 pointer-events-none z-10 border-4 border-white"
      >
        <span className="font-bold tracking-wider">LIKE</span>
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg -rotate-12 pointer-events-none z-10 border-4 border-white"
      >
        <span className="font-bold tracking-wider">NOPE</span>
      </motion.div>
    </motion.div>
  );
}
