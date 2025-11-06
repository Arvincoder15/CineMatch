import { Users, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Session, getSession } from '../lib/session-manager';
import { toast } from 'sonner@2.0.3';

interface SessionViewProps {
  session: Session;
  currentUserId: string;
  onStartSwiping: () => void;
}

export function SessionView({ session: initialSession, currentUserId, onStartSwiping }: SessionViewProps) {
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState<Session>(initialSession);

  // Poll for session updates every 3 seconds to see new members join
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const updatedSession = await getSession(session.code);
        if (updatedSession) {
          // Check if new users joined
          if (updatedSession.users.length > session.users.length) {
            const newUsers = updatedSession.users.filter(
              u => !session.users.find(su => su.id === u.id)
            );
            newUsers.forEach(user => {
              toast.success(`${user.username} joined the session!`);
            });
          }
          setSession(updatedSession);
        }
      } catch (error) {
        console.error('Error polling session:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [session]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    toast.success('Session code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="mb-2">Session Ready!</h2>
          <p className="text-muted-foreground">
            Share the code with friends to join
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-accent rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-2">Session Code</p>
            <div className="flex items-center justify-center gap-2">
              <h1 className="tracking-widest">{session.code}</h1>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-background rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-3">Session Members ({session.users.length})</h3>
            <div className="space-y-2">
              {session.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div>
                    <p>
                      {user.username}
                      {user.id === currentUserId && (
                        <Badge variant="secondary" className="ml-2">
                          You
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {user.genres.join(', ')} • {user.vibe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-muted-foreground text-center mb-4">
              Everyone can start swiping individually. You'll see matches when you both like the same movie!
            </p>
            <Button onClick={onStartSwiping} className="w-full" size="lg">
              Start Swiping
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
