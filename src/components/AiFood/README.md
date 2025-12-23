# AI Food Analyzer - Environment Setup

## Required Environment Variable

To use the AI Food Analyzer component, you need to add your Gemini API key to your `.env` file.

### Setup Instructions

1. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key for Gemini

2. **Add to .env file:**
   
   Open your `.env` file in the project root and add:
   
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Restart the development server:**
   
   After adding the API key, restart your dev server:
   
   ```bash
   npm run dev
   ```

### Accessing the Component

Once configured, you can access the AI Food Analyzer at:

```
http://localhost:5173/ai-food
```

### Important Notes

- ⚠️ **Never commit your API key** to version control
- The API key should remain in `.env` which is gitignored
- For production, use environment variables in your hosting platform
- Free tier has daily usage limits

### Troubleshooting

**Error: "API key not configured"**
- Ensure the environment variable is named exactly `VITE_GEMINI_API_KEY`
- Check that you've restarted the dev server after adding it
- Verify the API key is valid in Google AI Studio

**Error: "API Daily Limit reached"**
- You've exceeded the free tier quota
- Wait until the next day or upgrade your plan
- Consider implementing request caching to reduce API calls
