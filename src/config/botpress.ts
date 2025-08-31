export const BOTPRESS_CONFIG = {
  // Your local Botpress instance - can be overridden by environment variable
  BASE_URL: import.meta.env.VITE_BOTPRESS_URL || 'http://localhost:8075',
  
  // Your bot ID from the deployment - can be overridden by environment variable
  BOT_ID: import.meta.env.VITE_BOTPRESS_BOT_ID || 'b656baaa-812f-47a3-8d04-4e57f8f6008c',
  
  // API endpoints
  ENDPOINTS: {
    MESSAGES: '/api/v1/bots/{botId}/conversations/{sessionId}/messages',
    CONVERSATIONS: '/api/v1/bots/{botId}/conversations',
    WEBHOOKS: '/api/v1/bots/{botId}/webhooks'
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
};

// Get bot token from environment variable (optional for local development)
export const getBotToken = (): string => {
  const token = import.meta.env.VITE_BOTPRESS_TOKEN;
  if (!token) {
    console.log('No Botpress token provided - using unauthenticated requests for local development');
    return '';
  }
  return token;
};
