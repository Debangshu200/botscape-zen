import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function ChatLauncher({ isOpen, onClick, className }: ChatLauncherProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 z-50",
        "bg-gradient-to-br from-primary to-accent hover:shadow-primary/25",
        "animate-float hover:animate-none hover:scale-110 glow-effect",
        className
      )}
    >
      <div className="relative">
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground transition-transform duration-200" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-primary-foreground transition-transform duration-200" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse border-2 border-primary-foreground"></div>
          </>
        )}
      </div>
    </Button>
  );
}