<script setup>
const { data, pending } = await useFetch('/api/products')

const sortBy = ref('pointsPerDollar')
const sortDesc = ref(false)
const currentFilter = ref(null)

const sortedProducts = computed(() => {
  let filteredProducts = data.value
  if (currentFilter.value) {
    filteredProducts = data.value.filter(product => product.categories.includes(currentFilter.value))
  }

  return filteredProducts.sort((a, b) => {
    let aVal, bVal
    if (sortBy.value === 'pointsPerDollar') {
      aVal = a.points / a.price
      bVal = b.points / b.price
    } else if (sortBy.value === 'price') {
      aVal = a.price
      bVal = b.price
    } else if (sortBy.value === 'aeroplanPoints') {
      aVal = a.points
      bVal = b.points
    }
    return sortDesc.value ? aVal - bVal : bVal - aVal
  })
})

const categoryCounts = data.value.reduce((acc, product) => {    
  product.categories.forEach(category => {      
    acc[category] = (acc[category] || 0) + 1
  })
  return acc
}, [])

const filters = Object
  .entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .map(entry => entry[0])

const formatDate = (string) => {
  const date = new Date(string)
  const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
  return formattedDate
}

const superProduct = ref(null)
</script>

<template>
  <div class="top-banner-ae"></div>
  
  <section class="ae-content">
    <div v-if="pending" class="hero is-fullheight">
      <div class="hero-body is-justify-content-center">
        <div class="loader is-loading is-size-1"></div>
        </div>
    </div>

    <div v-else-if="data" class="container">
      <h1 class="title mb-0">
        LCBO Aeroplan Points Maximizer
      </h1>
        
      <div class="level">
        <div class="field">
          <label class="label">Filters</label>
          <div class="control">
            <div class="select">
              <select v-model="currentFilter" >
                <option :value="null">Select filter</option>
                <option
                  v-for="filter in filters"
                  :key="filter"
                  :value="filter"
                >
                  {{ filter }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Sort by</label>
          <div class="control">
            <div class="select">
              <select v-model="sortBy">
                <option>Select sort</option>
                <option value="price">
                  Price
                </option>
                <option value="aeroplanPoints">
                  Points
                </option>
                <option value="pointsPerDollar">
                  Ratio
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Sort order</label>
          <div class="control">
            <div class="select">
              <select v-model="sortDesc">
                <option :value="true">
                  Descending
                </option>
                <option :value="false">
                  Ascending
                </option>
              </select>
            </div>
          </div>
        </div>

        <button v-if="currentFilter" class="button" @click="currentFilter = null">
          Clear filter
        </button>
      </div>

      <div class="list has-visible-pointer-controls has-hoverable-list-items has-overflow-ellipsis">
        <div v-for="product in sortedProducts" :key="product.id" class="list-item">
          <div class="list-item-image">
            <figure class="image is-64x64">
              <img class="is-rounded" :src="product.image">
            </figure>
          </div>

          <div class="list-item-content">
            <h3 class="list-item-title">{{ product.title }}</h3>
            
            <!-- <div class="is-flex my-1"> -->
            <div class="level mb-0 is-justify-content-flex-start is-align-items-flex-start" style="gap: 0;">
              <p class="list-item-description">
                ${{ product.price }}
              </p>
              <p class="has-text-weight-light">
                <span class="is-hidden-mobile">&nbsp;/&nbsp;</span>{{ product.points }}
                <span class="pts">pts</span>
                <span class="is-hidden-mobile">&nbsp;/&nbsp;</span>
              </p>

              <p class="has-text-weight-light has-text-success is-flex is-clickable" @click="superProduct = product">
                {{ Math.floor(product.points + (product.price * 5) + (product.price / 4)) }}
                <div class="has-text-success is-size-7 has-text-weight-light ml-1" style="line-height: 10px; margin: 1px;">
                  <p>super pts</p>
                  <p class="has-text-weight-bold">learn more</p>
                </div>
              </p>

              <!-- <div class="is-flex is-clickable" @click="superProduct = product">
                <span class="has-text-success">
                  {{ Math.floor(product.points + (product.price * 5) + (product.price / 4)) }}
                </span>
                <div class="has-text-success is-size-7 has-text-weight-light ml-1" style="line-height: 10px; margin: 1px;">
                  <p>super pts</p>
                  <p class="has-text-weight-bold">learn more</p>
                </div>
              </div> -->
            </div>

            <a :href="product.url" target="_blank" class="has-text-dark is-size-6">View LCBO product</a>
          </div>

          <div class="list-item-controls has-text-centered">
            <h3 class="title mb-0">
              <span style="letter-spacing: -3px;">{{ Math.round(product.points / product.price * 100) / 100 }}</span>
              <span class="pts">pts / <span style="font-weight: 600;">$</span></span>
            </h3>
            <p class="help">expires {{ formatDate(product.endDate) }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>

  <div v-if="superProduct" class="modal is-active">
    <div class="modal-background" @click="superProduct = null"></div>
    <div class="modal-content">


      <div v-if="superProduct === 2" class="box">
        <h3 class="title">
          How to Earn Super&nbsp;Points
        </h3>
        <p>
          The Amex Cobalt card is by far the best credit card in Canada to earn Aeroplan points on. You get a whopping 5 points per dollar spent at certain places. Amex points can easily be converted to Aeroplan points at a 1:1 ratio. While LCBO only gives you 1 Amex point /$ spent, if you go to a grocery store and buy an LCBO gift card, you would be earning the equivalent of 5 points / $ spent.
        </p>

        <a href="https://americanexpress.com/en-ca/referral/cobalt?ref=tAYLOCQrrH" target="_blank" class="button mt-5">
          Get Amex Cobalt Card
        </a>
      </div>

      <div v-else class="box">
        <h3 class="title">
          How to Earn Super&nbsp;Points
        </h3>
        <p>
          Thats right, if you follow this secret hack, you could earn {{ Math.floor(superProduct.points + (superProduct.price * 5) + (superProduct.price / 4)) }} points of just the single purchase of 1 {{ superProduct.title }}!
        </p>

        <button class="button mt-5" @click="superProduct = 2">
          Watch 15s video to learn more
        </button>
      </div>
    </div>
  </div>
</template>

<style>
body, #__nuxt {
  min-height: 100vh;
  -webkit-text-size-adjust: 100%;
  font-variant-ligatures: none;
  -webkit-font-variant-ligatures: none;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  overflow: hidden;
}

/* darkmode overrides */
body, #__nuxt, .select select {
  background-color: #fff;
  color: rgb(46, 51, 61);
}

