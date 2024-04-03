<script setup>
const { data, pending } = await useFetch('/api/products')
console.log('data.value', data.value)

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
      aVal = a.raw.ec_price
      bVal = b.raw.ec_price
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
  .filter(entry => entry[1] > 2)
  .sort((a, b) => b[1] - a[1])
  .map(entry => entry[0])

const formatDate = (string) => {
  const date = new Date(string)
  const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
  return formattedDate
}
</script>

<template>
  <section class="section">
    <div v-if="pending" class="hero is-fullheight">
      <div class="hero-body is-justify-content-center">
        <div class="loader is-loading is-size-1"></div>
        </div>
    </div>

    <div v-else-if="data" class="container">
      <div class="level">
        <h1 class="title mb-0">
          LCBO Aeroplan Points Maximizer
        </h1>
        <button v-if="currentFilter" class="button" @click="currentFilter = null">
          Clear filter
        </button>
      </div>

      <div class="tags">
        <span
          v-for="filter in filters"
          :key="filter"
          :class="`tag is-clickable ${currentFilter === filter ? 'is-black' : ''}`"
          @click="currentFilter = currentFilter === filter ? null : filter"
        >
          {{ filter }}
        </span>
      </div>

      <div class="table-container">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th></th>
              <th>Category</th>
              <th class="is-clickable" @click="sortBy === 'price' ? sortDesc = !sortDesc : sortBy = 'price'">
                Price
                <span v-if="sortBy === 'price'" class="icon">
                  <i :class="`fa-solid fa-chevron-${sortDesc ? 'up' : 'down'}`"></i>
                </span>
              </th>
              <th class="is-clickable" @click="sortBy === 'aeroplanPoints' ? sortDesc = !sortDesc : sortBy = 'aeroplanPoints'">
                Aeroplan points
                <span v-if="sortBy === 'aeroplanPoints'" class="icon">
                  <i :class="`fa-solid fa-chevron-${sortDesc ? 'up' : 'down'}`"></i>
                </span>
              </th>
              <th class="is-clickable" @click="sortBy === 'pointsPerDollar' ? sortDesc = !sortDesc : sortBy = 'pointsPerDollar'">
                Points/$
                <span v-if="sortBy === 'pointsPerDollar'" class="icon">
                  <i :class="`fa-solid fa-chevron-${sortDesc ? 'up' : 'down'}`"></i>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sortedProducts" :key="product.id">
              <td>
                <div class="is-flex">
                  <figure class="image is-96x96">
                    <img :src="product.image" />
                  </figure>
                  <div>
                    <h2 class="subtitle">{{ product.title }}</h2>
                    <a :href="product.url" target="_blank">View LCBO product</a>
                  </div>
                </div>
              </td>
              <td>
                <div class="tags">
                  <span
                    v-for="filter in product.categories"
                    :key="filter"
                    class="tag is-clickable"
                    @click="currentFilter = filter"
                  >
                    {{ filter }}
                  </span>
                </div>

              </td>
              <td>
                ${{ product.price }}
              </td>
              <td style="white-space: nowrap;">
                {{ product.points }}
                <p>valid until {{ formatDate(product.endDate) }}</p>
              </td>
              <td>
                {{ Math.round(product.points / product.price * 100) / 100 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style>
/* body, #__nuxt {
  min-height: 100vh;
  -webkit-text-size-adjust: 100%;
  font-variant-ligatures: none;
  -webkit-font-variant-ligatures: none;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  font-family: Archivo Variable, sans-serif !important;
  font-size: 18px;
  overflow: hidden;
} */

th {
  white-space: nowrap;
}

/* .tags {
  flex-wrap: nowrap;
  overflow: scroll;
} */
</style>