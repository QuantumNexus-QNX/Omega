<template>
  <router-view />
</template>

<script setup>
import { useQuasar, useMeta } from 'quasar'

const $q = useQuasar()

// Set dark mode
$q.dark.set(true)

// SEO Meta tags
useMeta({
  title: 'TriVector.ai - Pioneering AI Research & Innovation',
  titleTemplate: title => `${title}`,
  meta: {
    description: {
      name: 'description',
      content: 'TriVector.ai is a leading AI research and development company specializing in cutting-edge machine learning solutions, neural networks, and enterprise AI services.'
    },
    keywords: {
      name: 'keywords',
      content: 'AI, artificial intelligence, machine learning, deep learning, neural networks, AI research, AI services, enterprise AI, data science'
    },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8'
    },
    ogTitle: {
      property: 'og:title',
      content: 'TriVector.ai - Pioneering AI Research & Innovation'
    },
    ogDescription: {
      property: 'og:description',
      content: 'Leading AI research and development company specializing in cutting-edge machine learning solutions and enterprise AI services.'
    },
    ogImage: {
      property: 'og:image',
      content: '/hero-bg.jpeg'
    },
    ogUrl: {
      property: 'og:url',
      content: 'https://trivector.ai'
    },
    ogType: {
      property: 'og:type',
      content: 'website'
    },
    twitterCard: {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    twitterTitle: {
      name: 'twitter:title',
      content: 'TriVector.ai - Pioneering AI Research & Innovation'
    },
    twitterDescription: {
      name: 'twitter:description',
      content: 'Leading AI research and development company specializing in cutting-edge machine learning solutions.'
    },
    viewport: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    }
  },
  link: {
    canonical: {
      rel: 'canonical',
      href: 'https://trivector.ai'
    }
  }
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0a0a0a;
  color: white;
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;

  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
}

// Accessibility improvements
a:focus,
button:focus {
  outline: 2px solid #00bcd4;
  outline-offset: 2px;
}

// Responsive typography
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
}

p {
  line-height: 1.6;
}

// Utility classes
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

