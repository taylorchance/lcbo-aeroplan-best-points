// https://nuxt.com/docs/api/configuration/nuxt-config

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
  css: ['~/assets/css/bulma.css', '~/assets/css/bulma-list.css'],

  runtimeConfig: {
    public: {
      gtagId: process.env.GOOGLE_ANALYTICS_ID,
    }
  },
  devtools: { enabled: true },
})
