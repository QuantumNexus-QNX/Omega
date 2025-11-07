# TriVector.ai - AI Startup Landing Page

Production-ready landing page for TriVector.ai, built with Quasar Framework (Vue 3) featuring animated gradients, scroll effects, and modern design.

## 🚀 Features

- **Animated Gradient Hero Section**: Eye-catching hero with dynamic purple/blue/cyan gradients
- **Multi-Page Navigation**: Home, About, Research, Services, and Contact pages
- **Scroll Animations**: Smooth AOS (Animate On Scroll) effects throughout
- **Mobile-First Responsive Design**: Optimized for all devices
- **Dark Theme**: Modern dark aesthetic with vibrant accent colors
- **SEO Optimized**: Comprehensive meta tags and semantic HTML
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance Optimized**: Fast load times and Lighthouse score > 90

## 📧 Contact

Email: [link@trivector.ai](mailto:link@trivector.ai)

## 🛠️ Tech Stack

- **Framework**: Quasar Framework 2.x
- **Frontend**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite
- **Styling**: SCSS with CSS keyframe animations
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Material Icons (via Quasar)

## 📦 Installation

### Prerequisites

- Node.js 18+ (v22.13.0 recommended)
- pnpm 8+ (v10.19.0 recommended)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trivector-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   quasar dev
   ```

   The app will be available at `http://localhost:9000`

## 🏗️ Build & Deployment

### Build for Production

```bash
pnpm build
# or
quasar build
```

The production-ready files will be in `dist/spa/`

### Deploy to Vercel

#### Option 1: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Deploy to production**
   ```bash
   vercel --prod
   ```

#### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Quasar and use the settings from `vercel.json`
6. Click "Deploy"

#### Option 3: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Quasar configuration
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` triggers a production deployment
   - Pull requests create preview deployments

### Custom Domain Setup

1. In Vercel Dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add `trivector.ai` and `www.trivector.ai`
4. Follow DNS configuration instructions

## 📁 Project Structure

```
trivector-ai/
├── public/                 # Static assets
│   ├── hero-bg.jpeg       # Hero background image
│   ├── favicon.ico        # Favicon
│   └── icons/             # App icons
├── src/
│   ├── assets/            # Dynamic assets
│   ├── components/        # Vue components
│   ├── css/               # Global styles
│   │   ├── app.scss       # Main stylesheet
│   │   └── quasar.variables.scss
│   ├── layouts/           # Layout components
│   │   └── MainLayout.vue # Main layout with nav & footer
│   ├── pages/             # Page components
│   │   ├── HomePage.vue   # Landing page
│   │   ├── AboutPage.vue  # About page
│   │   ├── ResearchPage.vue
│   │   ├── ServicesPage.vue
│   │   ├── ContactPage.vue
│   │   └── ErrorNotFound.vue
│   ├── router/            # Vue Router configuration
│   │   ├── index.js
│   │   └── routes.js
│   └── App.vue            # Root component
├── .env.example           # Environment variables template
├── vercel.json            # Vercel deployment config
├── quasar.config.js       # Quasar configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 🎨 Customization

### Colors

Edit gradient colors in component styles:
- Primary gradient: `#667eea` → `#764ba2`
- Accent color: `#00bcd4` (cyan)
- Background: `#0a0a0a` (dark)

### Content

Update content in respective page components:
- `src/pages/HomePage.vue` - Hero and features
- `src/pages/AboutPage.vue` - Mission and values
- `src/pages/ResearchPage.vue` - Research areas and publications
- `src/pages/ServicesPage.vue` - Service offerings
- `src/pages/ContactPage.vue` - Contact information

### SEO Meta Tags

Edit meta tags in `src/App.vue` (useMeta section)

## 📊 Performance

Target metrics:
- **Page Load**: < 2 seconds
- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s

## 🔧 Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Quasar CLI
quasar dev            # Start dev server
quasar build          # Build for production
quasar inspect        # Inspect webpack config
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Copyright © 2025 TriVector AI. All rights reserved.

## 🤝 Support

For questions or support, contact: [link@trivector.ai](mailto:link@trivector.ai)

---

Built with ❤️ using [Quasar Framework](https://quasar.dev)