.label {
  color: rgb(46, 51, 61);
}

.top-banner-ae {
  background-image: url('https://www.lcbo.com/content/dam/lcbo/corporate-pages/about/media-centre/corporate-news/mediaCentre-lcbo-aeroplan4.jpg.transform/lcbo-image-desktop-2x/image.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #000;
  height: 500px;
  margin-top: -200px;
}

.ae-content {
  background: #fff;
  padding: 4em;
  position: relative;
  margin: 0px auto;
  margin-top: -200px;
  width: calc(100% - 60px);
}

.title {
  color: #000;
  font: normal 300 36px Open Sans;
  line-height: 1;
}


.help {
  color: #707070;
  font-weight: 700;
  margin-top: -5px;
}

span.pts {
  font-weight: 300;
  font-size: .7em;
  margin-left: 3px;
  vertical-align: super;
}

.title span.pts {
  font-size: .4em;
}

.image img {
  display: block;
  height: 100%;
  width: auto;
}

.button {
  background: #005078;
  color: #fff;
  border-radius: 0;
  border: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.25px;
  padding: 12px 30px;
  text-decoration: underline;
}

.modal-content {
  max-width: 80vw;
  margin: auto;
}

@media only screen and (max-width: 1023px) {
  .ae-content {
    width: calc(100% - 30px);
    padding: 4em 2em;
    padding: 30px;
  }

  .list {
    margin-inline: -45px;
    max-width: 100vw;
    width: 100vw;
    background-color: #fff;
  }
}

@media only screen and (max-width: 768px) {
}

.field, .select, select {
  width: 100%;
}
.field:not(:last-child) {
  margin-bottom: 0;
}
</style>