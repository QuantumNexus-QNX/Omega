<template>
  <q-page class="home-page">
    <!-- Enhanced Hero Section with Advanced Animations -->
    <HeroSection tagline="Pioneering the future of artificial intelligence through cutting-edge research and innovative solutions" />

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
import HeroSection from 'components/HeroSection.vue'

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

// Hero section styles moved to HeroSection.vue component

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

