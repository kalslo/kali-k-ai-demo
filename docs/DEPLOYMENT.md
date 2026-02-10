# Window Deployment Guide

This guide covers deploying Window to various hosting platforms and preparing the application for production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Production Build](#production-build)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure:

- ✅ All tests pass (`npm run test`)
- ✅ No linting errors (`npm run lint`)
- ✅ Code formatted (`npm run format`)
- ✅ Documentation updated
- ✅ Git repository clean (no uncommitted changes)

## Production Build

### 1. Build the Application

Create an optimized production build:

```bash
npm run build
```

This creates a `dist/` directory with:

- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps (for debugging)

### 2. Preview Build Locally

Test the production build before deploying:

```bash
npm run preview
```

Visit [http://localhost:4173](http://localhost:4173) to preview.

### 3. Verify Build

Check build output:

```bash
ls -lh dist/
```

Typical build size: ~150-200 KB (gzipped)

**Build Contents**:

```
dist/
├── index.html           # Entry HTML
├── assets/
│   ├── index-[hash].js  # Main bundle
│   ├── index-[hash].css # Styles
│   └── vendor-[hash].js # Dependencies
└── favicon.ico          # Favicon
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Best For**: Quick deployment, automatic previews, excellent performance

**Steps**:

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Confirm project settings
   - Deploy!

4. **Production deployment**:
   ```bash
   vercel --prod
   ```

**Vercel Configuration** (`vercel.json`):

```json
{
  "name": "window",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Vercel Dashboard Setup**:

- Domain: Configure custom domain (optional)
- Environment Variables: None needed (local-only app)
- Branch Deployments: Auto-deploy from `main` branch

### Option 2: Netlify

**Best For**: Simple deployment, edge functions, form handling

**Steps**:

1. **Install Netlify CLI**:

   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy**:

   ```bash
   npm run build
   netlify deploy --dir=dist --prod
   ```

3. **Or use Netlify Drop**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag `dist/` folder

**Netlify Configuration** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Option 3: GitHub Pages

**Best For**: Free hosting, version control integration

**Steps**:

1. **Install gh-pages**:

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add scripts to package.json**:

   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts** with base URL:

   ```typescript
   export default defineConfig({
     base: '/kali-k-ai-demo/',
     plugins: [react()],
   });
   ```

4. **Deploy**:

   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**:
   - Go to repo Settings → Pages
   - Source: gh-pages branch
   - Save

**URL**: `https://kalslo.github.io/kali-k-ai-demo/`

### Option 4: Cloudflare Pages

**Best For**: Global CDN, fast edge network, free tier

**Steps**:

1. **Connect repo** to Cloudflare Pages
2. **Build settings**:
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: 20
3. **Deploy**

**Cloudflare Configuration**:

```toml
# wrangler.toml
name = "window"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Option 5: AWS S3 + CloudFront

**Best For**: Enterprise deployment, full AWS integration

**Steps**:

1. **Create S3 bucket**
2. **Enable static website hosting**
3. **Upload build files**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name/
   ```
4. **Create CloudFront distribution**
5. **Configure DNS**

## Environment Configuration

### Base URL Configuration

For subdirectory deployments, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/your-subdirectory/' : '/',
  plugins: [react()],
});
```

### Custom Domain

**Vercel**:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS (A/CNAME records)

**Netlify**:

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

**GitHub Pages**:

1. Add `CNAME` file to `public/` directory
2. Add your domain to GitHub repo settings

## Performance Optimization

### Pre-deployment Checklist

- [x] Run production build
- [x] Check bundle size
- [x] Verify source maps generated
- [x] Test on various devices/browsers
- [x] Run Lighthouse audit

### Bundle Analysis

Analyze bundle size:

```bash
npm run build -- --mode analyze
```

Or use:

```bash
npx vite-bundle-visualizer
```

**Target Sizes**:

- Main bundle: <100 KB
- Vendor bundle: <150 KB
- Total (gzipped): <200 KB

### Lighthouse Audit

Run Lighthouse (Chrome DevTools):

1. Open DevTools → Lighthouse
2. Select "Desktop" and "Performance"
3. Generate report

**Target Scores**:

- Performance: >90
- Accessibility: 100
- Best Practices: 100
- SEO: >85

### Optimization Techniques

**Vite Auto-optimizations**:

- ✅ Tree shaking (removes unused code)
- ✅ Minification (Terser for JS, cssnano for CSS)
- ✅ Code splitting (auto vendor chunks)
- ✅ Asset optimization (images, fonts)

**Manual Optimizations**:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      },
    },
  },
});
```

## Monitoring & Analytics

### Error Tracking

**Sentry** (recommended):

1. Install:

   ```bash
   npm install @sentry/react
   ```

2. Configure in `main.tsx`:

   ```typescript
   import * as Sentry from '@sentry/react';

   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN',
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

### Analytics

**Plausible Analytics** (privacy-friendly):

Add to `index.html`:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**Google Analytics** (optional):

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring

**Web Vitals**:

```bash
npm install web-vitals
```

```typescript
// main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to analytics endpoint
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test -- --run

      - name: Run linting
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Pre-deployment Checks

Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run lint && npm run test -- --run && npm run build"
  }
}
```

## Security Considerations

### Content Security Policy

Add to `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
           style-src 'self' 'unsafe-inline'; 
           script-src 'self'"
/>
```

### Security Headers

Configure in hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Troubleshooting

### Build Fails

**Issue**: Build command fails with errors

**Solution**:

1. Clear node_modules: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Retry build: `npm run build`

### Blank Page After Deploy

**Issue**: App shows blank page in production

**Solution**:

1. Check browser console for errors
2. Verify base URL in `vite.config.ts`
3. Check if assets are loading (Network tab)
4. Ensure routing redirects configured

### 404 on Refresh

**Issue**: Page refresh returns 404

**Solution**: Configure SPA fallback to `index.html` (see platform-specific configs above)

### localStorage Not Working

**Issue**: Data not persisting

**Solution**:

1. Check if users are in private/incognito mode
2. Verify localStorage quota not exceeded
3. Check browser's localStorage support

### Slow Initial Load

**Issue**: First load takes too long

**Solution**:

1. Analyze bundle size (`npm run build -- --mode analyze`)
2. Enable code splitting
3. Lazy load non-critical components
4. Optimize images and assets

## Post-Deployment

### Verification Checklist

After deployment, verify:

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] No console errors
- [ ] localStorage working
- [ ] Responsive on mobile
- [ ] Fast load times (<3s)
- [ ] Analytics tracking (if configured)
- [ ] Error monitoring working (if configured)

### Monitoring

- Check analytics daily (first week)
- Monitor error rates in Sentry
- Review performance metrics
- Collect user feedback

### Rollback Plan

If issues occur:

**Vercel**:

```bash
vercel rollback
```

**Netlify**:

- Go to Deploys → Click previous deployment → Publish

**GitHub Pages**:

```bash
git revert HEAD
git push
npm run deploy
```

## Maintenance

### Regular Tasks

- **Weekly**: Review analytics and errors
- **Monthly**: Update dependencies (`npm update`)
- **Quarterly**: Security audit (`npm audit`)
- **As needed**: Deploy bug fixes and features

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npx npm-check-updates -u
npm install

# Test after updates
npm run test
npm run lint
npm run build
```

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Pages Guide](https://pages.github.com/)

---

**Need help?** Open an issue or consult the [FAQ](./FAQ.md).
