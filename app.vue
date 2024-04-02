<script setup>
// import cheerio from 'cheerio'

// const { data } = await useFetch('http://lcbostats.com/api/alcohol')
// const { data } = await useFetch('https://www.lcbo.com/en/products#t=clp-products&sort=relevancy&layout=card&f:@lcbo_current_offer=[Aeroplan%20Offers]')
const { data } = await useFetch('https://www.lcbo.com/en/products')
// const { data } = await useFetch('/api/scrape')

// const { response } = useScrape("/api/scrape/github")

// const { data } = await useFetch('/api/scrape/github')

console.log('data', data.value)

const pass = data.value.search('accessToken')
console.log('pass', pass)

// const $ = cheerio.load(data.value)
// console.log('$', $)


const tempFunc = async() => {
  // const data = await $fetch('https://www.lcbo.com/en/products#t=clp-products&sort=relevancy&layout=card&f:@lcbo_current_offer=[Aeroplan%20Offers]')

  // const $ = cheerio.load(html)
  // console.log('$', $)

  var customerGroupId = "0";
  const advancedExpression = '(@ec_visibility==(3,4)) (@cp_browsing_category_deny<>' + customerGroupId + ')';

  var test3 = {
    // "searchHub": isEmptyQuery
    "searchHub": ""
                ? "Rec - SearchBox - Products"
                : "Web_Main_Search_EN",
            'numberOfResults': 4,
            'locale': 'en-CA',
            'context': {
                'website': 'lcbo',
                'siteName': 'LCBO',
                'language': 'en'
            },
            // "q": q
            "q": "",
            "tab": "Products",
            "cq": '@source=="' + "Products" + "EN" + '"' + advancedExpression,
        };

  const data = await $fetch('https://platform.cloud.coveo.com/rest/search/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'xx883b5583-07fb-416b-874b-77cce565d927'
    },
    body: JSON.stringify(test3)
  })
  console.log('data', data)
}

tempFunc()
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        LCBO Aeroplan Scraper
      </h1>

      <!-- <div v-html="data" /> -->
    </div>
  </section>
</template>