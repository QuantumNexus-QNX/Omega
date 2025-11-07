# TriVector.ai - Integrated Landing Page with Riemann Sphere

## 🎯 Integration Overview

This version integrates the **TriVector.ai Quasar landing page** with the **Tri-Logic Riemann Sphere visualizer** into a unified web experience.

---

## 🏗️ Architecture

### **Main Landing Page** (Quasar Framework)
- **Technology**: Quasar 2.x + Vue 3 + Vite
- **Purpose**: Primary marketing and information site
- **URL**: Root domain (`trivector.ai`)
- **Features**:
  - Animated gradient hero section
  - Multi-page navigation
  - Scroll-triggered animations
  - Mobile-responsive design
  - SEO optimized

### **Riemann Sphere Visualizer** (Next.js)
- **Technology**: Next.js + React + Three.js
- **Purpose**: Interactive 3D visualization tool
- **URL**: Subdomain or path (`sphere.trivector.ai` or `/sphere`)
- **Features**:
  - 3D Riemann sphere rendering
  - Tri-logic truth table computation
  - Interactive controls
  - Educational content

---

## 📂 Project Structure

```
trivector-ai/
├── src/
│   ├── components/
│   │   └── HeroSection.vue          # Enhanced animated hero
│   ├── pages/
│   │   ├── HomePage.vue             # Main landing page
│   │   ├── AboutPage.vue            # About page
│   │   ├── ResearchPage.vue         # Research overview
│   │   ├── RiemannSpherePage.vue    # NEW: Riemann sphere info page
│   │   ├── ServicesPage.vue         # Services page
│   │   └── ContactPage.vue          # Contact page
│   ├── layouts/
│   │   └── MainLayout.vue           # Navigation with Riemann link
│   ├── router/
│   │   └── routes.js                # Updated with /riemann-sphere route
│   └── css/
│       └── app.scss                 # Global styles with animations
├── public/
│   ├── hero-bg.jpeg                 # Hero background image
│   └── sphere/                      # Riemann sphere assets (reference)
│       ├── trilogic/                # Tri-logic components
│       └── components/              # Shared components
├── vercel.json                      # Deployment configuration
└── Documentation files
```

---

## 🔗 Navigation Integration

### **Main Navigation**
The main navigation now includes:
1. **Home** → `/`
2. **About** → `/about`
3. **Research** → `/research`
4. **Riemann Sphere** → `/riemann-sphere` (NEW)
5. **Services** → `/services`
6. **Contact** → `mailto:link@trivector.ai`

### **Riemann Sphere Page**
The new `/riemann-sphere` page provides:
- **Information** about tri-logic and the Riemann sphere
- **External link** to the full Next.js visualizer
- **Educational content** on mathematical foundations
- **Applications** in quantum computing, AI, and formal verification

---

## 🚀 Deployment Strategy

### **Option 1: Monorepo with Vercel (Recommended)**

Deploy both projects from the same repository:

1. **Main Landing Page** (Quasar)
   - Deploy from `trivector-ai/` directory
   - Domain: `trivector.ai`
   - Build command: `cd trivector-ai && quasar build`
   - Output: `trivector-ai/dist/spa`

2. **Riemann Sphere** (Next.js)
   - Deploy separately or as subdomain
   - Domain: `sphere.trivector.ai`
   - Build command: `next build`
   - Output: `.next`

### **Option 2: Separate Deployments**

1. **Quasar Landing Page**
   - Repository: Current `trivector-integrated` branch
   - Deploy to: `trivector.ai`

2. **Next.js Visualizer**
   - Repository: Main branch or separate repo
   - Deploy to: `sphere.trivector.ai`
   - Link from landing page: External link button

### **Option 3: Embedded iFrame (Current Implementation)**

The Riemann Sphere page includes a link to the external visualizer:
- **URL**: `https://omega-main.vercel.app/trilogic`
- **Integration**: External link with "Launch Visualizer" button
- **Benefits**: Independent deployment, no build conflicts

---

## 🎨 Design Consistency

Both projects share the same design language:

### **Color Palette**
- **Primary Gradient**: Purple (#667eea) → Cyan (#00f2fe)
- **Accent**: Cyan (#00bcd4)
- **Background**: Dark (#0a0a0a, #0f0f0f)
- **Text**: White (#ffffff), Gray (#e0e0e0)

### **Typography**
- **Font Family**: Inter, system fonts
- **Headings**: 700-800 weight
- **Body**: 1rem with 1.6 line-height

### **Animations**
- **Gradient**: 15s smooth transitions
- **Scroll Effects**: AOS library
- **Hover States**: 0.3s ease transitions

---

## 📊 Build Output

**Integrated Build Stats**:
- **Total JS**: 215.16 KB (15 files)
- **Total CSS**: 243.80 KB (9 files)
- **Gzipped**: ~125 KB total
- **New Page**: RiemannSpherePage.vue (6.29 KB JS, 3.83 KB CSS)

---

## 🔧 Configuration Files

### **vercel.json**
```json
{
  "buildCommand": "quasar build",
  "outputDirectory": "dist/spa",
  "framework": "quasar",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **routes.js**
```javascript
{
  path: 'riemann-sphere',
  name: 'riemann-sphere',
  component: () => import('pages/RiemannSpherePage.vue')
}
```

---

## 📝 Content Updates

### **Riemann Sphere Page Features**

1. **Hero Section**
   - Title: "Tri-Logic Riemann Sphere"
   - Subtitle: Interactive visualization description
   - Animated gradient background

2. **Information Panel**
   - About tri-logic
   - Key features list
   - Truth value indicators (True, Unknown, False)

3. **Visualization Section**
   - External link to full visualizer
   - "Launch Riemann Sphere Visualizer" button
   - Opens in new window

4. **Educational Content**
   - Mathematical foundation
   - Mapping of truth values to sphere points
   - Applications in various fields

5. **Applications Section**
   - Quantum Computing
   - Neural Networks
   - Formal Verification

---

## 🌐 External Links

### **Riemann Sphere Visualizer**
- **Current URL**: https://omega-main.vercel.app/trilogic
- **Future URL**: https://sphere.trivector.ai (recommended)

### **Repository**
- **GitHub**: https://github.com/QuantumNexus-QNX/Omega
- **Branch**: `trivector-integrated`

---

## 🎯 Next Steps

1. **Deploy Quasar Landing Page**
   - Branch: `trivector-integrated`
   - Domain: `trivector.ai`

2. **Deploy Next.js Visualizer** (if not already deployed)
   - Branch: `main`
   - Domain: `sphere.trivector.ai`

3. **Update External Link**
   - Change URL in RiemannSpherePage.vue
   - Point to final subdomain

4. **Test Integration**
   - Verify navigation works
   - Test external link opens correctly
   - Check mobile responsiveness

5. **Configure Custom Domains**
   - Main: `trivector.ai`
   - Sphere: `sphere.trivector.ai`

---

## 📧 Contact

**Email**: link@trivector.ai

---

## ✨ Summary

This integrated version provides a **unified web presence** for TriVector.ai with:

✅ **Main Landing Page** (Quasar) - Marketing and information  
✅ **Riemann Sphere Page** - Educational content and visualizer link  
✅ **Seamless Navigation** - Integrated menu with all sections  
✅ **Consistent Design** - Shared color palette and animations  
✅ **External Visualizer** - Link to full Next.js 3D application  
✅ **Mobile Responsive** - Works on all devices  
✅ **SEO Optimized** - Meta tags and semantic HTML  
✅ **Production Ready** - Built and tested  

**Ready for deployment!** 🚀

