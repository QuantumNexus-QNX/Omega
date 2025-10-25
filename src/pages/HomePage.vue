<template>
  <q-page class="home-page">
    <!-- Hero Section with Animated Gradient -->
    <section class="hero-section">
      <div class="gradient-overlay"></div>
      <div class="hero-content">
        <div class="hero-text" data-aos="fade-up">
          <h1 class="hero-title">
            Welcome to <span class="gradient-text">TriVector</span><span class="text-cyan">.ai</span>
          </h1>
          <p class="hero-subtitle">
            Pioneering the future of artificial intelligence through cutting-edge research and innovative solutions
          </p>
          <div class="hero-actions q-mt-xl">
            <q-btn
              size="lg"
              unelevated
              class="cta-btn primary-cta"
              label="Explore Our Research"
              to="/research"
            />
            <q-btn
              size="lg"
              outline
              class="cta-btn secondary-cta q-ml-md"
              label="Get in Touch"
              href="mailto:link@trivector.ai"
            />
          </div>
        </div>
      </div>
      <div class="scroll-indicator">
        <q-icon name="keyboard_arrow_down" size="2rem" class="bounce" />
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section q-py-xl" data-aos="fade-up">
      <div class="container">
        <h2 class="section-title text-center q-mb-xl">Our Core Capabilities</h2>
        <div class="row q-col-gutter-lg">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="col-12 col-md-4"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <q-card class="feature-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon :name="feature.icon" size="3rem" class="feature-icon" />
                <h3 class="feature-title q-mt-md">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section q-py-xl" data-aos="fade-up">
      <div class="container text-center">
        <h2 class="text-h3 text-white q-mb-md">Ready to Transform Your Business?</h2>
        <p class="text-h6 text-grey-4 q-mb-xl">
          Let's discuss how TriVector.ai can help you achieve your AI goals
        </p>
        <q-btn
          size="xl"
          unelevated
          class="cta-btn primary-cta"
          label="Contact Us"
          href="mailto:link@trivector.ai"
          icon-right="arrow_forward"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const features = [
  {
    icon: 'psychology',
    title: 'Advanced AI Research',
    description: 'Pushing the boundaries of machine learning and neural networks with groundbreaking research initiatives.'
  },
  {
    icon: 'analytics',
    title: 'Data Intelligence',
    description: 'Transform raw data into actionable insights using state-of-the-art AI algorithms and analytics.'
  },
  {
    icon: 'rocket_launch',
    title: 'Scalable Solutions',
    description: 'Enterprise-grade AI solutions designed to scale with your business needs and growth trajectory.'
  }
]

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  })
})
</script>

<style lang="scss" scoped>
.home-page {
  background: #0a0a0a;
  color: white;
}

.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: url('/hero-bg.jpeg') center/cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 2rem;
  max-width: 1000px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
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

.hero-actions {
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

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: white;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.features-section {
  background: #0f0f0f;
  padding: 6rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: white;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem 1rem;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    border-color: #667eea;
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
  }
}

.feature-icon {
  color: #667eea;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: #b0b0b0;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 6rem 1rem;
}
</style>

