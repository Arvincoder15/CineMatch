import { useEffect, useState } from 'react';
import { X, Heart, Undo, Info, Zap, Users, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

const tips = [
  {
    icon: <Heart className="w-8 h-8 text-pink-500" />,
    title: 'Swipe to Discover',
    description: 'Swipe right or press → to like movies. Swipe left or press ← to pass.',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: 'Find Matches',
    description: 'When you and your friends both like the same movie, you\'ll get a match!',
  },
  {
    icon: <Undo className="w-8 h-8 text-orange-500" />,
    title: 'Made a Mistake?',
    description: 'Press U or tap the undo button to go back to the previous movie.',
  },
  {
    icon: <Info className="w-8 h-8 text-purple-500" />,
    title: 'Learn More',
    description: 'Press I or click the info button to see full movie details, ratings, and more.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    title: 'AI Insights',
    description: 'Visit the AI tab to get personalized recommendations and chat with our movie assistant.',
  },
  {
    icon: <Zap className="w-8 h-8 text-green-500" />,
    title: 'You\'re All Set!',
    description: 'Start swiping to discover amazing movies and find matches with friends!',
  },
];

interface OnboardingTipsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTips({ isOpen, onClose }: OnboardingTipsProps) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentTip(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const tip = tips[currentTip];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CineMatch!</DialogTitle>
          <DialogDescription>
            {currentTip + 1} of {tips.length}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
              {tip.icon}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="mb-1">{tip.title}</h3>
            <p className="text-muted-foreground">{tip.description}</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-4">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentTip
                    ? 'w-8 bg-primary'
                    : index < currentTip
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip
          </Button>
          <Button onClick={handleNext} className="flex-1">
            {currentTip < tips.length - 1 ? 'Next' : 'Get Started!'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('cinematch_onboarding_seen');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('cinematch_onboarding_seen', 'true');
  };

  return { showOnboarding, closeOnboarding };
}
