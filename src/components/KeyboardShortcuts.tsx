import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X, Heart, XIcon, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenBefore, setHasSeenBefore] = useState(false);

  useEffect(() => {
    // Show shortcuts helper on first visit
    const seen = localStorage.getItem('keyboard-shortcuts-seen');
    if (!seen) {
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('keyboard-shortcuts-seen', 'true');
      }, 3000);
    } else {
      setHasSeenBefore(true);
    }

    // Listen for '?' key to toggle shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const shortcuts = [
    {
      key: '←',
      icon: <ArrowLeft className="w-4 h-4" />,
      label: 'Left Arrow',
      description: 'Swipe left (pass)',
      color: 'text-red-500',
    },
    {
      key: '→',
      icon: <ArrowRight className="w-4 h-4" />,
      label: 'Right Arrow',
      description: 'Swipe right (like)',
      color: 'text-green-500',
    },
    {
      key: 'I',
      icon: <Info className="w-4 h-4" />,
      label: 'I Key',
      description: 'Show movie details',
      color: 'text-blue-500',
    },
    {
      key: '?',
      icon: <Keyboard className="w-4 h-4" />,
      label: '? Key',
      description: 'Toggle shortcuts',
      color: 'text-purple-500',
    },
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full shadow-lg bg-card/80 backdrop-blur-xl border-border/50 hover:scale-110 transition-transform"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Shortcuts Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <Card className="bg-card/95 backdrop-blur-xl border-border/50 p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Keyboard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-0">Keyboard Shortcuts</h3>
                      <p className="text-sm text-muted-foreground">Navigate faster with your keyboard</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Shortcuts List */}
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`${shortcut.color}`}>{shortcut.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{shortcut.description}</div>
                          <div className="text-xs text-muted-foreground">{shortcut.label}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-mono text-sm px-3 py-1">
                        {shortcut.key}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Tip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                  <p className="text-xs text-center text-muted-foreground">
                    💡 Press <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">?</kbd> anytime to toggle
                    this panel
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
