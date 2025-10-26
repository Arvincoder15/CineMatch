import { useState } from 'react';
import { Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface AuthViewProps {
  onLogin: (username: string) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12 text-primary" />
            <h1 className="text-4xl">CineMatch</h1>
          </div>
          <p className="text-muted-foreground mb-2">
            Swipe real movies with friends and find your perfect watch together
          </p>
          <p className="text-muted-foreground">
            🎬 Now with real TMDB data & movie posters!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Choose a username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={!username.trim()}>
            Get Started
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-muted-foreground">
            Create a session or join your friends' session with a code
          </p>
        </div>
      </Card>
    </div>
  );
}
