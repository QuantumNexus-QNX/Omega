<template>
  <section class="hero-section">
    <!-- Animated Gradient Background -->
    <div class="gradient-bg" :class="{ 'reduced-motion': prefersReducedMotion }"></div>
    
    <!-- CSS-Only Particle Effect -->
    <div class="particles" :class="{ 'reduced-motion': prefersReducedMotion }">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>

    <!-- Hero Content -->
    <div class="hero-content">
      <!-- Logo/Brand -->
      <div class="brand-container" data-aos="fade-down">
        <h1 class="brand-title">
          Tri<span class="accent">Vector</span><span class="text-cyan">.ai</span>
        </h1>
      </div>

      <!-- Tagline -->
      <p class="tagline" data-aos="fade-up" data-aos-delay="200">
        {{ tagline }}
      </p>

      <!-- CTA Buttons -->
      <div class="cta-container" data-aos="fade-up" data-aos-delay="400">
        <q-btn
          unelevated
          no-caps
          size="lg"
          class="cta-btn primary-cta"
          label="Explore Our Research"
          to="/research"
        />
        <q-btn
          outline
          no-caps
          size="lg"
          class="cta-btn secondary-cta"
          label="Get in Touch"
          href="mailto:link@trivector.ai"
          icon-right="mail"
        />
      </div>

      <!-- Trust Indicators -->
      <div class="trust-indicators" data-aos="fade-up" data-aos-delay="600">
        <span class="trust-text">Pioneering AI Research & Innovation</span>
      </div>
    </div>

    <!-- Smooth Scroll Indicator -->
    <div 
      class="scroll-indicator" 
      :class="{ 'reduced-motion': prefersReducedMotion }"
      @click="scrollToContent"
    >
      <q-icon name="keyboard_arrow_down" size="32px" />
      <span class="scroll-text">Scroll to explore</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props
const props = defineProps({
  tagline: {
    type: String,
    default: 'Transforming AI capabilities into tangible business outcomes through cutting-edge research and innovation'
  }
})

// Reactive state
const prefersReducedMotion = ref(false)

// Check for reduced motion preference
const checkMotionPreference = () => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  
  // Listen for changes
  mediaQuery.addEventListener('change', (e) => {
    prefersReducedMotion.value = e.matches
  })
}

// Smooth scroll to next section
const scrollToContent = () => {
  const nextSection = document.querySelector('.hero-section').nextElementSibling
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Lifecycle hooks
onMounted(() => {
  checkMotionPreference()
})
</script>

<style lang="scss" scoped>
/* ============================================
   CSS VARIABLES - Customize here for theming
   ============================================ */
:root {
  --gradient-start: #0a0a1a;
  --gradient-mid: #1a0a2e;
  --gradient-end: #0f0f23;
  --accent-color: #00d9ff;
  --accent-glow: rgba(0, 217, 255, 0.3);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
}

/* ============================================
   HERO SECTION CONTAINER
   ============================================ */
.hero-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/hero-bg.jpeg') center/cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}

/* ============================================
   ANIMATED GRADIENT BACKGROUND
   ============================================ */
.gradient-bg {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #4facfe 75%,
    #00f2fe 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  will-change: background-position;
  opacity: 0.3;
  z-index: 2;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 100%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 0%;
  }
}

/* Disable animation for reduced motion */
.gradient-bg.reduced-motion {
  animation: none;
  background-position: 50% 50%;
}

/* ============================================
   CSS-ONLY PARTICLE EFFECT
   ============================================ */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  box-shadow: 
    0 0 10px var(--accent-glow),
    0 0 20px var(--accent-glow),
    0 0 30px var(--accent-glow);
  will-change: transform, opacity;
}

/* Particle positions and animations */
.particle-1 {
  top: 20%;
  left: 10%;
  animation: float1 8s ease-in-out infinite;
}

.particle-2 {
  top: 50%;
  left: 80%;
  animation: float2 10s ease-in-out infinite;
}

.particle-3 {
  top: 70%;
  left: 30%;
  animation: float3 12s ease-in-out infinite;
}

.particle-4 {
  top: 30%;
  left: 60%;
  animation: float4 9s ease-in-out infinite;
}

.particle-5 {
  top: 80%;
  left: 70%;
  animation: float5 11s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); opacity: 0.6; }
  50% { transform: translate(30px, -40px); opacity: 0.3; }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0); opacity: 0.5; }
  50% { transform: translate(-40px, 30px); opacity: 0.8; }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0); opacity: 0.7; }
  50% { transform: translate(20px, -30px); opacity: 0.4; }
}

@keyframes float4 {
  0%, 100% { transform: translate(0, 0); opacity: 0.6; }
  50% { transform: translate(-30px, -20px); opacity: 0.9; }
}

@keyframes float5 {
  0%, 100% { transform: translate(0, 0); opacity: 0.5; }
  50% { transform: translate(40px, 20px); opacity: 0.7; }
}

/* Disable particle animations for reduced motion */
.particles.reduced-motion .particle {
  animation: none;
  opacity: 0.3;
}

/* ============================================
   HERO CONTENT
   ============================================ */
.hero-content {
  position: relative;
  z-index: 3;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* ============================================
   BRANDING
   ============================================ */
.brand-container {
  margin-bottom: 1rem;
}

.brand-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 0 40px var(--accent-glow);
}

.brand-title .accent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================
   TAGLINE
   ============================================ */
.tagline {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: var(--text-secondary);
  max-width: 800px;
  line-height: 1.6;
  margin: 0;
}

/* ============================================
   CTA CONTAINER
   ============================================ */
.cta-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-btn {
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary-cta {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  }
}

.secondary-cta {
  border: 2px solid #00bcd4;
  color: #00bcd4;

  &:hover {
    background: rgba(0, 188, 212, 0.1);
    transform: translateY(-3px);
  }
}

/* ============================================
   TRUST INDICATORS
   ============================================ */
.trust-indicators {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.trust-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trust-text::before {
  content: '✓';
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1.2rem;
}

/* ============================================
   SCROLL INDICATOR
   ============================================ */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  z-index: 10;
  animation: bounce 2s ease-in-out infinite;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-color);
  }
}

.scroll-text {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}

.scroll-indicator.reduced-motion {
  animation: none;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .hero-content {
    padding: 1rem;
    gap: 1.5rem;
  }

  .cta-container {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .cta-btn {
    width: 100%;
  }

  .scroll-indicator {
    bottom: 1rem;
  }
}

/* ============================================
   ACCESSIBILITY - REDUCED MOTION
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .gradient-bg,
  .particle,
  .scroll-indicator,
  .cta-btn {
    animation: none !important;
    transition: none !important;
  }

  .cta-btn:hover {
    transform: none;
  }
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */
.gradient-bg,
.particle,
.scroll-indicator {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Force GPU acceleration */
.hero-section * {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

