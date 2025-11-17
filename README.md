# Omega - TriVector.ai Monorepo

**Unified repository for TriVector.ai web presence**

---

## 🏗️ Project Structure

This monorepo contains multiple projects for the TriVector.ai ecosystem:

```
Omega/
├── landing/              # Quasar landing page (Main site)
├── app/                  # Next.js Riemann sphere visualizer
├── components/           # Shared React components
├── trivector-ai/         # Additional Next.js project
└── vercel.json           # Multi-project deployment config
```

---

## 📂 Projects

### **1. Landing Page** (`/landing`)
- **Technology**: Quasar Framework 2.x + Vue 3 + Vite
- **Purpose**: Main marketing and information website
- **URL**: `trivector.ai` (root domain)
- **Features**:
  - Animated gradient hero section
  - Multi-page navigation (Home, About, Research, Riemann Sphere, Services, Contact)
  - Scroll-triggered animations
  - Mobile-responsive design
  - SEO optimized

### **2. Riemann Sphere Visualizer** (`/app`)
- **Technology**: Next.js + React + Three.js
- **Purpose**: Interactive 3D tri-logic visualization
- **URL**: `sphere.trivector.ai` or `/trilogic`
- **Features**:
  - 3D Riemann sphere rendering
  - Tri-logic truth table computation
  - Interactive controls
  - Educational content

### **3. Consciousness Modeling Framework** (`/app/consciousness`)
- **Technology**: Next.js + Advanced Math Libraries
- **Purpose**: Mathematical consciousness modeling with spectral geometry and tri-logic
- **URL**: `trivector.ai/consciousness`
- **Features**:
  - JO framework constants (μ, Ω, κ, β)
  - ENCHC higher category theory
  - Spectral triple computations
  - K3 tri-valued logic
  - JO∞∞ tensor calculus
  - Interactive parameter console

### **4. TriVector AI** (`/trivector-ai`)
- **Technology**: Next.js
- **Purpose**: Additional AI project
- **URL**: TBD

---

## 🚀 Deployment

### **Vercel Monorepo Deployment**

This repository is configured for Vercel's monorepo support.

**Deploy Landing Page**:
1. Go to https://vercel.com/new
2. Import this repository
3. Configure:
   - **Root Directory**: `landing/`
   - **Build Command**: `quasar build`
   - **Output Directory**: `dist/spa`
   - **Domain**: `trivector.ai`

**Deploy Riemann Sphere**:
1. Create a new Vercel project
2. Import the same repository
3. Configure:
   - **Root Directory**: `/` (root)
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Domain**: `sphere.trivector.ai`

---

## 📧 Contact

**Email**: link@trivector.ai

---

## 📝 Documentation

- **Landing Page**: See `/landing/README.md`
- **Landing Page Quick Start**: See `/landing/QUICKSTART.md`
- **Landing Page Deployment**: See `/landing/DEPLOYMENT.md`
- **Landing Page Enhancements**: See `/landing/ENHANCEMENTS.md`
- **Integration Guide**: See `/landing/INTEGRATION.md`
- **Riemann Sphere Setup**: See `/VERCEL_SETUP.md`

---

## ✨ Key Features

✅ **Unified Repository** - All projects in one place  
✅ **Multi-Project Deployment** - Deploy to different domains  
✅ **Shared Resources** - Common components and assets  
✅ **Independent Builds** - Each project builds separately  
✅ **Consistent Branding** - Shared design language  
✅ **Production Ready** - Optimized and tested  

---

**Built with Quasar, Next.js, and Three.js | Production-Ready | Vercel Optimized**

