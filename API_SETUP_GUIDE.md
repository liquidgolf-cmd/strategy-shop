# API Setup Guide

This guide will walk you through setting up the three API keys needed for the Dad Advice App.

## 1. Anthropic Claude API

### Step 1: Create an Anthropic Account
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Click "Sign Up" and create an account
3. Verify your email address

### Step 2: Get API Key
1. Once logged in, navigate to "API Keys" in the left sidebar
2. Click "Create Key"
3. Give it a name (e.g., "Dad Advice App")
4. Copy the key - it starts with `sk-ant-`
5. ⚠️ **Important**: Save this key somewhere safe - you won't be able to see it again!

### Step 3: Add Credits
- Anthropic requires you to add credits to your account to use the API
- Go to "Billing" and add at least $5
- Claude 3.5 Sonnet costs about $3 per million input tokens

### Step 4: Add to Environment
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

---

## 2. Google Cloud Text-to-Speech API

### Step 1: Create Google Cloud Account
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept the terms of service

### Step 2: Create a Project
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it "Dad Advice App" (or anything you like)
4. Click "Create"

### Step 3: Enable Text-to-Speech API
1. In the search bar, type "Text-to-Speech API"
2. Click on "Cloud Text-to-Speech API"
3. Click "Enable"

### Step 4: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. **Optional but recommended**: Click "Restrict Key"
   - Under "API restrictions", select "Restrict key"
   - Check "Cloud Text-to-Speech API"
   - Save

### Step 5: Enable Billing (if not already)
- Google Cloud requires billing to be enabled
- They offer $300 free credit for new users
- TTS costs about $4 per 1 million characters

### Step 6: Add to Environment
```bash
GOOGLE_CLOUD_TTS_API_KEY=AIzaSy-your-key-here
```

---

## 3. YouTube Data API v3

### Step 1: Enable YouTube Data API
1. In the same Google Cloud project
2. Search for "YouTube Data API v3"
3. Click on it and click "Enable"

### Step 2: Create API Key (or use existing)
1. You can use the same API key from Text-to-Speech, or create a new one
2. Go to "APIs & Services" → "Credentials"
3. If creating new: Click "Create Credentials" → "API Key"
4. **Optional but recommended**: Restrict the key
   - Under "API restrictions", add "YouTube Data API v3"
   - Save

### Step 3: Understand Quota
- YouTube API has a free quota of 10,000 units per day
- Each search costs 100 units (100 searches per day)
- This should be plenty for the app

### Step 4: Add to Environment
```bash
YOUTUBE_API_KEY=AIzaSy-your-key-here
```

---

## Setting Up Environment Variables

### For Local Development

1. Create a `.env` file in the project root:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your keys:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   GOOGLE_CLOUD_TTS_API_KEY=AIzaSy...
   YOUTUBE_API_KEY=AIzaSy...
   ```

3. ⚠️ **Never commit `.env` to Git!** (It's already in `.gitignore`)

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your key
   - Click "Add"
4. Repeat for the other two keys
5. Redeploy your app for changes to take effect

---

## Costs Summary

Estimated costs for moderate use:

| Service | Cost | Free Tier |
|---------|------|-----------|
| Anthropic Claude | ~$3 per million tokens | $5 free credit (trial) |
| Google TTS | ~$4 per million characters | $300 free credit (new users) |
| YouTube API | Free | 10,000 units/day |

**Typical usage**: 
- 100 conversations/month ≈ $5-10 total
- Most cost is Claude API (smart conversations)
- TTS and YouTube are very cheap

---

## Troubleshooting

### "API key not configured" error
- Make sure `.env` file exists in project root
- Check that variable names match exactly
- Restart your development server after adding keys

### "Quota exceeded" for YouTube
- You've hit the 10,000 units/day limit
- Wait until midnight Pacific Time for reset
- Or request a quota increase in Google Cloud Console

### "Invalid API key" errors
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Check that the API is enabled in Google Cloud Console

### Anthropic "insufficient credits"
- Add credits to your Anthropic account
- Go to console.anthropic.com → Billing

---

## Security Best Practices

1. ✅ **Do**: Keep API keys in environment variables
2. ✅ **Do**: Use different keys for dev/production
3. ✅ **Do**: Restrict API keys to specific services
4. ❌ **Don't**: Commit keys to Git
5. ❌ **Don't**: Share keys publicly
6. ❌ **Don't**: Hardcode keys in source code

---

Need help? Check the README.md or open an issue!

