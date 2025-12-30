# Troubleshooting Guide

Common issues and how to fix them.

## Installation Issues

### npm install fails with EACCES permission error

**Problem**: npm cache has permission issues

**Solution**:
```bash
# Clean npm cache
npm cache clean --force

# If that doesn't work, try:
npm install --legacy-peer-deps
```

### Module not found errors after install

**Problem**: Dependencies not properly installed

**Solution**:
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Issues

### Port 5173 already in use

**Problem**: Another process is using the dev server port

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Changes not showing up

**Problem**: Browser cache or hot reload issue

**Solution**:
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Restart dev server

### TypeScript errors in IDE

**Problem**: IDE not recognizing types

**Solution**:
- Restart TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")
- Check `tsconfig.json` is properly configured
- Run `npm install` to ensure types are installed

## API Issues

### "API key not configured" error

**Problem**: Environment variables not loaded

**Solution**:
1. Check `.env` file exists in project root
2. Verify variable names match exactly:
   ```
   ANTHROPIC_API_KEY=...
   GOOGLE_CLOUD_TTS_API_KEY=...
   YOUTUBE_API_KEY=...
   ```
3. Restart dev server after adding keys
4. Make sure `.env` is not in `.gitignore` (it should be, don't remove it!)

### "Invalid API key" from Anthropic

**Problem**: API key is incorrect or expired

**Solution**:
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Check your API key is still valid
3. Generate a new key if needed
4. Update `.env` file
5. Restart server

### "Insufficient credits" error

**Problem**: Anthropic account needs credits

**Solution**:
1. Go to console.anthropic.com → Billing
2. Add at least $5 in credits
3. Wait a few minutes for activation

### Google TTS not working

**Problem**: API not enabled or key doesn't have permissions

**Solution**:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable "Cloud Text-to-Speech API"
3. Check API key restrictions (should allow TTS API)
4. If using service account, make sure JSON key is correct

### YouTube videos not loading

**Problem**: API quota exceeded or not enabled

**Solution**:
1. Check quota at console.cloud.google.com
2. Default is 10,000 units/day (100 searches)
3. Quota resets at midnight Pacific Time
4. Request quota increase if needed
5. Verify "YouTube Data API v3" is enabled

## Runtime Errors

### "Failed to fetch" errors

**Problem**: CORS or network issues

**Solution**:
- Check browser console for details
- Verify API endpoints are correct
- Make sure you're not blocking requests (ad blocker, etc.)
- Check internet connection

### Image upload not working

**Problem**: Browser doesn't support FileReader or camera

**Solution**:
- Use a modern browser (Chrome, Safari, Firefox, Edge)
- Check camera permissions
- Try uploading a file instead of taking photo
- Check browser console for errors

### Audio not playing

**Problem**: Browser autoplay policy or TTS error

**Solution**:
- Some browsers block autoplay - user must interact first
- Check browser console for errors
- Verify TTS API is returning valid audio
- Try clicking the play button manually

### Session not persisting

**Problem**: IndexedDB not working or disabled

**Solution**:
- Check if browser supports IndexedDB
- Make sure not in incognito/private mode (some browsers disable it)
- Clear browser data and try again
- Check browser console for IndexedDB errors

## Build Issues

### Build fails with TypeScript errors

**Problem**: Type errors in code

**Solution**:
```bash
# Check for errors
npm run build

# Fix type errors shown in output
# Common fixes:
# - Add missing type annotations
# - Install missing @types packages
# - Check tsconfig.json strictness settings
```

### Build succeeds but app doesn't work

**Problem**: Environment variables not available in production

**Solution**:
- Environment variables must be set in Vercel dashboard
- Prefix with `VITE_` if you need them in client code
- Rebuild after adding environment variables

## Deployment Issues

### Vercel build fails

**Problem**: Missing dependencies or build configuration

**Solution**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` has all dependencies
3. Check `vercel.json` configuration
4. Make sure build command is `npm run build`
5. Ensure output directory is `dist`

### Functions timeout after deployment

**Problem**: Serverless function taking too long

**Solution**:
- Vercel has 10-second timeout for hobby plan
- Claude API can take 3-5 seconds
- TTS can take 2-3 seconds
- Consider upgrading Vercel plan
- Optimize API calls

### Environment variables not working on Vercel

**Problem**: Variables not set correctly

**Solution**:
1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add all three variables
3. Make sure they're set for "Production", "Preview", and "Development"
4. Redeploy after adding variables
5. Check function logs for specific errors

### API routes return 404

**Problem**: Vercel routing configuration

**Solution**:
- Check `vercel.json` has correct routes
- API files should be in `/api` directory
- Files must export default function
- Check function logs in Vercel dashboard

## Performance Issues

### App loading slowly

**Problem**: Large bundle size or slow API

**Solution**:
- Check Network tab in browser dev tools
- Consider code splitting
- Optimize images before upload
- Check API response times

### High API costs

**Problem**: Making too many API calls

**Solution**:
- Check Anthropic usage dashboard
- Implement caching (already done for audio)
- Limit message history sent to Claude
- Monitor usage regularly

## Mobile Issues

### Camera not working on mobile

**Problem**: Permissions or browser compatibility

**Solution**:
- Allow camera permissions in browser
- Use HTTPS (required for camera access)
- Try different browser (Chrome mobile is best)
- Check if site is trusted

### Touch interactions not working

**Problem**: Click events vs touch events

**Solution**:
- Already implemented with proper button elements
- Check if JavaScript errors are preventing interaction
- Try different mobile browser

### Text input keyboard issues

**Problem**: Keyboard covering input or autocorrect

**Solution**:
- Scroll into view (already implemented)
- Disable autocorrect if annoying
- Use `inputmode` attribute for better keyboards

## Data Issues

### Lost conversation history

**Problem**: IndexedDB cleared or browser data deleted

**Solution**:
- IndexedDB is client-side only (by design)
- No way to recover once cleared
- Future: Add export/import functionality
- Future: Optional cloud sync

### "Storage quota exceeded"

**Problem**: Too many images stored in IndexedDB

**Solution**:
- Clear old sessions manually
- Auto-cleanup runs on page load
- Reduce image compression quality
- Limit number of images per session

## Getting More Help

### Debug Mode

Add to `.env`:
```
VITE_DEBUG=true
```

This will enable verbose logging (implement as needed).

### Check Logs

**Local Development**:
- Browser console (F12 → Console)
- Terminal where `npm run dev` is running

**Production (Vercel)**:
- Vercel dashboard → Project → Deployments
- Click on deployment → Functions tab
- View real-time logs

### Still Stuck?

1. Check `PROJECT_SUMMARY.md` for overview
2. Check `API_SETUP_GUIDE.md` for API help
3. Check `DEPLOYMENT.md` for deployment help
4. Look for similar issues in GitHub
5. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Browser/environment details
   - Screenshots if relevant

## Quick Fixes Checklist

When something breaks, try these in order:

- [ ] Check browser console for errors
- [ ] Hard refresh browser (Cmd+Shift+R)
- [ ] Restart dev server
- [ ] Check `.env` file has all keys
- [ ] Verify API keys are valid
- [ ] Clear browser cache
- [ ] `rm -rf node_modules && npm install`
- [ ] Check API service status pages
- [ ] Review recent changes in git
- [ ] Check Vercel function logs (if deployed)

---

Most issues are:
1. Missing or invalid API keys (70%)
2. npm installation problems (15%)
3. Browser cache issues (10%)
4. Everything else (5%)

Start with those! 🔧

