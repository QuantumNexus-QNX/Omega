<template>
  <q-page class="riemann-page">
    <!-- Hero Section -->
    <section class="riemann-hero">
      <div class="gradient-overlay"></div>
      <div class="hero-content">
        <div class="hero-text" data-aos="fade-up">
          <h1 class="hero-title">
            <span class="gradient-text">Tri-Logic</span> Riemann Sphere
          </h1>
          <p class="hero-subtitle">
            Interactive visualization of three-valued logic on the Riemann sphere
          </p>
        </div>
      </div>
    </section>

    <!-- Visualization Section -->
    <section class="visualization-section q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <!-- Info Panel -->
          <div class="col-12 col-md-4" data-aos="fade-right">
            <q-card class="info-card" flat bordered>
              <q-card-section>
                <h3 class="text-h5 q-mb-md">About Tri-Logic</h3>
                <p class="text-body2 q-mb-md">
                  The Riemann sphere provides a natural geometric framework for visualizing 
                  three-valued logic systems, including Kleene's strong three-valued logic.
                </p>
                <q-separator class="q-my-md" />
                <h4 class="text-h6 q-mb-sm">Key Features</h4>
                <ul class="feature-list">
                  <li>Interactive 3D visualization</li>
                  <li>Real-time truth table computation</li>
                  <li>Kleene logic operations</li>
                  <li>Quantum state mapping</li>
                </ul>
              </q-card-section>
            </q-card>

            <q-card class="info-card q-mt-md" flat bordered>
              <q-card-section>
                <h4 class="text-h6 q-mb-sm">Truth Values</h4>
                <div class="truth-values">
                  <div class="truth-value">
                    <div class="value-indicator true"></div>
                    <span>True (1)</span>
                  </div>
                  <div class="truth-value">
                    <div class="value-indicator unknown"></div>
                    <span>Unknown (½)</span>
                  </div>
                  <div class="truth-value">
                    <div class="value-indicator false"></div>
                    <span>False (0)</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Visualization Embed -->
          <div class="col-12 col-md-8" data-aos="fade-left">
            <q-card class="visualization-card" flat bordered>
              <q-card-section>
                <div class="embed-notice">
                  <q-icon name="info" size="2rem" color="cyan" />
                  <h4 class="text-h6 q-mt-md">Interactive Visualization</h4>
                  <p class="text-body2 q-my-md">
                    The full interactive Riemann sphere visualizer is deployed separately 
                    as a Next.js application with Three.js 3D rendering.
                  </p>
                  <q-btn
                    unelevated
                    size="lg"
                    class="cta-btn primary-cta"
                    label="Launch Riemann Sphere Visualizer"
                    href="https://omega-main.vercel.app/trilogic"
                    target="_blank"
                    icon-right="open_in_new"
                  />
                  <p class="text-caption q-mt-md text-grey-6">
                    Opens in a new window
                  </p>
                </div>
              </q-card-section>
            </q-card>

            <!-- Educational Content -->
            <q-card class="info-card q-mt-md" flat bordered>
              <q-card-section>
                <h4 class="text-h6 q-mb-sm">Mathematical Foundation</h4>
                <p class="text-body2">
                  The Riemann sphere (ℂ ∪ {∞}) is the one-point compactification of the 
                  complex plane. In our tri-logic system, we map the three truth values 
                  to specific points on the sphere:
                </p>
                <ul class="math-list q-mt-md">
                  <li><strong>True (1)</strong> → North Pole (0, 0, 1)</li>
                  <li><strong>Unknown (½)</strong> → Equator (varies)</li>
                  <li><strong>False (0)</strong> → South Pole (0, 0, -1)</li>
                </ul>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Applications Section -->
    <section class="applications-section q-py-xl" data-aos="fade-up">
      <div class="container">
        <h2 class="section-title text-center q-mb-xl">Applications</h2>
        <div class="row q-col-gutter-lg">
          <div
            v-for="(app, index) in applications"
            :key="index"
            class="col-12 col-md-4"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <q-card class="app-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon :name="app.icon" size="3rem" class="app-icon" />
                <h3 class="app-title q-mt-md">{{ app.title }}</h3>
                <p class="app-description">{{ app.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section q-py-xl" data-aos="fade-up">
      <div class="container text-center">
        <h2 class="text-h3 text-white q-mb-md">Explore More Research</h2>
        <p class="text-h6 text-grey-4 q-mb-xl">
          Discover our other cutting-edge AI and quantum computing projects
        </p>
        <div class="cta-buttons">
          <q-btn
            size="lg"
            unelevated
            class="cta-btn primary-cta q-mr-md"
            label="View All Research"
            to="/research"
          />
          <q-btn
            size="lg"
            outline
            class="cta-btn secondary-cta"
            label="Contact Us"
            href="mailto:link@trivector.ai"
          />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const applications = [
  {
    icon: 'psychology',
    title: 'Quantum Computing',
    description: 'Modeling quantum superposition states using three-valued logic frameworks'
  },
  {
    icon: 'hub',
    title: 'Neural Networks',
    description: 'Uncertainty representation in AI decision-making systems'
  },
  {
    icon: 'science',
    title: 'Formal Verification',
    description: 'Software verification with partial information and unknown states'
  }
]

onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  })
})
</script>

<style lang="scss" scoped>
.riemann-page {
  background: #0a0a0a;
  color: white;
}

.riemann-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/hero-bg.jpeg') center/cover no-repeat;
    opacity: 0.2;
    z-index: 1;
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  opacity: 0.3;
  z-index: 2;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 2rem;
  max-width: 1000px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: #e0e0e0;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.visualization-section {
  background: #0f0f0f;
  padding: 6rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.info-card,
.visualization-card,
.app-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-5px);
  }
}

.feature-list,
.math-list {
  padding-left: 1.5rem;
  color: #e0e0e0;

  li {
    margin-bottom: 0.5rem;
  }
}

.truth-values {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.truth-value {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.value-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;

  &.true {
    background: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  &.unknown {
    background: #ff9800;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  }

  &.false {
    background: #f44336;
    box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
  }
}

.embed-notice {
  text-align: center;
  padding: 3rem 2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.applications-section {
  background: #0a0a0a;
  padding: 6rem 1rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-icon {
  color: #00bcd4;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.app-description {
  color: #b0b0b0;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #1a0a2e 0%, #0a0a1a 100%);
  padding: 6rem 1rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  font-weight: 600;
  text-transform: none;
  padding: 0.75rem 2rem;
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

@media (max-width: 768px) {
  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-btn {
    width: 100%;
  }
}
</style>

