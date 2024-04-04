// https://nuxt.com/docs/api/configuration/nuxt-config

// google stream_id = '7813857982'
// google measurement id = G-GHD0MMW7FD
// const GOOGLE_ANALYTICS_ID = 'G-GHD0MMW7FD'

export default defineNuxtConfig({
  app: {
    head: {
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-GHD0MMW7FD', async: true },
        { src: 'js/ga.js' }
    ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet' },
      ],
    },
  },
  css: ['~/assets/css/bulma.css'],
  // modules: [
  //   '@nuxtjs/google-analytics'
  // ],
  // googleAnalytics: {
  //   id: GOOGLE_ANALYTICS_ID,
  // },
  // publicRuntimeConfig: {
  //   googleAnalytics: {
  //     id: GOOGLE_ANALYTICS_ID
  //   }
  // },
  devtools: { enabled: true },
})
