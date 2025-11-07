<template>
  <q-page class="about-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title" data-aos="fade-up">About TriVector.ai</h1>
        <p class="page-subtitle" data-aos="fade-up" data-aos-delay="100">
          Shaping the future of artificial intelligence
        </p>
      </div>
    </section>

    <section class="content-section q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-6" data-aos="fade-right">
            <h2 class="section-heading">Our Mission</h2>
            <p class="content-text">
              At TriVector.ai, we are dedicated to advancing the frontiers of artificial intelligence through rigorous research, innovative development, and practical applications. Our mission is to create AI solutions that not only push technological boundaries but also deliver tangible value to businesses and society.
            </p>
            <p class="content-text">
              We believe in the transformative power of AI to solve complex problems, enhance decision-making, and unlock new possibilities across industries. Our multidisciplinary team combines expertise in machine learning, data science, and software engineering to deliver cutting-edge solutions.
            </p>
          </div>
          <div class="col-12 col-md-6" data-aos="fade-left">
            <div class="stats-grid">
              <div class="stat-card" v-for="stat in stats" :key="stat.label">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section q-py-xl">
      <div class="container">
        <h2 class="section-heading text-center q-mb-xl" data-aos="fade-up">Our Values</h2>
        <div class="row q-col-gutter-lg">
          <div
            v-for="(value, index) in values"
            :key="index"
            class="col-12 col-md-4"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <q-card class="value-card" flat>
              <q-card-section>
                <q-icon :name="value.icon" size="2.5rem" class="value-icon" />
                <h3 class="value-title">{{ value.title }}</h3>
                <p class="value-description">{{ value.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const stats = [
  { value: '50+', label: 'AI Models Deployed' },
  { value: '100+', label: 'Research Papers' },
  { value: '25+', label: 'Industry Partners' },
  { value: '99.9%', label: 'System Uptime' }
]

const values = [
  {
    icon: 'science',
    title: 'Innovation First',
    description: 'We constantly push boundaries and explore new frontiers in AI research and development.'
  },
  {
    icon: 'verified',
    title: 'Integrity & Ethics',
    description: 'We are committed to responsible AI development with transparency and ethical considerations at our core.'
  },
  {
    icon: 'groups',
    title: 'Collaboration',
    description: 'We believe in the power of teamwork and partnerships to achieve breakthrough results.'
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
.about-page {
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
}

.page-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8rem 1rem 4rem;
  text-align: center;
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: rgba(255, 255, 255, 0.9);
}

.content-section {
  background: #0f0f0f;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-heading {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}

.content-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #d0d0d0;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #667eea;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.values-section {
  background: #0a0a0a;
}

.value-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #00bcd4;
    box-shadow: 0 8px 24px rgba(0, 188, 212, 0.3);
  }
}

.value-icon {
  color: #00bcd4;
  margin-bottom: 1rem;
}

.value-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.value-description {
  color: #b0b0b0;
  line-height: 1.6;
}
</style>

