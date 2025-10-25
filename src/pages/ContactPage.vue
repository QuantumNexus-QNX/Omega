<template>
  <q-page class="contact-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title" data-aos="fade-up">Get in Touch</h1>
        <p class="page-subtitle" data-aos="fade-up" data-aos-delay="100">
          Let's discuss how we can help you achieve your AI goals
        </p>
      </div>
    </section>

    <section class="contact-section q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-6" data-aos="fade-right">
            <h2 class="section-heading">Contact Information</h2>
            <p class="contact-intro">
              We're here to answer your questions and discuss how TriVector.ai can help transform your business with cutting-edge AI solutions.
            </p>

            <div class="contact-methods">
              <div class="contact-method">
                <q-icon name="mail" size="2rem" class="method-icon" />
                <div class="method-content">
                  <h4 class="method-title">Email</h4>
                  <a href="mailto:link@trivector.ai" class="method-link">
                    link@trivector.ai
                  </a>
                </div>
              </div>

              <div class="contact-method">
                <q-icon name="schedule" size="2rem" class="method-icon" />
                <div class="method-content">
                  <h4 class="method-title">Response Time</h4>
                  <p class="method-text">We typically respond within 24 hours</p>
                </div>
              </div>

              <div class="contact-method">
                <q-icon name="language" size="2rem" class="method-icon" />
                <div class="method-content">
                  <h4 class="method-title">Global Reach</h4>
                  <p class="method-text">Serving clients worldwide</p>
                </div>
              </div>
            </div>

            <div class="cta-card q-mt-xl">
              <h3 class="cta-title">Ready to start?</h3>
              <p class="cta-text">Send us an email and let's begin the conversation</p>
              <q-btn
                size="lg"
                unelevated
                class="cta-btn"
                label="Send Email"
                href="mailto:link@trivector.ai"
                icon-right="arrow_forward"
              />
            </div>
          </div>

          <div class="col-12 col-md-6" data-aos="fade-left">
            <div class="info-card">
              <h3 class="info-title">What to Include in Your Message</h3>
              <div class="info-list">
                <div class="info-item">
                  <q-icon name="check_circle" class="info-icon" />
                  <div>
                    <h4 class="info-item-title">Your Business Challenge</h4>
                    <p class="info-item-text">
                      Describe the problem you're trying to solve or the opportunity you want to explore
                    </p>
                  </div>
                </div>

                <div class="info-item">
                  <q-icon name="check_circle" class="info-icon" />
                  <div>
                    <h4 class="info-item-title">Project Timeline</h4>
                    <p class="info-item-text">
                      Let us know your expected timeline and any critical deadlines
                    </p>
                  </div>
                </div>

                <div class="info-item">
                  <q-icon name="check_circle" class="info-icon" />
                  <div>
                    <h4 class="info-item-title">Current Infrastructure</h4>
                    <p class="info-item-text">
                      Share details about your existing systems and data landscape
                    </p>
                  </div>
                </div>

                <div class="info-item">
                  <q-icon name="check_circle" class="info-icon" />
                  <div>
                    <h4 class="info-item-title">Budget & Resources</h4>
                    <p class="info-item-text">
                      Provide an overview of your budget range and available resources
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-card q-mt-lg">
              <h3 class="faq-title">Quick Questions?</h3>
              <p class="faq-text">
                Check out our <router-link to="/about" class="faq-link">About page</router-link> to learn more about our mission and values, or visit our <router-link to="/services" class="faq-link">Services page</router-link> to explore our offerings.
              </p>
            </div>
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

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  })
})
</script>

<style lang="scss" scoped>
.contact-page {
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
}

.page-hero {
  background: linear-gradient(135deg, #764ba2 0%, #00bcd4 100%);
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

.contact-section {
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
  margin-bottom: 1.5rem;
}

.contact-intro {
  font-size: 1.1rem;
  color: #d0d0d0;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-method {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.method-icon {
  color: #00bcd4;
}

.method-content {
  flex: 1;
}

.method-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.method-link {
  color: #00bcd4;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #4facfe;
    text-decoration: underline;
  }
}

.method-text {
  color: #b0b0b0;
  margin: 0;
}

.cta-card {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 2rem;
}

.cta-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.cta-text {
  color: #b0b0b0;
  margin-bottom: 1.5rem;
}

.cta-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  }
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-icon {
  color: #00bcd4;
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.info-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.info-item-text {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0;
}

.faq-card {
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.faq-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
}

.faq-text {
  color: #d0d0d0;
  line-height: 1.6;
  margin: 0;
}

.faq-link {
  color: #00bcd4;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #4facfe;
    text-decoration: underline;
  }
}
</style>

