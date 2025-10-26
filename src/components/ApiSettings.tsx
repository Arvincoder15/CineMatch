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
import { toast } from 'sonner@2.0.3';

interface ApiSettingsProps {
  onApiKeyChange?: () => void;
}

export function ApiSettings({ onApiKeyChange }: ApiSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    setHasCustomKey(hasCustomApiKey());
  }, [isOpen]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    saveApiKey(apiKey.trim());
    setHasCustomKey(true);
    toast.success('Custom API key saved! Reloading movies...');
    setIsOpen(false);
    
    // Notify parent to reload movies
    if (onApiKeyChange) {
      onApiKeyChange();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            CineMatch is fetching real movies from TMDB with actual posters!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">TMDB API Key (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your TMDB API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveApiKey();
                    }
                  }}
                />
                <Button onClick={handleSaveApiKey} size="sm">
                  Save
                </Button>
              </div>
              <p className="text-muted-foreground">
                Add your own API key to use personal rate limits. Your key is stored locally and only sent to TMDB.
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p>The app is already fetching real movies from TMDB! You can optionally add your own API key for personal rate limits.</p>
              </AlertDescription>
            </Alert>

            <details className="text-muted-foreground pt-2">
              <summary className="cursor-pointer hover:text-foreground">
                How to get your own TMDB API Key
              </summary>
              <ol className="list-decimal list-inside space-y-2 ml-4 mt-3">
                <li>
                  Visit{' '}
                  <a
                    href="https://www.themoviedb.org/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    themoviedb.org/signup
                    <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and create a free account
                </li>
                <li>Go to account settings → API section</li>
                <li>Request an API key (choose "Developer")</li>
                <li>Fill out the quick form and copy your API key (v3 auth)</li>
              </ol>
            </details>
          </div>

          <div className="pt-4 border-t">
            <h4 className="mb-2">Current Status:</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">
                {hasCustomKey ? 'Using Custom API Key' : 'Using Default API Key - Real Data Active'}
              </span>
              <Check className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
