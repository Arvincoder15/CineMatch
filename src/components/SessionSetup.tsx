import { useState } from 'react';
import { Users, Plus, LogIn, Film, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface SessionSetupProps {
  username: string;
  onCreateSession: () => void;
  onJoinSession: (code: string) => void;
  backendError?: boolean;
}

export function SessionSetup({ username, onCreateSession, onJoinSession, backendError }: SessionSetupProps) {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (joinCode.trim().length !== 6) {
      setError('Session code must be 6 characters');
      return;
    }

    onJoinSession(joinCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
      <Card className="w-full max-w-md p-8">
        {backendError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Backend not deployed. Run <code className="bg-background/50 px-1 rounded">supabase functions deploy make-server-ec9c6d6c</code> to fix. See <a href="/DEPLOYMENT_GUIDE.md" target="_blank" className="underline">Deployment Guide</a>.
            </AlertDescription>
          </Alert>
        )}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12 text-primary" />
            <h1 className="text-4xl">CineMatch</h1>
          </div>
          <p className="text-muted-foreground">Welcome, {username}!</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Session</TabsTrigger>
            <TabsTrigger value="join">Join Session</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="text-center py-6">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Start a New Session</h3>
              <p className="text-muted-foreground mb-6">
                Create a session and invite friends to join with a unique code
              </p>
              <Button onClick={onCreateSession} className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="text-center py-4">
                <LogIn className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Join Existing Session</h3>
                <p className="text-muted-foreground mb-6">
                  Enter the 6-character code from your friend
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Session Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="ABC123"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  maxLength={6}
                  className="text-center tracking-widest uppercase"
                  autoFocus
                />
                {error && <p className="text-destructive">{error}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={joinCode.length !== 6}>
                <LogIn className="w-4 h-4 mr-2" />
                Join Session
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
