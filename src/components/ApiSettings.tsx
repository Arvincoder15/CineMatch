import { useState, useEffect } from 'react';
import { Settings, ExternalLink, Info, Check } from 'lucide-react';
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
import { saveApiKey, hasCustomApiKey } from '../lib/tmdb-api';
import { saveGeminiApiKey, hasGeminiApiKey } from '../lib/ai-service';
import { toast } from 'sonner@2.0.3';

interface ApiSettingsProps {
  onApiKeyChange?: () => void;
}

export function ApiSettings({ onApiKeyChange }: ApiSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasCustomTmdbKey, setHasCustomTmdbKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    setHasCustomTmdbKey(hasCustomApiKey());
    setHasGeminiKey(hasGeminiApiKey());
  }, [isOpen]);

  const handleSaveTmdbKey = () => {
    if (!tmdbApiKey.trim()) {
      toast.error('Please enter a valid TMDB API key');
      return;
    }

    saveApiKey(tmdbApiKey.trim());
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
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Configure TMDB for movies and Gemini for AI chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* TMDB API Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3>TMDB API (Movies)</h3>
              <div className="w-3 h-3 rounded-full bg-green-500" title="Active" />
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                ✅ Real movie data is active! App uses a default TMDB key.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="tmdb-key">Your TMDB API Key (Optional)</Label>
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
                />
                <Button onClick={handleSaveTmdbKey} size="sm">
                  Save
                </Button>
              </div>
              {hasCustomTmdbKey && (
                <p className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Using your custom key
                </p>
              )}
              <p className="text-muted-foreground">
                Add your own for personal rate limits (optional).
              </p>
            </div>

            <details className="text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                How to get TMDB API Key
              </summary>
              <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                <li>
                  Visit{' '}
                  <a
                    href="https://www.themoviedb.org/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    themoviedb.org/signup
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </li>
                <li>Go to Settings → API → Request API Key (Developer)</li>
                <li>Copy your API key (v3 auth)</li>
              </ol>
            </details>
          </div>

          {/* Gemini API Section */}
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center gap-2">
              <h3>Gemini API (AI Chat)</h3>
              {hasGeminiKey ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-yellow-500" title="Not configured" />
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {hasGeminiKey ? (
                  <p>✅ AI chat is active! Ask questions about movies and get personalized recommendations.</p>
                ) : (
                  <p>⚠️ Add a Gemini API key for real AI-powered chat (free tier: 60 req/min). Without it, basic responses are used.</p>
                )}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="gemini-key">Google Gemini API Key</Label>
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
                />
                <Button onClick={handleSaveGeminiKey} size="sm">
                  Save
                </Button>
              </div>
              {hasGeminiKey && (
                <p className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> AI chat configured
                </p>
              )}
              <p className="text-muted-foreground">
                100% free. Your key stays in your browser.
              </p>
            </div>

            <details className="text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                📖 How to get Gemini API Key (Free & Easy!)
              </summary>
              <ol className="list-decimal list-inside space-y-2 ml-4 mt-2">
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
              <p className="mt-3 bg-muted p-3 rounded text-foreground">
                <strong>Free tier includes:</strong> 60 requests/minute, 1500/day
                <br />
                Perfect for personal use!
              </p>
            </details>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
