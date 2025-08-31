import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { botpressService } from '@/services/botpressService';
import { BOTPRESS_CONFIG } from '@/config/botpress';

export function BotpressTest() {
  const [testMessage, setTestMessage] = useState('Hello');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    
    try {
      const result = await botpressService.sendMessage(testMessage);
      setResponse(JSON.stringify(result, null, 2));
      setConnectionStatus('success');
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    botpressService.resetSession();
    setResponse('');
    setConnectionStatus('idle');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Botpress Connection Test</CardTitle>
        <CardDescription>
          Test the connection to your Botpress instance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Configuration</label>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Base URL: {BOTPRESS_CONFIG.BASE_URL}</div>
            <div>Bot ID: {BOTPRESS_CONFIG.BOT_ID}</div>
            <div>Token: {import.meta.env.VITE_BOTPRESS_TOKEN ? 'Set' : 'Not set'}</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Test Message</label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test message"
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            onClick={resetSession} 
            variant="outline"
          >
            Reset Session
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Connection Status</label>
          <div className="flex items-center space-x-2">
            <div className={`
              w-3 h-3 rounded-full
              ${connectionStatus === 'idle' ? 'bg-gray-400' : ''}
              ${connectionStatus === 'testing' ? 'bg-yellow-400' : ''}
              ${connectionStatus === 'success' ? 'bg-green-400' : ''}
              ${connectionStatus === 'error' ? 'bg-red-400' : ''}
            `} />
            <span className="text-sm capitalize">{connectionStatus}</span>
          </div>
        </div>

        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Response</label>
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-64">
              {response}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
