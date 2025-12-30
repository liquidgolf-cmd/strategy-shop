# Deployment Instructions

This guide will help you deploy the Dad Advice App to Vercel and GitHub.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- All three API keys ready (see API_SETUP_GUIDE.md)

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (gh)

```bash
# If you have GitHub CLI installed
cd /Users/michaelhill/Documents/GitHub/dad-advice-app
gh repo create dad-advice-app --public --source=. --remote=origin
git push -u origin main
```

### Option B: Using GitHub Web Interface

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `dad-advice-app`
3. Description: "A warm, interactive app for fatherly advice with AI"
4. Choose Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

7. Then push your code:
```bash
cd /Users/michaelhill/Documents/GitHub/dad-advice-app
git remote add origin https://github.com/YOUR_USERNAME/dad-advice-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Project"
   - Select "Import Git Repository"
   - Find and select `dad-advice-app`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   Name: ANTHROPIC_API_KEY
   Value: sk-ant-api03-your-key-here
   ```
   
   ```
   Name: GOOGLE_CLOUD_TTS_API_KEY
   Value: AIzaSy-your-key-here
   ```
   
   ```
   Name: YOUTUBE_API_KEY
   Value: AIzaSy-your-key-here
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for build to complete
   - You'll get a URL like `https://dad-advice-app.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/michaelhill/Documents/GitHub/dad-advice-app
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: dad-advice-app
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add GOOGLE_CLOUD_TTS_API_KEY
vercel env add YOUTUBE_API_KEY

# Deploy to production
vercel --prod
```

## Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Try each feature:
   - Select a topic
   - Send a text message
   - Upload a photo
   - Listen to TTS audio
   - Check if video suggestions appear

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (usually instant)

## Troubleshooting

### Build Fails

**Error**: `Cannot find module '@anthropic-ai/sdk'`
- **Solution**: Make sure package.json includes all dependencies
- Run `npm install` locally to verify

**Error**: `API key not configured`
- **Solution**: Check environment variables in Vercel dashboard
- Make sure variable names match exactly

### Runtime Errors

**Error**: "Failed to get response from Dad"
- Check Vercel Function Logs in dashboard
- Verify Anthropic API key is valid and has credits

**Error**: "Failed to generate speech"
- Check Google Cloud TTS API is enabled
- Verify API key has correct permissions

**Error**: YouTube videos not loading
- Check YouTube Data API v3 is enabled
- Verify quota hasn't been exceeded (10,000 units/day)

### Performance Issues

- Vercel serverless functions have a 10-second timeout
- Claude API can take 3-5 seconds for responses
- TTS can take 2-3 seconds
- Consider adding loading states (already implemented)

## Updating Your Deployment

Whenever you push to GitHub, Vercel will automatically redeploy:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

To redeploy manually:
```bash
vercel --prod
```

## Monitoring

### View Logs
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. View "Functions" and "Build Logs"

### Usage Monitoring
- **Vercel**: Check "Analytics" tab for page views
- **Anthropic**: Monitor usage at console.anthropic.com
- **Google Cloud**: Check quotas at console.cloud.google.com

## Cost Management

### Set Spending Limits

**Anthropic**:
1. Go to console.anthropic.com → Billing
2. Set a monthly budget limit

**Google Cloud**:
1. Go to console.cloud.google.com → Billing
2. Create a budget alert
3. Set alerts at 50%, 90%, 100% of budget

**Vercel**:
- Free tier includes 100GB bandwidth/month
- Most hobby projects stay within free tier

## Environment-Specific Settings

### Development
```bash
# Local .env file
ANTHROPIC_API_KEY=...
GOOGLE_CLOUD_TTS_API_KEY=...
YOUTUBE_API_KEY=...
```

### Production (Vercel)
- Set in Vercel dashboard under Environment Variables
- Can set different values for Production vs Preview

## Security Checklist

- ✅ API keys stored as environment variables
- ✅ `.env` file in `.gitignore`
- ✅ API keys restricted to specific services
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ No API keys in source code

## Next Steps

1. **Test thoroughly** on mobile devices
2. **Monitor costs** in the first week
3. **Gather feedback** from users
4. **Iterate** based on usage patterns

---

## Quick Reference Commands

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod

# View logs
vercel logs

# Check build status
vercel inspect [deployment-url]
```

---

Need help? Check the README.md or create an issue on GitHub!

