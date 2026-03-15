import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Trash2, Download, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { chatWithAI, hasGeminiApiKey } from '../lib/ai-service';
import { Movie } from './MovieCard';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  likedMovies: Movie[];
}

export function AIChat({ likedMovies }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: likedMovies.length > 0
        ? `Hey! I see you've liked ${likedMovies.length} movies. What would you like to know about your taste, or need some recommendations?`
        : "Hi! I'm your AI movie assistant. Ask me anything about movies, genres, or get personalized recommendations!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const sendMessage = async (rawMessage: string) => {
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = {
        likedMovies: likedMovies.map((m) => ({
          title: m.title,
          genre: m.genre,
        })),
      };

      const conversationHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatWithAI(trimmedMessage, context, conversationHistory);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm having trouble connecting right now. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        content: "Chat cleared! How can I help you discover movies today?",
        timestamp: new Date(),
      },
    ]);
  };

  const exportChat = () => {
    const chatText = messages
      .map(msg => `${msg.role.toUpperCase()} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinematch-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const aiIsLive = hasGeminiApiKey();

  const quickActions = [
    { label: "Pick tonight's movie", query: "Based on what I've liked so far, what should I watch tonight and why?" },
    { label: 'Read my taste', query: 'What does my movie taste say about me right now?' },
    { label: 'Surprise me', query: 'Give me one slightly unexpected recommendation that still fits my taste.' },
  ];

  return (
    <Card className="flex flex-col h-[600px] bg-card border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-muted/40 shrink-0">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center"
        >
          <Bot className="w-6 h-6 text-cyan-700" />
        </motion.div>
        <div className="flex-1">
          <h3 className="mb-0 font-semibold">AI Movie Assistant</h3>
          <Badge variant="secondary" className="mt-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 mr-1" />
            </motion.div>
            {aiIsLive ? 'Live Gemini conversation' : 'Fallback conversation mode'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={exportChat}
            title="Export chat"
            className="h-8 w-8"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            title="Clear chat"
            className="h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === 'ai' 
                        ? 'bg-cyan-100 border border-cyan-200' 
                        : 'bg-sky-100 border border-sky-200'
                    }`}
                  >
                    {message.role === 'ai' ? (
                      <Bot className="w-4 h-4 text-cyan-700" />
                    ) : (
                      <User className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'ai'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-700" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-700" />
                  </motion.div>
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 shrink-0">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => void sendMessage(action.query)}
                className="text-xs px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 hover:border-cyan-300 transition-colors"
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-muted/40 shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about movie recommendations..."
            disabled={isLoading}
            className="h-11"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()} 
              size="icon"
              className="h-11 w-11 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  );
}