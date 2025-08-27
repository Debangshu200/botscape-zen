import React from 'react';
import { Bot, Minimize2, Maximize2, X, Circle } from 'lucide-react';
import { Button } from './ui/button';

interface ChatHeaderProps {
  onMinimize?: () => void;
  onClose?: () => void;
  isMinimized?: boolean;
}

export function ChatHeader({ onMinimize, onClose, isMinimized }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-card to-glass">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-online rounded-full border-2 border-card animate-pulse">
            <Circle className="w-2 h-2 text-online mx-auto mt-0.5" fill="currentColor" />
          </div>
        </div>
        
        {!isMinimized && (
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="w-2 h-2 bg-online rounded-full mr-1 animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {onMinimize && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </Button>
        )}
        
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}