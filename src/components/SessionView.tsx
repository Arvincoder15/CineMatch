import { Users, Copy, Check, Sparkles, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Session } from '../lib/session-manager';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { ParticleField } from './ParticleField';

interface SessionViewProps {
  session: Session;
  currentUserId: string;
  onStartSwiping: () => void;
}

export function SessionView({ session: initialSession, currentUserId, onStartSwiping }: SessionViewProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const previousUserIdsRef = useRef<string[]>(initialSession.users.map((user) => user.id));

  useEffect(() => {
    const previousUserIds = previousUserIdsRef.current;
    const newUsers = initialSession.users.filter((user) => !previousUserIds.includes(user.id));

    newUsers.forEach((user) => {
      toast.success(`${user.username} joined the session!`);
    });

    previousUserIdsRef.current = initialSession.users.map((user) => user.id);
  }, [initialSession.users]);

  const session = initialSession;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    toast.success('Session code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
      {/* Particle field background */}
      <ParticleField />

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-muted/30 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 border border-cyan-200 mb-4"
              >
                <Users className="w-8 h-8 text-cyan-700 dark:text-cyan-300" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                Session Ready!
              </h2>
              <p className="text-muted-foreground">
                Share the code with friends to join
              </p>
            </motion.div>

            <div className="space-y-6">
              {/* Session Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6 text-center relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-cyan-100/60"
                />
                <p className="text-muted-foreground mb-2 text-sm font-medium">Session Code</p>
                <div className="flex items-center justify-center gap-2">
                  <h1 className="tracking-[0.5em] text-3xl font-bold text-foreground">
                    {session.code}
                  </h1>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>

              {/* Session Members */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    Session Members
                    <Badge variant="secondary" className="font-semibold">
                      {session.users.length}
                    </Badge>
                  </h3>
                  {session.users.length > 1 && (
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {session.users.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-card/50 backdrop-blur-sm border rounded-xl hover:bg-card/80 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{user.username}</p>
                            {user.id === currentUserId && (
                              <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {user.genres.join(', ')} • {user.vibe}
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-yellow-500 ml-2" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t"
              >
                {/* Local mode warning */}
                {session.isLocal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Local Mode</p>
                      <p className="text-yellow-600/90 dark:text-yellow-400/90">
                        Backend unavailable. Sessions won't sync across devices. Only same-device matches will work.
                      </p>
                    </div>
                  </motion.div>
                )}
                
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Everyone can start swiping individually. You'll see matches when you both like the same movie!
                </p>
                <Button
                  onClick={onStartSwiping}
                  className="w-full h-12 font-semibold bg-primary text-primary-foreground hover:from-cyan-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span>Start Swiping</span>
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Waiting message */}
        {session.users.length === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⏳
              </motion.div>
              <span>Waiting for friends to join...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}