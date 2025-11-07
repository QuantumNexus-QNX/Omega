<template>
  <q-page class="research-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title" data-aos="fade-up">Research & Innovation</h1>
        <p class="page-subtitle" data-aos="fade-up" data-aos-delay="100">
          Pioneering breakthroughs in artificial intelligence
        </p>
      </div>
    </section>

    <section class="research-areas-section q-py-xl">
      <div class="container">
        <h2 class="section-heading text-center q-mb-xl" data-aos="fade-up">Research Focus Areas</h2>
        <div class="row q-col-gutter-lg">
          <div
            v-for="(area, index) in researchAreas"
            :key="index"
            class="col-12 col-md-6"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <q-card class="research-card" flat>
              <q-card-section>
                <div class="research-icon-wrapper">
                  <q-icon :name="area.icon" size="3rem" class="research-icon" />
                </div>
                <h3 class="research-title">{{ area.title }}</h3>
                <p class="research-description">{{ area.description }}</p>
                <div class="research-tags">
                  <q-chip
                    v-for="tag in area.tags"
                    :key="tag"
                    size="sm"
                    class="research-tag"
                  >
                    {{ tag }}
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <section class="publications-section q-py-xl">
      <div class="container">
        <h2 class="section-heading text-center q-mb-xl" data-aos="fade-up">Recent Publications</h2>
        <div class="publications-list">
          <div
            v-for="(pub, index) in publications"
            :key="index"
            class="publication-item"
            data-aos="fade-up"
            :data-aos-delay="index * 50"
          >
            <div class="publication-year">{{ pub.year }}</div>
            <div class="publication-content">
              <h4 class="publication-title">{{ pub.title }}</h4>
              <p class="publication-authors">{{ pub.authors }}</p>
              <p class="publication-venue">{{ pub.venue }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section q-py-xl">
      <div class="container text-center" data-aos="fade-up">
        <h2 class="text-h3 text-white q-mb-md">Interested in Collaborating?</h2>
        <p class="text-h6 text-grey-4 q-mb-xl">
          We're always looking for research partners and talented individuals
        </p>
        <q-btn
          size="lg"
          unelevated
          class="cta-btn"
          label="Get in Touch"
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

const researchAreas = [
  {
    icon: 'hub',
    title: 'Neural Architecture Search',
    description: 'Automated discovery and optimization of neural network architectures for superior performance across diverse tasks.',
    tags: ['AutoML', 'Deep Learning', 'Optimization']
  },
  {
    icon: 'language',
    title: 'Natural Language Processing',
    description: 'Advanced language models and understanding systems that bridge the gap between human communication and machine intelligence.',
    tags: ['LLMs', 'Transformers', 'Semantics']
  },
  {
    icon: 'visibility',
    title: 'Computer Vision',
    description: 'Cutting-edge visual recognition and understanding systems for real-world applications and autonomous systems.',
    tags: ['Object Detection', 'Segmentation', 'GANs']
  },
  {
    icon: 'psychology_alt',
    title: 'Reinforcement Learning',
    description: 'Developing intelligent agents that learn optimal decision-making strategies through interaction with complex environments.',
    tags: ['Policy Optimization', 'Multi-Agent', 'Robotics']
  }
]

const publications = [
  {
    year: '2025',
    title: 'Adaptive Neural Architecture Optimization for Edge Computing',
    authors: 'Smith, J., Johnson, A., Williams, R.',
    venue: 'International Conference on Machine Learning (ICML)'
  },
  {
    year: '2024',
    title: 'Efficient Transformer Models for Low-Resource Languages',
    authors: 'Chen, L., Kumar, P., Anderson, M.',
    venue: 'Association for Computational Linguistics (ACL)'
  },
  {
    year: '2024',
    title: 'Multi-Modal Learning for Autonomous Navigation Systems',
    authors: 'Davis, K., Thompson, S., Martinez, C.',
    venue: 'Conference on Computer Vision and Pattern Recognition (CVPR)'
  },
  {
    year: '2023',
    title: 'Hierarchical Reinforcement Learning in Complex Environments',
    authors: 'Wilson, T., Brown, E., Garcia, F.',
    venue: 'Neural Information Processing Systems (NeurIPS)'
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
.research-page {
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
}

.page-hero {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
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

.research-areas-section {
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
  color: white;
}

.research-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    border-color: #764ba2;
    box-shadow: 0 12px 32px rgba(118, 75, 162, 0.3);
  }
}

.research-icon-wrapper {
  margin-bottom: 1rem;
}

.research-icon {
  color: #764ba2;
}

.research-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.research-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.research-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.research-tag {
  background: rgba(118, 75, 162, 0.2);
  color: #c4b5fd;
  border: 1px solid rgba(118, 75, 162, 0.4);
}

.publications-section {
  background: #0a0a0a;
}

.publications-list {
  max-width: 900px;
  margin: 0 auto;
}

.publication-item {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(8px);
    border-color: #00bcd4;
    box-shadow: 0 8px 24px rgba(0, 188, 212, 0.2);
  }
}

.publication-year {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00bcd4;
  min-width: 80px;
}

.publication-content {
  flex: 1;
}

.publication-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.publication-authors {
  color: #b0b0b0;
  margin-bottom: 0.25rem;
}

.publication-venue {
  color: #667eea;
  font-style: italic;
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

