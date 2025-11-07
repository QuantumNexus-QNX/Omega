const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'about', name: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'research', name: 'research', component: () => import('pages/ResearchPage.vue') },
      { path: 'services', name: 'services', component: () => import('pages/ServicesPage.vue') },
      { path: 'contact', name: 'contact', component: () => import('pages/ContactPage.vue') },
      { path: 'riemann-sphere', name: 'riemann-sphere', component: () => import('pages/RiemannSpherePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
