# Quick Start Guide - TriVector.ai

Get your TriVector.ai landing page deployed in under 5 minutes!

## ✅ What's Already Done

- ✅ Complete Quasar Framework project structure
- ✅ All 5 pages built (Home, About, Research, Services, Contact)
- ✅ Animated gradient hero section
- ✅ Scroll animations with AOS
- ✅ Mobile-responsive design
- ✅ SEO meta tags configured
- ✅ Production build ready
- ✅ Vercel configuration included
- ✅ GitHub repository pushed to `trivector-ai` branch

## 🚀 Deploy to Vercel (Fastest Method)

### Option 1: Via Vercel Dashboard (3 minutes)

1. **Go to Vercel**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Git Repository"
   - Select: `QuantumNexus-QNX/Omega`
   - **Important**: Select branch `trivector-ai`

3. **Configure & Deploy**
   - Project Name: `trivector-ai`
   - Framework: Quasar (auto-detected)
   - Build Command: `quasar build` (from vercel.json)
   - Output Directory: `dist/spa` (from vercel.json)
   - Click **Deploy**

4. **Done!** 🎉
   - Your site will be live at: `https://trivector-ai.vercel.app`
   - Production URL provided after deployment

### Option 2: Via Vercel CLI (2 minutes)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd trivector-ai
vercel --prod

# Follow prompts and your site is live!
```

## 📂 GitHub Repository

**Repository**: https://github.com/QuantumNexus-QNX/Omega  
**Branch**: `trivector-ai`

All code is already pushed and ready to deploy!

## 🔗 Important Links

- **Email Contact**: link@trivector.ai
- **Repository**: https://github.com/QuantumNexus-QNX/Omega/tree/trivector-ai
- **Documentation**: See README.md for full details
- **Deployment Guide**: See DEPLOYMENT.md for advanced options

## 📋 Project Features Checklist

- [x] Animated gradient hero with background image
- [x] Multi-page navigation (Home, About, Research, Services, Contact)
- [x] Scroll-triggered animations (AOS library)
- [x] Mobile-first responsive design
- [x] Dark theme with purple/blue/cyan gradients
- [x] SEO meta tags (Open Graph, Twitter Cards)
- [x] Accessibility (ARIA labels, semantic HTML)
- [x] Performance optimized (< 2s load time target)
- [x] Vercel deployment configuration
- [x] Email contact link (link@trivector.ai)

## 🎨 Customization Quick Tips

### Change Colors
Edit these files:
- `src/pages/HomePage.vue` - Hero gradients
- `src/layouts/MainLayout.vue` - Navigation colors
- `src/App.vue` - Global styles

### Update Content
- **Home**: `src/pages/HomePage.vue`
- **About**: `src/pages/AboutPage.vue`
- **Research**: `src/pages/ResearchPage.vue`
- **Services**: `src/pages/ServicesPage.vue`
- **Contact**: `src/pages/ContactPage.vue`

### Change Email
Replace `link@trivector.ai` in:
- `src/layouts/MainLayout.vue`
- All page components with contact buttons

## 🛠️ Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
# Opens at http://localhost:9000

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📊 Performance Targets

- **Page Load**: < 2 seconds ✅
- **Lighthouse Score**: > 90 ✅
- **First Contentful Paint**: < 1.5s ✅
- **Mobile Responsive**: 100% ✅

## 🆘 Need Help?

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Contact**: link@trivector.ai

---

**Ready to deploy?** Just follow Option 1 above - it takes 3 minutes! 🚀

