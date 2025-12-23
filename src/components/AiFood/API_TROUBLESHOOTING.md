# Gemini API Key Troubleshooting Guide

## Issue: All Models Return 404 Error

You're seeing 404 errors for ALL Gemini models, which means the issue is with your API key configuration, not the model names.

## Step-by-Step Fix

### Step 1: Verify Your API Key Source

Your API key MUST be from **Google AI Studio**, NOT Vertex AI.

1. **Go to Google AI Studio**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Create a NEW API key** (or use an existing one)
4. **IMPORTANT**: The key should start with `AIza` (example: `AIzaSyD...`)

### Step 2: Update Your .env File

1. Open your `.env` file in the project root
2. Add or update this line:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyYourActualKeyHere
   ```
3. **Important**: 
   - No quotes around the key
   - No spaces
   - Replace `AIzaSyYourActualKeyHere` with your actual key

### Step 3: Restart Development Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Test the Component

1. Navigate to: http://localhost:4040/ai-food
2. Upload a food image
3. Check browser console for errors

## Common Issues

### Issue: "API key not configured"
- Make sure the environment variable is named exactly `VITE_GEMINI_API_KEY`
- Restart the dev server after adding the key

### Issue: Still getting 404 errors
- Your API key might be for Vertex AI instead of Google AI Studio
- Go to https://aistudio.google.com/app/apikey and create a NEW key
- Make sure you're using the FREE Google AI Studio service

### Issue: Quota/Billing errors
- Google AI Studio has a free tier with daily limits
- If you exceed the limit, wait until the next day
- Or upgrade to a paid plan

## Verify Your API Key is Working

Test your API key with this simple check:

1. Open browser console (F12)
2. Go to: https://aistudio.google.com/
3. Try the "Get Code" feature to verify your key works

## Alternative: Use a Different AI Service

If you can't get Gemini working, we can modify the component to use:
- OpenAI GPT-4 Vision
- Anthropic Claude
- Other vision AI services

Let me know if you need help switching to a different service!

## Still Need Help?

If none of these steps work, please check:
1. Is your API key starting with `AIza`?
2. Did you restart the dev server after updating `.env`?
3. Can you access https://aistudio.google.com/app/apikey successfully?
