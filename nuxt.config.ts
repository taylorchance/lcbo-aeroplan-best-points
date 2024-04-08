// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      title: 'LCBO Aeroplan points maximizer',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet' },
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'LCBO Aeroplan points maximizer' },
        { name: 'google-adsense-account', content: 'ca-pub-846457148323619' },
      ]
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
