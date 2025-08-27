import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex space-x-3 message-enter">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      
      <div className="flex flex-col space-y-1">
        <div className="px-4 py-3 bg-bot-message rounded-2xl rounded-bl-sm shadow-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-typing rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-typing rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-typing rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground px-2">
          AI is typing...
        </span>
      </div>
    </div>
  );
}