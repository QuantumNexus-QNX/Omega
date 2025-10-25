<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark header-transparent">
      <q-toolbar>
        <q-toolbar-title class="logo-title">
          <router-link to="/" class="logo-link">
            TriVector<span class="text-cyan">.ai</span>
          </router-link>
        </q-toolbar-title>

        <q-space />

        <!-- Desktop Navigation -->
        <div class="desktop-nav gt-sm">
          <q-btn
            v-for="link in navLinks"
            :key="link.name"
            :to="link.route"
            flat
            :label="link.label"
            class="nav-btn"
          />
          <q-btn
            flat
            label="Contact"
            href="mailto:link@trivector.ai"
            icon-right="mail"
            class="nav-btn contact-btn"
          />
        </div>

        <!-- Mobile Menu Button -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="drawer = !drawer"
        />
      </q-toolbar>
    </q-header>

    <!-- Mobile Drawer -->
    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      behavior="mobile"
      class="bg-dark"
    >
      <q-list>
        <q-item
          v-for="link in navLinks"
          :key="link.name"
          :to="link.route"
          clickable
          v-ripple
          @click="drawer = false"
        >
          <q-item-section>
            <q-item-label class="text-white">{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          href="mailto:link@trivector.ai"
        >
          <q-item-section>
            <q-item-label class="text-cyan">Contact Us</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-white">
      <div class="footer-content q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-h6">TriVector<span class="text-cyan">.ai</span></div>
            <p class="text-grey-6">Advancing AI research and innovation</p>
          </div>
          <div class="col-12 col-md-6 text-right">
            <q-btn
              flat
              round
              icon="mail"
              href="mailto:link@trivector.ai"
              class="text-cyan"
            />
            <p class="text-grey-6 q-mt-sm">© 2025 TriVector AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)

const navLinks = [
  { name: 'home', label: 'Home', route: '/' },
  { name: 'about', label: 'About', route: '/about' },
  { name: 'research', label: 'Research', route: '/research' },
  { name: 'services', label: 'Services', route: '/services' }
]
</script>

<style lang="scss" scoped>
.header-transparent {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-link {
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.desktop-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  font-weight: 500;
  text-transform: none;
  transition: all 0.3s ease;

  &:hover {
    color: #00bcd4;
  }
}

.contact-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

