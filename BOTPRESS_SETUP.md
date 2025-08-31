# Botpress Integration Setup

This guide will help you connect your React frontend to your local Botpress chatbot instance.

## Prerequisites

- Your Botpress instance is running locally on port 8075
- You have access to your bot's API token

## Configuration

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Botpress Configuration
VITE_BOTPRESS_TOKEN=your_actual_bot_token_here
VITE_BOTPRESS_URL=http://localhost:8075
VITE_BOTPRESS_BOT_ID=b656baaa-812f-47a3-8d04-4e57f8f6008c
```

### 2. Get Your Bot Token

1. Go to your Botpress dashboard
2. Navigate to the bot you want to connect
3. Go to Settings > API Keys
4. Create a new API key or copy an existing one
5. Replace `your_actual_bot_token_here` in the `.env` file

### 3. Update Configuration (if needed)

If your Botpress instance is running on a different port or URL, update the `VITE_BOTPRESS_URL` in your `.env` file.

## Features

The integration includes:

- **Real-time communication** with your Botpress bot
- **Session management** for conversation continuity
- **Quick reply buttons** support
- **Connection status indicator**
- **Error handling** with fallback responses
- **Conversation reset** functionality

## API Endpoints

The service communicates with your Botpress instance using these endpoints:

- `POST /api/v1/bots/{botId}/conversations/{sessionId}/messages` - Send messages
- `GET /api/v1/bots/{botId}/conversations/{sessionId}/messages` - Get conversation history

## Troubleshooting

### Connection Issues

1. **Check if Botpress is running**: Ensure your Botpress instance is accessible at `http://localhost:8075`
2. **Verify bot ID**: Confirm the bot ID in your configuration matches the deployed bot
3. **Check API token**: Ensure your bot token is correct and has the necessary permissions
4. **CORS issues**: Make sure your Botpress instance allows requests from your frontend origin

### Common Errors

- **401 Unauthorized**: Check your bot token
- **404 Not Found**: Verify the bot ID and endpoints
- **Connection refused**: Ensure Botpress is running and accessible

## Development

The integration includes fallback responses for development and testing. When the Botpress connection fails, the chat will still function with simulated responses.

## Testing

1. Start your Botpress instance
2. Start your React frontend
3. Open the chat interface
4. Check the connection status indicator
5. Send a test message
6. Verify the bot responds

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Botpress instance is running correctly
3. Test the Botpress API endpoints directly
4. Check the network tab for failed requests
