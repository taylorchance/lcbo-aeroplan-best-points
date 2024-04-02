<script setup>
import cheerio from 'cheerio'

// const { data } = await useFetch('http://lcbostats.com/api/alcohol')
const { data } = await useFetch('https://www.lcbo.com/en/products#t=clp-products&sort=relevancy&layout=card&f:@lcbo_current_offer=[Aeroplan%20Offers]')
// console.log('data', data.value)

// const $ = cheerio.load(data.value)
// console.log('$', $)


// async function tempFunc() {
//   const data = await $fetch('https://www.lcbo.com/en/products#t=clp-products&sort=relevancy&layout=card&f:@lcbo_current_offer=[Aeroplan%20Offers]')

//   const $ = cheerio.load(html)
//   console.log('$', $)
// }

// tempFunc()
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        LCBO Aeroplan Scraper
      </h1>

      <div v-html="data" />
    </div>
  </section>
</template>