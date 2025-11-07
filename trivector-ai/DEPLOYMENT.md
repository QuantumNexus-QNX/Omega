# Tri-Logic Visualizer - Permanent Deployment

## Production URLs

**Primary Production URL**: https://omega-plum-mu.vercel.app
**Tri-Logic Visualizer**: https://omega-plum-mu.vercel.app/trilogic

**Alternative URLs**:
- https://omega-orions-projects-57119169.vercel.app
- https://omega-git-main-orions-projects-57119169.vercel.app

## Deployment Configuration

### Vercel Project
- **Project Name**: omega
- **Project ID**: prj_rOUSf8we2Q0rE943uluSO80SE5j9
- **Team**: Orion's projects (team_okjLSv7Rm6JI9HuKQpft8Q3M)
- **Framework**: Next.js 14.2.33
- **Node Version**: 22.x
- **Deployment Type**: Production (automatic from main branch)

### GitHub Integration
- **Repository**: QuantumNexus-QNX/Omega
- **Branch**: main
- **Auto-deploy**: Enabled (pushes to main trigger automatic deployment)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Domain Configuration

The project currently has three Vercel-provided domains:
1. **omega-plum-mu.vercel.app** (primary production domain)
2. **omega-orions-projects-57119169.vercel.app** (team-scoped domain)
3. **omega-git-main-orions-projects-57119169.vercel.app** (branch-specific domain)

All domains are permanent and will remain active as long as the Vercel project exists.

### Custom Domain Setup (Optional)

To add a custom domain (e.g., trilogic.trivector.ai):

1. **Purchase or configure domain** through your domain registrar
2. **Add domain in Vercel**:
   - Go to Project Settings → Domains
   - Add the custom domain
   - Configure DNS records as instructed by Vercel
3. **DNS Configuration**:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records pointing to Vercel's IP addresses

## Deployment Status

✅ **Current Status**: READY (Production)
✅ **Build Status**: Successful
✅ **Latest Deployment**: dpl_AmFQN7eeoznrBTtMP4MH68Kt2GeZ
✅ **Deployed At**: 2025-10-24 01:05:25 UTC
✅ **Regions**: iad1 (US East), sfo1 (US West), lhr1 (Europe)

## Routes

- `/` - Home page with cosmic design
- `/trilogic` - Interactive tri-logic Riemann sphere visualizer

## Monitoring

**Vercel Dashboard**: https://vercel.com/orions-projects-57119169/omega

**Deployment Inspector**: https://vercel.com/orions-projects-57119169/omega/AmFQN7eeoznrBTtMP4MH68Kt2GeZ

## Continuous Deployment

Every push to the `main` branch automatically triggers a new deployment:

1. GitHub webhook notifies Vercel of push
2. Vercel pulls latest code
3. Runs `npm install` to install dependencies
4. Runs `npm run build` to build Next.js app
5. Deploys to production domains
6. Updates all domain aliases

Typical deployment time: 30-60 seconds

## Rollback

To rollback to a previous deployment:
1. Visit the Vercel dashboard
2. Navigate to Deployments
3. Find the deployment to rollback to
4. Click "Promote to Production"

## Environment Variables

No environment variables are currently required for this project.

## Performance

- **CDN**: Vercel Edge Network (global)
- **Caching**: Automatic static asset caching
- **Compression**: Automatic gzip/brotli compression
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic via Next.js

## Security

- **HTTPS**: Automatic SSL/TLS certificates
- **Headers**: Security headers configured by Next.js
- **CSP**: Content Security Policy (can be configured if needed)

## Maintenance

The deployment is fully automated and requires no manual maintenance. Updates are deployed automatically when code is pushed to the main branch.

## Support

For deployment issues:
- Check Vercel deployment logs in the dashboard
- Review build logs for errors
- Contact Vercel support if needed

---

**Last Updated**: 2025-10-24
**Deployment Type**: Permanent Production
**Status**: Active ✅

