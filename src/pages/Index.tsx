import React, { useState } from 'react';
import { ChatBot } from '@/components/ChatBot';
import { ChatLauncher } from '@/components/ChatLauncher';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Botscape Zen
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the future of AI conversation with our sleek, intelligent chatbot interface
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect"
            >
              Start Conversation
            </button>
            
            <button className="px-8 py-4 border border-border text-foreground rounded-full font-semibold transition-all duration-300 hover:bg-muted hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        {/* Demo Chat Interface - Desktop */}
        <div className="hidden lg:block fixed top-1/2 right-8 transform -translate-y-1/2">
          <ChatBot 
            isOpen={isChatOpen}
            onToggle={() => setIsChatOpen(!isChatOpen)}
          />
        </div>
      </div>

      {/* Mobile Chat - Full Screen Overlay */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm h-full max-h-[600px]">
            <ChatBot 
              isOpen={isChatOpen}
              onToggle={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Chat Launcher - Always visible */}
      <ChatLauncher
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Index;
