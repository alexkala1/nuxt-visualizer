# Deployment Guide - GitHub Pages

Complete guide to deploy Nuxt Audio Visualizer to GitHub Pages.

---

## 📋 Prerequisites

- GitHub account
- Git installed locally
- Node.js 18+ and npm
- Repository pushed to GitHub

---

## 🚀 Quick Deployment Steps

### 1. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial commit - Nuxt Audio Visualizer v2.0.0"

# Add remote (replace with your username)
git remote add origin https://github.com/yourusername/nuxt-visualizer.git

# Push to main branch
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. That's it! The workflow will automatically deploy on push

### 3. Access Your Site

After the workflow completes (2-3 minutes), your site will be available at:

```
https://yourusername.github.io/nuxt-visualizer/
```

---

## ⚙️ Configuration Details

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file handles:

- ✅ Automatic builds on push to `main`
- ✅ Manual deployment trigger
- ✅ Correct base URL configuration
- ✅ Static site generation
- ✅ Deployment to GitHub Pages

### Nuxt Configuration

The `nuxt.config.ts` is configured with:

- `ssr: false` - Client-side only (required for GitHub Pages)
- `nitro: { preset: 'static' }` - Static site generation
- `baseURL` - Dynamic base URL for subpath deployment

---

## 🔧 Custom Domain (Optional)

### Using a Custom Domain

1. **Add CNAME file**:

   ```bash
   echo "yourdomain.com" > public/CNAME
   git add public/CNAME
   git commit -m "feat: add custom domain"
   git push
   ```

2. **Update nuxt.config.ts**:

   ```typescript
   app: {
     baseURL: '/', // Change back to root for custom domain
     // ...
   }
   ```

3. **Configure DNS**:

   - Add A records pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add CNAME record: `yourusername.github.io`

4. **Update GitHub Settings**:
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

---

## 🧪 Test Locally Before Deploying

```bash
# Generate static site
npm run generate

# Preview the generated site
npm run preview

# Visit http://localhost:3000 to test
```

**Important Checks:**

- ✅ All visualizations load correctly
- ✅ Tab audio capture works (requires HTTPS in production)
- ✅ Microphone input works
- ✅ Keyboard shortcuts work
- ✅ Fullscreen mode works
- ✅ PWA installs correctly

---

## 🐛 Troubleshooting

### Issue: 404 on Refresh

**Cause**: SPA mode requires catch-all routing.

**Solution**: GitHub Pages automatically handles this with the generated `404.html`.

### Issue: Assets Not Loading

**Cause**: Incorrect base URL.

**Fix**: Ensure `nuxt.config.ts` has:

```typescript
app: {
  baseURL: process.env.NUXT_APP_BASE_URL || '/',
}
```

### Issue: Microphone Permission Denied

**Cause**: Not using HTTPS.

**Solution**: GitHub Pages automatically provides HTTPS. Make sure you're accessing via `https://`, not `http://`.

### Issue: Tab Audio Not Working

**Expected**: Tab audio capture requires Chrome/Edge and only works on HTTPS in production.

**Solution**: This is a browser limitation, not a deployment issue. Microphone input works everywhere.

### Issue: Build Fails in GitHub Actions

**Check**:

1. Node version (should be 18+)
2. Dependencies lock file is committed
3. No environment-specific code

**Debug**: Check the Actions tab in GitHub for error logs.

---

## 📊 Deployment Checklist

Before going live, ensure:

- [ ] All code is committed and pushed
- [ ] `npm run generate` works locally without errors
- [ ] No console errors in browser
- [ ] All visualizations tested and working
- [ ] README.md updated with correct repository URL
- [ ] LICENSE file is present (MIT)
- [ ] Repository is public (or GitHub Pro for private)
- [ ] GitHub Pages is enabled in repository settings
- [ ] Workflow has permissions to deploy

---

## 🔐 Security Notes

### HTTPS is Required

- GitHub Pages provides free HTTPS
- Required for `getUserMedia` (microphone)
- Required for `getDisplayMedia` (tab audio) in production

### Permissions API

- Microphone and tab audio require user permission
- These are secure browser APIs
- All audio processing is client-side

### No Server Required

- Fully static deployment
- No backend needed
- No API keys to manage

---

## 📈 Post-Deployment

### Monitor

1. **Check Deployment Status**:

   - Go to **Actions** tab
   - View workflow runs
   - Check for errors

2. **Test Live Site**:

   - Visit your GitHub Pages URL
   - Test all features
   - Check browser console for errors

3. **Analytics** (Optional):
   - Add Google Analytics
   - Add Plausible Analytics
   - Monitor user engagement

### Update

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "feat: your changes"
git push

# Workflow automatically deploys!
```

---

## 🌐 Alternative Hosting Options

### Vercel (Recommended Alternative)

**Pros**: Faster builds, better analytics, automatic HTTPS
**Cons**: None really

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

**Pros**: Great UI, form handling, easy redirects
**Cons**: Build minutes limit on free tier

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Cloudflare Pages

**Pros**: Excellent performance, global CDN
**Cons**: Newer platform, less documentation

1. Connect GitHub repo in Cloudflare dashboard
2. Build command: `npm run generate`
3. Output directory: `.output/public`

---

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Nuxt Static Hosting](https://nuxt.com/docs/getting-started/deployment#static-hosting)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## ✅ Success!

Once deployed, your project will be:

- ✅ Live and accessible worldwide
- ✅ Served over HTTPS
- ✅ Automatically updated on push
- ✅ Ready for users to enjoy!

---

**Ready to deploy?**

```bash
git push origin main
```

Then watch the magic happen in the **Actions** tab! 🎉

---

**Project**: Nuxt Audio Visualizer v2.0.0  
**License**: MIT  
**Status**: Production-ready
