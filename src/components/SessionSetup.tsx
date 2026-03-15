import { useState } from 'react';
import { Users, Plus, LogIn, Film, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';
import { ParticleField } from './ParticleField';

interface SessionSetupProps {
  username: string;
  onCreateSession: () => void;
  onJoinSession: (code: string) => void;
  backendError?: boolean;
}

export function SessionSetup({ username, onCreateSession, onJoinSession, backendError }: SessionSetupProps) {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cyan-500/5 via-background to-amber-500/5 p-4">
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
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {backendError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Backend not deployed yet. Run <code className="bg-background/50 px-1 rounded">supabase functions deploy make-server-ec9c6d6c</code> so sessions sync across devices automatically.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl blur-xl opacity-50"
              />
              <div className="relative bg-gradient-to-br from-cyan-600 to-teal-500 p-3 rounded-2xl">
                <Film className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-700 to-teal-500 bg-clip-text text-transparent">
              CineMatch
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <p className="text-muted-foreground font-medium">Welcome, {username}!</p>
          </motion.div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-amber-500/5 pointer-events-none" />

            <div className="relative z-10">
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="create" className="text-sm">Create Session</TabsTrigger>
                  <TabsTrigger value="join" className="text-sm">Join Session</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4 mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 mb-6"
                    >
                      <Users className="w-10 h-10 text-cyan-700 dark:text-cyan-300" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">Start a New Session</h3>
                    <p className="text-muted-foreground mb-6">
                      Create a session and invite friends with a unique code
                    </p>
                    <Button
                      onClick={onCreateSession}
                      className="w-full h-12 font-semibold bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      <span>Create Session</span>
                      <motion.div
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="join" className="space-y-4 mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <form onSubmit={handleJoin} className="space-y-4">
                      <div className="text-center py-4">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-6"
                        >
                          <LogIn className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Join Existing Session</h3>
                        <p className="text-muted-foreground mb-6">
                          Enter the 6-character code from your friend
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="code" className="text-base">Session Code</Label>
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
                          className="text-center tracking-widest uppercase h-12 text-lg font-semibold"
                          autoFocus
                        />
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-destructive text-sm"
                          >
                            {error}
                          </motion.p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                        disabled={joinCode.length !== 6}
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Join Session
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>Sessions sync automatically • No refresh needed once the backend is deployed</p>
        </motion.div>
      </div>
    </div>
  );
}
