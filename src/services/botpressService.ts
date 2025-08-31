import { BOTPRESS_CONFIG, getBotToken } from '@/config/botpress';

interface BotpressMessage {
  type: 'text' | 'card' | 'quick-reply';
  payload: {
    text?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    buttons?: Array<{
      label: string;
      payload: string;
    }>;
  };
}

interface BotpressResponse {
  responses: BotpressMessage[];
  sessionId?: string;
}

class BotpressService {
  private sessionId: string | null = null;

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...BOTPRESS_CONFIG.DEFAULT_HEADERS };
    
    // Only add Authorization header if token is available and not the default placeholder
    const token = getBotToken();
    if (token && token !== 'YOUR_BOT_TOKEN') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async sendMessage(message: string): Promise<BotpressResponse> {
    try {
      if (!this.sessionId) {
        this.sessionId = this.generateSessionId();
      }

      // Try multiple possible API endpoint structures
      const endpoints = [
        // Standard Botpress API v1
        `${BOTPRESS_CONFIG.BASE_URL}/api/v1/bots/${BOTPRESS_CONFIG.BOT_ID}/conversations/${this.sessionId}/messages`,
        // Alternative endpoint structure
        `${BOTPRESS_CONFIG.BASE_URL}/api/v1/bots/${BOTPRESS_CONFIG.BOT_ID}/conversations/${this.sessionId}/messages`,
        // Direct bot endpoint
        `${BOTPRESS_CONFIG.BASE_URL}/api/v1/bots/${BOTPRESS_CONFIG.BOT_ID}/messages`,
        // Webhook-style endpoint
        `${BOTPRESS_CONFIG.BASE_URL}/api/v1/bots/${BOTPRESS_CONFIG.BOT_ID}/webhooks/messages`,
        // Simple endpoint
        `${BOTPRESS_CONFIG.BASE_URL}/api/bots/${BOTPRESS_CONFIG.BOT_ID}/chat`
      ];

      let lastError: Error | null = null;

      for (const url of endpoints) {
        try {
          console.log(`Trying endpoint: ${url}`);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
              type: 'text',
              payload: {
                text: message
              },
              sessionId: this.sessionId
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Success with endpoint:', url);
            return data;
          } else {
            console.log(`Endpoint ${url} returned status: ${response.status}`);
            lastError = new Error(`HTTP ${response.status} from ${url}`);
          }
        } catch (error) {
          console.log(`Endpoint ${url} failed:`, error);
          lastError = error instanceof Error ? error : new Error('Unknown error');
        }
      }

      // If all endpoints fail, throw the last error
      throw lastError || new Error('All API endpoints failed');

    } catch (error) {
      console.error('Error sending message to Botpress:', error);
      
      // Fallback response for development/testing
      return {
        responses: [{
          type: 'text',
          payload: {
            text: 'Sorry, I\'m having trouble connecting to the bot right now. Please check your Botpress instance.'
          }
        }],
        sessionId: this.sessionId
      };
    }
  }

  async getConversationHistory(): Promise<BotpressMessage[]> {
    if (!this.sessionId) {
      return [];
    }

    try {
      const url = `${BOTPRESS_CONFIG.BASE_URL}/api/v1/bots/${BOTPRESS_CONFIG.BOT_ID}/conversations/${this.sessionId}/messages`;
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.responses || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  resetSession(): void {
    this.sessionId = null;
  }

  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  // Test connection method
  async testConnection(): Promise<{ success: boolean; workingEndpoint?: string; error?: string }> {
    try {
      const testMessage = 'test';
      const result = await this.sendMessage(testMessage);
      
      // Check if we got a real response (not fallback)
      if (result.responses && result.responses.length > 0) {
        const firstResponse = result.responses[0];
        if (firstResponse.payload.text && 
            !firstResponse.payload.text.includes('having trouble connecting')) {
          return { success: true };
        }
      }
      
      return { success: false, error: 'Got fallback response' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const botpressService = new BotpressService();
export type { BotpressMessage, BotpressResponse };
