# Vercel Setup Guide for Omega/Trivector.AI

This repository contains multiple Next.js projects:
- **Root**: Main Omega application
- **trivector-ai**: Trivector.AI website (deployed to trivector.ai)

## Important: Configure Root Directory in Vercel

Since this is a monorepo with multiple Next.js applications, you **must** configure Vercel to use the correct root directory for each deployment.

### For trivector.ai Website

The trivector.ai domain should be deployed from the `trivector-ai` subdirectory.

#### Step-by-Step Configuration

1. **Go to your Vercel Project Settings**
   - Open [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your `trivector-ai` project
   - Go to **Settings** → **General**

2. **Configure Root Directory**
   - Scroll to **Root Directory** section
   - Click **Edit**
   - Enter: `trivector-ai`
   - Click **Save**

3. **Verify Build Settings**
   - Go to **Settings** → **Build & Development Settings**
   - Ensure these settings (should auto-detect from trivector-ai/vercel.json):
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build` (or leave empty for auto-detect)
     - **Output Directory**: `.next` (or leave empty for auto-detect)
     - **Install Command**: `npm install` (or leave empty for auto-detect)

4. **Redeploy**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy**
   - Select **Use existing Build Cache**: No (for first deployment after this change)

### Expected Behavior After Configuration

Once configured correctly:
- Vercel will run builds from the `trivector-ai` directory
- The build command will be: `npm run build` (from trivector-ai/package.json)
- All paths in vercel.json will be relative to `trivector-ai/`
- The root tsconfig.json will be ignored (trivector-ai has its own)

### Troubleshooting

#### Issue: Build still fails with "Cannot find module 'jest'"

**Cause**: Vercel is still building from the repository root instead of `trivector-ai`.

**Solution**:
1. Double-check the Root Directory setting is set to `trivector-ai`
2. Trigger a new deployment (don't use existing build cache)
3. Verify the build logs show: `Building from trivector-ai directory`

#### Issue: "No package.json found"

**Cause**: Root Directory path is incorrect.

**Solution**:
1. Ensure the path is exactly `trivector-ai` (case-sensitive)
2. No leading or trailing slashes
3. Check that trivector-ai/package.json exists in your repository

#### Issue: Environment variables not working

**Cause**: Environment variables need to be set in Vercel dashboard.

**Solution**:
1. Go to **Settings** → **Environment Variables**
2. Add all required variables from `trivector-ai/.env.example`
3. Set appropriate environments (Production, Preview, Development)
4. Redeploy to apply changes

See [trivector-ai/ENVIRONMENT_SETUP.md](./trivector-ai/ENVIRONMENT_SETUP.md) for full environment variable documentation.

### Multiple Deployments (Advanced)

If you want to deploy both the root Omega app AND trivector-ai separately:

1. **Create two separate Vercel projects**:
   - Project 1: `omega-main` (root directory: leave empty or set to `/`)
   - Project 2: `trivector-ai` (root directory: `trivector-ai`)

2. **Configure different domains**:
   - omega-main: your-omega-domain.com
   - trivector-ai: trivector.ai

3. **Use different branches** (optional):
   - omega-main: deploy from `main` branch
   - trivector-ai: deploy from `main` branch or a dedicated `trivector-ai-prod` branch

### Vercel CLI Configuration (Optional)

If you're using Vercel CLI for deployments, you can configure project settings locally:

1. **Initialize Vercel project in trivector-ai**:
   ```bash
   cd trivector-ai
   vercel link
   ```

2. **Follow the prompts**:
   - Select your team
   - Select the project
   - Link the directory

3. **This creates** `.vercel/project.json`:
   ```json
   {
     "orgId": "your-org-id",
     "projectId": "your-project-id"
   }
   ```

4. **Deploy from trivector-ai**:
   ```bash
   cd trivector-ai
   vercel --prod
   ```

### GitHub Integration

With GitHub integration enabled:
- Pushes to `main` → Production deployment (from trivector-ai directory)
- Pull requests → Preview deployment (from trivector-ai directory)
- Pushes to other branches → Preview deployment

The GitHub Actions workflow in `.github/workflows/ci-cd.yml` is configured to:
- Run CI checks on all branches
- Deploy to Vercel on successful builds
- Comment on PRs with preview URLs

### Project Structure

```
Omega/
├── app/                          # Root Omega app
├── components/                   # Root Omega components
├── package.json                  # Root package.json
├── tsconfig.json                 # Root TypeScript config (excludes trivector-ai)
├── trivector-ai/                 # ← VERCEL ROOT DIRECTORY FOR TRIVECTOR.AI
│   ├── src/
│   ├── package.json              # Trivector.AI dependencies
│   ├── tsconfig.json             # Trivector.AI TypeScript config
│   ├── vercel.json               # Vercel configuration for trivector.ai
│   └── .env.example              # Environment variables template
└── .github/
    └── workflows/
        └── ci-cd.yml             # GitHub Actions CI/CD
```

### Quick Checklist

Before deploying trivector.ai:

- [ ] Vercel Root Directory set to `trivector-ai`
- [ ] Environment variables configured in Vercel dashboard
- [ ] GitHub secrets configured for CI/CD (optional)
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- [ ] Domain configured (trivector.ai)
- [ ] SSL/TLS certificate active
- [ ] First deployment successful

### Getting Help

If you continue to experience issues:

1. **Check Vercel build logs**:
   - Go to Deployments
   - Click on the failed deployment
   - Review the build logs for specific errors

2. **Common Issues**:
   - Wrong root directory → Check Settings → General → Root Directory
   - Missing environment variables → Check Settings → Environment Variables
   - TypeScript errors → Check that tsconfig.json excludes test files
   - Dependency issues → Clear build cache and redeploy

3. **Resources**:
   - [Vercel Monorepo Documentation](https://vercel.com/docs/concepts/deployments/build-step#monorepos)
   - [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
   - [trivector-ai/ENVIRONMENT_SETUP.md](./trivector-ai/ENVIRONMENT_SETUP.md)
   - [.github/workflows/README.md](./.github/workflows/README.md)

### Support

For issues specific to this setup:
- Check this documentation
- Review build logs in Vercel dashboard
- Create an issue in the GitHub repository

For Vercel platform issues:
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
