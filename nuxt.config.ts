// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      title: 'LCBO Aeroplan points Booster',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet' },
      ],
      script: [
        { src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8464571483236197' },
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-GHD0MMW7FD' },
        { children: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-GHD0MMW7FD');` }
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'LCBO Aeroplan points Booster' },
        { name: 'google-adsense-account', content: 'ca-pub-8464571483236197' },
      ]
    },
  },
  css: ['~/assets/css/bulma.css', '~/assets/css/bulma-list.css'],
  devtools: { enabled: true },
})
