import { useState, useEffect } from 'react';
import { Settings, ExternalLink, Info, Check, Sparkles, Film, Zap } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { saveApiKey, hasApiKey, hasCustomApiKey } from '../lib/tmdb-api';
import { saveGeminiApiKey, hasGeminiApiKey } from '../lib/ai-service';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface ApiSettingsProps {
  onApiKeyChange?: () => void;
}

export function ApiSettings({ onApiKeyChange }: ApiSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasTmdbKey, setHasTmdbKey] = useState(false);
  const [hasCustomTmdbKey, setHasCustomTmdbKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    setHasTmdbKey(hasApiKey());
    setHasCustomTmdbKey(hasCustomApiKey());
    setHasGeminiKey(hasGeminiApiKey());
  }, [isOpen]);

  const handleSaveTmdbKey = () => {
    if (!tmdbApiKey.trim()) {
      toast.error('Please enter a valid TMDB API key');
      return;
    }

    saveApiKey(tmdbApiKey.trim());
    setHasTmdbKey(true);
    setHasCustomTmdbKey(true);
    toast.success('TMDB API key saved! Reloading movies...');
    setTmdbApiKey('');
    
    // Notify parent to reload movies
    if (onApiKeyChange) {
      onApiKeyChange();
    }
  };

  const handleSaveGeminiKey = () => {
    if (!geminiApiKey.trim()) {
      toast.error('Please enter a valid Gemini API key');
      return;
    }

    saveGeminiApiKey(geminiApiKey.trim());
    setHasGeminiKey(true);
    toast.success('Gemini API key saved! AI chat is now active.');
    setGeminiApiKey('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Settings className="w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none rounded-lg" />
        
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure TMDB for movies and Gemini for AI-powered chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 relative">
          {/* TMDB API Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Film className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">TMDB API (Movies)</h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
                title="Active"
              />
            </div>
            
            <Alert className={hasTmdbKey ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"}>
              <Zap className={`h-4 w-4 ${hasTmdbKey ? 'text-green-600' : 'text-yellow-600'}`} />
              <AlertDescription className={hasTmdbKey ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}>
                {hasTmdbKey ? '✅ Live TMDB movie data is configured.' : '⚠️ Add a TMDB API key to use live movie data from TMDB.'}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="tmdb-key" className="text-base">Your TMDB API Key (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tmdb-key"
                  type="password"
                  placeholder="Enter your TMDB API key..."
                  value={tmdbApiKey}
                  onChange={(e) => setTmdbApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveTmdbKey();
                    }
                  }}
                  className="h-11"
                />
                <Button 
                  onClick={handleSaveTmdbKey} 
                  size="sm"
                  className="h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Save
                </Button>
              </div>
              <AnimatePresence>
                {hasCustomTmdbKey && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-green-600 dark:text-green-400 flex items-center gap-2 font-medium"
                  >
                    <Check className="w-4 h-4" /> Using your custom key
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-sm text-muted-foreground">
                Stored locally in your browser. No TMDB key is committed to the repo.
              </p>
            </div>

            <details className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
              <summary className="cursor-pointer hover:text-foreground font-medium flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                How to get TMDB API Key
              </summary>
              <ol className="list-decimal list-inside space-y-2 ml-4 mt-3">
                <li>
                  Visit{' '}
                  <a
                    href="https://www.themoviedb.org/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    themoviedb.org/signup
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </li>
                <li>Go to Settings → API → Request API Key (Developer)</li>
                <li>Copy your API key (v3 auth)</li>
              </ol>
            </details>
          </motion.div>

          {/* Gemini API Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-6 border-t space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Gemini API (AI Chat)</h3>
              {hasGeminiKey ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  title="Not configured"
                />
              )}
            </div>

            <Alert className={hasGeminiKey ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"}>
              <Info className={`h-4 w-4 ${hasGeminiKey ? 'text-green-600' : 'text-yellow-600'}`} />
              <AlertDescription className={hasGeminiKey ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}>
                {hasGeminiKey ? (
                  <p>✅ AI chat is active! Ask questions about movies and get personalized recommendations.</p>
                ) : (
                  <p>⚠️ Add a Gemini API key for real AI-powered chat (free tier: 60 req/min). Without it, basic responses are used.</p>
                )}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="gemini-key" className="text-base">Google Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="gemini-key"
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveGeminiKey();
                    }
                  }}
                  className="h-11"
                />
                <Button 
                  onClick={handleSaveGeminiKey} 
                  size="sm"
                  className="h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Save
                </Button>
              </div>
              <AnimatePresence>
                {hasGeminiKey && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-green-600 dark:text-green-400 flex items-center gap-2 font-medium"
                  >
                    <Check className="w-4 h-4" /> AI chat configured
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-sm text-muted-foreground">
                100% free. Your key stays in your browser.
              </p>
            </div>

            <details className="text-sm text-muted-foreground bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-lg p-4">
              <summary className="cursor-pointer hover:text-foreground font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                📖 How to get Gemini API Key (Free & Easy!)
              </summary>
              <ol className="list-decimal list-inside space-y-2 ml-4 mt-3">
                <li>
                  Visit{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Google AI Studio
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key" button</li>
                <li>Copy the key and paste it above</li>
                <li>Done! 🎉 Enjoy AI-powered movie chat</li>
              </ol>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 bg-card/50 backdrop-blur-sm p-3 rounded border border-border/50"
              >
                <p className="font-medium text-foreground">
                  <strong>Free tier includes:</strong> 60 requests/minute, 1500/day
                  <br />
                  <span className="text-sm text-muted-foreground">Perfect for personal use!</span>
                </p>
              </motion.div>
            </details>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}