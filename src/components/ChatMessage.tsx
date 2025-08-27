import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'card' | 'quick-reply';
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={cn(
      "flex space-x-3 message-enter",
      !isBot && "flex-row-reverse space-x-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isBot 
          ? "bg-gradient-to-br from-primary to-accent animate-glow" 
          : "bg-gradient-to-br from-muted to-secondary"
      )}>
        {isBot ? (
          <Bot className="w-4 h-4 text-primary-foreground" />
        ) : (
          <User className="w-4 h-4 text-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col space-y-1 max-w-[80%]",
        !isBot && "items-end"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl",
          isBot 
            ? "bg-bot-message text-bot-message-foreground rounded-bl-sm" 
            : "bg-gradient-to-br from-user-message to-accent text-user-message-foreground rounded-br-sm"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <span className="text-xs text-muted-foreground px-2">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}