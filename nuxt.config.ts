// https://nuxt.com/docs/api/configuration/nuxt-config

// google stream_id = '7811025791'
// google measurement id = G-VPSEDVDH2C
const GOOGLE_ANALYTICS_ID = 'G-VPSEDVDH2C'

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet' },
      ],
    },
  },
  css: ['~/assets/css/bulma.css'],
  modules: [
    '@nuxtjs/google-analytics'
  ],
  googleAnalytics: {
    id: GOOGLE_ANALYTICS_ID,
  },
  publicRuntimeConfig: {
    googleAnalytics: {
      id: GOOGLE_ANALYTICS_ID
    }
  },
  devtools: { enabled: true },
})
