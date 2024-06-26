<script setup>
const { data, pending } = await useFetch('/api/products')

const sortBy = ref('pointsPerDollar')
const sortDesc = ref(false)
const currentFilter = ref(null)

const sortedProducts = computed(() => {
  let filteredProducts = data.value
  if (currentFilter.value) {

    if (currentFilter.value === 'On Sale + Bonus Points') {
      filteredProducts = data.value.filter(product => product.price !== product.originalPrice)
    } else {
      filteredProducts = data.value.filter(product => product.categories.includes(currentFilter.value))
    }
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
  filters.unshift('On Sale + Bonus Points')

const formatDate = (string) => {
  const date = new Date(string)
  const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
  return formattedDate
}
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
      <h1 class="title has-text-centered">
        LCBO Aeroplan Points&nbsp;Booster
      </h1>
        
      <div class="level is-align-items-flex-end">
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
            <span v-if="product.originalPrice !== product.price" class="tag">
              Bonus Points + Save ${{ Math.round((product.originalPrice - product.price) * 100) / 100 }}
            </span>
            <h3 class="list-item-title">{{ product.title }}</h3>
            <p class="list-item-description">

              <span v-if="product.originalPrice !== product.price">
                <span>${{ product.price }}</span>
                <span class="pts" style="text-decoration: line-through; font-weight: 100;">${{ product.originalPrice }}</span> /
              </span>
              <span v-else>
                ${{ product.price }} / 
              </span>
              <span class="has-text-red">
                {{ product.points }}
                <span class="pts">pts</span>
              </span>
            </p>
            <a :href="product.url" target="_blank" class="help">
              <span>View LCBO product</span>
              <span class="icon is-small" style="position: relative; top: 2px; left: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                  <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                  <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                </svg>
              </span>
            </a>
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
  font: normal 300 36px Open Sans;
  color: #000;
}

.has-text-red {
  color: rgb(220 38 38);
}

.help {
  color: #707070;
  font-weight: 700;
  margin-top: -5px;
}

span.pts {
  font-size: .7em;
  vertical-align: super;
}

.title span.pts {
  font-size: .4em;
  margin-left: 5px;
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
  padding: 9px 30px;
  text-decoration: underline;
}

@media only screen and (max-width: 768px) {
  .button {
    width: 100%;
  }
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

.field, .select, select {
  width: 100%;
}
.field:not(:last-child) {
  margin-bottom: 0;
}

.tag {
  margin-right: auto;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: .12px;
  color: #222;
  background: #f0ccc9;
}
</style>