// https://nuxt.com/docs/api/configuration/nuxt-config

// google stream_id = '7813857982'
// google measurement id = G-GHD0MMW7FD
// const GOOGLE_ANALYTICS_ID = 'G-GHD0MMW7FD'

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

  runtimeConfig: {
    public: {
      gtagId: 'G-GHD0MMW7FD',
    }
  },
  devtools: { enabled: true },
})
