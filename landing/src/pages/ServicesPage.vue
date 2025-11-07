<template>
  <q-page class="services-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title" data-aos="fade-up">Our Services</h1>
        <p class="page-subtitle" data-aos="fade-up" data-aos-delay="100">
          Enterprise AI solutions tailored to your needs
        </p>
      </div>
    </section>

    <section class="services-section q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-xl">
          <div
            v-for="(service, index) in services"
            :key="index"
            class="col-12 col-md-6"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <q-card class="service-card" flat>
              <q-card-section>
                <div class="service-header">
                  <q-icon :name="service.icon" size="3.5rem" class="service-icon" />
                  <h3 class="service-title">{{ service.title }}</h3>
                </div>
                <p class="service-description">{{ service.description }}</p>
                <div class="service-features">
                  <div
                    v-for="feature in service.features"
                    :key="feature"
                    class="feature-item"
                  >
                    <q-icon name="check_circle" size="1.2rem" class="feature-check" />
                    <span>{{ feature }}</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <section class="process-section q-py-xl">
      <div class="container">
        <h2 class="section-heading text-center q-mb-xl" data-aos="fade-up">Our Process</h2>
        <div class="process-timeline">
          <div
            v-for="(step, index) in processSteps"
            :key="index"
            class="process-step"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section q-py-xl">
      <div class="container text-center" data-aos="fade-up">
        <h2 class="text-h3 text-white q-mb-md">Ready to Get Started?</h2>
        <p class="text-h6 text-grey-4 q-mb-xl">
          Let's discuss how we can help transform your business with AI
        </p>
        <q-btn
          size="lg"
          unelevated
          class="cta-btn"
          label="Contact Our Team"
          href="mailto:link@trivector.ai"
          icon-right="mail"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const services = [
  {
    icon: 'model_training',
    title: 'Custom AI Model Development',
    description: 'We design and train bespoke AI models tailored to your specific business requirements and data characteristics.',
    features: [
      'End-to-end model development',
      'Domain-specific optimization',
      'Performance benchmarking',
      'Continuous model improvement'
    ]
  },
  {
    icon: 'integration_instructions',
    title: 'AI Integration & Deployment',
    description: 'Seamlessly integrate AI capabilities into your existing systems with our expert deployment and integration services.',
    features: [
      'API development & integration',
      'Cloud & on-premise deployment',
      'Scalability optimization',
      'Monitoring & maintenance'
    ]
  },
  {
    icon: 'school',
    title: 'AI Consulting & Strategy',
    description: 'Strategic guidance to help you navigate the AI landscape and identify high-impact opportunities for your organization.',
    features: [
      'AI readiness assessment',
      'Use case identification',
      'Technology stack selection',
      'ROI analysis & planning'
    ]
  },
  {
    icon: 'storage',
    title: 'Data Engineering & MLOps',
    description: 'Build robust data pipelines and MLOps infrastructure to support your AI initiatives at scale.',
    features: [
      'Data pipeline development',
      'Feature engineering',
      'Model versioning & tracking',
      'Automated training & deployment'
    ]
  }
]

const processSteps = [
  {
    title: 'Discovery & Assessment',
    description: 'We begin by understanding your business goals, challenges, and data landscape to identify the best AI opportunities.'
  },
  {
    title: 'Solution Design',
    description: 'Our team designs a tailored AI solution architecture that aligns with your technical requirements and business objectives.'
  },
  {
    title: 'Development & Training',
    description: 'We build and train AI models using cutting-edge techniques, ensuring optimal performance and accuracy.'
  },
  {
    title: 'Deployment & Integration',
    description: 'We deploy the solution into your production environment with seamless integration and minimal disruption.'
  },
  {
    title: 'Monitoring & Optimization',
    description: 'Continuous monitoring and optimization ensure your AI systems deliver consistent value and adapt to changing needs.'
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
.services-page {
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
}

.page-hero {
  background: linear-gradient(135deg, #00bcd4 0%, #667eea 100%);
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

.services-section {
  background: #0f0f0f;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    border-color: #00bcd4;
    box-shadow: 0 12px 32px rgba(0, 188, 212, 0.3);
  }
}

.service-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.service-icon {
  color: #00bcd4;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.service-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #d0d0d0;
}

.feature-check {
  color: #00bcd4;
}

.process-section {
  background: #0a0a0a;
}

.section-heading {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  color: white;
}

.process-timeline {
  max-width: 800px;
  margin: 0 auto;
}

.process-step {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 2rem;
    top: 4rem;
    width: 2px;
    height: calc(100% + 1rem);
    background: linear-gradient(180deg, #667eea 0%, #00bcd4 100%);
  }
}

.step-number {
  min-width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #00bcd4 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.step-content {
  flex: 1;
  padding-top: 0.5rem;
}

.step-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #b0b0b0;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cta-btn {
  background: white;
  color: #667eea;
  font-weight: 600;
  text-transform: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
  }
}
</style>

