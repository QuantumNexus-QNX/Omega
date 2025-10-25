# Deployment Guide for TriVector.ai

This guide provides step-by-step instructions for deploying the TriVector.ai landing page to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Git installed locally
- Node.js 18+ and pnpm installed

## Deployment Methods

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI globally**
   ```bash
   pnpm add -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd trivector-ai
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - What's your project's name? `trivector-ai`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Method 2: GitHub + Vercel Integration (Recommended for CI/CD)

#### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done)
   ```bash
   cd trivector-ai
   git init
   git add .
   git commit -m "Initial commit: TriVector.ai landing page"
   ```

2. **Create GitHub repository**
   - Go to [GitHub](https://github.com/new)
   - Repository name: `trivector-ai`
   - Description: "Production-ready AI startup landing page"
   - Visibility: Public or Private
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/trivector-ai.git
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Git Repository**
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and select `trivector-ai` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `trivector-ai`
   - **Framework Preset**: Quasar (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `quasar build` (auto-detected from vercel.json)
   - **Output Directory**: `dist/spa` (auto-detected from vercel.json)
   - **Install Command**: `pnpm install`

4. **Environment Variables** (Optional)
   - Click "Environment Variables"
   - Add any variables from `.env.example` if needed
   - Example:
     - `NODE_ENV` = `production`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-3 minutes)
   - Your site will be live at `https://trivector-ai.vercel.app`

#### Step 3: Automatic Deployments

Once connected to GitHub, Vercel automatically:
- **Production deployments**: Every push to `main` branch
- **Preview deployments**: Every pull request
- **Instant rollbacks**: One-click rollback to previous deployments

### Method 3: Vercel Dashboard Upload

1. **Build the project locally**
   ```bash
   cd trivector-ai
   pnpm build
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Deploy" under "Deploy from Git"

3. **Upload dist folder**
   - Drag and drop the `dist/spa` folder
   - Or click "Browse" and select `dist/spa`

4. **Deploy**
   - Vercel will upload and deploy
   - Site will be live at a generated URL

> **Note**: This method doesn't support automatic deployments

## Custom Domain Configuration

### Add Custom Domain

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings" → "Domains"

2. **Add Domain**
   - Enter `trivector.ai`
   - Click "Add"

3. **Add www subdomain**
   - Enter `www.trivector.ai`
   - Click "Add"

### Configure DNS

#### Option A: Vercel Nameservers (Recommended)

1. **Get Vercel nameservers**
   - Vercel will provide nameservers (e.g., `ns1.vercel-dns.com`)

2. **Update domain registrar**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Find DNS settings
   - Replace nameservers with Vercel's nameservers
   - Save changes

3. **Wait for propagation**
   - DNS changes can take 24-48 hours
   - Usually completes in 1-2 hours

#### Option B: CNAME/A Records

1. **For root domain** (`trivector.ai`)
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel's IP)

2. **For www subdomain** (`www.trivector.ai`)
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

3. **Save and wait**
   - DNS propagation takes 1-48 hours

### SSL Certificate

Vercel automatically provisions SSL certificates for all domains:
- Free SSL via Let's Encrypt
- Automatic renewal
- HTTPS enforced by default

## Environment Variables

### Adding Environment Variables

1. **In Vercel Dashboard**
   - Go to project → "Settings" → "Environment Variables"

2. **Add variables**
   - Name: `VITE_APP_NAME`
   - Value: `TriVector.ai`
   - Environments: Production, Preview, Development

3. **Redeploy**
   - Changes require redeployment
   - Go to "Deployments" → Select latest → "Redeploy"

### Common Variables

```bash
# Application
NODE_ENV=production
VITE_APP_NAME=TriVector.ai
VITE_APP_URL=https://trivector.ai

# Contact
VITE_CONTACT_EMAIL=link@trivector.ai

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=XXXXXXX
```

## Build Configuration

The project uses `vercel.json` for deployment configuration:

```json
{
  "buildCommand": "quasar build",
  "outputDirectory": "dist/spa",
  "framework": "quasar"
}
```

### Custom Build Settings

To modify build settings:

1. **Edit vercel.json**
   ```json
   {
     "buildCommand": "pnpm build",
     "outputDirectory": "dist/spa",
     "installCommand": "pnpm install"
   }
   ```

2. **Commit and push**
   ```bash
   git add vercel.json
   git commit -m "Update build configuration"
   git push
   ```

## Troubleshooting

### Build Fails

**Error**: `Command "quasar" not found`

**Solution**: Ensure `@quasar/cli` is in `devDependencies`
```bash
pnpm add -D @quasar/cli
```

### 404 on Page Refresh

**Error**: Refreshing non-root pages returns 404

**Solution**: Ensure `vercel.json` has rewrites configured:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Slow Build Times

**Solution**: Enable build cache in Vercel settings
- Go to Settings → General → Build & Development Settings
- Enable "Build Cache"

### Domain Not Working

**Solution**: Check DNS propagation
- Use [whatsmydns.net](https://www.whatsmydns.net)
- Enter your domain
- Verify DNS records are propagated globally

## Performance Optimization

### Enable Compression

Vercel automatically enables:
- Gzip compression
- Brotli compression

### Edge Caching

Configure caching headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Analytics

Enable Vercel Analytics:
1. Go to project → "Analytics"
2. Click "Enable Analytics"
3. Free tier includes Web Vitals tracking

## Monitoring

### Deployment Logs

View build and deployment logs:
1. Go to "Deployments"
2. Click on a deployment
3. View "Build Logs" and "Function Logs"

### Performance Monitoring

Use Vercel Analytics to monitor:
- Page load times
- Core Web Vitals
- Traffic patterns
- Error rates

## Rollback

### Quick Rollback

1. Go to "Deployments"
2. Find previous successful deployment
3. Click "⋯" → "Promote to Production"
4. Confirm rollback

### Git Rollback

```bash
git revert HEAD
git push
```

Vercel will automatically deploy the reverted version.

## CI/CD Best Practices

### Branch Protection

1. **Enable branch protection on GitHub**
   - Settings → Branches → Add rule
   - Branch name pattern: `main`
   - Require pull request reviews
   - Require status checks to pass

### Preview Deployments

Every pull request gets a unique preview URL:
- Test changes before merging
- Share with stakeholders
- Automatic cleanup after merge

### Deployment Notifications

Enable Slack/Discord notifications:
1. Vercel Dashboard → Integrations
2. Add Slack or Discord integration
3. Configure notification preferences

## Support

For deployment issues:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Quasar Docs: [quasar.dev](https://quasar.dev)
- Contact: [link@trivector.ai](mailto:link@trivector.ai)

---

Last updated: 2025-10-25

