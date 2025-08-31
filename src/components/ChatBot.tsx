import React, { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { cn } from '@/lib/utils';
import { botpressService } from '@/services/botpressService';
import type { BotpressMessage } from '@/services/botpressService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'card' | 'quick-reply';
  buttons?: Array<{
    label: string;
    payload: string;
  }>;
}

interface ChatBotProps {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function ChatBot({ isOpen = true, onToggle, className }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Try to send a test message to check connection
      const response = await botpressService.sendMessage('test');
      setIsConnected(true);
      console.log('Botpress connection successful');
    } catch (error) {
      setIsConnected(false);
      console.log('Botpress connection failed, using fallback mode');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send message to Botpress
      const botpressResponse = await botpressService.sendMessage(input);
      
      // Process Botpress responses
      if (botpressResponse.responses && botpressResponse.responses.length > 0) {
        botpressResponse.responses.forEach((response: BotpressMessage, index: number) => {
          const botMessage: Message = {
            id: (Date.now() + index).toString(),
            content: response.payload.text || 'Bot response received',
            sender: 'bot',
            timestamp: new Date(),
            type: response.type,
            buttons: response.payload.buttons
          };
          setMessages(prev => [...prev, botMessage]);
        });
      } else {
        // Fallback response
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I received your message but didn't get a proper response. Please try again.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Error communicating with bot:', error);
      
      // Error response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = async (payload: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: payload,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const botpressResponse = await botpressService.sendMessage(payload);
      
      if (botpressResponse.responses && botpressResponse.responses.length > 0) {
        botpressResponse.responses.forEach((response: BotpressMessage, index: number) => {
          const botMessage: Message = {
            id: (Date.now() + index).toString(),
            content: response.payload.text || 'Bot response received',
            sender: 'bot',
            timestamp: new Date(),
            type: response.type,
            buttons: response.payload.buttons
          };
          setMessages(prev => [...prev, botMessage]);
        });
      }
    } catch (error) {
      console.error('Error with quick reply:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    botpressService.resetSession();
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
    testConnection();
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "flex flex-col h-full max-h-[600px] w-full max-w-md bg-card border border-border rounded-lg shadow-2xl glass-effect transition-all duration-300",
      isMinimized && "h-16",
      className
    )}>
      <ChatHeader 
        onMinimize={() => setIsMinimized(!isMinimized)}
        onClose={onToggle}
        isMinimized={isMinimized}
      />
      
      {!isMinimized && (
        <>
          {/* Connection Status */}
          <div className="px-4 py-2 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Connected to Botpress' : 'Disconnected'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetConversation}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onQuickReply={handleQuickReply}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-input border-border focus:ring-primary focus:border-primary"
                disabled={!isConnected}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || !isConnected}
                size="icon"
                variant="default"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 glow-effect"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}